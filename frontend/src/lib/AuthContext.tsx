import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { OrgSession } from "../lib/types";

interface AuthContextValue {
  session: OrgSession | null;
  login: (session: OrgSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "aidbridge_org_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<OrgSession | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrgSession) : null;
  });

  useEffect(() => {
    api.setToken(session?.token ?? null);
  }, [session]);

  function login(next: OrgSession) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
