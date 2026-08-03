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
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>24-Hour Sentiment & Anomaly Trend</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time hourly time series with Z-score spike indicators
          </p>
        </div>

        {/* Toggle View */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700/80 text-xs">
          <button
            onClick={() => setMetric("sentiment")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metric === "sentiment"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sentiment Breakdown (%)
          </button>
          <button
            onClick={() => setMetric("zscore")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metric === "zscore"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
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
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hourLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Area
                type="monotone"
                dataKey="positivePct"
                name="Positive %"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#posGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="negativePct"
                name="Negative %"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#negGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="zGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hourLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 6]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Crisis Trigger (2.5σ)", fill: "#ef4444", fontSize: 10 }} />
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

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
        <span className="flex items-center text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          Z-Score Anomaly Threshold: &gt; 2.5σ
        </span>
        <span className="font-mono">Window: Rolling 24 Hours</span>
      </div>
    </div>
  );
};
