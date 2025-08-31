# Enhanced Keyword Checker with Fuzzy String Matching

## Overview

The keyword checker has been enhanced with fuzzy string matching capabilities using the `rapidfuzz` library. This improvement makes the system more robust and intelligent by allowing it to score answers based on similarity rather than just exact matches.

## Features

### 🎯 Fuzzy String Matching
- **Typo Tolerance**: Handles common spelling mistakes (e.g., "experiance" → "experience")
- **Synonym Recognition**: Recognizes alternative phrasing (e.g., "agile software development" → "agile development")
- **Case Insensitive**: Works with different casing (e.g., "JavaScript" → "javascript")
- **Partial Matching**: Finds keywords in longer phrases

### ⚙️ Configurable Parameters
- **similarity_threshold**: Adjustable threshold (0-100) for match sensitivity
- **strict**: Toggle between whole-word and substring matching
- **fuzzy**: Enable/disable fuzzy matching for backward compatibility

## Usage

### Basic Usage

```python
from answer_accuracy.keyword_checker import keyword_coverage_score

# Original exact matching (backward compatible)
result = keyword_coverage_score(
    user_answer="I have experience with Python programming",
    keywords=["python", "programming"],
    strict=False,
    fuzzy=False
)

# Enhanced fuzzy matching
result = keyword_coverage_score(
    user_answer="I have experiance with Pythom programming",
    keywords=["python", "programming", "experience"],
    strict=False,
    fuzzy=True,
    similarity_threshold=85
)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user_answer` | str | Required | The student's answer text |
| `keywords` | list | Required | List of keywords to check for |
| `strict` | bool | False | If True, only match whole words |
| `fuzzy` | bool | False | If True, use fuzzy string matching |
| `similarity_threshold` | int | 85 | Minimum similarity score (0-100) for fuzzy matching |

## Return Value

```python
{
    "matched_keywords": int,           # Number of matched keywords
    "total_keywords": int,             # Total number of keywords
    "coverage_score": float,           # Score between 0.0 and 1.0
    "matched_keyword_list": list,      # List of matched keywords
    "match_details": list              # Detailed matching information
}
```

## Similarity Threshold Guidelines

| Threshold | Use Case | Description |
|-----------|----------|-------------|
| 70-75% | Very Lenient | Accepts significant variations and creative phrasing |
| 80-85% | Balanced | Good compromise between tolerance and accuracy |
| 85-90% | Strict | Requires closer matches, good for technical terms |
| 90-95% | Very Strict | Only accepts minor typos and variations |

## Examples

### Example 1: Handling Typos
```python
result = keyword_coverage_score(
    user_answer="I have experiance with machnie learning",
    keywords=["experience", "machine learning"],
    fuzzy=True,
    similarity_threshold=80
)
# Result: 100% match despite typos
```

### Example 2: Alternative Phrasing
```python
result = keyword_coverage_score(
    user_answer="I work with agile software development",
    keywords=["agile development", "software"],
    fuzzy=True,
    similarity_threshold=80
)
# Result: Successfully matches "agile development" in "agile software development"
```

## Testing

Run the test files to verify functionality:

```bash
# Test enhanced functionality
python test_fuzzy_keyword_checker.py

# Test backward compatibility
python test_keyword_checker.py
```

## Installation

The enhancement requires the `rapidfuzz` library:

```bash
pip install rapidfuzz
```

## Backward Compatibility

- All existing code continues to work unchanged
- Default behavior remains the same (fuzzy=False)
- New parameters are optional with sensible defaults
