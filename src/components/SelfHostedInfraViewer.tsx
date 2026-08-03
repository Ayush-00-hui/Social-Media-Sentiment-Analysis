import React, { useState } from "react";
import { Server, Database, Code, Copy } from "lucide-react";

export const SelfHostedInfraViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"docker" | "schema" | "endpoints">("docker");
  const [copied, setCopied] = useState(false);

  const dockerComposeYaml = `version: "3.8"

services:
  postgres-db:
    image: postgres:15-alpine
    container_name: traccia-postgres
    environment:
      POSTGRES_DB: traccia_db
      POSTGRES_USER: ayush_admin
      POSTGRES_PASSWORD: secret_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ayush_admin -d traccia_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  fastapi-sentiment-engine:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: traccia-fastapi
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://ayush_admin:secret_pass@postgres-db:5432/traccia_db
      - TWITTER_BEARER_TOKEN=\${TWITTER_BEARER_TOKEN}
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      postgres-db:
        condition: service_healthy

  n8n-automation:
    image: n8nio/n8n:latest
    container_name: traccia-n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http

volumes:
  pgdata:`;

  const dbSchemaSql = `-- Traccia AI PostgreSQL Schema
CREATE TABLE IF NOT EXISTS tweets (
    id VARCHAR(64) PRIMARY KEY,
    author VARCHAR(64) NOT NULL,
    handle VARCHAR(64) NOT NULL,
    text TEXT NOT NULL,
    topic VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sentiment_scores (
    id SERIAL PRIMARY KEY,
    tweet_id VARCHAR(64) REFERENCES tweets(id) ON DELETE CASCADE,
    sentiment VARCHAR(16) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    sarcasm_detected BOOLEAN DEFAULT FALSE,
    crisis_score INT DEFAULT 0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crisis_alerts (
    id SERIAL PRIMARY KEY,
    alert_level VARCHAR(16) NOT NULL,
    z_score NUMERIC(5, 2) NOT NULL,
    root_cause TEXT NOT NULL,
    summary TEXT NOT NULL,
    affected_topics TEXT[] DEFAULT '{}',
    suggested_actions TEXT[] DEFAULT '{}',
    status VARCHAR(16) DEFAULT 'ACTIVE',
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(128),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
            <Server className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
              Traccia AI Docker & SQL Infrastructure Architecture
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Complete production container setup for running PostgreSQL 15, FastAPI sentiment server, and n8n automation natively or via Docker Compose.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-900 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("docker")}
            className={`w-full p-3 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between ${
              activeTab === "docker"
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>docker-compose.yml</span>
            <Code className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("schema")}
            className={`w-full p-3 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between ${
              activeTab === "schema"
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>database/schema.sql</span>
            <Database className="w-4 h-4" />
          </button>
        </div>

        {/* Code Content */}
        <div className="md:col-span-3 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-code font-bold text-slate-400">
              {activeTab === "docker" ? "docker-compose.yml" : "database/schema.sql"}
            </span>
            <button
              onClick={() => copyToClipboard(activeTab === "docker" ? dockerComposeYaml : dbSchemaSql)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "Copied!" : "Copy Spec"}</span>
            </button>
          </div>

          <pre className="font-mono-code text-xs text-slate-200 overflow-x-auto p-3 bg-slate-900 rounded-lg max-h-[360px] scrollbar-thin">
            {activeTab === "docker" ? dockerComposeYaml : dbSchemaSql}
          </pre>
        </div>
      </div>
    </div>
  );
};
