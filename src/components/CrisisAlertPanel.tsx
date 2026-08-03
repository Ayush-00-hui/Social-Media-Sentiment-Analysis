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
    <div className="bg-white rounded-3xl border border-slate-200 p-6 text-slate-950 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center space-x-2 font-['Outfit']">
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
            <span>Crisis & Anomaly Alert Center</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time PR crisis alerts detected by Z-Score anomaly engine
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedAlert?.id === alert.id
                  ? "bg-slate-100 border-slate-950 shadow-md"
                  : "bg-slate-50 border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-[11px] text-slate-500 font-mono-code font-bold">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-950 mb-1">
                {alert.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-2">
                {alert.summary}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono-code font-bold">
                <span className="text-rose-700">
                  Spike: +{alert.negativeSpikePct}% Neg
                </span>
                <span className="text-amber-700">Z-Score: {alert.zScore}σ</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Alert Action Details */}
        {selectedAlert && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                  Incident Diagnosis
                </span>
                <span className="text-xs font-mono-code font-bold text-emerald-700 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Root Cause Extracted
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-950 mb-2">
                {selectedAlert.title}
              </h4>

              <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3">
                <p className="text-xs text-slate-800 font-mono-code font-medium">
                  <strong className="text-rose-700">Root Cause:</strong>{" "}
                  {selectedAlert.rootCause}
                </p>
              </div>

              <div className="mb-3">
                <span className="text-xs font-bold text-slate-600 block mb-1">
                  Suggested Action Protocol:
                </span>
                <ul className="space-y-1">
                  {selectedAlert.suggestedActions.map((action, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 font-medium flex items-start space-x-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {responseDraft && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 mb-3 text-xs font-mono-code text-indigo-900">
                  <p className="font-black text-indigo-700 mb-1">
                    Generated PR Statement:
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-xs font-medium">
                    {responseDraft}
                  </pre>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
              <button
                onClick={() => handleDraftResponse(selectedAlert)}
                disabled={draftingResponse}
                className="px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1 shadow transition-all"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>
                  {draftingResponse ? "Drafting..." : "Draft Executive Statement"}
                </span>
              </button>

              <button
                onClick={() =>
                  onTriggerWebhook(`Slack Incident Alert: ${selectedAlert.title}`)
                }
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center space-x-1 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-indigo-600" />
                <span>Trigger n8n Slack Webhook</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
