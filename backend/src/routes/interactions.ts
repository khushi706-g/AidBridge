import { Router } from "express";
import { z } from "zod";
import { WalletInteractionModel } from "../models/WalletInteraction.js";
import { track } from "../config/analytics.js";

export const interactionsRouter = Router();

const logSchema = z.object({
  stellarWallet: z.string().startsWith("G").length(56),
  action: z.enum(["wallet_connect", "beneficiary_registered", "claim_submitted", "feedback_submitted"]),
  programOnChainId: z.number().int().positive().optional(),
  txHash: z.string().optional(),
});

// Frontend calls this after any real wallet interaction (Freighter connect,
// claim tx confirmation, etc.) so the platform has an auditable log to
// evidence real user onboarding, independent of chain indexing lag.
interactionsRouter.post("/", async (req, res, next) => {
  try {
    const body = logSchema.parse(req.body);
    const record = await WalletInteractionModel.create({
      ...body,
      userAgent: req.headers["user-agent"] ?? "",
    });
    track(body.stellarWallet, body.action, {
      programOnChainId: body.programOnChainId,
      txHash: body.txHash,
    });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// Summary used by the admin/analytics dashboard to show unique wallets,
// total interactions, and action breakdown — the evidence for the "10+ real
// users" submission requirement.
interactionsRouter.get("/summary", async (_req, res, next) => {
  try {
    const [uniqueWallets, totalInteractions, byAction] = await Promise.all([
      WalletInteractionModel.distinct("stellarWallet"),
      WalletInteractionModel.countDocuments(),
      WalletInteractionModel.aggregate([{ $group: { _id: "$action", count: { $sum: 1 } } }]),
    ]);
    res.json({
      uniqueWallets: uniqueWallets.length,
      totalInteractions,
      byAction: Object.fromEntries(byAction.map((a) => [a._id, a.count])),
    });
  } catch (err) {
    next(err);
  }
});
