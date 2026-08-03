"""
Crisis Anomaly Detection Engine
Uses Z-Score Time-Series Spike Detection: Z = (x - μ) / σ
Alerts when negative sentiment volume surges > 2.5 Standard Deviations above 24h baseline.
"""
import numpy as np
from typing import Dict, Any, List

class CrisisDetector:
    def __init__(self, z_threshold: float = 2.5, window_hours: int = 24):
        self.z_threshold = z_threshold
        self.window_hours = window_hours

    def evaluate_time_series(self, historical_neg_volumes: List[int], current_neg_volume: int) -> Dict[str, Any]:
        """
        Calculates Z-score anomaly metric on rolling hourly negative tweet volume.
        """
        if len(historical_neg_volumes) < 3:
            return {"is_crisis": False, "z_score": 0.0, "severity": "LOW"}

        mean = float(np.mean(historical_neg_volumes))
        std = float(np.std(historical_neg_volumes)) + 1e-5  # avoid div zero
        
        z_score = (current_neg_volume - mean) / std

        severity = "LOW"
        if z_score >= 4.0:
            severity = "CRITICAL"
        elif z_score >= 2.5:
            severity = "HIGH"
        elif z_score >= 1.5:
            severity = "MEDIUM"

        return {
            "is_crisis": z_score >= self.z_threshold,
            "z_score": round(z_score, 2),
            "severity": severity,
            "current_volume": current_neg_volume,
            "baseline_mean": round(mean, 2),
            "baseline_std": round(std, 2)
        }

if __name__ == "__main__":
    detector = CrisisDetector(z_threshold=2.5)
    baseline_24h = [12, 15, 10, 14, 11, 13, 15, 12, 10, 14, 16, 12, 11, 15, 13, 14, 12, 11, 15, 14, 12, 13, 15, 14]
    spike_now = 85  # sudden surge in negative tweets
    
    result = detector.evaluate_time_series(baseline_24h, spike_now)
    print("Crisis Anomaly Test Output:", result)
