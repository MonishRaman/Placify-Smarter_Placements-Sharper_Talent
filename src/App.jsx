import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CursorProvider, useCursor } from "./context/CursorContext";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import FeedbackPage from "./pages/FeedbackPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import Resume from "./pages/Resume";
import ResultsPage from "./pages/ResultsPage";

import RoleSelectionPage from "./pages/RoleSelectionPage";
import CompanyForm from "./pages/register/CompanyForm";
import EmployeeForm from "./pages/register/EmployeeForm";
import InstitutionForm from "./pages/register/InstitutionForm";
import StudentForm from "./pages/register/StudentForm";
import StudentProgressDashboard from "./pages/Student/StudentProgressDashboard";
import StudentProgressDetail from "./pages/Student/StudentProgressDetail";
import ContactPage from "./pages/ContactPage";

import { LoadingProvider } from "./context/LoadingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Aptitude from "./pages/Student/Aptitude";
import Coding from "./pages/Student/Coding";
import CodingEditor from "./pages/Student/CodingEditor";
import Dashboard from "./pages/Student/Dashboard";
import InterviewExperience from "./pages/Student/InterviewExperience";
import InterviewInterface from "./pages/Student/InterviewInterface";
import Jobs from "./pages/Student/Jobs";
import ResumeATS from "./pages/Student/ResumeATS";
import ResumeBuilder from "./pages/Student/ResumeBuilder";
import Settings from "./pages/Student/Settings"; // ⚠️ student settings

import InstitutionDashboardLayout from "./layouts/InstitutionDashboardLayout";
import InstitutionDashboard from "./pages/Institution/InstitutionDashboard";
import InstitutionProfile from "./pages/Institution/InstitutionProfile";
import StudentPerformance from "./pages/Institution/StudentPerformance";
import DepartmentPerformance from "./pages/Institution/DepartmentPerformance";
import Reports from "./pages/Institution/Reports";
import Analytics from "./pages/Institution/Analytics";
import InstitutionSettings from "./pages/Institution/Settings";

import CompanyDashboardLayout from "./layouts/CompanyDashboardLayout";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Applicants from "./pages/company/Applicants";
import Collaboration from "./pages/company/Collaboration";
import Employees from "./pages/company/Employees";
import Insights from "./pages/company/Insights";
import Performance from "./pages/company/performance"; // ⚠️ check filename case
import PostJob from "./pages/company/postJob";         // ⚠️ check filename case
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyReports from "./pages/company/Reports";
import MyCompanyJobs from "./pages/company/MyCompanyJobs";
// ⚠️ CompanySettings component missing? currently uses Student Settings

import EmployeeDashboardLayout from "./layouts/EmployeeDashboardLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import PerformanceOverview from "./pages/employee/PerformanceOverview";
import SkillDevelopmentTracker from "./pages/employee/SkillDevelopmentTracker";
import ProjectContributions from "./pages/employee/ProjectContributions";
import CareerProgression from "./pages/employee/CareerProgression";
import CompanyFeedback from "./pages/employee/CompanyFeedback";
import LearningResources from "./pages/employee/LearningResources";
import InterviewPracticeZone from "./pages/employee/InterviewPracticeZone";
import JobSwitchInsights from "./pages/employee/JobSwitchInsights";
import EmployeeSettings from "./pages/employee/Settings";

import { motion } from "framer-motion";
import API from "./api/api";

import UserJobs from "./pages/Student/UserJobs";
import ScrollToTop from "./components/ScrollToTop";
import useLenis from "./components/useLenis";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PaymentGateway from './components/payment/PaymentGateway';
import CursorTrail from "./components/CursorTrail"; // ⚠️ make sure file exists

const AppWrapper = () => {
  useLenis();
  const location = useLocation();
  const { cursorEnabled } = useCursor();

  const shouldHideFooter = location.pathname !== "/";

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-between">
        <div className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} /> {/* ✅ moved before wildcard */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/register/student" element={<StudentForm />} />
            <Route path="/register/institution" element={<InstitutionForm />} />
            <Route path="/register/employee" element={<EmployeeForm />} />
            <Route path="/register/company" element={<CompanyForm />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/payment" element={<PaymentGateway />} />
            <Route path="/interview" element={<InterviewInterface />} />

            {/* Institution Dashboard */}
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
              <Route path="student-performance" element={<StudentPerformance />} />
              <Route path="department-performance" element={<DepartmentPerformance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<InstitutionSettings />} />
            </Route>

            {/* Company Dashboard */}
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
              <Route path="my-jobs" element={<MyCompanyJobs />} /> {/* ✅ fixed path */}
              <Route path="insights" element={<Insights />} />
              <Route path="collaboration" element={<Collaboration />} />
              <Route path="reports" element={<CompanyReports />} />
              <Route path="settings" element={<Settings />} /> 
              {/* ⚠️ currently using Student Settings — consider creating CompanySettings.jsx */}
            </Route>

            {/* Employee Dashboard */}
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

            {/* Student Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="resume-builder" element={<ResumeBuilder />} />
              <Route path="resume-ats" element={<ResumeATS />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="user-jobs" element={<UserJobs />} />
              <Route path="coding" element={<Coding />} />
              <Route path="coding/:id" element={<CodingEditor />} />
              <Route path="interview-practice" element={<InterviewInterface />} />
              <Route path="aptitude" element={<Aptitude />} />
              <Route path="interview-experience" element={<InterviewExperience />} />
              <Route path="settings" element={<Settings />} />
              <Route path="progress" element={<StudentProgressDashboard />} />
              <Route path="progress/:studentId" element={<StudentProgressDetail />} />
            </Route>

            {/* Wildcard route should always be last */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* ✅ moved down */}
          </Routes>
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
        {cursorEnabled && <CursorTrail />}
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CursorProvider>
        <LoadingProvider>
          <UserProvider>
            <Router>
              <AppWrapper />
            </Router>
          </UserProvider>
        </LoadingProvider>
      </CursorProvider>
    </ThemeProvider>
  );
}

export default App;
