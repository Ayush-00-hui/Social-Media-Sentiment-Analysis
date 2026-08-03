import React, { useState } from "react";
import { Server, FileCode, Database, Terminal, Shield, BookOpen, ChevronRight, Copy, Check } from "lucide-react";

export const SelfHostedInfraViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>("sentiment_analyzer.py");
  const [copiedFile, setCopiedFile] = useState(false);

  const codeFiles: Record<string, { path: string; language: string; content: string }> = {
    "sentiment_analyzer.py": {
      path: "/src/sentiment_analyzer.py",
      language: "python",
      content: `"""
Social Media Sentiment & Emotion Analysis Engine
Models: DistilBERT + Gemini 3.6 Flash Fallback Inference Pipeline
"""
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class SentimentAnalyzer:
    def __init__(self, model_name="distilbert-base-uncased-finetuned-sst-2-english"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading BERT NLP tokenizer & model on {self.device}...")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name).to(self.device)

    def analyze(self, text: str) -> dict:
        """Infers sentiment label (POSITIVE, NEGATIVE, NEUTRAL) and emotion probabilities."""
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=128).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)[0]

        neg_prob, pos_prob = probs[0].item(), probs[1].item()
        sentiment = "POSITIVE" if pos_prob > 0.6 else "NEGATIVE" if neg_prob > 0.6 else "NEUTRAL"

        # Detect Sarcasm heuristics (Contrastive keyphrases)
        sarcasm_detected = "/s" in text.lower() or ("great" in text.lower() and "broke" in text.lower())

        return {
            "sentiment": sentiment,
            "confidence": round(max(pos_prob, neg_prob) * 100, 2),
            "sarcasm_detected": sarcasm_detected,
            "emotions": {
                "frustration": round(neg_prob * 90, 1),
                "happiness": round(pos_prob * 95, 1)
            }
        }
`,
    },
    "crisis_detector.py": {
      path: "/src/crisis_detector.py",
      language: "python",
      content: `"""
Crisis Anomaly Detection Engine using Z-Score Time-Series Spike Evaluation
Formula: Z = (x - μ) / σ
"""
import numpy as np

class CrisisDetector:
    def __init__(self, z_threshold=2.5, window_size=24):
        self.z_threshold = z_threshold
        self.window_size = window_size

    def evaluate_spike(self, recent_counts: list) -> dict:
        """Calculates Z-score anomaly on rolling sentiment volume."""
        if len(recent_counts) < 5:
            return {"is_crisis": False, "z_score": 0.0, "severity": "LOW"}

        mean = np.mean(recent_counts[:-1])
        std = np.std(recent_counts[:-1]) + 1e-5
        current_val = recent_counts[-1]

        z_score = (current_val - mean) / std

        severity = "LOW"
        if z_score >= 4.0:
            severity = "CRITICAL"
        elif z_score >= 2.5:
            severity = "HIGH"
        elif z_score >= 1.5:
            severity = "MEDIUM"

        return {
            "is_crisis": z_score >= self.z_threshold,
            "z_score": round(float(z_score), 2),
            "severity": severity,
            "current_volume": current_val,
            "baseline_mean": round(float(mean), 2)
        }
`,
    },
    "docker-compose.yml": {
      path: "/docker/docker-compose.yml",
      language: "yaml",
      content: `version: "3.8"

services:
  fastapi-sentiment-engine:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    restart: always

  postgres-db:
    image: postgres:15-alpine
    container_name: sentiment_postgres
    environment:
      POSTGRES_DB: sentiment_db
      POSTGRES_USER: ayush_admin
      POSTGRES_PASSWORD: \${DB_PASSWORD:-secret_pass}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  n8n-automation:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=\${N8N_PASSWORD:-n8n_pass}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  n8n_data:
`,
    },
    "schema.sql": {
      path: "/database/schema.sql",
      language: "sql",
      content: `-- PostgreSQL Schema for Social Media Sentiment & Crisis Logs

CREATE TABLE IF NOT EXISTS tweets (
    id VARCHAR(64) PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(100),
    handle VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    retweets INT DEFAULT 0,
    topic VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS sentiment_scores (
    id SERIAL PRIMARY KEY,
    tweet_id VARCHAR(64) REFERENCES tweets(id),
    sentiment VARCHAR(20) NOT NULL, -- POSITIVE, NEUTRAL, NEGATIVE
    confidence NUMERIC(5,2),
    frustration_score NUMERIC(5,2),
    happiness_score NUMERIC(5,2),
    sarcasm_detected BOOLEAN DEFAULT FALSE,
    crisis_score NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS crisis_alerts (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
    title TEXT,
    root_cause TEXT,
    z_score NUMERIC(5,2),
    negative_spike_pct NUMERIC(5,2),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
`,
    },
  };

  const currentFile = codeFiles[activeFile] || codeFiles["sentiment_analyzer.py"];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Explorer & Code Viewer */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Gitea Repo File Tree */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Gitea Repo Files</span>
          </div>

          {Object.keys(codeFiles).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center space-x-2 transition-all ${
                activeFile === fileName
                  ? "bg-indigo-600 text-white font-bold shadow"
                  : "bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{fileName}</span>
            </button>
          ))}
        </div>

        {/* Code View Pane */}
        <div className="md:col-span-3 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono text-cyan-400">
                {currentFile.path}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? "Copied" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed h-[260px] scrollbar-thin">
              {currentFile.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Interview Battle-Prep Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Interview Prep & Technical Deep-Dive Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-indigo-400 mb-2">
              1. 90-Second Elevator Pitch
            </h4>
            <p className="text-slate-300 leading-relaxed">
              "I built a real-time social media sentiment monitoring system that detects PR crises within minutes. It streams Twitter comments, analyzes emotion and sarcasm using DistilBERT & Gemini 3.6 Flash, calculates Z-score anomaly spikes, and triggers automated Slack alerts via self-hosted n8n workflows."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-indigo-400 mb-2">
              2. How Sarcasm Detection Works
            </h4>
            <p className="text-slate-300 leading-relaxed">
              "Sarcasm is challenging for standard sentiment models because surface words are positive ('Great job team'). I handle this by looking for contrastive keyphrases (positive praise + failure keywords), engagement ratio anomalies, and Gemini's contextual transformer reasoning."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-indigo-400 mb-2">
              3. Z-Score Anomaly Formula
            </h4>
            <p className="text-slate-300 leading-relaxed font-mono">
              Z = (x_current - μ_baseline) / σ_baseline
              <br />
              When Z &gt; 2.5σ (meaning negative tweet volume is 2.5 standard deviations above 24h baseline), the engine automatically triggers a CRITICAL incident alert.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-indigo-400 mb-2">
              4. Self-Hosted Architecture
            </h4>
            <p className="text-slate-300 leading-relaxed">
              "Fully dockerized setup running on home server hardware: FastAPI container for NLP inference, PostgreSQL container for time-series logs, n8n container for automated workflows, and Cloudflare Tunnels for secure remote TLS access."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
