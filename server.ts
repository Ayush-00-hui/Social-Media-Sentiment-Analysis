import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  Tweet,
  CrisisAlert,
  SentimentAggregate,
  BrandComparison,
  AnalysisResult,
  StreamStats,
  SentimentLabel,
} from "./src/types.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (e) {
    console.warn("Gemini client init warning:", e);
  }
}

// In-Memory Database & Live Stream State
let isStreaming = true;
let isSpikeActive = false;
let spikeTopic = "Cloud Outage & Data Sync Bug";

// Base Mock Tweets Pool
const sampleTweetsPool: Partial<Tweet>[] = [
  {
    text: "Absolutely loving the new @TechBrand v4 release! Super clean UI and lightning fast latency.",
    author: "Elena Rostova",
    handle: "@elena_dev",
    topic: "Product Update",
    sentiment: "POSITIVE",
    confidence: 96,
    emotions: { happiness: 92, frustration: 2, anger: 1, surprise: 30, sarcasmProb: 2 },
    entities: [
      { text: "@TechBrand", category: "BRAND" },
      { text: "v4 release", category: "PRODUCT" },
    ],
    sarcasmDetected: false,
    crisisScore: 5,
  },
  {
    text: "Oh great, another 'feature' update that completely broke API authentication. Fantastic work @TechBrand... /s",
    author: "Devon Miles",
    handle: "@dmiles_tech",
    topic: "API Failure",
    sentiment: "NEGATIVE",
    confidence: 94,
    emotions: { happiness: 5, frustration: 88, anger: 72, surprise: 15, sarcasmProb: 95 },
    entities: [
      { text: "@TechBrand", category: "BRAND" },
      { text: "API authentication", category: "PRODUCT" },
    ],
    sarcasmDetected: true,
    crisisScore: 78,
  },
  {
    text: "Is @TechBrand server down in US East region right now? Dashboard is stuck on loading spinner for 20 mins.",
    author: "Marcus Chen",
    handle: "@marcus_c",
    topic: "Outage",
    sentiment: "NEGATIVE",
    confidence: 91,
    emotions: { happiness: 2, frustration: 95, anger: 60, surprise: 40, sarcasmProb: 10 },
    entities: [{ text: "@TechBrand", category: "BRAND" }],
    sarcasmDetected: false,
    crisisScore: 85,
  },
  {
    text: "Comparing @TechBrand vs @CompetitorA for enterprise team setup. @TechBrand's security docs are top notch.",
    author: "Samantha Wright",
    handle: "@sam_cyber",
    topic: "Security",
    sentiment: "POSITIVE",
    confidence: 88,
    emotions: { happiness: 75, frustration: 5, anger: 0, surprise: 10, sarcasmProb: 0 },
    entities: [
      { text: "@TechBrand", category: "BRAND" },
      { text: "@CompetitorA", category: "COMPETITOR" },
    ],
    sarcasmDetected: false,
    crisisScore: 2,
  },
  {
    text: "Customer support response time from @TechBrand took 4 hours, but agent Sarah solved the database migration error smoothly.",
    author: "Liam O'Connor",
    handle: "@liam_ops",
    topic: "Support",
    sentiment: "NEUTRAL",
    confidence: 82,
    emotions: { happiness: 45, frustration: 40, anger: 15, surprise: 5, sarcasmProb: 5 },
    entities: [{ text: "@TechBrand", category: "BRAND" }],
    sarcasmDetected: false,
    crisisScore: 18,
  },
  {
    text: "CRITICAL SECURITY WARNING: Unhandled token expiration loop in @TechBrand SDK exposing session headers! Fix ASAP!",
    author: "ZeroDay Research",
    handle: "@zeroday_labs",
    topic: "Security Bug",
    sentiment: "NEGATIVE",
    confidence: 98,
    emotions: { happiness: 0, frustration: 90, anger: 95, surprise: 70, sarcasmProb: 0 },
    entities: [
      { text: "@TechBrand", category: "BRAND" },
      { text: "SDK", category: "PRODUCT" },
    ],
    sarcasmDetected: false,
    crisisScore: 96,
  },
  {
    text: "Nice job on the new dark mode design @TechBrand! Contrast ratio is super comfortable for night coding.",
    author: "Aria Thorne",
    handle: "@aria_ux",
    topic: "Design",
    sentiment: "POSITIVE",
    confidence: 95,
    emotions: { happiness: 90, frustration: 0, anger: 0, surprise: 15, sarcasmProb: 0 },
    entities: [{ text: "@TechBrand", category: "BRAND" }],
    sarcasmDetected: false,
    crisisScore: 0,
  },
];

