import time
import json
from src.sentiment_analyzer import SentimentAnalyzer
from src.crisis_detector import CrisisDetector

def run_latency_benchmark():
    print("==================================================")
    print("  SENTIMENTPULSE AI - LATENCY BENCHMARK SUITE")
    print("==================================================")
    
    analyzer = SentimentAnalyzer()
    detector = CrisisDetector()
    
    samples = [
        "This product is amazing and runs super fast!",
        "Terrible service, complete waste of money and broke everything.",
        "It's okay, average speed nothing special.",
        "Oh great, another patch that broke API auth... /s",
        "CRITICAL BUG: Unhandled token expiration loop in @TechBrand SDK!"
    ]
    
    results = []
    print("\n--- 1. Sentiment Inference Latency ---")
    for text in samples:
        start_time = time.perf_counter()
        res = analyzer.analyze_text(text)
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        results.append({
            "text": text[:35] + "...",
            "sentiment": res["sentiment"],
            "sarcasm": res["sarcasm_detected"],
            "latency_ms": round(elapsed_ms, 3)
        })
        print(f"Text: '{text[:30]}...' -> Sentiment: {res['sentiment']} ({res['confidence']}%) | Latency: {elapsed_ms:.3f} ms")

    latencies = [r["latency_ms"] for r in results]
    avg_latency = sum(latencies) / len(latencies)
    max_latency = max(latencies)
    min_latency = min(latencies)
    
    print("\n--- 2. Crisis Anomaly Engine Latency ---")
    baseline = [12, 14, 11, 15, 10, 13, 14, 12, 11, 15, 13, 14]
    start_crisis = time.perf_counter()
    crisis_res = detector.evaluate_time_series(baseline, current_neg_volume=95)
    crisis_ms = (time.perf_counter() - start_crisis) * 1000.0
    print(f"Crisis Z-Score Assessment ({crisis_res['severity']}) | Latency: {crisis_ms:.3f} ms")

    print("\n==================================================")
    print("  BENCHMARK SUMMARY RESULTS")
    print("==================================================")
    print(f"  Total Samples Evaluated : {len(samples)}")
    print(f"  Average Latency         : {avg_latency:.3f} ms")
    print(f"  Min Latency             : {min_latency:.3f} ms")
    print(f"  Max Latency             : {max_latency:.3f} ms")
    print(f"  Target Latency (<200ms) : {'[OK] MET' if max_latency < 200 else '[FAILED] EXCEEDED'}")
    print("==================================================")

if __name__ == "__main__":
    run_latency_benchmark()
