import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

// ✅ Static Job Data
const dummyJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Spark",
    logo: "https://logo.clearbit.com/github.com",
    location: "Remote",
    type: "Full-time",
    experience: "0-1 years",
    posted: "2 days ago",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    salary: "₹6 - ₹8 LPA",
  },
  {
    id: 2,
    title: "React Developer Intern",
    company: "CodeWave",
    logo: "https://logo.clearbit.com/vercel.com",
    location: "Bangalore",
    type: "Internship",
    experience: "Fresher",
    posted: "4 days ago",
    skills: ["React", "HTML", "CSS"],
    salary: "₹15K/month",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHive",
    logo: "https://logo.clearbit.com/figma.com",
    location: "Delhi",
    type: "Freelance",
    experience: "1-2 years",
    posted: "1 week ago",
    skills: ["Figma", "Adobe XD", "UX"],
    salary: "₹20K/project",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "TechCorp",
    logo: "https://logo.clearbit.com/docker.com",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    posted: "3 days ago",
    skills: ["Node.js", "MongoDB", "API"],
    salary: "₹10 - ₹12 LPA",
  },
  {
    id: 5,
    title: "AI Research Intern",
    company: "FutureTech",
    logo: "https://logo.clearbit.com/openai.com",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    posted: "Today",
    skills: ["Python", "TensorFlow", "AI"],
    salary: "₹25K/month",
  },
];

const UserJobs = () => {
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    type: "",
    search: "",
  });

  // ➕ Just keep showing dummyJobs always
  const filteredJobs = dummyJobs;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
        🚀 Recommended Jobs For You
      </h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <input
          type="text"
          placeholder="Search title or company"
          name="search"
          value={filters.search}
          onChange={handleChange}
          className="px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Delhi">Delhi</option>
        </select>
        <select
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          className="px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Experience Levels</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1 years">0-1 years</option>
          <option value="1-2 years">1-2 years</option>
          <option value="2+ years">2+ years</option>
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* 💼 Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 hover:border-blue-400 p-5"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-md border"
              />
              <div>
                <h2 className="text-xl font-semibold text-blue-700">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {job.type}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> {job.posted}
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> Experience:{" "}
                {job.experience}
              </div>
              <div className="flex items-center gap-2">
                💸 Salary: {job.salary}
              </div>
            </div>

            {/* Skills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button className="mt-5 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md hover:opacity-90 transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserJobs;