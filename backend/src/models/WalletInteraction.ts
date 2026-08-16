import { Schema, model, InferSchemaType } from "mongoose";

/**
 * Every meaningful wallet interaction (connect, claim, feedback submit) is
 * logged here with the tx hash where applicable. This is the audit trail
 * used to demonstrate real user onboarding for the submission checklist —
 * it complements, not replaces, the on-chain claim receipts.
 */
const walletInteractionSchema = new Schema(
  {
    stellarWallet: { type: String, required: true, index: true },
    action: {
      type: String,
      enum: ["wallet_connect", "beneficiary_registered", "claim_submitted", "feedback_submitted"],
      required: true,
    },
    programOnChainId: { type: Number },
    txHash: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export type WalletInteraction = InferSchemaType<typeof walletInteractionSchema>;
export const WalletInteractionModel = model("WalletInteraction", walletInteractionSchema);
