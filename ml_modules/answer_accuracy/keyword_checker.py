import re
from rapidfuzz import fuzz
from rapidfuzz.process import extractOne

def keyword_coverage_score(user_answer, keywords, strict=False, fuzzy=False, similarity_threshold=85):
    """
    Calculate the keyword coverage score for a user answer with optional fuzzy matching.
    
    Args:
        user_answer (str): The user's answer text
        keywords (list): List of keywords to check for
        strict (bool, optional): If True, only match whole words. Defaults to False.
        fuzzy (bool, optional): If True, use fuzzy string matching. Defaults to False.
        similarity_threshold (int, optional): Minimum similarity score for fuzzy matching (0-100). Defaults to 85.
    
    Returns:
        dict: Dictionary containing matched_keywords, total_keywords, coverage_score, and match details
    """
    user_answer = user_answer.lower()
    match_count = 0
    matched_keywords = []
    match_details = []

    for keyword in keywords:
        keyword_lower = keyword.lower()
        found_match = False
        match_info = {
            "keyword": keyword,
            "matched": False,
            "match_type": None,
            "similarity_score": 0,
            "matched_text": None
        }
        
        if fuzzy:
            # Fuzzy matching approach
            if strict:
                # For strict fuzzy matching, extract words from the answer and compare each
                words = re.findall(r'\b\w+\b', user_answer)
                # For multi-word keywords, split and check each word
                keyword_words = keyword_lower.split()
                
                if len(keyword_words) == 1:
                    # Single word keyword
                    best_match = extractOne(keyword_lower, words, scorer=fuzz.ratio)
                    if best_match and best_match[1] >= similarity_threshold:
                        found_match = True
                        match_info["matched"] = True
                        match_info["match_type"] = "fuzzy_strict"
                        match_info["similarity_score"] = best_match[1]
                        match_info["matched_text"] = best_match[0]
                else:
                    # Multi-word keyword - check if all words have good matches
                    word_matches = []
                    for kw in keyword_words:
                        best_match = extractOne(kw, words, scorer=fuzz.ratio)
                        if best_match and best_match[1] >= similarity_threshold:
                            word_matches.append((kw, best_match))
                    
                    if len(word_matches) == len(keyword_words):
                        found_match = True
                        match_info["matched"] = True
                        match_info["match_type"] = "fuzzy_strict_multiword"
                        # Average the similarity scores
                        avg_score = sum(match[1][1] for match in word_matches) / len(word_matches)
                        match_info["similarity_score"] = avg_score
                        match_info["matched_text"] = ", ".join([match[1][0] for match in word_matches])
            else:
                # For non-strict fuzzy matching, use different strategies based on keyword length
                if len(keyword_lower.split()) == 1:
                    # Single word - use partial ratio against the whole text
                    similarity = fuzz.partial_ratio(keyword_lower, user_answer)
                    if similarity >= similarity_threshold:
                        found_match = True
                        match_info["matched"] = True
                        match_info["match_type"] = "fuzzy_partial"
                        match_info["similarity_score"] = similarity
                        
                        # Find the best matching word for display
                        words = re.findall(r'\b\w+\b', user_answer)
                        best_match = extractOne(keyword_lower, words, scorer=fuzz.partial_ratio)
                        if best_match:
                            match_info["matched_text"] = best_match[0]
                else:
                    # Multi-word keyword - check against phrases in the text
                    # Also try word-by-word matching with partial ratio
                    similarity = fuzz.partial_ratio(keyword_lower, user_answer)
                    if similarity >= similarity_threshold:
                        found_match = True
                        match_info["matched"] = True
                        match_info["match_type"] = "fuzzy_partial_phrase"
                        match_info["similarity_score"] = similarity
                        match_info["matched_text"] = keyword_lower  # Indicate it was found as a phrase
                    else:
                        # Try token-based matching for multi-word keywords
                        keyword_words = keyword_lower.split()
                        words = re.findall(r'\b\w+\b', user_answer)
                        word_matches = []
                        
                        for kw in keyword_words:
                            best_match = extractOne(kw, words, scorer=fuzz.partial_ratio)
                            if best_match and best_match[1] >= similarity_threshold - 10:  # Slightly lower threshold for individual words
                                word_matches.append((kw, best_match))
                        
                        # If we match most of the words, consider it a match
                        if len(word_matches) >= len(keyword_words) * 0.7:  # At least 70% of words matched
                            found_match = True
                            match_info["matched"] = True
                            match_info["match_type"] = "fuzzy_partial_tokens"
                            avg_score = sum(match[1][1] for match in word_matches) / len(word_matches)
                            match_info["similarity_score"] = avg_score
                            match_info["matched_text"] = ", ".join([match[1][0] for match in word_matches])
        else:
            # Original exact matching approach
            if strict:
                # Create a pattern that matches the whole word only
                pattern = r'\b' + re.escape(keyword_lower) + r'\b'
                if re.search(pattern, user_answer):
                    found_match = True
                    match_info["matched"] = True
                    match_info["match_type"] = "exact_strict"
                    match_info["similarity_score"] = 100
                    match_info["matched_text"] = keyword_lower
            else:
                # Original behavior - substring matching
                if keyword_lower in user_answer:
                    found_match = True
                    match_info["matched"] = True
                    match_info["match_type"] = "exact_substring"
                    match_info["similarity_score"] = 100
                    match_info["matched_text"] = keyword_lower

        if found_match:
            match_count += 1
            matched_keywords.append(keyword)
        
        match_details.append(match_info)

    score = match_count / len(keywords) if keywords else 0
    return {
        "matched_keywords": match_count,
        "total_keywords": len(keywords),
        "coverage_score": round(score, 2),
        "matched_keyword_list": matched_keywords,
        "match_details": match_details
    }