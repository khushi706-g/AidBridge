import { Schema, model, InferSchemaType } from "mongoose";

const orgSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    stellarPublicKey: { type: String, required: true, index: true },
    verified: { type: Boolean, default: false },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true },
);

export type Organization = InferSchemaType<typeof orgSchema>;
export const OrganizationModel = model("Organization", orgSchema);
