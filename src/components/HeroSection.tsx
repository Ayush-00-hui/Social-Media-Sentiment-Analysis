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
    <div className="relative overflow-hidden mb-10 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl p-8 sm:p-12 transition-all">
      {/* Decorative Gradient Glow Backdrops */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-cyan-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/15 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Next-Gen Social Intelligence & Crisis Monitoring Engine</span>
          <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            v2.5
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-tight mb-6 font-['Outfit']">
          Transforming Social Data into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-500 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400">
            Real-Time Crisis Intelligence
          </span>
        </h1>

        {/* Hero Description Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
          Powered by Hugging Face <span className="font-semibold text-slate-900 dark:text-white">DistilBERT</span> dual NLP inference and automated <span className="font-semibold text-slate-900 dark:text-white">Z-Score anomaly math</span> (Z ≥ 2.5). Instantly detect sentiment drops, sarcasm spikes, and dispatch incident webhooks to Slack and Email.
        </p>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => onNavigateTab("dashboard")}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm flex items-center space-x-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab("sandbox")}
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-md flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>Test NLP Sandbox</span>
          </button>

          <button
            onClick={() => onNavigateTab("about")}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-300/60 dark:border-slate-800 flex items-center space-x-2 transition-all"
          >
            <span>Learn About Us</span>
          </button>
        </div>

        {/* Live Key Highlights Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/80 dark:border-slate-800/80 pt-8">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">
              <span>Brand Health Index</span>
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-code">
              {stats.currentScore}/100
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Real-time DB aggregated
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">
              <span>Z-Score Anomaly</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-code">
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Threshold: Z ≥ 2.5σ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">
              <span>Ingestion Velocity</span>
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-code">
              {stats.tweetsPerMin} <span className="text-xs font-normal">tweets/min</span>
            </div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
              Tweepy v2 Stream Active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">
              <span>Total Social Posts</span>
              <Workflow className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-code">
              {stats.totalAnalyzed.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Indexed in PostgreSQL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
