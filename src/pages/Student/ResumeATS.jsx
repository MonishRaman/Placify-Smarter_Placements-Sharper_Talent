import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Zap, Target, BarChart3, Moon, Sun } from 'lucide-react';

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

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border dark:border-gray-700 p-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                ATS Resume Checker
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Optimize your resume for Applicant Tracking Systems and increase your chances of landing your dream job. 
                Get instant feedback on formatting, keywords, and ATS compatibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-3">Upload Your Resume</h2>
              <p className="text-blue-100 text-lg">Get detailed analysis and recommendations to make your resume ATS-friendly</p>
            </div>
            
            <div className="p-8 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Analyzing your resume...</p>
                  </div>
                </div>
              )}

              <div
                className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Drag and drop your resume here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    or click to browse and select your file
                  </p>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Choose File
                  </button>
                  
                  <div className="flex justify-center gap-4 mt-6">
                    {['PDF', 'DOCX', 'TXT'].map(format => (
                      <span key={format} className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-semibold shadow-md">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={onFileChange}
                className="hidden"
              />

              {error && (
                <div className="mt-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-2xl p-4 text-red-700 dark:text-red-300 text-center animate-shake">
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
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border dark:border-gray-700 overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex flex-col md:flex-row items-center justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Analysis Results</h3>
                  <p className="text-blue-100">{results.file_name}</p>
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-r ${getScoreColor(results.ats_score)} shadow-lg mt-4 md:mt-0`}>
                  {results.ats_score}%
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">Issues Found</h4>
                </div>
                
                {results.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Great! No major issues found with your resume.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.issues.map((issue, index) => (
                      <div key={index} className="flex items-start p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{issue}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{results.word_count}</p>
                    <p className="text-gray-600 dark:text-gray-400">Words</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{results.sections_found}</p>
                    <p className="text-gray-600 dark:text-gray-400">Sections Found</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                    <p className={`text-2xl font-bold ${getScoreTextColor(results.ats_score)}`}>{results.ats_score}%</p>
                    <p className="text-gray-600 dark:text-gray-400">ATS Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Why Use Our ATS Checker?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our advanced algorithm analyzes your resume against industry standards and ATS requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "ATS Compatibility",
                description: "Ensure your resume can be read and parsed correctly by Applicant Tracking Systems used by employers worldwide."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Keyword Analysis", 
                description: "Identify missing keywords and optimize your resume content to match job descriptions and industry standards."
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Instant Scoring",
                description: "Get immediate feedback with a comprehensive score and detailed recommendations for improvement."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ATSResumeChecker;