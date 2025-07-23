import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Camera, Mic, SkipForward, Square, Bot,Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewInterface = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cameraPermission, setCameraPermission] = useState('pending');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    requestCameraAccess();
  }, []);

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

  // const handleNextQuestion = () => {
  //   if (currentQuestionIndex < questions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //   }
  // };
  const interviewId = Date.now().toString(); // simple ID

 const handleFinishInterview = () => {
  // Stop camera stream
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach(track => track.stop());
  }

  // Prepare result
  const resultData = {
    id: interviewId,
    name: "Candidate Name", // Replace this with dynamic user info if available
    score: 7,
    total: questions.length,
    feedback: "Good communication and clarity."
  };

  // Save to localStorage
  localStorage.setItem(interviewId, JSON.stringify(resultData));

  // Navigate to results page
  navigate(`/results/${interviewId}`);
};

  // const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const interviewQuestions = [
  "Hi let's start with the interview.Tell me about yourself.",
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
const [messages, setMessages] = useState([
    { sender: 'bot', text: interviewQuestions[0] }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userInput, setUserInput] = useState('');

  const handleSend = () => {
    if (userInput.trim() === '') return;

    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userInput }
    ];

    // Add next bot question after user response
    if (currentQuestion < interviewQuestions.length) {
      updatedMessages.push({
        sender: 'bot',
        text: interviewQuestions[currentQuestion]
      });
      setCurrentQuestion(currentQuestion + 1);
    }else if (currentQuestion === interviewQuestions.length) {
    // Interview is complete, show final message
    updatedMessages.push({
      sender: 'bot',
      text: 'Sorry,Not available right now.'
    });
    setCurrentQuestion(currentQuestion + 1); // prevent it from repeating
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
            <div className="flex items-center space-x-2">
              {cameraPermission === "granted" && (
                <motion.div
                  className="flex items-center space-x-1 dark:text-emerald-400 text-emerald-600"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >

//   return (
//     <div className="min-h-screen dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900 transition-colors">
//       {/* Header */}
//       <div className=" dark:bg-black/50 bg-white/70 p-4 transition-colors">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               {cameraPermission === 'granted' && (
//                 <div className="flex items-center space-x-1 text-emerald-400">

                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Camera Active</span>
                </div>
              )}
              <div className="flex items-center space-x-1 text-emerald-400">
                <Mic className="w-4 h-4" />
                <span className="text-sm">Mic Active</span>
              </div>
            </div>
          </div>


          <div className="dark:text-white text-gray-900">
            {/* <span className="text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span> */}

          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Panel - Video Feed */}


        <motion.div
          className="flex-1 p-6"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl h-full flex items-center justify-center relative overflow-hidden dark:bg-black bg-white transition-colors duration-300">
            {cameraPermission === "pending" && (
              <motion.div
                className="text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

                <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">
                  Camera Permission Required
                </h3>
                <p className="dark:text-gray-400 text-gray-600 mb-4">
                  Please allow camera access to continue with the interview
                </p>


//         <div className="flex-1 p-6">
//           <div className=" rounded-2xl h-full flex items-center justify-center relative overflow-hidden dark:bg-black bg-white transition-colors">
//             {cameraPermission === 'pending' && (
//               <div className="text-center">
//                 <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Camera Permission Required</h3>
//                 <p className=" dark:text-gray-400 text-gray-600 mb-4">Please allow camera access to continue with the interview</p>

                <button
                  onClick={requestCameraAccess}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Grant Camera Access
                </button>
              </div>
            )}


            {cameraPermission === "denied" && (
              <motion.div
                className="text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />

                <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">
                  Camera Access Denied
                </h3>
                <p className="dark:text-gray-400 text-gray-600 mb-4">
                  Please enable camera access in your browser settings
                </p>


            
//             {cameraPermission === 'denied' && (
//               <div className="text-center">
//                 <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
//                 <p className=" dark:text-gray-400 text-gray-600 mb-4">Please enable camera access in your browser settings</p>

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
                  <span className="text-sm">Recording</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Questions */}


        <motion.div
          className="w-1/2 p-6"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="dark:bg-gray-800 bg-white rounded-2xl h-full p-8 flex flex-col transition-colors duration-300">
            {/* Progress Bar */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-full dark:bg-gray-700 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  animate={{ width: `${(currentQuestion / interviewQuestions.length) * 100}%` }}
                  initial={{ width: 0 }}
                  // animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                ></motion.div>
              </div>
            </motion.div>
            <div className="chatbox px-4 bg-blue-50 h-full flex flex-col">
              {/* Header */}
              <div className="h-20 flex items-center gap-3 border-b-2 border-gray-300">
                <Bot className="h-12 w-12 text-blue-700" />
                <h1 className="text-2xl font-semibold">Interview Questions</h1>
              </div>

              {/* Chat area */}
              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      msg.sender === "bot" ? "justify-start" : "justify-end"
                    }`}

//         <div className="w-1/2 p-6">
//           <div className=" dark:bg-gray-800 bg-white rounded-2xl h-full p-8 flex flex-col transition-colors">
//             {/* Progress Bar */}
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm dark:text-gray-400 text-gray-600">Progress</span>
//                 <span className="text-sm  dark:text-gray-400 text-gray-600">
//                   {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full dark:bg-gray-700 bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-purple-600 h-2 rounded-full transition-all duration-300"
//                   style={{
//                     width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
//                   }}
//                 ></div>
//               </div>
//             </div>

//             {/* Current Question */}
//             <div className="flex-1 flex flex-col justify-center">
//               <div className="mb-8">
//                 <h2 className="text-3xl font-bold mb-6 leading-tight">
//                   {questions[currentQuestionIndex]}
//                 </h2>
//                 <div className="border rounded-xl p-4 dark:bg-purple-600/20 dark:border-purple-500/30 bg-purple-100/40 border-purple-300/30">
//                   <p className=" dark:text-purple-200 text-purple-800 text-sm">
//                     💡 <strong>Tip:</strong> Take your time to think before answering. 
//                     Speak clearly and maintain eye contact with the camera.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="space-y-4">
//               <div className="flex space-x-4">
//                 {!isLastQuestion ? (
//                   <button
//                     onClick={handleNextQuestion}
//                     className="flex-1 bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-xl 
//                                font-semibold flex items-center justify-center space-x-2 
//                                transition-colors"
//                   >
//                     <SkipForward className="w-5 h-5" />
//                     <span>Next Question</span>
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleFinishInterview}
//                     className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-6 py-4 rounded-xl 
//                                font-semibold flex items-center justify-center space-x-2 
//                                transition-colors"

                  >
                    {msg.sender === "bot" && (
                      <Bot className="w-8 h-8 text-blue-700 mr-2" />
                    )}

                    <div
                      className={`max-w-xs p-3 rounded-lg shadow ${
                        msg.sender === "bot"
                          ? "bg-white text-gray-900"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>


              {/* Input area */}
              <div className="h-20 flex items-center gap-2 p-3 border-t border-gray-300">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 h-15 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="w-full text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white py-2 transition-colors"
//               >
//                 Exit Interview
//               </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInterface;