import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import InterviewInterface from "./pages/InterviewInterface";
import ResultsPage from "./pages/ResultsPage";
import Footer from "./components/Footer";
import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentForm from './pages/register/StudentForm';
import InstitutionForm from './pages/register/InstitutionForm';
import EmployeeForm from './pages/register/EmployeeForm';
import CompanyForm from './pages/register/CompanyForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Routes>
            {/* Core Application Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<InterviewInterface />} />
            <Route path="/results/:interviewId" element={<ResultsPage />} />
            
            {/* Registration Flow */}
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentForm />} />
            <Route path="/register/institution" element={<InstitutionForm />} />
            <Route path="/register/employee" element={<EmployeeForm />} />
            <Route path="/register/company" element={<CompanyForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;