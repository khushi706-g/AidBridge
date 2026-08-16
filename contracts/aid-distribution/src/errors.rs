use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AidError {
    NotAuthorizedAdmin = 1,
    NotAuthorizedOrg = 2,
    OrgAlreadyAuthorized = 3,
    OrgNotFound = 4,
    ProgramNotFound = 5,
    InvalidAllocation = 6,
    InvalidClaimWindow = 7,
    InvalidMaxClaims = 8,
    ProgramNotDraft = 9,
    ProgramNotFunded = 10,
    ProgramNotActive = 11,
    AlreadyFunded = 12,
    InsufficientFundingAmount = 13,
    BeneficiaryAlreadyAdded = 14,
    BeneficiaryNotFound = 15,
    BeneficiaryNotEligible = 16,
    ClaimWindowNotOpen = 17,
    ClaimWindowClosed = 18,
    ClaimLimitReached = 19,
    AllocationExceeded = 20,
    ProgramFundsExhausted = 21,
    ZeroAmount = 22,
    AlreadyInitialized = 23,
}
