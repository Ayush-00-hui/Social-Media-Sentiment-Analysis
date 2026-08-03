import React from "react";
import {
  Activity,
  AlertTriangle,
  Radio,
  RefreshCw,
  Download,
  BarChart2,
  Cpu,
  Workflow,
  Server,
  Users,
  Home,
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
    <header className="bg-white/95 sticky top-0 z-50 shadow-sm backdrop-blur-2xl border-b border-slate-200">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2.5 bg-slate-950 rounded-2xl shadow-md group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-950 font-['Outfit']">
                SentimentPulse<span className="text-indigo-600">.AI</span>
              </span>
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 hidden sm:inline-block">
                NLP Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold">
              Real-Time Social Sentiment & Anomaly Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "overview"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "dashboard"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "sandbox"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("n8n")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "n8n"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "about"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>About Us</span>
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeTab === "infra"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Infra Spec</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          {/* Live Indicator */}
          <div className="hidden xl:flex items-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold">
            <Radio
              className={`w-3.5 h-3.5 mr-1.5 ${
                stats.isStreaming ? "text-emerald-600 animate-ping" : "text-slate-400"
              }`}
            />
            <span className="font-black text-slate-950">
              {stats.isStreaming ? "LIVE STREAM" : "PAUSED"}
            </span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-slate-700 font-mono-code font-bold">
              {stats.tweetsPerMin} tpm
            </span>
          </div>

          {/* Simulate Crisis Spike Button */}
          {!stats.isSpikeActive ? (
            <button
              onClick={() => onSimulateSpike("TRIGGER")}
              disabled={isTriggeringSpike}
              className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center space-x-1.5 border border-rose-200 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Crisis</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Resolve Crisis</span>
            </button>
          )}

          {/* Black CTA Button */}
          <button
            onClick={() => setActiveTab("infra")}
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-black flex items-center space-x-1.5 py-2.5 px-5 shadow-sm transition-all hover:scale-105"
          >
            <span>Get Started</span>
            <Download className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Strip for Mobile */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 py-2.5 px-4 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-3 text-xs font-black text-slate-800">
          <button onClick={() => setActiveTab("overview")} className="whitespace-nowrap">Overview</button>
          <button onClick={() => setActiveTab("dashboard")} className="whitespace-nowrap">Dashboard</button>
          <button onClick={() => setActiveTab("sandbox")} className="whitespace-nowrap">NLP Sandbox</button>
          <button onClick={() => setActiveTab("n8n")} className="whitespace-nowrap">Workflows</button>
          <button onClick={() => setActiveTab("about")} className="whitespace-nowrap">About Us</button>
          <button onClick={() => setActiveTab("infra")} className="whitespace-nowrap">Infra Spec</button>
        </nav>
      </div>
    </header>
  );
};
