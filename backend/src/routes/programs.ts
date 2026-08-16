import { Router } from "express";
import { z } from "zod";
import { ProgramModel } from "../models/Program.js";
import { requireOrgAuth, AuthedRequest } from "../middleware/auth.js";
import { ApiError } from "../middleware/errorHandler.js";
import { track } from "../config/analytics.js";

export const programsRouter = Router();

const createProgramSchema = z.object({
  onChainId: z.number().int().positive(),
  title: z.string().min(3),
  summary: z.string().min(10),
  region: z.string().min(2),
  disasterType: z.enum(["flood", "drought", "earthquake", "conflict", "epidemic", "cyclone", "other"]),
  tokenSymbol: z.string().default("XLM"),
  coverImageUrl: z.string().url().optional(),
  eligibilityCriteria: z.array(z.string()).default([]),
  contractAddress: z.string().min(10),
  txHash: z.string().optional(),
});

// Org registers off-chain metadata after successfully calling create_program
// on-chain. onChainId + txHash tie the two records together for audit.
programsRouter.post("/", requireOrgAuth, async (req: AuthedRequest, res, next) => {
  try {
    const body = createProgramSchema.parse(req.body);
    const existing = await ProgramModel.findOne({ onChainId: body.onChainId });
    if (existing) throw new ApiError(409, "Program with this on-chain id already registered");

    const program = await ProgramModel.create({ ...body, orgId: req.org!.id });
    track(req.org!.id, "program_created", { onChainId: body.onChainId, region: body.region });
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
});

programsRouter.get("/", async (_req, res, next) => {
  try {
    const programs = await ProgramModel.find().sort({ createdAt: -1 }).populate("orgId", "name verified");
    res.json(programs);
  } catch (err) {
    next(err);
  }
});

programsRouter.get("/mine", requireOrgAuth, async (req: AuthedRequest, res, next) => {
  try {
    const programs = await ProgramModel.find({ orgId: req.org!.id }).sort({ createdAt: -1 });
    res.json(programs);
  } catch (err) {
    next(err);
  }
});

programsRouter.get("/:onChainId", async (req, res, next) => {
  try {
    const onChainId = Number(req.params.onChainId);
    const program = await ProgramModel.findOne({ onChainId }).populate("orgId", "name verified website");
    if (!program) throw new ApiError(404, "Program not found");
    res.json(program);
  } catch (err) {
    next(err);
  }
});
