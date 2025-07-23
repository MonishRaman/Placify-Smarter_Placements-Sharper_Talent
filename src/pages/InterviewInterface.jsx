import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Bot, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewInterface = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  const [cameraPermission, setCameraPermission] = useState('pending');
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi let's start with the interview. Tell me about yourself." }
  ]);

  const interviewQuestions = [
    "Hi let's start with the interview. Tell me about yourself.",
    "Why do you want to work at this company?",
    "What are your strengths and weaknesses?",
    "Describe a challenge you faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "What motivates you?",
    "How do you handle stress and pressure?",
    "What is your biggest professional achievement?",
    "How do you prioritize your work?",
    "Why should we hire you?",
    "Thank you for your time. We will get back to you shortly"
  ];

  useEffect(() => {
    requestCameraAccess();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraPermission('granted');
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
    }
  };

  const interviewId = Date.now().toString();

  const handleFinishInterview = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }

    const resultData = {
      id: interviewId,
      name: "Candidate Name",
      score: 7,
      total: interviewQuestions.length,
      feedback: "Good communication and clarity."
    };

    localStorage.setItem(interviewId, JSON.stringify(resultData));
    navigate(`/results/${interviewId}`);
  };

  const handleSend = () => {
    if (userInput.trim() === '') return;

    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userInput }
    ];

    if (currentQuestion < interviewQuestions.length) {
      updatedMessages.push({
        sender: 'bot',
        text: interviewQuestions[currentQuestion]
      });
      setCurrentQuestion(currentQuestion + 1);
    }

    setMessages(updatedMessages);
    setUserInput('');
  };

  return (
    <motion.div
      className="min-h-screen dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="dark:bg-black/50 bg-white/80 p-4 transition-colors duration-300"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {cameraPermission === "granted" && (
              <motion.div className="flex items-center space-x-1 text-emerald-500">
                <Camera className="w-4 h-4" />
                <span className="text-sm">Camera Active</span>
              </motion.div>
            )}
            <div className="flex items-center space-x-1 text-emerald-500">
              <Mic className="w-4 h-4" />
              <span className="text-sm">Mic Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex h-screen">
        {/* Left Panel - Video Feed */}
        <motion.div
          className="flex-1 p-6"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl h-full flex items-center justify-center relative overflow-hidden dark:bg-black bg-white transition-colors duration-300">
            {cameraPermission === "pending" && (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Camera Permission Required</h3>
                <p className="text-gray-600 mb-4">Please allow camera access to continue with the interview</p>
                <button
                  onClick={requestCameraAccess}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Grant Camera Access
                </button>
              </div>
            )}
            {cameraPermission === "denied" && (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
                <p className="text-gray-600 mb-4">Please enable camera access in your browser settings</p>
                <button
                  onClick={requestCameraAccess}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            {cameraPermission === "granted" && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white">Recording</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Chat Interface */}
        <motion.div
          className="w-1/2 p-6"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="dark:bg-gray-800 bg-white rounded-2xl h-full p-8 flex flex-col transition-colors duration-300">
            {/* Progress Bar */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  animate={{ width: `${(currentQuestion / interviewQuestions.length) * 100}%` }}
                  initial={{ width: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>

            {/* Chat Box */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-4 mb-4">
                <Bot className="h-8 w-8 text-blue-700" />
                <h2 className="text-2xl font-semibold">Interview Questions</h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      msg.sender === 'bot' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <Bot className="w-6 h-6 text-blue-700 mr-2" />
                    )}
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow ${
                        msg.sender === 'bot'
                          ? 'bg-white text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 mt-4 border-t border-gray-300 pt-4">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {/* Finish Button */}
              {currentQuestion >= interviewQuestions.length && (
                <button
                  onClick={handleFinishInterview}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg w-full"
                >
                  <CheckCircle className="inline-block w-5 h-5 mr-2" />
                  Finish Interview
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InterviewInterface;
