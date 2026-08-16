import { Request, Response, NextFunction } from "express";
import { Sentry } from "../config/sentry.js";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Unexpected error";

  if (status >= 500) {
    console.error(`[${req.method} ${req.path}]`, err);
    Sentry.captureException(err);
  }

  res.status(status).json({ error: message });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}
