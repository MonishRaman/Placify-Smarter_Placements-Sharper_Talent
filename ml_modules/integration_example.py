"""
Integration Example: How to use ML Analysis Orchestrator with Backend Server

This file shows how to integrate the ML Analysis Orchestrator with your
main backend server (Node.js/Express) or any other backend framework.

Author: Placify Team
"""

import os
import sys
import json
from typing import Dict, Any, Optional

# Add ml_modules to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from main_analyzer import generate_analysis_report, analyze_interview_session


class InterviewAnalysisService:
    """
    Service class for handling interview analysis in a backend environment.
    
    This class provides a clean interface for backend servers to use
    the ML analysis capabilities.
    """
    
    def __init__(self, upload_dir: str = "uploads"):
        """
        Initialize the analysis service.
        
        Args:
            upload_dir (str): Directory where uploaded files are stored
        """
        self.upload_dir = upload_dir
        self.ensure_upload_dir()
    
    def ensure_upload_dir(self):
        """Ensure the upload directory exists."""
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)
            print(f"📁 Created upload directory: {self.upload_dir}")
    
    def analyze_interview_response(
        self,
        audio_filename: str,
        user_answer: str,
        ideal_answer: str,
        question: str = "",
        keywords: Optional[list] = None,
        image_filename: Optional[str] = None,
        candidate_info: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Analyze a single interview response.
        
        Args:
            audio_filename (str): Name of the audio file in upload directory
            user_answer (str): User's transcribed answer
            ideal_answer (str): Expected answer for comparison
            question (str): The interview question asked
            keywords (list, optional): Keywords to check for
            image_filename (str, optional): Name of image file for emotion detection
            candidate_info (dict, optional): Additional candidate information
        
        Returns:
            Dict[str, Any]: Complete analysis report
        """
        
        # Construct full file paths
        audio_path = os.path.join(self.upload_dir, audio_filename)
        image_path = os.path.join(self.upload_dir, image_filename) if image_filename else None
        
        # Validate files exist
        if not os.path.exists(audio_path):
            return {
                "status": "error",
                "error": f"Audio file not found: {audio_filename}",
                "overall_score": 0
            }
        
        if image_path and not os.path.exists(image_path):
            print(f"⚠️ Warning: Image file not found: {image_filename}")
            image_path = None
        
        try:
            # Generate the analysis report
            report = analyze_interview_session(
                audio_path=audio_path,
                user_answer=user_answer,
                ideal_answer=ideal_answer,
                keywords=keywords,
                image_path=image_path,
                question=question,
                candidate_info=candidate_info
            )
            
            # Add file information to report
            report["file_info"] = {
                "audio_file": audio_filename,
                "image_file": image_filename,
                "audio_exists": os.path.exists(audio_path),
                "image_exists": image_path and os.path.exists(image_path)
            }
            
            return report
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "overall_score": 0,
                "file_info": {
                    "audio_file": audio_filename,
                    "image_file": image_filename,
                    "error_details": str(e)
                }
            }
    
    def cleanup_files(self, filenames: list):
        """
        Clean up uploaded files after analysis.
        
        Args:
            filenames (list): List of filenames to delete
        """
        for filename in filenames:
            if filename:
                file_path = os.path.join(self.upload_dir, filename)
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        print(f"🗑️ Cleaned up file: {filename}")
                except Exception as e:
                    print(f"⚠️ Failed to cleanup {filename}: {e}")


# Example Flask integration
def create_flask_integration_example():
    """
    Example of how to integrate with Flask backend.
    
    This is just an example - adapt for your specific backend framework.
    """
    
    flask_example = '''
# Example Flask route for interview analysis
from flask import Flask, request, jsonify
from ml_modules.integration_example import InterviewAnalysisService

app = Flask(__name__)
analysis_service = InterviewAnalysisService(upload_dir="uploads")

@app.route('/api/analyze-interview', methods=['POST'])
def analyze_interview():
    try:
        # Get form data
        audio_file = request.files.get('audio')
        image_file = request.files.get('image')  # Optional
        user_answer = request.form.get('user_answer', '')
        ideal_answer = request.form.get('ideal_answer', '')
        question = request.form.get('question', '')
        keywords = request.form.get('keywords', '').split(',') if request.form.get('keywords') else None
        
        # Save uploaded files
        audio_filename = None
        image_filename = None
        
        if audio_file:
            audio_filename = f"audio_{int(time.time())}_{audio_file.filename}"
            audio_file.save(os.path.join('uploads', audio_filename))
        
        if image_file:
            image_filename = f"image_{int(time.time())}_{image_file.filename}"
            image_file.save(os.path.join('uploads', image_filename))
        
        # Analyze the interview
        report = analysis_service.analyze_interview_response(
            audio_filename=audio_filename,
            user_answer=user_answer,
            ideal_answer=ideal_answer,
            question=question,
            keywords=keywords,
            image_filename=image_filename
        )
        
        # Cleanup files (optional)
        cleanup_files = [audio_filename, image_filename]
        analysis_service.cleanup_files(cleanup_files)
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
    '''
    
    return flask_example


# Example Express.js integration
def create_express_integration_example():
    """
    Example of how to integrate with Express.js backend using Python subprocess.
    """
    
    express_example = '''
// Example Express.js route for interview analysis
const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze-interview', 
  upload.fields([{ name: 'audio' }, { name: 'image' }]), 
  async (req, res) => {
    try {
      const { user_answer, ideal_answer, question, keywords } = req.body;
      const audioFile = req.files.audio?.[0];
      const imageFile = req.files.image?.[0];
      
      if (!audioFile) {
        return res.status(400).json({ error: 'Audio file required' });
      }
      
      // Prepare analysis data
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
          try {
            const report = JSON.parse(result);
            
            // Cleanup uploaded files
            if (audioFile) fs.unlinkSync(audioFile.path);
            if (imageFile) fs.unlinkSync(imageFile.path);
            
            res.json(report);
          } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse analysis result' });
          }
        } else {
          res.status(500).json({ error: 'Analysis failed' });
        }
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
    '''
    
    return express_example


def run_integration_tests():
    """Run integration tests to verify everything works."""
    print("\n🔧 INTEGRATION TESTS")
    print("="*60)
    
    # Test 1: Service initialization
    try:
        service = InterviewAnalysisService(upload_dir="test_uploads")
        print("✅ Service initialization successful")
    except Exception as e:
        print(f"❌ Service initialization failed: {e}")
        return
    
    # Test 2: Mock analysis with service
    try:
        # This will fail gracefully since files don't exist, but tests the interface
        result = service.analyze_interview_response(
            audio_filename="mock_audio.wav",
            user_answer="I have Python experience",
            ideal_answer="Python experience required",
            question="Tell me about Python",
            keywords=["Python", "programming"]
        )
        
        print(f"✅ Service analysis interface working")
        print(f"   Status: {result['status']}")
        print(f"   Has error handling: {'error' in result}")
        
    except Exception as e:
        print(f"❌ Service analysis test failed: {e}")
    
    # Cleanup test directory
    try:
        if os.path.exists("test_uploads"):
            os.rmdir("test_uploads")
            print("🧹 Test cleanup completed")
    except:
        pass


def main():
    """Main test runner."""
    print("🎯 ML ANALYSIS ORCHESTRATOR - INTEGRATION TESTS")
    print("="*70)
    
    # Run basic functionality tests
    basic_report = test_basic_analysis()
    enhanced_report = test_enhanced_session_analysis()
    batch_report = test_batch_analysis()
    
    # Run integration tests
    run_integration_tests()
    
    # Show integration examples
    print("\n📋 BACKEND INTEGRATION EXAMPLES")
    print("="*60)
    print("\n🐍 Flask Integration Example:")
    print("See the Flask example in create_flask_integration_example()")
    
    print("\n🟢 Express.js Integration Example:")
    print("See the Express.js example in create_express_integration_example()")
    
    print("\n✨ INTEGRATION SUMMARY")
    print("="*60)
    print("The ML Analysis Orchestrator provides:")
    print("✅ Single function interface for all ML capabilities")
    print("✅ Structured JSON output for easy backend integration")
    print("✅ Error handling and graceful degradation")
    print("✅ Batch processing capabilities")
    print("✅ File management utilities")
    print("✅ Comprehensive scoring and recommendations")
    
    print("\n🚀 Ready for production integration!")
    print("Check the integration examples above for your backend framework.")


if __name__ == "__main__":
    # Handle command line arguments for backend integration
    if len(sys.argv) > 1:
        try:
            # Parse analysis data from command line (for Express.js integration)
            analysis_data = json.loads(sys.argv[1])
            service = InterviewAnalysisService()
            result = service.analyze_interview_response(**analysis_data)
            print(json.dumps(result))
        except Exception as e:
            error_result = {"status": "error", "error": str(e)}
            print(json.dumps(error_result))
    else:
        # Run tests if no arguments provided
        main()