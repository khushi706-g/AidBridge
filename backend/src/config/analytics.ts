import { PostHog } from "posthog-node";
import { env } from "./env.js";

let client: PostHog | null = null;

export function initAnalytics(): PostHog | null {
  if (!env.POSTHOG_API_KEY) {
    console.warn("⚠️  POSTHOG_API_KEY not set — analytics disabled.");
    return null;
  }
  client = new PostHog(env.POSTHOG_API_KEY, { host: env.POSTHOG_HOST });
  return client;
}

/**
 * Track a server-side event. Safe to call even when analytics is disabled —
 * becomes a no-op so route handlers never need to guard on it.
 */
export function track(distinctId: string, event: string, properties: Record<string, unknown> = {}) {
  client?.capture({ distinctId, event, properties });
}

export function shutdownAnalytics() {
  return client?.shutdown();
}
