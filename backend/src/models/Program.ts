import { Schema, model, InferSchemaType } from "mongoose";

/**
 * Off-chain metadata for an aid program. The on-chain contract only stores
 * a `metadataUri` reference (this document's id) plus the numbers required
 * for enforcement. Everything descriptive and human-facing lives here.
 */
const programSchema = new Schema(
  {
    onChainId: { type: Number, required: true, unique: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    region: { type: String, required: true },
    disasterType: {
      type: String,
      enum: ["flood", "drought", "earthquake", "conflict", "epidemic", "cyclone", "other"],
      required: true,
    },
    tokenSymbol: { type: String, default: "XLM" },
    coverImageUrl: { type: String, default: "" },
    eligibilityCriteria: { type: [String], default: [] },
    contractAddress: { type: String, required: true },
    txHash: { type: String, default: "" },
  },
  { timestamps: true },
);

export type Program = InferSchemaType<typeof programSchema>;
export const ProgramModel = model("Program", programSchema);
