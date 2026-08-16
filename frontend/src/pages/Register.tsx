import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useWallet } from "../lib/useWallet";
import { Button, Card } from "../components/ui";
import "./Register.css";

export function Register() {
  const { onChainId } = useParams<{ onChainId: string }>();
  const { publicKey, connect } = useWallet();
  const [form, setForm] = useState({ fullName: "", contactPhone: "", householdSize: "1" });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const wallet = publicKey ?? (await connect());
      const data = new FormData();
      data.append("programOnChainId", onChainId ?? "");
      data.append("stellarWallet", wallet);
      data.append("fullName", form.fullName);
      data.append("contactPhone", form.contactPhone);
      data.append("householdSize", form.householdSize);
      if (files) {
        Array.from(files).forEach((f) => data.append("documents", f));
      }
      await api.post("/beneficiaries", data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container register-page">
        <Card>
          <p className="eyebrow">Registered</p>
          <h2>Your registration is pending review</h2>
          <p className="register-page__body">
            The administering organization will verify your eligibility. Once
            approved, your wallet is added to the program on-chain and you
            can submit a claim.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container register-page">
      <p className="eyebrow">Program #{onChainId}</p>
      <h1>Register as a beneficiary</h1>
      <p className="register-page__lede">
        Your identity details stay off-chain and are only visible to the
        administering organization. Only your wallet address and an
        eligibility flag ever reach the contract.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-form__field">
            <span className="claim-card__label">Full name</span>
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </label>
          <label className="register-form__field">
            <span className="claim-card__label">Contact phone (optional)</span>
            <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </label>
          <label className="register-form__field">
            <span className="claim-card__label">Household size</span>
            <input
              type="number"
              min={1}
              value={form.householdSize}
              onChange={(e) => setForm({ ...form, householdSize: e.target.value })}
            />
          </label>
          <label className="register-form__field">
            <span className="claim-card__label">Supporting documents (optional)</span>
            <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
          </label>

          <p className="register-form__wallet mono">
            {publicKey ? `Wallet: ${publicKey}` : "Wallet will be requested on submit"}
          </p>

          {error ? <p className="org-auth__error">{error}</p> : null}

          <Button type="submit" variant="signal" loading={loading}>
            Submit registration
          </Button>
        </form>
      </Card>
    </div>
  );
}
