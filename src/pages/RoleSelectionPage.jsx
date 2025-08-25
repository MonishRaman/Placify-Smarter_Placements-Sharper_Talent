import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  School,
  Briefcase,
  Building,
  ArrowRight,
  CheckCircle,
  Users,
  Brain,
  Sun,
  Moon,
  Star,
  Sparkles,
} from "lucide-react";
import Footer from '../components/Footer';

const RoleSelectionPage = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage?.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage?.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage?.setItem('theme', 'light');
    }
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogoClick = () => {
    console.log('Logo clicked - navigating to home');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const roles = [
    {
      title: "Student",
      subtitle: "Looking for your dream job",
      description: "Practice interviews, get AI feedback, and land your perfect placement",
      icon: <GraduationCap className="w-8 h-8" />,
      route: "/register/student",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgGradient: "from-blue-50/90 to-cyan-50/90 dark:from-blue-900/40 dark:to-cyan-900/40",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
      textColor: "text-blue-600 dark:text-blue-300",
      borderColor: "border-blue-200/60 dark:border-blue-700/60",
      hoverBorder: "hover:border-blue-300/80 dark:hover:border-blue-500/80",
      glowColor: "shadow-blue-500/25 dark:shadow-blue-400/25",
      features: ["AI Interview Practice", "Skill Assessment", "Performance Analytics", "Career Guidance"],
    },
    {
      title: "College/University",
      subtitle: "Enhance placement success", 
      description: "Streamline campus placements with AI-powered recruitment automation",
      icon: <School className="w-8 h-8" />,
      route: "/register/institution",
      gradient: "from-emerald-500 via-green-600 to-teal-500",
      bgGradient: "from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/40 dark:to-teal-900/40",
      iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700",
      textColor: "text-emerald-600 dark:text-emerald-300",
      borderColor: "border-emerald-200/60 dark:border-emerald-700/60",
      hoverBorder: "hover:border-emerald-300/80 dark:hover:border-emerald-500/80",
      glowColor: "shadow-emerald-500/25 dark:shadow-emerald-400/25",
      features: ["Automated Screening", "Bulk Assessments", "Placement Analytics", "Industry Partnerships"],
    },
    {
      title: "HR Professional",
      subtitle: "Recruit top talent efficiently",
      description: "Find the best candidates faster with AI-driven recruitment tools",
      icon: <Briefcase className="w-8 h-8" />,
      route: "/register/employee",
      gradient: "from-purple-500 via-violet-600 to-pink-500",
      bgGradient: "from-purple-50/90 to-pink-50/90 dark:from-purple-900/40 dark:to-pink-900/40",
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700",
      textColor: "text-purple-600 dark:text-purple-300",
      borderColor: "border-purple-200/60 dark:border-purple-700/60",
      hoverBorder: "hover:border-purple-300/80 dark:hover:border-purple-500/80",
      glowColor: "shadow-purple-500/25 dark:shadow-purple-400/25",
      features: ["Smart Candidate Matching", "Video Interview Analysis", "Skill Verification", "Hiring Analytics"],
    },
    {
      title: "Company",
      subtitle: "Scale your hiring process",
      description: "Transform recruitment with enterprise-grade AI assessment platform",
      icon: <Building className="w-8 h-8" />,
      route: "/register/company",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50/90 to-red-50/90 dark:from-orange-900/40 dark:to-red-900/40",
      iconBg: "bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700",
      textColor: "text-orange-600 dark:text-orange-300",
      borderColor: "border-orange-200/60 dark:border-orange-700/60",
      hoverBorder: "hover:border-orange-300/80 dark:hover:border-orange-500/80",
      glowColor: "shadow-orange-500/25 dark:shadow-orange-400/25",
      features: ["Enterprise Solutions", "Custom Assessments", "Team Management", "Advanced Reporting"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/50 transition-all duration-500">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="group relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
        >
          <div className="relative w-6 h-6">
            <Sun 
              className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
                isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`} 
            />
            <Moon 
              className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
                isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`} 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-purple-400/60 dark:bg-purple-300/60 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/60 dark:bg-blue-300/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400/60 dark:bg-pink-300/60 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16 mt-20">
            {/* Logo/Brand */}
            <div
              className="flex items-center justify-center space-x-3 mb-8 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="relative p-4 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-400 dark:via-purple-500 dark:to-indigo-500 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Brain className="w-8 h-8 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="relative">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 dark:from-purple-300 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Placify
                </span>
                <Sparkles className="absolute -top-1 -right-6 w-4 h-4 text-purple-400 dark:text-purple-300 animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Choose Your Path to
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                Success
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Join thousands who are revolutionizing recruitment with AI-powered
              assessments and placements. Your journey to success starts here.
            </p>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">10K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">85% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Building className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">500+ Companies</span>
              </div>
            </div>
          </div>

          {/* Enhanced Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {roles.map((role, index) => (
              <div
                key={role.title}
                onClick={() => handleNavigation(role.route)}
                className={`relative group cursor-pointer backdrop-blur-lg rounded-3xl shadow-xl hover:${role.glowColor} hover:shadow-2xl transition-all duration-500 border ${role.borderColor} ${role.hoverBorder} overflow-hidden transform hover:-translate-y-3 hover:scale-[1.02] bg-gradient-to-br ${role.bgGradient}`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative p-6 lg:p-8">
                  {/* Enhanced Icon */}
                  <div className={`${role.iconBg} text-white p-4 rounded-2xl mb-6 inline-flex shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {role.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                      {role.title}
                    </h3>
                    <p className={`text-sm font-semibold ${role.textColor} mb-3`}>
                      {role.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Enhanced Features List */}
                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300"
                      >
                        <div className="relative">
                          <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Registration Button */}
                  <div className="flex justify-center">
                    <button className={`w-full bg-gradient-to-r ${role.gradient} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                    onClick={() => handleRegistration(role.title)}
                    >
                      <span>Register as {role.title === "College/University" ? "Institution" : role.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Border Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300 pointer-events-none blur-sm`} />
              </div>
            ))}
          </div>

          {/* Enhanced Bottom CTA */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Not sure which option is right for you?
            </p>
            <button
              onClick={() => handleNavigation("/contact")}
              className="inline-flex items-center space-x-3 text-purple-600 dark:text-purple-400 hover:text-white dark:hover:text-white font-semibold transition-all duration-300 bg-white/70 dark:bg-gray-800/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 backdrop-blur-lg px-6 py-4 rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:border-transparent shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 hover:scale-105 group"
            >
              <span className="text-lg">Contact our team for guidance</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"></div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoleSelectionPage;