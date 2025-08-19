import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  School,
  Briefcase,
  Building,
  ArrowRight,
  CheckCircle,
  Users,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      subtitle: "Looking for your dream job",
      description:
        "Practice interviews, get AI feedback, and land your perfect placement",
      icon: <GraduationCap className="w-8 h-8" />,
      route: "/register/student",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50/80 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-800/50",
      textColor: "text-blue-600 dark:text-blue-400",
      hoverBg: "group-hover:bg-blue-100/50 dark:group-hover:bg-blue-800/30",
      features: [
        "AI Interview Practice",
        "Skill Assessment",
        "Performance Analytics",
        "Career Guidance",
      ],
    },
    {
      title: "College/University",
      subtitle: "Enhance placement success",
      description:
        "Streamline campus placements with AI-powered recruitment automation",
      icon: <School className="w-8 h-8" />,
      route: "/register/institution",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50/80 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-800/50",
      textColor: "text-emerald-600 dark:text-emerald-400",
      hoverBg: "group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-800/30",
      features: [
        "Automated Screening",
        "Bulk Assessments",
        "Placement Analytics",
        "Industry Partnerships",
      ],
    },
    {
      title: "HR Professional",
      subtitle: "Recruit top talent efficiently",
      description:
        "Find the best candidates faster with AI-driven recruitment tools",
      icon: <Briefcase className="w-8 h-8" />,
      route: "/register/employee",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50/80 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-800/50",
      textColor: "text-purple-600 dark:text-purple-400",
      hoverBg: "group-hover:bg-purple-100/50 dark:group-hover:bg-purple-800/30",
      features: [
        "Smart Candidate Matching",
        "Video Interview Analysis",
        "Skill Verification",
        "Hiring Analytics",
      ],
    },
    {
      title: "Company",
      subtitle: "Scale your hiring process",
      description:
        "Transform recruitment with enterprise-grade AI assessment platform",
      icon: <Building className="w-8 h-8" />,
      route: "/register/company",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50/80 dark:bg-orange-900/20",
      iconBg: "bg-orange-100 dark:bg-orange-800/50",
      textColor: "text-orange-600 dark:text-orange-400",
      hoverBg: "group-hover:bg-orange-100/50 dark:group-hover:bg-orange-800/30",
      features: [
        "Enterprise Solutions",
        "Custom Assessments",
        "Team Management",
        "Advanced Reporting",
      ],
    },
  ];

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-850 dark:to-purple-900/50 transition-colors duration-300">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12 mt-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center justify-center space-x-3 mb-6 cursor-pointer group"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleLogoClick}
            >
              <motion.div 
                className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Placify
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Choose Your Path to Success
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Join thousands who are revolutionizing recruitment with AI-powered
              assessments and placements
            </motion.p>

            {/* Enhanced Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>10K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>85% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <Building className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>500+ Companies</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Role Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                onClick={() => navigate(role.route)}
                className={`relative group cursor-pointer backdrop-blur-sm
                           rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 
                           border border-white/40 dark:border-gray-700/40 hover:border-white/60 dark:hover:border-gray-600/60 overflow-hidden
                           transform hover:-translate-y-2 ${role.bgColor} ${role.hoverBg}
                           bg-white/60 dark:bg-gray-800/60`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1.2 + index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Enhanced Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 lg:p-8">
                  {/* Enhanced Icon */}
                  <motion.div
                    className={`${role.iconBg} ${role.textColor} p-4 rounded-2xl mb-6 inline-flex shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/20 dark:border-gray-700/20`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.4 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {role.icon}
                  </motion.div>

                  {/* Title & Subtitle */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {role.title}
                    </h3>
                    <p className={`text-sm font-medium ${role.textColor} mb-3`}>
                      {role.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </motion.div>

                  {/* Enhanced Features List */}
                  <motion.div
                    className="space-y-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  >
                    {role.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Enhanced CTA Button */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 2.0 + index * 0.1 }}
                  >
                    <div
                      className={`inline-flex items-center space-x-2 ${role.textColor} font-semibold group-hover:translate-x-1 transition-transform duration-300`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Hover Border Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Subtle inner glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

          {/* Enhanced Bottom CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.5 }}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Not sure which option is right for you?
            </p>
            <motion.button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300/70 dark:hover:border-purple-600/70"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Contact our team for guidance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;