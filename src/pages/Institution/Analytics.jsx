import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Building2, DollarSign, Calendar, Download, Filter, BarChart3, PieChart as PieChartIcon, TrendingUp as LineChartIcon } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [rawAnalyticsData, setRawAnalyticsData] = useState({});
  const [filteredData, setFilteredData] = useState({});

  // Mock data with multiple years - Replace with actual API calls
  useEffect(() => {
    const mockData = {
      allData: {
        2020: {
          overview: { totalEligible: 800, totalPlaced: 650, companiesVisited: 32, highestPackage: 12.0, averagePackage: 5.1, ongoingDrives: 0 },
          departmentWise: [
            { department: 'Computer Science', placed: 180, eligible: 220, percentage: 81.8, color: '#3B82F6' },
            { department: 'Mechanical', placed: 130, eligible: 180, percentage: 72.2, color: '#10B981' },
            { department: 'Electrical', placed: 120, eligible: 170, percentage: 70.6, color: '#F59E0B' },
            { department: 'Civil', placed: 110, eligible: 150, percentage: 73.3, color: '#EF4444' },
            { department: 'Electronics', placed: 110, eligible: 180, percentage: 61.1, color: '#8B5CF6' }
          ],
          companyWise: [
            { company: 'TCS', students: 95, avgPackage: 3.8 },
            { company: 'Infosys', students: 78, avgPackage: 4.0 },
            { company: 'Wipro', students: 67, avgPackage: 3.9 },
            { company: 'Accenture', students: 56, avgPackage: 4.8 },
            { company: 'Cognizant', students: 45, avgPackage: 4.2 }
          ]
        },
        2021: {
          overview: { totalEligible: 900, totalPlaced: 720, companiesVisited: 38, highestPackage: 15.0, averagePackage: 5.5, ongoingDrives: 0 },
          departmentWise: [
            { department: 'Computer Science', placed: 205, eligible: 260, percentage: 78.8, color: '#3B82F6' },
            { department: 'Mechanical', placed: 145, eligible: 200, percentage: 72.5, color: '#10B981' },
            { department: 'Electrical', placed: 135, eligible: 190, percentage: 71.1, color: '#F59E0B' },
            { department: 'Civil', placed: 125, eligible: 170, percentage: 73.5, color: '#EF4444' },
            { department: 'Electronics', placed: 110, eligible: 180, percentage: 61.1, color: '#8B5CF6' }
          ],
          companyWise: [
            { company: 'TCS', students: 108, avgPackage: 4.0 },
            { company: 'Infosys', students: 85, avgPackage: 4.2 },
            { company: 'Wipro', students: 75, avgPackage: 4.0 },
            { company: 'Accenture', students: 65, avgPackage: 5.0 },
            { company: 'Cognizant', students: 55, avgPackage: 4.5 }
          ]
        },
        2022: {
          overview: { totalEligible: 1000, totalPlaced: 810, companiesVisited: 42, highestPackage: 16.5, averagePackage: 5.8, ongoingDrives: 0 },
          departmentWise: [
            { department: 'Computer Science', placed: 225, eligible: 280, percentage: 80.4, color: '#3B82F6' },
            { department: 'Mechanical', placed: 165, eligible: 220, percentage: 75.0, color: '#10B981' },
            { department: 'Electrical', placed: 150, eligible: 200, percentage: 75.0, color: '#F59E0B' },
            { department: 'Civil', placed: 135, eligible: 180, percentage: 75.0, color: '#EF4444' },
            { department: 'Electronics', placed: 135, eligible: 220, percentage: 61.4, color: '#8B5CF6' }
          ],
          companyWise: [
            { company: 'TCS', students: 115, avgPackage: 4.1 },
            { company: 'Infosys', students: 92, avgPackage: 4.4 },
            { company: 'Wipro', students: 82, avgPackage: 4.0 },
            { company: 'Accenture', students: 68, avgPackage: 5.1 },
            { company: 'Cognizant', students: 58, avgPackage: 4.6 }
          ]
        },
        2023: {
          overview: { totalEligible: 1100, totalPlaced: 845, companiesVisited: 43, highestPackage: 17.2, averagePackage: 6.0, ongoingDrives: 0 },
          departmentWise: [
            { department: 'Computer Science', placed: 230, eligible: 300, percentage: 76.7, color: '#3B82F6' },
            { department: 'Mechanical', placed: 170, eligible: 240, percentage: 70.8, color: '#10B981' },
            { department: 'Electrical', placed: 155, eligible: 220, percentage: 70.5, color: '#F59E0B' },
            { department: 'Civil', placed: 138, eligible: 190, percentage: 72.6, color: '#EF4444' },
            { department: 'Electronics', placed: 152, eligible: 250, percentage: 60.8, color: '#8B5CF6' }
          ],
          companyWise: [
            { company: 'TCS', students: 120, avgPackage: 4.1 },
            { company: 'Infosys', students: 95, avgPackage: 4.4 },
            { company: 'Wipro', students: 85, avgPackage: 4.0 },
            { company: 'Accenture', students: 72, avgPackage: 5.1 },
            { company: 'Cognizant', students: 62, avgPackage: 4.7 }
          ]
        },
        2024: {
          overview: { totalEligible: 1250, totalPlaced: 892, companiesVisited: 45, highestPackage: 18.5, averagePackage: 6.2, ongoingDrives: 8 },
          departmentWise: [
            { department: 'Computer Science', placed: 245, eligible: 320, percentage: 76.6, color: '#3B82F6' },
            { department: 'Mechanical', placed: 180, eligible: 250, percentage: 72, color: '#10B981' },
            { department: 'Electrical', placed: 165, eligible: 230, percentage: 71.7, color: '#F59E0B' },
            { department: 'Civil', placed: 142, eligible: 200, percentage: 71, color: '#EF4444' },
            { department: 'Electronics', placed: 160, eligible: 250, percentage: 64, color: '#8B5CF6' }
          ],
          companyWise: [
            { company: 'TCS', students: 125, avgPackage: 4.2 },
            { company: 'Infosys', students: 98, avgPackage: 4.5 },
            { company: 'Wipro', students: 87, avgPackage: 4.1 },
            { company: 'Accenture', students: 76, avgPackage: 5.2 },
            { company: 'Cognizant', students: 65, avgPackage: 4.8 },
            { company: 'HCL', students: 54, avgPackage: 4.3 },
            { company: 'IBM', students: 42, avgPackage: 6.8 },
            { company: 'Microsoft', students: 28, avgPackage: 12.5 }
          ]
        }
      },
      placementTrends: [
        { year: '2020', placed: 650, eligible: 800, percentage: 81.25 },
        { year: '2021', placed: 720, eligible: 900, percentage: 80 },
        { year: '2022', placed: 810, eligible: 1000, percentage: 81 },
        { year: '2023', placed: 845, eligible: 1100, percentage: 76.8 },
        { year: '2024', placed: 892, eligible: 1250, percentage: 71.4 }
      ],
      placementStatus: [
        { status: 'Placed', count: 892, color: '#10B981' },
        { status: 'In Pipeline', count: 156, color: '#F59E0B' },
        { status: 'Not Placed', count: 202, color: '#EF4444' }
      ],
      packageDistribution: [
        { range: '0-3 LPA', count: 245 },
        { range: '3-6 LPA', count: 389 },
        { range: '6-9 LPA', count: 156 },
        { range: '9-12 LPA', count: 78 },
        { range: '12+ LPA', count: 24 }
      ]
    };

    setTimeout(() => {
      setRawAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected filters
  useEffect(() => {
    if (!rawAnalyticsData.allData) return;

    const applyFilters = () => {
      let filtered = {};

      if (selectedYear === 'all') {
        // Aggregate data from all years
        const allYears = Object.keys(rawAnalyticsData.allData);
        filtered.overview = {
          totalEligible: allYears.reduce((sum, year) => sum + rawAnalyticsData.allData[year].overview.totalEligible, 0),
          totalPlaced: allYears.reduce((sum, year) => sum + rawAnalyticsData.allData[year].overview.totalPlaced, 0),
          companiesVisited: Math.max(...allYears.map(year => rawAnalyticsData.allData[year].overview.companiesVisited)),
          highestPackage: Math.max(...allYears.map(year => rawAnalyticsData.allData[year].overview.highestPackage)),
          averagePackage: (allYears.reduce((sum, year) => sum + rawAnalyticsData.allData[year].overview.averagePackage, 0) / allYears.length).toFixed(1),
          ongoingDrives: rawAnalyticsData.allData['2024'].overview.ongoingDrives
        };

        // Aggregate department-wise data
        const deptMap = {};
        allYears.forEach(year => {
          rawAnalyticsData.allData[year].departmentWise.forEach(dept => {
            if (!deptMap[dept.department]) {
              deptMap[dept.department] = { placed: 0, eligible: 0, color: dept.color };
            }
            deptMap[dept.department].placed += dept.placed;
            deptMap[dept.department].eligible += dept.eligible;
          });
        });

        filtered.departmentWise = Object.keys(deptMap).map(dept => ({
          department: dept,
          placed: deptMap[dept].placed,
          eligible: deptMap[dept].eligible,
          percentage: ((deptMap[dept].placed / deptMap[dept].eligible) * 100).toFixed(1),
          color: deptMap[dept].color
        }));

        // Aggregate company-wise data
        const companyMap = {};
        allYears.forEach(year => {
          rawAnalyticsData.allData[year].companyWise.forEach(company => {
            if (!companyMap[company.company]) {
              companyMap[company.company] = { students: 0, totalPackage: 0, count: 0 };
            }
            companyMap[company.company].students += company.students;
            companyMap[company.company].totalPackage += company.avgPackage * company.students;
            companyMap[company.company].count += company.students;
          });
        });

        filtered.companyWise = Object.keys(companyMap).map(company => ({
          company: company,
          students: companyMap[company].students,
          avgPackage: (companyMap[company].totalPackage / companyMap[company].count).toFixed(1)
        })).sort((a, b) => b.students - a.students);

      } else {
        // Use data from selected year
        const yearData = rawAnalyticsData.allData[selectedYear];
        if (!yearData) return;

        filtered = {
          overview: yearData.overview,
          departmentWise: yearData.departmentWise,
          companyWise: yearData.companyWise
        };
      }

      // Apply department filter
      if (selectedDepartment !== 'all') {
        filtered.departmentWise = filtered.departmentWise.filter(dept => 
          dept.department === selectedDepartment
        );
        
        // Adjust overview based on department filter
        const deptData = filtered.departmentWise[0];
        if (deptData) {
          filtered.overview = {
            ...filtered.overview,
            totalEligible: deptData.eligible,
            totalPlaced: deptData.placed
          };
        }
      }

      // Apply company filter
      if (selectedCompany !== 'all') {
        filtered.companyWise = filtered.companyWise.filter(company => 
          company.company === selectedCompany
        );
      }

      // Update placement status based on filtered overview
      if (filtered.overview) {
        const totalPlaced = filtered.overview.totalPlaced;
        const totalEligible = filtered.overview.totalEligible;
        const inPipeline = Math.floor(totalEligible * 0.125); // Assume 12.5% in pipeline
        const notPlaced = totalEligible - totalPlaced - inPipeline;

        filtered.placementStatus = [
          { status: 'Placed', count: totalPlaced, color: '#10B981' },
          { status: 'In Pipeline', count: inPipeline, color: '#F59E0B' },
          { status: 'Not Placed', count: Math.max(0, notPlaced), color: '#EF4444' }
        ];
      }

      // Use original trends and package distribution (or filter as needed)
      filtered.placementTrends = rawAnalyticsData.placementTrends;
      filtered.packageDistribution = rawAnalyticsData.packageDistribution;

      return filtered;
    };

    setFilteredData(applyFilters());
  }, [rawAnalyticsData, selectedYear, selectedDepartment, selectedCompany]);

  const exportData = (format) => {
    if (format === 'csv' && filteredData.departmentWise) {
      const csvData = [
        ['Department', 'Eligible', 'Placed', 'Percentage'],
        ...filteredData.departmentWise.map(dept => [
          dept.department,
          dept.eligible,
          dept.placed,
          dept.percentage + '%'
        ])
      ];
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_data_${selectedYear}_${selectedDepartment}_${selectedCompany}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const StatCard = ({ title, value, icon: Icon, suffix = '', color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (!filteredData.overview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No data available for the selected filters.</p>
          <button 
            onClick={() => {
              setSelectedYear('2024');
              setSelectedDepartment('all');
              setSelectedCompany('all');
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  const { overview, departmentWise, companyWise, placementStatus, packageDistribution, placementTrends } = filteredData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            
            <p className="text-gray-600">
              Comprehensive placement analytics and insights
              {selectedYear !== 'all' && ` for ${selectedYear}`}
              {selectedDepartment !== 'all' && ` - ${selectedDepartment} Department`}
              {selectedCompany !== 'all' && ` - ${selectedCompany}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="all">All Years</option>
            </select>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Civil">Civil</option>
              <option value="Electronics">Electronics</option>
            </select>
            
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="TCS">TCS</option>
              <option value="Infosys">Infosys</option>
              <option value="Wipro">Wipro</option>
              <option value="Accenture">Accenture</option>
              <option value="Cognizant">Cognizant</option>
              <option value="HCL">HCL</option>
              <option value="IBM">IBM</option>
              <option value="Microsoft">Microsoft</option>
            </select>
            
            <button
              onClick={() => {
                setSelectedYear('2024');
                setSelectedDepartment('all');
                setSelectedCompany('all');
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Students Eligible"
            value={overview.totalEligible}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Students Placed"
            value={overview.totalPlaced}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Companies Visited"
            value={overview.companiesVisited}
            icon={Building2}
            color="purple"
          />
          <StatCard
            title="Highest Package"
            value={overview.highestPackage}
            suffix=" LPA"
            icon={DollarSign}
            color="yellow"
          />
          <StatCard
            title="Average Package"
            value={overview.averagePackage}
            suffix=" LPA"
            icon={DollarSign}
            color="indigo"
          />
          <StatCard
            title="Ongoing Drives"
            value={overview.ongoingDrives}
            icon={Calendar}
            color="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placement Trends */}
          {selectedYear === 'all' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <LineChartIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Placement Trends</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={placementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placed" stroke="#3B82F6" strokeWidth={3} name="Students Placed" />
                  <Line type="monotone" dataKey="eligible" stroke="#10B981" strokeWidth={2} name="Students Eligible" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Department-wise Performance */}
          {departmentWise && departmentWise.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Department-wise Performance</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentWise}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placed" fill="#3B82F6" name="Placed" />
                  <Bar dataKey="eligible" fill="#10B981" name="Eligible" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Company-wise Statistics */}
          {companyWise && companyWise.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Building2 className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Top Companies by Hiring</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyWise.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="company" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8B5CF6" name="Students Hired" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Placement Status */}
          {placementStatus && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <PieChartIcon className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Placement Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={placementStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {placementStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Package Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Package Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={packageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Performance Table */}
          {departmentWise && departmentWise.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Department</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Eligible</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Placed</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentWise.map((dept, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-sm text-gray-900">{dept.department}</td>
                        <td className="text-right py-2 text-sm text-gray-900">{dept.placed}</td>
                        <td className="text-right py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            dept.percentage > 75 ? 'bg-green-100 text-green-800' :
                            dept.percentage > 65 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dept.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Overall Performance</h4>
              <p className="text-sm text-blue-700">
                {((overview.totalPlaced / overview.totalEligible) * 100).toFixed(1)}% placement rate with {overview.totalPlaced.toLocaleString()} students placed out of {overview.totalEligible.toLocaleString()} eligible students.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Top Performer</h4>
              <p className="text-sm text-green-700">
                {departmentWise && departmentWise.length > 0 
                  ? `${departmentWise[0].department} leads with ${departmentWise[0].percentage}% placement rate and ${departmentWise[0].placed} students placed.`
                  : 'Department performance data not available for current filters.'
                }
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Growth Opportunity</h4>
              <p className="text-sm text-purple-700">
                {placementStatus && placementStatus[1] 
                  ? `${placementStatus[1].count} students are currently in the interview pipeline across various companies.`
                  : `Focus on improving placement rates through targeted training programs.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Analytics;
