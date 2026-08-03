import React from "react";
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Radio,
  RefreshCw,
  Download,
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
    <header className="glass-nav-pulse sticky top-0 z-50 transition-colors bg-white/90 backdrop-blur-2xl border-b border-slate-200">
      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: SentimentPulse.AI Brand Logo */}
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="p-2 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 border border-white/40 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-black tracking-tight text-slate-950 font-['Outfit']">
              SentimentPulse<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">.AI</span>
            </span>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 hidden sm:inline-block">
              NLP Engine
            </span>
          </div>
        </div>

        {/* Center: Minimalist Bold Dropdown Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-extrabold text-slate-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "overview" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "dashboard" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            Crisis Dashboard
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "sandbox" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            NLP Inference
          </button>

          <button
            onClick={() => setActiveTab("n8n")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "n8n" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            n8n Automation
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "about" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`hover:text-slate-950 transition-colors py-1 ${
              activeTab === "infra" ? "text-slate-950 font-black border-b-2 border-slate-950" : ""
            }`}
          >
            Infrastructure
          </button>
        </nav>

        {/* Right: Actions & Download Pill Button */}
        <div className="flex items-center space-x-3">
          {/* Live Indicator Pill */}
          <div className="hidden lg:flex items-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold">
            <Radio
              className={`w-3.5 h-3.5 mr-1.5 ${
                stats.isStreaming ? "text-emerald-600 animate-ping" : "text-slate-400"
              }`}
            />
            <span className="font-extrabold text-slate-900">
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
              className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-xs flex items-center space-x-1.5 border border-rose-200 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate PR Crisis</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Resolve Crisis</span>
            </button>
          )}

          {/* Top Right Black Pill Download CTA Button */}
          <button
            onClick={() => setActiveTab("infra")}
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs flex items-center space-x-1.5 py-2 px-4 shadow-sm font-extrabold transition-all"
          >
            <span>Download</span>
            <Download className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Strip for Mobile Screens */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 py-2 px-4 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-3 text-xs font-extrabold text-slate-800">
          <button onClick={() => setActiveTab("overview")} className="whitespace-nowrap">Overview</button>
          <button onClick={() => setActiveTab("dashboard")} className="whitespace-nowrap">Dashboard</button>
          <button onClick={() => setActiveTab("sandbox")} className="whitespace-nowrap">NLP Sandbox</button>
          <button onClick={() => setActiveTab("n8n")} className="whitespace-nowrap">n8n Workflow</button>
          <button onClick={() => setActiveTab("about")} className="whitespace-nowrap">About Us</button>
          <button onClick={() => setActiveTab("infra")} className="whitespace-nowrap">Infra Spec</button>
        </nav>
      </div>
    </header>
  );
};
