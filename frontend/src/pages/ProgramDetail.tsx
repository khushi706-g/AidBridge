import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { ProgramMeta } from "../lib/types";
import { useWallet } from "../lib/useWallet";
import { invokeContract } from "../lib/contract";
import { trackEvent } from "../lib/observability";
import { Button, Card, Loading, StatusPill } from "../components/ui";
import "./ProgramDetail.css";

type ClaimState = "idle" | "submitting" | "success" | "error";

export function ProgramDetail() {
  const { onChainId } = useParams<{ onChainId: string }>();
  const { connected, publicKey, connect } = useWallet();
  const [program, setProgram] = useState<ProgramMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimState, setClaimState] = useState<ClaimState>("idle");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [claimAmount, setClaimAmount] = useState("");

  useEffect(() => {
    if (!onChainId) return;
    api
      .get<ProgramMeta>(`/programs/${onChainId}`)
      .then(setProgram)
      .catch((err) => setError(err.message));
  }, [onChainId]);

  async function handleClaim() {
    if (!publicKey || !program) return;
    setClaimState("submitting");
    setClaimError(null);
    try {
      const amountStroops = BigInt(Math.round(Number(claimAmount) * 1e7));
      const { txHash: hash } = await invokeContract(
        "claim",
        [
          { type: "address", value: publicKey },
          { type: "u64", value: program.onChainId },
          { type: "i128", value: amountStroops },
        ],
        publicKey,
      );

      await api
        .post("/interactions", {
          stellarWallet: publicKey,
          action: "claim_submitted",
          programOnChainId: program.onChainId,
          txHash: hash,
        })
        .catch(() => undefined);

      trackEvent("claim_submitted", { programOnChainId: program.onChainId });
      setTxHash(hash);
      setClaimState("success");
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Claim failed");
      setClaimState("error");
    }
  }

  if (error) {
    return (
      <div className="container">
        <p className="programs-page__error">{error}</p>
      </div>
    );
  }
  if (!program) {
    return (
      <div className="container">
        <Loading label="Loading program" />
      </div>
    );
  }

  const orgName = typeof program.orgId === "object" ? program.orgId.name : "";

  return (
    <div className="container detail-page">
      <div className="detail-page__grid">
        <div>
          <p className="eyebrow">{program.disasterType} · {program.region}</p>
          <h1 className="detail-page__title">{program.title}</h1>
          {orgName ? <p className="detail-page__org">Administered by {orgName}</p> : null}
          <p className="detail-page__summary">{program.summary}</p>

          {program.eligibilityCriteria.length > 0 ? (
            <div className="detail-page__criteria">
              <p className="eyebrow">Eligibility criteria</p>
              <ul>
                {program.eligibilityCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="perf-divider" />
          <dl className="detail-page__meta mono">
            <div>
              <dt>Contract</dt>
              <dd>{program.contractAddress}</dd>
            </div>
            <div>
              <dt>Program ID</dt>
              <dd>#{program.onChainId}</dd>
            </div>
          </dl>
        </div>

        <Card className="claim-card">
          <div className="claim-card__head">
            <span className="eyebrow">Aid packet</span>
            <StatusPill status="Active" />
          </div>
          <p className="claim-card__helper">
            Claiming pays out directly to your connected wallet. The contract
            verifies your eligibility, remaining allocation, and the claim
            window before it settles.
          </p>

          {!connected ? (
            <Button variant="signal" onClick={() => connect().catch(() => undefined)}>
              Connect wallet to claim
            </Button>
          ) : (
            <div className="claim-card__form">
              <label htmlFor="claim-amount" className="claim-card__label">
                Amount to claim ({program.tokenSymbol})
              </label>
              <input
                id="claim-amount"
                type="number"
                min="0"
                step="0.0000001"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                className="claim-card__input mono"
                placeholder="0.00"
              />
              <Button
                variant="signal"
                onClick={handleClaim}
                loading={claimState === "submitting"}
                disabled={!claimAmount || Number(claimAmount) <= 0}
              >
                Submit claim
              </Button>
            </div>
          )}

          {claimState === "success" && txHash ? (
            <div className="claim-card__result claim-card__result--success">
              <p className="eyebrow">Settled</p>
              <p className="mono">{txHash}</p>
            </div>
          ) : null}
          {claimState === "error" && claimError ? (
            <div className="claim-card__result claim-card__result--error">
              <p className="eyebrow">Claim rejected</p>
              <p>{claimError}</p>
            </div>
          ) : null}

          <div className="perf-divider" style={{ margin: "1.5rem 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p style={{ textAlign: "center", fontSize: "0.9rem", margin: 0 }}>Not registered yet?</p>
            <Button variant="outline" onClick={() => window.location.href = `/programs/${program.onChainId}/register`}>
              Register as Beneficiary
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
