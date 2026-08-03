import React, { useState } from "react";
import { Workflow, Play, CheckCircle, Clock, AlertTriangle, ArrowRight, ShieldCheck, Mail, MessageSquare, Database } from "lucide-react";

interface N8nWorkflowVisualizerProps {
  onTriggerWebhook: (event: string) => void;
}

export const N8nWorkflowVisualizer: React.FC<N8nWorkflowVisualizerProps> = ({
  onTriggerWebhook,
}) => {
  const [activeTab, setActiveTab] = useState<"section1" | "section2">("section1");
  const [logs, setLogs] = useState<string[]>([
    "[12:00:00] n8n Cron Trigger: 30s monitoring loop active.",
    "[12:00:00] HTTP Request GET /api/current_sentiment -> 200 OK.",
    "[12:00:01] Anomaly Evaluator: Z-Score = +0.45 (Below 2.5 threshold). No crisis alert dispatched.",
  ]);

  const triggerTestFlow = (name: string) => {
    onTriggerWebhook(name);
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Manual Webhook Dispatched: ${name}`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl">
              <Workflow className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                n8n Master Workflow Automation Architecture
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Production multi-stage workflow spec (<span className="font-mono-code text-indigo-700 font-bold">social-media-monitoring.json</span>) with dual crisis alerts & user registration.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("section1")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                activeTab === "section1"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              Section 1: Crisis Alerting
            </button>
            <button
              onClick={() => setActiveTab("section2")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                activeTab === "section2"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              Section 2: User Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-950 font-['Outfit'] flex items-center space-x-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>Interactive Workflow Execution Flow</span>
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => triggerTestFlow("SIMULATE_30S_POLL")}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Test 30s Poll Node</span>
            </button>

            <button
              onClick={() => triggerTestFlow("SIMULATE_USER_REGISTRATION")}
              className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>Test Webhook Onboarding</span>
            </button>
          </div>
        </div>

        {/* Workflow Diagram Nodes */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto my-4 scrollbar-thin">
          <div className="flex items-center justify-between min-w-[700px] space-x-4 text-xs font-extrabold">
            <div className="p-4 rounded-xl bg-white border border-slate-300 text-center w-48 shadow-sm">
              <Clock className="w-5 h-5 mx-auto mb-1 text-orange-600" />
              <span className="block font-black text-slate-950">1. Scheduled Poll</span>
              <span className="text-[10px] text-slate-500 font-normal">Every 30 seconds</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />

            <div className="p-4 rounded-xl bg-white border border-slate-300 text-center w-48 shadow-sm">
              <Workflow className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
              <span className="block font-black text-slate-950">2. Fetch Live Stats</span>
              <span className="text-[10px] text-slate-500 font-normal">FastAPI /current_sentiment</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />

            <div className="p-4 rounded-xl bg-white border border-slate-300 text-center w-48 shadow-sm">
              <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <span className="block font-black text-slate-950">3. Z-Score Anomaly Gate</span>
              <span className="text-[10px] text-slate-500 font-normal">Evaluates Z ≥ 2.5 threshold</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />

            <div className="space-y-2 w-48 shrink-0">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center shadow-sm">
                <MessageSquare className="w-4 h-4 mx-auto mb-0.5 text-emerald-700" />
                <span className="text-[11px] font-black text-emerald-900">4. Slack Crisis Alert</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-center shadow-sm">
                <Mail className="w-4 h-4 mx-auto mb-0.5 text-rose-700" />
                <span className="text-[11px] font-black text-rose-900">5. Email Digest & DB Log</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
          n8n Execution Log Stream
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono-code text-xs text-emerald-400 h-[180px] overflow-y-auto space-y-1 scrollbar-thin">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
