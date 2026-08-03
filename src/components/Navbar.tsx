import React from "react";
import { Activity, AlertTriangle, RefreshCw, Radio, ArrowUpRight } from "lucide-react";
import { StreamStats } from "../types";

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

export const Navbar: React.FC<NavbarProps> = ({
  stats, activeTab, setActiveTab, onSimulateSpike, isTriggeringSpike,
}) => {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid #e8eaed",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <button
          onClick={() => setActiveTab("overview")}
          style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div style={{
            width: 32, height: 32,
            background: "#202124",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: "Google Sans Display, Google Sans, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#202124", letterSpacing: "-0.02em" }}>
            Traccia
          </span>
        </button>

        {/* Center nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                fontFamily: "Google Sans, sans-serif",
                fontWeight: activeTab === id ? 700 : 500,
                fontSize: "0.8125rem",
                color: activeTab === id ? "#202124" : "#5f6368",
                background: activeTab === id ? "#f1f3f4" : "none",
                transition: "all 0.15s ease",
              }}
              onMouseOver={e => { if (activeTab !== id) (e.target as HTMLElement).style.background = "#f8f9fa"; }}
              onMouseOut={e => { if (activeTab !== id) (e.target as HTMLElement).style.background = "none"; }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Live chip */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: 9999, background: "#f8f9fa", border: "1px solid #e8eaed" }}>
            <span className={stats.isStreaming ? "live-dot" : ""} style={!stats.isStreaming ? { width: 7, height: 7, borderRadius: "50%", background: "#9aa0a6", display: "inline-block" } : {}} />
            <span style={{ fontFamily: "Google Sans Mono, monospace", fontSize: "0.7rem", fontWeight: 700, color: stats.isStreaming ? "#137333" : "#5f6368", letterSpacing: "0.04em" }}>
              {stats.isStreaming ? "LIVE" : "PAUSED"}
            </span>
          </div>

          {/* Crisis button */}
          {!stats.isSpikeActive ? (
            <button onClick={() => onSimulateSpike("TRIGGER")} disabled={isTriggeringSpike} className="btn-danger">
              <AlertTriangle size={13} />
              Simulate Crisis
            </button>
          ) : (
            <button onClick={() => onSimulateSpike("RESOLVE")} disabled={isTriggeringSpike} className="btn-success">
              <RefreshCw size={13} style={isTriggeringSpike ? { animation: "spin 1s linear infinite" } : {}} />
              Resolve
            </button>
          )}

          <button onClick={() => setActiveTab("infra")} className="btn-primary">
            Get Started
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};
