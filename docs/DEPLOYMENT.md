# Deploying the AidBridge contract to Stellar testnet

These steps are for you to run locally/in CI — they require the Rust +
Soroban toolchain, which isn't available in the sandbox this project was
scaffolded in. Nothing here has been executed yet; the contract has been
written and unit-tested in source but not yet compiled or deployed.

## 1. Install prerequisites

```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

## 2. Run the test suite

```bash
cd contracts
cargo test --workspace
```

All 12 tests in `aid-distribution/src/test.rs` should pass before you deploy
anything. They cover the full lifecycle plus every rejection path described
in the problem statement (duplicate claims, allocation overrun, ineligible
wallets, revoked beneficiaries, expired/early claim windows, paused
programs, exhausted funds, cross-org authorization).

## 3. Build the optimized wasm

```bash
stellar contract build
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/aid_distribution.wasm
```

## 4. Create/fund a testnet identity

```bash
stellar keys generate admin --network testnet --fund
stellar keys generate org-demo --network testnet --fund
```

## 5. Deploy

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/aid_distribution.optimized.wasm \
  --source admin \
  --network testnet
```

Note the returned contract address (`C...`) — this is your
`AID_CONTRACT_ID` / `VITE_AID_CONTRACT_ID`.

## 6. Initialize and authorize an org

```bash
stellar contract invoke \
  --id <CONTRACT_ID> --source admin --network testnet \
  -- initialize --admin <ADMIN_PUBLIC_KEY>

stellar contract invoke \
  --id <CONTRACT_ID> --source admin --network testnet \
  -- authorize_org --org <ORG_PUBLIC_KEY>
```

## 7. Create, fund, and activate a program

```bash
stellar contract invoke \
  --id <CONTRACT_ID> --source org-demo --network testnet \
  -- create_program \
  --org <ORG_PUBLIC_KEY> \
  --metadata_uri "ipfs://..." \
  --token <SOROBAN_TOKEN_CONTRACT_ID> \
  --allocation_amount 1000 \
  --claim_start <UNIX_TS> \
  --claim_end <UNIX_TS> \
  --max_claims_per_beneficiary 1

stellar contract invoke \
  --id <CONTRACT_ID> --source org-demo --network testnet \
  -- fund_program --org <ORG_PUBLIC_KEY> --program_id 1 --amount 5000

stellar contract invoke \
  --id <CONTRACT_ID> --source org-demo --network testnet \
  -- activate_program --org <ORG_PUBLIC_KEY> --program_id 1
```

Record the contract address, program id, and every transaction hash from
this section — the submission checklist asks for the deployment address and
proof of real interactions, and these are the first ones.

## 8. Wire the apps

- Backend `.env`: set `AID_CONTRACT_ID`
- Frontend `.env`: set `VITE_AID_CONTRACT_ID` to the same value

From here, beneficiary onboarding and claims happen through the frontend,
signed by each wallet via Freighter — see the main README for the full
onboarding flow.
