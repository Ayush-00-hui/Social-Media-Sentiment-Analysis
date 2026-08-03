import React, { useState } from "react";
import { AlertTriangle, Send, CheckCircle, ShieldAlert, Cpu, ChevronRight } from "lucide-react";
import { CrisisAlert } from "../types";

interface CrisisAlertPanelProps {
  alerts: CrisisAlert[];
  onTriggerWebhook: (event: string) => void;
}

export const CrisisAlertPanel: React.FC<CrisisAlertPanelProps> = ({
  alerts,
  onTriggerWebhook,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(
    alerts[0] || null
  );
  const [draftingResponse, setDraftingResponse] = useState(false);
  const [responseDraft, setResponseDraft] = useState<string | null>(null);

  const handleDraftResponse = (alert: CrisisAlert) => {
    setDraftingResponse(true);
    setTimeout(() => {
      setResponseDraft(
        `OFFICIAL STATEMENT (@TechBrand Status Team):\n\n"We are currently investigating reports regarding ${alert.rootCause}. Our engineering team is deployed on root-cause mitigation and an update will be published within 20 minutes. We apologize for any inconvenience caused."`
      );
      setDraftingResponse(false);
    }, 800);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Crisis & Anomaly Alert Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time PR crisis alerts detected by Z-Score anomaly engine
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          {alerts.filter((a) => a.status !== "RESOLVED").length} Active Incident(s)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alert List */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedAlert?.id === alert.id
                  ? "bg-slate-800 border-indigo-500 shadow-lg"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 mb-1">
                {alert.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                {alert.summary}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-rose-400">
                  Spike: +{alert.negativeSpikePct}% Neg
                </span>
                <span className="text-amber-400">Z-Score: {alert.zScore}σ</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Alert Action Details */}
        {selectedAlert && (
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Incident Diagnosis
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Root Cause Extracted
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-2">
                {selectedAlert.title}
              </h4>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 mb-3">
                <p className="text-xs text-slate-300 font-mono">
                  <strong className="text-rose-400">Root Cause:</strong>{" "}
                  {selectedAlert.rootCause}
                </p>
              </div>

              <div className="mb-3">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Suggested Action Protocol:
                </span>
                <ul className="space-y-1">
                  {selectedAlert.suggestedActions.map((action, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start space-x-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {responseDraft && (
                <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-800/80 mb-3 text-xs font-mono text-indigo-200">
                  <p className="font-bold text-indigo-400 mb-1">
                    Generated PR Statement:
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {responseDraft}
                  </pre>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
              <button
                onClick={() => handleDraftResponse(selectedAlert)}
                disabled={draftingResponse}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1 shadow transition-all"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>
                  {draftingResponse ? "Drafting..." : "AI Response Statement"}
                </span>
              </button>

              <button
                onClick={() =>
                  onTriggerWebhook(`Slack Incident Alert: ${selectedAlert.title}`)
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Trigger n8n Slack Webhook</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
