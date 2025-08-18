import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  Calculator, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Target,
  BookOpen,
  Search,
  Moon,
  Sun,
  Star,
  Zap,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  RotateCcw,
  Settings,
  HelpCircle,
  Lightbulb,
  Timer,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  Play,
  Pause,
  SkipForward,
  Flag,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';

const Aptitude = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Mock user progress data
  const [userProgress, setUserProgress] = useState({
    totalAnswered: 156,
    correctAnswers: 124,
    streak: 12,
    ranking: 'Expert',
    weeklyGoal: 50,
    weeklyProgress: 34,
    accuracy: 79.5,
    averageTime: '2.3m'
  });

  // Mock aptitude questions data
  const questions = [
    {
      id: 1,
      category: "Quantitative Aptitude",
      subcategory: "Arithmetic",
      difficulty: "Easy",
      timeLimit: 120, // seconds
      question: "If a train travels 240 km in 3 hours, what is its average speed?",
      options: [
        "60 km/h",
        "70 km/h",
        "80 km/h",
        "90 km/h"
      ],
      correctAnswer: 2,
      explanation: "Average speed = Total distance / Total time = 240 km / 3 hours = 80 km/h",
      difficulty_score: 2,
      tags: ["speed", "distance", "time"],
      attempted: true,
      correct: true,
      timeSpent: 45
    },
    {
      id: 2,
      category: "Logical Reasoning",
      subcategory: "Pattern Recognition",
      difficulty: "Medium",
      timeLimit: 180,
      question: "What comes next in the sequence: 2, 6, 18, 54, ?",
      options: [
        "108",
        "162",
        "216",
        "270"
      ],
      correctAnswer: 1,
      explanation: "Each number is multiplied by 3. So, 54 × 3 = 162",
      difficulty_score: 5,
      tags: ["sequence", "pattern", "multiplication"],
      attempted: true,
      correct: false,
      timeSpent: 120
    },
    {
      id: 3,
      category: "Data Interpretation",
      subcategory: "Charts & Graphs",
      difficulty: "Hard",
      timeLimit: 300,
      question: "A pie chart shows that Company A has 35% market share, Company B has 28%, and Company C has 22%. If the total market value is $500 million, what is the combined value of Companies A and B?",
      options: [
        "$315 million",
        "$285 million",
        "$350 million",
        "$275 million"
      ],
      correctAnswer: 0,
      explanation: "Company A: 35% of $500M = $175M, Company B: 28% of $500M = $140M. Combined: $175M + $140M = $315M",
      difficulty_score: 8,
      tags: ["percentage", "pie chart", "calculation"],
      attempted: false,
      correct: null,
      timeSpent: 0
    },
    {
      id: 4,
      category: "Verbal Reasoning",
      subcategory: "Reading Comprehension",
      difficulty: "Medium",
      timeLimit: 240,
      question: "Choose the word that is most similar in meaning to 'EUPHEMISM':",
      options: [
        "Criticism",
        "Substitute expression",
        "Celebration",
        "Confusion"
      ],
      correctAnswer: 1,
      explanation: "A euphemism is a mild or indirect term substituted for one considered harsh or direct.",
      difficulty_score: 6,
      tags: ["vocabulary", "synonyms", "language"],
      attempted: true,
      correct: true,
      timeSpent: 90
    },
    {
      id: 5,
      category: "Quantitative Aptitude",
      subcategory: "Probability",
      difficulty: "Hard",
      timeLimit: 300,
      question: "What is the probability of getting exactly two heads when flipping a coin 4 times?",
      options: [
        "1/4",
        "3/8",
        "1/2",
        "5/8"
      ],
      correctAnswer: 1,
      explanation: "Using combination formula: C(4,2) × (1/2)⁴ = 6 × (1/16) = 6/16 = 3/8",
      difficulty_score: 9,
      tags: ["probability", "combinations", "statistics"],
      attempted: false,
      correct: null,
      timeSpent: 0
    },
    {
      id: 6,
      category: "Logical Reasoning",
      subcategory: "Syllogisms",
      difficulty: "Medium",
      timeLimit: 180,
      question: "All roses are flowers. Some flowers are red. Therefore:",
      options: [
        "All roses are red",
        "Some roses are red",
        "No roses are red",
        "Cannot be determined"
      ],
      correctAnswer: 3,
      explanation: "We cannot determine the relationship between roses and red color from the given statements.",
      difficulty_score: 6,
      tags: ["logic", "syllogism", "reasoning"],
      attempted: true,
      correct: false,
      timeSpent: 150
    }
  ];

  const categories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Verbal Reasoning'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Timer effect for quiz mode
  useEffect(() => {
    let interval;
    if (quizMode && quizStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timeLeft, quizMode, quizStarted]);

  // Initialize with first question
  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions, currentQuestion]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || question.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [questions, searchTerm, selectedDifficulty, selectedCategory]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  const startQuiz = () => {
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setQuizMode(true);
    setCurrentQuizIndex(0);
    setCurrentQuestion(shuffled[0]);
    setTimeLeft(shuffled[0].timeLimit);
    setQuizStarted(true);
    setQuizResults([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (quizMode) {
      // Record result
      const result = {
        question: currentQuestion,
        selectedAnswer,
        correct: selectedAnswer === currentQuestion.correctAnswer,
        timeUsed: currentQuestion.timeLimit - timeLeft
      };
      setQuizResults(prev => [...prev, result]);

      if (currentQuizIndex < quizQuestions.length - 1) {
        const nextIndex = currentQuizIndex + 1;
        setCurrentQuizIndex(nextIndex);
        setCurrentQuestion(quizQuestions[nextIndex]);
        setTimeLeft(quizQuestions[nextIndex].timeLimit);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        setShowResults(true);
        setQuizMode(false);
        setQuizStarted(false);
      }
    } else {
      setShowAnswer(!showAnswer);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const themeClasses = isDarkMode 
    ? 'dark bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Aptitude Hub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Master your skills</p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xs font-medium">{userProgress.ranking}</span>
                </div>
                <p className="text-lg font-bold">{userProgress.totalAnswered}</p>
                <p className="text-xs opacity-90">Questions Solved</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-medium">{userProgress.accuracy}%</span>
                </div>
                <p className="text-lg font-bold">{userProgress.correctAnswers}</p>
                <p className="text-xs opacity-90">Correct Answers</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b dark:border-gray-700">
            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 mb-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold">Start Quick Quiz</p>
                  <p className="text-sm opacity-90">10 random questions</p>
                </div>
                <Play className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                onClick={() => {
                  setCurrentQuestion(question);
                  setQuizMode(false);
                  setSelectedAnswer(null);
                  setShowAnswer(false);
                }}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentQuestion?.id === question.id ? 'bg-purple-50 dark:bg-purple-900/20 border-r-2 border-r-purple-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">
                    Q{question.id}: {question.question.substring(0, 60)}...
                  </h3>
                  {question.attempted ? (
                    question.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                    )
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span className={`px-2 py-1 rounded-full ${getDifficultyBg(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {Math.floor(question.timeLimit / 60)}m
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="truncate">{question.category}</p>
                  <p className="truncate">{question.subcategory}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {showResults ? (
            /* Quiz Results */
            <div className="flex-1 bg-white dark:bg-gray-800 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-gray-600 dark:text-gray-400">Here's how you performed</p>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-6 h-6" />
                      <span className="text-2xl font-bold">
                        {quizResults.filter(r => r.correct).length}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">Correct Answers</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Gauge className="w-6 h-6" />
                      <span className="text-2xl font-bold">
                        {Math.round((quizResults.filter(r => r.correct).length / quizResults.length) * 100)}%
                      </span>
                    </div>
                    <p className="text-sm opacity-90">Accuracy</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Timer className="w-6 h-6" />
                      <span className="text-2xl font-bold">
                        {Math.round(quizResults.reduce((acc, r) => acc + r.timeUsed, 0) / quizResults.length)}s
                      </span>
                    </div>
                    <p className="text-sm opacity-90">Avg Time</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-6 h-6" />
                      <span className="text-2xl font-bold">+{quizResults.filter(r => r.correct).length * 10}</span>
                    </div>
                    <p className="text-sm opacity-90">Points Earned</p>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Detailed Results</h3>
                  {quizResults.map((result, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      result.correct 
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium">Q{index + 1}: {result.question.question}</h4>
                        {result.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Your Answer:</span>
                          <span className={`ml-2 ${result.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {result.selectedAnswer !== null ? result.question.options[result.selectedAnswer] : 'No answer'}
                          </span>
                        </div>
                        {!result.correct && (
                          <div>
                            <span className="font-medium">Correct Answer:</span>
                            <span className="ml-2 text-green-600 dark:text-green-400">
                              {result.question.options[result.question.correctAnswer]}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Time Used:</span>
                          <span className="ml-2">{result.timeUsed}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Back to Questions
                  </button>
                </div>
              </div>
            </div>
          ) : currentQuestion ? (
            <>
              {/* Question Header */}
              <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                      {quizMode ? `Question ${currentQuizIndex + 1}/${quizQuestions.length}` : `Question ${currentQuestion.id}`}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBg(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                    {currentQuestion.attempted && (
                      <div className="flex items-center gap-1">
                        {currentQuestion.correct ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {currentQuestion.correct ? 'Solved' : 'Attempted'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {quizMode && quizStarted && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Timer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="font-mono text-orange-600 dark:text-orange-400 font-semibold">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {currentQuestion.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400">{currentQuestion.subcategory}</p>
              </div>

              {/* Question Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
                    
                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showAnswer}
                          className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                            selectedAnswer === index
                              ? showAnswer
                                ? index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                  : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : showAnswer && index === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                          } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                              selectedAnswer === index
                                ? showAnswer
                                  ? index === currentQuestion.correctAnswer
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-red-500 bg-red-500 text-white'
                                  : 'border-blue-500 bg-blue-500 text-white'
                                : showAnswer && index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : 'border-gray-400 dark:border-gray-500'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="flex-1">{option}</span>
                            {showAnswer && index === currentQuestion.correctAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  {showAnswer && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Explanation</h4>
                          <p className="text-blue-700 dark:text-blue-300">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentQuestion.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600 p-6">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="flex items-center gap-3">
                    {!quizMode && (
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        disabled={selectedAnswer === null}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                      </button>
                    )}

                    {quizMode && (
                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null && timeLeft > 0}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <SkipForward className="w-4 h-4" />
                        {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </button>
                    )}

                    <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      Bookmark
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>Time Limit: {Math.floor(currentQuestion.timeLimit / 60)}:{(currentQuestion.timeLimit % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>Difficulty: {currentQuestion.difficulty_score}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select a question from the sidebar or start a quick quiz to test your aptitude skills.
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>{questions.filter(q => q.attempted && q.correct).length} Correct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{questions.filter(q => !q.attempted).length} Remaining</span>
                  </div>
                </div>
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Start Practice Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats Panel */}
      <div className="fixed top-20 left-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 max-w-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Performance Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Accuracy Rate</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {userProgress.accuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${userProgress.accuracy}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Weekly Goal</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {userProgress.weeklyProgress}/{userProgress.weeklyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Avg. Time: {userProgress.averageTime}</span>
              <span>Streak: {userProgress.streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Quick Access */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 p-4 max-w-sm">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            Quick Categories
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(1).map((category, index) => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const solved = categoryQuestions.filter(q => q.attempted && q.correct).length;
              const colors = [
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600', 
                'from-yellow-500 to-orange-600',
                'from-red-500 to-pink-600'
              ];
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-xl text-white text-left hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r ${colors[index]}`}
                >
                  <div className="text-xs opacity-90 mb-1">{category.split(' ')[0]}</div>
                  <div className="font-bold text-sm">{solved}/{categoryQuestions.length}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {quizMode && selectedAnswer !== null && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className={`px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${
            selectedAnswer === currentQuestion.correctAnswer
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-pink-600'
          }`}>
            {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Aptitude;