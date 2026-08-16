import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { OrganizationModel } from "../models/Organization.js";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";
import { track } from "../config/analytics.js";

export const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  stellarPublicKey: z.string().startsWith("G").length(56),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

authRouter.post("/signup", async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const existing = await OrganizationModel.findOne({ email: body.email });
    if (existing) throw new ApiError(409, "An organization with this email already exists");

    const passwordHash = await bcrypt.hash(body.password, 12);
    const org = await OrganizationModel.create({
      name: body.name,
      email: body.email,
      passwordHash,
      stellarPublicKey: body.stellarPublicKey,
      description: body.description ?? "",
      website: body.website ?? "",
    });

    const token = jwt.sign(
      { id: org._id.toString(), email: org.email, stellarPublicKey: org.stellarPublicKey },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    track(org._id.toString(), "org_signed_up", { name: org.name });
    res.status(201).json({
      token,
      org: { id: org._id, name: org.name, email: org.email, stellarPublicKey: org.stellarPublicKey },
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const org = await OrganizationModel.findOne({ email: body.email });
    if (!org) throw new ApiError(401, "Invalid email or password");

    const valid = await bcrypt.compare(body.password, org.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password");

    const token = jwt.sign(
      { id: org._id.toString(), email: org.email, stellarPublicKey: org.stellarPublicKey },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    track(org._id.toString(), "org_logged_in");
    res.json({
      token,
      org: { id: org._id, name: org.name, email: org.email, stellarPublicKey: org.stellarPublicKey },
    });
  } catch (err) {
    next(err);
  }
});
