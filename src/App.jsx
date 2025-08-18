import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import FeedbackPage from "./pages/FeedbackPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";

import RoleSelectionPage from "./pages/RoleSelectionPage";
import CompanyForm from "./pages/register/CompanyForm";
import EmployeeForm from "./pages/register/EmployeeForm";
import InstitutionForm from "./pages/register/InstitutionForm";
import StudentForm from "./pages/register/StudentForm";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Aptitude from "./pages/Student/Aptitude";
import Coding from "./pages/Student/Coding";
import Dashboard from "./pages/Student/Dashboard";
import InterviewExperience from "./pages/Student/InterviewExperience";
import InterviewInterface from "./pages/Student/InterviewInterface";
import Jobs from "./pages/Student/Jobs";
import ResumeATS from "./pages/Student/ResumeATS";
import ResumeBuilder from "./pages/Student/ResumeBuilder";
import Settings from "./pages/Student/Settings";

import InstitutionDashboardLayout from './layouts/InstitutionDashboardLayout';
import InstitutionDashboard from './pages/Institution/InstitutionDashboard';
import Profile from './pages/Institution/Profile';
import StudentPerformance from './pages/Institution/StudentPerformance';
import DepartmentPerformance from './pages/Institution/DepartmentPerformance';
import Reports from './pages/Institution/Reports';
import Analytics from './pages/Institution/Analytics';
import InstitutionSettings from './pages/Institution/Settings';

// Company Dashboard Layout and Pages
import CompanyDashboardLayout from './layouts/CompanyDashboardLayout';
import CompanyDashboard from './pages/company/CompanyDashboard';
import Applicants from './pages/company/Applicants';
import Collaboration from './pages/company/Collaboration';
import Employees from './pages/company/Employees';
import Insights from './pages/company/Insights';
import Performance from './pages/company/performance';
import PostJob from './pages/company/postJob';
import CompanyProfile from './pages/company/profile';
import CompanyReports from './pages/company/Reports';

// Employee Dashboard Layout and Pages
import EmployeeDashboardLayout from './layouts/EmployeeDashboardLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeProfile from './pages/employee/Profile';
import PerformanceOverview from './pages/employee/PerformanceOverview';
import SkillDevelopmentTracker from './pages/employee/SkillDevelopmentTracker';
import ProjectContributions from './pages/employee/ProjectContributions';
import CareerProgression from './pages/employee/CareerProgression';
import CompanyFeedback from './pages/employee/CompanyFeedback';
import LearningResources from './pages/employee/LearningResources';
import InterviewPracticeZone from './pages/employee/InterviewPracticeZone';
import JobSwitchInsights from './pages/employee/JobSwitchInsights';
import EmployeeSettings from './pages/employee/Settings';

import { motion } from "framer-motion";
import API from "./api/api";

import UserJobs from "./pages/Student/UserJobs";

import ScrollToTop from "./components/ScrollToTop";
import useLenis from "./components/useLenis";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Wrapper to allow useLocation inside Router
const AppWrapper = () => {
  useLenis();

  const location = useLocation();

  // Footer visible only on home page
  const shouldHideFooter = location.pathname !== "/";

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentForm />} />
            <Route path="/register/institution" element={<InstitutionForm />} />
            <Route path="/register/employee" element={<EmployeeForm />} />
            <Route path="/register/company" element={<CompanyForm />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Standalone Route */}
            <Route path="/interview" element={<InterviewInterface />} />

            {/* Institution Dashboard Routes */}
            <Route
              path="/dashboard/institution"
              element={
                <ProtectedRoute>
                  <InstitutionDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<InstitutionDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="student-performance" element={<StudentPerformance />} />
              <Route path="department-performance" element={<DepartmentPerformance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<InstitutionSettings />} />
            </Route>

            {/* Company Dashboard Routes */}
            <Route
              path="/dashboard/company"
              element={
                <ProtectedRoute>
                  <CompanyDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CompanyDashboard />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="employees" element={<Employees />} />
              <Route path="performance" element={<Performance />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="insights" element={<Insights />} />
              <Route path="collaboration" element={<Collaboration />} />
              <Route path="reports" element={<CompanyReports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Employee Dashboard Routes */}
            <Route
              path="/dashboard/employee"
              element={
                <ProtectedRoute>
                  <EmployeeDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="performance" element={<PerformanceOverview />} />
              <Route path="skills" element={<SkillDevelopmentTracker />} />
              <Route path="projects" element={<ProjectContributions />} />
              <Route path="career" element={<CareerProgression />} />
              <Route path="feedback" element={<CompanyFeedback />} />
              <Route path="learning" element={<LearningResources />} />
              <Route path="interview-practice" element={<InterviewPracticeZone />} />
              <Route path="job-insights" element={<JobSwitchInsights />} />
              <Route path="settings" element={<EmployeeSettings />} />
            </Route>

            {/* Results */}
            <Route
              path="/results/:interviewId"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />

            {/* Student Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                // <ProtectedRoute>
                  <DashboardLayout />
                // </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="resume-builder" element={<ResumeBuilder />} />
              <Route path="resume-ats" element={<ResumeATS />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="user-jobs" element={<UserJobs />} />
              <Route path="coding" element={<Coding />} />
              <Route path="interview-practice" element={<InterviewInterface />} />
              <Route path="aptitude" element={<Aptitude />} />
              <Route path="interview-experience" element={<InterviewExperience />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Conditional Footer */}
        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
};

// ✅ Actual App that wraps AppWrapper inside Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;