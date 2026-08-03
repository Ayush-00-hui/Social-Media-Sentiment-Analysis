import React from "react";
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Radio,
  BarChart2,
  Cpu,
  Workflow,
  Server,
  RefreshCw,
  Home,
  Users,
} from "lucide-react";
import { StreamStats } from "../types";

export type TabType = "overview" | "dashboard" | "sandbox" | "n8n" | "infra" | "about";

interface HeaderProps {
  stats: StreamStats;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
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
    <header className="bg-white/90 sticky top-0 z-50 shadow-sm backdrop-blur-2xl border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Title */}
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center space-x-3.5 cursor-pointer group"
        >
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 border border-white/40 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit']">
                SentimentPulse<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">.AI</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
                Antigravity NLP Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Real-Time DistilBERT & Gemini Sentiment Analytics & Z-Score Crisis Intelligence
            </p>
          </div>
        </div>

        {/* Live Pulse & Controls */}
        <div className="flex items-center space-x-3">
          {/* Live Stream Indicator */}
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <Radio
              className={`w-4 h-4 mr-1.5 ${
                stats.isStreaming ? "text-emerald-600 animate-ping" : "text-slate-400"
              }`}
            />
            <span className="font-semibold text-slate-800">
              {stats.isStreaming ? "STREAM LIVE" : "PAUSED"}
            </span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-slate-600 font-mono-code font-medium">
              {stats.tweetsPerMin} tweets/min
            </span>
          </div>

          {/* Toggle Stream Button */}
          <button
            onClick={onToggleStream}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition-all ${
              stats.isStreaming
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
            }`}
            title={stats.isStreaming ? "Pause Live Ingestion" : "Resume Stream"}
          >
            {stats.isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {stats.isStreaming ? "Pause" : "Resume"}
            </span>
          </button>

          {/* Simulate Crisis Spike Button */}
          {!stats.isSpikeActive ? (
            <button
              onClick={() => onSimulateSpike("TRIGGER")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 border border-red-500/30 transition-all hover:scale-105"
            >
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>Simulate PR Crisis</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 border border-emerald-400/30 transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Resolve Crisis</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="bg-white border-t border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Total Analyzed:</span>
            <span className="font-mono-code font-bold text-slate-900">
              {stats.totalAnalyzed.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Brand Health Score:</span>
            <span
              className={`font-mono-code font-bold ${
                stats.currentScore >= 70
                  ? "text-emerald-600"
                  : stats.currentScore >= 45
                  ? "text-amber-600"
                  : "text-rose-600 animate-pulse"
              }`}
            >
              {stats.currentScore}/100
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Anomaly Z-Score:</span>
            <span
              className={`font-mono-code font-bold ${
                stats.zScore > 2.5
                  ? "text-rose-600"
                  : stats.zScore > 1.5
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {stats.zScore > 0 ? `+${stats.zScore}` : stats.zScore}σ
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Crisis Status:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                stats.activeCrisisLevel === "CRITICAL"
                  ? "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                  : stats.activeCrisisLevel === "HIGH"
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : stats.activeCrisisLevel === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {stats.activeCrisisLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Overview & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Crisis Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "sandbox"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>NLP Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("n8n")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "n8n"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>n8n Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "about"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>About Us</span>
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "infra"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Infrastructure Spec</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
