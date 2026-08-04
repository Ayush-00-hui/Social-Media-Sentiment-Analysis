import React, { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
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
    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 500,
    color: "#5f6368", letterSpacing: "0.06em", marginBottom: 32,
    textTransform: "uppercase" as const,
  },
  h1: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    fontWeight: 800, letterSpacing: "-0.04em",
    color: "#202124", lineHeight: 1.0,
    maxWidth: 820, margin: "0 auto 24px",
  },
  subtitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "1rem", color: "#5f6368", fontWeight: 400,
    maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.65,
    letterSpacing: "-0.01em",
  },
  actions: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 72 },
  metricsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
    borderTop: "1px solid #e8eaed", paddingTop: 40,
  },
  metricCell: { padding: "20px 0", textAlign: "left" as const },
  metricLabel: { fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, color: "#9aa0a6", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  metricValue: { fontFamily: "var(--font-mono)", fontSize: "1.875rem", fontWeight: 700, color: "#202124", lineHeight: 1 },
  metricSub: { fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#34a853", fontWeight: 600, marginTop: 4 },

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
  featureTitle: { fontFamily: "'Syne', 'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#202124", marginBottom: 8 },
  featureDesc: { fontFamily: "'DM Sans', sans-serif", fontSize: "0.8125rem", color: "#5f6368", lineHeight: 1.65, marginBottom: 16 },
  featureLink: { display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans', sans-serif", fontSize: "0.8125rem", fontWeight: 700, color: "#202124" },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, onNavigateTab }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    
    // Serious, sleek timeline animation
    const tl = createTimeline({
      defaults: {
        ease: 'outExpo',
        duration: 1000
      }
    });

    tl.add({
      targets: '.anime-badge',
      y: [20, 0],
      opacity: [0, 1],
      duration: 800
    })
    .add({
      targets: '.anime-title-line',
      y: [40, 0],
      opacity: [0, 1],
      delay: stagger(150),
      duration: 900
    }, '-=600')
    .add({
      targets: '.anime-subtitle',
      y: [20, 0],
      opacity: [0, 1],
      duration: 800
    }, '-=700')
    .add({
      targets: '.anime-btn',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: stagger(100),
      duration: 600
    }, '-=600')
    .add({
      targets: '.anime-metric',
      y: [20, 0],
      opacity: [0, 1],
      delay: stagger(100),
      duration: 800
    }, '-=500');
  }, []);

  return (
    <div ref={heroRef} style={{ textAlign: "center" }}>
      {/* Hero */}
      <div style={S.section} className="bg-dot-grid">
        <div className="anime-badge" style={{ ...S.badge, opacity: 0 }}>
          <span className="live-dot" />
          Real-Time News Intelligence · Traccia
        </div>

        <h1 style={S.h1}>
          <div className="anime-title-line" style={{ opacity: 0 }}>Monitor sentiment.</div>
          <div className="anime-title-line" style={{ opacity: 0 }}>Detect crises early.</div>
        </h1>

        <p className="anime-subtitle" style={{ ...S.subtitle, opacity: 0 }}>
          Traccia ingests live news streams, runs DistilBERT SST-2 inference,
          and fires statistical Z-Score anomaly alerts before PR crises escalate.
        </p>

        <div style={S.actions}>
          <button className="btn-primary anime-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", opacity: 0 }} onClick={() => onNavigateTab("dashboard")}>
            <Terminal size={15} />
            Open Dashboard
            <ArrowRight size={15} />
          </button>
          <button className="btn-secondary anime-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", opacity: 0 }} onClick={() => onNavigateTab("sandbox")}>
            <Cpu size={15} />
            NLP Sandbox
          </button>
        </div>

        {/* Metrics */}
        <div style={S.metricsGrid}>
          <div className="anime-metric" style={{ ...S.metricCell, opacity: 0 }}>
            <div style={S.metricLabel}>Brand Health</div>
            <div style={S.metricValue}>{stats.currentScore}<span style={{ fontSize: "1rem" }}>/100</span></div>
            <div style={S.metricSub}>↑ Live aggregated</div>
          </div>
          <div className="anime-metric" style={{ ...S.metricCell, opacity: 0 }}>
            <div style={S.metricLabel}>Signal Volume</div>
            <div style={S.metricValue}>{stats.totalAnalyzed.toLocaleString()}</div>
            <div style={S.metricSub}>All sources</div>
          </div>
          <div className="anime-metric" style={{ ...S.metricCell, opacity: 0 }}>
            <div style={S.metricLabel}>Crisis Level</div>
            <div style={{ ...S.metricValue, color: stats.activeCrisisLevel !== "LOW" ? "#ea4335" : "#202124" }}>{stats.activeCrisisLevel}</div>
            <div style={{ ...S.metricSub, color: stats.activeCrisisLevel !== "LOW" ? "#ea4335" : "#9aa0a6" }}>
              Z-Score: {stats.zScore.toFixed(2)}
            </div>
          </div>
          <div className="anime-metric" style={{ ...S.metricCell, opacity: 0 }}>
            <div style={S.metricLabel}>Latency</div>
            <div style={S.metricValue}>12<span style={{ fontSize: "1rem" }}>ms</span></div>
            <div style={S.metricSub}>Avg inference</div>
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
