import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Camera, CameraOff, Mic, MicOff } from "lucide-react";
const InterviewLeft = ({ onStreamReady, onRecordingReady, transcript, setTranscript }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const [cameraPermission, setCameraPermission] = useState("pending");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    requestCameraAccess();
  }, []);

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setCameraPermission("granted");
      onStreamReady(true);
    } catch (error) {
      logger.error("Camera access denied:", error);
      setCameraPermission("denied");
      onStreamReady(false);
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.onstop = () => {
          const videoBlob = new Blob(recordedChunksRef.current, {
            type: "video/webm; codecs=vp9,opus",
          });
          resolve(videoBlob);
        };
        mediaRecorderRef.current.stop();
      } else resolve(null);
    });
  };

  useEffect(() => {
    onRecordingReady(() => stopRecording());
  }, []);

  // --- Speech Recognition Setup ---
const startSpeechRecognition = () => {
    logger.debug("Initializing SpeechRecognition...");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        logger.warn("SpeechRecognition API not supported in this browser.");
        return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    logger.debug("SpeechRecognition instance created and configured.");

    recognitionRef.current.onresult = (event) => {
        logger.debug("SpeechRecognition result event:", event);
        let interimTranscript = "";
        let finalTranscript = transcript;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
                logger.debug("Final transcript received:", result[0].transcript);
                finalTranscript += result[0].transcript + " ";
            } else {
                logger.debug("Interim transcript received:", result[0].transcript);
                interimTranscript += result[0].transcript;
            }
        }

        // Live update parent transcript (final + interim)
        logger.debug("Updating transcript:", finalTranscript + interimTranscript);
        setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
        logger.error("SpeechRecognition error:", event.error);
    };

    logger.debug("Starting SpeechRecognition...");
    recognitionRef.current.start();
};

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // --- Toggle Camera ---
  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  // --- Toggle Mic ---
  const toggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);

      if (audioTrack.enabled) {
        startSpeechRecognition();
      } else {
        stopSpeechRecognition();
      }
    }
  };

  return (
    <motion.div
      className="hidden lg:flex w-full lg:w-1/2 px-6 py-12"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.div
        className="rounded-2xl h-full flex flex-col items-center justify-center relative overflow-hidden dark:bg-black bg-white transition-colors duration-300"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        {cameraPermission === "pending" && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Camera Permission Required
            </h3>
            <p className="text-gray-600 mb-4">
              Please allow camera access to continue with the interview
            </p>
            <button
              onClick={requestCameraAccess}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
            >
              Grant Camera Access
            </button>
          </div>
        )}

        {cameraPermission === "denied" && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Camera Access Denied
            </h3>
            <p className="text-gray-600 mb-4">
              Please enable camera access in your browser settings
            </p>
            <button
              onClick={requestCameraAccess}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {cameraPermission === "granted" && (
          <>
            <motion.video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 sm:h-80 md:h-full object-cover rounded-2xl"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
            {/* Recording Indicator */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-white">Recording</span>
            </div>

            {/* Toggle Controls */}
            <div className="absolute top-4 right-4 flex gap-3">
              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg text-white hover:bg-black/70 transition"
              >
                {isCameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                {isCameraOn ? "Camera On" : "Camera Off"}
              </button>

              {/* Mic Toggle */}
              <button
                onClick={toggleMic}
                className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg text-white hover:bg-black/70 transition"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                {isMicOn ? "Mic On" : "Mic Off"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InterviewLeft;
