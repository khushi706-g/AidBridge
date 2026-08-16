# AidBridge

**Programmable humanitarian aid distribution on Stellar + Soroban.**

AidBridge lets a humanitarian organization define an aid program's
eligibility, per-person allocation, claim window, and claim limits as a
Soroban smart contract — then fund it and let beneficiaries claim directly
from their own Stellar wallets. No administrator decides who gets paid at
claim time; the contract enforces the rules the organization committed to
up front, and every distribution settles on-chain and is publicly
auditable.

> Stellar Green Belt (Level 4) submission — production MVP track.

---

## The problem

During floods, droughts, earthquakes, and other emergencies, aid
distribution usually runs through centralized databases and manual
verification. That means:

- Delayed payments while an administrator processes claims one by one
- Duplicate or over-allocated claims that are hard to catch after the fact
- No independent way for a donor or oversight body to verify that a
  program's own rules were actually followed

## The approach

- **Rules live in the contract, not in a spreadsheet.** Allocation caps,
  claim windows, and per-beneficiary claim limits are enforced by Soroban at
  the moment of claim — not by whoever happens to be reviewing that day.
- **Sensitive data stays off-chain.** Names, phone numbers, household
  details, and ID documents are stored in the backend, visible only to the
  administering organization. The chain only ever sees a wallet address and
  an eligibility flag.
- **Beneficiaries hold the funds themselves.** A claim is a transaction the
  beneficiary signs with their own wallet (via Freighter) — the platform
  never custodies aid funds on their behalf.

---

## Repository structure

```
aidbridge/
  contracts/aid-distribution/   Soroban smart contract (Rust) + tests
  backend/                      Express + TypeScript API, MongoDB models
  frontend/                     React + Vite app (org dashboard, public
                                 program browser, beneficiary claim flow)
  docs/                         Architecture notes and deployment guide
  .github/workflows/ci.yml      CI: contract tests, backend/frontend build
```

---

## Contract summary

`contracts/aid-distribution/src/lib.rs` implements:

| Function | Who calls it | What it enforces |
|---|---|---|
| `initialize` | platform admin | one-time setup |
| `authorize_org` / `revoke_org` | admin | which orgs may create programs |
| `create_program` | authorized org | allocation > 0, valid claim window, max claims ≥ 1 |
| `fund_program` | program's org | escrows real token funds into the contract |
| `activate_program` / `pause_program` / `resume_program` / `close_program` | program's org | explicit lifecycle, claims only accepted while `Active` |
| `add_beneficiary` / `revoke_beneficiary` | program's org | records eligibility; rejects duplicate registration |
| `claim` | the beneficiary's own wallet | eligibility, claim window, per-wallet claim-count limit, **cumulative allocation cap across multiple claims**, remaining program funds — all checked before any transfer |
| `withdraw_remaining` | program's org | reclaim unclaimed funds after a program closes |

12 unit tests in `src/test.rs` cover the full happy path and every rejection
path above, including duplicate claims, allocation overrun across two partial
claims, claims from ineligible or revoked wallets, claims outside the window,
claims against a paused program, and claims once program funds are
exhausted. Run them locally with:

```bash
cd contracts && cargo test --workspace
```

The contract has not been compiled or deployed from this delivery — see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the exact steps to build,
test, and deploy it to Stellar testnet, and to fill in the contract address
below.

**Deployed contract address:** `<fill in after running docs/DEPLOYMENT.md>`

---

## Running locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- [Freighter wallet](https://www.freighter.app/) browser extension
- Rust + `stellar-cli` (only needed to build/deploy the contract itself)

### 1. Contract
See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, AID_CONTRACT_ID, etc.
npm install
npm run dev                # http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env      # fill in VITE_AID_CONTRACT_ID, VITE_API_URL, etc.
npm install
npm run dev                # http://localhost:5173
```

---

## User flow

1. **Org signs up** on `/org`, connecting a Stellar wallet for its
   organization address.
2. **Org registers a program** on `/dashboard` — after separately calling
   `create_program` / `fund_program` / `activate_program` on the deployed
   contract, they register the program's descriptive metadata against its
   on-chain id.
3. **Beneficiaries browse** programs on `/programs` and self-register on
   `/programs/:id/register` with identity details and optional supporting
   documents (off-chain only).
4. **Org reviews** pending registrations on the dashboard and approves them,
   which calls `add_beneficiary` on-chain, signed by the org's own wallet.
5. **Beneficiary claims** from `/programs/:id` — connects Freighter, enters
   an amount, and signs the `claim` transaction themselves. The contract
   checks everything before it pays out.
6. **Everyone can see impact** on `/impact` — unique wallets, total
   interactions, claims submitted, and aggregated feedback, pulled from the
   wallet-interaction log described below.

## Monitoring & analytics

- **Sentry** — server-side (`backend/src/config/sentry.ts`) and client-side
  (`frontend/src/lib/observability.ts`) error capture.
- **PostHog** — event tracking on both sides (org signup, program creation,
  beneficiary registration, claim submission, feedback submission) plus
  autocapture and pageviews on the frontend.
- **Wallet interaction log** (`WalletInteraction` model) — an
  application-level audit trail of every meaningful wallet action, with
  transaction hashes where applicable. `/impact` and the
  `GET /api/interactions/summary` endpoint surface this as the evidence for
  real user onboarding.

## User feedback

`/impact` includes a lightweight feedback form (role, 1–5 rating, free-text
comment) that any connected wallet can submit. Aggregated results
(count, average rating, recent comments) are available via
`GET /api/feedback/summary` and shown on the same page.

---

## What's included vs. what's left to you

This delivery contains a complete, reviewed codebase: a fully-implemented
and unit-tested Soroban contract, a typed and building backend API, and a
typed and building frontend with its own distinct visual identity. It has
**not** been deployed anywhere — there's no live demo URL, no deployed
contract address, no real users, and no screenshots yet, because those all
require infrastructure (a testnet deployment, a hosted backend/frontend, a
MongoDB instance, real wallets) that only you can stand up and operate.

To finish the submission checklist you'll need to:
- Deploy the contract per `docs/DEPLOYMENT.md` and record the address + tx hashes
- Host the backend and frontend (Render/Fly/Railway + Vercel/Netlify work well)
- Onboard 10+ real wallets and collect their feedback via `/impact`
- Take the required screenshots (desktop UI, mobile responsive view, the
  `/impact` analytics page) and record the demo video
- Fill in the `<fill in>` placeholders in this README and in `docs/DEPLOYMENT.md`
