import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";
import { LoadingProvider } from "./context/LoadingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { motion } from "framer-motion";
import API from "./api/api";
import ScrollToTop from "./components/ScrollToTop";
import useLenis from "./components/useLenis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CursorTrail from "./components/CursorTrail";
import Loader from "./components/Loader"; // Assuming you have a Loader component

// Lazy-loaded components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Resume = lazy(() => import("./pages/Resume"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const RoleSelectionPage = lazy(() => import("./pages/RoleSelectionPage"));
const CompanyForm = lazy(() => import("./pages/register/CompanyForm"));
const EmployeeForm = lazy(() => import("./pages/register/EmployeeForm"));
const InstitutionForm = lazy(() => import("./pages/register/InstitutionForm"));
const StudentForm = lazy(() => import("./pages/register/StudentForm"));
const StudentProgressDashboard = lazy(() => import("./pages/Student/StudentProgressDashboard"));
const StudentProgressDetail = lazy(() => import("./pages/Student/StudentProgressDetail"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Aptitude = lazy(() => import("./pages/Student/Aptitude"));
const Coding = lazy(() => import("./pages/Student/Coding"));
const CodingEditor = lazy(() => import("./pages/Student/CodingEditor"));
const Dashboard = lazy(() => import("./pages/Student/Dashboard"));
const InterviewExperience = lazy(() => import("./pages/Student/InterviewExperience"));
const InterviewInterface = lazy(() => import("./pages/Student/InterviewInterface"));
const Jobs = lazy(() => import("./pages/Student/Jobs"));
const ResumeATS = lazy(() => import("./pages/Student/ResumeATS"));
const ResumeBuilder = lazy(() => import("./pages/Student/ResumeBuilder"));
const Settings = lazy(() => import("./pages/Student/Settings"));
const InstitutionDashboardLayout = lazy(() => import("./layouts/InstitutionDashboardLayout"));
const InstitutionDashboard = lazy(() => import("./pages/Institution/InstitutionDashboard"));
const InstitutionProfile = lazy(() => import("./pages/Institution/InstitutionProfile"));
const StudentPerformance = lazy(() => import("./pages/Institution/StudentPerformance"));
const DepartmentPerformance = lazy(() => import("./pages/Institution/DepartmentPerformance"));
const Reports = lazy(() => import("./pages/Institution/Reports"));
const Analytics = lazy(() => import("./pages/Institution/Analytics"));
const InstitutionSettings = lazy(() => import("./pages/Institution/Settings"));
const CompanyDashboardLayout = lazy(() => import("./layouts/CompanyDashboardLayout"));
const CompanyDashboard = lazy(() => import("./pages/company/CompanyDashboard"));
const Applicants = lazy(() => import("./pages/company/Applicants"));
const Collaboration = lazy(() => import("./pages/company/Collaboration"));
const Employees = lazy(() => import("./pages/company/Employees"));
const Insights = lazy(() => import("./pages/company/Insights"));
const Performance = lazy(() => import("./pages/company/performance"));
const PostJob = lazy(() => import("./pages/company/postJob"));
const CompanyProfile = lazy(() => import("./pages/company/CompanyProfile"));
const CompanyReports = lazy(() => import("./pages/company/Reports"));
const EmployeeDashboardLayout = lazy(() => import("./layouts/EmployeeDashboardLayout"));
const EmployeeDashboard = lazy(() => import("./pages/employee/EmployeeDashboard"));
const EmployeeProfile = lazy(() => import("./pages/employee/EmployeeProfile"));
const PerformanceOverview = lazy(() => import("./pages/employee/PerformanceOverview"));
const SkillDevelopmentTracker = lazy(() => import("./pages/employee/SkillDevelopmentTracker"));
const ProjectContributions = lazy(() => import("./pages/employee/ProjectContributions"));
const CareerProgression = lazy(() => import("./pages/employee/CareerProgression"));
const CompanyFeedback = lazy(() => import("./pages/employee/CompanyFeedback"));
const LearningResources = lazy(() => import("./pages/employee/LearningResources"));
const InterviewPracticeZone = lazy(() => import("./pages/employee/InterviewPracticeZone"));
const JobSwitchInsights = lazy(() => import("./pages/employee/JobSwitchInsights"));
const EmployeeSettings = lazy(() => import("./pages/employee/Settings"));
const UserJobs = lazy(() => import("./pages/Student/UserJobs"));

const AppWrapper = () => {
  useLenis();
  const location = useLocation();
  const shouldHideFooter = location.pathname !== "/";

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<RoleSelectionPage />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/register/student" element={<StudentForm />} />
              <Route path="/register/institution" element={<InstitutionForm />} />
              <Route path="/register/employee" element={<EmployeeForm />} />
              <Route path="/register/company" element={<CompanyForm />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/contact" element={<ContactPage />} />

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
                <Route path="profile" element={<ProfilePage />} />
                <Route
                  path="student-performance"
                  element={<StudentPerformance />}
                />
                <Route
                  path="department-performance"
                  element={<DepartmentPerformance />}
                />
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
                <Route
                  path="interview-practice"
                  element={<InterviewPracticeZone />}
                />
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
                <Route path="coding/:id" element={<CodingEditor />} />
                <Route
                  path="interview-practice"
                  element={<InterviewInterface />}
                />
                <Route path="aptitude" element={<Aptitude />} />
                <Route
                  path="interview-experience"
                  element={<InterviewExperience />}
                />
                <Route path="settings" element={<Settings />} />
                <Route path="progress" element={<StudentProgressDashboard />} />
                <Route
                  path="progress/:studentId"
                  element={<StudentProgressDetail />}
                />
              </Route>
            </Routes>
          </Suspense>
        </div>

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

        {!shouldHideFooter && <Footer />}
        <CursorTrail />
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <UserProvider>
          <Router>
            <AppWrapper />
          </Router>
        </UserProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
