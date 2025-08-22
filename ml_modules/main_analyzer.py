"""
ML Analysis Orchestrator - Central hub for all ML-based interview analysis

This module provides a single, high-level function that orchestrates all ML modules
to generate comprehensive interview analysis reports.

Author: Placify Team
Date: 2025
"""

import os
import sys
import json
from typing import Dict, Any, Optional

# Add the ml_modules directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import all ML module functions
try:
    from speech_analysis.audio_to_text import convert_audio_to_text
    from speech_analysis.sentiment_analyzer import get_sentiment
    from speech_analysis.prosody_metrics import analyze_prosody
    from answer_accuracy.evaluate import evaluate_answer
    from answer_accuracy.keyword_checker import keyword_coverage_score
    from emotion_detector.predict import predict_emotion
except ImportError as e:
    print(f"Warning: Could not import ML modules: {e}")
    print("Make sure all dependencies are installed: pip install -r requirements.txt")


def generate_analysis_report(
    audio_path: str,
    user_answer: str,
    ideal_answer: str,
    keywords: Optional[list] = None,
    image_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a comprehensive analysis report for interview performance.
    
    Args:
        audio_path (str): Path to the audio file of the user's response
        user_answer (str): Transcribed text of the user's answer
        ideal_answer (str): The ideal/expected answer for comparison
        keywords (list, optional): List of keywords to check for in the answer
        image_path (str, optional): Path to image for emotion detection
    
    Returns:
        Dict[str, Any]: Comprehensive analysis report containing:
            - transcribed_text: The transcribed audio text
            - answer_accuracy: Technical accuracy scores
            - speech_analysis: Voice and sentiment analysis
            - emotion_analysis: Facial emotion detection (if image provided)
            - overall_score: Combined performance score
            - recommendations: Actionable feedback
    """
    
    report = {
        "status": "success",
        "timestamp": None,
        "transcribed_text": "",
        "answer_accuracy": {},
        "speech_analysis": {},
        "emotion_analysis": {},
        "overall_score": 0,
        "recommendations": [],
        "errors": []
    }
    
    try:
        # Import datetime here to avoid issues if not available
        from datetime import datetime
        report["timestamp"] = datetime.now().isoformat()
    except ImportError:
        report["timestamp"] = "timestamp_unavailable"
    
    # 1. SPEECH-TO-TEXT CONVERSION
    print("🎤 Converting audio to text...")
    try:
        if os.path.exists(audio_path):
            transcribed_text = convert_audio_to_text(audio_path)
            report["transcribed_text"] = transcribed_text
            
            # Use transcribed text if user_answer is empty
            if not user_answer.strip():
                user_answer = transcribed_text
                
            print(f"✅ Audio transcription complete: {len(transcribed_text)} characters")
        else:
            report["errors"].append(f"Audio file not found: {audio_path}")
            print(f"⚠️ Audio file not found: {audio_path}")
    except Exception as e:
        error_msg = f"Speech-to-text conversion failed: {str(e)}"
        report["errors"].append(error_msg)
        print(f"❌ {error_msg}")
    
    # 2. ANSWER ACCURACY ANALYSIS
    print("📊 Analyzing answer accuracy...")
    try:
        if user_answer.strip() and ideal_answer.strip():
            # Semantic similarity score
            accuracy_score = evaluate_answer(user_answer, ideal_answer)
            report["answer_accuracy"]["semantic_similarity"] = round(accuracy_score, 3)
            
            # Keyword coverage analysis
            if keywords:
                keyword_analysis = keyword_coverage_score(user_answer, keywords)
                report["answer_accuracy"]["keyword_coverage"] = keyword_analysis
            else:
                # Generate basic keywords from ideal answer
                basic_keywords = ideal_answer.lower().split()[:10]  # First 10 words as keywords
                keyword_analysis = keyword_coverage_score(user_answer, basic_keywords)
                report["answer_accuracy"]["keyword_coverage"] = keyword_analysis
            
            print(f"✅ Answer accuracy analysis complete: {accuracy_score:.3f} similarity")
        else:
            report["errors"].append("User answer or ideal answer is empty")
            print("⚠️ Skipping answer accuracy - missing text data")
    except Exception as e:
        error_msg = f"Answer accuracy analysis failed: {str(e)}"
        report["errors"].append(error_msg)
        print(f"❌ {error_msg}")
    
    # 3. SPEECH ANALYSIS (Sentiment & Prosody)
    print("🎵 Analyzing speech patterns...")
    try:
        # Sentiment Analysis
        if user_answer.strip():
            sentiment_label, sentiment_score = get_sentiment(user_answer)
            report["speech_analysis"]["sentiment"] = {
                "label": sentiment_label,
                "score": round(sentiment_score, 3)
            }
            print(f"✅ Sentiment analysis: {sentiment_label} ({sentiment_score:.3f})")
        
        # Prosody Analysis (voice characteristics)
        if os.path.exists(audio_path):
            prosody_metrics = analyze_prosody(audio_path)
            report["speech_analysis"]["prosody"] = {
                "avg_pitch": round(prosody_metrics["avg_pitch"], 2),
                "pitch_variance": round(prosody_metrics["pitch_variance"], 2),
                "energy": round(prosody_metrics["energy"], 3)
            }
            print(f"✅ Prosody analysis complete")
        else:
            print("⚠️ Skipping prosody analysis - audio file not found")
            
    except Exception as e:
        error_msg = f"Speech analysis failed: {str(e)}"
        report["errors"].append(error_msg)
        print(f"❌ {error_msg}")
    
    # 4. EMOTION DETECTION (if image provided)
    if image_path and os.path.exists(image_path):
        print("😊 Analyzing facial emotions...")
        try:
            emotion_label, emotion_confidence = predict_emotion(image_path)
            report["emotion_analysis"] = {
                "detected_emotion": emotion_label,
                "confidence": round(emotion_confidence, 3)
            }
            print(f"✅ Emotion detection: {emotion_label} ({emotion_confidence:.3f})")
        except Exception as e:
            error_msg = f"Emotion detection failed: {str(e)}"
            report["errors"].append(error_msg)
            print(f"❌ {error_msg}")
    elif image_path:
        report["errors"].append(f"Image file not found: {image_path}")
        print(f"⚠️ Image file not found: {image_path}")
    
    # 5. CALCULATE OVERALL SCORE
    print("🧮 Calculating overall performance score...")
    try:
        overall_score = calculate_overall_score(report)
        report["overall_score"] = overall_score
        print(f"✅ Overall score calculated: {overall_score}/100")
    except Exception as e:
        error_msg = f"Overall score calculation failed: {str(e)}"
        report["errors"].append(error_msg)
        print(f"❌ {error_msg}")
    
    # 6. GENERATE RECOMMENDATIONS
    print("💡 Generating personalized recommendations...")
    try:
        recommendations = generate_recommendations(report)
        report["recommendations"] = recommendations
        print(f"✅ Generated {len(recommendations)} recommendations")
    except Exception as e:
        error_msg = f"Recommendation generation failed: {str(e)}"
        report["errors"].append(error_msg)
        print(f"❌ {error_msg}")
    
    # 7. FINAL STATUS CHECK
    if report["errors"]:
        report["status"] = "partial_success"
        print(f"⚠️ Analysis completed with {len(report['errors'])} errors")
    else:
        print("🎉 Analysis completed successfully!")
    
    return report


def calculate_overall_score(report: Dict[str, Any]) -> int:
    """
    Calculate an overall performance score based on all analysis results.
    
    Args:
        report (Dict): The analysis report containing all metrics
    
    Returns:
        int: Overall score out of 100
    """
    scores = []
    weights = []
    
    # Answer Accuracy (40% weight)
    if "semantic_similarity" in report.get("answer_accuracy", {}):
        accuracy = report["answer_accuracy"]["semantic_similarity"]
        scores.append(accuracy * 100)  # Convert to percentage
        weights.append(0.4)
    
    # Keyword Coverage (20% weight)
    if "keyword_coverage" in report.get("answer_accuracy", {}):
        keyword_score = report["answer_accuracy"]["keyword_coverage"]["coverage_score"]
        scores.append(keyword_score * 100)  # Convert to percentage
        weights.append(0.2)
    
    # Sentiment Analysis (20% weight)
    if "sentiment" in report.get("speech_analysis", {}):
        sentiment_score = report["speech_analysis"]["sentiment"]["score"]
        # Convert sentiment score (-1 to 1) to 0-100 scale
        normalized_sentiment = ((sentiment_score + 1) / 2) * 100
        scores.append(normalized_sentiment)
        weights.append(0.2)
    
    # Voice Energy/Confidence (10% weight)
    if "prosody" in report.get("speech_analysis", {}):
        energy = report["speech_analysis"]["prosody"]["energy"]
        # Normalize energy to 0-100 scale (assuming energy is 0-1)
        energy_score = min(energy * 100, 100)
        scores.append(energy_score)
        weights.append(0.1)
    
    # Emotion Analysis (10% weight)
    if "detected_emotion" in report.get("emotion_analysis", {}):
        emotion = report["emotion_analysis"]["detected_emotion"]
        confidence = report["emotion_analysis"]["confidence"]
        
        # Positive emotions get higher scores
        positive_emotions = ["Happy", "Surprise", "Neutral"]
        if emotion in positive_emotions:
            emotion_score = confidence * 100
        else:
            emotion_score = (1 - confidence) * 100  # Invert for negative emotions
        
        scores.append(emotion_score)
        weights.append(0.1)
    
    # Calculate weighted average
    if scores and weights:
        total_weight = sum(weights)
        weighted_sum = sum(score * weight for score, weight in zip(scores, weights))
        overall_score = int(weighted_sum / total_weight)
    else:
        overall_score = 0
    
    return max(0, min(100, overall_score))  # Ensure score is between 0-100


def generate_recommendations(report: Dict[str, Any]) -> list:
    """
    Generate personalized recommendations based on the analysis results.
    
    Args:
        report (Dict): The analysis report containing all metrics
    
    Returns:
        list: List of actionable recommendations
    """
    recommendations = []
    
    # Answer Accuracy Recommendations
    accuracy_data = report.get("answer_accuracy", {})
    if "semantic_similarity" in accuracy_data:
        similarity = accuracy_data["semantic_similarity"]
        if similarity < 0.5:
            recommendations.append("Focus on providing more relevant and detailed answers that directly address the question.")
        elif similarity < 0.7:
            recommendations.append("Good answer relevance! Try to include more specific examples and details.")
        else:
            recommendations.append("Excellent answer accuracy! Your responses are well-aligned with expectations.")
    
    # Keyword Coverage Recommendations
    if "keyword_coverage" in accuracy_data:
        coverage = accuracy_data["keyword_coverage"]["coverage_score"]
        if coverage < 0.5:
            recommendations.append("Include more industry-specific terminology and technical keywords in your responses.")
        elif coverage < 0.8:
            recommendations.append("Good use of relevant keywords. Consider incorporating more domain-specific terms.")
    
    # Speech Analysis Recommendations
    speech_data = report.get("speech_analysis", {})
    if "sentiment" in speech_data:
        sentiment = speech_data["sentiment"]
        if sentiment["score"] < 0:
            recommendations.append("Try to maintain a more positive and confident tone during your responses.")
        elif sentiment["score"] < 0.3:
            recommendations.append("Your tone is neutral. Consider showing more enthusiasm and positivity.")
    
    # Prosody Recommendations
    if "prosody" in speech_data:
        prosody = speech_data["prosody"]
        if prosody["energy"] < 0.3:
            recommendations.append("Speak with more energy and confidence to engage your interviewer better.")
        if prosody["pitch_variance"] < 10:
            recommendations.append("Vary your pitch more to make your speech more engaging and natural.")
    
    # Emotion Recommendations
    emotion_data = report.get("emotion_analysis", {})
    if "detected_emotion" in emotion_data:
        emotion = emotion_data["detected_emotion"]
        confidence = emotion_data["confidence"]
        
        if emotion in ["Angry", "Sad", "Fear"] and confidence > 0.6:
            recommendations.append("Try to maintain a calm and positive facial expression during interviews.")
        elif emotion == "Neutral" and confidence > 0.8:
            recommendations.append("Consider showing more enthusiasm and engagement through your facial expressions.")
    
    # Overall Score Recommendations
    overall_score = report.get("overall_score", 0)
    if overall_score < 60:
        recommendations.append("Consider practicing more interview scenarios to improve your overall performance.")
    elif overall_score < 80:
        recommendations.append("You're doing well! Focus on the specific areas mentioned above for improvement.")
    else:
        recommendations.append("Excellent performance! You're well-prepared for interviews.")
    
    # Ensure we always have at least one recommendation
    if not recommendations:
        recommendations.append("Keep practicing to maintain and improve your interview skills!")
    
    return recommendations


def analyze_interview_session(
    audio_path: str,
    user_answer: str = "",
    ideal_answer: str = "",
    keywords: Optional[list] = None,
    image_path: Optional[str] = None,
    question: str = "",
    candidate_info: Optional[Dict] = None
) -> Dict[str, Any]:
    """
    Comprehensive interview session analysis with additional context.
    
    This is an enhanced version of generate_analysis_report with more context
    and metadata for complete interview session tracking.
    
    Args:
        audio_path (str): Path to the audio file
        user_answer (str): Transcribed answer text
        ideal_answer (str): Expected answer for comparison
        keywords (list, optional): Keywords to check for
        image_path (str, optional): Path to candidate image
        question (str, optional): The interview question asked
        candidate_info (dict, optional): Additional candidate information
    
    Returns:
        Dict[str, Any]: Enhanced analysis report with session metadata
    """
    
    # Get the basic analysis report
    basic_report = generate_analysis_report(
        audio_path=audio_path,
        user_answer=user_answer,
        ideal_answer=ideal_answer,
        keywords=keywords,
        image_path=image_path
    )
    
    # Add session metadata
    enhanced_report = {
        **basic_report,
        "session_metadata": {
            "question": question,
            "candidate_info": candidate_info or {},
            "analysis_version": "1.0",
            "modules_used": [
                "speech_analysis",
                "answer_accuracy",
                "emotion_detector" if image_path else None
            ]
        }
    }
    
    # Remove None values from modules_used
    enhanced_report["session_metadata"]["modules_used"] = [
        module for module in enhanced_report["session_metadata"]["modules_used"] 
        if module is not None
    ]
    
    return enhanced_report


def batch_analyze_interviews(interview_sessions: list) -> Dict[str, Any]:
    """
    Analyze multiple interview sessions in batch.
    
    Args:
        interview_sessions (list): List of interview session data
    
    Returns:
        Dict[str, Any]: Batch analysis results with aggregated insights
    """
    
    batch_results = {
        "total_sessions": len(interview_sessions),
        "successful_analyses": 0,
        "failed_analyses": 0,
        "individual_reports": [],
        "aggregate_insights": {},
        "batch_recommendations": []
    }
    
    all_scores = []
    all_recommendations = []
    
    for i, session in enumerate(interview_sessions):
        print(f"\n📋 Analyzing session {i+1}/{len(interview_sessions)}...")
        
        try:
            report = analyze_interview_session(**session)
            batch_results["individual_reports"].append(report)
            
            if report["status"] == "success":
                batch_results["successful_analyses"] += 1
                all_scores.append(report["overall_score"])
                all_recommendations.extend(report["recommendations"])
            else:
                batch_results["failed_analyses"] += 1
                
        except Exception as e:
            batch_results["failed_analyses"] += 1
            error_report = {
                "status": "error",
                "session_index": i,
                "error": str(e)
            }
            batch_results["individual_reports"].append(error_report)
            print(f"❌ Session {i+1} analysis failed: {e}")
    
    # Calculate aggregate insights
    if all_scores:
        batch_results["aggregate_insights"] = {
            "average_score": round(sum(all_scores) / len(all_scores), 2),
            "highest_score": max(all_scores),
            "lowest_score": min(all_scores),
            "score_distribution": {
                "excellent": len([s for s in all_scores if s >= 90]),
                "good": len([s for s in all_scores if 70 <= s < 90]),
                "average": len([s for s in all_scores if 50 <= s < 70]),
                "needs_improvement": len([s for s in all_scores if s < 50])
            }
        }
        
        # Generate batch recommendations
        common_recommendations = {}
        for rec in all_recommendations:
            common_recommendations[rec] = common_recommendations.get(rec, 0) + 1
        
        # Sort by frequency and take top 5
        sorted_recommendations = sorted(
            common_recommendations.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        batch_results["batch_recommendations"] = [rec[0] for rec in sorted_recommendations]
    
    print(f"\n🎯 Batch analysis complete: {batch_results['successful_analyses']}/{batch_results['total_sessions']} successful")
    return batch_results


def save_report_to_file(report: Dict[str, Any], output_path: str) -> bool:
    """
    Save the analysis report to a JSON file.
    
    Args:
        report (Dict): The analysis report to save
        output_path (str): Path where to save the report
    
    Returns:
        bool: True if saved successfully, False otherwise
    """
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"💾 Report saved to: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to save report: {e}")
        return False


# Example usage and testing
if __name__ == "__main__":
    print("🚀 ML Analysis Orchestrator - Test Mode")
    print("=" * 50)
    
    # Example 1: Basic analysis with mock data
    print("\n📝 Example 1: Basic Interview Analysis")
    
    # Mock data for testing (replace with real file paths in production)
    mock_audio_path = "mock_audio.wav"  # This would be a real audio file
    mock_user_answer = "I have 3 years of experience in Python development. I've worked on web applications using Django and Flask frameworks. I'm passionate about clean code and solving complex problems."
    mock_ideal_answer = "The ideal candidate should have experience in Python, web frameworks like Django or Flask, and demonstrate problem-solving skills with clean coding practices."
    mock_keywords = ["Python", "Django", "Flask", "web development", "problem-solving", "clean code"]
    
    # Since we don't have real files for testing, let's create a mock report structure
    print("⚠️ Note: Using mock data for demonstration (real files not available)")
    
    mock_report = {
        "status": "success",
        "timestamp": "2025-01-20T10:30:00",
        "transcribed_text": mock_user_answer,
        "answer_accuracy": {
            "semantic_similarity": 0.85,
            "keyword_coverage": {
                "matched_keywords": 5,
                "total_keywords": 6,
                "coverage_score": 0.83
            }
        },
        "speech_analysis": {
            "sentiment": {
                "label": "Positive",
                "score": 0.7
            },
            "prosody": {
                "avg_pitch": 150.5,
                "pitch_variance": 25.2,
                "energy": 0.8
            }
        },
        "emotion_analysis": {
            "detected_emotion": "Happy",
            "confidence": 0.75
        },
        "overall_score": 82,
        "recommendations": [
            "Excellent answer accuracy! Your responses are well-aligned with expectations.",
            "Good use of relevant keywords. Consider incorporating more domain-specific terms.",
            "Your tone is positive and confident. Keep it up!"
        ],
        "errors": []
    }
    
    print("\n📊 Mock Analysis Report:")
    print(json.dumps(mock_report, indent=2))
    
    # Example 2: Show how to use with real files (commented out)
    print("\n📝 Example 2: Real File Analysis (Commented)")
    print("""
    # Uncomment and modify these lines to use with real files:
    
    # real_report = generate_analysis_report(
    #     audio_path="path/to/interview_audio.wav",
    #     user_answer="User's transcribed answer here",
    #     ideal_answer="Expected answer for comparison",
    #     keywords=["keyword1", "keyword2", "keyword3"],
    #     image_path="path/to/candidate_photo.jpg"
    # )
    # 
    # # Save the report
    # save_report_to_file(real_report, "interview_analysis_report.json")
    # 
    # print("Analysis complete! Check interview_analysis_report.json")
    """)
    
    # Example 3: Batch analysis example
    print("\n📝 Example 3: Batch Analysis Structure")
    print("""
    # Example of batch processing multiple interviews:
    
    # interview_sessions = [
    #     {
    #         "audio_path": "session1_audio.wav",
    #         "user_answer": "Answer for session 1",
    #         "ideal_answer": "Expected answer 1",
    #         "keywords": ["python", "django"],
    #         "question": "Tell me about your Python experience"
    #     },
    #     {
    #         "audio_path": "session2_audio.wav", 
    #         "user_answer": "Answer for session 2",
    #         "ideal_answer": "Expected answer 2",
    #         "keywords": ["react", "javascript"],
    #         "question": "Describe your frontend skills"
    #     }
    # ]
    # 
    # batch_results = batch_analyze_interviews(interview_sessions)
    # print("Batch analysis complete!")
    """)
    
    print("\n✅ Test completed! The ML Analysis Orchestrator is ready to use.")
    print("\n🔧 To use in production:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Import the function: from ml_modules.main_analyzer import generate_analysis_report")
    print("3. Call with real file paths and data")
    print("4. Use the returned JSON report in your application")