let liveTweets: Tweet[] = sampleTweetsPool.map((t, idx) => ({
  id: `tweet-${Date.now() - idx * 300000}`,
  text: t.text!,
  author: t.author!,
  handle: t.handle!,
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${t.handle}`,
  timestamp: new Date(Date.now() - idx * 300000).toISOString(),
  likes: Math.floor(Math.random() * 120) + 5,
  retweets: Math.floor(Math.random() * 45) + 1,
  sentiment: t.sentiment!,
  confidence: t.confidence!,
  emotions: t.emotions!,
  entities: t.entities!,
  sarcasmDetected: t.sarcasmDetected!,
  crisisScore: t.crisisScore!,
  topic: t.topic!,
}));

let alerts: CrisisAlert[] = [
  {
    id: "alert-101",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    severity: "HIGH",
    title: "Negative Sentiment Surge: US-East OAuth Timeout",
    rootCause: "OAuth Token Validation Latency Spike (>3.2s) in v4.1 SDK patch",
    summary: "Surge of 142 negative tweets in 30 mins regarding failed login loops.",
    negativeSpikePct: 38.5,
    zScore: 3.42,
    affectedTopics: ["OAuth", "Login Failure", "US-East"],
    status: "INVESTIGATING",
    suggestedActions: [
      "Roll back SDK release v4.1.2 to v4.1.0",
      "Issue official status page statement on Twitter/X @TechBrandStatus",
      "Notify Engineering On-Call Slack channel #incident-response",
    ],
  },
];

// Generate 24-hour aggregate historical baseline
const now = Date.now();
let hourlyAggregates: SentimentAggregate[] = Array.from({ length: 24 }).map((_, i) => {
  const timeOffset = (23 - i) * 3600000;
  const date = new Date(now - timeOffset);
  const hourStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  // Create a realistic curve with a minor spike around 3-4 hours ago
  const isSpikeHour = i >= 19 && i <= 21;
  const negPct = isSpikeHour ? 48 + Math.floor(Math.random() * 12) : 12 + Math.floor(Math.random() * 10);
  const posPct = isSpikeHour ? 25 : 65 + Math.floor(Math.random() * 15);
  const neuPct = 100 - (negPct + posPct);
  const volume = isSpikeHour ? 850 + Math.floor(Math.random() * 300) : 320 + Math.floor(Math.random() * 80);
  const zScore = isSpikeHour ? 3.1 + Math.random() * 0.8 : 0.4 + Math.random() * 0.5;

  return {
    timestamp: date.toISOString(),
    hourLabel: hourStr,
    positivePct: posPct,
    neutralPct: Math.max(5, neuPct),
    negativePct: negPct,
    tweetVolume: volume,
    zScore: Number(zScore.toFixed(2)),
    crisisFlag: isSpikeHour,
  };
});

// Periodic background tweet simulator
setInterval(() => {
  if (!isStreaming) return;

  const timestamp = new Date().toISOString();
  let newTweet: Tweet;

  if (isSpikeActive) {
    // Generate severe negative crisis tweet
    const templates = [
      `🚨 WARNING @TechBrand: Database connection dropped again! Thousands of active user sessions corrupting! #${spikeTopic.replace(/\s+/g, '')}`,
      `Why is @TechBrand down for the 3rd time today? Completely blocking production deployment. Fix this ASAP!`,
      `Seriously @TechBrand? Data sync error erased my workspace notes. Absolute disaster for enterprise users.`,
      `Is anyone else getting HTTP 500 error on @TechBrand cloud backend? #TechBrandDown #CloudFail`,
    ];
    const text = templates[Math.floor(Math.random() * templates.length)];
    const authors = ["Alex Vance", "Priya Sharma", "David K.", "TechWatch Daily"];
    const handle = `@user_${Math.floor(Math.random() * 8999) + 1000}`;
    const author = authors[Math.floor(Math.random() * authors.length)];

    newTweet = {
      id: `tweet-${Date.now()}`,
      text,
      author,
      handle,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
      timestamp,
      likes: Math.floor(Math.random() * 80) + 12,
      retweets: Math.floor(Math.random() * 35) + 5,
      sentiment: "NEGATIVE",
      confidence: 96,
      emotions: { happiness: 0, frustration: 96, anger: 92, surprise: 40, sarcasmProb: 15 },
      entities: [{ text: "@TechBrand", category: "BRAND" }],
      sarcasmDetected: false,
      crisisScore: 92,
      topic: spikeTopic,
    };
  } else {
    // Generate normal mixed traffic
    const isPos = Math.random() > 0.35;
    const isNeu = !isPos && Math.random() > 0.5;
    const sentiment: SentimentLabel = isPos ? "POSITIVE" : isNeu ? "NEUTRAL" : "NEGATIVE";
    
    const posTexts = [
      "Just deployed our new service using @TechBrand SDK - super smooth DX!",
      "Big shoutout to @TechBrand support for helping us optimize our Postgres query performance.",
      "The new analytics dashboard on @TechBrand is ridiculously clean.",
    ];
    const neuTexts = [
      "Checking out @TechBrand vs @CompetitorA for our Q3 tech stack migration.",
      "@TechBrand release notes dropped for v4.2. Scanning through changelog.",
    ];
    const negTexts = [
      "Small delay on @TechBrand webhooks today, around 1.2s lag on POST events.",
      "Wish @TechBrand had better documentation on custom TLS certificates.",
    ];

    const textList = sentiment === "POSITIVE" ? posTexts : sentiment === "NEUTRAL" ? neuTexts : negTexts;
    const text = textList[Math.floor(Math.random() * textList.length)];
    const handle = `@dev_${Math.floor(Math.random() * 8999) + 1000}`;

    newTweet = {
      id: `tweet-${Date.now()}`,
      text,
      author: "Community Member",
      handle,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
      timestamp,
      likes: Math.floor(Math.random() * 20) + 1,
      retweets: Math.floor(Math.random() * 5),
      sentiment,
      confidence: Math.floor(Math.random() * 15) + 82,
      emotions: {
        happiness: sentiment === "POSITIVE" ? 85 : 10,
        frustration: sentiment === "NEGATIVE" ? 80 : 10,
        anger: sentiment === "NEGATIVE" ? 60 : 5,
        surprise: Math.floor(Math.random() * 30),
        sarcasmProb: Math.floor(Math.random() * 15),
      },
      entities: [{ text: "@TechBrand", category: "BRAND" }],
      sarcasmDetected: false,
      crisisScore: sentiment === "NEGATIVE" ? 45 : 5,
      topic: "General Stream",
    };
  }

  liveTweets.unshift(newTweet);
  if (liveTweets.length > 60) liveTweets.pop();

  // Update real-time aggregate point
  const lastAgg = hourlyAggregates[hourlyAggregates.length - 1];
  const recentNegs = liveTweets.slice(0, 15).filter((t) => t.sentiment === "NEGATIVE").length;
  const recentNegPct = Math.round((recentNegs / 15) * 100);

  if (lastAgg) {
    lastAgg.negativePct = recentNegPct;
    lastAgg.positivePct = Math.max(10, 100 - recentNegPct - 15);
    lastAgg.neutralPct = 100 - lastAgg.negativePct - lastAgg.positivePct;
    lastAgg.tweetVolume += 1;
    lastAgg.zScore = Number(((recentNegPct - 20) / 10).toFixed(2));
    lastAgg.crisisFlag = lastAgg.zScore > 2.5;
  }
}, 4000);

// ================= API ENDPOINTS =================

// 1. Current Stream Stats & Sentiment Gauge
app.get("/api/current_sentiment", (req, res) => {
  const total = liveTweets.length;
  const negs = liveTweets.filter((t) => t.sentiment === "NEGATIVE").length;
  const pos = liveTweets.filter((t) => t.sentiment === "POSITIVE").length;
  const neu = total - negs - pos;

  const currentScore = total > 0 ? Math.round((pos / total) * 100) : 75;
  const negPct = total > 0 ? Math.round((negs / total) * 100) : 15;
  const zScore = Number(((negPct - 20) / 8).toFixed(2));

  let activeCrisisLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (isSpikeActive || zScore > 3.5 || negPct > 55) {
    activeCrisisLevel = 'CRITICAL';
  } else if (zScore > 2.5 || negPct > 40) {
    activeCrisisLevel = 'HIGH';
  } else if (zScore > 1.5 || negPct > 28) {
    activeCrisisLevel = 'MEDIUM';
  }

  const stats: StreamStats = {
    totalAnalyzed: 14820 + liveTweets.length,
    currentScore,
    avgConfidence: 93.4,
    tweetsPerMin: isSpikeActive ? 340 : 85,
    activeCrisisLevel,
    zScore,
    isStreaming,
    isSpikeActive,
  };

  const brandComparisons: BrandComparison[] = [
    {
      brandName: "@TechBrand (Us)",
      positivePct: currentScore,
      neutralPct: Math.round((neu / total) * 100) || 20,
      negativePct: negPct,
      volume: 1240,
      netSentimentScore: currentScore - negPct,
    },
    {
      brandName: "@CompetitorA",
      positivePct: 58,
      neutralPct: 28,
      negativePct: 14,
      volume: 980,
      netSentimentScore: 44,
    },
    {
      brandName: "@CompetitorB",
      positivePct: 42,
      neutralPct: 35,
      negativePct: 23,
      volume: 640,
      netSentimentScore: 19,
    },
  ];

  res.json({
    stats,
    sentimentBreakdown: { positivePct: currentScore, neutralPct: Math.round((neu/total)*100)||20, negativePct: negPct },
    brandComparisons,
    topTopics: [
      { topic: "API & SDK DX", volume: 420, sentiment: "82% Positive" },
      { topic: "Cloud Sync & Outages", volume: 380, sentiment: isSpikeActive ? "88% Negative" : "25% Negative" },
      { topic: "Customer Support", volume: 190, sentiment: "65% Positive" },
      { topic: "Pricing & Plans", volume: 120, sentiment: "55% Neutral" },
    ],
  });
});

// 2. Historical Aggregates
app.get("/api/sentiment_history", (req, res) => {
  res.json(hourlyAggregates);
});

// 3. Active & Past Crisis Alerts
app.get("/api/crisis_alerts", (req, res) => {
  res.json(alerts);
});

// 4. Filtered Tweet Stream
app.get("/api/tweets", (req, res) => {
  const { filter, search } = req.query;
  let filtered = [...liveTweets];

  if (filter === "NEGATIVE") {
    filtered = filtered.filter((t) => t.sentiment === "NEGATIVE");
  } else if (filter === "POSITIVE") {
    filtered = filtered.filter((t) => t.sentiment === "POSITIVE");
  } else if (filter === "SARCASM") {
    filtered = filtered.filter((t) => t.sarcasmDetected);
  } else if (filter === "CRISIS") {
    filtered = filtered.filter((t) => t.crisisScore > 60);
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter((t) => t.text.toLowerCase().includes(q) || t.handle.toLowerCase().includes(q));
  }

  res.json(filtered);
});

// 5. Manual Text Analysis Engine (Gemini 3.6 Flash NLP Inference)
app.post("/api/manual_analyze", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text prompt is required" });
  }

  // Attempt Gemini Server-Side Inference
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Perform fine-grained social media NLP analysis on this text:
"${text}"

