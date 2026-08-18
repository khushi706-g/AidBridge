import { Link, NavLink } from "react-router-dom";
import { useWallet } from "../lib/useWallet";
import { Button, WalletBadge } from "./ui";
import { useState, useEffect } from "react";
import "./Header.css";

export function Header() {
  const { connected, publicKey, balance, connecting, connect, disconnect, error } = useWallet();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden>
            ▤
          </span>
          <span>
            Aid<span style={{ color: "var(--color-signal)" }}>Bridge</span>
          </span>
        </Link>

        <nav className="site-header__nav">
          <NavLink to="/programs" className="site-header__link">
            Programs
          </NavLink>
          <NavLink to="/dashboard" className="site-header__link">
            Org Dashboard
          </NavLink>
          <NavLink to="/impact" className="site-header__link">
            Impact
          </NavLink>
        </nav>

        <div className="site-header__actions">
          <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ marginRight: '1rem' }}>
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </Button>
          {connected && publicKey ? (
            <div className="site-header__wallet" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {balance && (
                <span className="mono" style={{ fontSize: "0.875rem", color: "var(--color-signal)" }}>
                  {Number(balance).toFixed(2)} XLM
                </span>
              )}
              <WalletBadge address={publicKey} />
              <Button variant="ghost" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => connect().catch(() => undefined)} loading={connecting}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      {error ? (
        <div className="container">
          <p className="site-header__error">{error}</p>
        </div>
      ) : null}
    </header>
  );
}
