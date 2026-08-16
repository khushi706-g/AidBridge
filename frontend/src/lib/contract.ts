import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  nativeToScVal,
  Address,
  xdr,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015";
export const CONTRACT_ID = import.meta.env.VITE_AID_CONTRACT_ID ?? "";

const server = new rpc.Server(RPC_URL, { allowHttp: RPC_URL.startsWith("http://") });

export type ScArg =
  | { type: "address"; value: string }
  | { type: "u64"; value: number | bigint }
  | { type: "u32"; value: number }
  | { type: "i128"; value: number | bigint }
  | { type: "string"; value: string };

function toScVal(arg: ScArg): xdr.ScVal {
  switch (arg.type) {
    case "address":
      return new Address(arg.value).toScVal();
    case "u64":
      return nativeToScVal(arg.value, { type: "u64" });
    case "u32":
      return nativeToScVal(arg.value, { type: "u32" });
    case "i128":
      return nativeToScVal(arg.value, { type: "i128" });
    case "string":
      return nativeToScVal(arg.value, { type: "string" });
  }
}

/**
 * Build, simulate, sign (via Freighter), and submit a Soroban contract
 * invocation. Used for every state-changing call from the browser — the
 * beneficiary or org's own wallet signs, so the platform never custodies
 * keys or submits on anyone's behalf.
 */
export async function invokeContract(
  functionName: string,
  args: ScArg[],
  sourcePublicKey: string,
): Promise<{ txHash: string; result: unknown }> {
  if (!CONTRACT_ID) throw new Error("Contract ID not configured");

  const account = await server.getAccount(sourcePublicKey);
  const contract = new Contract(CONTRACT_ID);

  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...args.map(toScVal)))
    .setTimeout(60)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  tx = rpc.assembleTransaction(tx, simulated).build();

  const signed = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
  if (signed.error) throw new Error(signed.error);

  const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE);

  const sendResult = await server.sendTransaction(signedTx);
  if (sendResult.status === "ERROR") {
    throw new Error("Transaction submission failed");
  }

  let getResult = await server.getTransaction(sendResult.hash);
  let attempts = 0;
  while (getResult.status === "NOT_FOUND" && attempts < 15) {
    await new Promise((r) => setTimeout(r, 1500));
    getResult = await server.getTransaction(sendResult.hash);
    attempts += 1;
  }

  if (getResult.status !== "SUCCESS") {
    throw new Error(`Transaction did not succeed: ${getResult.status}`);
  }

  return { txHash: sendResult.hash, result: getResult.returnValue };
}
