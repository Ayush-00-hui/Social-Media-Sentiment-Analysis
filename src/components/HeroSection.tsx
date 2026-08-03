import React from "react";
import { ArrowRight, ShieldAlert, Zap, Activity, Workflow, CheckCircle, Terminal, Cpu } from "lucide-react";
import { StreamStats } from "../types";

interface HeroSectionProps {
  stats: StreamStats;
  onNavigateTab: (tab: "dashboard" | "sandbox" | "n8n" | "infra" | "about") => void;
  onSimulateSpike: (action: "TRIGGER" | "RESOLVE") => void;
  isTriggeringSpike: boolean;
}

const S: Record<string, React.CSSProperties> = {
  section: { padding: "80px 0 48px" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "4px 14px", borderRadius: 9999,
    border: "1px solid #e8eaed", background: "#f8f9fa",
    fontFamily: "Google Sans, sans-serif", fontSize: "0.75rem", fontWeight: 700,
    color: "#5f6368", letterSpacing: "0.02em", marginBottom: 28,
  },
  h1: {
    fontFamily: "Google Sans Display, Google Sans, sans-serif",
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 700, letterSpacing: "-0.03em",
    color: "#202124", lineHeight: 1.05,
    maxWidth: 780, margin: "0 auto 24px",
  },
  subtitle: {
    fontFamily: "Google Sans, sans-serif",
    fontSize: "1.0625rem", color: "#5f6368", fontWeight: 400,
    maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6,
  },
  actions: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 72 },
  metricsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
    borderTop: "1px solid #e8eaed", paddingTop: 40,
  },
  metricCell: { padding: "20px 0", textAlign: "left" as const },
  metricLabel: { fontFamily: "Google Sans, sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "#9aa0a6", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  metricValue: { fontFamily: "Google Sans Mono, monospace", fontSize: "1.875rem", fontWeight: 700, color: "#202124", lineHeight: 1 },
  metricSub: { fontFamily: "Google Sans, sans-serif", fontSize: "0.7rem", color: "#34a853", fontWeight: 600, marginTop: 4 },

  featuresSection: { marginTop: 80 },
  featuresHeader: { marginBottom: 40, textAlign: "center" as const },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: "1px solid #e8eaed", borderRadius: 16, overflow: "hidden" },
  featureCard: {
    padding: "32px 28px", background: "#fff",
    borderRight: "1px solid #e8eaed",
    cursor: "pointer", transition: "background 0.15s ease",
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "#f1f3f4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  featureTitle: { fontFamily: "Google Sans, sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#202124", marginBottom: 8 },
  featureDesc: { fontFamily: "Google Sans, sans-serif", fontSize: "0.8125rem", color: "#5f6368", lineHeight: 1.6, marginBottom: 16 },
  featureLink: { display: "flex", alignItems: "center", gap: 4, fontFamily: "Google Sans, sans-serif", fontSize: "0.8125rem", fontWeight: 700, color: "#202124" },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, onNavigateTab }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Hero */}
      <div style={S.section} className="bg-dot-grid">
        <div style={S.badge}>
          <span className="live-dot" />
          Real-Time Social Intelligence · Traccia
        </div>

        <h1 style={S.h1}>
          Monitor sentiment.<br />
          Detect crises early.
        </h1>

        <p style={S.subtitle}>
          Traccia ingests live social streams, runs DistilBERT SST-2 inference,
          and fires statistical Z-Score anomaly alerts before PR crises escalate.
        </p>

        <div style={S.actions}>
          <button className="btn-primary" style={{ padding: "12px 28px", fontSize: "0.9rem" }} onClick={() => onNavigateTab("dashboard")}>
            <Terminal size={15} />
            Open Dashboard
            <ArrowRight size={15} />
          </button>
          <button className="btn-secondary" style={{ padding: "12px 28px", fontSize: "0.9rem" }} onClick={() => onNavigateTab("sandbox")}>
            <Cpu size={15} />
            NLP Sandbox
          </button>
        </div>

        {/* Metrics */}
        <div style={S.metricsGrid}>
          <div style={S.metricCell}>
            <div style={S.metricLabel}>Brand Health</div>
            <div style={S.metricValue}>{stats.currentScore}<span style={{ fontSize: "1rem" }}>/100</span></div>
            <div style={S.metricSub}>↑ Live aggregated</div>
          </div>
          <div style={{ ...S.metricCell, borderLeft: "1px solid #e8eaed", paddingLeft: 24 }}>
            <div style={S.metricLabel}>Z-Score Anomaly</div>
            <div style={S.metricValue}>{stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}<span style={{ fontSize: "1rem" }}>σ</span></div>
            <div style={{ ...S.metricSub, color: "#9aa0a6" }}>Threshold ≥ 2.5σ</div>
          </div>
          <div style={{ ...S.metricCell, borderLeft: "1px solid #e8eaed", paddingLeft: 24 }}>
            <div style={S.metricLabel}>Ingestion Rate</div>
            <div style={S.metricValue}>{stats.tweetsPerMin}<span style={{ fontSize: "1rem" }}>tpm</span></div>
            <div style={{ ...S.metricSub, color: "#1a73e8" }}>Tweepy v2 Stream</div>
          </div>
          <div style={{ ...S.metricCell, borderLeft: "1px solid #e8eaed", paddingLeft: 24 }}>
            <div style={S.metricLabel}>Posts Analyzed</div>
            <div style={S.metricValue}>{stats.totalAnalyzed.toLocaleString()}</div>
            <div style={{ ...S.metricSub, color: "#9334ea" }}>PostgreSQL indexed</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={S.featuresSection}>
        <div style={S.featuresHeader}>
          <p style={{ fontFamily: "Google Sans, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Platform Capabilities</p>
          <h2 style={{ fontFamily: "Google Sans Display, sans-serif", fontSize: "1.875rem", fontWeight: 700, color: "#202124", letterSpacing: "-0.02em", maxWidth: 480, margin: "0 auto" }}>
            Enterprise social intelligence, built to scale
          </h2>
        </div>

        <div style={S.featureGrid}>
          <div
            style={S.featureCard}
            onClick={() => onNavigateTab("sandbox")}
            onMouseOver={e => (e.currentTarget.style.background = "#f8f9fa")}
            onMouseOut={e => (e.currentTarget.style.background = "#fff")}
          >
            <div style={S.featureIcon}><Cpu size={18} color="#202124" /></div>
            <div style={S.featureTitle}>DistilBERT NLP Inference</div>
            <p style={S.featureDesc}>Local SST-2 sentiment pipelines, sarcasm heuristics, and dslim NER token extraction with model caching for sub-100ms SLAs.</p>
            <div style={S.featureLink}>Open Sandbox <ArrowRight size={13} /></div>
          </div>

          <div
            style={S.featureCard}
            onClick={() => onNavigateTab("dashboard")}
            onMouseOver={e => (e.currentTarget.style.background = "#f8f9fa")}
            onMouseOut={e => (e.currentTarget.style.background = "#fff")}
          >
            <div style={S.featureIcon}><ShieldAlert size={18} color="#202124" /></div>
            <div style={S.featureTitle}>Z-Score Anomaly Detection</div>
            <p style={S.featureDesc}>Evaluates negative comment volume spikes against rolling 24h baselines using Z = (X − μ) / σ with Z ≥ 2.5σ auto-trigger.</p>
            <div style={S.featureLink}>View Crisis Alerts <ArrowRight size={13} /></div>
          </div>

          <div
            style={{ ...S.featureCard, borderRight: "none" }}
            onClick={() => onNavigateTab("n8n")}
            onMouseOver={e => (e.currentTarget.style.background = "#f8f9fa")}
            onMouseOut={e => (e.currentTarget.style.background = "#fff")}
          >
            <div style={S.featureIcon}><Workflow size={18} color="#202124" /></div>
            <div style={S.featureTitle}>n8n Workflow Escalation</div>
            <p style={S.featureDesc}>30s cron monitoring loop dispatches Slack notifications to #eng-alerts and logs incidents to PostgreSQL automatically.</p>
            <div style={S.featureLink}>Inspect Workflows <ArrowRight size={13} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};
