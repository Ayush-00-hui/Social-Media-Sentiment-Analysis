"""
SQLAlchemy ORM Database Models & Connection Layer
Self-Hosted PostgreSQL Integration for SentimentPulse AI
"""
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./sentiment.db"
)

try:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True
    )
except Exception as e:
    print(f"[PostgreSQL ORM] Warning creating PostgreSQL engine ({e}). Falling back to local SQLite database.")
    FALLBACK_DB_URL = "sqlite:///./sentimentpulse.db"
    engine = create_engine(
        FALLBACK_DB_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TweetModel(Base):
    __tablename__ = "tweets"

    id = Column(String(64), primary_key=True, index=True)
    text = Column(Text, nullable=False)
    author = Column(String(100))
    handle = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    retweets = Column(Integer, default=0)
    topic = Column(String(100))

    sentiment_score = relationship("SentimentScoreModel", back_populates="tweet", uselist=False)

class SentimentScoreModel(Base):
    __tablename__ = "sentiment_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tweet_id = Column(String(64), ForeignKey("tweets.id"), nullable=False)
    sentiment = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    frustration_score = Column(Float, default=0.0)
    happiness_score = Column(Float, default=0.0)
    sarcasm_detected = Column(Boolean, default=False)
    crisis_score = Column(Float, default=0.0)

    tweet = relationship("TweetModel", back_populates="sentiment_score")

class CrisisAlertModel(Base):
    __tablename__ = "crisis_alerts"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String(20), nullable=False)
    title = Column(Text, nullable=False)
    root_cause = Column(Text)
    z_score = Column(Float, nullable=False)
    negative_spike_pct = Column(Float, default=0.0)
    status = Column(String(20), default="ACTIVE")

class HourlyAggregateModel(Base):
    __tablename__ = "hourly_aggregates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hour_timestamp = Column(DateTime, unique=True, nullable=False)
    positive_pct = Column(Float, nullable=False)
    neutral_pct = Column(Float, nullable=False)
    negative_pct = Column(Float, nullable=False)
    tweet_volume = Column(Integer, nullable=False)
    z_score = Column(Float, default=0.0)
    crisis_flag = Column(Boolean, default=False)

class UserModel(Base):
    __tablename__ = "users"

    email = Column(String(255), primary_key=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    company_name = Column(String(150), nullable=False)
    brand_keywords = Column(Text, nullable=False, default="[]")  # Stored as JSON string
    competitor_keywords = Column(Text, nullable=False, default="[]") # Stored as JSON string
    notification_emails = Column(Text, nullable=False, default="[]") # Stored as JSON string
    plan_tier = Column(String(50), default="Enterprise Pro")
    registered_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    """Initializes tables in PostgreSQL on container launch."""
    try:
        Base.metadata.create_all(bind=engine)
        print("[PostgreSQL ORM] Database schema successfully verified & created.")
    except Exception as e:
        print(f"[PostgreSQL ORM] DB connection initial warning (using fallback): {e}")

def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
