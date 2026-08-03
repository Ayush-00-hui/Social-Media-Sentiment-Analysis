import React from "react";
import {
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Workflow,
  CheckCircle,
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
    <div className="relative overflow-hidden mb-12 rounded-3xl bg-white border border-slate-200 p-8 sm:p-20 text-center shadow-xl">
      {/* Background Particle Arch Sprinkles Array */}
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
        {/* Header Logo Badge */}
        <div className="inline-flex items-center space-x-2.5 mb-8 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-sm font-black tracking-tight text-slate-950 font-['Outfit']">
            SentimentPulse<span className="font-bold text-indigo-600">.AI</span> Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-950 leading-[1.04] mb-8 font-['Outfit']">
          Experience liftoff with the next-gen social intelligence engine
        </h1>

        {/* Subtitle Description */}
        <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Powered by dual Hugging Face DistilBERT inference and automated Z-Score anomaly math (Z ≥ 2.5). Instantly detect PR crisis spikes and dispatch real-time incident webhooks.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigateTab("dashboard")}
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-full text-sm font-black px-7 py-3.5 flex items-center space-x-2 shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4 text-slate-300" />
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigateTab("sandbox")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-full text-sm font-black px-7 py-3.5 flex items-center space-x-2 transition-all hover:-translate-y-0.5"
          >
            <span>Explore NLP Sandbox</span>
          </button>
        </div>

        {/* Key Real-Time Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200 pt-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs mb-1 font-bold">
              <span>Brand Health Index</span>
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-950 font-mono-code">
              {stats.currentScore}/100
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Real-time DB aggregated
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs mb-1 font-bold">
              <span>Z-Score Anomaly</span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-950 font-mono-code">
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </div>
            <div className="text-[11px] text-slate-600 font-bold mt-1">
              Threshold: Z ≥ 2.5σ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs mb-1 font-bold">
              <span>Ingestion Velocity</span>
              <Zap className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-950 font-mono-code">
              {stats.tweetsPerMin} <span className="text-xs font-bold">tpm</span>
            </div>
            <div className="text-[11px] text-cyan-700 font-bold mt-1">
              Tweepy v2 Stream Active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs mb-1 font-bold">
              <span>Total Social Posts</span>
              <Workflow className="w-4 h-4 text-purple-600" />
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
  );
};
