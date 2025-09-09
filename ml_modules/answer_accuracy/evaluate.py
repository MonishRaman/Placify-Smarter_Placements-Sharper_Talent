from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Try to import sentence transformers with graceful fallback
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: sentence-transformers not available: {e}")
    print("Falling back to TF-IDF similarity. To use semantic similarity, install: pip install sentence-transformers")
    SENTENCE_TRANSFORMERS_AVAILABLE = False


# Global model instance to avoid reloading
_model = None


def get_sentence_transformer_model():
    """
    Load and return the sentence transformer model.
    Uses a lightweight model that provides good performance for semantic similarity.
    """
    global _model
    if not SENTENCE_TRANSFORMERS_AVAILABLE:
        raise ImportError("sentence-transformers library not available")
    
    if _model is None:
        try:
            # Using all-MiniLM-L6-v2: lightweight, fast, and accurate for semantic similarity
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Error loading sentence transformer model: {e}")
            raise
    return _model


def evaluate_answer_semantic(user_answer, ideal_answer):
    """
    Evaluate answer similarity using semantic understanding with sentence transformers.
    
    Args:
        user_answer (str): The user's response
        ideal_answer (str): The correct/ideal answer
        
    Returns:
        float: Similarity score between 0 and 1, where 1 indicates perfect semantic match
    """
    if not user_answer.strip() or not ideal_answer.strip():
        return 0.0
    
    if not SENTENCE_TRANSFORMERS_AVAILABLE:
        print("Warning: sentence-transformers not available, falling back to TF-IDF")
        return evaluate_answer_tfidf(user_answer, ideal_answer)
    
    try:
        model = get_sentence_transformer_model()
        
        # Generate embeddings for both answers
        embeddings = model.encode([user_answer, ideal_answer])
        
        # Calculate cosine similarity between embeddings
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        # Ensure the score is between 0 and 1
        return max(0.0, min(1.0, float(similarity)))
        
    except Exception as e:
        print(f"Error in semantic evaluation: {e}")
        # Fallback to TF-IDF approach if sentence transformer fails
        return evaluate_answer_tfidf(user_answer, ideal_answer)


def evaluate_answer_tfidf(user_answer, ideal_answer):
    """
    Evaluate answer similarity using TF-IDF vectorization (fallback method).
    
    Args:
        user_answer (str): The user's response
        ideal_answer (str): The correct/ideal answer
        
    Returns:
        float: Similarity score between 0 and 1
    """
    if not user_answer.strip() or not ideal_answer.strip():
        return 0.0
        
    try:
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([user_answer, ideal_answer])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])
        return float(similarity[0][0])
    except Exception:
        return 0.0


def evaluate_answer(user_answer, ideal_answer, use_semantic=True):
    """
    Main function to evaluate answer similarity.
    
    Args:
        user_answer (str): The user's response
        ideal_answer (str): The correct/ideal answer
        use_semantic (bool): Whether to use semantic similarity (default: True)
        
    Returns:
        float: Similarity score between 0 and 1
    """
    if use_semantic and SENTENCE_TRANSFORMERS_AVAILABLE:
        return evaluate_answer_semantic(user_answer, ideal_answer)
    else:
        return evaluate_answer_tfidf(user_answer, ideal_answer)
