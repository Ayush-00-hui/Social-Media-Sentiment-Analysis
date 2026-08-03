import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SentimentAggregate } from "../types";
import { AlertTriangle, Clock } from "lucide-react";

interface SentimentChartProps {
  history: SentimentAggregate[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ history }) => {
  const [metric, setMetric] = useState<"sentiment" | "zscore">("sentiment");

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 text-slate-950 shadow-md flex flex-col justify-between h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center space-x-2 font-['Outfit']">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>24-Hour Sentiment & Anomaly Trend</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time hourly time series with Z-score spike indicators
          </p>
        </div>

        {/* Toggle View */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMetric("sentiment")}
            className={`px-3 py-1 rounded-lg font-black transition-all ${
              metric === "sentiment"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sentiment Breakdown (%)
          </button>
          <button
            onClick={() => setMetric("zscore")}
            className={`px-3 py-1 rounded-lg font-black transition-all ${
              metric === "zscore"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Z-Score Anomaly (σ)
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[220px] min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {metric === "sentiment" ? (
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hourLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                itemStyle={{ color: "#020617", fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="positivePct"
                name="Positive %"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#posGrad)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="negativePct"
                name="Negative %"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#negGrad)"
                strokeWidth={2.5}
              />
            </AreaChart>
          ) : (
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="zGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hourLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 6]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                itemStyle={{ color: "#020617", fontWeight: "bold" }}
              />
              <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Crisis Trigger (2.5σ)", fill: "#ef4444", fontSize: 10, fontWeight: "bold" }} />
              <Area
                type="monotone"
                dataKey="zScore"
                name="Z-Score (σ)"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#zGrad)"
                strokeWidth={2.5}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200 font-medium">
        <span className="flex items-center text-rose-700 font-bold">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          Z-Score Anomaly Threshold: &gt; 2.5σ
        </span>
        <span className="font-mono-code font-bold">Window: Rolling 24 Hours</span>
      </div>
    </div>
  );
};
