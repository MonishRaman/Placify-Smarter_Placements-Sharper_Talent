import React, { useState } from "react";
import ResponsiveLayout from "../../components/Coding/ResponsiveLayout";
import SidebarProblemList from "../../components/Coding/SidebarProblemList";
import ProblemDescription from "../../components/Coding/ProblemDescription";
import CodingEditor from "../../components/Coding/CodingEditor";
import TestResults from "../../components/Coding/TestResults";
import CodingActions from "../../components/Coding/CodingActions";
import {
  Sun,
  Moon,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Clock,
  RotateCcw,
  Settings,
} from "lucide-react";

const Coding = () => {
  // Local theme state for demonstration. Replace with context if you have a global theme provider.
  const [isDarkMode, setIsDarkMode] = useState(false);
  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-gray-900";
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Problems list
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      solved: true,
      likes: 1234,
      acceptance: 85,
      category: "Array",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "nums[0] + nums[1] == 9, so return [0, 1].",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
      hints: [
        "A hash map can help you find the complement efficiently.",
        "Try using a single pass through the array.",
      ],
    },
    {
      id: 2,
      title: "Reverse Linked List",
      difficulty: "Medium",
      solved: false,
      likes: 567,
      acceptance: 67,
      category: "Linked List",
      description: "Reverse a singly linked list.",
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
          explanation: "The list is reversed.",
        },
      ],
      constraints: [
        "The number of nodes in the list is the range [0, 5000]",
        "-5000 <= Node.val <= 5000",
      ],
      hints: [
        "Iterative and recursive approaches are both possible.",
        "Think about how you can change the next pointers.",
      ],
    },
    {
      id: 3,
      title: "Word Ladder",
      difficulty: "Hard",
      solved: false,
      likes: 321,
      acceptance: 42,
      category: "Graph",
      description:
        "Given two words (beginWord and endWord), and a dictionary's word list, find the length of shortest transformation sequence from beginWord to endWord.",
      examples: [
        {
          input:
            "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
          output: "5",
          explanation:
            "One shortest transformation is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog', return length 5.",
        },
      ],
      constraints: [
        "1 <= beginWord.length <= 10",
        "1 <= endWord.length <= 10",
        "1 <= wordList.length <= 5000",
      ],
      hints: [
        "Breadth-first search is a good fit for this problem.",
        "Try to pre-process the word list for fast lookups.",
      ],
    },
  ]);
  // Filtered problems (for now, just all problems)
  const [filteredProblems, setFilteredProblems] = useState(problems);
  // Selected problem
  const [selectedProblem, setSelectedProblem] = useState(null);
  // User progress
  const [userProgress, setUserProgress] = useState({
    weeklyGoal: 10,
    weeklyProgress: 3,
  });
  // Search/filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // Categories and difficulties
  const categories = ["Array", "Linked List", "Graph"];
  const difficulties = ["Easy", "Medium", "Hard"];
  // Tabs
  const [activeTab, setActiveTab] = useState("description");
  // Coding editor state and actions
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorLanguage] = useState("javascript");
  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1000);
  };
  const resetCode = () => setCode("");
  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  // Helper for difficulty badge
  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // ...existing code (all your component logic and return)...
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
        >
          <div className="relative">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-12" />
            )}
          </div>
        </button>
      </div>
      <ResponsiveLayout
        sidebar={
          <SidebarProblemList
            problems={problems}
            filteredProblems={filteredProblems}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
            userProgress={userProgress}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            difficulties={difficulties}
          />
        }
        main={
          <div className="flex-1 min-h-0 flex flex-col">
            {selectedProblem ? (
              <div className="flex flex-col h-full min-h-0">
                {/* Problem Header */}
                <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold dark:text-white">
                        {selectedProblem.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBg(
                          selectedProblem.difficulty
                        )}`}
                      >
                        {selectedProblem.difficulty}
                      </span>
                      {selectedProblem.solved && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Solved</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{selectedProblem.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>{selectedProblem.acceptance}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="flex gap-6 border-b dark:border-gray-700 -mb-6">
                    {["description", "solutions", "discussions"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                          activeTab === tab
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Main coding area: show modular components */}
                <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-6 p-2 md:p-4 min-h-0">
                  {/* Left: Problem description (tab-based) */}
                  <div className="w-full md:w-1/2 mb-4 md:mb-0 min-h-0 overflow-auto">
                    {activeTab === "description" && (
                      <ProblemDescription problem={selectedProblem} />
                    )}
                    {activeTab === "solutions" && (
                      <div className="text-gray-500 dark:text-gray-400">
                        Solutions coming soon...
                      </div>
                    )}
                    {activeTab === "discussions" && (
                      <div className="text-gray-500 dark:text-gray-400">
                        Discussions coming soon...
                      </div>
                    )}
                  </div>
                  {/* Right: Coding editor and actions */}
                  <div className="w-full md:w-1/2 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 ">
                      <CodingEditor
                        code={code}
                        onChange={setCode}
                        isDarkMode={isDarkMode}
                        problem={selectedProblem}
                        language={editorLanguage}
                        isEditorReady={isEditorReady}
                        onMount={() => setIsEditorReady(true)}
                        // fallback height for Monaco
              
                      />
                    </div>
                    <CodingActions
                      code={code}
                      runCode={runCode}
                      resetCode={resetCode}
                      isRunning={isRunning}
                    />
                    <TestResults problem={selectedProblem} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 min-h-[60vh]">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span role="img" aria-label="code" className="text-4xl">
                      💻
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Ready to Code?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Select a problem from the sidebar to start practicing your
                    coding skills.
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span>
                        {problems.filter((p) => p.solved).length} Solved
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>
                        {problems.length -
                          problems.filter((p) => p.solved).length}{" "}
                        Remaining
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />
      {/* Progress Modal/Tooltip */}
      <div className="fixed top-20 left-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Weekly Progress
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Goal: {userProgress.weeklyGoal} problems</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {userProgress.weeklyProgress}/{userProgress.weeklyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (userProgress.weeklyProgress / userProgress.weeklyGoal) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {userProgress.weeklyGoal - userProgress.weeklyProgress} problems
              left this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coding;
