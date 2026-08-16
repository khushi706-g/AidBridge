import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { programsRouter } from "./routes/programs.js";
import { beneficiariesRouter } from "./routes/beneficiaries.js";
import { interactionsRouter } from "./routes/interactions.js";
import { feedbackRouter } from "./routes/feedback.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", apiLimiter);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", network: env.STELLAR_NETWORK, timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/programs", programsRouter);
  app.use("/api/beneficiaries", beneficiariesRouter);
  app.use("/api/interactions", interactionsRouter);
  app.use("/api/feedback", feedbackRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
