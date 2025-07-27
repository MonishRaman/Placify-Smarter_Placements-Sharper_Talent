import React from 'react';
import { PlusCircle, Users } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Remote",
    postedDate: "2025-07-20",
  },
  {
    id: 2,
    title: "Backend Engineer",
    location: "Bangalore",
    postedDate: "2025-07-15",
  },
];

const CompanyDashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Company Dashboard</h1>
      <p className="text-gray-600">Welcome to the Company Dashboard!</p>

      {/* Post Job Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        <PlusCircle className="w-5 h-5" />
        Post New Job
      </button>

      {/* Posted Jobs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Posted Jobs</h2>
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-xl p-4 flex justify-between items-center shadow-sm bg-white"
          >
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-sm text-gray-400">
                Posted on: {job.postedDate}
              </p>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
              <Users className="w-4 h-4" />
              View Applicants
            </button>
          </div>
        ))}
      </div>

      {/* Interview Schedules Placeholder */}
      <div className="mt-8 p-6 border-dashed border-2 border-gray-300 rounded-xl text-center text-gray-500">
        <p className="text-lg font-medium">📅 Interview Schedules Coming Soon...</p>
        <p className="text-sm">This section will show upcoming interviews and their status.</p>
      </div>
    </div>
  );
};

export default CompanyDashboard;
