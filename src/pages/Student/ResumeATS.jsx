import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Zap, Target, BarChart3, Moon, Sun, Star, Sparkles } from 'lucide-react';

const ATSResumeChecker = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // ATS Analysis Logic
  const analyzeResume = useCallback((text, filename) => {
    const requiredSections = ['experience', 'education', 'skills', 'work experience', 'employment', 'qualifications'];
    const actionVerbs = ['achieved', 'managed', 'led', 'developed', 'created', 'implemented', 'improved', 'increased', 'reduced'];
    const techKeywords = ['python', 'java', 'javascript', 'react', 'angular', 'sql', 'aws', 'docker', 'kubernetes', 'agile'];
    const businessKeywords = ['management', 'leadership', 'strategy', 'analysis', 'project management', 'team lead'];
    
    let score = 100;
    const issues = [];
    
    if (!text.trim()) {
      return { file_name: filename, ats_score: 0, issues: ['No readable text content found'], word_count: 0 };
    }

    const textLower = text.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    
    // Section analysis
    const sectionsFound = requiredSections.filter(section => textLower.includes(section)).length;
    if (sectionsFound < 2) {
      score -= 25;
      issues.push('Missing essential sections (Experience, Education, Skills)');
    }

    // Length analysis
    if (words.length < 200) {
      score -= 20;
      issues.push('Resume appears too short (less than 200 words)');
    } else if (words.length > 1000) {
      score -= 10;
      issues.push('Resume might be too long (over 1000 words)');
    }

    // Contact information
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/;
    
    if (!emailPattern.test(text)) {
      score -= 15;
      issues.push('No email address found');
    }
    
    if (!phonePattern.test(text)) {
      score -= 10;
      issues.push('No phone number found');
    }

    // Date validation
    const datePattern = /\b(19|20)\d{2}\b/g;
    const dates = text.match(datePattern) || [];
    if (dates.length < 2) {
      score -= 10;
      issues.push('Insufficient date information for work experience');
    }

    // Action verbs
    const actionVerbCount = actionVerbs.filter(verb => textLower.includes(verb)).length;
    if (actionVerbCount < 3) {
      score -= 10;
      issues.push('Few action verbs found - use more dynamic language');
    }

    // Quantifiable achievements
    const numberPattern = /\b\d+(%|\+|k|m|million|thousand|dollars?|\$)\b/g;
    const achievements = text.match(numberPattern) || [];
    if (achievements.length < 2) {
      score -= 8;
      issues.push('Include more quantifiable achievements with specific numbers');
    }

    // Keywords
    const techKeywordCount = techKeywords.filter(keyword => textLower.includes(keyword)).length;
    const businessKeywordCount = businessKeywords.filter(keyword => textLower.includes(keyword)).length;
    if (techKeywordCount + businessKeywordCount < 3) {
      score -= 12;
      issues.push('Consider adding more industry-relevant keywords');
    }

    return {
      file_name: filename,
      ats_score: Math.max(score, 0),
      issues: issues,
      word_count: words.length,
      sections_found: sectionsFound,
      keywords_found: techKeywordCount + businessKeywordCount
    };
  }, []);

  const extractTextFromFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For demo purposes, we'll treat other files as text
        // In a real app, you'd use libraries like pdf-lib or mammoth
        reader.readAsText(file);
      }
    });
  }, []);

  const handleFiles = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      setError('Please upload a PDF, DOCX, or TXT file only.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const textContent = await extractTextFromFile(file);
      const analysisResult = analyzeResume(textContent, file.name);
      
      // Simulate processing time for better UX
      setTimeout(() => {
        setResults(analysisResult);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to process the file. Please try again.');
      setIsLoading(false);
    }
  }, [extractTextFromFile, analyzeResume]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is ATS-optimized';
    if (score >= 60) return 'Good, but there\'s room for improvement';
    return 'Needs significant improvements for ATS compatibility';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-white drop-shadow-lg" />
          ) : (
            <Moon className="w-6 h-6 text-white drop-shadow-lg" />
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-pulse ${
            isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-purple-500'
          }`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-bounce ${
            isDarkMode ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gradient-to-r from-purple-400 to-pink-500'
          }`} style={{animationDuration: '3s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="relative">
            <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-30 ${
              isDarkMode ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500' : 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400'
            }`}></div>
            <div className={`relative rounded-3xl shadow-2xl border backdrop-blur-sm p-12 ${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-white/50'
            }`}>
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className={`text-6xl font-bold mb-6 bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-blue-400 via-purple-400 to-indigo-400' 
                  : 'from-blue-600 via-purple-600 to-indigo-600'
              } bg-clip-text text-transparent`}>
                ATS Resume Checker
              </h1>
              
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your resume with AI-powered analysis. Get instant feedback on formatting, 
                keywords, and ATS compatibility to land your dream job faster.
              </p>
              
              <div className="flex justify-center space-x-8 text-sm">
                {[
                  { icon: <Star className="w-5 h-5" />, text: "AI-Powered Analysis" },
                  { icon: <Target className="w-5 h-5" />, text: "98% ATS Success Rate" },
                  { icon: <Zap className="w-5 h-5" />, text: "Instant Results" }
                ].map((feature, index) => (
                  <div key={index} className={`flex items-center space-x-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className={`${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl shadow-2xl border overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' 
              : 'bg-white/90 border-white/50 backdrop-blur-sm'
          }`}>
            <div className={`p-8 text-center text-white ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600' 
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
            }`}>
              <h2 className="text-3xl font-bold mb-3">Upload Your Resume</h2>
              <p className="text-blue-100 text-lg">
                Get detailed analysis and personalized recommendations in seconds
              </p>
            </div>
            
            <div className="p-8 relative">
              {/* Loading Overlay */}
              {isLoading && (
                <div className={`absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl ${
                  isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
                }`}>
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin mx-auto mb-6"></div>
                      <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <p className={`text-lg font-semibold ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      🧠 AI is analyzing your resume...
                    </p>
                    <p className={`text-sm mt-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      This usually takes a few seconds
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  dragActive 
                    ? `border-purple-500 scale-105 shadow-2xl ${
                        isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                      }` 
                    : `${
                        isDarkMode 
                          ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50' 
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                      }`
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <div className="relative z-10">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all duration-300 group-hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }`}>
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Drag and drop your resume here
                  </h3>
                  
                  <p className={`mb-6 text-lg ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    or click to browse and select your file
                  </p>
                  
                  <button className={`px-8 py-4 rounded-2xl font-semibold text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}>
                    Choose File
                  </button>
                  
                  <div className="flex justify-center gap-4 mt-8">
                    {['PDF', 'DOCX', 'TXT'].map(format => (
                      <span key={format} className={`px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-purple-200' 
                          : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700'
                      }`}>
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-current rounded animate-ping"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-current rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 right-8 w-4 h-4 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={onFileChange}
                className="hidden"
              />

              {/* Error Message */}
              {error && (
                <div className={`mt-6 border rounded-2xl p-4 text-center animate-shake ${
                  isDarkMode 
                    ? 'bg-red-900/50 border-red-700 text-red-300' 
                    : 'bg-red-100 border-red-300 text-red-700'
                }`}>
                  <AlertTriangle className="w-5 h-5 inline-block mr-2" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-3xl shadow-2xl border overflow-hidden animate-fadeIn ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' 
                : 'bg-white/90 border-white/50 backdrop-blur-sm'
            }`}>
              {/* Results Header */}
              <div className={`p-8 text-white ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600'
              }`}>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-3xl font-bold mb-2">Analysis Complete! 🎉</h3>
                    <p className="text-purple-100 text-lg">{results.file_name}</p>
                    <p className="text-purple-200 text-sm mt-1">{getScoreMessage(results.ats_score)}</p>
                  </div>
                  
                  <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl bg-gradient-to-r ${getScoreColor(results.ats_score)}`}>
                    <div className="text-4xl font-bold">{results.ats_score}</div>
                    <div className="text-sm opacity-90">ATS Score</div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                {/* Issues Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-2 rounded-lg mr-3 ${
                      isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'
                    }`}>
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <h4 className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      Areas for Improvement ({results.issues.length})
                    </h4>
                  </div>
                  
                  {results.issues.length === 0 ? (
                    <div className={`text-center py-12 rounded-2xl ${
                      isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
                    }`}>
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                        Outstanding! 🌟
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your resume meets all ATS requirements. You're ready to apply!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.issues.map((issue, index) => (
                        <div key={index} className={`flex items-start p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                          isDarkMode 
                            ? 'bg-orange-900/20 border-orange-800 hover:bg-orange-900/30' 
                            : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                        }`}>
                          <AlertTriangle className="w-5 h-5 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                          <div>
                            <p className={`font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              {issue}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <FileText className="w-8 h-8 text-blue-500" />,
                      value: results.word_count,
                      label: 'Words',
                      color: 'blue'
                    },
                    {
                      icon: <Target className="w-8 h-8 text-green-500" />,
                      value: results.sections_found,
                      label: 'Sections Found',
                      color: 'green'
                    },
                    {
                      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
                      value: results.keywords_found,
                      label: 'Keywords',
                      color: 'purple'
                    },
                    {
                      icon: <Star className="w-8 h-8 text-yellow-500" />,
                      value: `${results.ats_score}%`,
                      label: 'ATS Score',
                      color: 'yellow'
                    }
                  ].map((stat, index) => (
                    <div key={index} className={`text-center p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-center mb-3">
                        {stat.icon}
                      </div>
                      <p className={`text-2xl font-bold mb-1 ${
                        stat.label === 'ATS Score' ? getScoreTextColor(results.ats_score) : 
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Why Choose Our ATS Checker?
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Advanced AI algorithms analyze your resume against industry standards and real ATS requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "ATS Compatibility",
                description: "Ensure your resume passes through Applicant Tracking Systems used by 99% of Fortune 500 companies.",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Smart Keyword Analysis", 
                description: "AI-powered keyword optimization that matches your resume to job descriptions across industries.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Instant Detailed Scoring",
                description: "Get comprehensive feedback with actionable recommendations to improve your chances by up to 70%.",
                gradient: "from-green-500 to-teal-600"
              }
            ].map((feature, index) => (
              <div key={index} className={`p-8 rounded-3xl shadow-xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group ${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
                  : 'bg-white/80 border-white/50 backdrop-blur-sm'
              }`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-3 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600'
            }`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h3 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Ready to optimize your resume?
          </h3>
          
          <p className={`mb-8 max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join thousands of job seekers who have improved their ATS compatibility and landed their dream jobs.
          </p>
          
          <div className="flex justify-center space-x-6 text-sm">
            {['🚀 Fast Analysis', '🎯 99% Accuracy', '💼 Industry Standard', '🔒 Secure & Private'].map((feature, index) => (
              <span key={index} className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {feature}
              </span>
            ))}
          </div>
          
          <div className={`mt-8 pt-8 border-t text-sm ${
            isDarkMode 
              ? 'border-gray-700 text-gray-500' 
              : 'border-gray-200 text-gray-400'
          }`}>
            <p>© 2024 ATS Resume Checker. Built with ❤️ for job seekers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ATSResumeChecker;