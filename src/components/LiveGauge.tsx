import React from "react";
import { ShieldAlert, TrendingUp, TrendingDown, Info } from "lucide-react";

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
  // Angle conversion: 0 = -90deg, 100 = 90deg
  const angle = -90 + (score / 100) * 180;

  let gaugeColor = "text-emerald-400";
  let statusText = "OPTIMAL REPUTATION";
  if (score < 40 || isSpikeActive) {
    gaugeColor = "text-rose-500";
    statusText = "CRISIS PR DETECTED";
  } else if (score < 65) {
    gaugeColor = "text-amber-400";
    statusText = "MODERATE VOLATILITY";
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span>Live Brand Sentiment Health</span>
              <Info className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated real-time stream vector score
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wider border ${
              isSpikeActive
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-bounce"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* SVG Gauge Graphic */}
        <div className="relative w-full max-w-[260px] mx-auto h-[140px] my-2 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
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
              opacity="0.85"
            />

            {/* Needle Pivot */}
            <circle cx="100" cy="100" r="8" fill="#e2e8f0" />

            {/* Needle Indicator */}
            <g transform={`rotate(${angle}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Central Score Display */}
          <div className="absolute bottom-0 text-center">
            <span className={`text-3xl font-extrabold font-mono ${gaugeColor}`}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              / 100 Index
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Percentage Bar */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
          <span className="flex items-center text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Pos: {positivePct}%
          </span>
          <span className="text-slate-400">Neu: {neutralPct}%</span>
          <span className="flex items-center text-rose-400">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            Neg: {negativePct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${positivePct}%` }}
            className="bg-emerald-500 transition-all duration-500"
          />
          <div
            style={{ width: `${neutralPct}%` }}
            className="bg-slate-500 transition-all duration-500"
          />
          <div
            style={{ width: `${negativePct}%` }}
            className="bg-rose-500 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};
