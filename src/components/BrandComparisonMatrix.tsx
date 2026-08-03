import React from "react";
import { BrandComparison } from "../types";
import { Award, Layers } from "lucide-react";

interface BrandComparisonMatrixProps {
  brands: BrandComparison[];
  topTopics: { topic: string; volume: number; sentiment: string }[];
}

export const BrandComparisonMatrix: React.FC<BrandComparisonMatrixProps> = ({
  brands,
  topTopics,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Brand Benchmark Bars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950 flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Competitor Sentiment Benchmark</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Net sentiment score share across key industry players
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {brands.map((b) => (
            <div key={b.brandName} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                <span className="text-slate-950">{b.brandName}</span>
                <span className="font-mono-code text-indigo-700 font-bold">
                  NPS Index: {b.netSentimentScore > 0 ? `+${b.netSentimentScore}` : b.netSentimentScore}
                </span>
              </div>

              {/* Multi-color bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex mb-2">
                <div style={{ width: `${b.positivePct}%` }} className="bg-emerald-500" />
                <div style={{ width: `${b.neutralPct}%` }} className="bg-slate-400" />
                <div style={{ width: `${b.negativePct}%` }} className="bg-rose-500" />
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 font-mono-code font-bold">
                <span className="text-emerald-700">Pos: {b.positivePct}%</span>
                <span>Neu: {b.neutralPct}%</span>
                <span className="text-rose-700">Neg: {b.negativePct}%</span>
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
            <h2 className="text-base font-extrabold text-slate-950 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Trending Topic Hotspots</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Mentions volume & prevailing opinion per topic
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topTopics.map((t) => (
            <div
              key={t.topic}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-extrabold text-slate-950">{t.topic}</h4>
                <span className="text-[11px] text-slate-500 font-mono-code font-bold">
                  Volume: {t.volume} mentions
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                  t.sentiment.includes("Negative")
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : t.sentiment.includes("Positive")
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-200 text-slate-800"
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
