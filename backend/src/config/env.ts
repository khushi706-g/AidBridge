import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/aidbridge"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  STELLAR_NETWORK: z.enum(["testnet", "futurenet", "mainnet"]).default("testnet"),
  SOROBAN_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  STELLAR_NETWORK_PASSPHRASE: z.string().default("Test SDF Network ; September 2015"),
  AID_CONTRACT_ID: z.string().default(""),
  SENTRY_DSN: z.string().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().default("https://app.posthog.com"),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_MB: z.coerce.number().default(8),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
