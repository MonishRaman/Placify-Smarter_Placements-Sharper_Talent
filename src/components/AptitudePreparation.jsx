import React, { useState } from 'react';
import aptitudeQuestions from '../data/aptitudeQuestions';

const getTopics = (questions) => {
  const topics = [...new Set(questions.map(q => q.topic))];
  return topics;
};


const AptitudePreparation = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);

  const topics = getTopics(aptitudeQuestions);
  const filteredQuestions = selectedTopic
    ? aptitudeQuestions.filter(q => q.topic === selectedTopic)
    : [];
  const currentQuestion = filteredQuestions[currentIndex];

  const handleOptionChange = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    setShowResult(true);
    setResults([
      ...results,
      {
        question: currentQuestion.question,
        selected: selectedAnswer,
        correct: selectedAnswer === currentQuestion.answer,
        explanation: currentQuestion.explanation,
        answer: currentQuestion.answer
      }
    ]);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer('');
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setResults([]);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Aptitude Preparation</h2>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Topic:</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedTopic}
          onChange={e => {
            setSelectedTopic(e.target.value);
            handleReset();
          }}
        >
          <option value="">-- Choose a topic --</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      {selectedTopic && !completed && currentQuestion && (
        <div className="mb-6 p-4 border rounded bg-white shadow">
          <div className="font-semibold mb-2">Q{currentIndex + 1}. {currentQuestion.question}</div>
          <div className="space-y-2">
            {currentQuestion.options.map(option => (
              <label key={option} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleOptionChange(option)}
                  disabled={showResult}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
          {showResult && (
            <div className="mt-2">
              {selectedAnswer === currentQuestion.answer ? (
                <span className="text-green-600 font-semibold">Correct!</span>
              ) : (
                <span className="text-red-600 font-semibold">Incorrect. Correct answer: {currentQuestion.answer}</span>
              )}
              <div className="text-sm text-gray-600 mt-1">Explanation: {currentQuestion.explanation}</div>
            </div>
          )}
          {!showResult ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              Submit
            </button>
          ) : (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
              onClick={handleNext}
            >
              {currentIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          )}
        </div>
      )}
      {completed && (
        <div className="p-6 border rounded bg-white shadow">
          <h3 className="text-xl font-bold mb-4">Quiz Complete!</h3>
          <p className="mb-2">You answered {results.filter(r => r.correct).length} out of {results.length} questions correctly.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AptitudePreparation;
