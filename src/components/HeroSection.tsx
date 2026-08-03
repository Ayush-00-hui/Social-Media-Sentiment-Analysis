import React from "react";
import {
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Workflow,
  CheckCircle,
  Terminal,
  Cpu,
  Server,
  Sparkles,
  Layers,
  BarChart3,
  MessageSquare,
  Lock,
} from "lucide-react";
import { StreamStats } from "../types";

interface HeroSectionProps {
  stats: StreamStats;
  onNavigateTab: (tab: "dashboard" | "sandbox" | "n8n" | "infra" | "about") => void;
  onSimulateSpike: (action: "TRIGGER" | "RESOLVE") => void;
  isTriggeringSpike: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onNavigateTab,
  onSimulateSpike,
  isTriggeringSpike,
}) => {
  return (
    <div className="space-y-12 mb-16">
      {/* Main Hero Banner with Google Antigravity Particle Arch */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-20 text-center border border-slate-200/90 shadow-xl">
        {/* Google Antigravity Particle Arch Sprinkles Array */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 pointer-events-none overflow-hidden opacity-95 z-0">
          <div className="absolute top-4 left-1/4 w-4 h-1.5 bg-[#EA4335] rounded-full rotate-45 animate-dash-1" />
          <div className="absolute top-8 left-1/3 w-3 h-1.5 bg-[#4285F4] rounded-full -rotate-12 animate-dash-2" />
          <div className="absolute top-12 left-1/2 -translate-x-12 w-4 h-1.5 bg-[#FBBC05] rounded-full rotate-12 animate-dash-3" />
          <div className="absolute top-6 right-1/3 w-4 h-1.5 bg-[#34A853] rounded-full -rotate-45 animate-dash-1" />
          <div className="absolute top-10 right-1/4 w-3 h-1.5 bg-[#A142F4] rounded-full rotate-30 animate-dash-2" />
          
          <div className="absolute top-16 left-1/6 w-2.5 h-2.5 bg-[#4285F4] rounded-full animate-dash-3" />
          <div className="absolute top-20 left-2/5 w-2 h-2 bg-[#EA4335] rounded-full animate-dash-1" />
          <div className="absolute top-14 right-2/5 w-2.5 h-2.5 bg-[#34A853] rounded-full animate-dash-2" />
          <div className="absolute top-22 right-1/6 w-2 h-2 bg-[#FBBC05] rounded-full animate-dash-3" />
          <div className="absolute top-2 left-1/2 w-2.5 h-2.5 bg-[#A142F4] rounded-full animate-dash-1" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto pt-4">
          {/* Traccia.AI Branding Badge */}
          <div className="inline-flex items-center space-x-2.5 mb-8 bg-slate-50 px-4.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <span className="text-xs font-black tracking-tight text-slate-950 font-['Outfit']">
              Traccia<span className="text-indigo-600 font-bold">.AI</span> — Real-Time Social Intelligence
            </span>
          </div>

          {/* Main Headline with Traccia.AI Name */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-950 leading-[1.05] mb-8 font-['Outfit']">
            Experience liftoff with Traccia.AI social sentiment intelligence
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Traccia.AI continuously monitors live social media comment streams, executing fine-grained DistilBERT SST-2 sentiment inference, sarcasm detection, and statistical Z-Score anomaly alerts (Z ≥ 2.5σ).
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigateTab("dashboard")}
              className="pulse-pill-primary flex items-center space-x-2 shadow-lg"
            >
              <Terminal className="w-4 h-4 text-slate-300" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigateTab("sandbox")}
              className="pulse-pill-secondary flex items-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-slate-700" />
              <span>Test NLP Sandbox</span>
            </button>
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/80 pt-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold">
                <span>Brand Health Index</span>
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 font-mono-code">
                {stats.currentScore}/100
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> Real-time DB aggregated
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold">
                <span>Z-Score Anomaly</span>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 font-mono-code">
                {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
              </div>
              <div className="text-[11px] text-slate-600 font-bold mt-1">
                Threshold: Z ≥ 2.5σ
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold">
                <span>Ingestion Velocity</span>
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 font-mono-code">
                {stats.tweetsPerMin} <span className="text-xs font-bold">tpm</span>
              </div>
              <div className="text-[11px] text-cyan-700 font-bold mt-1">
                Tweepy v2 Stream Active
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold">
                <span>Total Social Posts</span>
                <Workflow className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 font-mono-code">
                {stats.totalAnalyzed.toLocaleString()}
              </div>
              <div className="text-[11px] text-indigo-700 font-bold mt-1">
                Indexed in PostgreSQL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traccia.AI Core Platform Features Grid */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-2 block font-mono-code">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Built for Enterprise Social Intelligence & PR Protection
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Explore the core architectural components powering Traccia.AI’s real-time monitoring engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div
            onClick={() => onNavigateTab("sandbox")}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950 mb-2 font-['Outfit']">
              Fine-Grained DistilBERT NLP
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              Executes local SST-2 sentiment pipelines, sarcasm heuristics, and dslim NER token extraction with model caching for sub-100ms SLAs.
            </p>
            <span className="text-xs font-black text-indigo-600 flex items-center">
              Test in NLP Sandbox <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => onNavigateTab("dashboard")}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950 mb-2 font-['Outfit']">
              Z-Score Statistical Anomaly Math
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              Automatically evaluates negative comment volume spikes against rolling 24-hour baselines using Z = (X - μ) / σ (Z ≥ 2.5σ trigger).
            </p>
            <span className="text-xs font-black text-amber-700 flex items-center">
              View Crisis Alerts <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => onNavigateTab("n8n")}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950 mb-2 font-['Outfit']">
              n8n Automated Webhook Escalation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              Master n8n workflow polls the sentiment engine every 30s, dispatches Slack notifications to #eng-alerts, and logs incidents in PostgreSQL.
            </p>
            <span className="text-xs font-black text-emerald-700 flex items-center">
              Inspect n8n Workflows <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