Analyze for:
1. Overall Sentiment (POSITIVE, NEUTRAL, or NEGATIVE)
2. Confidence level (0-100)
3. Emotion scores (happiness, frustration, anger, surprise, sarcasmProb, each 0-100)
4. Sarcasm / Irony Detection (boolean)
5. PR Crisis Risk Score (0-100)
6. Named Entity Extraction (extract brands, products, competitors, people)
7. Concise Executive Summary & Reasoning behind classification.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING, description: "POSITIVE, NEUTRAL, or NEGATIVE" },
              confidence: { type: Type.NUMBER },
              emotions: {
                type: Type.OBJECT,
                properties: {
                  happiness: { type: Type.NUMBER },
                  frustration: { type: Type.NUMBER },
                  anger: { type: Type.NUMBER },
                  surprise: { type: Type.NUMBER },
                  sarcasmProb: { type: Type.NUMBER },
                },
                required: ["happiness", "frustration", "anger", "surprise", "sarcasmProb"],
              },
              sarcasmDetected: { type: Type.BOOLEAN },
              crisisScore: { type: Type.NUMBER },
              entities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    category: { type: Type.STRING, description: "BRAND, COMPETITOR, PRODUCT, PERSON, or LOCATION" },
                  },
                  required: ["text", "category"],
                },
              },
              summary: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
            required: ["sentiment", "confidence", "emotions", "sarcasmDetected", "crisisScore", "entities", "summary", "reasoning"],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const result: AnalysisResult = {
          sentiment: (["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(parsed.sentiment) ? parsed.sentiment : "NEUTRAL") as SentimentLabel,
          confidence: Math.round(parsed.confidence || 92),
          emotions: {
            happiness: Math.round(parsed.emotions?.happiness || 0),
            frustration: Math.round(parsed.emotions?.frustration || 0),
            anger: Math.round(parsed.emotions?.anger || 0),
            surprise: Math.round(parsed.emotions?.surprise || 0),
            sarcasmProb: Math.round(parsed.emotions?.sarcasmProb || 0),
          },
          sarcasmDetected: Boolean(parsed.sarcasmDetected),
          crisisScore: Math.round(parsed.crisisScore || 20),
          entities: parsed.entities || [],
          summary: parsed.summary || "Analyzed text sentiment and intent successfully.",
          reasoning: parsed.reasoning || "Contextual transformer embedding evaluation completed.",
          modelUsed: "Gemini 3.6 Flash",
        };
        return res.json(result);
      }
    } catch (err) {
      console.error("Gemini NLP analysis error, falling back to heuristic engine:", err);
    }
  }

  // Fallback Heuristic / Simulated DistilBERT Engine
  const lower = text.toLowerCase();
  const isSarcastic = lower.includes("/s") || lower.includes("great job") && lower.includes("broke") || lower.includes("fantastic") && lower.includes("fail");
  const isNeg = lower.includes("bug") || lower.includes("down") || lower.includes("fail") || lower.includes("hate") || lower.includes("terrible") || lower.includes("worst") || isSarcastic;
  const isPos = !isNeg && (lower.includes("love") || lower.includes("awesome") || lower.includes("great") || lower.includes("fast") || lower.includes("clean") || lower.includes("best"));

  const sentiment: SentimentLabel = isNeg ? "NEGATIVE" : isPos ? "POSITIVE" : "NEUTRAL";
  const confidence = Math.floor(Math.random() * 10) + 88;

  const result: AnalysisResult = {
    sentiment,
    confidence,
    emotions: {
      happiness: sentiment === "POSITIVE" ? 88 : 5,
      frustration: sentiment === "NEGATIVE" ? 85 : 10,
      anger: sentiment === "NEGATIVE" ? 70 : 5,
      surprise: isSarcastic ? 65 : 20,
      sarcasmProb: isSarcastic ? 92 : 12,
    },
    sarcasmDetected: isSarcastic,
    crisisScore: sentiment === "NEGATIVE" ? 82 : 10,
    entities: [
      { text: "@TechBrand", category: "BRAND" },
      ...(lower.includes("api") ? [{ text: "API", category: "PRODUCT" as const }] : []),
    ],
    summary: `Local BERT classification tagged text as ${sentiment} with ${confidence}% confidence.`,
    reasoning: isSarcastic
      ? "Sarcasm flag triggered: detected positive keyphrase juxtaposed with failure indicators."
      : "Standard sentiment lexicon and transformer contextual layer classification applied.",
    modelUsed: "BERT DistilBERT (Simulated)",
  };

  return res.json(result);
});

