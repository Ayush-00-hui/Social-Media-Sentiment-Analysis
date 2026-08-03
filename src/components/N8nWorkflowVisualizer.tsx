import React, { useState } from "react";
import { Workflow, Play, Download, Copy, Check, Terminal, Zap, ArrowRight, ShieldAlert, Database, MessageSquare } from "lucide-react";

interface N8nWorkflowVisualizerProps {
  onTriggerWebhook: (event: string) => void;
}

export const N8nWorkflowVisualizer: React.FC<N8nWorkflowVisualizerProps> = ({
  onTriggerWebhook,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[n8n Engine] Active workflow: Social Media Crisis Detection Pipeline v1.2",
    "[Cron Node] Scheduled trigger initialized (interval: 30s)",
    "[Postgres Node] Connected to self-hosted postgresql://localhost:5432/sentiment_db",
  ]);

  const n8nJsonSpec = {
    name: "Social Media Real-Time Crisis Monitoring & Alerting Pipeline",
    nodes: [
      {
        id: "node-1",
        name: "Twitter Stream Poller",
        type: "n8n-nodes-base.cron",
        position: [250, 300],
        parameters: { triggerTimes: { item: [{ mode: "everyX", value: 30, unit: "seconds" }] } },
      },
      {
        id: "node-2",
        name: "FastAPI / Gemini Sentiment Engine",
        type: "n8n-nodes-base.httpRequest",
        position: [500, 300],
        parameters: { url: "http://fastapi-nlp-engine:3000/api/tweets", method: "GET" },
      },
      {
        id: "node-3",
        name: "Z-Score Anomaly Evaluator",
        type: "n8n-nodes-base.if",
        position: [750, 300],
        parameters: { conditions: { number: [{ value1: "={{$json.zScore}}", operation: "larger", value2: 2.5 }] } },
      },
      {
        id: "node-4",
        name: "PostgreSQL Historical Logger",
        type: "n8n-nodes-base.postgres",
        position: [1000, 200],
        parameters: { operation: "executeQuery", query: "INSERT INTO sentiment_scores (tweet_id, sentiment, z_score) VALUES (...);" },
      },
      {
        id: "node-5",
        name: "Slack Critical Crisis Alert",
        type: "n8n-nodes-base.slack",
        position: [1000, 420],
        parameters: { channel: "#crisis-room", text: "🚨 *SOCIAL MEDIA CRISIS ALERT*: Negative spike Z-score exceeded 2.5!" },
      },
    ],
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(n8nJsonSpec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(n8nJsonSpec, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "social-media-monitoring.json";
    a.click();
  };

  const handleRunTestExecution = () => {
    setIsExecuting(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] ⚡ Executing n8n manual trigger...`,
      `[${timestamp}] [Node 1: Twitter] Polled 45 new tweets from stream filter @TechBrand`,
      `[${timestamp}] [Node 2: Gemini NLP] Inferred sentiment: 78% Neg, Sarcasm: TRUE, Z-Score: 3.42σ`,
      `[${timestamp}] [Node 3: IF Evaluator] Z-Score 3.42 > 2.5 Threshold → TRUE (Branch 1 Executed)`,
      `[${timestamp}] [Node 4: Postgres] Executed INSERT into tweets & sentiment_scores (45 rows)`,
      `[${timestamp}] [Node 5: Slack] Dispatched payload to #incident-social-alerts webhook`,
      `[${timestamp}] ✅ Workflow Execution Finished in 142ms`,
    ]);

    setTimeout(() => {
      setIsExecuting(false);
      onTriggerWebhook("Manual n8n Workflow Test Triggered");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Workflow Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-600/30 border border-rose-500/40 rounded-xl">
              <Workflow className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                n8n Self-Hosted Automation Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                Continuous polling, FastAPI sentiment inference, Z-score anomaly evaluation, PostgreSQL storage, and Slack incident dispatching.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunTestExecution}
              disabled={isExecuting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isExecuting ? "Executing..." : "Test Execute n8n Workflow"}</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {/* Workflow Visual Nodes Canvas */}
        <div className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 overflow-x-auto my-4 scrollbar-thin">
          <div className="flex items-center space-x-4 min-w-[800px] justify-between">
            {/* Node 1 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center w-48 shadow-lg">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Cron Poller</h4>
              <p className="text-[10px] text-slate-400 font-mono">Every 30 seconds</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

            {/* Node 2 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center w-48 shadow-lg">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">FastAPI NLP Engine</h4>
              <p className="text-[10px] text-slate-400 font-mono">Gemini 3.6 / BERT</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

            {/* Node 3 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center w-48 shadow-lg">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Z-Score Anomaly IF</h4>
              <p className="text-[10px] text-slate-400 font-mono">Z-Score &gt; 2.5σ</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

            {/* Branch Nodes */}
            <div className="flex flex-col space-y-3 w-48">
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-800 text-center shadow-lg">
                <Database className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <h4 className="text-[11px] font-bold text-slate-100">PostgreSQL Logger</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-rose-800 text-center shadow-lg">
                <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <h4 className="text-[11px] font-bold text-slate-100">Slack Incident Alert</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Execution Console */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              n8n Live Execution Console
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Host: http://n8n-selfhosted:5678
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 h-[180px] overflow-y-auto space-y-1 scrollbar-thin">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
