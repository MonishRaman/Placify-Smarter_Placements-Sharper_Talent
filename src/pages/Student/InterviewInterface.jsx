import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewLeft from "../../components/InterviewLeft";
import InterviewRight from "../../components/InterviewRight";


const InterviewInterface = () => {
  const navigate = useNavigate();
  const [stopRecording, setStopRecording] = useState(null);
  const [answers, setAnswers] = useState([]);
  const interviewId = Date.now().toString();
  const [isStreamReady, setIsStreamReady] = useState(false);

  const handleFinishInterview = useCallback(async () => {
    try {
      const videoBlob = await stopRecording?.();

      const formData = new FormData();
      if (videoBlob)
        formData.append("video", videoBlob, `interview_${interviewId}.webm`);
      formData.append("answers", JSON.stringify(answers));
      formData.append("interviewId", interviewId);

      await axios.post("http://localhost:5000/api/interviews/upload", formData);

      navigate(`/results/${interviewId}`);
    } catch (err) {
      console.error("Upload failed", err);
      navigate(`/results/${interviewId}`);
    }
  }, [stopRecording, answers, navigate, interviewId]);

  const questions = [
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <InterviewLeft
        onStreamReady={setIsStreamReady}
        onRecordingReady={setStopRecording}
      />
      <InterviewRight
        questions={questions}
        onAnswersUpdate={setAnswers}
        onFinish={handleFinishInterview}
        isStreamReady={isStreamReady}
      />
    </div>
  );
};

export default InterviewInterface;