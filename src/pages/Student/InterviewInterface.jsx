import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Mic,
  MicOff,
  Calendar,
  FileText,
  Brain,
  Star,
  Clock,
  ChevronRight,
  RotateCcw,
  Copy,
  Trash2,
  User,
  Bot,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  ExternalLink,
} from "lucide-react";

// ===== Speech Recognition Component =====
const SpeechRecognitionComponent = ({
  transcript,
  setCurrentAnswer,
  browserSupportsSpeechRecognition,
}) => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const hasSupport = SpeechRecognition && browserSupportsSpeechRecognition;

  if (!hasSupport) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <p className="text-red-600">
          Speech recognition is not supported in this browser. Please use Chrome or Edge for speech features.
        </p>
      </div>
    );
  }

  const startListening = () => {
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setCurrentAnswer(prev => prev + " " + finalTranscript);
            setTextToCopy(prev => prev + " " + finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }

      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const clearText = () => {
    setCurrentAnswer("");
    setTextToCopy("");
  };

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Speech-to-Text Converter
        </h3>
        {isListening && (
          <div className="flex items-center text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}
      </div>
      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300 mb-4 min-h-24">
        <div className="text-xs text-gray-500 mb-2">
          Speech will appear here:
        </div>
        <div className="text-sm text-blue-700">
          {transcript || textToCopy || "Your speech will appear here..."}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={startListening}
          disabled={isListening}
          className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          <Mic className="w-4 h-4 mr-2" />
          Start Listening
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
        >
          <MicOff className="w-4 h-4 mr-2" />
          Stop Listening
        </button>
        <button
          onClick={clearText}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </button>
      </div>
    </div>
  );
};

// ===== Header Component =====
const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-2">
      AI Interview Assistant
    </h1>
    <p className="text-gray-600">
      Master your interviews with AI-powered practice sessions
    </p>
  </header>
);

// ===== Progress Bar Component =====
const ProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Upload Resume" },
    { number: 2, label: "Analysis" },
    { number: 3, label: "Interview" },
    { number: 4, label: "Feedback" },
    { number: 5, label: "Schedule" },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= step.number ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs text-gray-600 mt-1 hidden sm:block">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Resume Upload Component =====
const ResumeUpload = ({
  fileInputRef,
  setResumeFile,
  setResumeAnalysis,
  setCurrentStep,
  loading,
  setLoading,
}) => {
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setLoading(true);

    // Simulate resume analysis
    setTimeout(() => {
      const mockAnalysis = {
        summary: "Experienced software developer with 5+ years in full-stack development",
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
        experience: "5+ years",
        strengths: [
          "Technical leadership",
          "Problem-solving",
          "Team collaboration",
        ],
        suggestions: [
          "Highlight specific project outcomes",
          "Add more quantifiable metrics",
        ],
      };

      setResumeAnalysis(mockAnalysis);
      setCurrentStep(2);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="text-center">
      <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <p className="text-gray-600 mb-6">
        Upload your resume to get personalized interview questions tailored to
        your background
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleResumeUpload}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Choose Resume File
          </>
        )}
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Supported formats: PDF, DOC, DOCX, TXT
      </p>
    </div>
  );
};

