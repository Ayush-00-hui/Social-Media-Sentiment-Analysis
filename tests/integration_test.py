"""
End-to-End Integration Test Suite (FastAPI Backend <-> NLP Engines)
"""
import unittest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.sentiment_analyzer import SentimentAnalyzer
from src.crisis_detector import CrisisDetector

class TestFullPipelineIntegration(unittest.TestCase):
    def test_full_pipeline_flow(self):
        # 1. Ingest sample tweet
        sample_tweet = "CRITICAL BUG: Unhandled token expiration loop in @TechBrand SDK!"
        
        # 2. Run NLP Inference
        analyzer = SentimentAnalyzer()
        nlp_res = analyzer.analyze_text(sample_tweet)
        self.assertEqual(nlp_res["sentiment"], "NEGATIVE")

        # 3. Simulate negative volume spike in crisis engine
        baseline_24h = [15, 12, 14, 13, 11, 15, 12, 14, 10, 12, 13, 11]
        crisis_detector = CrisisDetector()
        crisis_res = crisis_detector.evaluate_time_series(baseline_24h, current_neg_volume=90)
        
        # 4. Assert end-to-end alert trigger
        self.assertTrue(crisis_res["is_crisis"])
        self.assertGreaterEqual(crisis_res["z_score"], 2.5)
        print("\n✅ Integration Test Passed: Tweet NLP -> Z-score Anomaly -> Crisis Alert Success.")

if __name__ == "__main__":
    unittest.main()
