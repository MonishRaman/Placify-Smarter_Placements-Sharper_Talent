# AI Interview Evaluation Bot (Core Module)

This module mimics real-world interviews by analyzing candidate responses via video and audio. It evaluates candidates based on facial expressions, vocal cues, and the technical accuracy of their answers.

## 🎯 Quick Start - Main Analyzer

For easy integration, use the **main analyzer** that orchestrates all ML modules:

```python
from ml_modules.main_analyzer import generate_analysis_report

# Analyze a complete interview session
report = generate_analysis_report(
    audio_path="interview_audio.wav",
    user_answer="User's transcribed answer",
    ideal_answer="Expected answer for comparison",
    keywords=["python", "django", "api"],
    image_path="candidate_photo.jpg"  # Optional
)

print(f"Overall Score: {report['overall_score']}/100")
print(f"Recommendations: {report['recommendations']}")
```

---

## 🔍 Sub-Modules

### 1. Emotion Detector (`emotion_detector/`)
- Detects emotions like confidence, stress, confusion from webcam video frames.
- Uses CNN model trained on FER-2013 dataset.

**Files:**
- `model.py`: Loads the CNN model.
- `predict.py`: Predicts emotion from frame.
- `utils.py`: Preprocessing and helper functions.

---

### 2. Speech Analysis (`speech_analysis/`)
- Analyzes voice pitch, tone, pauses, and sentiment.
- Converts speech to text and computes prosody metrics.

**Files:**
- `audio_to_text.py`: Converts audio to transcript.
- `sentiment_analyzer.py`: Analyzes sentiment and tone.
- `prosody_metrics.py`: Computes pitch, pauses, and clarity.

---

### 3. Answer Accuracy (`answer_accuracy/`)
- Checks technical correctness of spoken answers.
- Uses TF-IDF similarity and keyword matching.

**Files:**
- `evaluate.py`: Semantic similarity score with ideal answer.
- `keyword_checker.py`: Checks presence of key concepts/terms.

---

## ✅ How to Install

```bash
cd ml_modules
pip install -r requirements.txt
```

## 🚀 Usage Examples

### Single Interview Analysis
```python
from main_analyzer import generate_analysis_report

report = generate_analysis_report(
    audio_path="audio.wav",
    user_answer="I have experience with Python and Django...",
    ideal_answer="Candidate should demonstrate Python knowledge...",
    keywords=["python", "django", "web development"]
)
```

### Batch Interview Analysis
```python
from main_analyzer import batch_analyze_interviews

sessions = [
    {
        "audio_path": "session1.wav",
        "user_answer": "Answer 1",
        "ideal_answer": "Expected 1",
        "keywords": ["python", "api"]
    },
    # ... more sessions
]

batch_results = batch_analyze_interviews(sessions)
```

### Enhanced Session Analysis
```python
from main_analyzer import analyze_interview_session

enhanced_report = analyze_interview_session(
    audio_path="audio.wav",
    user_answer="User response",
    ideal_answer="Expected response",
    question="Tell me about your experience",
    candidate_info={"name": "John Doe", "role": "Software Engineer"}
)
