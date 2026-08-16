import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { useWallet } from "../lib/useWallet";
import { Button } from "./ui";
import "./FeedbackForm.css";

export function FeedbackForm() {
  const { publicKey, connect } = useWallet();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [role, setRole] = useState<"beneficiary" | "org" | "donor" | "visitor">("visitor");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const wallet = publicKey ?? (await connect());
      await api.post("/feedback", { stellarWallet: wallet, role, rating, comment });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    }
  }

  if (submitted) {
    return <p className="feedback-form__thanks">Thanks — your feedback was recorded.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <div className="feedback-form__rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`feedback-form__star ${n <= rating ? "is-active" : ""}`}
            onClick={() => setRating(n)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
      <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="feedback-form__select">
        <option value="visitor">Visitor</option>
        <option value="beneficiary">Beneficiary</option>
        <option value="org">Organization</option>
        <option value="donor">Donor</option>
      </select>
      <textarea
        placeholder="What worked, what didn't?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="feedback-form__comment"
      />
      {error ? <p className="org-auth__error">{error}</p> : null}
      <Button type="submit" variant="outline">
        Submit feedback
      </Button>
    </form>
  );
}
