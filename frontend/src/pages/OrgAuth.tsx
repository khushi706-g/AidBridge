import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { useWallet } from "../lib/useWallet";
import type { OrgSession } from "../lib/types";
import { Button, Card } from "../components/ui";
import "./OrgAuth.css";

export function OrgAuth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", website: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { publicKey, connect } = useWallet();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let wallet = publicKey;
      if (!wallet) wallet = await connect();

      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        mode === "signup"
          ? { ...form, stellarPublicKey: wallet }
          : { email: form.email, password: form.password };

      const session = await api.post<OrgSession>(path, payload);
      login(session);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container org-auth">
      <Card className="org-auth__card">
        <p className="eyebrow">{mode === "signup" ? "Register your organization" : "Org sign in"}</p>
        <h1 className="org-auth__title">
          {mode === "signup" ? "Create an aid program" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="org-auth__form">
          {mode === "signup" && (
            <>
              <Field label="Organization name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Website (optional)">
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://"
                />
              </Field>
            </>
          )}
          <Field label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Password">
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          <p className="org-auth__wallet-note mono">
            {publicKey ? `Wallet: ${publicKey.slice(0, 6)}···${publicKey.slice(-4)}` : "Wallet will be requested on submit"}
          </p>

          {error ? <p className="org-auth__error">{error}</p> : null}

          <Button type="submit" variant="signal" loading={loading}>
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <button
          type="button"
          className="org-auth__toggle"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          {mode === "signup" ? "Already registered? Sign in" : "New organization? Register"}
        </button>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="org-auth__field">
      <span className="claim-card__label">{label}</span>
      {children}
    </label>
  );
}
