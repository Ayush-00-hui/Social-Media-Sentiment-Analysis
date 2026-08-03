import time
import json
from src.crisis_detector import CrisisDetector
from src.sentiment_analyzer import SentimentAnalyzer

def simulate_crisis_event():
    print("==================================================")
    print("  CRISIS & ANOMALY SPIKE SIMULATION TEST")
    print("==================================================")
    
    detector = CrisisDetector(z_threshold=2.5)
    analyzer = SentimentAnalyzer()
    
    # 24-hour historical baseline negative volumes (mean ~12.5, std ~1.8)
    baseline_24h = [12, 14, 11, 13, 10, 12, 11, 15, 13, 12, 10, 14, 11, 13, 12, 14, 11, 12, 13, 15, 11, 12, 14, 13]
    
    print(f"Historical 24h Baseline Volumes: {baseline_24h}")
    
    # Step 1: Normal volume test
    normal_vol = 14
    res_normal = detector.evaluate_time_series(baseline_24h, normal_vol)
    print(f"\n[Test 1: Normal Volume ({normal_vol})]")
    print(f"  Z-Score: {res_normal['z_score']} | Crisis: {res_normal['is_crisis']} | Severity: {res_normal['severity']}")
    assert not res_normal['is_crisis'], "Normal volume incorrectly flagged as crisis!"
    
    # Step 2: Medium surge test
    medium_vol = 22
    res_med = detector.evaluate_time_series(baseline_24h, medium_vol)
    print(f"\n[Test 2: Moderate Volume Surge ({medium_vol})]")
    print(f"  Z-Score: {res_med['z_score']} | Crisis: {res_med['is_crisis']} | Severity: {res_med['severity']}")
    
    # Step 3: Massive surge test (Outage / Crisis Event)
    crisis_vol = 75
    res_crisis = detector.evaluate_time_series(baseline_24h, crisis_vol)
    print(f"\n[Test 3: Massive Negative Surge ({crisis_vol})]")
    print(f"  Z-Score: {res_crisis['z_score']} | Crisis: {res_crisis['is_crisis']} | Severity: {res_crisis['severity']}")
    assert res_crisis['is_crisis'], "Crisis spike failed to trigger alert!"
    assert res_crisis['z_score'] >= 2.5, "Z-Score threshold verification failed!"
    
    # Step 4: Validate batch NLP processing on crisis tweets
    crisis_tweets = [
        "Major server outage detected! Everything is completely down!",
        "Cannot log into account, system broke post update! /s",
        "Total failure, complete scam of a release!",
        "API returning 500 internal errors continuously!"
    ]
    
    neg_count = 0
    for tweet in crisis_tweets:
        nlp_res = analyzer.analyze_text(tweet)
        if nlp_res['sentiment'] == "NEGATIVE":
            neg_count += 1
            
    print(f"\n[Test 4: Crisis Batch Tweet NLP Processing]")
    print(f"  Processed {len(crisis_tweets)} tweets -> {neg_count} correctly identified as NEGATIVE.")
    
    print("\n==================================================")
    print("  [OK] CRISIS SIMULATION & ANOMALY DETECTION PASSED")
    print("==================================================")

if __name__ == "__main__":
    simulate_crisis_event()
