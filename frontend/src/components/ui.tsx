import { type ButtonHTMLAttributes, type ReactNode } from "react";
import "./ui.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "signal" | "outline" | "ghost";
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = "signal", loading, children, className = "", disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden /> : null}
      <span>{children}</span>
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

const STATUS_STYLES: Record<string, string> = {
  Draft: "pill--muted",
  Funded: "pill--manifest",
  Active: "pill--verified",
  Paused: "pill--warn",
  Closed: "pill--muted",
  pending: "pill--warn",
  approved: "pill--verified",
  rejected: "pill--danger",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={`pill ${STATUS_STYLES[status] ?? "pill--muted"}`}>{status}</span>;
}

export function WalletBadge({ address }: { address: string }) {
  const short = `${address.slice(0, 5)}···${address.slice(-4)}`;
  return <span className="wallet-badge mono">{short}</span>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <p className="eyebrow">Nothing here yet</p>
      <h3>{title}</h3>
      <p className="empty-state__body">{body}</p>
    </div>
  );
}

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__dash" aria-hidden />
      <span>{label}…</span>
    </div>
  );
}
