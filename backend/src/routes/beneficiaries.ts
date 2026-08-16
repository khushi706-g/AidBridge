import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { z } from "zod";
import { BeneficiaryModel } from "../models/Beneficiary.js";
import { WalletInteractionModel } from "../models/WalletInteraction.js";
import { requireOrgAuth, AuthedRequest } from "../middleware/auth.js";
import { ApiError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";
import { track } from "../config/analytics.js";

export const beneficiariesRouter = Router();

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: env.UPLOAD_DIR,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
});

const registerSchema = z.object({
  programOnChainId: z.coerce.number().int().positive(),
  stellarWallet: z.string().startsWith("G").length(56),
  fullName: z.string().min(2),
  contactPhone: z.string().optional(),
  householdSize: z.coerce.number().int().min(1).default(1),
});

// Beneficiary self-registers with off-chain identity info + optional docs.
// This does NOT touch the chain — an org must separately review and call
// add_beneficiary on-chain once approved.
beneficiariesRouter.post("/", upload.array("documents", 5), async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const supportingDocUrls = files.map((f) => `/uploads/${path.basename(f.path)}`);

    const beneficiary = await BeneficiaryModel.findOneAndUpdate(
      { programOnChainId: body.programOnChainId, stellarWallet: body.stellarWallet },
      { ...body, supportingDocUrls, verificationStatus: "pending" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await WalletInteractionModel.create({
      stellarWallet: body.stellarWallet,
      action: "beneficiary_registered",
      programOnChainId: body.programOnChainId,
      userAgent: req.headers["user-agent"] ?? "",
    });

    track(body.stellarWallet, "beneficiary_registered", { programOnChainId: body.programOnChainId });
    res.status(201).json(beneficiary);
  } catch (err) {
    next(err);
  }
});

beneficiariesRouter.get("/program/:onChainId", requireOrgAuth, async (req: AuthedRequest, res, next) => {
  try {
    const onChainId = Number(req.params.onChainId);
    const status = req.query.status as string | undefined;
    const filter: Record<string, unknown> = { programOnChainId: onChainId };
    if (status) filter.verificationStatus = status;
    const beneficiaries = await BeneficiaryModel.find(filter).sort({ createdAt: -1 });
    res.json(beneficiaries);
  } catch (err) {
    next(err);
  }
});

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  notes: z.string().optional(),
});

// Org marks a beneficiary reviewed. The frontend then triggers the actual
// add_beneficiary on-chain call (Freighter-signed) and reports back the tx
// hash via PATCH /:id/confirm-onchain.
beneficiariesRouter.patch("/:id/review", requireOrgAuth, async (req: AuthedRequest, res, next) => {
  try {
    const body = reviewSchema.parse(req.body);
    const beneficiary = await BeneficiaryModel.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: body.status, reviewNotes: body.notes ?? "", reviewedBy: req.org!.id },
      { new: true },
    );
    if (!beneficiary) throw new ApiError(404, "Beneficiary record not found");
    res.json(beneficiary);
  } catch (err) {
    next(err);
  }
});

beneficiariesRouter.patch("/:id/confirm-onchain", requireOrgAuth, async (req, res, next) => {
  try {
    const beneficiary = await BeneficiaryModel.findByIdAndUpdate(
      req.params.id,
      { addedOnChainAt: new Date() },
      { new: true },
    );
    if (!beneficiary) throw new ApiError(404, "Beneficiary record not found");
    res.json(beneficiary);
  } catch (err) {
    next(err);
  }
});
