import React, { useState } from "react";
import { Cpu, Sparkles, Zap, ShieldAlert, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { AnalysisResult } from "../types";

interface ManualAnalyzerProps {
  initialText?: string;
  onAnalyze: (text: string) => Promise<AnalysisResult>;
}

export const ManualAnalyzer: React.FC<ManualAnalyzerProps> = ({
  initialText = "Oh great, another 'patch' from @TechBrand that completely broke API auth. Fantastic work team... /s",
  onAnalyze,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const samplePrompts = [
    "Oh great, another 'patch' from @TechBrand that completely broke API auth. Fantastic work team... /s",
    "CRITICAL BUG: Unhandled token expiration loop in @TechBrand SDK exposing session headers! Fix ASAP!",
    "Just deployed our production stack on @TechBrand cloud. Response times dropped by 45%! Incredible work.",
    "Is @TechBrand server down in US East region right now? Dashboard stuck on spinner for 20 mins.",
  ];

  const handleRunAnalysis = async (textToRun: string) => {
    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(textToRun);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-xl">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Interactive NLP Sandbox & Gemini 3.6 Flash Inference Engine
            </h2>
            <p className="text-xs text-slate-400">
              Test custom text inputs for fine-grained sentiment classification, emotion probability, sarcasm detection, and NER entities.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Input Tweet / Comment Text:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any social media post..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400 font-semibold">Try Samples:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p);
                  handleRunAnalysis(p);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition-all truncate max-w-[200px]"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleRunAnalysis(inputText)}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{isAnalyzing ? "Running Gemini Inference..." : "Run AI NLP Analysis"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Results */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Core Sentiment & Sarcasm */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Classification Output
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Model: {result.modelUsed}
                </span>
              </div>

              <div className="text-center py-4 bg-slate-950/80 rounded-xl border border-slate-800 mb-4">
                <span
                  className={`text-2xl font-extrabold font-mono tracking-wide ${
                    result.sentiment === "POSITIVE"
                      ? "text-emerald-400"
                      : result.sentiment === "NEGATIVE"
                      ? "text-rose-400"
                      : "text-amber-400"
                  }`}
                >
                  {result.sentiment}
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Confidence Score: {result.confidence}%
                </span>
              </div>

              {/* Sarcasm Flag */}
              <div
                className={`p-3 rounded-xl border mb-3 flex items-center justify-between ${
                  result.sarcasmDetected
                    ? "bg-purple-950/40 border-purple-800 text-purple-300"
                    : "bg-slate-950/40 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className={`w-4 h-4 ${result.sarcasmDetected ? "text-purple-400 animate-pulse" : "text-slate-500"}`} />
                  <span className="text-xs font-bold">Sarcasm / Irony Status:</span>
                </div>
                <span className="text-xs font-mono font-bold">
                  {result.sarcasmDetected ? "DETECTED (High)" : "None"}
                </span>
              </div>

              {/* Crisis Risk */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">PR Crisis Risk Score:</span>
                  <span className="text-rose-400 font-mono">{result.crisisScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${result.crisisScore}%` }}
                    className={`h-full ${result.crisisScore > 60 ? "bg-rose-500" : "bg-emerald-500"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Emotion Probability Breakdown */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
              Emotion Spectrum Probability
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Frustration</span>
                  <span className="font-mono text-rose-400">{result.emotions.frustration}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.frustration}%` }} className="h-full bg-rose-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Anger</span>
                  <span className="font-mono text-red-400">{result.emotions.anger}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.anger}%` }} className="h-full bg-red-600" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Happiness</span>
                  <span className="font-mono text-emerald-400">{result.emotions.happiness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.happiness}%` }} className="h-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Surprise</span>
                  <span className="font-mono text-amber-400">{result.emotions.surprise}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.surprise}%` }} className="h-full bg-amber-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Sarcasm Probability</span>
                  <span className="font-mono text-purple-400">{result.emotions.sarcasmProb}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.sarcasmProb}%` }} className="h-full bg-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Entities & Reasoning */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                NER Entities & Reasoning
              </h3>

              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Extracted Entities (NER):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.entities.length > 0 ? (
                    result.entities.map((e, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono"
                      >
                        {e.text} ({e.category})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No explicit brand/product entities extracted.</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Executive Summary:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>Reasoning: {result.reasoning}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
