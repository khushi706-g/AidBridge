import { useCallback, useEffect, useState } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon } from "@stellar/stellar-sdk";
import { api } from "./api";

interface WalletState {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
}

const STORAGE_KEY = "aidbridge_wallet";

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    connected: false,
    publicKey: localStorage.getItem(STORAGE_KEY),
    connecting: false,
    error: null,
  });
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!state.publicKey) return;
    try {
      const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");
      const acc = await horizon.loadAccount(state.publicKey);
      const native = acc.balances.find((b) => b.asset_type === "native");
      if (native) setBalance(native.balance);
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    }
  }, [state.publicKey]);

  useEffect(() => {
    if (state.publicKey) {
      setState((s) => ({ ...s, connected: true }));
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [state.publicKey, fetchBalance]);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const available = await isConnected();
      if (!available.isConnected) {
        throw new Error("Freighter extension not detected. Install it to continue.");
      }
      const access = await requestAccess();
      if (access.error) throw new Error(access.error);

      const addr = await getAddress();
      if (addr.error) throw new Error(addr.error);

      localStorage.setItem(STORAGE_KEY, addr.address);
      setState({ connected: true, publicKey: addr.address, connecting: false, error: null });

      await api.post("/interactions", {
        stellarWallet: addr.address,
        action: "wallet_connect",
      }).catch(() => undefined);

      return addr.address;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setState((s) => ({ ...s, connecting: false, error: message }));
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ connected: false, publicKey: null, connecting: false, error: null });
  }, []);

  return { ...state, balance, fetchBalance, connect, disconnect, signTransaction };
}
