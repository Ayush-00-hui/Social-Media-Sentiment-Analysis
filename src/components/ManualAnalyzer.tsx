import React, { useState } from "react";
import { Cpu, Sparkles, Zap } from "lucide-react";
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
            <Cpu className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Interactive NLP Sandbox & Gemini Inference Engine
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Test custom text inputs for fine-grained sentiment classification, emotion probability, sarcasm detection, and NER entities.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-4">
          <label className="text-xs font-extrabold text-slate-800 block mb-1">
            Input Tweet / Comment Text:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any social media post..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-sans font-medium"
          />

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-500 font-bold">Try Samples:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p);
                  handleRunAnalysis(p);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-mono-code font-bold transition-all truncate max-w-[200px]"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleRunAnalysis(inputText)}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>{isAnalyzing ? "Running Gemini Inference..." : "Run AI NLP Analysis"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Results */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Core Sentiment & Sarcasm */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                  Classification Output
                </span>
                <span className="text-[10px] font-mono-code font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  Model: {result.modelUsed}
                </span>
              </div>

              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                <span
                  className={`text-2xl font-black font-mono-code tracking-wide ${
                    result.sentiment === "POSITIVE"
                      ? "text-emerald-700"
                      : result.sentiment === "NEGATIVE"
                      ? "text-rose-700"
                      : "text-amber-700"
                  }`}
                >
                  {result.sentiment}
                </span>
                <span className="text-xs font-bold text-slate-500 block mt-1">
                  Confidence Score: {result.confidence}%
                </span>
              </div>

              {/* Sarcasm Flag */}
              <div
                className={`p-3 rounded-xl border mb-3 flex items-center justify-between ${
                  result.sarcasmDetected
                    ? "bg-purple-50 border-purple-200 text-purple-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className={`w-4 h-4 ${result.sarcasmDetected ? "text-purple-600 animate-pulse" : "text-slate-400"}`} />
                  <span className="text-xs font-extrabold">Sarcasm / Irony Status:</span>
                </div>
                <span className="text-xs font-mono-code font-black">
                  {result.sarcasmDetected ? "DETECTED (High)" : "None"}
                </span>
              </div>

              {/* Crisis Risk */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-extrabold mb-1">
                  <span className="text-slate-700">PR Crisis Risk Score:</span>
                  <span className="text-rose-700 font-mono-code">{result.crisisScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${result.crisisScore}%` }}
                    className={`h-full ${result.crisisScore > 60 ? "bg-rose-500" : "bg-emerald-500"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Emotion Probability Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">
              Emotion Spectrum Probability
            </h3>

            <div className="space-y-3 font-bold">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Frustration</span>
                  <span className="font-mono-code text-rose-700">{result.emotions.frustration}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.frustration}%` }} className="h-full bg-rose-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Anger</span>
                  <span className="font-mono-code text-red-700">{result.emotions.anger}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.anger}%` }} className="h-full bg-red-600" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Happiness</span>
                  <span className="font-mono-code text-emerald-700">{result.emotions.happiness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.happiness}%` }} className="h-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Surprise</span>
                  <span className="font-mono-code text-amber-700">{result.emotions.surprise}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.surprise}%` }} className="h-full bg-amber-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Sarcasm Probability</span>
                  <span className="font-mono-code text-purple-700">{result.emotions.sarcasmProb}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${result.emotions.sarcasmProb}%` }} className="h-full bg-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Entities & Reasoning */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-3">
                NER Entities & Reasoning
              </h3>

              <div className="mb-3">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">
                  Extracted Entities (NER):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.entities.length > 0 ? (
                    result.entities.map((e, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono-code font-bold"
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
                <span className="text-[11px] font-bold text-slate-500 block mb-1">
                  Executive Summary:
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-600 font-mono-code font-bold">
              <span>Reasoning: {result.reasoning}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
