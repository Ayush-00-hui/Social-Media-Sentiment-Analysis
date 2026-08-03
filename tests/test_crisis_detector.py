"""
Unit Tests for Z-Score Time-Series Crisis Detector Engine
"""
import unittest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.crisis_detector import CrisisDetector

class TestCrisisDetector(unittest.TestCase):
    def setUp(self):
        self.detector = CrisisDetector(z_threshold=2.5)

    def test_normal_baseline_no_crisis(self):
        baseline = [10, 12, 11, 13, 10, 12, 11, 14, 12, 10, 11, 13]
        current = 12
        result = self.detector.evaluate_time_series(baseline, current)
        self.assertFalse(result["is_crisis"])
        self.assertEqual(result["severity"], "LOW")

    def test_insufficient_history(self):
        result = self.detector.evaluate_time_series([10, 12], 15)
        self.assertFalse(result["is_crisis"])
        self.assertEqual(result["severity"], "LOW")

    def test_medium_severity(self):
        baseline = [10, 12, 11, 13, 10, 12, 11, 14, 12, 10, 11, 13]
        current = 14  # z_score ~2.0
        result = self.detector.evaluate_time_series(baseline, current)
        self.assertFalse(result["is_crisis"])
        self.assertEqual(result["severity"], "MEDIUM")

    def test_critical_spike_crisis(self):
        baseline = [10, 12, 11, 13, 10, 12, 11, 14, 12, 10, 11, 13]
        current = 85  # massive sudden negative surge
        result = self.detector.evaluate_time_series(baseline, current)
        self.assertTrue(result["is_crisis"])
        self.assertEqual(result["severity"], "CRITICAL")
        self.assertGreaterEqual(result["z_score"], 4.0)

if __name__ == "__main__":
    unittest.main()
