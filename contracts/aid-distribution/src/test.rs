#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{StellarAssetClient, TokenClient},
    Address, Env, String,
};

fn create_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let contract_address = env.register_stellar_asset_contract_v2(admin.clone());
    let contract_address = contract_address.address();
    (
        TokenClient::new(env, &contract_address),
        StellarAssetClient::new(env, &contract_address),
    )
}

struct TestCtx {
    env: Env,
    contract_id: Address,
    admin: Address,
    org: Address,
    token: TokenClient<'static>,
    token_admin: StellarAssetClient<'static>,
}

fn setup() -> TestCtx {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1_000_000);

    let admin = Address::generate(&env);
    let org = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token(&env, &token_admin);

    let contract_id = env.register(AidDistributionContract, ());
    let client = AidDistributionContractClient::new(&env, &contract_id);
    client.initialize(&admin);
    client.authorize_org(&org);

    TestCtx {
        env,
        contract_id,
        admin,
        org,
        token,
        token_admin: token_admin_client,
    }
}

fn client<'a>(ctx: &'a TestCtx) -> AidDistributionContractClient<'a> {
    AidDistributionContractClient::new(&ctx.env, &ctx.contract_id)
}

#[test]
fn test_full_lifecycle_happy_path() {
    let ctx = setup();
    let c = client(&ctx);

    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://flood-relief-2026"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    assert_eq!(program_id, 1);

    c.fund_program(&ctx.org, &program_id, &5_000);
    assert_eq!(ctx.token.balance(&ctx.contract_id), 5_000);

    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);

    let receipt_idx = c.claim(&beneficiary, &program_id, &1_000);
    assert_eq!(receipt_idx, 1);
    assert_eq!(ctx.token.balance(&beneficiary), 1_000);

    let record = c.get_beneficiary(&program_id, &beneficiary);
    assert_eq!(record.claimed_amount, 1_000);
    assert_eq!(record.claims_made, 1);

    let program = c.get_program(&program_id);
    assert_eq!(program.distributed_amount, 1_000);
}

#[test]
fn test_duplicate_claim_rejected() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);

    c.claim(&beneficiary, &program_id, &1_000);
    let result = c.try_claim(&beneficiary, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::ClaimLimitReached)));
}

#[test]
fn test_cannot_exceed_allocation_across_multiple_claims() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &3, // allow up to 3 claim transactions
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);

    c.claim(&beneficiary, &program_id, &600);
    let result = c.try_claim(&beneficiary, &program_id, &600); // 600+600 > 1000
    assert_eq!(result, Err(Ok(AidError::AllocationExceeded)));

    // Exactly filling the remainder is fine.
    c.claim(&beneficiary, &program_id, &400);
    let record = c.get_beneficiary(&program_id, &beneficiary);
    assert_eq!(record.claimed_amount, 1_000);
}

#[test]
fn test_ineligible_wallet_cannot_claim() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let stranger = Address::generate(&ctx.env);
    let result = c.try_claim(&stranger, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::BeneficiaryNotFound)));
}

#[test]
fn test_revoked_beneficiary_cannot_claim() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);
    c.revoke_beneficiary(&ctx.org, &program_id, &beneficiary);

    let result = c.try_claim(&beneficiary, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::BeneficiaryNotEligible)));
}

#[test]
fn test_claim_outside_window_rejected() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);

    ctx.env.ledger().set_timestamp(500_000); // before claim_start
    let result = c.try_claim(&beneficiary, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::ClaimWindowNotOpen)));

    ctx.env.ledger().set_timestamp(3_000_000); // after claim_end
    let result = c.try_claim(&beneficiary, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::ClaimWindowClosed)));
}

#[test]
fn test_claim_rejected_when_program_paused() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);

    c.pause_program(&ctx.org, &program_id);
    let result = c.try_claim(&beneficiary, &program_id, &1_000);
    assert_eq!(result, Err(Ok(AidError::ProgramNotActive)));

    c.resume_program(&ctx.org, &program_id);
    c.claim(&beneficiary, &program_id, &1_000); // now succeeds
}

#[test]
fn test_claim_fails_when_program_funds_exhausted() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &1_500); // less than 2 allocations
    c.activate_program(&ctx.org, &program_id);

    let b1 = Address::generate(&ctx.env);
    let b2 = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &b1);
    c.add_beneficiary(&ctx.org, &program_id, &b2);

    c.claim(&b1, &program_id, &1_000);
    let result = c.try_claim(&b2, &program_id, &1_000); // only 500 left
    assert_eq!(result, Err(Ok(AidError::ProgramFundsExhausted)));
}

#[test]
fn test_unauthorized_org_cannot_create_program() {
    let ctx = setup();
    let c = client(&ctx);
    let rogue = Address::generate(&ctx.env);

    let result = c.try_create_program(
        &rogue,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    assert_eq!(result, Err(Ok(AidError::NotAuthorizedOrg)));
}

#[test]
fn test_org_cannot_manage_another_orgs_program() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );

    let other_org = Address::generate(&ctx.env);
    c.authorize_org(&other_org);

    let result = c.try_fund_program(&other_org, &program_id, &500);
    assert_eq!(result, Err(Ok(AidError::NotAuthorizedOrg)));
}

#[test]
fn test_withdraw_remaining_after_close() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );
    c.fund_program(&ctx.org, &program_id, &5_000);
    c.activate_program(&ctx.org, &program_id);

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);
    c.claim(&beneficiary, &program_id, &1_000);

    c.close_program(&ctx.org, &program_id);
    let withdrawn = c.withdraw_remaining(&ctx.org, &program_id);
    assert_eq!(withdrawn, 4_000);
}

#[test]
fn test_double_add_beneficiary_rejected() {
    let ctx = setup();
    let c = client(&ctx);
    ctx.token_admin.mint(&ctx.org, &10_000);

    let program_id = c.create_program(
        &ctx.org,
        &String::from_str(&ctx.env, "ipfs://x"),
        &ctx.token.address,
        &1_000,
        &1_000_000,
        &2_000_000,
        &1,
    );

    let beneficiary = Address::generate(&ctx.env);
    c.add_beneficiary(&ctx.org, &program_id, &beneficiary);
    let result = c.try_add_beneficiary(&ctx.org, &program_id, &beneficiary);
    assert_eq!(result, Err(Ok(AidError::BeneficiaryAlreadyAdded)));
}
