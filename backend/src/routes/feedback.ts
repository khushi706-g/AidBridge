import { Router } from "express";
import { z } from "zod";
import { FeedbackModel } from "../models/Feedback.js";
import { WalletInteractionModel } from "../models/WalletInteraction.js";
import { track } from "../config/analytics.js";

export const feedbackRouter = Router();

const feedbackSchema = z.object({
  stellarWallet: z.string().startsWith("G").length(56),
  role: z.enum(["beneficiary", "org", "donor", "visitor"]),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  programOnChainId: z.number().int().positive().optional(),
});

feedbackRouter.post("/", async (req, res, next) => {
  try {
    const body = feedbackSchema.parse(req.body);
    const feedback = await FeedbackModel.create(body);

    await WalletInteractionModel.create({
      stellarWallet: body.stellarWallet,
      action: "feedback_submitted",
      programOnChainId: body.programOnChainId,
    });

    track(body.stellarWallet, "feedback_submitted", { rating: body.rating, role: body.role });
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
});

feedbackRouter.get("/summary", async (_req, res, next) => {
  try {
    const feedback = await FeedbackModel.find().sort({ createdAt: -1 }).limit(50);
    const avgRating =
      feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;
    res.json({ count: feedback.length, averageRating: Number(avgRating.toFixed(2)), recent: feedback });
  } catch (err) {
    next(err);
  }
});
