import { Schema, model, InferSchemaType } from "mongoose";

/**
 * Sensitive beneficiary identity + supporting documents. This NEVER touches
 * the chain — only the wallet address and a boolean eligibility flag are
 * pushed to the Soroban contract once `verificationStatus` is "approved".
 */
const beneficiarySchema = new Schema(
  {
    programOnChainId: { type: Number, required: true, index: true },
    stellarWallet: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    contactPhone: { type: String, default: "" },
    householdSize: { type: Number, default: 1 },
    supportingDocUrls: { type: [String], default: [] },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "Organization" },
    reviewNotes: { type: String, default: "" },
    addedOnChainAt: { type: Date },
  },
  { timestamps: true },
);

beneficiarySchema.index({ programOnChainId: 1, stellarWallet: 1 }, { unique: true });

export type Beneficiary = InferSchemaType<typeof beneficiarySchema>;
export const BeneficiaryModel = model("Beneficiary", beneficiarySchema);
