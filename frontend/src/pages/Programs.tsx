import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { ProgramMeta } from "../lib/types";
import { Card, EmptyState, Loading, StatusPill } from "../components/ui";
import "./Programs.css";

export function Programs() {
  const [programs, setPrograms] = useState<ProgramMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProgramMeta[]>("/programs")
      .then(setPrograms)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container programs-page">
      <p className="eyebrow">Active &amp; funded programs</p>
      <h1 className="programs-page__title">Aid programs on AidBridge</h1>
      <p className="programs-page__lede">
        Every program listed here is backed by a funded Soroban contract on
        Stellar testnet. Allocation, eligibility, and claim rules are
        enforced at claim time — not by an administrator's discretion.
      </p>

      {error ? <p className="programs-page__error">{error}</p> : null}
      {!programs && !error ? <Loading label="Fetching programs" /> : null}

      {programs && programs.length === 0 ? (
        <EmptyState
          title="No programs registered yet"
          body="Organizations can create a program from the dashboard once their Soroban contract is deployed and funded."
        />
      ) : null}

      <div className="programs-grid">
        {programs?.map((p) => (
          <Link key={p._id} to={`/programs/${p.onChainId}`} className="programs-grid__link">
            <Card className="program-card">
              <div className="program-card__head">
                <span className="eyebrow">{p.disasterType}</span>
                <StatusPill status="Active" />
              </div>
              <h3>{p.title}</h3>
              <p className="program-card__region">{p.region}</p>
              <p className="program-card__summary">{p.summary}</p>
              <div className="perf-divider" />
              <div className="program-card__foot mono">
                <span>#{p.onChainId}</span>
                <span>{p.tokenSymbol}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
