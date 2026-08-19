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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => {
            if (!programs) return;
            const csv = ["ID,Title,Region,Category,Summary"];
            programs.forEach(p => csv.push(`${p.onChainId},"${p.title}","${p.region}",${p.disasterType},"${p.summary}"`));
            const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'programs.csv';
            a.click();
          }}>
            Export CSV
          </Button>
          <Button variant="signal" onClick={() => setShowCreate(true)}>
            Register new program
          </Button>
        </div>
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
          
          {selectedProgram ? (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Fund Utilization (Estimated)</span>
                <span className="mono" style={{ fontSize: '0.8rem' }}>15% Claimed</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: 'var(--signal)' }}></div>
              </div>
            </div>
          ) : null}

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
  const { publicKey } = useWallet();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    region: "",
    disasterType: "flood",
    tokenSymbol: "XLM",
    contractAddress: CONTRACT_ID,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!publicKey) return setError("Wallet not connected");
    setLoading(true);
    setError(null);
    try {
      setLoadingText("Creating on-chain (Sign 1 of 3)...");
      const { result: rawId } = await invokeContract(
        "create_program",
        [
          { type: "address", value: publicKey },
          { type: "string", value: form.title },
          { type: "address", value: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC" },
          { type: "i128", value: BigInt("100000000000") }, // 10k XLM
          { type: "u64", value: Math.floor(Date.now() / 1000) - 3600 },
          { type: "u64", value: Math.floor(Date.now() / 1000) + 30 * 24 * 3600 },
          { type: "u32", value: 1 },
        ],
        publicKey
      );
      const progId = Number(rawId);

      setLoadingText("Funding program (Sign 2 of 3)...");
      await invokeContract(
        "fund_program",
        [
          { type: "address", value: publicKey },
          { type: "u64", value: progId },
          { type: "i128", value: BigInt("100000000000") },
        ],
        publicKey
      );

      setLoadingText("Activating program (Sign 3 of 3)...");
      await invokeContract(
        "activate_program",
        [{ type: "address", value: publicKey }, { type: "u64", value: progId }],
        publicKey
      );

      setLoadingText("Saving metadata...");
      const created = await api.post<ProgramMeta>("/programs", {
        ...form,
        onChainId: progId,
        eligibilityCriteria: [],
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register program");
    } finally {
      setLoading(false);
      setLoadingText(null);
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
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        <select value={form.disasterType} onChange={(e) => setForm({ ...form, disasterType: e.target.value })}>
          {["flood", "drought", "earthquake", "conflict", "epidemic", "cyclone", "mental_health", "healthcare", "other"].map((d) => (
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
          <Button type="submit" variant="signal" loading={loading}>{loadingText || "Register program"}</Button>
        </div>
      </form>
    </Card>
  );
}
