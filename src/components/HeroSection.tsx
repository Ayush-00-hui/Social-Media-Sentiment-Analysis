import React from "react";
import {
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Workflow,
  BarChart3,
  CheckCircle,
  Download,
  Terminal,
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
    <div className="relative overflow-hidden mb-12 rounded-3xl bg-white p-8 sm:p-16 text-center">
      {/* Official Google Antigravity Particle Arch Sprinkles Array */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 pointer-events-none overflow-hidden opacity-90 z-0">
        {/* Red, Blue, Yellow, Green, Purple Floating Dashes & Dots */}
        <div className="absolute top-4 left-1/4 w-3 h-1 bg-[#EA4335] rounded-full rotate-45 animate-dash-1" />
        <div className="absolute top-8 left-1/3 w-2.5 h-1 bg-[#4285F4] rounded-full -rotate-12 animate-dash-2" />
        <div className="absolute top-12 left-1/2 -translate-x-12 w-3.5 h-1 bg-[#FBBC05] rounded-full rotate-12 animate-dash-3" />
        <div className="absolute top-6 right-1/3 w-3 h-1 bg-[#34A853] rounded-full -rotate-45 animate-dash-1" />
        <div className="absolute top-10 right-1/4 w-2.5 h-1 bg-[#A142F4] rounded-full rotate-30 animate-dash-2" />
        
        {/* Additional Floating Color Particles Arc */}
        <div className="absolute top-16 left-1/6 w-2 h-2 bg-[#4285F4] rounded-full animate-dash-3" />
        <div className="absolute top-20 left-2/5 w-1.5 h-1.5 bg-[#EA4335] rounded-full animate-dash-1" />
        <div className="absolute top-14 right-2/5 w-2 h-2 bg-[#34A853] rounded-full animate-dash-2" />
        <div className="absolute top-22 right-1/6 w-1.5 h-1.5 bg-[#FBBC05] rounded-full animate-dash-3" />
        <div className="absolute top-2 left-1/2 w-2 h-2 bg-[#A142F4] rounded-full animate-dash-1" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-6">
        {/* Google Antigravity Header Logo Badge (Matches Screenshot) */}
        <div className="inline-flex items-center space-x-2.5 mb-8">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 2L2 22h20L12 2z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-slate-900" />
            <path d="M12 2L6 14h12L12 2z" fill="#4285F4" />
            <circle cx="12" cy="18" r="2" fill="#EA4335" />
          </svg>
          <span className="text-sm font-bold tracking-tight text-slate-900 font-['Outfit']">
            Google <span className="font-normal text-slate-700">Antigravity</span>
          </span>
        </div>

        {/* Exact Headline from Screenshot */}
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tighter text-slate-900 leading-[1.08] mb-8 font-['Outfit']">
          Experience liftoff with the next-gen agent platform
        </h1>

        {/* Subtitle Description */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Powered by dual Hugging Face DistilBERT inference and automated Z-Score anomaly intelligence (Z ≥ 2.5). Instantly detect PR crisis spikes and dispatch real-time incident webhooks.
        </p>

        {/* Official Pill Action Buttons (Matches Screenshot!) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigateTab("dashboard")}
            className="antigravity-pill-primary flex items-center space-x-2 shadow-lg"
          >
            <Terminal className="w-4 h-4 text-slate-300" />
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigateTab("sandbox")}
            className="antigravity-pill-secondary flex items-center space-x-2"
          >
            <span>Explore use cases</span>
          </button>
        </div>

        {/* Key Real-Time Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/80 pt-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Brand Health Index</span>
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono-code">
              {stats.currentScore}/100
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Real-time DB aggregated
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Z-Score Anomaly</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono-code">
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Threshold: Z ≥ 2.5σ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Ingestion Velocity</span>
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono-code">
              {stats.tweetsPerMin} <span className="text-xs font-normal">tweets/min</span>
            </div>
            <div className="text-[11px] text-cyan-600 font-semibold mt-1">
              Tweepy v2 Stream Active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Total Social Posts</span>
              <Workflow className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono-code">
              {stats.totalAnalyzed.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              Indexed in PostgreSQL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
