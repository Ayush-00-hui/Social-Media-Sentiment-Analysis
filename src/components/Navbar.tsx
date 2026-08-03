import React from "react";
import { AlertTriangle, RefreshCw, ArrowUpRight, LogOut, User } from "lucide-react";
import { StreamStats } from "../types";
import { useAuth } from "../context/AuthContext";

export type TabType = "overview" | "dashboard" | "sandbox" | "n8n" | "infra" | "about";

interface NavbarProps {
  stats: StreamStats;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onToggleStream: () => void;
  onSimulateSpike: (action: "TRIGGER" | "RESOLVE") => void;
  isTriggeringSpike: boolean;
}

const NAV_LINKS: { id: TabType; label: string }[] = [
  { id: "overview",   label: "Overview"       },
  { id: "dashboard",  label: "Dashboard"      },
  { id: "sandbox",    label: "Sandbox"        },
  { id: "n8n",        label: "Workflows"      },
  { id: "infra",      label: "Infrastructure" },
  { id: "about",      label: "About"          },
];

/* Antigravity wordmark — each letter in a Google-brand color */
const WORDMARK_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335", "#4285F4"];
const WORDMARK = "Traccia";

const WordMark: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 0 }}
    aria-label="Go to overview"
  >
    {WORDMARK.split("").map((char, i) => (
      <span
        key={i}
        style={{
          fontFamily: "'Syne', 'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: "1.375rem",
          letterSpacing: "-0.04em",
          color: WORDMARK_COLORS[i % WORDMARK_COLORS.length],
          lineHeight: 1,
          display: "inline-block",
          transition: "transform 0.15s ease",
        }}
        onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {char}
      </span>
    ))}
  </button>
);

export const Navbar: React.FC<NavbarProps> = ({
  stats, activeTab, setActiveTab, onSimulateSpike, isTriggeringSpike, onToggleStream
}) => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid #e8eaed",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 28px",
        height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* ── Left: Antigravity wordmark logo */}
        <WordMark onClick={() => setActiveTab("overview")} />

        {/* ── Center: Navigation pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  background: isActive ? "#f1f3f4" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.825rem",
                  color: isActive ? "#202124" : "#5f6368",
                  transition: "all 0.12s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = "#f8f9fa"; e.currentTarget.style.color = "#202124"; } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#5f6368"; } }}
              >
                {label}
              </button>
            );
          })}
          {/* Settings Tab conditionally shown if auth logic is in Navbar, or just add it to NAV_LINKS if we pass it down. 
              Actually, since it's an authenticated dashboard now, Settings should just be a tab. */}
          <button
                key="settings"
                onClick={() => setActiveTab("settings")}
                style={{
                  background: activeTab === "settings" ? "#f1f3f4" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: activeTab === "settings" ? 600 : 400,
                  fontSize: "0.825rem",
                  color: activeTab === "settings" ? "#202124" : "#5f6368",
                  transition: "all 0.12s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseOver={e => { if (activeTab !== "settings") { e.currentTarget.style.background = "#f8f9fa"; e.currentTarget.style.color = "#202124"; } }}
                onMouseOut={e => { if (activeTab !== "settings") { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#5f6368"; } }}
              >
                Settings
              </button>
        </div>

        {/* ── Right: Status chip + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

          {/* Live status */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 9999,
            background: stats.isStreaming ? "#e6f4ea" : "#f8f9fa",
            border: `1px solid ${stats.isStreaming ? "#ceead6" : "#e8eaed"}`,
          }}>
            {stats.isStreaming
              ? <span className="live-dot" />
              : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#9aa0a6", display: "inline-block" }} />}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6875rem", fontWeight: 500,
              letterSpacing: "0.06em",
              color: stats.isStreaming ? "#137333" : "#5f6368",
            }}>
              {stats.isStreaming ? "LIVE" : "PAUSED"}
            </span>
          </div>

          {/* Crisis / Resolve */}
          {!stats.isSpikeActive ? (
            <button
              onClick={() => onSimulateSpike("TRIGGER")}
              disabled={isTriggeringSpike}
              className="btn-danger"
            >
              <AlertTriangle size={12} />
              Crisis
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="btn-success"
            >
              <RefreshCw size={12} />
              Resolve
            </button>
          )}

          {/* User Info & Logout */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8, paddingLeft: 12, borderLeft: '1px solid #e8eaed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4285F4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.875rem' }}>
                  {user.company_name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', color: '#202124' }}>
                  {user.company_name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.825rem' }}
              >
                <LogOut size={13} />
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab("infra")}
              className="btn-primary"
              style={{ padding: "7px 18px", fontSize: "0.825rem", marginLeft: 8 }}
            >
              Get started
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
