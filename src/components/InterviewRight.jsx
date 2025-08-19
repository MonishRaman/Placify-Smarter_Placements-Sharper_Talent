import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, CheckCircle } from "lucide-react";

const InterviewRight = ({
  transcript,
  setTranscript,
  onAnswersUpdate,
  onFinish
}) => {
  const questions = [
    "Hi, let's start with the interview. Tell me about yourself.",
    "Why do you want to work at this company?",
    "What are your strengths and weaknesses?",
    "Describe a challenge you faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "What motivates you?",
    "How do you handle stress and pressure?",
    "What is your biggest professional achievement?",
    "How do you prioritize your work?",
    "Why should we hire you?",
    "Thank you for your time. We will get back to you shortly."
  ];

  const [messages, setMessages] = useState([
    { sender: "bot", text: questions[0] }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const chatEndRef = useRef(null);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!transcript.trim()) return;

    const updatedMessages = [
      ...messages,
      { sender: "user", text: transcript }
    ];

    // Add next question if available
    if (currentQuestion < questions.length) {
      updatedMessages.push({
        sender: "bot",
        text: questions[currentQuestion]
      });
      setCurrentQuestion(q => q + 1);
    }

    setMessages(updatedMessages);

    // Update answers array in parent
    const updatedAnswers = updatedMessages
      .filter(m => m.sender === "user")
      .map(m => m.text);
    onAnswersUpdate(updatedAnswers);

    setTranscript(""); 
  };

  return (
    <motion.div
      className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="dark:bg-gray-800 bg-white rounded-2xl h-full p-8 flex flex-col">
        {/* Progress */}
        <div className="mb-4 w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-purple-600 h-2 rounded-full"
            animate={{
              width: `${(currentQuestion / questions.length) * 100}%`
            }}
            initial={{ width: "0%" }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Chat */}
        <div className="overflow-y-auto pr-2 space-y-3 mb-4 h-[400px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              {msg.sender === "bot" && (
                <Bot className="w-6 h-6 text-blue-700 mr-2" />
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
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-gray-300 pt-4">
          <input
            type="text"
            placeholder="Type or speak your answer..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {currentQuestion >= questions.length && (
          <button
            onClick={onFinish}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg w-full"
          >
            <CheckCircle className="inline-block w-5 h-5 mr-2" />
            Finish Interview
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewRight;
