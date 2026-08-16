import { Schema, model, InferSchemaType } from "mongoose";

const feedbackSchema = new Schema(
  {
    stellarWallet: { type: String, required: true, index: true },
    role: { type: String, enum: ["beneficiary", "org", "donor", "visitor"], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "", maxlength: 1000 },
    programOnChainId: { type: Number },
  },
  { timestamps: true },
);

export type Feedback = InferSchemaType<typeof feedbackSchema>;
export const FeedbackModel = model("Feedback", feedbackSchema);
