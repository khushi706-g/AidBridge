import posthog from "posthog-js";
import * as Sentry from "@sentry/react";

export function initObservability() {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://app.posthog.com",
      capture_pageview: true,
      autocapture: true,
    });
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.3,
    });
  }
}

export function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  posthog.capture(event, properties);
}
