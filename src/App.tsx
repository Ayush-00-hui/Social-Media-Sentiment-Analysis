import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LiveGauge } from "./components/LiveGauge";
import { SentimentChart } from "./components/SentimentChart";
import { CrisisAlertPanel } from "./components/CrisisAlertPanel";
import { TweetsFeed } from "./components/TweetsFeed";
import { BrandComparisonMatrix } from "./components/BrandComparisonMatrix";
import { ManualAnalyzer } from "./components/ManualAnalyzer";
import { N8nWorkflowVisualizer } from "./components/N8nWorkflowVisualizer";
import { SelfHostedInfraViewer } from "./components/SelfHostedInfraViewer";
import {
  StreamStats,
  Tweet,
  CrisisAlert,
  SentimentAggregate,
  BrandComparison,
  AnalysisResult,
} from "./types";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "sandbox" | "n8n" | "infra">("dashboard");
  const [isTriggeringSpike, setIsTriggeringSpike] = useState(false);
  const [sandboxInitialText, setSandboxInitialText] = useState<string>("");

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "alert" } | null>(null);

  // Core Data States
  const [stats, setStats] = useState<StreamStats>({
    totalAnalyzed: 14820,
    currentScore: 78,
    avgConfidence: 93.4,
    tweetsPerMin: 85,
    activeCrisisLevel: "LOW",
    zScore: 0.45,
    isStreaming: true,
    isSpikeActive: false,
  });

  const [sentimentBreakdown, setSentimentBreakdown] = useState({
    positivePct: 78,
    neutralPct: 12,
    negativePct: 10,
  });

  const [brandComparisons, setBrandComparisons] = useState<BrandComparison[]>([]);
  const [topTopics, setTopTopics] = useState<{ topic: string; volume: number; sentiment: string }[]>([]);
  const [history, setHistory] = useState<SentimentAggregate[]>([]);
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const showToast = (message: string, type: "success" | "alert" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Current Stream Stats
  const fetchCurrentStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/current_sentiment`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSentimentBreakdown(data.sentimentBreakdown);
        setBrandComparisons(data.brandComparisons);
        setTopTopics(data.topTopics);
      }
    } catch (e) {
      console.warn("Failed to fetch stats:", e);
    }
  };

  // Fetch History
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sentiment_history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.warn("Failed to fetch history:", e);
    }
  };

  // Fetch Alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/crisis_alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.warn("Failed to fetch alerts:", e);
    }
  };

  // Fetch Tweets Feed
  const fetchTweets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tweets`);
      if (res.ok) {
        const data = await res.json();
        setTweets(data);
      }
    } catch (e) {
      console.warn("Failed to fetch tweets:", e);
    }
  };

  // Initial & Interval Data Ingestion
  useEffect(() => {
    fetchCurrentStats();
    fetchHistory();
    fetchAlerts();
    fetchTweets();

    const interval = setInterval(() => {
      fetchCurrentStats();
      fetchTweets();
      fetchHistory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleStream = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/toggle_stream`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStats((prev) => ({ ...prev, isStreaming: data.isStreaming }));
        showToast(data.isStreaming ? "Live stream resumed!" : "Live stream paused.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateSpike = async (action: "TRIGGER" | "RESOLVE") => {
    setIsTriggeringSpike(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulate_spike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, topic: "Cloud Outage & Data Sync Bug" }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchCurrentStats();
        fetchAlerts();
        fetchTweets();
        fetchHistory();
        showToast(data.message, action === "TRIGGER" ? "alert" : "success");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTriggeringSpike(false);
    }
  };

  const handleManualAnalyze = async (text: string): Promise<AnalysisResult> => {
    const res = await fetch(`${API_BASE}/api/manual_analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.json();
  };

  const handleTriggerWebhook = async (event: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/webhook/n8n`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, text: "Sample webhook trigger from UI" }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`n8n Webhook Dispatched: ${data.tweet_id || data.status}`, "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyzeSpecificTweet = (tweetText: string) => {
    setSandboxInitialText(tweetText);
    setActiveTab("sandbox");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center space-x-3 transition-all ${
            toast.type === "alert"
              ? "bg-rose-950/90 text-rose-200 border-rose-800"
              : "bg-emerald-950/90 text-emerald-200 border-emerald-800"
          }`}
        >
          {toast.type === "alert" ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Header & Navigation */}
      <Header
        stats={stats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleStream={handleToggleStream}
        onSimulateSpike={handleSimulateSpike}
        isTriggeringSpike={isTriggeringSpike}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Row: Live Gauge & 24h Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <LiveGauge
                  score={stats.currentScore}
                  positivePct={sentimentBreakdown.positivePct}
                  neutralPct={sentimentBreakdown.neutralPct}
                  negativePct={sentimentBreakdown.negativePct}
                  isSpikeActive={stats.isSpikeActive}
                />
              </div>
              <div className="lg:col-span-2">
                <SentimentChart history={history} />
              </div>
            </div>

            {/* Middle Row: Active Crisis Alert Panel */}
            <CrisisAlertPanel
              alerts={alerts}
              onTriggerWebhook={handleTriggerWebhook}
            />

            {/* Bottom Row: Live Tweets Feed & Brand Benchmark Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TweetsFeed
                  tweets={tweets}
                  onAnalyzeTweet={handleAnalyzeSpecificTweet}
                />
              </div>
              <div className="lg:col-span-1">
                <BrandComparisonMatrix
                  brands={brandComparisons}
                  topTopics={topTopics}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "sandbox" && (
          <ManualAnalyzer
            initialText={sandboxInitialText}
            onAnalyze={handleManualAnalyze}
          />
        )}

        {activeTab === "n8n" && (
          <N8nWorkflowVisualizer onTriggerWebhook={handleTriggerWebhook} />
        )}

        {activeTab === "infra" && <SelfHostedInfraViewer />}
      </main>
    </div>
  );
}
