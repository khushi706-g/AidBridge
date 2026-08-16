# AidBridge — Programmable humanitarian aid distribution on Stellar + Soroban

> AidBridge lets a humanitarian organization define an aid program's eligibility, per-person allocation, claim window, and claim limits as a Soroban smart contract — then fund it and let beneficiaries claim directly from their own Stellar wallets.

## 🚀 Quick Links
- **Live Platform**: `<insert-live-url>`
- **Demo Video**: `<insert-demo-video-url>`
- **Contract Deployment Address**: `<fill in after running docs/DEPLOYMENT.md>`
- **User Feedback Form**: `<insert-feedback-form-url>`
- **User Feedback Responses**: `<insert-feedback-responses-url>`

---

## Why this exists

During floods, droughts, earthquakes, and other emergencies, aid distribution usually runs through centralized databases and manual verification. That means delayed payments while an administrator processes claims one by one, duplicate or over-allocated claims that are hard to catch after the fact, and no independent way for a donor or oversight body to verify that a program's own rules were actually followed.

AidBridge solves this by moving the rules into the contract, not a spreadsheet. Allocation caps, claim windows, and per-beneficiary claim limits are enforced by Soroban at the moment of claim. Sensitive data stays off-chain, visible only to the administering organization. The chain only ever sees a wallet address and an eligibility flag. Beneficiaries hold the funds themselves—a claim is a transaction the beneficiary signs with their own wallet (via Freighter) and the platform never custodies aid funds on their behalf.

## How money actually moves

```text
   Organization                                      Beneficiary
       │  fund_program()                                ▲
       ▼                                                │  claim()
┌──────────────────────┐                                │ 
│ Soroban Smart        │ ── aid distribution rules ───► │
│ Contract (Testnet)   │                                │
└──────────────────────┘                                │
       │  transactions settle                           │
       └────────────────────────────────────────────────┘
```

- **Organization → Contract**: `fund_program()` escrows real token funds into the smart contract.
- **Beneficiary → Contract**: `claim()` checks eligibility, claim window, per-wallet limit, cumulative allocation cap, and remaining program funds before paying out. The beneficiary signs the transaction with their own wallet (Freighter).
- Every claim produces a real transaction hash providing an on-chain audit trail.

## Architecture

```text
frontend/   React + Vite app — org dashboard, public program browser, beneficiary claim flow
backend/    Express + TypeScript API, MongoDB models
contracts/  Soroban (Rust) — smart contract + tests
docs/       Architecture notes and deployment guide
```

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB |
| Wallet | Freighter |
| Blockchain | Stellar Testnet |
| Smart Contract | Soroban (Rust) |

## Product Screenshots

### Product UI
- **Dashboard Overview**:
  ![Dashboard Screenshot](./images/dashboard_placeholder.png)
  
### Mobile Responsive Design
- **Mobile View**: Fully responsive across all devices.
  ![Mobile Design](./images/mobile_placeholder.png)

### Analytics Dashboard
- **Live Telemetry & Impact**:
  ![Analytics Dashboard](./images/analytics_placeholder.png)

## Users Onboarded

Below is the list of users who actively tested the platform and provided feedback:

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| 1 | <Name> | <Email> | `<Wallet Address>` | <Feedback> |
| 2 | <Name> | <Email> | `<Wallet Address>` | <Feedback> |
| 3 | <Name> | <Email> | `<Wallet Address>` | <Feedback> |

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
