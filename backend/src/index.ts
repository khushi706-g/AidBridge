import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSentry } from "./config/sentry.js";
import { initAnalytics } from "./config/analytics.js";
import { env } from "./config/env.js";

async function main() {
  initSentry();
  initAnalytics();
  await connectDB();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`🚀 AidBridge API listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