// ===== Resume Analysis Component =====
const ResumeAnalysis = ({ resumeAnalysis, generateQuestions, loading }) => (
  <div>
    <div className="flex items-center mb-6">
      <FileText className="w-8 h-8 text-blue-600 mr-3" />
      <h2 className="text-2xl font-bold">Resume Analysis Complete</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-green-800">Summary</h3>
        <p className="text-gray-700">{resumeAnalysis.summary}</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-blue-800">
          Experience Level
        </h3>
        <p className="text-gray-700">{resumeAnalysis.experience}</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-purple-800">Key Skills</h3>
        <div className="flex flex-wrap gap-2">
          {resumeAnalysis.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-yellow-800">Strengths</h3>
        <ul className="text-gray-700">
          {resumeAnalysis.strengths.map((strength, index) => (
            <li key={index} className="mb-1">
              • {strength}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="bg-amber-50 p-6 rounded-lg mb-8">
      <h3 className="font-bold text-lg mb-3 text-amber-800 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        Improvement Suggestions
      </h3>
      <ul className="text-gray-700">
        {resumeAnalysis.suggestions.map((suggestion, index) => (
          <li key={index} className="mb-1">
            • {suggestion}
          </li>
        ))}
      </ul>
    </div>

    <div className="text-center">
      <button
        onClick={generateQuestions}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Generating Personalized Questions...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5 mr-2" />
            Generate Interview Questions
          </>
        )}
      </button>
    </div>
  </div>
);

// ===== Interview Session Component =====
const InterviewSession = ({
  questions,
  currentQuestionIndex,
  currentAnswer,
  setCurrentAnswer,
  transcript,
  nextQuestion,
  resetInterview,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold">Mock Interview Session</h2>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Current Question Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border-l-4 border-blue-600">
        <div className="flex items-start">
          <Bot className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Interview Question {currentQuestionIndex + 1}:
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Speech Recognition Interface */}
      <SpeechRecognitionComponent
        transcript={transcript}
        setCurrentAnswer={setCurrentAnswer}
        browserSupportsSpeechRecognition={true}
      />

      {/* Answer Input */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <User className="w-5 h-5 text-green-600 mr-2" />
          <label className="block text-lg font-medium">Your Answer:</label>
        </div>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Your answer will appear here as you speak, or you can type it manually..."
          className="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 resize-vertical"
          rows={6}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={resetInterview}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </button>
        <button
          onClick={nextQuestion}
          disabled={!currentAnswer.trim()}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Interview
            </>
          ) : (
            <>
              Next Question
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ===== Feedback Component =====
const Feedback = ({ feedback, loading, resetInterview, scheduleNext }) => {
  return (
    <div>
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">
            Analyzing Your Performance
          </h2>
          <p className="text-gray-600">AI is evaluating your responses...</p>
        </div>
      ) : (
        feedback && (
          <>
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold">
                Interview Results & Feedback
              </h2>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Overall Score
                  </h3>
                  <p className="text-gray-600">
                    Based on content, clarity, and structure
                  </p>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {feedback.overallScore}/10
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Strengths
                </h3>
                <ul className="text-gray-700 space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-orange-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="text-gray-700 space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Feedback */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-lg mb-4">
                Question-by-Question Analysis
              </h3>
              <div className="space-y-4">
                {feedback.questionFeedback.map((qf, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">
                      Q{index + 1}: {qf.question}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-600">
                          Content:{" "}
                        </span>
                        <span className="font-bold">{qf.contentScore}/10</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">
                          Clarity:{" "}
                        </span>
                        <span className="font-bold">{qf.clarityScore}/10</span>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">
                          Structure:{" "}
                        </span>
                        <span className="font-bold">
                          {qf.structureScore}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{qf.feedback}</p>
                  </div>
                ))}
              </div>
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
                onClick={scheduleNext}
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Next Session
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

// ===== Calendar Scheduling Component =====
const CalendarScheduling = ({
  calendarEvents,
  setCalendarEvents,
  resetInterview,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("AI Interview Practice Session");

  // Generate unique ID for events
  const generateEventId = () => {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Schedule Interview locally
  const scheduleInterview = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    const eventDate = new Date(`${selectedDate}T${selectedTime}`);
    if (eventDate <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    const newEvent = {
      id: generateEventId(),
      title: sessionTitle,
      date: selectedDate,
      time: selectedTime,
      dateTime: eventDate.toISOString(),
      source: "local",
      description: "Scheduled via AI Interview Assistant - Practice your interview skills",
    };

    setCalendarEvents([...calendarEvents, newEvent]);
    setSelectedDate("");
    setSelectedTime("");
    setSessionTitle("AI Interview Practice Session");
    alert("✅ Interview session scheduled successfully!");
  };

  // Delete Event
  const handleDeleteEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter((event) => event.id !== eventId));
    alert("✅ Event deleted successfully!");
  };

  // Export to ICS format
  const exportToICS = (event) => {
    const startDate = new Date(event.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Interview Assistant//EN
BEGIN:VEVENT
UID:${event.id}@ai-interview-assistant.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const getGoogleCalendarURL = (event) => {
    const startDate = new Date(event.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.description,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Calendar className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold">Schedule Practice Sessions</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Schedule New Session */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Schedule New Session
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Title
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AI Interview Practice Session"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={scheduleInterview}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Session
            </button>
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Scheduled Sessions ({calendarEvents.length})
          </h3>

          {calendarEvents.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {calendarEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at ⏰ {event.time}
                      </p>
                      
                      {/* Export Buttons */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => exportToICS(event)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                          title="Download .ics file"
                        >
                          📥 Export
                        </button>
                        <a
                          href={getGoogleCalendarURL(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors inline-flex items-center"
                          title="Add to Google Calendar"
                        >
                          📅 Google
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 ml-2"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No sessions scheduled yet</p>
              <p className="text-sm">
                Schedule your first practice session above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Calendar Integration Help
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">📱 Mobile Devices</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use the "Export" button to download a calendar file that can be imported into:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• iOS Calendar (iPhone/iPad)</li>
              <li>• Android Calendar</li>
              <li>• Outlook Mobile</li>
              <li>• Any calendar app that supports .ics files</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">💻 Desktop Applications</h4>
            <p className="text-sm text-gray-600 mb-2">
              Compatible with popular calendar applications:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Microsoft Outlook</li>
              <li>• Apple Calendar (macOS)</li>
              <li>• Thunderbird Calendar</li>
              <li>• Google Calendar (via web)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={resetInterview}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center mx-auto"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start New Interview
        </button>
      </div>
    </div>
  );
};

// ===== Main AI Interview Assistant Component =====
const AIInterviewAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Speech Recognition states
  const [transcript, setTranscript] = useState("");

  const fileInputRef = useRef(null);

  const generateQuestions = () => {
    setLoading(true);
    // Simulate question generation based on resume analysis
    setTimeout(() => {
      const mockQuestions = [
        "Tell me about yourself and your background in software development.",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you stay updated with the latest technologies in your field?",
        "Explain a time when you had to work with a difficult team member.",
        "Where do you see yourself in the next 5 years?",
        "What interests you most about this role and our company?",
        "Describe your experience with React and JavaScript frameworks.",
        "How do you approach debugging complex technical issues?",
      ];
      setQuestions(mockQuestions);
      setCurrentStep(3);
      setLoading(false);
    }, 2000);
  };

  const nextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      // Interview complete, generate feedback
      setLoading(true);
      setTimeout(() => {
        const mockFeedback = {
          overallScore: 8.2,
          strengths: [
            "Clear and concise communication",
            "Good technical knowledge demonstration",
            "Structured responses using STAR method",
          ],
          improvements: [
            "Add more specific examples with metrics",
            "Practice maintaining eye contact",
            "Reduce use of filler words",
          ],
          questionFeedback: questions.map((q, i) => ({
            question: q,
            contentScore: Math.floor(Math.random() * 3) + 7,
            clarityScore: Math.floor(Math.random() * 3) + 7,
            structureScore: Math.floor(Math.random() * 3) + 7,
            feedback: "Good response with room for more specific examples.",
          })),
        };
        setFeedback(mockFeedback);
        setCurrentStep(4);
        setLoading(false);
      }, 3000);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setTranscript("");
    }
  };

  const resetInterview = () => {
    setCurrentStep(1);
    setResumeFile(null);
    setResumeAnalysis(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setFeedback(null);
    setTranscript("");
  };

  const scheduleNext = () => {
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        <ProgressBar currentStep={currentStep} />
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <ResumeUpload
              fileInputRef={fileInputRef}
              setResumeFile={setResumeFile}
              setResumeAnalysis={setResumeAnalysis}
              setCurrentStep={setCurrentStep}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {currentStep === 2 && resumeAnalysis && (
            <ResumeAnalysis
              resumeAnalysis={resumeAnalysis}
              generateQuestions={generateQuestions}
              loading={loading}
            />
          )}
          {currentStep === 3 && (
            <InterviewSession
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              currentAnswer={currentAnswer}
              setCurrentAnswer={setCurrentAnswer}
              transcript={transcript}
              nextQuestion={nextQuestion}
              resetInterview={resetInterview}
            />
          )}
          {currentStep === 4 && (
            <Feedback
              feedback={feedback}
              loading={loading}
              resetInterview={resetInterview}
              scheduleNext={scheduleNext}
            />
          )}
          {currentStep === 5 && (
            <CalendarScheduling
              calendarEvents={calendarEvents}
              setCalendarEvents={setCalendarEvents}
              resetInterview={resetInterview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewAssistant;