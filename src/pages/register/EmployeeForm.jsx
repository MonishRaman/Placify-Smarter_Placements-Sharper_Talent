import { Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient'; // Import the new apiClient

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    currentCompany: '',
    jobTitle: '',
    email: '',
    password: '',
    role: 'employee' // Role is important
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // REFACTORED API CALL - Fixed endpoint to match server routes
      console.log('Sending registration data:', formData);
      await apiClient.post('/auth/register/employee', formData);
      
      alert('Employee registration successful! Please login.');
      navigate('/auth');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(err.response?.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // JSX remains the same
  return (
    // 1. ADDED dark mode background to the main container
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="pt-16">
        <RegistrationHeader
          title="HR Professional Registration"
          subtitle="Revolutionize your recruitment process with AI-powered candidate assessment and streamlined hiring workflows designed for HR professionals."
          tagline="Quick setup for recruiting teams"
          icon={<Briefcase className="w-10 h-10 text-white" />}
          color="green"
          userType="employee"
        />
      </div>
      <div className="py-12 px-4">
        {/* 2. ADDED dark mode background to the form card */}
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-slate-800">
          {error && (
            // 3. ADDED dark mode styles for the error message
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              label="Current Company"
              value={formData.currentCompany}
              onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 dark:hover:bg-blue-500 dark:disabled:bg-blue-800"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}