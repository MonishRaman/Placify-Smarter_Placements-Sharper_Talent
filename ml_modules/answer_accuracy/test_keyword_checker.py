"""
Test script for the enhanced keyword checker.
"""

import sys
import os

# Add the parent directory to the path so we can import from ml_modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from answer_accuracy.keyword_checker import keyword_coverage_score

def test_keyword_checker():
    print("Testing Keyword Checker with Enhanced Functionality")
    print("="*50)
    
    # Test case 1: Basic substring matching (strict=False)
    test_answer = "I have experience with Python programming and APIs development"
    keywords = ["python", "api", "development"]
    
    result_non_strict = keyword_coverage_score(test_answer, keywords, strict=False)
    print("\nTest 1: Substring matching (strict=False)")
    print(f"User answer: {test_answer}")
    print(f"Keywords: {keywords}")
    print(f"Result: {result_non_strict}")
    
    # Test case 2: Strict whole word matching (strict=True)
    result_strict = keyword_coverage_score(test_answer, keywords, strict=True)
    print("\nTest 2: Whole word matching (strict=True)")
    print(f"User answer: {test_answer}")
    print(f"Keywords: {keywords}")
    print(f"Result: {result_strict}")
    
    # Test case 3: Mixed cases with strict matching
    test_answer2 = "I work with Python and API integration"
    keywords2 = ["Python", "API", "JavaScript"]
    
    result_strict2 = keyword_coverage_score(test_answer2, keywords2, strict=True)
    print("\nTest 3: Mixed case with strict matching")
    print(f"User answer: {test_answer2}")
    print(f"Keywords: {keywords2}")
    print(f"Result: {result_strict2}")
    
    # Test case 4: Word boundary cases
    test_answer3 = "I use APIs and apiKey for authentication"
    keywords3 = ["api", "key", "auth"]
    
    result_non_strict3 = keyword_coverage_score(test_answer3, keywords3, strict=False)
    print("\nTest 4a: Word boundary cases (strict=False)")
    print(f"User answer: {test_answer3}")
    print(f"Keywords: {keywords3}")
    print(f"Result: {result_non_strict3}")
    
    result_strict3 = keyword_coverage_score(test_answer3, keywords3, strict=True)
    print("\nTest 4b: Word boundary cases (strict=True)")
    print(f"User answer: {test_answer3}")
    print(f"Keywords: {keywords3}")
    print(f"Result: {result_strict3}")
    
    print("\nTest Summary:")
    print(f"Non-strict matching finds substrings like 'api' in 'APIs'")
    print(f"Strict matching only finds whole words, differentiating 'api' from 'APIs'")
    
if __name__ == "__main__":
    test_keyword_checker()
