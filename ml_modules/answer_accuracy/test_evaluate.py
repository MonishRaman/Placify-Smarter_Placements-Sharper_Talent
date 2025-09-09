#!/usr/bin/env python3
"""
Test script to verify the enhanced answer evaluation functionality.
"""

from evaluate import evaluate_answer, evaluate_answer_semantic, evaluate_answer_tfidf


def test_semantic_evaluation():
    """Test the semantic evaluation with various test cases."""
    print("Testing Semantic Answer Evaluation")
    print("=" * 50)
    
    test_cases = [
        {
            "user_answer": "Machine learning is a subset of artificial intelligence",
            "ideal_answer": "ML is a branch of AI that enables computers to learn",
            "description": "Conceptually similar but different wording"
        },
        {
            "user_answer": "Python is a programming language",
            "ideal_answer": "Python is a programming language",
            "description": "Identical answers"
        },
        {
            "user_answer": "The sky is blue",
            "ideal_answer": "Machine learning algorithms",
            "description": "Completely different topics"
        },
        {
            "user_answer": "Algorithms are step-by-step procedures",
            "ideal_answer": "An algorithm is a sequence of instructions",
            "description": "Same concept, different words"
        },
        {
            "user_answer": "",
            "ideal_answer": "Some answer",
            "description": "Empty user answer"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {case['description']}")
        print(f"User Answer: '{case['user_answer']}'")
        print(f"Ideal Answer: '{case['ideal_answer']}'")
        
        # Test semantic evaluation
        semantic_score = evaluate_answer_semantic(case['user_answer'], case['ideal_answer'])
        print(f"Semantic Similarity Score: {semantic_score:.4f}")
        
        # Test TF-IDF evaluation for comparison
        tfidf_score = evaluate_answer_tfidf(case['user_answer'], case['ideal_answer'])
        print(f"TF-IDF Similarity Score: {tfidf_score:.4f}")
        
        # Test main function (defaults to semantic)
        main_score = evaluate_answer(case['user_answer'], case['ideal_answer'])
        print(f"Main Function Score: {main_score:.4f}")
        
        print("-" * 30)


def test_backward_compatibility():
    """Test that the main function maintains backward compatibility."""
    print("\nTesting Backward Compatibility")
    print("=" * 50)
    
    user_answer = "Machine learning is used for data analysis"
    ideal_answer = "ML helps analyze large datasets"
    
    # Test with semantic evaluation (default)
    semantic_result = evaluate_answer(user_answer, ideal_answer)
    print(f"Semantic evaluation (default): {semantic_result:.4f}")
    
    # Test with TF-IDF evaluation (explicit)
    tfidf_result = evaluate_answer(user_answer, ideal_answer, use_semantic=False)
    print(f"TF-IDF evaluation (explicit): {tfidf_result:.4f}")
    
    # Verify the function signature still works with original parameters
    original_result = evaluate_answer(user_answer, ideal_answer)
    print(f"Original function call: {original_result:.4f}")


if __name__ == "__main__":
    try:
        test_semantic_evaluation()
        test_backward_compatibility()
        print("\n✅ All tests completed successfully!")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
