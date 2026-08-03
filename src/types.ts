export type SentimentLabel = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface EmotionScores {
  happiness: number; // 0-100
  frustration: number; // 0-100
  anger: number; // 0-100
  surprise: number; // 0-100
  sarcasmProb: number; // 0-100
}

export interface EntityMention {
  text: string;
  category: 'BRAND' | 'COMPETITOR' | 'PRODUCT' | 'PERSON' | 'LOCATION';
}

export interface Tweet {
  id: string;
  text: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  likes: number;
  retweets: number;
  sentiment: SentimentLabel;
  confidence: number; // 0-100
  emotions: EmotionScores;
  entities: EntityMention[];
  sarcasmDetected: boolean;
  crisisScore: number; // 0-100
  topic: string;
}

export interface CrisisAlert {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  rootCause: string;
  summary: string;
  negativeSpikePct: number;
  zScore: number;
  affectedTopics: string[];
  status: 'ACTIVE' | 'RESOLVED' | 'INVESTIGATING';
  suggestedActions: string[];
}

export interface SentimentAggregate {
  timestamp: string;
  hourLabel: string;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  tweetVolume: number;
  zScore: number;
  crisisFlag: boolean;
}

export interface BrandComparison {
  brandName: string;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  volume: number;
  netSentimentScore: number; // -100 to +100
}

export interface AnalysisResult {
  sentiment: SentimentLabel;
  confidence: number;
  emotions: EmotionScores;
  sarcasmDetected: boolean;
  crisisScore: number;
  entities: EntityMention[];
  summary: string;
  reasoning: string;
  modelUsed: 'Gemini 3.6 Flash' | 'BERT DistilBERT (Simulated)' | 'VADER Rule-Engine';
}

export interface StreamStats {
  totalAnalyzed: number;
  currentScore: number; // 0-100 overall health
  avgConfidence: number;
  tweetsPerMin: number;
  activeCrisisLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  zScore: number;
  isStreaming: boolean;
  isSpikeActive: boolean;
}
