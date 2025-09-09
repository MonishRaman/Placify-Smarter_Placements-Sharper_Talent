#!/usr/bin/env python3
"""
Test script for the ML Analysis Orchestrator

This script demonstrates how to use the main_analyzer.py module
and provides examples for testing the ML pipeline.

Usage:
    python test_analyzer.py
"""

import os
import sys
import json
from datetime import datetime

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

try:
    from main_analyzer import (
        generate_analysis_report,
        analyze_interview_session,
        batch_analyze_interviews,
        save_report_to_file,
    )

    print("✅ Successfully imported ML Analysis Orchestrator")
except ImportError as e:
    print(f"❌ Failed to import main_analyzer: {e}")
    print("Make sure all dependencies are installed: pip install -r requirements.txt")
    sys.exit(1)


def test_basic_analysis():
    """Test basic analysis functionality with mock data."""
    print("\n" + "=" * 60)
    print("🧪 TEST 1: Basic Analysis with Mock Data")
    print("=" * 60)

    # Mock test data
    test_data = {
        "audio_path": "test_audio.wav",  # Mock path
        "user_answer": "I have extensive experience in Python programming, particularly with Django and Flask frameworks. I've built several web applications and APIs. I enjoy solving complex problems and writing clean, maintainable code.",
        "ideal_answer": "The candidate should demonstrate strong Python skills, experience with web frameworks like Django or Flask, and show passion for problem-solving and code quality.",
        "keywords": [
            "Python",
            "Django",
            "Flask",
            "web applications",
            "APIs",
            "problem-solving",
            "clean code",
        ],
        "image_path": None,  # No image for this test
    }

    print(f"📝 User Answer: {test_data['user_answer'][:100]}...")
    print(f"🎯 Keywords to check: {test_data['keywords']}")

    try:
        # Note: This will show errors for missing files, but will still process text analysis
        report = generate_analysis_report(**test_data)

        print(f"\n📊 Analysis Results:")
        print(f"   Overall Score: {report['overall_score']}/100")
        print(f"   Status: {report['status']}")
        print(f"   Errors: {len(report['errors'])}")

        if report.get("answer_accuracy"):
            acc = report["answer_accuracy"]
            if "semantic_similarity" in acc:
                print(f"   Semantic Similarity: {acc['semantic_similarity']:.3f}")
            if "keyword_coverage" in acc:
                kw = acc["keyword_coverage"]
                print(
                    f"   Keyword Coverage: {kw['matched_keywords']}/{kw['total_keywords']} ({kw['coverage_score']:.2f})"
                )

        print(f"\n💡 Recommendations ({len(report['recommendations'])}):")
        for i, rec in enumerate(report["recommendations"][:3], 1):
            print(f"   {i}. {rec}")

        return report

    except Exception as e:
        print(f"❌ Test failed: {e}")
        return None


def test_enhanced_session_analysis():
    """Test enhanced session analysis with metadata."""
    print("\n" + "=" * 60)
    print("🧪 TEST 2: Enhanced Session Analysis")
    print("=" * 60)

    session_data = {
        "audio_path": "mock_session.wav",
        "user_answer": "React is a JavaScript library for building user interfaces. I've used it to create dynamic web applications with component-based architecture. I'm familiar with hooks, state management, and modern React patterns.",
        "ideal_answer": "React is a popular JavaScript library for UI development. Candidates should understand components, state management, hooks, and modern development practices.",
        "keywords": [
            "React",
            "JavaScript",
            "components",
            "hooks",
            "state management",
            "UI",
        ],
        "question": "Tell me about your experience with React.js",
        "candidate_info": {
            "name": "Jane Smith",
            "role": "Frontend Developer",
            "experience_level": "Mid-level",
        },
    }

    try:
        enhanced_report = analyze_interview_session(**session_data)

        print(f"📋 Question: {session_data['question']}")
        print(f"👤 Candidate: {session_data['candidate_info']['name']}")
        print(f"📊 Overall Score: {enhanced_report['overall_score']}/100")

        # Show session metadata
        metadata = enhanced_report.get("session_metadata", {})
        print(f"🔧 Modules Used: {', '.join(metadata.get('modules_used', []))}")
        print(f"📅 Analysis Version: {metadata.get('analysis_version', 'Unknown')}")

        return enhanced_report

    except Exception as e:
        print(f"❌ Enhanced test failed: {e}")
        return None


