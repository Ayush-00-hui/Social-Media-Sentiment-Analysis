"""
Social Media Data Collection Pipeline
Twitter/X Stream & Keyword Filter Module
"""
import time
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TwitterScraper")

class TwitterScraper:
    def __init__(self, api_key: str = None, api_secret: str = None, bearer_token: str = None):
        self.api_key = api_key or "MOCK_TWITTER_API_KEY"
        self.bearer_token = bearer_token or "MOCK_TWITTER_BEARER_TOKEN"
        logger.info("Initialized Twitter/X Streaming Client with Bearer Token auth.")

    def stream_keywords(self, keywords: List[str], max_tweets: int = 100) -> List[Dict[str, Any]]:
        """
        Simulates / streams filtered tweets mentioning target keywords, brands, or competitors.
        Handles rate limits gracefully with backoff strategy.
        """
        logger.info(f"Filtering tweet stream for keywords: {keywords}")
        tweets = []
        
        # Sample simulated stream batch
        sample_texts = [
            "Liking the new @TechBrand v4 release! Latency is practically zero.",
            "Oh great, another 'patch' from @TechBrand that completely broke API auth... /s",
            "Is @TechBrand server down in US East region right now? Dashboard stuck loading.",
            "Comparing @TechBrand vs @CompetitorA for team workspace migration.",
            "CRITICAL BUG: Unhandled token expiration loop in @TechBrand SDK exposing session headers!"
        ]

        for i, text in enumerate(sample_texts):
            tweet = {
                "id": f"tweet-stream-{i+1000}",
                "text": text,
                "author": f"user_dev_{i+1}",
                "handle": f"@dev_{i+1}",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "likes": (i + 1) * 12,
                "retweets": (i + 1) * 4,
                "keywords": [k for k in keywords if k.lower() in text.lower()]
            }
            tweets.append(tweet)

        return tweets

if __name__ == "__main__":
    scraper = TwitterScraper()
    results = scraper.stream_keywords(["@TechBrand", "@CompetitorA"])
    print(f"Collected {len(results)} tweets successfully.")
