import React from "react";
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Zap,
  Radio,
  BarChart2,
  Cpu,
  Workflow,
  Server,
  RefreshCw,
} from "lucide-react";
import { StreamStats } from "../types";

interface HeaderProps {
  stats: StreamStats;
  activeTab: "dashboard" | "sandbox" | "n8n" | "infra";
  setActiveTab: (tab: "dashboard" | "sandbox" | "n8n" | "infra") => void;
  onToggleStream: () => void;
  onSimulateSpike: (action: "TRIGGER" | "RESOLVE") => void;
  isTriggeringSpike: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  activeTab,
  setActiveTab,
  onToggleStream,
  onSimulateSpike,
  isTriggeringSpike,
}) => {
  return (
    <header className="glass-nav text-white sticky top-0 z-50 shadow-2xl backdrop-blur-2xl border-b border-white/10">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 border border-white/20">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
                SentimentPulse<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">.AI</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                Antigravity NLP Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-Time DistilBERT & Gemini Sentiment Analytics & Z-Score Crisis Intelligence
            </p>
          </div>
        </div>

        {/* Live Pulse & Controls */}
        <div className="flex items-center space-x-3">
          {/* Live Indicator */}
          <div className="flex items-center px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Radio
              className={`w-4 h-4 mr-1.5 ${
                stats.isStreaming ? "text-emerald-400 animate-ping" : "text-slate-500"
              }`}
            />
            <span className="font-medium text-slate-200">
              {stats.isStreaming ? "STREAM ACTIVE" : "PAUSED"}
            </span>
            <span className="mx-2 text-slate-600">|</span>
            <span className="text-slate-400 font-mono">
              {stats.tweetsPerMin} tweets/min
            </span>
          </div>

          {/* Toggle Stream */}
          <button
            onClick={onToggleStream}
            className={`p-2 rounded-lg font-medium text-xs flex items-center space-x-1.5 transition-all ${
              stats.isStreaming
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
            title={stats.isStreaming ? "Pause Live Ingestion" : "Resume Stream"}
          >
            {stats.isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {stats.isStreaming ? "Pause Stream" : "Start Stream"}
            </span>
          </button>

          {/* Simulate Crisis Spike Button */}
          {!stats.isSpikeActive ? (
            <button
              onClick={() => onSimulateSpike("TRIGGER")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-red-900/40 border border-red-500/30 transition-all hover:scale-105"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Simulate PR Crisis Spike</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Resolve Active Crisis</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="bg-slate-950/70 border-t border-slate-800/60 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Total Analyzed:</span>
            <span className="font-mono font-bold text-slate-100">
              {stats.totalAnalyzed.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Brand Health Score:</span>
            <span
              className={`font-mono font-bold ${
                stats.currentScore >= 70
                  ? "text-emerald-400"
                  : stats.currentScore >= 45
                  ? "text-amber-400"
                  : "text-rose-400 animate-pulse"
              }`}
            >
              {stats.currentScore}/100
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Anomaly Z-Score:</span>
            <span
              className={`font-mono font-bold ${
                stats.zScore > 2.5
                  ? "text-rose-400"
                  : stats.zScore > 1.5
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Crisis Status:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                stats.activeCrisisLevel === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                  : stats.activeCrisisLevel === "HIGH"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : stats.activeCrisisLevel === "MEDIUM"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}
            >
              {stats.activeCrisisLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Real-Time Crisis Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "sandbox"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>NLP Sandbox & Gemini Inference</span>
          </button>

          <button
            onClick={() => setActiveTab("n8n")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "n8n"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>n8n Workflow Automation</span>
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "infra"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Self-Hosted Repo & Docker SQL</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
