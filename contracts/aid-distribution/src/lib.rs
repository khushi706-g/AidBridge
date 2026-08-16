#![no_std]

mod errors;
mod types;

#[cfg(test)]
mod test;

use errors::AidError;
use soroban_sdk::{contract, contractimpl, token, Address, Env, String, Symbol};
use types::{AidProgram, BeneficiaryRecord, ClaimReceipt, DataKey, ProgramStatus};

const DAY_IN_LEDGERS: u32 = 17280; // ~5s/ledger
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;
const PERSISTENT_BUMP_AMOUNT: u32 = 90 * DAY_IN_LEDGERS;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = PERSISTENT_BUMP_AMOUNT - DAY_IN_LEDGERS;

fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

fn bump_persistent(env: &Env, key: &DataKey) {
    env.storage().persistent().extend_ttl(
        key,
        PERSISTENT_LIFETIME_THRESHOLD,
        PERSISTENT_BUMP_AMOUNT,
    );
}

#[contract]
pub struct AidDistributionContract;

#[contractimpl]
impl AidDistributionContract {
    /// One-time setup. `admin` is the platform admin who can authorize
    /// organizations to create aid programs.
    pub fn initialize(env: Env, admin: Address) -> Result<(), AidError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(AidError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ProgramCount, &0u64);
        bump_instance(&env);
        Ok(())
    }

    /// Admin authorizes an organization address to create and fund aid programs.
    pub fn authorize_org(env: Env, org: Address) -> Result<(), AidError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(AidError::NotAuthorizedAdmin)?;
        admin.require_auth();

        let key = DataKey::Org(org.clone());
        if env.storage().persistent().has(&key) {
            return Err(AidError::OrgAlreadyAuthorized);
        }
        env.storage().persistent().set(&key, &true);
        bump_persistent(&env, &key);
        bump_instance(&env);

        env.events()
            .publish((Symbol::new(&env, "org_authorized"),), org);
        Ok(())
    }

    /// Admin revokes an organization's authorization to create new programs.
    /// Existing programs the org already created are unaffected.
    pub fn revoke_org(env: Env, org: Address) -> Result<(), AidError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(AidError::NotAuthorizedAdmin)?;
        admin.require_auth();

        let key = DataKey::Org(org.clone());
        if !env.storage().persistent().has(&key) {
            return Err(AidError::OrgNotFound);
        }
        env.storage().persistent().remove(&key);
        env.events()
            .publish((Symbol::new(&env, "org_revoked"),), org);
        Ok(())
    }

    /// Create a new aid program in Draft status. Must be funded before it can
    /// become Active.
    pub fn create_program(
        env: Env,
        org: Address,
        metadata_uri: String,
        token: Address,
        allocation_amount: i128,
        claim_start: u64,
        claim_end: u64,
        max_claims_per_beneficiary: u32,
    ) -> Result<u64, AidError> {
        org.require_auth();

        let org_key = DataKey::Org(org.clone());
        if !env.storage().persistent().has(&org_key) {
            return Err(AidError::NotAuthorizedOrg);
        }

        if allocation_amount <= 0 {
            return Err(AidError::InvalidAllocation);
        }
        if claim_end <= claim_start {
            return Err(AidError::InvalidClaimWindow);
        }
        if max_claims_per_beneficiary == 0 {
            return Err(AidError::InvalidMaxClaims);
        }

        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::ProgramCount)
            .unwrap_or(0);
        let id = count + 1;

        let program = AidProgram {
            id,
            org: org.clone(),
            metadata_uri,
            token,
            allocation_amount,
            funded_amount: 0,
            distributed_amount: 0,
            claim_start,
            claim_end,
            max_claims_per_beneficiary,
            status: ProgramStatus::Draft,
            beneficiary_count: 0,
            created_at: env.ledger().timestamp(),
        };

        let prog_key = DataKey::Program(id);
        env.storage().persistent().set(&prog_key, &program);
        bump_persistent(&env, &prog_key);
        env.storage().instance().set(&DataKey::ProgramCount, &id);
        bump_instance(&env);

        env.events()
            .publish((Symbol::new(&env, "program_created"), id), org);
        Ok(id)
    }

    /// Org deposits program funds from its own token balance into the
    /// contract's custody. Moves Draft -> Funded once amount > 0.
    pub fn fund_program(env: Env, org: Address, program_id: u64, amount: i128) -> Result<(), AidError> {
        org.require_auth();
        if amount <= 0 {
            return Err(AidError::ZeroAmount);
        }

        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;

        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        if program.status != ProgramStatus::Draft && program.status != ProgramStatus::Funded {
            return Err(AidError::ProgramNotDraft);
        }

        let token_client = token::Client::new(&env, &program.token);
        token_client.transfer(&org, &env.current_contract_address(), &amount);

        program.funded_amount += amount;
        program.status = ProgramStatus::Funded;
        env.storage().persistent().set(&prog_key, &program);
        bump_persistent(&env, &prog_key);

        env.events().publish(
            (Symbol::new(&env, "program_funded"), program_id),
            amount,
        );
        Ok(())
    }

    /// Org activates a funded program, opening it for beneficiary
    /// verification and claims (subject to the claim window).
    pub fn activate_program(env: Env, org: Address, program_id: u64) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;

        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        if program.status != ProgramStatus::Funded {
            return Err(AidError::ProgramNotFunded);
        }

        program.status = ProgramStatus::Active;
        env.storage().persistent().set(&prog_key, &program);
        bump_persistent(&env, &prog_key);

        env.events()
            .publish((Symbol::new(&env, "program_activated"), program_id), ());
        Ok(())
    }

    /// Org pauses an active program (e.g. suspected fraud, pending review).
    /// Paused programs reject claims until reactivated.
    pub fn pause_program(env: Env, org: Address, program_id: u64) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        if program.status != ProgramStatus::Active {
            return Err(AidError::ProgramNotActive);
        }
        program.status = ProgramStatus::Paused;
        env.storage().persistent().set(&prog_key, &program);
        env.events()
            .publish((Symbol::new(&env, "program_paused"), program_id), ());
        Ok(())
    }

    /// Org resumes a paused program.
    pub fn resume_program(env: Env, org: Address, program_id: u64) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        if program.status != ProgramStatus::Paused {
            return Err(AidError::ProgramNotActive);
        }
        program.status = ProgramStatus::Active;
        env.storage().persistent().set(&prog_key, &program);
        env.events()
            .publish((Symbol::new(&env, "program_resumed"), program_id), ());
        Ok(())
    }

    /// Org closes a program permanently (claim window over, funds settled).
    pub fn close_program(env: Env, org: Address, program_id: u64) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        program.status = ProgramStatus::Closed;
        env.storage().persistent().set(&prog_key, &program);
        env.events()
            .publish((Symbol::new(&env, "program_closed"), program_id), ());
        Ok(())
    }

    /// Org withdraws any remaining unclaimed funds after a program is closed.
    pub fn withdraw_remaining(env: Env, org: Address, program_id: u64) -> Result<i128, AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }
        if program.status != ProgramStatus::Closed {
            return Err(AidError::ProgramNotActive);
        }

        let remaining = program.funded_amount - program.distributed_amount;
        if remaining <= 0 {
            return Ok(0);
        }

        let token_client = token::Client::new(&env, &program.token);
        token_client.transfer(&env.current_contract_address(), &org, &remaining);

        program.funded_amount -= remaining;
        env.storage().persistent().set(&prog_key, &program);

        env.events().publish(
            (Symbol::new(&env, "funds_withdrawn"), program_id),
            remaining,
        );
        Ok(remaining)
    }

    /// Org (or its verifier flow) marks a wallet as eligible for a program.
    /// Sensitive identity/eligibility documents live off-chain; this call
    /// only records the verification outcome.
    pub fn add_beneficiary(
        env: Env,
        org: Address,
        program_id: u64,
        wallet: Address,
    ) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }

        let ben_key = DataKey::Beneficiary(program_id, wallet.clone());
        if env.storage().persistent().has(&ben_key) {
            return Err(AidError::BeneficiaryAlreadyAdded);
        }

        let record = BeneficiaryRecord {
            program_id,
            wallet: wallet.clone(),
            eligible: true,
            claimed_amount: 0,
            claims_made: 0,
            last_claim_at: 0,
        };
        env.storage().persistent().set(&ben_key, &record);
        bump_persistent(&env, &ben_key);

        program.beneficiary_count += 1;
        env.storage().persistent().set(&prog_key, &program);

        env.events().publish(
            (Symbol::new(&env, "beneficiary_added"), program_id),
            wallet,
        );
        Ok(())
    }

    /// Org revokes a beneficiary's eligibility (e.g. duplicate registration
    /// discovered off-chain, fraud flag). Past claims are untouched.
    pub fn revoke_beneficiary(
        env: Env,
        org: Address,
        program_id: u64,
        wallet: Address,
    ) -> Result<(), AidError> {
        org.require_auth();
        let prog_key = DataKey::Program(program_id);
        let program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;
        if program.org != org {
            return Err(AidError::NotAuthorizedOrg);
        }

        let ben_key = DataKey::Beneficiary(program_id, wallet.clone());
        let mut record: BeneficiaryRecord = env
            .storage()
            .persistent()
            .get(&ben_key)
            .ok_or(AidError::BeneficiaryNotFound)?;
        record.eligible = false;
        env.storage().persistent().set(&ben_key, &record);

        env.events().publish(
            (Symbol::new(&env, "beneficiary_revoked"), program_id),
            wallet,
        );
        Ok(())
    }

    /// Beneficiary claims their aid directly. Enforces: program is Active,
    /// claim window is open, wallet is eligible, per-claim-count limit,
    /// total allocation cap, and available program funds. Every check is
    /// evaluated on-chain so no party can bypass program rules.
    pub fn claim(env: Env, wallet: Address, program_id: u64, amount: i128) -> Result<u32, AidError> {
        wallet.require_auth();

        if amount <= 0 {
            return Err(AidError::ZeroAmount);
        }

        let prog_key = DataKey::Program(program_id);
        let mut program: AidProgram = env
            .storage()
            .persistent()
            .get(&prog_key)
            .ok_or(AidError::ProgramNotFound)?;

        if program.status != ProgramStatus::Active {
            return Err(AidError::ProgramNotActive);
        }

        let now = env.ledger().timestamp();
        if now < program.claim_start {
            return Err(AidError::ClaimWindowNotOpen);
        }
        if now > program.claim_end {
            return Err(AidError::ClaimWindowClosed);
        }

        let ben_key = DataKey::Beneficiary(program_id, wallet.clone());
        let mut record: BeneficiaryRecord = env
            .storage()
            .persistent()
            .get(&ben_key)
            .ok_or(AidError::BeneficiaryNotFound)?;

        if !record.eligible {
            return Err(AidError::BeneficiaryNotEligible);
        }
        if record.claims_made >= program.max_claims_per_beneficiary {
            return Err(AidError::ClaimLimitReached);
        }
        if record.claimed_amount + amount > program.allocation_amount {
            return Err(AidError::AllocationExceeded);
        }
        let remaining_program_funds = program.funded_amount - program.distributed_amount;
        if amount > remaining_program_funds {
            return Err(AidError::ProgramFundsExhausted);
        }

        // Effects before external call (checks-effects-interactions).
        record.claimed_amount += amount;
        record.claims_made += 1;
        record.last_claim_at = now;
        env.storage().persistent().set(&ben_key, &record);

        program.distributed_amount += amount;
        env.storage().persistent().set(&prog_key, &program);

        let receipt_count_key = DataKey::ReceiptCount(program_id);
        let receipt_index: u32 = env
            .storage()
            .persistent()
            .get(&receipt_count_key)
            .unwrap_or(0);
        let new_index = receipt_index + 1;
        env.storage()
            .persistent()
            .set(&receipt_count_key, &new_index);

        let receipt = ClaimReceipt {
            program_id,
            wallet: wallet.clone(),
            amount,
            claim_index: new_index,
            timestamp: now,
        };
        let receipt_key = DataKey::Receipt(program_id, new_index);
        env.storage().persistent().set(&receipt_key, &receipt);
        bump_persistent(&env, &receipt_key);

        // Interaction: pay out from contract custody to beneficiary wallet.
        let token_client = token::Client::new(&env, &program.token);
        token_client.transfer(&env.current_contract_address(), &wallet, &amount);

        env.events().publish(
            (Symbol::new(&env, "claim_settled"), program_id),
            (wallet, amount, new_index),
        );

        Ok(new_index)
    }

    // ---- Read-only views ----

    pub fn get_program(env: Env, program_id: u64) -> Result<AidProgram, AidError> {
        env.storage()
            .persistent()
            .get(&DataKey::Program(program_id))
            .ok_or(AidError::ProgramNotFound)
    }

    pub fn get_beneficiary(
        env: Env,
        program_id: u64,
        wallet: Address,
    ) -> Result<BeneficiaryRecord, AidError> {
        env.storage()
            .persistent()
            .get(&DataKey::Beneficiary(program_id, wallet))
            .ok_or(AidError::BeneficiaryNotFound)
    }

    pub fn get_receipt(env: Env, program_id: u64, claim_index: u32) -> Result<ClaimReceipt, AidError> {
        env.storage()
            .persistent()
            .get(&DataKey::Receipt(program_id, claim_index))
            .ok_or(AidError::ProgramNotFound)
    }

    pub fn get_receipt_count(env: Env, program_id: u64) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::ReceiptCount(program_id))
            .unwrap_or(0)
    }

    pub fn program_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::ProgramCount)
            .unwrap_or(0)
    }

    pub fn is_org_authorized(env: Env, org: Address) -> bool {
        env.storage().persistent().has(&DataKey::Org(org))
    }

    pub fn get_admin(env: Env) -> Result<Address, AidError> {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(AidError::NotAuthorizedAdmin)
    }
}
