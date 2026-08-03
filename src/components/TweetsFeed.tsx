import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Zap,
  Sparkles,
} from "lucide-react";
import { Tweet } from "../types";

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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md flex flex-col h-[580px]">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
        <div>
          <h2 className="text-base font-extrabold text-slate-950 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Real-Time Filtered Social Feed</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
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
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 w-44 sm:w-56 font-medium"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            {["ALL", "NEGATIVE", "POSITIVE", "SARCASM", "CRISIS"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md font-extrabold transition-all text-[11px] ${
                  filter === f
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tweet Cards List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-300">
        {filteredTweets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No social media comments match the active filter criteria.
          </div>
        ) : (
          filteredTweets.map((tweet) => (
            <div
              key={tweet.id}
              className={`p-4 rounded-xl border transition-all ${
                tweet.sarcasmDetected
                  ? "bg-purple-50 border-purple-200"
                  : tweet.sentiment === "NEGATIVE"
                  ? "bg-rose-50 border-rose-200"
                  : tweet.sentiment === "POSITIVE"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={tweet.avatar}
                    alt={tweet.author}
                    className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-950">
                        {tweet.author}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono-code font-bold">
                        {tweet.handle}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-mono-code font-bold">
                      Topic: {tweet.topic}
                    </span>
                  </div>
                </div>

                {/* Sentiment & Sarcasm Tags */}
                <div className="flex items-center space-x-1.5">
                  {tweet.sarcasmDetected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-purple-600 animate-pulse" />
                      SARCASM DETECTED
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      tweet.sentiment === "POSITIVE"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : tweet.sentiment === "NEGATIVE"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-slate-200 text-slate-800 border border-slate-300"
                    }`}
                  >
                    {tweet.sentiment} ({tweet.confidence}%)
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <p className="text-xs text-slate-900 leading-relaxed mb-2 font-medium">
                {tweet.text}
              </p>

              {/* Entity Badges & Emotions Meter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                {/* Entities */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {tweet.entities.map((e, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono-code text-[10px] font-bold"
                    >
                      {e.text}
                    </span>
                  ))}
                </div>

                {/* Emotion Breakdown */}
                <div className="flex items-center space-x-3 text-slate-600 font-mono-code text-[10px] font-bold">
                  <span>Frustration: {tweet.emotions.frustration}%</span>
                  <span>Happiness: {tweet.emotions.happiness}%</span>
                  <button
                    onClick={() => onAnalyzeTweet(tweet.text)}
                    className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center underline ml-2"
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
