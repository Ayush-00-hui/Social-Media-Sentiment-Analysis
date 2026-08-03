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
        current = 14
        result = self.detector.evaluate_time_series(baseline, current)
        self.assertFalse(result["is_crisis"])
        self.assertEqual(result["severity"], "LOW")

    def test_critical_spike_crisis(self):
        baseline = [10, 12, 11, 13, 10, 12, 11, 14, 12, 10, 11, 13]
        current = 85  # massive sudden negative surge
        result = self.detector.evaluate_time_series(baseline, current)
        self.assertTrue(result["is_crisis"])
        self.assertIn(result["severity"], ["HIGH", "CRITICAL"])
        self.assertGreaterEqual(result["z_score"], 2.5)

if __name__ == "__main__":
    unittest.main()
