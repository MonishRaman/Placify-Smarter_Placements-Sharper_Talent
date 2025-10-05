import React, { useState } from "react";
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  Settings,
  X,
  Check,
  Loader2,
  Image,
} from "lucide-react";

const ExportModal = ({ isOpen, onClose, onExport, isExporting = false }) => {
  const [exportConfig, setExportConfig] = useState({
    format: "pdf",
    sections: {
      summary: true,
      charts: true,
      metrics: true,
      rawData: false,
    },
    companyName: "Company",
    includeCharts: {
      trends: true,
      skills: true,
      colleges: true,
      categories: true,
      activity: true,
      successRate: true,
      quickStats: true,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleSectionToggle = (section) => {
    setExportConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }));
  };

  const handleChartToggle = (chart) => {
    setExportConfig((prev) => ({
      ...prev,
      includeCharts: {
        ...prev.includeCharts,
        [chart]: !prev.includeCharts[chart],
      },
    }));
  };

  const handleExport = () => {
    onExport(exportConfig);
  };

  const chartOptions = [
    { id: "trends", label: "Interview & Placement Trends", icon: BarChart3 },
    { id: "skills", label: "Skills Distribution", icon: PieChart },
    { id: "colleges", label: "College Performance", icon: BarChart3 },
    { id: "categories", label: "Performance Categories", icon: BarChart3 },
    { id: "activity", label: "Weekly Activity", icon: BarChart3 },
    { id: "successRate", label: "Success Rate Trend", icon: BarChart3 },
    { id: "quickStats", label: "Quick Statistics", icon: FileText },
  ];

  const sectionOptions = [
    {
      id: "summary",
      label: "Executive Summary",
      description: "Overview and key insights",
      icon: FileText,
    },
    {
      id: "charts",
      label: "Visual Charts",
      description: "All selected charts and graphs",
      icon: BarChart3,
    },
    {
      id: "metrics",
      label: "Key Metrics",
      description: "Summary of performance indicators",
      icon: Settings,
    },
    {
      id: "rawData",
      label: "Raw Data Tables",
      description: "Detailed data in tabular format",
      icon: FileText,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="h-6 w-6" />
              <h2 className="text-xl font-bold">Export Insights Report</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              disabled={isExporting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep >= step
                      ? "bg-white text-purple-600"
                      : "bg-white bg-opacity-30 text-white"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-colors ${
                      currentStep > step ? "bg-white" : "bg-white bg-opacity-30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Configuration
                </h3>

                {/* Company Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={exportConfig.companyName}
                    onChange={(e) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Export Format */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setExportConfig((prev) => ({ ...prev, format: "pdf" }))
                      }
                      className={`p-3 border-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        exportConfig.format === "pdf"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">PDF Report</span>
                    </button>
                    <button
                      onClick={() =>
                        setExportConfig((prev) => ({
                          ...prev,
                          format: "images",
                        }))
                      }
                      className={`p-3 border-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        exportConfig.format === "images"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Image className="h-5 w-5" />
                      <span className="font-medium">Chart Images</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Sections Selection */}
          {currentStep === 2 && exportConfig.format === "pdf" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Report Sections
                </h3>
                <div className="space-y-3">
                  {sectionOptions.map((section) => (
                    <div
                      key={section.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        exportConfig.sections[section.id]
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                      onClick={() => handleSectionToggle(section.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            exportConfig.sections[section.id]
                              ? "bg-purple-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <section.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {section.label}
                            </h4>
                            {exportConfig.sections[section.id] && (
                              <Check className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Chart Selection */}
          {((currentStep === 3 &&
            exportConfig.format === "pdf" &&
            exportConfig.sections.charts) ||
            (currentStep === 2 && exportConfig.format === "images")) && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {exportConfig.format === "pdf"
                    ? "Select Charts to Include"
                    : "Select Charts to Export"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chartOptions.map((chart) => (
                    <div
                      key={chart.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        exportConfig.includeCharts[chart.id]
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                      onClick={() => handleChartToggle(chart.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <chart.icon
                          className={`h-5 w-5 ${
                            exportConfig.includeCharts[chart.id]
                              ? "text-purple-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="flex-1 font-medium text-gray-900 dark:text-white">
                          {chart.label}
                        </span>
                        {exportConfig.includeCharts[chart.id] && (
                          <Check className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={isExporting}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors disabled:opacity-50"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Next/Export button */}
            {(exportConfig.format === "pdf" && currentStep < 3) ||
            (exportConfig.format === "pdf" &&
              currentStep === 3 &&
              !exportConfig.sections.charts) ||
            (exportConfig.format === "images" && currentStep < 2) ? (
              <button
                onClick={() => {
                  if (
                    exportConfig.format === "pdf" &&
                    exportConfig.sections.charts
                  ) {
                    setCurrentStep(3);
                  } else if (exportConfig.format === "pdf") {
                    setCurrentStep(2);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                disabled={isExporting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>
                      Export {exportConfig.format === "pdf" ? "PDF" : "Images"}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
