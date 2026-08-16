import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  org?: { id: string; email: string; stellarPublicKey: string };
}

export function requireOrgAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      stellarPublicKey: string;
    };
    req.org = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
