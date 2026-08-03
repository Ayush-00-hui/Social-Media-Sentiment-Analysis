"""
DistilBERT Dual-Engine Sentiment & Entity Analyzer
Loads distilbert-base-uncased-finetuned-sst-2-english and dslim/distilbert-ner pipelines with model caching and batch inference.
Includes fallback heuristics for offline execution.
"""
import functools
from typing import Dict, Any, List, Union
from src.logging_config import get_logger

logger = get_logger("SentimentAnalyzer")

try:
    import torch
    from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer, AutoModelForTokenClassification
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers/PyTorch not installed. Using fallback NLP heuristics.")

@functools.lru_cache(maxsize=1)
def get_sentiment_pipeline():
    """Lazy loads and caches DistilBERT sentiment classification model pipeline."""
    if not TRANSFORMERS_AVAILABLE:
        return None
    try:
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        logger.info(f"Loading Sentiment Model pipeline: {model_name}")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        device = 0 if torch.cuda.is_available() else -1
        return pipeline("sentiment-analysis", model=model, tokenizer=tokenizer, device=device)
    except Exception as e:
        logger.warning(f"Failed to load DistilBERT model weights from HF Hub ({e}). Falling back to heuristic engine.")
        return None

@functools.lru_cache(maxsize=1)
def get_ner_pipeline():
    """Lazy loads and caches DistilBERT NER token classification pipeline."""
    if not TRANSFORMERS_AVAILABLE:
        return None
    try:
        model_name = "dslim/distilbert-ner"
        logger.info(f"Loading NER Model pipeline: {model_name}")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForTokenClassification.from_pretrained(model_name)
        device = 0 if torch.cuda.is_available() else -1
        return pipeline("ner", model=model, tokenizer=tokenizer, device=device, aggregation_strategy="simple")
    except Exception as e:
        logger.warning(f"Failed to load DistilBERT NER model weights ({e}). Falling back to heuristic NER engine.")
        return None

class SentimentAnalyzer:
    def __init__(self, model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"):
        self.model_name = model_name

    def _fallback_analyze(self, text: str) -> Dict[str, Any]:
        """Heuristic analysis fallback when HuggingFace transformers models are unavailable."""
        lower = text.lower()
        sarcasm_detected = "/s" in lower or ("great" in lower and "broke" in lower) or ("fantastic" in lower and "fail" in lower)
        is_neg = "bug" in lower or "down" in lower or "broke" in lower or "fail" in lower or "slow" in lower or "terrible" in lower or sarcasm_detected
        is_pos = not is_neg and ("love" in lower or "awesome" in lower or "great" in lower or "smooth" in lower or "fast" in lower or "amazing" in lower)
        
        sentiment = "NEGATIVE" if is_neg else "POSITIVE" if is_pos else "NEUTRAL"
        confidence = 94.5 if (is_neg or is_pos) else 82.0
        
        entities = []
        words = text.split()
        for w in words:
            if w.startswith("@") or w.startswith("#"):
                entities.append({"text": w, "category": "BRAND" if w.startswith("@") else "HASHTAG"})

        return {
            "text": text,
            "sentiment": sentiment,
            "confidence": confidence,
            "sarcasm_detected": sarcasm_detected,
            "emotions": {
                "frustration": 88.0 if is_neg else 10.0,
                "happiness": 92.0 if is_pos else 5.0,
                "anger": 75.0 if is_neg else 0.0,
                "surprise": 60.0 if sarcasm_detected else 15.0,
                "sarcasm_prob": 95.0 if sarcasm_detected else 5.0
            },
            "crisis_score": 85.0 if is_neg else 10.0,
            "entities": entities
        }

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyzes a single text string using DistilBERT model with fallback."""
        if not text or not text.strip():
            return self._fallback_analyze("")

        sentiment_pipe = get_sentiment_pipeline()
        ner_pipe = get_ner_pipeline()

        if sentiment_pipe is None:
            return self._fallback_analyze(text)

        try:
            # DistilBERT Sentiment
            raw_res = sentiment_pipe(text[:512])[0]
            label = raw_res["label"].upper()
            score = round(raw_res["score"] * 100.0, 2)
            
            # Map labels
            sentiment = "POSITIVE" if label == "POSITIVE" else "NEGATIVE" if label == "NEGATIVE" else "NEUTRAL"
            
            # Sarcasm check
            lower = text.lower()
            sarcasm_detected = "/s" in lower or (sentiment == "POSITIVE" and ("broke" in lower or "fail" in lower or "terrible" in lower))
            if sarcasm_detected:
                sentiment = "NEGATIVE"

            # Extract Entities via NER
            entities = []
            if ner_pipe is not None:
                try:
                    ner_res = ner_pipe(text[:512])
                    for item in ner_res:
                        entities.append({
                            "text": item.get("word", ""),
                            "category": item.get("entity_group", "ENTITY")
                        })
                except Exception as ne:
                    logger.debug(f"NER extraction exception: {ne}")

            return {
                "text": text,
                "sentiment": sentiment,
                "confidence": score,
                "sarcasm_detected": sarcasm_detected,
                "emotions": {
                    "frustration": 85.0 if sentiment == "NEGATIVE" else 10.0,
                    "happiness": 90.0 if sentiment == "POSITIVE" else 5.0,
                    "anger": 70.0 if sentiment == "NEGATIVE" else 0.0,
                    "surprise": 60.0 if sarcasm_detected else 15.0,
                    "sarcasm_prob": 95.0 if sarcasm_detected else 5.0
                },
                "crisis_score": 85.0 if sentiment == "NEGATIVE" else 10.0,
                "entities": entities
            }
        except Exception as e:
            logger.error(f"Inference error using DistilBERT model: {e}")
            return self._fallback_analyze(text)

    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Performs batch inference across a list of text samples."""
        return [self.analyze_text(t) for t in texts]

if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    res = analyzer.analyze_text("Oh great, another update that completely broke API auth... /s")
    print("Inference Result:", res)
