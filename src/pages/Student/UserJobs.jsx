import React, { useState } from "react";
import { Briefcase, MapPin, CalendarDays, BadgeCheck, Search } from "lucide-react";

const dummyJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Spark", logo: "https://logo.clearbit.com/github.com", location: "Remote", type: "Full-time", experience: "0-1 years", posted: "2 days ago", skills: ["React", "JavaScript", "Tailwind CSS"], salary: "₹6 - ₹8 LPA" },
  { id: 2, title: "React Developer Intern", company: "CodeWave", logo: "https://logo.clearbit.com/vercel.com", location: "Bangalore", type: "Internship", experience: "Fresher", posted: "4 days ago", skills: ["React", "HTML", "CSS"], salary: "₹15K/month" },
  { id: 3, title: "UI/UX Designer", company: "DesignHive", logo: "https://logo.clearbit.com/figma.com", location: "Delhi", type: "Freelance", experience: "1-2 years", posted: "1 week ago", skills: ["Figma", "Adobe XD", "UX"], salary: "₹20K/project" },
  { id: 4, title: "Backend Developer", company: "TechCorp", logo: "https://logo.clearbit.com/docker.com", location: "Remote", type: "Full-time", experience: "2+ years", posted: "3 days ago", skills: ["Node.js", "MongoDB", "API"], salary: "₹10 - ₹12 LPA" },
  { id: 5, title: "AI Research Intern", company: "FutureTech", logo: "https://logo.clearbit.com/openai.com", location: "Remote", type: "Internship", experience: "Fresher", posted: "Today", skills: ["Python", "TensorFlow", "AI"], salary: "₹25K/month" },
];

const UserJobs = () => {
  const [filters, setFilters] = useState({ location: "", experience: "", type: "", search: "" });
  const filteredJobs = dummyJobs; 
  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/20" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px] text-gray-900 dark:text-gray-100" />
      </div>

      {/* Heading */}
      <header className="px-4 sm:px-6 pt-10 sm:pt-14">
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Recommended Jobs For You
          </span>
          <span className="ml-2">🚀</span>
        </h1>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
          Curated roles matching your skills and preferences
        </p>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 mt-8 px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/50 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4">
            <div className="col-span-1 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search title or company"
                name="search"
                value={filters.search}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 dark:focus:ring-blue-500/40"
              />
            </div>

            <div className="relative">
              <select
                name="location"
                value={filters.location}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 dark:focus:ring-blue-500/40 appearance-none"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">▾</span>
            </div>

            <div className="relative">
              <select
                name="experience"
                value={filters.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 dark:focus:ring-blue-500/40 appearance-none"
              >
                <option value="">All Experience Levels</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2+ years">2+ years</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">▾</span>
            </div>

            <div className="relative">
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 dark:focus:ring-blue-500/40 appearance-none"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <main className="px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="group relative rounded-2xl border border-gray-200/70 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-14 h-14 rounded-lg border border-gray-200/70 dark:border-gray-700/50 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {job.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
                  </div>
                </div>

                <div className="text-gray-700 dark:text-gray-300 space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{job.posted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Experience: {job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 dark:text-rose-400">💸</span>
                    <span className="font-medium">{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200 border border-blue-200/60 dark:border-blue-600/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] transition-transform duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  Apply Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserJobs;
