-- PostgreSQL Schema for Social Media Sentiment & Crisis Logs
-- Designed for Self-Hosted Home Server Setup

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

CREATE TABLE IF NOT EXISTS hourly_aggregates (
    id SERIAL PRIMARY KEY,
    hour_timestamp TIMESTAMPTZ UNIQUE NOT NULL,
    positive_pct NUMERIC(5,2),
    neutral_pct NUMERIC(5,2),
    negative_pct NUMERIC(5,2),
    tweet_volume INT,
    z_score NUMERIC(5,2),
    crisis_flag BOOLEAN DEFAULT FALSE
);