// 6. Trigger Simulated PR Crisis Spike
app.post("/api/simulate_spike", (req, res) => {
  const { action, topic } = req.body;
  if (action === "TRIGGER") {
    isSpikeActive = true;
    if (topic) spikeTopic = topic;

    const newAlert: CrisisAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: "CRITICAL",
      title: `CRITICAL CRISIS TRIGGERED: ${spikeTopic}`,
      rootCause: `Sudden +${Math.floor(Math.random() * 40) + 120}% surge in negative user comments mentioning ${spikeTopic}`,
      summary: "Z-score anomaly threshold exceeded 4.2. Immediate engineering & PR action required.",
      negativeSpikePct: 78.4,
      zScore: 4.85,
      affectedTopics: [spikeTopic, "System Reliability", "Brand Reputation"],
      status: "ACTIVE",
      suggestedActions: [
        "Post status advisory on @TechBrand social channels",
        "Trigger n8n automated PagerDuty / Slack escalation",
        "Convene emergency incident room with DevOps & PR Lead",
      ],
    };

    alerts.unshift(newAlert);
    res.json({ message: "Crisis spike simulated successfully!", alert: newAlert });
  } else {
    isSpikeActive = false;
    res.json({ message: "Crisis spike resolved. Stream returning to normal baseline." });
  }
});

// 7. Toggle Live Stream Stream
app.post("/api/toggle_stream", (req, res) => {
  isStreaming = !isStreaming;
  res.json({ isStreaming });
});

// 8. n8n Automation Webhook Simulation & JSON Spec
app.post("/api/n8n_webhook", (req, res) => {
  const { event, threshold } = req.body;
  res.json({
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    workflowExecuted: "n8n Social Media Crisis Monitoring & Alerting",
    eventTriggered: event || "Z-Score Anomaly Threshold Exceeded",
    alertPayload: {
      channel: "#incident-social-alerts",
      severity: isSpikeActive ? "CRITICAL" : "NORMAL",
      activeSpikeTopic: spikeTopic,
      actionTaken: "Slack notification sent to @channel, Incident ticket created in Jira.",
    },
  });
});

app.get("/api/n8n/workflow_json", (req, res) => {
  const workflowSpec = {
    name: "Social Media Real-Time Crisis Monitoring Pipeline",
    nodes: [
      {
        id: "1",
        name: "Twitter Stream Poller",
        type: "n8n-nodes-base.cron",
        position: [250, 300],
        parameters: { triggerTimes: { item: [{ mode: "everyX", value: 30, unit: "seconds" }] } },
      },
      {
        id: "2",
        name: "FastAPI / Gemini Sentiment Engine",
        type: "n8n-nodes-base.httpRequest",
        position: [480, 300],
        parameters: { url: "http://fastapi-nlp-engine:3000/api/tweets", method: "GET" },
      },
      {
        id: "3",
        name: "Z-Score Anomaly Detector",
        type: "n8n-nodes-base.if",
        position: [710, 300],
        parameters: { conditions: { number: [{ value1: "={{$json.zScore}}", operation: "larger", value2: 2.5 }] } },
      },
      {
        id: "4",
        name: "PostgreSQL Historical Logger",
        type: "n8n-nodes-base.postgres",
        position: [940, 200],
        parameters: { operation: "executeQuery", query: "INSERT INTO sentiment_scores (tweet_id, sentiment, z_score) VALUES (...);" },
      },
      {
        id: "5",
        name: "Slack Critical Crisis Alert",
        type: "n8n-nodes-base.slack",
        position: [940, 420],
        parameters: { channel: "#crisis-room", text: "🚨 *SOCIAL MEDIA CRISIS ALERT*: Negative spike Z-score exceeded 2.5!" },
      },
    ],
  };
  res.json(workflowSpec);
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentimentPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
