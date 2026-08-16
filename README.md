# 🚀 AidBridge — Programmable humanitarian aid distribution on Stellar Soroban

AidBridge is a production-ready humanitarian aid distribution platform built on Stellar (Soroban). It lets organizations define an aid program's eligibility, per-person allocation, claim window, and claim limits as a smart contract—then fund it and let beneficiaries claim directly from their own Stellar wallets without intermediaries.

## 🔗 Live Demo & Links
- **Live Platform**: [https://aid-bridge-alpha.vercel.app/](https://aid-bridge-alpha.vercel.app/)
- **Demo Video**: `<insert-demo-video-url>`
- **Example Transaction Hash**: [`0ff1bb77f83c013494cacf63bd36d45c3dd599116ee8a6c42d6194d33c2ee0dc`](https://stellar.expert/explorer/testnet/tx/0ff1bb77f83c013494cacf63bd36d45c3dd599116ee8a6c42d6194d33c2ee0dc)
- **AidBridge Contract ID**: `CDFUWKVSMDDLHQVECH6C7GLHJ2FFZJTNICDEUK4JMZI7MSHM2L332QIV`
- **User Feedback Form**: `<insert-feedback-form-url>`
- **User Feedback Responses**: `<insert-feedback-responses-url>`

## 🌟 Key Features

1. **On-Chain Rules & Escrow**: Allocation caps, claim windows, and per-beneficiary claim limits are enforced by Soroban at the moment of claim, not by an administrator.
2. **Privacy Preserving**: Sensitive data (names, IDs) stays off-chain in the organization's backend. The blockchain only ever sees a wallet address and an eligibility flag.
3. **Non-Custodial Claims**: Beneficiaries hold the funds themselves. A claim is a transaction the beneficiary signs with their own wallet (via Freighter)—the platform never custodies aid funds on their behalf.
4. **Monitoring & Analytics**: Built-in tracking of unique wallets, total interactions, claims submitted, and aggregated user feedback to measure program impact.
5. **Robust Dashboard UI**: Built with React and Vite. Features a dedicated organization dashboard for program management and beneficiary review, plus a seamless public claim flow.

---

## 📝 Requirements Met

- **Advanced smart contract development**: Built with Rust, encompassing multi-state program lifecycle management (Active, Paused, Closed), authorization, and strict rule enforcement.
- **Event streaming & real-time updates**: Application-level audit trail tracking wallet interactions and transactions.
- **CI/CD pipeline setup**: GitHub Actions (`ci.yml`) automatically runs contract tests and builds the frontend/backend.
- **Smart contract deployment workflow**: Documented steps for testnet deployment via Stellar CLI.
- **Mobile responsive frontend development**: Fully responsive claim interfaces and dashboards across devices.
- **Error handling & loading states**: Integrated observability with Sentry, loading indicators, and comprehensive error catching for contract rejections.
- **Writing tests for contracts and frontend**: Extensive Rust unit tests (`src/test.rs`) covering the full happy path and every rejection scenario (duplicate claims, allocation overrun, outside window, etc.).
- **Production-ready architecture practices**: Decoupled smart contracts, a dedicated Express/TypeScript backend for off-chain data, MongoDB models, and environment variable configurations.
- **Documentation & demo presentation**: Thorough README, architecture notes, deployment guides, and demo video.

---

## 📸 Platform Gallery & Submission Checklist

As per the submission requirements, here is proof of the platform's implementation:

### 1. Mobile Responsive UI
The platform gracefully adapts its interfaces for smaller screens, enabling seamless browsing and claims on mobile devices.
<img src="images/mobile_UI.png" width="100%" alt="Mobile Responsive UI" />

### 2. CI/CD Pipeline Running
Our GitHub Actions workflow automatically compiles the code and runs tests on every push.
<img src="images/CI_CD_PIPELINE.png" width="100%" alt="CI/CD Pipeline" />

### 3. Test Output (Passing Tests)
Extensive Rust tests validate the smart contract logic, testing the full lifecycle of a program from funding to beneficiary claims and withdrawals.
<img src="images/test_output.png" width="100%" alt="Test Output" />

### 4. Contract Interaction & Hash
Proof of successful smart contract interaction logged on the Stellar network.
<img src="images/CONTRACT_HASH.png" width="100%" alt="Contract Hash" />

---

## 🛠️ Tech Stack
- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Atlas)
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter
- **CI/CD & Monitoring**: GitHub Actions, Sentry, PostHog

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- [Freighter wallet](https://www.freighter.app/) browser extension
- Rust + `stellar-cli` (to build/deploy the contract)

### 2. Contract Deployment
Refer to [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed instructions on building and deploying to the testnet.

### 3. Backend Setup
```bash
cd backend
cp .env.example .env      # Fill in MONGODB_URI, JWT_SECRET, AID_CONTRACT_ID, etc.
npm install
npm run dev               # Runs on http://localhost:4000
```

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env      # Fill in VITE_AID_CONTRACT_ID, VITE_API_URL, etc.
npm install
npm run dev               # Runs on http://localhost:5173
```
