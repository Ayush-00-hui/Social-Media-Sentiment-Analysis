import React from "react";
import { BrandComparison } from "../types";
import { Award, Layers, PieChart } from "lucide-react";

interface BrandComparisonMatrixProps {
  brands: BrandComparison[];
  topTopics: { topic: string; volume: number; sentiment: string }[];
}

export const BrandComparisonMatrix: React.FC<BrandComparisonMatrixProps> = ({
  brands,
  topTopics,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Brand Benchmark Bars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Competitor Sentiment Benchmark</span>
            </h2>
            <p className="text-xs text-slate-400">
              Net sentiment score share across key industry players
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {brands.map((b) => (
            <div key={b.brandName} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-100">{b.brandName}</span>
                <span className="font-mono text-cyan-400">
                  NPS Index: {b.netSentimentScore > 0 ? `+${b.netSentimentScore}` : b.netSentimentScore}
                </span>
              </div>

              {/* Multi-color bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex mb-2">
                <div style={{ width: `${b.positivePct}%` }} className="bg-emerald-500" />
                <div style={{ width: `${b.neutralPct}%` }} className="bg-slate-500" />
                <div style={{ width: `${b.negativePct}%` }} className="bg-rose-500" />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400">Pos: {b.positivePct}%</span>
                <span>Neu: {b.neutralPct}%</span>
                <span className="text-rose-400">Neg: {b.negativePct}%</span>
                <span className="text-slate-500">Vol: {b.volume} tweets</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Hotspot Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Trending Topic Hotspots</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mentions volume & prevailing opinion per topic
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topTopics.map((t) => (
            <div
              key={t.topic}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-100">{t.topic}</h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Volume: {t.volume} mentions
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  t.sentiment.includes("Negative")
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : t.sentiment.includes("Positive")
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {t.sentiment}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
