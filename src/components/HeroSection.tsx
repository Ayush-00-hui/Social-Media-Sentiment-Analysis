import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Workflow,
  BarChart3,
  CheckCircle,
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
    <div className="relative overflow-hidden mb-10 rounded-3xl bg-white border border-slate-200 shadow-xl p-8 sm:p-12 transition-all">
      {/* Decorative Gradient Glow Backdrops */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-200/40 via-cyan-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-200/40 via-indigo-200/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Next-Gen Social Intelligence & Crisis Monitoring Engine</span>
          <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            v2.5
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight sm:leading-tight mb-6 font-['Outfit']">
          Transforming Social Data into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600">
            Real-Time Crisis Intelligence
          </span>
        </h1>

        {/* Hero Description Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
          Powered by Hugging Face <span className="font-semibold text-slate-900">DistilBERT</span> dual NLP inference and automated <span className="font-semibold text-slate-900">Z-Score anomaly math</span> (Z ≥ 2.5). Instantly detect sentiment drops, sarcasm spikes, and dispatch incident webhooks to Slack and Email.
        </p>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => onNavigateTab("dashboard")}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xl shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab("sandbox")}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-md flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>Test NLP Sandbox</span>
          </button>

          <button
            onClick={() => onNavigateTab("about")}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-300/60 flex items-center space-x-2 transition-all"
          >
            <span>Learn About Us</span>
          </button>
        </div>

        {/* Live Key Highlights Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200 pt-8">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Brand Health Index</span>
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono-code">
              {stats.currentScore}/100
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Real-time DB aggregated
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Z-Score Anomaly</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono-code">
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Threshold: Z ≥ 2.5σ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Ingestion Velocity</span>
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono-code">
              {stats.tweetsPerMin} <span className="text-xs font-normal">tweets/min</span>
            </div>
            <div className="text-[11px] text-cyan-600 font-semibold mt-1">
              Tweepy v2 Stream Active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>Total Social Posts</span>
              <Workflow className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono-code">
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
