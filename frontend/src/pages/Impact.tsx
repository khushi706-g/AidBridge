import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { InteractionSummary } from "../lib/types";
import { Card, Loading } from "../components/ui";
import { FeedbackForm } from "../components/FeedbackForm";
import "./Impact.css";

interface FeedbackSummary {
  count: number;
  averageRating: number;
}

export function Impact() {
  const [interactions, setInteractions] = useState<InteractionSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackSummary | null>(null);

  useEffect(() => {
    api.get<InteractionSummary>("/interactions/summary").then(setInteractions).catch(() => undefined);
    api.get<FeedbackSummary>("/feedback/summary").then(setFeedback).catch(() => undefined);
  }, []);

  return (
    <div className="container impact-page">
      <p className="eyebrow">Platform-wide, real-time</p>
      <h1>Impact &amp; usage</h1>
      <p className="impact-page__lede">
        Every number below comes from logged wallet interactions and
        on-chain settlements — not projections.
      </p>

      {!interactions ? (
        <Loading label="Loading metrics" />
      ) : (
        <div className="impact-grid">
          <StatCard label="Unique wallets" value={interactions.uniqueWallets} />
          <StatCard label="Total interactions" value={interactions.totalInteractions} />
          <StatCard label="Claims submitted" value={interactions.byAction.claim_submitted ?? 0} />
          <StatCard label="Beneficiaries registered" value={interactions.byAction.beneficiary_registered ?? 0} />
          {feedback ? (
            <StatCard label="Avg. feedback rating" value={feedback.averageRating} suffix="/ 5" />
          ) : null}
        </div>
      )}

      <div className="perf-divider" />

      <div className="impact-page__feedback">
        <p className="eyebrow">Tell us how it went</p>
        <h2>Share feedback</h2>
        <FeedbackForm />
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <Card className="stat-card">
      <p className="eyebrow">{label}</p>
      <p className="stat-card__value mono">
        {value}
        {suffix ? <span className="stat-card__suffix"> {suffix}</span> : null}
      </p>
    </Card>
  );
}
