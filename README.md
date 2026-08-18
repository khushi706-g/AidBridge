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

## 👥 User Onboarding

We successfully onboarded 12 real users with Stellar Testnet wallets and verified on-chain transactions to claim their aid packets.

### Users Onboarded
| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| 1 | Anu Mehta | anukr12354@gmail.com | `GAC3LITATVVB32GXDQ3H57AKKPFW6U6IE27MGSH22OZK2DFWGTSKXY6W` | Typography makes scanning easy |
| 2 | Smriti kumari | adhikarismriti994@gmail.com | `GATRLA4MGRVUN4AJRFV5XE5UK7BUDHKPAUK347J3NUDVEWSYYKAVK5E4` | Needs offline mode |
| 3 | Sara Anaya | saranyasa999@gmail.com | `GBNK63IH2VXBQJW6CWIURQT47RLGILWRBPKGMBVMLPY53QXNII77KRCE` | Allow multiple photos |
| 4 | Subheksh koma | komasubheeksh@gmail.com | `GAERKK5OALRTEIDQMOFB4PLER7MOFHHFVD6ZIHARG7ZWFFTUU2R4TH4B` | Add Dark Mode |
| 5 | Shan Arav | shantanav7@gmail.com | `GCEPJ3IH5QWZKDTCJVR3IXZCSJXNTKBID77FFU53MFO2APZHEFTTW3ER` | Advanced filtering by date/category |
| 6 | Simmi Tiwari | simmitiwari770@gmail.com | `GDQ3WNT6KR74PAC73CF4OBJHQ65CL4KSEK3FR3FPXFISBV72DRJ5Q7CY` | Add Mental Health category |
| 7 | Eshan Mehra | enzobaby0099@gmail.com | `GBYU6CETKQVMDD2P37WD22AH64P56E2F3SOWKFJEC3YWJ4NWIPUUR3UA` | Export data as CSV/PDF |
| 8 | Sohbham Patil | sohamrpatil4220@gmail.com | `GBBPU6DS5FNGXZXACJL3ZVI5MEF5LLH2YSSPCTHSZVPRVMZSI3OZ6JP6` | Monthly impact newsletter |
| 9 | Jayant Vaibhav | jayantvaibhavspj@gmail.com | `GD5EBRJHLRGVPIYYP4AZP22YTKXM6G4EOT5SOX76CCBMOUPIBXUUO75Z` | Allow editing posts |
| 10 | Ranjana Mehta | mehtaranjana745@gmail.com | `GBESM54CUIATAMWYYG5NJKIPTJWWO2TXJTDXBETYQ5AFL2YHOZ3XCVYH` | Multi-language support |
| 11 | Himanshu Jha | jhahimanshu653@gmail.com | `GCEBVY27WJKU2JTO7WU3U53RUTQOMTPU7PC35ZFOBJ6RJEBUU3PCEYAH` | Delete account from settings |
| 12 | Akash Mondal | 73akash58mondal@gmail.com | `GBGC3MISIJPO3SFLCYGQTINDLAD6CKDQRCDDRGIY5BWUWIVFHLPNB2KY` | Real-time push notifications |

### Feedback Implementation
We actively collected user feedback through Google Forms and implemented real feature requests directly into the production platform with unique Git commits.

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| 4 | Subheksh koma | komasubheeksh@gmail.com | `GAERKK5O...` | Add Dark Mode | Added Light/Dark mode toggle to UI | `e1ef2cf` |
| 5 | Shan Arav | shantanav7@gmail.com | `GCEPJ3IH...` | Advanced filtering | Added category filtering to Programs page | `3ef9c0b` |
| 6 | Simmi Tiwari | simmitiwari770@gmail.com | `GDQ3WNT6...` | Mental Health category | Added Mental Health option to dropdown | `34efab8` |
| 7 | Eshan Mehra | enzobaby0099@gmail.com | `GBYU6CET...` | Export data as CSV | Built CSV export feature on Dashboard | `34efab8` |

### On-Chain Verification
| User ID | Name | Wallet Address | Transaction Link |
|---|---|---|---|
| 1 | Anu Mehta | `GAC3LITA...` | [ed1d5fb76422bec9...](https://stellar.expert/explorer/testnet/tx/ed1d5fb76422bec9150b4f13baa0e6670159664e9cf692e7137337dd2ac68113) |
| 2 | Smriti kumari | `GATRLA4M...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/375af984d0da9848836574d8af8e31888bfde230c4a6f074d2b447e25bf75a64) |
| 3 | Sara Anaya | `GBNK63IH...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e13a15b0d3041497f06bee0ba9eb56f8bc222eaa6cb2e9fd1eb25d756e81adf8) |
| 4 | Subheksh koma | `GAERKK5O...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5f76a723581a8a7fdbe89e07971aaa46b6c3621850b509faf97b7488eb7104c1) |
| 5 | Shan Arav | `GCEPJ3IH...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bf0dd128bbf71795c1ede488d30886099c1bd4c543fa2eee1e6c8e808f4f7da7) |
| 6 | Simmi Tiwari | `GDQ3WNT6...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3e7423050ee8929ae82663e411e84d62634214a5d1a320020ec2f097a23d2c18) |
| 7 | Eshan Mehra | `GBYU6CET...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ea66f5b312d861b3d1ff65ba904e34f1112e030e2346623f93452845e64770df) |
| 8 | Sohbham Patil | `GBBPU6DS...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c0300cfc81e9803137e7d3d6b82955cc334b43fe48a80d277a42a16872dbe429) |
| 9 | Jayant Vaibhav | `GD5EBRJH...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e25202e7d3aa9aa739e1e5bd8db5d4e9f002288fe11fa8bf2581ca488dab70cb) |
| 10 | Ranjana Mehta | `GBESM54C...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8d4869e0cc437fa877dfd94bd2605b8c62acedba5028eeca8c2a585095f2f810) |
| 11 | Himanshu Jha | `GCEBVY27...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8abfb70efd0d46ecf8f9431f58d23a1e926782c55d21f8e94e4ebb0c0001d92e) |
| 12 | Akash Mondal | `GBGC3MIS...` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/17408918d7b38a1ce27faa882066bd777f8fe6e94f05f8e234962cde5c545705) |

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
