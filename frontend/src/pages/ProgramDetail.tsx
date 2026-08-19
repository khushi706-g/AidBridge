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
  const [showFiat, setShowFiat] = useState(false);
  const [thankYouNote, setThankYouNote] = useState("");
  const [showFAQ, setShowFAQ] = useState(false);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <h1 className="detail-page__title" style={{ margin: 0 }}>{program.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <a href={`https://twitter.com/intent/tweet?text=Support the ${program.title} aid program!&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.25rem 0.5rem', background: '#1DA1F2', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}>Share on Twitter</a>
              <a href={`https://api.whatsapp.com/send?text=Support the ${program.title} aid program! ${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.25rem 0.5rem', background: '#25D366', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}>Share on WhatsApp</a>
            </div>
          </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="claim-amount" className="claim-card__label" style={{ margin: 0 }}>
                  Amount to claim ({showFiat ? 'USD' : program.tokenSymbol})
                </label>
                <button type="button" onClick={() => setShowFiat(!showFiat)} style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', textDecoration: 'underline' }}>
                  Show in {showFiat ? 'XLM' : 'Fiat'}
                </button>
              </div>
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
              {showFiat && claimAmount && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '0.5rem', marginBottom: '1rem', textAlign: 'right' }}>
                  ≈ ${(Number(claimAmount) * 0.12).toFixed(2)} USD
                </p>
              )}
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
              <p className="mono" style={{ marginBottom: '1rem' }}>
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {txHash}
                </a>
              </p>
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Leave a 'Thank You' note for the organization:</p>
                <textarea 
                  value={thankYouNote} 
                  onChange={(e) => setThankYouNote(e.target.value)}
                  placeholder="Thank you so much for this support..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', marginBottom: '0.5rem', minHeight: '60px' }}
                />
                <Button variant="outline" onClick={() => { alert('Thank you note submitted!'); setThankYouNote(''); }}>Submit Note</Button>
              </div>
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

          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setShowFAQ(!showFAQ)} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', color: 'var(--text)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Help &amp; FAQ for First-time Users</span>
              <span>{showFAQ ? '−' : '+'}</span>
            </button>
            {showFAQ && (
              <div style={{ padding: '1rem', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <p><strong>What is a Stellar Wallet?</strong> A digital wallet (like Freighter) that lets you securely receive funds directly.</p>
                <p><strong>How do I claim?</strong> Enter the amount you need (up to the limit) and click "Submit claim". You will be asked to sign the transaction.</p>
                <p><strong>Are there fees?</strong> The Stellar network takes a fraction of a cent per transaction. Make sure you have a tiny bit of XLM for gas!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
