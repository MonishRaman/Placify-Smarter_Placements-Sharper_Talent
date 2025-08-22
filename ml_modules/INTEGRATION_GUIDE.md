# 🔗 ML Analysis Orchestrator - Integration Guide

This guide shows how to integrate the ML Analysis Orchestrator with your backend server.

## 📋 Overview

The ML Analysis Orchestrator (`main_analyzer.py`) provides a single function that combines all ML capabilities:

- **Speech-to-Text**: Convert audio to text
- **Sentiment Analysis**: Analyze emotional tone
- **Prosody Analysis**: Voice characteristics (pitch, energy)
- **Answer Accuracy**: Semantic similarity with ideal answers
- **Keyword Coverage**: Check for important terms
- **Emotion Detection**: Facial emotion analysis (optional)
- **Overall Scoring**: Combined performance metrics
- **Recommendations**: Actionable feedback

## 🚀 Quick Start

### 1. Basic Usage

```python
from ml_modules.main_analyzer import generate_analysis_report

# Analyze an interview response
report = generate_analysis_report(
    audio_path="uploads/interview_audio.wav",
    user_answer="I have 3 years of Python experience...",
    ideal_answer="Candidate should have Python experience...",
    keywords=["Python", "Django", "API"],
    image_path="uploads/candidate_photo.jpg"  # Optional
)

print(f"Score: {report['overall_score']}/100")
```

### 2. Enhanced Session Analysis

```python
from ml_modules.main_analyzer import analyze_interview_session

enhanced_report = analyze_interview_session(
    audio_path="uploads/audio.wav",
    user_answer="User's response text",
    ideal_answer="Expected answer",
    question="Tell me about your experience",
    candidate_info={"name": "John Doe", "role": "Software Engineer"}
)
```

## 🔧 Backend Integration Examples

### Node.js/Express Integration

```javascript
const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze-interview', 
  upload.fields([{ name: 'audio' }, { name: 'image' }]), 
  async (req, res) => {
    try {
      const { user_answer, ideal_answer, question, keywords } = req.body;
      const audioFile = req.files.audio?.[0];
      const imageFile = req.files.image?.[0];
      
      // Prepare data for Python script
      const analysisData = {
        audio_filename: audioFile.filename,
        user_answer: user_answer || '',
        ideal_answer: ideal_answer || '',
        question: question || '',
        keywords: keywords ? keywords.split(',') : null,
        image_filename: imageFile?.filename || null
      };
      
      // Call Python ML analyzer
      const pythonProcess = spawn('python', [
        path.join(__dirname, 'ml_modules', 'integration_example.py'),
        JSON.stringify(analysisData)
      ]);
      
      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          const report = JSON.parse(result);
          res.json(report);
        } else {
          res.status(500).json({ error: 'Analysis failed' });
        }
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

### Python Flask Integration

```python
from flask import Flask, request, jsonify
from ml_modules.integration_example import InterviewAnalysisService
import os

app = Flask(__name__)
analysis_service = InterviewAnalysisService(upload_dir="uploads")

@app.route('/api/analyze-interview', methods=['POST'])
def analyze_interview():
    try:
        # Get uploaded files
        audio_file = request.files.get('audio')
        image_file = request.files.get('image')
        
        # Get form data
        user_answer = request.form.get('user_answer', '')
        ideal_answer = request.form.get('ideal_answer', '')
        question = request.form.get('question', '')
        keywords = request.form.get('keywords', '').split(',') if request.form.get('keywords') else None
        
        # Save files
        audio_filename = None
        image_filename = None
        
        if audio_file:
            audio_filename = f"audio_{int(time.time())}_{audio_file.filename}"
            audio_file.save(os.path.join('uploads', audio_filename))
        
        if image_file:
            image_filename = f"image_{int(time.time())}_{image_file.filename}"
            image_file.save(os.path.join('uploads', image_filename))
        
        # Analyze
        report = analysis_service.analyze_interview_response(
            audio_filename=audio_filename,
            user_answer=user_answer,
            ideal_answer=ideal_answer,
            question=question,
            keywords=keywords,
            image_filename=image_filename
        )
        
        # Cleanup (optional)
        analysis_service.cleanup_files([audio_filename, image_filename])
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500
```

## 📊 Output Format

The analysis report follows this structure:

```json
{
  "status": "success",
  "timestamp": "2025-01-20T10:30:00",
  "transcribed_text": "User's full transcribed answer...",
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
  "errors": [],
  "session_metadata": {
    "question": "Tell me about your Python experience",
    "candidate_info": {"name": "John Doe"},
    "analysis_version": "1.0",
    "modules_used": ["speech_analysis", "answer_accuracy", "emotion_detector"]
  }
}
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd ml_modules
pip install -r requirements.txt
```

### 2. Test the Orchestrator

```bash
# Run basic tests
python main_analyzer.py

# Run integration tests
python test_analyzer.py

# Test with your backend
python integration_example.py
```

### 3. Backend Integration

1. **Copy the ML modules** to your backend project
2. **Install Python dependencies** on your server
3. **Add the API endpoint** using the examples above
4. **Handle file uploads** for audio and images
5. **Call the analysis function** and return results

## 📁 File Structure

```
ml_modules/
├── main_analyzer.py          # 🎯 Main orchestrator
├── integration_example.py    # 🔧 Backend integration helpers
├── test_analyzer.py         # 🧪 Test suite
├── requirements.txt         # 📦 Dependencies
├── speech_analysis/         # 🎤 Speech processing
├── emotion_detector/        # 😊 Emotion detection
├── answer_accuracy/         # 📊 Answer evaluation
└── INTEGRATION_GUIDE.md     # 📚 This guide
```

## ⚡ Performance Tips

1. **File Cleanup**: Always clean up uploaded files after analysis
2. **Error Handling**: The orchestrator handles missing files gracefully
3. **Async Processing**: Consider running analysis in background for large files
4. **Caching**: Cache analysis results for repeated requests
5. **Monitoring**: Log analysis performance and errors

## 🔍 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **File Not Found**: Check file paths and upload directory permissions
   ```python
   # Verify file exists before analysis
   if not os.path.exists(audio_path):
       return {"status": "error", "error": "Audio file not found"}
   ```

3. **Memory Issues**: For large files, consider processing in chunks
4. **Permission Errors**: Ensure upload directory has write permissions

### Debug Mode

Enable debug output by setting environment variable:
```bash
export ML_DEBUG=1
python main_analyzer.py
```

## 🎯 Next Steps

1. **Customize Scoring**: Adjust weights in `calculate_overall_score()`
2. **Add New Metrics**: Extend the analysis with additional ML models
3. **Improve Recommendations**: Enhance the recommendation engine
4. **Add Caching**: Implement result caching for better performance
5. **Monitor Performance**: Add logging and monitoring for production use

## 📞 Support

For questions or issues:
- Check the test files: `test_analyzer.py`
- Review integration examples: `integration_example.py`
- Refer to individual module documentation in each subdirectory

Happy integrating! 🚀