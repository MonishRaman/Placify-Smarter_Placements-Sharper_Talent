import React, { useState } from "react";

// Sample static employee data (replace with backend fetch later)
const sampleEmployees = [
  {
    id: 1,
    name: "Amit Sharma",
    jobTitle: "Software Engineer",
    department: "Engineering",
    email: "amit.sharma@example.com",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Priya Singh",
    jobTitle: "Product Manager",
    department: "Product",
    email: "priya.singh@example.com",
    status: "Remote",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Rahul Verma",
    jobTitle: "Intern",
    department: "Marketing",
    email: "rahul.verma@example.com",
    status: "Intern",
    avatar: "",
  },
  {
    id: 4,
    name: "Sneha Patel",
    jobTitle: "HR Executive",
    department: "HR",
    email: "sneha.patel@example.com",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

// Status badge color mapping
const statusColors = {
  Active: "bg-green-100 text-green-800",
  Remote: "bg-blue-100 text-blue-800",
  Intern: "bg-yellow-100 text-yellow-800",
};

const Performance = () => {
  // State for search/filter
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  // Filter employees by search and department
  const filteredEmployees = sampleEmployees.filter((emp) => {
    const matchesName = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department ? emp.department === department : true;
    return matchesName && matchesDept;
  });

  // Unique departments for filter dropdown
  const departments = [
    ...new Set(sampleEmployees.map((emp) => emp.department)),
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Employee Directory</h2>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-48 focus:outline-none"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border rounded px-3 py-2 w-40 focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {/* Placeholder for future sort/pagination */}
        <button
          className="border rounded px-3 py-2 text-gray-500 cursor-not-allowed"
          disabled
        >
          Sort by Performance
        </button>
        <button
          className="border rounded px-3 py-2 text-gray-500 cursor-not-allowed"
          disabled
        >
          Pagination (Coming Soon)
        </button>
      </div>

      {/* Employee Grid/Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Profile</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Job Title</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {emp.avatar ? (
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{emp.name}</td>
                  <td className="py-2 px-4">{emp.jobTitle}</td>
                  <td className="py-2 px-4">{emp.department}</td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {emp.email}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[emp.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Future backend integration: Replace sampleEmployees with API data */}
      {/* Example: useEffect(() => { fetchEmployees() }, []) */}
    </div>
  );
};

export default Performance;
