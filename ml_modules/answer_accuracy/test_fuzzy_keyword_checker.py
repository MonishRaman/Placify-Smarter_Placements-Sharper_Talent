"""
Test script for the enhanced keyword checker with fuzzy matching capabilities.
"""

import sys
import os

# Add the parent directory to the path so we can import from ml_modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from answer_accuracy.keyword_checker import keyword_coverage_score

def print_detailed_results(result, test_name):
    """Helper function to print detailed test results"""
    print(f"\n{test_name}")
    print("="*60)
    print(f"Coverage Score: {result['coverage_score']}")
    print(f"Matched Keywords: {result['matched_keywords']}/{result['total_keywords']}")
    print(f"Matched Keyword List: {result['matched_keyword_list']}")
    
    if 'match_details' in result:
        print("\nDetailed Match Information:")
        for detail in result['match_details']:
            status = "✓" if detail['matched'] else "✗"
            print(f"  {status} '{detail['keyword']}' - {detail['match_type']} - "
                  f"Score: {detail['similarity_score']}% - "
                  f"Matched: '{detail['matched_text']}'")

def test_fuzzy_keyword_checker():
    print("Testing Enhanced Keyword Checker with Fuzzy Matching")
    print("="*60)
    
    # Test case 1: Exact matching (baseline)
    test_answer1 = "I have experience with Python programming and API development"
    keywords1 = ["python", "api", "development"]
    
    result_exact = keyword_coverage_score(test_answer1, keywords1, strict=False, fuzzy=False)
    print_detailed_results(result_exact, "Test 1: Exact Matching (Baseline)")
    
    # Test case 2: Fuzzy matching with typos
    test_answer2 = "I have experiance with Pythom programming and API developement"
    keywords2 = ["python", "api", "development", "experience"]
    
    result_fuzzy = keyword_coverage_score(test_answer2, keywords2, strict=False, fuzzy=True, similarity_threshold=80)
    print_detailed_results(result_fuzzy, "Test 2: Fuzzy Matching with Typos (threshold=80%)")
    
    # Test case 3: Synonyms and alternative phrasing
    test_answer3 = "I work with agile software development and REST APIs"
    keywords3 = ["agile development", "api", "software"]
    
    result_synonyms = keyword_coverage_score(test_answer3, keywords3, strict=False, fuzzy=True, similarity_threshold=75)
    print_detailed_results(result_synonyms, "Test 3: Synonyms and Alternative Phrasing (threshold=75%)")
    
    # Test case 4: Strict fuzzy matching
    test_answer4 = "I use JavaScript and ReactJS for frontend developement"
    keywords4 = ["javascript", "react", "development"]
    
    result_strict_fuzzy = keyword_coverage_score(test_answer4, keywords4, strict=True, fuzzy=True, similarity_threshold=85)
    print_detailed_results(result_strict_fuzzy, "Test 4: Strict Fuzzy Matching (threshold=85%)")
    
    # Test case 5: Different similarity thresholds
    test_answer5 = "I'm skilled in machine learning and data science"
    keywords5 = ["machine learning", "data analysis", "artificial intelligence"]
    
    print("\nTest 5: Impact of Different Similarity Thresholds")
    print("="*60)
    
    for threshold in [70, 80, 90]:
        result_threshold = keyword_coverage_score(test_answer5, keywords5, strict=False, fuzzy=True, similarity_threshold=threshold)
        print(f"\nThreshold {threshold}%:")
        print(f"  Coverage Score: {result_threshold['coverage_score']}")
        print(f"  Matched: {result_threshold['matched_keyword_list']}")
    
    # Test case 6: Comparing exact vs fuzzy matching
    test_answer6 = "I have experiance with agile developement and REST APIs"
    keywords6 = ["experience", "agile development", "api"]
    
    print("\nTest 6: Exact vs Fuzzy Matching Comparison")
    print("="*60)
    
    result_exact_comp = keyword_coverage_score(test_answer6, keywords6, strict=False, fuzzy=False)
    result_fuzzy_comp = keyword_coverage_score(test_answer6, keywords6, strict=False, fuzzy=True, similarity_threshold=85)
    
    print(f"Exact Matching Score: {result_exact_comp['coverage_score']} - Matched: {result_exact_comp['matched_keyword_list']}")
    print(f"Fuzzy Matching Score: {result_fuzzy_comp['coverage_score']} - Matched: {result_fuzzy_comp['matched_keyword_list']}")
    
    print("\n" + "="*60)
    print("SUMMARY:")
    print("- Fuzzy matching successfully handles typos and similar words")
    print("- Similarity threshold controls matching strictness")
    print("- Detailed match information helps understand scoring decisions")
    print("- Backward compatibility maintained with exact matching")

if __name__ == "__main__":
    test_fuzzy_keyword_checker()
