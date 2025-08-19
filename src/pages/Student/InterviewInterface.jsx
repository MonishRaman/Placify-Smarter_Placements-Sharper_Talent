import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import InterviewLeft from "../../components/InterviewLeft";
import InterviewRight from "../../components/InterviewRight";

import apiClient from "../../api/apiClient";
import { motion } from "framer-motion";
import { AlertCircle, Camera, CameraOff, Mic, MicOff, Bot, Send, CheckCircle, ArrowDownCircle } from "lucide-react";
import { getNextQuestion } from "../../lib/geminiHelper";


const InterviewInterface = () => {
  const navigate = useNavigate();
  const [stopRecording, setStopRecording] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [transcript, setTranscript] = useState("");

  const interviewId = Date.now().toString();

  // When InterviewLeft confirms stream is ready
  const handleStreamReady = (ready) => {
    setIsStreamReady(ready);
  };

  // When InterviewLeft provides the stop recording function
  const handleRecordingReady = (stopFn) => {
    setStopRecording(() => stopFn);
  };

  // When InterviewRight updates the list of answers
  const handleAnswersUpdate = (newAnswers) => {
    setAnswers(newAnswers);
  };

  // Finish button click
  const handleFinish = async () => {
    try {
      const videoBlob = await stopRecording?.();

      const formData = new FormData();
      if (videoBlob) {
        formData.append("video", videoBlob, `interview_${interviewId}.webm`);
      }
      formData.append("answers", JSON.stringify(answers));
      formData.append("interviewId", interviewId);


      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/interviews/upload`,formData);

      navigate(`/results/${interviewId}`);
    } catch (err) {
      console.error("Upload failed", err);
      navigate(`/results/${interviewId}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <InterviewLeft
        onStreamReady={handleStreamReady}
        onRecordingReady={handleRecordingReady}
        transcript={transcript}
        setTranscript={setTranscript}
      />

      <InterviewRight
        transcript={transcript}
        setTranscript={setTranscript}
        onAnswersUpdate={handleAnswersUpdate}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default InterviewInterface;
