import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Target,
  BookOpen,
  Filter,
  Search,
  Moon,
  Sun,
  Star,
  Zap,
  Brain,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  RotateCcw,
  Save,
  Settings,
  Download,
  Upload,
  HelpCircle,
  Lightbulb,
  Coffee,
  Flame
} from 'lucide-react';

const CodingPractice = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalSolved: 42,
    streak: 7,
    ranking: 'Gold',
    weeklyGoal: 10,
    weeklyProgress: 6
  });
  const [activeTab, setActiveTab] = useState('description');

  // Mock coding problems data
  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Array",
      acceptance: 49.2,
      likes: 12543,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      constraints: [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109"
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]" },
        { input: "[3,2,4], 6", expected: "[1,2]" },
        { input: "[3,3], 6", expected: "[0,1]" }
      ],
      hints: [
        "Try using a hash map to store the complement of each number.",
        "For each number, check if its complement exists in the hash map."
      ],
      solved: true,
      timeSpent: "12m",
      lastAttempt: "2 days ago"
    },
    {
      id: 2,
      title: "Reverse Linked List",
      difficulty: "Easy",
      category: "Linked List",
      acceptance: 72.1,
      likes: 8932,
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
          explanation: ""
        }
      ],
      constraints: [
        "The number of nodes in the list is the range [0, 5000].",
        "-5000 <= Node.val <= 5000"
      ],
      starterCode: {
        javascript: `function reverseList(head) {
    // Your code here
    
}`,
        python: `def reverse_list(head):
    # Your code here
    pass`,
        java: `public ListNode reverseList(ListNode head) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
        { input: "[1,2]", expected: "[2,1]" },
        { input: "[]", expected: "[]" }
      ],
      hints: [
        "Try iterating through the list and reversing the links.",
        "Keep track of the previous, current, and next nodes."
      ],
      solved: false,
      timeSpent: "0m",
      lastAttempt: "Never"
    },
    {
      id: 3,
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Stack",
      acceptance: 40.8,
      likes: 15234,
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
          explanation: ""
        },
        {
          input: 's = "()[]{}"',
          output: "true",
          explanation: ""
        },
        {
          input: 's = "(]"',
          output: "false",
          explanation: ""
        }
      ],
      constraints: [
        "1 <= s.length <= 104",
        "s consists of parentheses only '()[]{}'."
      ],
      starterCode: {
        javascript: `function isValid(s) {
    // Your code here
    
}`,
        python: `def is_valid(s):
    # Your code here
    pass`,
        java: `public boolean isValid(String s) {
    // Your code here
    
}`
      },
      testCases: [
        { input: '"()"', expected: "true" },
        { input: '"()[]{}"', expected: "true" },
        { input: '"(]"', expected: "false" }
      ],
      hints: [
        "Use a stack data structure.",
        "Push opening brackets onto the stack and pop when you see closing brackets."
      ],
      solved: true,
      timeSpent: "8m",
      lastAttempt: "1 week ago"
    },
    {
      id: 4,
      title: "Maximum Subarray",
      difficulty: "Medium",
      category: "Dynamic Programming",
      acceptance: 50.1,
      likes: 18765,
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "[4,-1,2,1] has the largest sum = 6."
        }
      ],
      constraints: [
        "1 <= nums.length <= 105",
        "-104 <= nums[i] <= 104"
      ],
      starterCode: {
        javascript: `function maxSubArray(nums) {
    // Your code here
    
}`,
        python: `def max_sub_array(nums):
    # Your code here
    pass`,
        java: `public int maxSubArray(int[] nums) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
        { input: "[1]", expected: "1" },
        { input: "[5,4,-1,7,8]", expected: "23" }
      ],
      hints: [
        "Try using Kadane's algorithm.",
        "Keep track of the maximum sum ending at the current position."
      ],
      solved: false,
      timeSpent: "25m",
      lastAttempt: "3 days ago"
    },
    {
      id: 5,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Easy",
      category: "Tree",
      acceptance: 74.5,
      likes: 9876,
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      examples: [
        {
          input: "root = [1,null,2,3]",
          output: "[1,3,2]",
          explanation: ""
        }
      ],
      constraints: [
        "The number of nodes in the tree is in the range [0, 100].",
        "-100 <= Node.val <= 100"
      ],
      starterCode: {
        javascript: `function inorderTraversal(root) {
    // Your code here
    
}`,
        python: `def inorder_traversal(root):
    # Your code here
    pass`,
        java: `public List<Integer> inorderTraversal(TreeNode root) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[1,null,2,3]", expected: "[1,3,2]" },
        { input: "[]", expected: "[]" },
        { input: "[1]", expected: "[1]" }
      ],
      hints: [
        "Try both recursive and iterative approaches.",
        "For iterative: use a stack to simulate the recursion."
      ],
      solved: true,
      timeSpent: "15m",
      lastAttempt: "5 days ago"
    },
    {
      id: 6,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      category: "Linked List",
      acceptance: 62.3,
      likes: 11234,
      description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
      examples: [
        {
          input: "list1 = [1,2,4], list2 = [1,3,4]",
          output: "[1,1,2,3,4,4]",
          explanation: ""
        }
      ],
      constraints: [
        "The number of nodes in both lists is in the range [0, 50].",
        "-100 <= Node.val <= 100"
      ],
      starterCode: {
        javascript: `function mergeTwoLists(list1, list2) {
    // Your code here
    
}`,
        python: `def merge_two_lists(list1, list2):
    # Your code here
    pass`,
        java: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[1,2,4], [1,3,4]", expected: "[1,1,2,3,4,4]" },
        { input: "[], []", expected: "[]" },
        { input: "[], [0]", expected: "[0]" }
      ],
      hints: [
        "Use a dummy node to simplify the logic.",
        "Compare the values and link the smaller node."
      ],
      solved: false,
      timeSpent: "18m",
      lastAttempt: "1 day ago"
    }
  ];

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' }
  ];

  const categories = ['All', 'Array', 'String', 'Linked List', 'Stack', 'Tree', 'Dynamic Programming', 'Graph'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Initialize with first problem
  useEffect(() => {
    if (problems.length > 0 && !selectedProblem) {
      const firstUnsolved = problems.find(p => !p.solved) || problems[0];
      setSelectedProblem(firstUnsolved);
      setCode(firstUnsolved.starterCode[selectedLanguage]);
    }
  }, [problems, selectedProblem, selectedLanguage]);

  // Update code when language or problem changes
  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[selectedLanguage] || '');
      setTestResults(null);
    }
  }, [selectedProblem, selectedLanguage]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchTerm, selectedDifficulty, selectedCategory]);

  // Run code simulation
  const runCode = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    // Simulate API call to run code
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock test results
    const passedTests = Math.floor(Math.random() * selectedProblem.testCases.length) + 1;
    const allPassed = passedTests === selectedProblem.testCases.length;
    
    setTestResults({
      success: allPassed,
      passed: passedTests,
      total: selectedProblem.testCases.length,
      runtime: `${Math.floor(Math.random() * 100)}ms`,
      memory: `${(Math.random() * 20 + 40).toFixed(1)}MB`,
      details: selectedProblem.testCases.map((testCase, index) => ({
        ...testCase,
        passed: index < passedTests,
        output: index < passedTests ? testCase.expected : "Wrong Answer"
      }))
    });
    
    setIsRunning(false);
  };

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
        {/* Left Sidebar - Problem List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Code Practice</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sharpen your skills</p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xs font-medium">{userProgress.ranking}</span>
                </div>
                <p className="text-lg font-bold">{userProgress.totalSolved}</p>
                <p className="text-xs opacity-90">Problems Solved</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-medium">Streak</span>
                </div>
                <p className="text-lg font-bold">{userProgress.streak}</p>
                <p className="text-xs opacity-90">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-sm"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-sm"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedProblem?.id === problem.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">{problem.title}</h3>
                  {problem.solved ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-1 rounded-full ${getDifficultyBg(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span>{problem.category}</span>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{problem.acceptance}% acceptance</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {problem.timeSpent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedProblem ? (
            <>
              {/* Problem Header */}
              <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBg(selectedProblem.difficulty)}`}>
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
                  {['description', 'solutions', 'discussions'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex">
                {/* Problem Content */}
                <div className="w-1/2 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
                  <div className="p-6">
                    {activeTab === 'description' && (
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedProblem.description}
                          </p>
                        </div>

                        {/* Examples */}
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Examples</h4>
                          {selectedProblem.examples.map((example, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <p className="font-medium mb-2">Example {index + 1}:</p>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Input:</span>
                                  <code className="ml-2 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                    {example.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium">Output:</span>
                                  <code className="ml-2 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                    {example.output}
                                  </code>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="font-medium">Explanation:</span>
                                    <span className="ml-2">{example.explanation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Constraints */}
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Constraints</h4>
                          <ul className="space-y-2">
                            {selectedProblem.constraints.map((constraint, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {constraint}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hints */}
                        <div>
                          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Hints
                          </h4>
                          <div className="space-y-2">
                            {selectedProblem.hints.map((hint, index) => (
                              <details key={index} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                                <summary className="cursor-pointer font-medium text-yellow-800 dark:text-yellow-400">
                                  Hint {index + 1}
                                </summary>
                                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                  {hint}
                                </p>
                              </details>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="w-1/2 flex flex-col">
                  {/* Editor Header */}
                  <div className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        >
                          {languages.map(lang => (
                            <option key={lang.id} value={lang.id}>
                              {lang.icon} {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCode(selectedProblem.starterCode[selectedLanguage])}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Reset Code"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 bg-gray-900">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none"
                      style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
                      placeholder="Write your code here..."
                    />
                  </div>

                  {/* Test Results */}
                  {testResults && (
                    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 max-h-60 overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {testResults.success ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                All Tests Passed!
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                {testResults.passed}/{testResults.total} Tests Passed
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Runtime: {testResults.runtime}</span>
                          <span>Memory: {testResults.memory}</span>
                        </div>
                      </div>

                      {/* Test Case Details */}
                      <div className="space-y-2">
                        {testResults.details.map((test, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              test.passed 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">Test Case {index + 1}</span>
                              {test.passed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div>
                                <span className="font-medium">Input:</span>
                                <code className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  {test.input}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium">Expected:</span>
                                <code className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  {test.expected}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium">Output:</span>
                                <code className={`ml-2 px-2 py-1 rounded ${
                                  test.passed 
                                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
                                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                                }`}>
                                  {test.output}
                                </code>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {testResults.success && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5" />
                              <span className="font-semibold">Congratulations!</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="w-4 h-4" />
                              <span>+50 XP</span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm opacity-90">
                            You've successfully solved this problem! Try the next challenge.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={runCode}
                          disabled={isRunning || !code.trim()}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isRunning ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Run Code
                            </>
                          )}
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors" title="Submit Solution">
                          <Upload className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors" title="Get Help">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready to Code?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select a problem from the sidebar to start practicing your coding skills.
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>{problems.filter(p => p.solved).length} Solved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{problems.length - problems.filter(p => p.solved).length} Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Modal/Tooltip */}
      <div className="fixed top-20 left-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 max-w-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Weekly Progress
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Goal: {userProgress.weeklyGoal} problems</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {userProgress.weeklyProgress}/{userProgress.weeklyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userProgress.weeklyGoal - userProgress.weeklyProgress} problems left this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;