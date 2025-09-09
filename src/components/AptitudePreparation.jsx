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

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 via-blue-100 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-all duration-500">
      <h2 className="text-4xl font-extrabold mb-6 text-blue-500 dark:text-blue-400 drop-shadow-lg tracking-tight animate-fade-in">
        Aptitude Preparation
      </h2>

      {/* Topic Selector */}
      <div className="mb-8 w-full">
        <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
          Select Topic:
        </label>
        <select
          className="border-2 border-blue-400 dark:border-blue-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-md"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">-- Choose a topic --</option>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 w-full p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow animate-fade-in">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-8 w-full p-4 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow animate-fade-in">
          Loading...
        </div>
      )}

      {/* No Questions */}
      {selectedTopic &&
        !loading &&
        !error &&
        !completed &&
        questions.length === 0 && (
          <div className="mb-8 w-full p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 shadow animate-fade-in">
            No questions found for this topic.
          </div>
        )}

      {/* Question Card */}
      {selectedTopic && !completed && currentQuestion && (
        <div className="mb-8 w-full p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-blue-100 dark:border-blue-800 animate-fade-in">
          <div className="font-semibold mb-4 text-lg text-gray-900 dark:text-gray-100">
            Q{currentIndex + 1}. {currentQuestion.question}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  selectedAnswer === option
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-950"
                } ${showResult ? "opacity-70 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id || currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  disabled={showResult}
                  className="accent-blue-600 dark:accent-blue-400"
                />
                <span className="ml-2 text-gray-800 dark:text-gray-200 font-medium">
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Feedback */}
          {showResult && answerFeedback && (
            <div className="mt-4 animate-fade-in">
              {answerFeedback.correct ? (
                <span className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  🎉 Correct!
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-semibold text-lg">
                  ❌ Incorrect. Correct answer:{" "}
                  <span className="underline">{answerFeedback.answer}</span>
                </span>
              )}
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Explanation: {answerFeedback.explanation}
              </div>
            </div>
          )}

          {/* Submit / Next */}
          {!showResult ? (
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
              onClick={handleSubmit}
              disabled={!selectedAnswer || loading}
            >
              Submit
            </button>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-700 dark:to-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 mt-6 animate-fade-in"
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          )}
        </div>
      )}

      {/* Quiz Completed */}
      {completed && (
        <div className="p-8 w-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-blue-100 dark:border-blue-800 animate-fade-in flex flex-col items-center">
          <h3 className="text-2xl font-extrabold mb-4 text-blue-600 dark:text-blue-400">
            🎓 Quiz Complete!
          </h3>
          <p className="mb-2 text-lg text-gray-900 dark:text-gray-100">
            You answered{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {results.filter((r) => r.correct).length}
            </span>{" "}
            out of <span className="font-bold">{results.length}</span> questions
            correctly.
          </p>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 mt-6 animate-fade-in"
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}

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