def test_batch_analysis():
    """Test batch analysis functionality."""
    print("\n" + "=" * 60)
    print("🧪 TEST 3: Batch Analysis")
    print("=" * 60)

    # Mock batch data
    batch_sessions = [
        {
            "audio_path": "session1.wav",
            "user_answer": "I'm proficient in Python and have worked with Django for 2 years.",
            "ideal_answer": "Strong Python and Django experience required.",
            "keywords": ["Python", "Django"],
            "question": "Describe your Python experience",
        },
        {
            "audio_path": "session2.wav",
            "user_answer": "I know JavaScript and React. I've built several frontend applications.",
            "ideal_answer": "Frontend skills with JavaScript and React are essential.",
            "keywords": ["JavaScript", "React", "frontend"],
            "question": "Tell me about your frontend skills",
        },
        {
            "audio_path": "session3.wav",
            "user_answer": "I have experience with databases, particularly MySQL and PostgreSQL.",
            "ideal_answer": "Database knowledge with SQL databases is important.",
            "keywords": ["database", "MySQL", "PostgreSQL", "SQL"],
            "question": "What's your database experience?",
        },
    ]

    try:
        batch_results = batch_analyze_interviews(batch_sessions)

        print(f"📊 Batch Results:")
        print(f"   Total Sessions: {batch_results['total_sessions']}")
        print(f"   Successful: {batch_results['successful_analyses']}")
        print(f"   Failed: {batch_results['failed_analyses']}")

        if batch_results.get("aggregate_insights"):
            insights = batch_results["aggregate_insights"]
            print(f"   Average Score: {insights['average_score']}")
            print(
                f"   Score Range: {insights['lowest_score']} - {insights['highest_score']}"
            )

        print(f"\n🎯 Top Batch Recommendations:")
        for i, rec in enumerate(batch_results.get("batch_recommendations", [])[:3], 1):
            print(f"   {i}. {rec}")

        return batch_results

    except Exception as e:
        print(f"❌ Batch test failed: {e}")
        return None


def test_file_operations():
    """Test file saving and loading operations."""
    print("\n" + "=" * 60)
    print("🧪 TEST 4: File Operations")
    print("=" * 60)

    # Create a sample report
    sample_report = {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "overall_score": 85,
        "test_data": True,
    }

    test_file = "test_report.json"

    try:
        # Test saving
        success = save_report_to_file(sample_report, test_file)
        if success:
            print("✅ File save test passed")

            # Test loading
            if os.path.exists(test_file):
                with open(test_file, "r") as f:
                    loaded_report = json.load(f)
                print("✅ File load test passed")
                print(f"   Loaded score: {loaded_report['overall_score']}")

                # Cleanup
                os.remove(test_file)
                print("🧹 Test file cleaned up")
            else:
                print("❌ File was not created")
        else:
            print("❌ File save test failed")

    except Exception as e:
        print(f"❌ File operations test failed: {e}")


def main():
    """Run all tests."""
    print("🎬 Starting ML Analysis Orchestrator Tests")
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Run all tests
    test_basic_analysis()
    test_enhanced_session_analysis()
    test_batch_analysis()
    test_file_operations()

    print("\n" + "=" * 60)
    print("🏁 All Tests Completed!")
    print("=" * 60)
    print("\n📚 Next Steps:")
    print("1. Install required dependencies: pip install -r requirements.txt")
    print("2. Test with real audio/image files")
    print("3. Integrate with your backend server")
    print("4. Customize scoring weights and recommendations as needed")
    print("\n💡 For production use:")
    print("- Replace mock file paths with real audio/image files")
    print("- Add error handling for your specific use case")
    print("- Consider adding logging for production monitoring")


if __name__ == "__main__":
    main()
