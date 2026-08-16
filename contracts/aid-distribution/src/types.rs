use soroban_sdk::{contracttype, Address, String};

/// Lifecycle phase of an aid program, set explicitly by the issuing org.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProgramStatus {
    Draft,
    Funded,
    Active,
    Paused,
    Closed,
}

/// A humanitarian aid program created and funded by an authorized organization.
#[contracttype]
#[derive(Clone, Debug)]
pub struct AidProgram {
    pub id: u64,
    pub org: Address,
    /// Off-chain reference (IPFS/db id) to program name, description, docs.
    pub metadata_uri: String,
    pub token: Address,
    /// Per-beneficiary allocation cap, in the token's smallest unit.
    pub allocation_amount: i128,
    /// Total amount deposited into escrow for this program.
    pub funded_amount: i128,
    /// Total amount claimed by beneficiaries so far.
    pub distributed_amount: i128,
    /// Unix timestamp when claims open.
    pub claim_start: u64,
    /// Unix timestamp when claims close.
    pub claim_end: u64,
    /// Max number of separate claim transactions per beneficiary (usually 1,
    /// but phased/tranche programs may allow more, each capped by
    /// allocation_amount in total).
    pub max_claims_per_beneficiary: u32,
    pub status: ProgramStatus,
    pub beneficiary_count: u32,
    pub created_at: u64,
}

/// Per-beneficiary eligibility + claim record for a given program.
#[contracttype]
#[derive(Clone, Debug)]
pub struct BeneficiaryRecord {
    pub program_id: u64,
    pub wallet: Address,
    /// Whether an authorized verifier has approved this wallet for the program.
    pub eligible: bool,
    /// Total amount already claimed by this beneficiary in this program.
    pub claimed_amount: i128,
    pub claims_made: u32,
    pub last_claim_at: u64,
}

/// Immutable record of a single successful distribution, for on-chain audit.
#[contracttype]
#[derive(Clone, Debug)]
pub struct ClaimReceipt {
    pub program_id: u64,
    pub wallet: Address,
    pub amount: i128,
    pub claim_index: u32,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    /// Set of org addresses authorized to create aid programs.
    Org(Address),
    ProgramCount,
    Program(u64),
    Beneficiary(u64, Address),
    /// Sequential receipt id counter, per program.
    ReceiptCount(u64),
    Receipt(u64, u32),
}
