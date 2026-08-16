import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";
import "./Home.css";

export function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Programmable aid distribution · Stellar testnet</p>
            <h1 className="hero__title">
              Aid that reaches people
              <br />
              on the rules that were <em>promised</em>.
            </h1>
            <p className="hero__lede">
              AidBridge turns a relief program's eligibility, allocation, and claim
              limits into a Soroban smart contract. No administrator decides who
              gets paid — the contract enforces it, and every distribution
              settles on-chain.
            </p>
            <div className="hero__actions">
              <Link to="/programs">
                <Button variant="signal">Browse Aid Programs</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">I represent an organization</Button>
              </Link>
            </div>
          </div>

          <div className="hero__packet" aria-hidden>
            <PacketIllustration />
          </div>
        </div>
      </section>

      <section className="container how">
        <p className="eyebrow">How it settles</p>
        <h2 className="how__title">Three parties, one enforced ledger</h2>
        <div className="how__grid">
          <StepCard
            index="01"
            title="Org defines the program"
            body="Eligibility rules, per-person allocation, claim window, and funding source are set once, on-chain, before any claim opens."
          />
          <StepCard
            index="02"
            title="Beneficiaries are verified"
            body="Identity documents stay off-chain. Only a wallet address and an eligibility flag are written to the contract."
          />
          <StepCard
            index="03"
            title="Wallets claim directly"
            body="A beneficiary signs their own claim transaction. The contract checks eligibility, limits, and remaining funds before it pays."
          />
        </div>
      </section>

      <section className="container principles">
        <div className="perf-divider" />
        <div className="principles__grid">
          <Card>
            <p className="eyebrow">On-chain</p>
            <p className="principles__body">
              Program identifiers, wallet addresses, allocation caps, claim
              status, and every settlement transaction — fully auditable by
              any donor or oversight body.
            </p>
          </Card>
          <Card>
            <p className="eyebrow">Off-chain</p>
            <p className="principles__body">
              Names, contact details, household data, and supporting
              documents. The chain never sees sensitive beneficiary
              information — only the settlement outcome.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

function StepCard({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="step-card">
      <span className="step-card__index mono">{index}</span>
      <h3 className="step-card__title">{title}</h3>
      <p className="step-card__body">{body}</p>
    </div>
  );
}

function PacketIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="packet-svg">
      <defs>
        <linearGradient id="packetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#c2440f" />
        </linearGradient>
      </defs>
      <rect x="12" y="20" width="280" height="170" rx="4" fill="#1c2229" stroke="#2a3138" />
      <rect x="12" y="20" width="280" height="40" rx="4" fill="url(#packetGrad)" />
      <text x="28" y="46" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#14181c" fontWeight="700">
        AID-PACKET · CLAIM-004
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={12 + i * 18} cy={60} r="4" fill="#14181c" />
      ))}
      <text x="28" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#9aa4ad">
        PROGRAM
      </text>
      <text x="28" y="108" fontFamily="Space Grotesk, sans-serif" fontSize="14" fill="#eef0f2">
        Flood Relief — Region 4
      </text>
      <text x="28" y="136" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#9aa4ad">
        ALLOCATION
      </text>
      <text x="28" y="152" fontFamily="Space Grotesk, sans-serif" fontSize="14" fill="#eef0f2">
        250.00 USDC
      </text>
      <text x="180" y="136" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#9aa4ad">
        STATUS
      </text>
      <text x="180" y="152" fontFamily="Space Grotesk, sans-serif" fontSize="14" fill="#2e7d5b">
        Settled
      </text>
    </svg>
  );
}
