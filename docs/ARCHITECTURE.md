# Architecture

## System overview

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│   Frontend       │      │   Backend API     │      │  Soroban contract   │
│  React + Vite    │◄────►│  Express + Mongo  │      │  (Stellar testnet)  │
│  Freighter wallet│      │  off-chain data   │      │  on-chain rules     │
└────────┬─────────┘      └───────────────────┘      └──────────┬─────────┘
         │                                                        │
         │  signed transactions (claim, add_beneficiary, ...)     │
         └────────────────────────────────────────────────────────┘
```

The frontend never sends a private key anywhere. Every state-changing
contract call — `create_program`, `fund_program`, `add_beneficiary`,
`claim`, etc. — is built client-side, simulated against the Soroban RPC,
signed in the user's own Freighter wallet, and submitted directly from the
browser. The backend is not a relayer and cannot act on anyone's behalf.

## What lives on-chain vs off-chain

| Data | Location | Why |
|---|---|---|
| Program id, org address, token, allocation cap, claim window | On-chain | Needed for the contract to enforce rules; not sensitive |
| Beneficiary wallet address, eligibility flag, claimed amount | On-chain | The minimum needed to prevent duplicate/over-claims, fully auditable |
| Claim receipts (wallet, amount, timestamp) | On-chain | Settlement audit trail |
| Beneficiary full name, phone, household size, ID documents | Off-chain (MongoDB) | Sensitive personal data; never belongs on a public ledger |
| Program title, summary, region, disaster type, cover image | Off-chain (MongoDB) | Descriptive metadata, referenced from the chain via `metadata_uri` conceptually, served from the API in this MVP |
| Org login credentials | Off-chain (MongoDB, bcrypt-hashed) | Platform-level auth, unrelated to the chain |

## Backend responsibilities

The backend is intentionally thin — it does not custody funds or sign
transactions. Its jobs are:

1. **Org accounts** — signup/login, JWT-based session for the dashboard.
2. **Program metadata** — the human-facing description that accompanies an
   on-chain program id.
3. **Beneficiary intake** — collects sensitive registration data and
   supporting documents off-chain, and exposes a review queue so an org can
   approve/reject before anything touches the chain.
4. **Wallet interaction log** — every meaningful wallet action (connect,
   register, claim, feedback) is recorded with a timestamp and, where
   applicable, a transaction hash. This is the evidence trail for real user
   onboarding, independent of indexing a block explorer.
5. **Analytics & error tracking** — PostHog events and Sentry error capture,
   both server- and client-side.

## Smart contract design notes

- **Checks-effects-interactions**: in `claim()`, all storage writes
  (beneficiary record, program totals, receipt) happen before the token
  transfer, so a reentrant token contract can't double-spend against stale
  state.
- **Cumulative allocation enforcement**: a beneficiary's `claimed_amount` is
  tracked across all their claims for a program, so partial/phased claims
  can never sum past `allocation_amount` — even with
  `max_claims_per_beneficiary > 1`.
- **Program-level fund isolation**: `distributed_amount` is checked against
  `funded_amount` on every claim, so one program running out of escrowed
  funds can never affect another program's beneficiaries.
- **Explicit lifecycle**: `Draft → Funded → Active ⇄ Paused → Closed`
  prevents claims against a program that hasn't been funded yet or has been
  wound down, without needing a separate access-control layer for that
  check.
- **TTL management**: instance and persistent storage entries are bumped on
  write so program and beneficiary records don't expire mid-program on
  Soroban's state-expiration model.

## Frontend structure

```
frontend/src/
  components/    shared UI primitives (Button, Card, StatusPill, Header, FeedbackForm)
  lib/           api client, Freighter wallet hook, contract invocation helper,
                 analytics init, auth context, shared types
  pages/         Home, Programs, ProgramDetail (claim flow), Register,
                 OrgAuth, Dashboard, Impact (analytics)
  styles/        design tokens + global styles
```
