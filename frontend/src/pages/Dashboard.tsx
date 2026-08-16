import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../lib/AuthContext";
import { api } from "../lib/api";
import type { ProgramMeta, BeneficiaryRecord } from "../lib/types";
import { useWallet } from "../lib/useWallet";
import { invokeContract, CONTRACT_ID } from "../lib/contract";
import { Button, Card, EmptyState, Loading, StatusPill } from "../components/ui";
import { Navigate } from "react-router-dom";
import "./Dashboard.css";

export function Dashboard() {
  const { session } = useAuth();
  const { publicKey, connect } = useWallet();
  const [programs, setPrograms] = useState<ProgramMeta[] | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!session) return;
    api.get<ProgramMeta[]>("/programs/mine").then(setPrograms).catch(() => setPrograms([]));
  }, [session]);

  useEffect(() => {
    if (!selectedProgram) return;
    api
      .get<BeneficiaryRecord[]>(`/beneficiaries/program/${selectedProgram}?status=pending`)
      .then(setBeneficiaries)
      .catch(() => setBeneficiaries([]));
  }, [selectedProgram]);

  if (!session) return <Navigate to="/org" replace />;

  async function approveBeneficiary(b: BeneficiaryRecord) {
    if (!publicKey) {
      await connect().catch(() => undefined);
      return;
    }
    try {
      await api.patch(`/beneficiaries/${b._id}/review`, { status: "approved" });
      const { txHash } = await invokeContract(
        "add_beneficiary",
        [
          { type: "address", value: session!.org.stellarPublicKey },
          { type: "u64", value: b.programOnChainId },
          { type: "address", value: b.stellarWallet },
        ],
        publicKey,
      );
      await api.patch(`/beneficiaries/${b._id}/confirm-onchain`, {});
      setBeneficiaries((prev) => prev.filter((x) => x._id !== b._id));
      console.log("Beneficiary added on-chain, tx:", txHash);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve on-chain");
    }
  }

  return (
    <div className="container dashboard">
      <div className="dashboard__head">
        <div>
          <p className="eyebrow">{session.org.name}</p>
          <h1>Organization dashboard</h1>
        </div>
        <Button variant="signal" onClick={() => setShowCreate(true)}>
          Register new program
        </Button>
      </div>

      {showCreate ? (
        <CreateProgramForm
          onClose={() => setShowCreate(false)}
          onCreated={(p) => {
            setPrograms((prev) => [p, ...(prev ?? [])]);
            setShowCreate(false);
          }}
        />
      ) : null}

      <div className="dashboard__grid">
        <div>
          <p className="eyebrow">Your programs</p>
          {!programs ? <Loading label="Loading programs" /> : null}
          {programs && programs.length === 0 ? (
            <EmptyState
              title="No programs yet"
              body="Deploy your Soroban contract call for create_program, then register its metadata here."
            />
          ) : null}
          <div className="dashboard__programs">
            {programs?.map((p) => (
              <button
                key={p._id}
                className={`dashboard__program-item ${selectedProgram === p.onChainId ? "is-active" : ""}`}
                onClick={() => setSelectedProgram(p.onChainId)}
              >
                <span>{p.title}</span>
                <StatusPill status="Active" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Pending beneficiary review {selectedProgram ? `· #${selectedProgram}` : ""}</p>
          {!selectedProgram ? (
            <EmptyState title="Select a program" body="Choose a program on the left to review pending beneficiaries." />
          ) : beneficiaries.length === 0 ? (
            <EmptyState title="Queue is clear" body="No pending beneficiary registrations for this program." />
          ) : (
            <div className="dashboard__beneficiaries">
              {beneficiaries.map((b) => (
                <Card key={b._id} className="beneficiary-row">
                  <div>
                    <p className="beneficiary-row__name">{b.fullName}</p>
                    <p className="mono beneficiary-row__wallet">{b.stellarWallet}</p>
                  </div>
                  <Button variant="outline" onClick={() => approveBeneficiary(b)}>
                    Approve on-chain
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {!CONTRACT_ID ? (
        <p className="dashboard__warning mono">
          VITE_AID_CONTRACT_ID is not set — connect it to your deployed contract to enable on-chain actions.
        </p>
      ) : null}
    </div>
  );
}

function CreateProgramForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: ProgramMeta) => void;
}) {
  const [form, setForm] = useState({
    onChainId: "",
    title: "",
    summary: "",
    region: "",
    disasterType: "flood",
    tokenSymbol: "XLM",
    contractAddress: CONTRACT_ID,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await api.post<ProgramMeta>("/programs", {
        ...form,
        onChainId: Number(form.onChainId),
        eligibilityCriteria: [],
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register program");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="create-form">
      <p className="eyebrow">New program metadata</p>
      <p className="create-form__hint">
        Call <code className="mono">create_program</code> on your deployed contract first, then register
        its on-chain ID and description here.
      </p>
      <form onSubmit={handleSubmit} className="create-form__grid">
        <input placeholder="On-chain program ID" required value={form.onChainId} onChange={(e) => setForm({ ...form, onChainId: e.target.value })} />
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        <select value={form.disasterType} onChange={(e) => setForm({ ...form, disasterType: e.target.value })}>
          {["flood", "drought", "earthquake", "conflict", "epidemic", "cyclone", "other"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input placeholder="Token symbol" value={form.tokenSymbol} onChange={(e) => setForm({ ...form, tokenSymbol: e.target.value })} />
        <input placeholder="Contract address" required value={form.contractAddress} onChange={(e) => setForm({ ...form, contractAddress: e.target.value })} />
        <textarea
          placeholder="Program summary"
          required
          className="create-form__summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        {error ? <p className="org-auth__error">{error}</p> : null}
        <div className="create-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="signal" loading={loading}>Register program</Button>
        </div>
      </form>
    </Card>
  );
}
