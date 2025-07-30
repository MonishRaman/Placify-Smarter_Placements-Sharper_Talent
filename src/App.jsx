import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import InterviewInterface from "./pages/InterviewInterface";
import ResultsPage from "./pages/ResultsPage";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import FeedbackPage from "./pages/FeedbackPage";

import InstitutionDashboard from './components/InstitutionDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import CompanyDashboard from './components/CompanyDashboard';

import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentForm from './pages/register/StudentForm';
import InstitutionForm from './pages/register/InstitutionForm';
import EmployeeForm from './pages/register/EmployeeForm';
import CompanyForm from './pages/register/CompanyForm';

import ProtectedRoute from './components/ProtectedRoute';

import { motion } from "framer-motion";

import useLenis from "./components/useLenis"; // Import the custom hook for smooth scrolling
import ScrollToTop from "./components/ScrollToTop";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Initialize Lenis for smooth scrolling
  useLenis();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentForm />} />
            <Route path="/register/institution" element={<InstitutionForm />} />
            <Route path="/register/employee" element={<EmployeeForm />} />
            <Route path="/register/company" element={<CompanyForm />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={<InterviewInterface />}
            />
            <Route
              path="/results/:interviewId"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/institution"
              element={
                // <ProtectedRoute>
                  <InstitutionDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/employee"
              element={
                // <ProtectedRoute>
                  <EmployeeDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/company"
              element={
                // <ProtectedRoute>
                  <CompanyDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                // <ProtectedRoute>
                <ProfilePage />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Global Toast Notifications */}
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

        <Footer />
      </div>
    </Router>
  );
}

export default App;
