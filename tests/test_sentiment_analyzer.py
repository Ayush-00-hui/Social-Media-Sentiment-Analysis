"""
Unit Tests for DistilBERT & Gemini Sentiment Analyzer Engine
"""
import unittest
import sys
import os

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.sentiment_analyzer import SentimentAnalyzer

class TestSentimentAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = SentimentAnalyzer()

    def test_positive_sentiment(self):
        text = "I love the new @TechBrand release! It runs super fast and smooth."
        res = self.analyzer.analyze_text(text)
        self.assertEqual(res["sentiment"], "POSITIVE")
        self.assertGreaterEqual(res["confidence"], 70.0)
        self.assertFalse(res["sarcasm_detected"])

    def test_negative_sentiment(self):
        text = "The latest update completely broke API auth and server is down."
        res = self.analyzer.analyze_text(text)
        self.assertEqual(res["sentiment"], "NEGATIVE")
        self.assertGreaterEqual(res["emotions"]["frustration"], 50.0)

    def test_sarcasm_detection(self):
        text = "Oh great, another patch that completely broke API auth... /s"
        res = self.analyzer.analyze_text(text)
        self.assertEqual(res["sentiment"], "NEGATIVE")
        self.assertTrue(res["sarcasm_detected"])

if __name__ == "__main__":
    unittest.main()
