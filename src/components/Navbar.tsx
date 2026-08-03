import React from "react";
import {
  Activity,
  AlertTriangle,
  Radio,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { StreamStats } from "../types";

export type TabType = "overview" | "dashboard" | "sandbox" | "n8n" | "infra" | "about";

interface NavbarProps {
  stats: StreamStats;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onToggleStream: () => void;
  onSimulateSpike: (action: "TRIGGER" | "RESOLVE") => void;
  isTriggeringSpike: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  activeTab,
  setActiveTab,
  onSimulateSpike,
  isTriggeringSpike,
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-950 font-['Outfit']">
            Traccia
          </span>
        </div>

        {/* Center: Minimalist Plain Text Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("overview")}
            className={`transition-colors py-1 ${
              activeTab === "overview" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`transition-colors py-1 ${
              activeTab === "dashboard" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`transition-colors py-1 ${
              activeTab === "sandbox" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            Sandbox
          </button>

          <button
            onClick={() => setActiveTab("n8n")}
            className={`transition-colors py-1 ${
              activeTab === "n8n" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            Workflows
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`transition-colors py-1 ${
              activeTab === "about" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`transition-colors py-1 ${
              activeTab === "infra" ? "text-slate-950 font-black border-b-2 border-slate-950" : "hover:text-slate-950"
            }`}
          >
            Infrastructure
          </button>
        </div>

        {/* Right: Minimal Actions */}
        <div className="flex items-center space-x-3">
          {/* Live Status Pill */}
          <div className="hidden lg:flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
            <Radio
              className={`w-3.5 h-3.5 mr-1.5 ${
                stats.isStreaming ? "text-emerald-600 animate-pulse" : "text-slate-400"
              }`}
            />
            <span>{stats.isStreaming ? "LIVE" : "PAUSED"}</span>
          </div>

          {/* Crisis Button */}
          {!stats.isSpikeActive ? (
            <button
              onClick={() => onSimulateSpike("TRIGGER")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-xs border border-rose-200 transition-all flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Crisis</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateSpike("RESOLVE")}
              disabled={isTriggeringSpike}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs transition-all flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Resolve Crisis</span>
            </button>
          )}

          {/* Minimal Solid Black Pill CTA */}
          <button
            onClick={() => setActiveTab("infra")}
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-black px-5 py-2 flex items-center space-x-1 shadow-sm transition-all"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Submenu */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 py-2 px-6 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-4 text-xs font-bold text-slate-800">
          <button onClick={() => setActiveTab("overview")}>Overview</button>
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("sandbox")}>Sandbox</button>
          <button onClick={() => setActiveTab("n8n")}>Workflows</button>
          <button onClick={() => setActiveTab("about")}>About Us</button>
          <button onClick={() => setActiveTab("infra")}>Infra Spec</button>
        </nav>
      </div>
    </nav>
  );
};
