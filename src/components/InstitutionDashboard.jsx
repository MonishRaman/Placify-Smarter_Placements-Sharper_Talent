import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Building2, Target, Award, UserCheck, 
  Calendar, Briefcase, GraduationCap, Clock
} from 'lucide-react';

const Dashboard = () => {
  const [data] = useState({
    institution: 'JNTUH College of Engineering',
    academicYear: '2023-2024',
    totalStudents: 1250,
    placedStudents: 890,
    placementRate: 71.2,
    averagePackage: 12.5,
    topPackage: 45,
    companiesVisited: 185,
    ongoingDrives: 12,
    upcomingInterviews: 45,
    totalOffers: 1120,
    multipleOffers: 230
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className={`bg-white dark:bg-gray-900 p-5 rounded-xl shadow-md border-l-4 border-${color}-500`}> 
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          {trend && <p className="text-xs text-green-500 mt-1">{trend}</p>}
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600">{data.institution}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Placement Dashboard for Academic Year {data.academicYear}
        </p>
        <div className="flex justify-center space-x-6 text-gray-500 dark:text-gray-400 text-xs mt-2">
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{currentTime.toLocaleTimeString()}</span>
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{currentTime.toLocaleDateString()}</span>
        </div>
      </header>

      <section className="flex justify-center gap-4 mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Schedule Drive
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Add Student
        </button>
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Company Portal
        </button>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} title="Total Students" value={data.totalStudents} subtitle="Eligible for placement" color="blue" />
        <StatCard icon={UserCheck} title="Students Placed" value={data.placedStudents} subtitle={`${data.placementRate}% placement rate`} trend="+12% from last year" color="green" />
        <StatCard icon={Target} title="Average Package" value={`₹${data.averagePackage}L`} subtitle="Per annum" trend="+8% increase" color="purple" />
        <StatCard icon={Award} title="Highest Package" value={`₹${data.topPackage}L`} subtitle="This academic year" color="orange" />
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard icon={Building2} title="Companies Visited" value={data.companiesVisited} subtitle="This year" color="indigo" />
        <StatCard icon={Clock} title="Ongoing Drives" value={data.ongoingDrives} subtitle="Active recruitment" color="cyan" />
        <StatCard icon={Calendar} title="Upcoming Interviews" value={data.upcomingInterviews} subtitle="Next 7 days" color="yellow" />
        <StatCard icon={TrendingUp} title="Total Offers" value={data.totalOffers} subtitle={`${data.multipleOffers} multiple offers`} color="emerald" />
      </section>

      <section className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Quick Insights
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg">
            <div className="font-semibold">Top Performing Department</div>
            <div className="text-xl font-bold">Computer Science</div>
            <div className="text-sm">85% placement rate</div>
          </div>
          <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 p-4 rounded-lg">
            <div className="font-semibold">Most Active Recruiter</div>
            <div className="text-xl font-bold">TCS</div>
            <div className="text-sm">45 offers this year</div>
          </div>
          <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 p-4 rounded-lg">
            <div className="font-semibold">Peak Recruitment Month</div>
            <div className="text-xl font-bold">April 2024</div>
            <div className="text-sm">180 placements</div>
          </div>
        </div>
      </section>

      <footer className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
        © 2024 PlaceHub - University Placement Management System
        <div className="flex justify-center gap-4 mt-2">
          <button className="hover:underline">Privacy Policy</button>
          <button className="hover:underline">Terms of Service</button>
          <button className="hover:underline">Support</button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
