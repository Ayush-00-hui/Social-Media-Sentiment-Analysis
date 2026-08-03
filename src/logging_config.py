"""
Structured JSON Logging Module for SentimentPulse AI
Provides per-module loggers, JSON formatting, and request-ID tracking
"""
import logging
import json
import uuid
from contextvars import ContextVar
from datetime import datetime, timezone
from typing import Any, Dict

# ContextVar for tracing request IDs across async tasks/threads
request_id_ctx: ContextVar[str] = ContextVar("request_id", default="N/A")

class JSONFormatter(logging.Formatter):
    """Formats log entries into structured JSON objects."""
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id_ctx.get(),
            "module": record.module,
            "line": record.lineno
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data)

def setup_logging(level: int = logging.INFO) -> None:
    """Configures global log handlers with JSON formatting."""
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Avoid duplicate handlers
    if not root_logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        root_logger.addHandler(handler)

def get_logger(name: str) -> logging.Logger:
    """Factory to get a named logger instance."""
    setup_logging()
    return logging.getLogger(name)

def generate_request_id() -> str:
    """Generates a new UUID request ID and sets it in context."""
    req_id = str(uuid.uuid4())
    request_id_ctx.set(req_id)
    return req_id
