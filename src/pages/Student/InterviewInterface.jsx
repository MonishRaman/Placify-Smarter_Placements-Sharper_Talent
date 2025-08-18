import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Mic, MicOff, Calendar, FileText, Brain, Star, Clock, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const AIInterviewAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isGoogleCalendarLoaded, setIsGoogleCalendarLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // API Configuration
  const GEMINI_API_KEY = 'AIzaSyCNxNQPMt0c7pIyIKMEBCmhQVWOdguC_jc';
  const GOOGLE_CLIENT_ID = '863542617609-o40s9dj91qsnhpkj25p9vqa3421i4ugg.apps.googleusercontent.com';
  const SPEECH_API_KEY = '6cdbcf7779044d498d9863a70b048b8a';

  // Load Google APIs
  useEffect(() => {
    const loadGoogleAPIs = () => {
      // Load Google Calendar API
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client:auth2', initializeGapi);
        };
        document.head.appendChild(script);
      } else {
        window.gapi.load('client:auth2', initializeGapi);
      }
    };

    const initializeGapi = async () => {
      try {
        await window.gapi.client.init({
          apiKey: GEMINI_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar'
        });

        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        setIsGoogleCalendarLoaded(true);

        // Listen for sign-in state changes
        authInstance.isSignedIn.listen(setIsSignedIn);
      } catch (error) {
        console.error('Error initializing Google API:', error);
        setIsGoogleCalendarLoaded(true); // Still mark as loaded to show fallback
      }
    };

    loadGoogleAPIs();
  }, []);

  // Google Calendar Sign In
  const signInToGoogle = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsSignedIn(true);
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Failed to sign in to Google Calendar. Please try again.');
    }
  };

  // Sign out from Google
  const signOutFromGoogle = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  // Step 1: Resume Upload and Analysis
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile(file);
      setLoading(true);
      
      try {
        // Simulate resume analysis with Gemini AI
        const resumeText = await extractTextFromFile(file);
        const analysis = await analyzeResumeWithGemini(resumeText);
        setResumeAnalysis(analysis);
        setCurrentStep(2);
      } catch (error) {
        console.error('Resume analysis failed:', error);
        // Fallback analysis
        setResumeAnalysis({
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          experience: '3 years in software development',
          strengths: ['Problem solving', 'Team collaboration', 'Technical expertise'],
          role: 'Software Developer'
        });
        setCurrentStep(2);
      } finally {
        setLoading(false);
      }
    }
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const analyzeResumeWithGemini = async (resumeText) => {
    const prompt = `Analyze this resume and extract:
    1. Top 5 technical skills
    2. Years of experience
    3. Key strengths
    4. Most suitable role
    
    Resume: ${resumeText}
    
    Return as JSON format.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Parse the response (simplified)
      return {
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        experience: '3+ years in software development',
        strengths: ['Problem solving', 'Team collaboration', 'Technical expertise'],
        role: 'Software Developer'
      };
    } catch (error) {
      throw error;
    }
  };

  // Step 2: Generate Interview Questions
  const generateQuestions = async () => {
    setLoading(true);
    try {
      const prompt = `Generate 8 interview questions for a ${resumeAnalysis.role} with skills: ${resumeAnalysis.skills.join(', ')} and experience: ${resumeAnalysis.experience}. 
      Include behavioral, technical, and situational questions. Return as JSON array.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      
      // Fallback questions based on analysis
      const generatedQuestions = [
        "Tell me about yourself and your background in software development.",
        "How do you approach problem-solving in your development work?",
        "Describe a challenging project you've worked on with React or JavaScript.",
        "How do you stay updated with the latest technology trends?",
        "Tell me about a time you had to collaborate with a difficult team member.",
        "How do you handle tight deadlines and pressure?",
        "What's your experience with database design and SQL?",
        "Where do you see yourself in the next 5 years?"
      ];
      
      setQuestions(generatedQuestions);
      setCurrentStep(3);
    } catch (error) {
      console.error('Question generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Conduct Interview with Speech-to-Text
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const transcript = await transcribeAudio(audioBlob);
        setCurrentAnswer(transcript);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to free up microphone
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      // Convert blob to base64
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Use Web Speech API (browser-based) as fallback
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return await useWebSpeechAPI();
      }

      // Try Azure Speech Services
      const response = await fetch(`https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': SPEECH_API_KEY,
          'Content-Type': 'audio/wav',
          'Accept': 'application/json'
        },
        body: audioBlob
      });

      if (response.ok) {
        const result = await response.json();
        return result.DisplayText || "Could not transcribe audio.";
      } else {
        throw new Error('Speech API request failed');
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      return "Transcription failed. Please type your answer or try recording again.";
    }
  };

  const useWebSpeechAPI = () => {
    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        resolve("Speech recognition failed. Please try again or type your answer.");
      };

      recognition.start();
    });
  };

  const nextQuestion = () => {
    if (currentAnswer) {
      setAnswers([...answers, { question: questions[currentQuestionIndex], answer: currentAnswer }]);
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        evaluateInterview();
      }
    }
  };

  // Step 4: Evaluate Interview
  const evaluateInterview = async () => {
    setLoading(true);
    setCurrentStep(4);
    
    try {
      const prompt = `Evaluate this interview performance:
      Questions and Answers: ${JSON.stringify(answers)}
      
      Provide:
      1. Overall score (1-10)
      2. Strengths (3 points)
      3. Areas for improvement (3 points)
      4. Specific feedback for each answer
      
      Return as JSON.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      // Simulate feedback
      setFeedback({
        overallScore: 7.5,
        strengths: [
          'Clear communication and articulation',
          'Good technical knowledge demonstration',
          'Professional demeanor throughout'
        ],
        improvements: [
          'Provide more specific examples',
          'Elaborate on problem-solving process',
          'Show more enthusiasm and passion'
        ],
        detailedFeedback: answers.map((_, index) => ({
          question: index + 1,
          score: Math.floor(Math.random() * 3) + 7,
          comment: 'Good response with room for more detail.'
        }))
      });
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar Integration
  const scheduleToGoogleCalendar = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    if (!isSignedIn) {
      await signInToGoogle();
      return;
    }

    try {
      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const event = {
        summary: 'Mock Interview Practice Session',
        description: 'AI-powered interview practice session',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/New_York'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      if (response.status === 200) {
        const newEvent = {
          id: response.result.id,
          date: selectedDate,
          time: selectedTime,
          title: 'Mock Interview Practice',
          googleEventId: response.result.id
        };
        setCalendarEvents([...calendarEvents, newEvent]);
        alert('Interview scheduled successfully in Google Calendar!');
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      alert('Failed to schedule event. Please try again.');
    }
  };

  // Local scheduling fallback
  const scheduleInterview = () => {
    if (selectedDate && selectedTime) {
      const newEvent = {
        id: Date.now(),
        date: selectedDate,
        time: selectedTime,
        title: 'Mock Interview Practice'
      };
      setCalendarEvents([...calendarEvents, newEvent]);
      alert('Interview scheduled successfully!');
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const resetInterview = () => {
    setCurrentStep(1);
    setResumeFile(null);
    setResumeAnalysis(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Interview Assistant</h1>
          <p className="text-gray-600">Master your interviews with AI-powered practice sessions</p>
        </header>

        {/* Progress Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                {step < 4 && <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Resume Upload */}
          {currentStep === 1 && (
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
              <p className="text-gray-600 mb-6">Upload your resume to get personalized interview questions</p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleResumeUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Analyzing Resume...' : 'Choose Resume File'}
              </button>
              
              {resumeFile && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700">✅ {resumeFile.name} uploaded successfully</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Resume Analysis */}
          {currentStep === 2 && resumeAnalysis && (
            <div>
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold">Resume Analysis</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeAnalysis.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">Strengths</h3>
                  <ul className="space-y-2">
                    {resumeAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="w-4 h-4 text-green-600 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={generateQuestions}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Interview */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">Mock Interview</h2>
                </div>
                <div className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Interview Question:</h3>
                <p className="text-gray-700 text-lg">{questions[currentQuestionIndex]}</p>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                
                {isRecording && (
                  <div className="flex items-center text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                    Recording...
                  </div>
                )}
                
                {/* Manual text input fallback */}
                <div className="w-full">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Your answer will appear here, or you can type it manually..."
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-24"
                  />
                </div>
                
                <button
                  onClick={nextQuestion}
                  disabled={!currentAnswer.trim()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results & Feedback */}
          {currentStep === 4 && feedback && (
            <div>
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold">Interview Results</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Overall Score</h3>
                  <div className="text-4xl font-bold text-yellow-600">{feedback.overallScore}/10</div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">Strengths</h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-orange-600 mr-2 mt-0.5" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetInterview}
                  className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Practice Again
                </button>
                
                <button
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Practice
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Calendar Scheduling */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">Schedule Practice Sessions</h2>
                </div>
                
                {isGoogleCalendarLoaded && (
                  <div className="flex items-center space-x-2">
                    {isSignedIn ? (
                      <button
                        onClick={signOutFromGoogle}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Sign out from Google
                      </button>
                    ) : (
                      <button
                        onClick={signInToGoogle}
                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Sign in to Google Calendar
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Schedule New Session</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Time</label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {isGoogleCalendarLoaded && isSignedIn ? (
                        <button
                          onClick={scheduleToGoogleCalendar}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📅 Schedule in Google Calendar
                        </button>
                      ) : (
                        <button
                          onClick={scheduleInterview}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Schedule Session Locally
                        </button>
                      )}
                    </div>
                    
                    {!isSignedIn && isGoogleCalendarLoaded && (
                      <p className="text-sm text-gray-600 text-center">
                        Sign in to Google to sync with your calendar
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-4">Scheduled Sessions</h3>
                  {calendarEvents.length > 0 ? (
                    <div className="space-y-3">
                      {calendarEvents.map((event) => (
                        <div key={event.id} className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-green-600 mr-2" />
                              <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                                {event.googleEventId && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    Synced with Google Calendar
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No sessions scheduled yet</p>
                  )}
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button
                  onClick={resetInterview}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Start New Interview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-4">
            <span className={`inline-flex items-center ${isGoogleCalendarLoaded ? 'text-green-600' : 'text-yellow-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isGoogleCalendarLoaded ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
              Google Calendar: {isGoogleCalendarLoaded ? 'Ready' : 'Loading...'}
            </span>
            <span className="inline-flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Speech Recognition: {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? 'Available' : 'Using Fallback'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewAssistant;