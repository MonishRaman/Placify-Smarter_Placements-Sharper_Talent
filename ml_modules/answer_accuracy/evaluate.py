from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def evaluate_answer(user_answer, ideal_answer):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_answer, ideal_answer])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])
    return float(similarity[0][0])
