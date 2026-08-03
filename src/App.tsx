import React, { useState, useEffect } from "react";
import { Navbar, TabType } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutUsSection } from "./components/AboutUsSection";
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
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isTriggeringSpike, setIsTriggeringSpike] = useState(false);
  const [sandboxInitialText, setSandboxInitialText] = useState<string>("");

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "alert" } | null>(null);

  useEffect(() => {
    // Force light theme
    document.documentElement.classList.remove("dark");
  }, []);

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
        showToast(data.message || (action === "TRIGGER" ? "PR Crisis Spike Activated!" : "Crisis Resolved."), action === "TRIGGER" ? "alert" : "success");
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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12 relative overflow-hidden">
      {/* Google Antigravity Light Ambient Background Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-indigo-200/40 rounded-full blur-[140px] animate-orb-light-1" />
        <div className="absolute top-1/3 -right-32 w-[40rem] h-[40rem] bg-cyan-200/35 rounded-full blur-[140px] animate-orb-light-2" />
        <div className="absolute -bottom-32 left-1/3 w-[42rem] h-[42rem] bg-violet-200/30 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      {/* Main Relative Layer */}
      <div className="relative z-10">
        {/* Toast Notification */}
        {toast && (
          <div
            style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 100,
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 18px", borderRadius: 12,
            background: toast.type === "alert" ? "#c5221f" : "#137333",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,.18)",
            fontFamily: "Google Sans, sans-serif", fontSize: "0.8125rem", fontWeight: 600,
          }}
          >
            {toast.type === "alert" ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 4, opacity: 0.8 }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Global Navigation Bar */}
        <Navbar
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleStream={handleToggleStream}
          onSimulateSpike={handleSimulateSpike}
          isTriggeringSpike={isTriggeringSpike}
        />

        {/* Main Container */}
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 96px" }}>
          {activeTab === "overview" && (
            <div>
              <HeroSection
                stats={stats}
                onNavigateTab={setActiveTab}
                onSimulateSpike={handleSimulateSpike}
                isTriggeringSpike={isTriggeringSpike}
              />
              <div className="space-y-6">
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
                <CrisisAlertPanel
                  alerts={alerts}
                  onTriggerWebhook={handleTriggerWebhook}
                />
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
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

              <CrisisAlertPanel
                alerts={alerts}
                onTriggerWebhook={handleTriggerWebhook}
              />

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

          {activeTab === "about" && <AboutUsSection />}

          {activeTab === "infra" && <SelfHostedInfraViewer />}
        </main>
      </div>
    </div>
  );
}
