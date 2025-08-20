import { useState } from "react";

const ResumeATS = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  // Helper to safely read a factor from multiFactor. The backend sometimes nests
  // factors under `multiFactor.factors` and sometimes directly under `multiFactor`.
  const getFactor = (key) => {
    if (!analysis || !analysis.multiFactor) return undefined;
    return analysis.multiFactor.factors?.[key] ?? analysis.multiFactor?.[key];
  };

  const updateStep = (message, status = "pending") => {
    setSteps((prev) => [...prev, { message, status }]);
  };

  const markLastStepComplete = () => {
    setSteps((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].status = "done";
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError("⚠️ Please upload resume and enter job description");
      console.warn(
        "Form submission blocked: Missing resume or job description"
      );
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setSteps([]);

      updateStep("Uploading resume and job description...");

      console.log("Submitting resume and job description for analysis...");
      const res = await fetch("http://localhost:5000/api/ats/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      markLastStepComplete();
      updateStep("Running keyword analysis...");
      await new Promise((r) => setTimeout(r, 800)); // simulate time

      markLastStepComplete();
      updateStep("Checking grammar and readability...");
      await new Promise((r) => setTimeout(r, 800)); // simulate time

      markLastStepComplete();
      updateStep("Generating Gemini AI insights...");
      await new Promise((r) => setTimeout(r, 800)); // simulate time

      markLastStepComplete();
      setAnalysis(data);

      console.log("Analysis response received:", data);
    } catch (err) {
      setError("❌ Failed to analyze resume. Try again later.");
      console.error("Error during resume analysis:", err);
    } finally {
      setLoading(false);
      console.log("Analysis request completed.");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-300";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-300";
    if (score >= 40) return "text-orange-600 dark:text-orange-300";
    return "text-red-600 dark:text-red-300";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80)
      return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700";
    if (score >= 60)
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700";
    if (score >= 40)
      return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700";
    return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700";
  };

  const ScoreCard = ({ title, score, icon, children, className = "" }) => (
    <div
      className={`p-6 rounded-xl border-2 ${getScoreBgColor(
        score
      )} ${className} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>
      {children}
    </div>
  );

  // Enhanced Step Loader Component
  const StepLoader = () => (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* dark mode wrapper */}
        {/* note: we keep the gradient header bright, and the content area adapts to dark */}
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Analysis in Progress
            </h3>
            <div className="text-white/80 text-sm font-medium">
              {steps.filter((s) => s.status === "done").length} / {steps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-1000 ease-out rounded-full"
              style={{
                width: `${
                  (steps.filter((s) => s.status === "done").length /
                    steps.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 dark:bg-slate-800 dark:border-t dark:border-slate-700">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 group relative">
                {/* Step Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step.status === "done"
                      ? "bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:shadow-none"
                      : "bg-blue-100 text-blue-600 shadow-lg shadow-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:shadow-none"
                  }`}
                >
                  {step.status === "done" ? (
                    <svg
                      className="w-5 h-5 animate-in zoom-in duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium transition-all duration-300 ${
                      step.status === "done"
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-blue-600 dark:text-blue-300"
                    }`}
                  >
                    {step.message}
                  </div>

                  {/* Step Status */}
                  <div
                    className={`text-sm mt-1 transition-all duration-300 ${
                      step.status === "done"
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.status === "done" ? "Completed" : "Processing..."}
                  </div>
                </div>

                {/* Connection Line */}
                {idx < steps.length - 1 && (
                  <div className="absolute left-11 mt-10 w-0.5 h-6 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          {/* Fun Loading Message */}
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg dark:bg-gradient-to-r dark:from-slate-700/30 dark:to-slate-700/10">
            <div className="text-gray-600 text-sm dark:text-gray-300">
              ⚡ Our AI is working hard to optimize your resume...
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Resume ATS Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-gray-300">
            Optimize your resume for Applicant Tracking Systems with AI-powered
            analysis and actionable insights
          </p>
        </div>

        {/* Enhanced Upload Form */}
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-300 dark:bg-slate-800/70 dark:border-slate-700"
          >
            <div className="space-y-8">
              {/* Resume Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  Upload Resume
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-purple-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-purple-100 group-hover:border-blue-300 dark:bg-transparent dark:border-slate-700 dark:text-gray-100"
                  />
                  {resumeFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {resumeFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Job Description
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Paste the complete job description here for accurate ATS analysis..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 min-h-[140px] resize-none placeholder-gray-400 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700 dark:placeholder-gray-400"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {jobDescription.length} characters
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !resumeFile || !jobDescription.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing Resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    <span>Analyze Resume</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 shadow-lg dark:bg-red-900/20 dark:border-red-600">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-400 dark:text-red-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Step Loader */}
        {loading && steps.length > 0 && <StepLoader />}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Overall Score - Enhanced */}
            <div className="text-center">
              <div className="relative inline-block">
                <div
                  className={`flex items-center justify-center w-40 h-40 rounded-full ${getScoreBgColor(
                    analysis.overallScore ?? 0
                  )} border-4 shadow-2xl relative overflow-hidden`}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="text-center relative z-10">
                    <div
                      className={`text-5xl font-bold ${getScoreColor(
                        analysis.overallScore ?? 0
                      )} drop-shadow-sm`}
                    >
                      {analysis.multiFactor?.overallScore ?? 0}%
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      Overall Score
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Keywords Analysis - Large Card */}
              <div className="lg:col-span-2">
                {(() => {
                  const k = getFactor("keywords");
                  return (
                    <ScoreCard
                      title="Keyword Analysis"
                      score={k?.score ?? 0}
                      icon="🔍"
                      className="h-full"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800/60 dark:text-gray-100">
                          <div className="text-3xl font-bold text-emerald-600">
                            {k?.matched?.length ?? 0}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Matched
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800/60 dark:text-gray-100">
                          <div className="text-3xl font-bold text-red-600 dark:text-red-300">
                            {k?.missing?.length ?? 0}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Missing
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800/60 dark:text-gray-100">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                            {k?.total ?? 0}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Total
                          </div>
                        </div>
                      </div>
                      {k?.missing && k.missing.length > 0 && (
                        <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm dark:bg-slate-800/60">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                              ></path>
                            </svg>
                            Missing Keywords:
                          </div>
                          <div className="text-sm text-gray-600 max-h-24 overflow-y-auto bg-gray-50 rounded p-2">
                            {k.missing.slice(0, 10).join(", ")}
                            {k.missing.length > 10 && "..."}
                          </div>
                        </div>
                      )}
                    </ScoreCard>
                  );
                })()}
              </div>

              {/* Grammar Score */}
              {(() => {
                const grammar = getFactor("grammar");
                return (
                  <ScoreCard
                    title="Grammar"
                    score={grammar?.score ?? 0}
                    icon="📝"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-100">
                          {grammar?.totalIssues ?? 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Total Issues
                        </div>
                      </div>
                      {grammar?.issues && (
                        <div className="space-y-2 text-xs">
                          {Object.entries(grammar.issues).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center bg-white/50 rounded px-3 py-2"
                              >
                                <span className="capitalize text-gray-600 font-medium">
                                  {key}:
                                </span>
                                <span className="font-bold text-gray-800">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </ScoreCard>
                );
              })()}

              {/* Structure Score */}
              {(() => {
                const structure = getFactor("structure");
                return (
                  <ScoreCard
                    title="Structure"
                    score={structure?.score ?? 0}
                    icon="🏗️"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-100">
                          {structure?.bulletRatio ?? 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Bullet Ratio
                        </div>
                      </div>
                      {structure?.sections && (
                        <div className="space-y-2 text-xs">
                          {Object.entries(structure.sections).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center bg-white/50 rounded px-3 py-2 dark:bg-slate-800/50"
                              >
                                <span className="capitalize text-gray-600 dark:text-gray-300 font-medium">
                                  {key}:
                                </span>
                                <span
                                  className={`font-bold ${
                                    value
                                      ? "text-emerald-600 dark:text-emerald-300"
                                      : "text-red-600 dark:text-red-300"
                                  }`}
                                >
                                  {value ? "✓" : "✗"}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </ScoreCard>
                );
              })()}

              {/* Semantic Score */}
              {(() => {
                const semantic = getFactor("semantic");
                return (
                  <ScoreCard
                    title="Semantic Match"
                    score={semantic?.score ?? 0}
                    icon="🎯"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Cosine Similarity
                        </div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-300">
                          {semantic?.cosine
                            ? (semantic.cosine * 100).toFixed(1) + "%"
                            : "N/A"}
                        </div>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Jaccard Index
                        </div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-300">
                          {semantic?.jac
                            ? (semantic.jac * 100).toFixed(1) + "%"
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </ScoreCard>
                );
              })()}

              {/* Recency Score */}
              {(() => {
                const recency = getFactor("recency");
                return (
                  <ScoreCard
                    title="Recency"
                    score={recency?.score ?? 0}
                    icon="📅"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-xl font-bold text-gray-700 dark:text-gray-100">
                          {recency?.mostRecentYear ?? "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Most Recent Year
                        </div>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-xl font-bold text-gray-700 dark:text-gray-100">
                          {recency?.yearsSinceRecent ?? "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Years Since
                        </div>
                      </div>
                    </div>
                  </ScoreCard>
                );
              })()}

              {/* Action Impact Score */}
              {(() => {
                const actionImpact = getFactor("actionImpact");
                return (
                  <ScoreCard
                    title="Action Impact"
                    score={actionImpact?.score ?? 0}
                    icon="⚡"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-xl font-bold text-gray-700 dark:text-gray-100">
                          {actionImpact?.actionVerbRatio ?? 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Action Verb Ratio
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/50 rounded p-3 text-center dark:bg-slate-800/50">
                          <div className="font-bold text-lg dark:text-gray-100">
                            {actionImpact?.bulletsTotal ?? 0}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            Total Bullets
                          </div>
                        </div>
                        <div className="bg-white/50 rounded p-3 text-center dark:bg-slate-800/50">
                          <div className="font-bold text-lg dark:text-gray-100">
                            {actionImpact?.bulletsWithNumbers ?? 0}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            With Numbers
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScoreCard>
                );
              })()}

              {/* Parseability Score */}
              {(() => {
                const parseability = getFactor("parseability");
                return (
                  <ScoreCard
                    title="Parseability"
                    score={parseability?.score ?? 0}
                    icon="🔄"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm dark:bg-slate-800/60">
                        <div className="text-xl font-bold text-gray-700 dark:text-gray-100">
                          {analysis.resumeChars ?? parseability?.chars ?? "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Characters
                        </div>
                      </div>
                      {parseability?.note && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-slate-800/50 rounded p-3">
                          {parseability.note}
                        </div>
                      )}
                    </div>
                  </ScoreCard>
                );
              })()}
            </div>

            {/* Gemini AI Insights - Full Width */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  Gemini AI Insights
                </h3>
              </div>
              <div className="p-6">
                {analysis.geminiAnalysis?.fitScore !== undefined ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 dark:from-emerald-900/20 dark:to-slate-700/10">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">
                            {analysis.geminiAnalysis.fitScore}%
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 font-medium">
                            Job Fit Score
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 rounded-lg p-4 dark:bg-emerald-900/20">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
                          <span>💪</span> Strengths
                        </h4>
                        <ul className="space-y-1 text-sm text-emerald-700 dark:text-emerald-200">
                          {analysis.geminiAnalysis.strengths?.map(
                            (strength, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500 dark:text-emerald-300 mt-1">
                                  •
                                </span>
                                {strength}
                              </li>
                            )
                          ) || <li>No specific strengths identified</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 rounded-lg p-4 dark:bg-red-900/20">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                          <span>⚠️</span> Areas for Improvement
                        </h4>
                        <ul className="space-y-1 text-sm text-red-700 dark:text-red-200">
                          {analysis.geminiAnalysis.weaknesses?.map(
                            (weakness, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-500 dark:text-red-300 mt-1">
                                  •
                                </span>
                                {weakness}
                              </li>
                            )
                          ) || <li>No specific weaknesses identified</li>}
                        </ul>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/10">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                          <span>💡</span> Suggestions
                        </h4>
                        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-200">
                          {analysis.geminiAnalysis.suggestions?.map(
                            (suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 dark:text-blue-300 mt-1">
                                  •
                                </span>
                                {suggestion}
                              </li>
                            )
                          ) || <li>No specific suggestions available</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🤖</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Gemini Analysis Unavailable
                    </h4>
                    <div className="max-w-2xl mx-auto text-gray-600 space-y-2">
                      <p>
                        The AI analysis couldn't be completed. This might be due
                        to:
                      </p>
                      <div className="bg-yellow-50 rounded-lg p-4 text-left">
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            API quota exceeded or rate limiting
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            Missing or misconfigured API key
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            Temporary service issues
                          </li>
                        </ul>
                      </div>
                    </div>
                    {analysis.geminiAnalysis?.error && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                        <strong>Error:</strong> {analysis.geminiAnalysis.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {analysis.message && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                  <span className="text-emerald-600">✅</span>
                  <span className="text-emerald-800 font-medium">
                    {analysis.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeATS;
