import React from "react";
import {
  ShieldCheck,
  Cpu,
  Database,
  Workflow,
  Zap,
  Activity,
  Award,
  Layers,
  Code,
  Users,
  CheckCircle2,
} from "lucide-react";

export const AboutUsSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-600/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-semibold mb-4 backdrop-blur-md">
            <Users className="w-3.5 h-3.5" />
            <span>About SentimentPulse AI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Outfit'] mb-4">
            Engineering Real-Time Social Media Crisis Intelligence
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-normal">
            SentimentPulse AI was built to solve a critical enterprise challenge: identifying PR crisis anomalies in high-volume social media streams <span className="text-white font-semibold underline decoration-cyan-400">before</span> they escalate into brand reputational disasters.
          </p>
        </div>
      </div>

      {/* Core Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-indigo-500/40 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4 flex items-center justify-center border border-indigo-100">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
            Dual DistilBERT + Gemini Engine
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Runs local Hugging Face DistilBERT pipelines (<span className="font-mono text-indigo-600 font-semibold">sst-2-english</span> and <span className="font-mono text-indigo-600 font-semibold">ner</span>) with model caching and batch inference, backed by optional Gemini 3.6 Flash fallback.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-amber-500/40 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-4 flex items-center justify-center border border-amber-100">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
            Z-Score Anomaly Mathematics
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Statistically calculates negative volume surges against a rolling 24-hour baseline:
            <span className="block my-2 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-amber-700 font-bold">
              Z = (Current_Negative_Vol - Mean_24h) / Std_Dev
            </span>
            Surges with Z ≥ 2.5σ automatically trigger high-severity crisis alerts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-cyan-500/40 transition-all">
          <div className="p-3 w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 mb-4 flex items-center justify-center border border-cyan-100">
            <Workflow className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
            n8n Automated Incident Escalation
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Master n8n workflow polls the FastAPI engine every 30 seconds, dispatches Slack notifications to <span className="font-mono text-cyan-700 font-semibold">#eng-alerts</span>, emails executive digests, and logs incidents to PostgreSQL.
          </p>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg">
        <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>System Technical Specifications</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Backend API</div>
            <div className="text-sm font-bold text-slate-900">FastAPI 0.110 (Python 3.11)</div>
            <div className="text-xs text-slate-500">Uvicorn ASGI server with async rate limiting (30 req/min/IP).</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Database Layer</div>
            <div className="text-sm font-bold text-slate-900">PostgreSQL 15 + SQLAlchemy</div>
            <div className="text-xs text-slate-500">5 normalized tables: tweets, sentiment_scores, crisis_alerts, hourly_aggregates, users.</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">NLP Pipeline</div>
            <div className="text-sm font-bold text-slate-900">DistilBERT + Transformers</div>
            <div className="text-xs text-slate-500">SST-2 sentiment + dslim NER token classification + Sarcasm heuristics.</div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Orchestration</div>
            <div className="text-sm font-bold text-slate-900">Docker Compose & Native</div>
            <div className="text-xs text-slate-500">Multi-stage non-root container with built-in healthchecks.</div>
          </div>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <h2 className="text-xl font-extrabold font-['Outfit'] mb-6 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-100 block mb-0.5">Sub-100ms Inference SLA</span>
              <span className="text-slate-300">Optimized DistilBERT pipeline ensures low latency inference for high throughput social streams.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-100 block mb-0.5">Zero Hardcoded Credentials</span>
              <span className="text-slate-300">Environment variables strictly isolated via .env and excluded from git tracking.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-100 block mb-0.5">Zero Swallowed Exceptions</span>
              <span className="text-slate-300">Every layer provides graceful degradation, explicit logging, and typed fallback metrics.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-100 block mb-0.5">Production Interview Ready</span>
              <span className="text-slate-300">Fully documented endpoints, database schema, rate limiting, and master n8n workflow spec.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
