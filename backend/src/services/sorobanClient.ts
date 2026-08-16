import { Contract, rpc, scValToNative, Address, xdr } from "@stellar/stellar-sdk";
import { env } from "../config/env.js";

const server = new rpc.Server(env.SOROBAN_RPC_URL, { allowHttp: false });

/**
 * Simulate a read-only contract call and return the decoded native value.
 * Used for dashboard/status reads where we don't need a signed transaction —
 * the frontend submits its own signed transactions via Freighter for writes.
 */
export async function simulateReadCall(functionName: string, args: xdr.ScVal[]): Promise<unknown> {
  if (!env.AID_CONTRACT_ID) {
    throw new Error("AID_CONTRACT_ID is not configured");
  }
  const contract = new Contract(env.AID_CONTRACT_ID);
  const account = await server.getAccount(
    // A throwaway source account works for simulation-only reads.
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
  ).catch(() => null);

  if (!account) {
    // Fall back to a minimal simulation account object when the sandbox
    // account doesn't exist on this network yet.
    throw new Error("Unable to resolve simulation source account on this network");
  }

  const { TransactionBuilder, BASE_FEE } = await import("@stellar/stellar-sdk");
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulation failed: ${sim.error}`);
  }
  if (!sim.result?.retval) {
    return null;
  }
  return scValToNative(sim.result.retval);
}

export function addressToScVal(pubKey: string): xdr.ScVal {
  return new Address(pubKey).toScVal();
}

export { server as sorobanServer };
