import React, { useState } from "react";
import { institutionStats, departmentSummary } from "./data/mockData";
import { generatePDFReport, generateExcelReport } from "./utils/generateReport";
import { FileText, Download, Settings, BarChart3 } from "lucide-react";
const GenerateReports = () => {
  const [reportType, setReportType] = useState("Full");
  const [department, setDepartment] = useState("");
  const [comparison, setComparison] = useState([]);
  const [fromYear, setFromYear] = useState("2020");
  const [toYear, setToYear] = useState("2024");
  const [format, setFormat] = useState("PDF");

  const handleGenerate = () => {
    const filters = { fromYear, toYear, department, comparison };
    const payload = {
      departmentSummary,
      selectedDepartmentData: departmentSummary.find(d => d.dept === department),
      comparison: departmentSummary.filter(d => comparison.includes(d.dept))
    };

    if (format === "PDF") {
        logger.debug("Generating PDF report with filters:", filters);
      generatePDFReport(reportType, filters, payload);
    } else {
      generateExcelReport(reportType, filters, payload);
    }
  };

  const toggleComparison = (dept) => {
    setComparison(prev => 
      prev.includes(dept) 
        ? prev.filter(d => d !== dept) 
        : [...prev, dept]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Generate Reports</h1>
          </div>
          <p className="text-purple-100">
            Download comprehensive placement analytics and performance reports
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Report Configuration */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Report Configuration</h2>
              
              {/* Report Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <div className="space-y-2">
                  {[
                    { value: "Full", label: "Full Institution Report", icon: FileText },
                    { value: "Department", label: "Department Report", icon: Settings },
                    { value: "Comparison", label: "Department Comparison", icon: BarChart3 }
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value} className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-purple-50 hover:border-purple-300">
                      <input
                        type="radio"
                        name="reportType"
                        value={value}
                        checked={reportType === value}
                        onChange={(e) => setReportType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        reportType === value ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      }`}>
                        {reportType === value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <Icon className="w-5 h-5 text-gray-600 mr-3" />
                      <span className={`font-medium ${reportType === value ? 'text-purple-700' : 'text-gray-700'}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department Selector */}
              {reportType === "Department" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Select Department</label>
                  <select 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    value={department} 
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option value="">Choose a department...</option>
                    {departmentSummary.map(d => (
                      <option key={d.dept} value={d.dept}>{d.dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department Comparison */}
              {reportType === "Comparison" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Departments to Compare
                  </label>
                  <div className="space-y-2">
                    {departmentSummary.map(d => (
                      <label key={d.dept} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={comparison.includes(d.dept)}
                          onChange={() => toggleComparison(d.dept)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-3 text-gray-700">{d.dept}</span>
                        <span className="ml-auto text-sm text-gray-500">
                          {d.placed}/{d.students} placed
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Filters & Actions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters & Export</h2>
              
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">From Year</label>
                  <input 
                    type="number" 
                    value={fromYear} 
                    onChange={e => setFromYear(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    min="2010"
                    max="2030"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">To Year</label>
                  <input 
                    type="number" 
                    value={toYear} 
                    onChange={e => setToYear(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    min="2010"
                    max="2030"
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Export Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "PDF", label: "PDF Document", color: "red" },
                    { value: "Excel", label: "Excel Sheet", color: "green" }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setFormat(value)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        format === value
                          ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {value === "PDF" ? ".pdf" : ".xlsx"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-2">Report Preview</h3>
                <div className="text-sm text-purple-700 space-y-1">
                  <div>Type: <span className="font-medium">{reportType} Report</span></div>
                  <div>Period: <span className="font-medium">{fromYear} - {toYear}</span></div>
                  <div>Format: <span className="font-medium">{format}</span></div>
                  {reportType === "Department" && department && (
                    <div>Department: <span className="font-medium">{department}</span></div>
                  )}
                  {reportType === "Comparison" && comparison.length > 0 && (
                    <div>Comparing: <span className="font-medium">{comparison.length} departments</span></div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button 
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default GenerateReports;