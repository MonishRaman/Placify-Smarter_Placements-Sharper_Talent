import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, TrendingUp, Users, DollarSign, Award, ChevronDown, RefreshCw, BarChart3, Activity, TrendingUp as LineIcon, X } from 'lucide-react';

const DepartmentPerformanceDashboard = () => {
  const [selectedYears, setSelectedYears] = useState(['2023-24']);
  const [selectedDepartments, setSelectedDepartments] = useState(['All']);
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // College data
  const collegeData = {
    name: "JNTUH College of Engineering",
    totalStudents: 1250,
    placedStudents: 890,
    placementRate: 71.2,
    averagePackage: 12.5,
    topPackage: 45
  };

  const departmentColors = {
    CSE: "#3b82f6",
    CSM: "#f97316", 
    ECE: "#6b7280",
    EEE: "#eab308",
    IT: "#06b6d4"
  };

  const colors = [departmentColors.CSE, departmentColors.CSM, departmentColors.ECE, departmentColors.EEE, departmentColors.IT];

  // Updated department data based on provided information
  const mockData = {
    '2020-21': [
      { department: 'CSE', placed: 168, total: 200, percentage: 84, avgPackage: 12.5, highestPackage: 45.0 },
      { department: 'CSM', placed: 135, total: 160, percentage: 84.4, avgPackage: 11.8, highestPackage: 32.0 },
      { department: 'ECE', placed: 142, total: 180, percentage: 78.9, avgPackage: 9.2, highestPackage: 25.0 },
      { department: 'EEE', placed: 48, total: 70, percentage: 68.6, avgPackage: 8.5, highestPackage: 18.0 },
      { department: 'IT', placed: 35, total: 50, percentage: 70.0, avgPackage: 10.2, highestPackage: 22.0 }
    ],
    '2021-22': [
      { department: 'CSE', placed: 172, total: 205, percentage: 83.9, avgPackage: 13.2, highestPackage: 42.0 },
      { department: 'CSM', placed: 138, total: 165, percentage: 83.6, avgPackage: 12.5, highestPackage: 35.0 },
      { department: 'ECE', placed: 145, total: 185, percentage: 78.4, avgPackage: 9.8, highestPackage: 28.0 },
      { department: 'EEE', placed: 52, total: 75, percentage: 69.3, avgPackage: 8.8, highestPackage: 20.0 },
      { department: 'IT', placed: 38, total: 52, percentage: 73.1, avgPackage: 10.8, highestPackage: 24.0 }
    ],
    '2022-23': [
      { department: 'CSE', placed: 175, total: 208, percentage: 84.1, avgPackage: 14.1, highestPackage: 48.0 },
      { department: 'CSM', placed: 142, total: 168, percentage: 84.5, avgPackage: 13.2, highestPackage: 38.0 },
      { department: 'ECE', placed: 148, total: 188, percentage: 78.7, avgPackage: 10.5, highestPackage: 30.0 },
      { department: 'EEE', placed: 55, total: 78, percentage: 70.5, avgPackage: 9.2, highestPackage: 22.0 },
      { department: 'IT', placed: 42, total: 55, percentage: 76.4, avgPackage: 11.5, highestPackage: 26.0 }
    ],
    '2023-24': [
      { department: 'CSE', placed: 178, total: 210, percentage: 84.8, avgPackage: 15.2, highestPackage: 52.0 },
      { department: 'CSM', placed: 145, total: 170, percentage: 85.3, avgPackage: 14.0, highestPackage: 40.0 },
      { department: 'ECE', placed: 152, total: 190, percentage: 80.0, avgPackage: 11.2, highestPackage: 32.0 },
      { department: 'EEE', placed: 58, total: 80, percentage: 72.5, avgPackage: 9.8, highestPackage: 24.0 },
      { department: 'IT', placed: 45, total: 58, percentage: 77.6, avgPackage: 12.2, highestPackage: 28.0 }
    ]
  };

  const yearOptions = ['2020-21', '2021-22', '2022-23', '2023-24'];
  const allDepartments = ['All', 'CSE', 'CSM', 'ECE', 'EEE', 'IT'];

  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const toggleDepartment = (dept) => {
    if (dept === 'All') {
      setSelectedDepartments(['All']);
      setComparisonMode(false);
    } else {
      const filtered = selectedDepartments.filter(d => d !== 'All');
      if (filtered.includes(dept)) {
        const newSelection = filtered.filter(d => d !== dept);
        setSelectedDepartments(newSelection.length === 0 ? ['All'] : newSelection);
        setComparisonMode(newSelection.length > 1);
      } else {
        const newSelection = [...filtered, dept];
        setSelectedDepartments(newSelection);
        setComparisonMode(newSelection.length > 1);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYears, selectedDepartments]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowYearDropdown(false);
        setShowDeptDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let combinedData = [];
    
    selectedYears.forEach(year => {
      const yearData = mockData[year] || [];
      yearData.forEach(dept => {
        if (selectedDepartments.includes('All') || selectedDepartments.includes(dept.department)) {
          combinedData.push({
            ...dept,
            year: year,
            id: `${dept.department}-${year}`
          });
        }
      });
    });
    
    setData(combinedData);
    setIsLoading(false);
  };

  const getChartData = () => {
    if (selectedYears.length === 1) {
      return data.filter(item => item.year === selectedYears[0]);
    }
    
    // For multiple years, group by department
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.department]) {
        grouped[item.department] = { department: item.department };
      }
      grouped[item.department][`${item.year}_percentage`] = item.percentage;
      grouped[item.department][`${item.year}_avgPackage`] = item.avgPackage;
      grouped[item.department][`${item.year}_placed`] = item.placed;
    });
    
    return Object.values(grouped);
  };

  const getPieData = () => {
    if (selectedYears.length === 0) return [];
    const currentYearData = data.filter(item => item.year === selectedYears[0]);
    return currentYearData.map((item, index) => ({
      name: item.department,
      value: item.placed,
      percentage: item.percentage,
      total: item.total,
      avgPackage: item.avgPackage,
      fill: departmentColors[item.department] || colors[index % colors.length]
    }));
  };

  const renderChart = () => {
    const chartData = getChartData();
    
    if (chartType === 'pie') {
      const pieData = getPieData();
      if (pieData.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <Activity className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pie Chart Data</h3>
            <p className="text-center">Please select a single year to view the pie chart distribution.</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({name, percentage}) => `${name}: ${percentage.toFixed(1)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={departmentColors[entry.name] || colors[index % colors.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} students`,
                  `${props.payload.name} Department`
                ]}
                labelFormatter={() => ''}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload.percentage.toFixed(1)}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Pie Chart Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {pieData.map((dept, index) => (
              <div 
                key={dept.name}
                className="bg-gray-50 rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                style={{ borderLeftColor: departmentColors[dept.name] || colors[index % colors.length] }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: departmentColors[dept.name] || colors[index % colors.length] }}
                  ></div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Placed:</span>
                    <span className="font-medium text-gray-900">{dept.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium text-gray-900">{dept.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium text-gray-900">{dept.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Pkg:</span>
                    <span className="font-medium text-gray-900">₹{dept.avgPackage} LPA</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (chartType === 'line') {
      if (comparisonMode && selectedDepartments.length > 1) {
        // Department comparison across years
        const comparisonData = yearOptions.map(year => {
          const yearItem = { year };
          selectedDepartments.forEach(dept => {
            if (dept !== 'All') {
              const deptData = data.find(item => item.year === year && item.department === dept);
              yearItem[`${dept}_percentage`] = deptData ? deptData.percentage : 0;
              yearItem[`${dept}_avgPackage`] = deptData ? deptData.avgPackage : 0;
            }
          });
          return yearItem;
        });
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Placement Percentage Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedDepartments.filter(d => d !== 'All').map((dept, index) => (
                    <Line
                      key={`${dept}_percentage`}
                      type="monotone"
                      dataKey={`${dept}_percentage`}
                      stroke={departmentColors[dept] || colors[index % colors.length]}
                      strokeWidth={3}
                      name={`${dept} Placement %`}
                      dot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Average Package Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value} LPA`, 'Avg Package']} />
                  <Legend />
                  {selectedDepartments.filter(d => d !== 'All').map((dept, index) => (
                    <Line
                      key={`${dept}_avgPackage`}
                      type="monotone"
                      dataKey={`${dept}_avgPackage`}
                      stroke={departmentColors[dept] || colors[index % colors.length]}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name={`${dept} Avg Package`}
                      dot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      } else if (selectedYears.length > 1) {
        // Multi-year trend for departments
        const yearTrendData = yearOptions
          .filter(year => selectedYears.includes(year))
          .map(year => {
            const yearItem = { year };
            const yearData = data.filter(item => item.year === year);
            
            // Calculate averages for this year
            if (selectedDepartments.includes('All')) {
              // Show all departments
              yearData.forEach(dept => {
                yearItem[`${dept.department}_percentage`] = dept.percentage;
                yearItem[`${dept.department}_avgPackage`] = dept.avgPackage;
              });
            } else {
              // Show only selected departments
              selectedDepartments.forEach(deptName => {
                const deptData = yearData.find(item => item.department === deptName);
                if (deptData) {
                  yearItem[`${deptName}_percentage`] = deptData.percentage;
                  yearItem[`${deptName}_avgPackage`] = deptData.avgPackage;
                }
              });
            }
            
            return yearItem;
          });

        const departmentsToShow = selectedDepartments.includes('All') 
          ? ['CSE', 'CSM', 'ECE', 'EEE', 'IT']
          : selectedDepartments.filter(d => d !== 'All');

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Multi-Year Placement Percentage Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {departmentsToShow.map((dept, index) => (
                    <Line
                      key={`${dept}_percentage`}
                      type="monotone"
                      dataKey={`${dept}_percentage`}
                      stroke={departmentColors[dept] || colors[index % colors.length]}
                      strokeWidth={3}
                      name={`${dept} Placement %`}
                      dot={{ r: 5, fill: departmentColors[dept] || colors[index % colors.length] }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Multi-Year Average Package Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value} LPA`, 'Avg Package']} />
                  <Legend />
                  {departmentsToShow.map((dept, index) => (
                    <Line
                      key={`${dept}_avgPackage`}
                      type="monotone"
                      dataKey={`${dept}_avgPackage`}
                      stroke={departmentColors[dept] || colors[index % colors.length]}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name={`${dept} Avg Package`}
                      dot={{ r: 5, fill: departmentColors[dept] || colors[index % colors.length] }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      } else if (selectedYears.length === 1 && selectedDepartments.includes('All')) {
        // Single year, all departments - show trend across departments
        const singleYearData = data.filter(item => item.year === selectedYears[0]);
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={singleYearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name.includes('Package')) {
                    return [`₹${value} LPA`, name];
                  }
                  return [value + (name.includes('Percentage') ? '%' : ''), name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Placement %"
                dot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgPackage"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Avg Package (LPA)"
                dot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      } else if (selectedYears.length === 1 && !selectedDepartments.includes('All')) {
        // Single year, specific departments - show comparison
        const singleYearData = data.filter(item => item.year === selectedYears[0]);
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={singleYearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name.includes('Package')) {
                    return [`₹${value} LPA`, name];
                  }
                  return [value + (name.includes('Percentage') ? '%' : ''), name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Placement %"
                dot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgPackage"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Avg Package (LPA)"
                dot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    }
    
    // Bar chart logic
    if (comparisonMode && selectedDepartments.length > 1) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Department Comparison - Placement Statistics</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="percentage" fill="#3b82f6" name="Placement %" />
                <Bar yAxisId="right" dataKey="avgPackage" fill="#10b981" name="Avg Package (LPA)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Students Placed</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  {chartData.map((item, index) => (
                    <Bar 
                      key={index}
                      dataKey="placed" 
                      fill={departmentColors[item.department] || colors[index % colors.length]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Highest Package</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value} LPA`, 'Highest Package']} />
                  {chartData.map((item, index) => (
                    <Bar 
                      key={index}
                      dataKey="highestPackage" 
                      fill={departmentColors[item.department] || colors[index % colors.length]}
                      opacity={0.8}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedYears.length === 1 ? (
            <>
              <Bar dataKey="percentage" fill="#3b82f6" name="Placement %" />
              <Bar dataKey="avgPackage" fill="#10b981" name="Avg Package (LPA)" />
            </>
          ) : (
            selectedYears.map((year, index) => (
              <Bar
                key={year}
                dataKey={`${year}_percentage`}
                fill={colors[index % colors.length]}
                name={`${year} Placement %`}
              />
            ))
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const getStatsCards = () => {
    if (data.length === 0) return [];
    
    const totalPlaced = data.reduce((sum, item) => sum + item.placed, 0);
    const totalStudents = data.reduce((sum, item) => sum + item.total, 0);
    const avgPlacementRate = totalStudents > 0 ? ((totalPlaced / totalStudents) * 100).toFixed(1) : 0;
    const avgPackage = (data.reduce((sum, item) => sum + item.avgPackage, 0) / data.length).toFixed(1);
    const highestPackage = Math.max(...data.map(item => item.highestPackage));
    
    return [
      { title: 'Total Placed', value: totalPlaced, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { title: 'Avg Placement Rate', value: `${avgPlacementRate}%`, icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'Avg Package', value: `₹${avgPackage} LPA`, icon: DollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      { title: 'Highest Package', value: `₹${highestPackage} LPA`, icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading department performance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{collegeData.name} - Department Performance</h1>
          <p className="text-gray-600">
            Analyze and compare department-wise placement statistics across academic years
            <span className="ml-4 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Overall Rate: {collegeData.placementRate}% • Top Package: ₹{collegeData.topPackage} LPA
            </span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {getStatsCards().map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl shadow-sm p-6 border border-opacity-20`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} border border-opacity-30`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-6 items-center">
            {/* Academic Year Filter */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Academic Year:</span>
              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowDeptDropdown(false);
                  }}
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 min-w-48 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedYears.length === 0 ? 'Select Years' : 
                     selectedYears.length === 1 ? selectedYears[0] : 
                     `${selectedYears.length} years selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                
                {showYearDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-1 max-h-48 overflow-y-auto">
                      {yearOptions.map(year => (
                        <label key={year} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={() => toggleYear(year)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{year}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Departments:</span>
              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setShowDeptDropdown(!showDeptDropdown);
                    setShowYearDropdown(false);
                  }}
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 min-w-52 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedDepartments.includes('All') ? 'All Departments' : 
                     selectedDepartments.length === 1 ? selectedDepartments[0] : 
                     `${selectedDepartments.length} departments selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                
                {showDeptDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {allDepartments.map(dept => (
                        <label key={dept} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.includes(dept)}
                            onChange={() => toggleDepartment(dept)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex items-center">
                            {dept !== 'All' && (
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{backgroundColor: departmentColors[dept] || '#gray'}}
                              ></div>
                            )}
                            <span className="text-sm text-gray-700">{dept}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Mode Toggle */}
            {selectedDepartments.length > 1 && !selectedDepartments.includes('All') && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="comparisonMode"
                  checked={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="comparisonMode" className="text-sm font-medium text-gray-700">
                  Comparison Mode
                </label>
              </div>
            )}

            {/* Chart Type */}
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Chart Type:</span>
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setChartType('bar')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Bar</span>
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${chartType === 'line' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  title="Show line chart"
                >
                  <LineIcon className="h-4 w-4" />
                  <span>Line</span>
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${chartType === 'pie' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'} ${selectedYears.length > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedYears.length > 1}
                  title={selectedYears.length > 1 ? 'Pie chart only available for single year view' : 'Show pie chart'}
                >
                  <Activity className="h-4 w-4" />
                  <span>Pie</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Selected Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedYears.map(year => (
              <span key={year} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {year}
                <button
                  onClick={() => toggleYear(year)}
                  className="ml-1 h-3 w-3 rounded-full text-blue-600 hover:bg-blue-200"
                  disabled={selectedYears.length === 1}
                >
                  ×
                </button>
              </span>
            ))}
            {selectedDepartments.filter(d => d !== 'All').map(dept => (
              <span key={dept} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{backgroundColor: departmentColors[dept]}}
                ></div>
                {dept}
                <button
                  onClick={() => toggleDepartment(dept)}
                  className="ml-1 h-3 w-3 rounded-full text-green-600 hover:bg-green-200"
                >
                  ×
                </button>
              </span>
            ))}
            {comparisonMode && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                📊 Comparison View
              </span>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {chartType === 'pie' ? 'Placement Distribution' : 
               comparisonMode ? 'Department Performance Comparison' :
               chartType === 'line' ? 'Placement Trends Analysis' : 
               'Department Performance Overview'}
            </h2>
            {comparisonMode && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>📊 Comparing {selectedDepartments.filter(d => d !== 'All').length} departments</span>
              </div>
            )}
          </div>
          {data.length > 0 ? renderChart() : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <BarChart3 className="h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p className="text-center">Please select different filters to view department performance data.</p>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Performance Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Package</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.placed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        item.percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.avgPackage} LPA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.highestPackage} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <style>{`
            /* Hide scrollbars */
            select::-webkit-scrollbar {
              display: none;
            }
            select {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
            .overflow-x-auto {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            /* Custom dropdown styles */
            .max-h-48::-webkit-scrollbar,
            .max-h-60::-webkit-scrollbar {
              width: 6px;
            }
            .max-h-48::-webkit-scrollbar-track,
            .max-h-60::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 3px;
            }
            .max-h-48::-webkit-scrollbar-thumb,
            .max-h-60::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            .max-h-48::-webkit-scrollbar-thumb:hover,
            .max-h-60::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPerformanceDashboard;