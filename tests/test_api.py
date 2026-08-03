"""
Unit & Integration Tests for FastAPI Backend Service
"""
import unittest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.app import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ONLINE")
        self.assertIn("engine", data)

    def test_current_sentiment_endpoint(self):
        response = self.client.get("/api/current_sentiment")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("stats", data)
        stats = data["stats"]
        self.assertGreater(stats["totalAnalyzed"], 0)
        self.assertIn("currentScore", stats)

    def test_manual_analyze_positive(self):
        payload = {"text": "I love this super fast tool!"}
        response = self.client.post("/api/manual_analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["sentiment"], "POSITIVE")
        self.assertFalse(data["sarcasm_detected"])

    def test_manual_analyze_negative_sarcasm(self):
        payload = {"text": "Oh great, another bug that completely broke login... /s"}
        response = self.client.post("/api/manual_analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["sentiment"], "NEGATIVE")
        self.assertTrue(data["sarcasm_detected"])

    def test_manual_analyze_empty_text(self):
        payload = {"text": ""}
        response = self.client.post("/api/manual_analyze", json=payload)
        self.assertEqual(response.status_code, 400)

if __name__ == "__main__":
    unittest.main()
