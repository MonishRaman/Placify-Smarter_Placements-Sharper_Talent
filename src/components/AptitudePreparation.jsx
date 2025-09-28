import React, { useState, useEffect, useCallback } from "react";

const TOPICS = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  // Add more topics as needed
];

const AptitudePreparation = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);

  // Reset quiz state
  const handleReset = useCallback(() => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setResults([]);
    setCompleted(false);
    setError("");
    setAnswerFeedback(null);
  }, []);

  // Fetch questions when topic changes
  useEffect(() => {
    if (!selectedTopic) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      handleReset();

      try {
        // 1. Try to fetch questions for topic
        const res = await fetch(
          `/api/questions?topic=${encodeURIComponent(selectedTopic)}`
        );
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          // 2. If none found, auto-generate one
          const genRes = await fetch("/api/questions/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: selectedTopic,
              difficulty: "medium",
            }),
          });
          if (!genRes.ok) {
            throw new Error("Failed to generate question");
          }
          // 3. After generating, fetch again
          const res2 = await fetch(
            `/api/questions?topic=${encodeURIComponent(selectedTopic)}`
          );
          const data2 = await res2.json();
          setQuestions(Array.isArray(data2) ? data2 : []);
        } else {
          setQuestions(data);
        }
      } catch (err) {
        setError(
          "❌ Failed to fetch or generate questions. Please try again later."
        );
        console.error("Fetch/generate questions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedTopic, handleReset]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setShowResult(true);
    setAnswerFeedback(null);
    setLoading(true);

    try {
      const res = await fetch("/api/questions/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion._id || currentQuestion.id,
          selectedAnswer,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setAnswerFeedback(data);

      setResults((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          selected: selectedAnswer,
          correct: data.correct,
          explanation: data.explanation,
          answer: data.answer,
        },
      ]);
    } catch (err) {
      setError("❌ Failed to submit answer. Please try again.");
      console.error("Submit answer error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer("");
    setAnswerFeedback(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  // Progress bar calculation
  const progress =
    questions.length > 0
      ? ((currentIndex + (completed ? 1 : 0)) / questions.length) * 100
      : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 transition-all duration-500 px-2 py-8">
      {/* Header Section */}
      <div className="w-full max-w-3xl flex flex-col items-center mb-8 animate-fade-in">
        <h1 className="text-5xl font-black text-blue-600 dark:text-blue-400 drop-shadow-lg tracking-tight mb-2">
          Aptitude Preparation
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2 text-center max-w-xl">
          Sharpen your skills with topic-wise aptitude quizzes. Select a topic,
          answer questions, and get instant feedback with explanations. Track
          your progress and improve!
        </p>
        <div className="flex gap-4 mt-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold shadow">
            Modern UI
          </span>
          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold shadow">
            Instant Feedback
          </span>
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-semibold shadow">
            Progress Tracking
          </span>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="mb-8 w-full max-w-2xl animate-fade-in">
        <label
          htmlFor="topic-select"
          className="block mb-2 font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2"
        >
          <span className="inline-block text-blue-500 dark:text-blue-400">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </span>
          Select Topic:
        </label>
        <div className="relative">
          <select
            id="topic-select"
            className="appearance-none border-2 border-blue-400 dark:border-blue-600 rounded-xl px-4 py-3 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg text-lg pr-10 font-medium hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-600 dark:focus:border-blue-500"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            aria-label="Select aptitude topic"
          >
            <option value="" disabled>
              -- Choose a topic --
            </option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic} className="text-base py-2">
                {topic}
              </option>
            ))}
          </select>
          {/* Custom arrow icon */}
          <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </span>
        </div>
        <style>{`
          select#topic-select::-ms-expand { display: none; }
        `}</style>
      </div>

      {/* Progress Bar */}
      {selectedTopic && questions.length > 0 && (
        <div className="w-full max-w-2xl mb-6 animate-fade-in">
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-8 w-full max-w-2xl p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-lg border border-red-300 dark:border-red-700 animate-fade-in">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-8 w-full max-w-2xl p-4 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-300 dark:border-blue-700 animate-fade-in">
          <span className="font-semibold">Loading questions...</span>
        </div>
      )}

      {/* No Questions */}
      {selectedTopic &&
        !loading &&
        !error &&
        !completed &&
        questions.length === 0 && (
          <div className="mb-8 w-full max-w-2xl p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 shadow-lg border border-yellow-300 dark:border-yellow-700 animate-fade-in">
            <strong>Info:</strong> No questions found for this topic. Please try
            another topic or check back later.
          </div>
        )}

      {/* Question Card */}
      {selectedTopic && !completed && currentQuestion && (
        <div className="mb-8 w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-gray-950 shadow-2xl border border-blue-200 dark:border-blue-800 animate-fade-in">
          <div className="font-bold mb-6 text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-base font-semibold shadow">
              Q{currentIndex + 1}
            </span>
            <span>{currentQuestion.question}</span>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {currentQuestion.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-200 border-2 text-lg font-medium shadow-md ${
                  selectedAnswer === option
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900 scale-[1.03]"
                    : "border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950"
                } ${showResult ? "opacity-70 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id || currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  disabled={showResult}
                  className="accent-blue-600 dark:accent-blue-400 w-5 h-5"
                />
                <span className="ml-2 text-gray-800 dark:text-gray-200 font-medium">
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Feedback */}
          {showResult && answerFeedback && (
            <div className="mt-6 animate-fade-in">
              <div
                className={`flex items-center gap-2 mb-2 text-lg font-semibold ${
                  answerFeedback.correct
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {answerFeedback.correct ? (
                  <>
                    <span className="text-2xl">✅</span>
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">❌</span>
                    <span>Incorrect.</span>
                  </>
                )}
              </div>
              {!answerFeedback.correct && (
                <div className="mb-2 text-base text-gray-800 dark:text-gray-200">
                  <strong>Correct Answer:</strong>{" "}
                  <span className="underline font-bold">
                    {answerFeedback.answer}
                  </span>
                </div>
              )}
              <div className="text-base text-gray-700 dark:text-gray-300 mt-2">
                <strong>Explanation:</strong> {answerFeedback.explanation}
              </div>
            </div>
          )}

          {/* Submit / Next */}
          <div className="flex justify-end mt-8">
            {!showResult ? (
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in text-lg"
                onClick={handleSubmit}
                disabled={!selectedAnswer || loading}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-700 dark:to-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in text-lg"
                onClick={handleNext}
              >
                {currentIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Completed */}
      {completed && (
        <div className="p-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-950 shadow-2xl border border-blue-200 dark:border-blue-800 animate-fade-in flex flex-col items-center">
          <h3 className="text-3xl font-black mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <span>🎓</span> Quiz Complete!
          </h3>
          <p className="mb-4 text-xl text-gray-900 dark:text-gray-100 font-semibold">
            You answered{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {results.filter((r) => r.correct).length}
            </span>{" "}
            out of <span className="font-bold">{results.length}</span> questions
            correctly.
          </p>
          <div className="w-full mb-6">
            <h4 className="text-lg font-bold mb-2 text-blue-600 dark:text-blue-300">
              Review Your Answers:
            </h4>
            <ul className="space-y-3">
              {results.map((r, idx) => (
                <li
                  key={idx}
                  className={`p-4 rounded-xl shadow border ${
                    r.correct
                      ? "border-green-300 bg-green-50 dark:bg-green-950"
                      : "border-red-300 bg-red-50 dark:bg-red-950"
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Q{idx + 1}. {r.question}
                  </div>
                  <div className="text-base mb-1">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={
                        r.correct
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }
                    >
                      {r.selected}
                    </span>
                  </div>
                  {!r.correct && (
                    <div className="text-base mb-1">
                      <strong>Correct Answer:</strong>{" "}
                      <span className="underline font-bold">{r.answer}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 mt-4 animate-fade-in text-lg"
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AptitudePreparation;
