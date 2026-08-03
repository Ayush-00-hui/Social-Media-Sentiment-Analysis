import React from "react";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface LiveGaugeProps {
  score: number; // 0 to 100
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  isSpikeActive: boolean;
}

export const LiveGauge: React.FC<LiveGaugeProps> = ({
  score,
  positivePct,
  neutralPct,
  negativePct,
  isSpikeActive,
}) => {
  const angle = -90 + (score / 100) * 180;

  let statusText = "OPTIMAL REPUTATION";
  if (score < 40 || isSpikeActive) {
    statusText = "CRISIS PR DETECTED";
  } else if (score < 65) {
    statusText = "MODERATE VOLATILITY";
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 text-slate-950 shadow-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center space-x-2 font-['Outfit']">
              <span>Live Brand Sentiment Health</span>
              <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Aggregated real-time stream vector score
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider border ${
              isSpikeActive
                ? "bg-rose-100 text-rose-800 border-rose-300 animate-bounce"
                : "bg-slate-100 text-slate-900 border-slate-200"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* SVG Gauge Graphic */}
        <div className="relative w-full max-w-[260px] mx-auto h-[140px] my-4 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Gradient Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* Needle Pivot */}
            <circle cx="100" cy="100" r="8" fill="#020617" />

            {/* Needle Indicator */}
            <g transform={`rotate(${angle}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#020617"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Central Score Display */}
          <div className="absolute bottom-0 text-center">
            <span className="text-4xl font-black font-mono-code text-slate-950">
              {score}
            </span>
            <span className="text-[11px] font-extrabold text-slate-500 block uppercase tracking-wider">
              / 100 Index
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Percentage Bar */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between text-xs font-black text-slate-800 mb-1.5 font-mono-code">
          <span className="flex items-center text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Pos: {positivePct}%
          </span>
          <span className="text-slate-600">Neu: {neutralPct}%</span>
          <span className="flex items-center text-rose-700">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            Neg: {negativePct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          <div style={{ width: `${positivePct}%` }} className="bg-emerald-500" />
          <div style={{ width: `${neutralPct}%` }} className="bg-slate-400" />
          <div style={{ width: `${negativePct}%` }} className="bg-rose-500" />
        </div>
      </div>
    </div>
  );
};
