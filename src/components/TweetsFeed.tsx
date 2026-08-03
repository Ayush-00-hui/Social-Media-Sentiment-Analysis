import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Smile,
  Frown,
  AlertCircle,
  ThumbsUp,
  RotateCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Tweet, SentimentLabel } from "../types";

interface TweetsFeedProps {
  tweets: Tweet[];
  onAnalyzeTweet: (tweetText: string) => void;
}

export const TweetsFeed: React.FC<TweetsFeedProps> = ({
  tweets,
  onAnalyzeTweet,
}) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filteredTweets = tweets.filter((t) => {
    if (filter === "NEGATIVE" && t.sentiment !== "NEGATIVE") return false;
    if (filter === "POSITIVE" && t.sentiment !== "POSITIVE") return false;
    if (filter === "SARCASM" && !t.sarcasmDetected) return false;
    if (filter === "CRISIS" && t.crisisScore < 60) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.text.toLowerCase().includes(q) ||
        t.handle.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl flex flex-col h-[580px]">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Real-Time Filtered Social Feed</span>
          </h2>
          <p className="text-xs text-slate-400">
            Live Twitter / X stream with NLP emotion breakdown & sarcasm detection
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by keyword / handle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700/80 text-xs">
            {["ALL", "NEGATIVE", "POSITIVE", "SARCASM", "CRISIS"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all text-[11px] ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tweet Cards List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredTweets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No social media comments match the active filter criteria.
          </div>
        ) : (
          filteredTweets.map((tweet) => (
            <div
              key={tweet.id}
              className={`p-4 rounded-xl border transition-all ${
                tweet.sarcasmDetected
                  ? "bg-purple-950/20 border-purple-800/60"
                  : tweet.sentiment === "NEGATIVE"
                  ? "bg-rose-950/20 border-rose-900/40"
                  : tweet.sentiment === "POSITIVE"
                  ? "bg-emerald-950/20 border-emerald-900/40"
                  : "bg-slate-950/50 border-slate-800"
              }`}
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={tweet.avatar}
                    alt={tweet.author}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-100">
                        {tweet.author}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {tweet.handle}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Topic: {tweet.topic}
                    </span>
                  </div>
                </div>

                {/* Sentiment & Sarcasm Tags */}
                <div className="flex items-center space-x-1.5">
                  {tweet.sarcasmDetected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-purple-400 animate-pulse" />
                      SARCASM DETECTED
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      tweet.sentiment === "POSITIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : tweet.sentiment === "NEGATIVE"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {tweet.sentiment} ({tweet.confidence}%)
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <p className="text-xs text-slate-200 leading-relaxed mb-2 font-sans">
                {tweet.text}
              </p>

              {/* Entity Badges & Emotions Meter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                {/* Entities */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {tweet.entities.map((e, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80 font-mono text-[10px]"
                    >
                      {e.text}
                    </span>
                  ))}
                </div>

                {/* Emotion Breakdown */}
                <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
                  <span>Frustration: {tweet.emotions.frustration}%</span>
                  <span>Happiness: {tweet.emotions.happiness}%</span>
                  <button
                    onClick={() => onAnalyzeTweet(tweet.text)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center underline ml-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze in Sandbox
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
