import { useCallback, useEffect, useState } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
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

  useEffect(() => {
    if (state.publicKey) {
      setState((s) => ({ ...s, connected: true }));
    }
  }, [state.publicKey]);

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

  return { ...state, connect, disconnect, signTransaction };
}
