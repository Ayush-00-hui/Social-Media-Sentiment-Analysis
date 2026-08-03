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
import { SignupPage } from "./components/SignupPage";
import { LoginPage } from "./components/LoginPage";
import { SettingsPage } from "./components/SettingsPage";
import { useAuth } from "./context/AuthContext";
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
  const { user, token } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');
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

  const fetchCurrentSentiment = async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/current_sentiment`, { headers });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSentimentBreakdown(data.sentimentBreakdown);
        setBrandComparisons(data.brandComparisons);
        setTopTopics(data.topTopics);
      }
    } catch (err) {
      console.error("Error fetching current sentiment:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/sentiment_history?hours=24`, { headers });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchAlertsAndTweets = async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const [alertsRes, tweetsRes] = await Promise.all([
        fetch(`${API_BASE}/api/alerts?limit=5`, { headers }),
        fetch(`${API_BASE}/api/recent_tweets?limit=8`, { headers }),
      ]);
      if (alertsRes.ok) setCrisisAlerts(await alertsRes.json());
      if (tweetsRes.ok) setRecentTweets(await tweetsRes.json());
    } catch (err) {
      console.error("Error fetching alerts/tweets:", err);
    }
  };

  // Initial & Interval Data Ingestion
  useEffect(() => {
    if (user) {
      fetchCurrentSentiment();
      fetchHistory();
      fetchAlertsAndTweets();

      const interval = setInterval(() => {
        fetchCurrentSentiment();
        fetchAlertsAndTweets();
        fetchHistory();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed to trigger spike");
      setToast({ message: `Crisis simulation ${action.toLowerCase()}ed successfully`, type: "success" });
      fetchCurrentSentiment();
      fetchAlertsAndTweets();
      fetchHistory();
    } catch (err) {
      setToast({ message: "Failed to simulate crisis", type: "alert" });
    } finally {
      setIsTriggeringSpike(false);
    }
  };

  const handleManualAnalyze = async (text: string): Promise<AnalysisResult> => {
    const res = await fetch(`${API_BASE}/api/manual_analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ text }),
    });
    return res.json();
  };

  const handleTriggerWebhook = async (event: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/webhook/n8n`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", animation: "float 10s infinite ease-in-out" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(52,168,83,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", animation: "float 12s infinite ease-in-out reverse" }} />
        
        <Navbar stats={stats} activeTab={activeTab} setActiveTab={setActiveTab} onToggleStream={handleToggleStream} onSimulateSpike={handleSimulateSpike} isTriggeringSpike={isTriggeringSpike} />
        <div style={{ position: "relative", zIndex: 10 }}>
          {authView === 'signup' ? (
            <SignupPage onNavigate={setAuthView} onSuccess={() => setActiveTab("overview")} />
          ) : (
            <LoginPage onNavigate={setAuthView} onSuccess={() => setActiveTab("overview")} />
          )}
        </div>
      </div>
    );
  }

  const hasData = stats.totalAnalyzed > 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-indigo-200/40 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[40rem] h-[40rem] bg-cyan-200/35 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10">
        {toast && (
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, background: toast.type === "alert" ? "#c5221f" : "#137333", color: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,.18)", fontSize: "0.8125rem", fontWeight: 600 }}>
            {toast.type === "alert" ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 4, opacity: 0.8 }}>
              <X size={14} />
            </button>
          </div>
        )}

        <Navbar
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleStream={handleToggleStream}
          onSimulateSpike={handleSimulateSpike}
          isTriggeringSpike={isTriggeringSpike}
        />

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
                  alerts={crisisAlerts}
                  onTriggerWebhook={handleTriggerWebhook}
                />
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", animation: "fade-up 0.4s ease-out" }}>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#202124", letterSpacing: "-0.04em", marginBottom: 8 }}>
                  Real-Time Overview
                </h1>
                <p style={{ fontSize: "1rem", color: "#5f6368" }}>
                  Tracking live sentiment and anomalies across social platforms.
                </p>
              </div>

              {!hasData ? (
                <div style={{ background: '#f8f9fa', border: '1px solid #e8eaed', borderRadius: 16, padding: 60, textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e8eaed', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 24, height: 24, border: '3px solid #5f6368', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#202124', marginBottom: 8 }}>Collecting your first data</h3>
                  <p style={{ color: '#5f6368' }}>The news scraper is running. Check back in a few minutes as articles matching your keywords start rolling in.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 340px", gap: 24, marginBottom: 24, alignItems: "stretch" }}>
                    <LiveGauge
                      score={stats.currentScore}
                      positivePct={sentimentBreakdown.positivePct}
                      neutralPct={sentimentBreakdown.neutralPct}
                      negativePct={sentimentBreakdown.negativePct}
                      isSpikeActive={stats.isSpikeActive}
                    />
                    <SentimentChart history={history} />
                    <CrisisAlertPanel alerts={crisisAlerts} onTriggerWebhook={handleTriggerWebhook} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
                    <TweetsFeed tweets={recentTweets} onAnalyzeTweet={handleAnalyzeSpecificTweet} />
                    <BrandComparisonMatrix brands={brandComparisons} topTopics={topTopics} />
                  </div>
                </>
              )}
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

          {activeTab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
