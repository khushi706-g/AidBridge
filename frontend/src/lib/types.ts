export type ProgramStatus = "Draft" | "Funded" | "Active" | "Paused" | "Closed";

export type DisasterType =
  | "flood"
  | "drought"
  | "earthquake"
  | "conflict"
  | "epidemic"
  | "cyclone"
  | "other";

export interface OnChainProgram {
  id: number;
  org: string;
  metadata_uri: string;
  token: string;
  allocation_amount: string;
  funded_amount: string;
  distributed_amount: string;
  claim_start: number;
  claim_end: number;
  max_claims_per_beneficiary: number;
  status: ProgramStatus;
  beneficiary_count: number;
  created_at: number;
}

export interface ProgramMeta {
  _id: string;
  onChainId: number;
  orgId: { _id: string; name: string; verified: boolean; website?: string } | string;
  title: string;
  summary: string;
  region: string;
  disasterType: DisasterType;
  tokenSymbol: string;
  coverImageUrl: string;
  eligibilityCriteria: string[];
  contractAddress: string;
  txHash: string;
  createdAt: string;
}

export interface BeneficiaryRecord {
  _id: string;
  programOnChainId: number;
  stellarWallet: string;
  fullName: string;
  contactPhone: string;
  householdSize: number;
  supportingDocUrls: string[];
  verificationStatus: "pending" | "approved" | "rejected";
  reviewNotes: string;
  addedOnChainAt?: string;
  createdAt: string;
}

export interface OrgSession {
  token: string;
  org: { id: string; name: string; email: string; stellarPublicKey: string };
}

export interface InteractionSummary {
  uniqueWallets: number;
  totalInteractions: number;
  byAction: Record<string, number>;
}
