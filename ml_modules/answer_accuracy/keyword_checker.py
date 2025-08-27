import re

def keyword_coverage_score(user_answer, keywords, strict=False):
    """
    Calculate the keyword coverage score for a user answer.
    
    Args:
        user_answer (str): The user's answer text
        keywords (list): List of keywords to check for
        strict (bool, optional): If True, only match whole words. Defaults to False.
    
    Returns:
        dict: Dictionary containing matched_keywords, total_keywords, and coverage_score
    """
    user_answer = user_answer.lower()
    match_count = 0
    matched_keywords = []

    for keyword in keywords:
        keyword_lower = keyword.lower()
        
        if strict:
            # Create a pattern that matches the whole word only
            pattern = r'\b' + re.escape(keyword_lower) + r'\b'
            if re.search(pattern, user_answer):
                match_count += 1
                matched_keywords.append(keyword)
        else:
            # Original behavior - substring matching
            if keyword_lower in user_answer:
                match_count += 1
                matched_keywords.append(keyword)

    score = match_count / len(keywords) if keywords else 0
    return {
        "matched_keywords": match_count,
        "total_keywords": len(keywords),
        "coverage_score": round(score, 2),
        "matched_keyword_list": matched_keywords
    }