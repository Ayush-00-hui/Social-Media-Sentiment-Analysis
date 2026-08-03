"""
Unit Tests for Twitter/X Streaming Scraper Pipeline
"""
import unittest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.twitter_scraper import TwitterScraper

class TestTwitterScraper(unittest.TestCase):
    def setUp(self):
        self.scraper = TwitterScraper()

    def test_stream_keywords(self):
        keywords = ["@TechBrand", "@CompetitorA"]
        tweets = self.scraper.stream_keywords(keywords)
        self.assertGreater(len(tweets), 0)
        for tweet in tweets:
            self.assertIn("id", tweet)
            self.assertIn("text", tweet)
            self.assertIn("author", tweet)
            self.assertIn("timestamp", tweet)

if __name__ == "__main__":
    unittest.main()
