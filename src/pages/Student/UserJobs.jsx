import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Search,
} from "lucide-react";

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

  // Filtering logic
  const filteredJobs = dummyJobs.filter((job) => {
    // Search filter (title or company, case-insensitive)
    const searchMatch =
      filters.search.trim() === "" ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());

    // Location filter
    const locationMatch =
      filters.location === "" || job.location === filters.location;

    // Experience filter
    const experienceMatch =
      filters.experience === "" || job.experience === filters.experience;

    // Type filter
    const typeMatch = filters.type === "" || job.type === filters.type;

    return searchMatch && locationMatch && experienceMatch && typeMatch;
  });

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen overflow-x-hidden">
      {/* Enhanced Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white/80 to-fuchsia-100/60 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-gray-900/80" />
        {/* Animated blobs */}
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-400/20 dark:bg-blue-700/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-fuchsia-400/20 dark:bg-fuchsia-700/30 rounded-full blur-3xl animate-pulse-slower" />
        {/* Subtle grid dots */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-gray-900 dark:text-gray-100" />
        {/* Extra floating shapes */}
        <div className="absolute top-1/4 left-0 w-40 h-40 bg-purple-400/10 dark:bg-purple-700/20 rounded-full blur-2xl rotate-12 animate-float" />
        <div className="absolute bottom-1/3 right-0 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-700/20 rounded-full blur-2xl -rotate-12 animate-float-reverse" />
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
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ▾
              </span>
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
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ▾
              </span>
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
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ▾
              </span>
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
              className="group relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{ minHeight: 340 }}
            >
              {/* Company Banner */}
              <div className="flex items-center gap-4 px-6 pt-6 pb-2 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 rounded-xl border-2 border-white dark:border-gray-700 object-contain bg-white dark:bg-gray-900 shadow-md p-2 transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {job.title}
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200 border border-blue-200/60 dark:border-blue-600/50">
                      {job.type}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                    {job.company}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-4 mb-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{job.posted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 dark:text-rose-400">💸</span>
                    <span className="font-semibold">{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200 border border-blue-200/60 dark:border-blue-600/50 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors cursor-pointer"
                      title={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98] transition-transform duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 group-hover:scale-105"
                  tabIndex={0}
                  aria-label={`Apply for ${job.title} at ${job.company}`}
                >
                  <span className="inline-flex items-center gap-2">
                    Apply Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
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
