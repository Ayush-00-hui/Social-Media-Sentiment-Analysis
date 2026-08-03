import React from "react";
import {
  Cpu,
  Activity,
  Award,
  Layers,
  Users,
  CheckCircle2,
  Workflow,
} from "lucide-react";

export const AboutUsSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white text-slate-950 p-8 sm:p-12 shadow-md border border-slate-200">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-200 text-xs font-black mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>About SentimentPulse AI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Outfit'] text-slate-950 mb-4">
            Engineering Real-Time Social Media Crisis Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            SentimentPulse AI was built to solve a critical enterprise challenge: identifying PR crisis anomalies in high-volume social media streams <span className="text-slate-950 font-black underline decoration-indigo-500">before</span> they escalate into brand reputational disasters.
          </p>
        </div>
      </div>

      {/* Core Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-slate-400 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-slate-100 text-slate-900 mb-4 flex items-center justify-center border border-slate-200">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-950 mb-2 font-['Outfit']">
            Dual DistilBERT + Gemini Engine
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Runs local Hugging Face DistilBERT pipelines (<span className="font-mono-code text-slate-950 font-bold">sst-2-english</span> and <span className="font-mono-code text-slate-950 font-bold">ner</span>) with model caching and batch inference, backed by optional Gemini 3.6 Flash fallback.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-slate-400 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-slate-100 text-slate-900 mb-4 flex items-center justify-center border border-slate-200">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-950 mb-2 font-['Outfit']">
            Z-Score Anomaly Mathematics
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Statistically calculates negative volume surges against a rolling 24-hour baseline:
            <span className="block my-2 font-mono-code text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-950 font-black">
              Z = (Current_Negative_Vol - Mean_24h) / Std_Dev
            </span>
            Surges with Z ≥ 2.5σ automatically trigger high-severity crisis alerts.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-slate-400 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-slate-100 text-slate-900 mb-4 flex items-center justify-center border border-slate-200">
            <Workflow className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-950 mb-2 font-['Outfit']">
            n8n Automated Incident Escalation
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Master n8n workflow polls the FastAPI engine every 30 seconds, dispatches Slack notifications to <span className="font-mono-code text-slate-950 font-bold">#eng-alerts</span>, emails executive digests, and logs incidents to PostgreSQL.
          </p>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
        <h2 className="text-xl font-black text-slate-950 font-['Outfit'] mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-slate-900" />
          <span>System Technical Specifications</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">Backend API</div>
            <div className="text-sm font-black text-slate-950">FastAPI 0.110 (Python 3.11)</div>
            <div className="text-xs text-slate-500 font-medium">Uvicorn ASGI server with async rate limiting (30 req/min/IP).</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">Database Layer</div>
            <div className="text-sm font-black text-slate-950">PostgreSQL 15 + SQLAlchemy</div>
            <div className="text-xs text-slate-500 font-medium">5 normalized tables: tweets, sentiment_scores, crisis_alerts, hourly_aggregates, users.</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">NLP Pipeline</div>
            <div className="text-sm font-black text-slate-950">DistilBERT + Transformers</div>
            <div className="text-xs text-slate-500 font-medium">SST-2 sentiment + dslim NER token classification + Sarcasm heuristics.</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">Orchestration</div>
            <div className="text-sm font-black text-slate-950">Docker Compose & Native</div>
            <div className="text-xs text-slate-500 font-medium">Multi-stage non-root container with built-in healthchecks.</div>
          </div>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="p-8 rounded-3xl bg-white text-slate-950 shadow-md border border-slate-200">
        <h2 className="text-xl font-black font-['Outfit'] mb-6 flex items-center space-x-2 text-slate-950">
          <Award className="w-5 h-5 text-slate-900" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-black text-slate-950 block mb-0.5">Sub-100ms Inference SLA</span>
              <span className="text-slate-600 font-medium">Optimized DistilBERT pipeline ensures low latency inference for high throughput social streams.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-black text-slate-950 block mb-0.5">Zero Hardcoded Credentials</span>
              <span className="text-slate-600 font-medium">Environment variables strictly isolated via .env and excluded from git tracking.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-black text-slate-950 block mb-0.5">Zero Swallowed Exceptions</span>
              <span className="text-slate-600 font-medium">Every layer provides graceful degradation, explicit logging, and typed fallback metrics.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-black text-slate-950 block mb-0.5">Production Interview Ready</span>
              <span className="text-slate-600 font-medium">Fully documented endpoints, database schema, rate limiting, and master n8n workflow spec.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
