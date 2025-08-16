// src/pages/register/StudentForm.jsx
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentForm() {
  const navigate = useNavigate();
  const { addUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    major: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!formData.fullName || !formData.university || !formData.major || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Registration successful
      toast.success('Registration successful! Please login.', { position: 'top-center' });
      setTimeout(() => navigate('/auth'), 3000);

    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Failed to fetch') {
        setError('Server connection error. The backend server might not be running. Please try again later.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="pt-16"> {/* Add padding to account for fixed header */}
        <RegistrationHeader
          title="Student Registration"
          subtitle="Join thousands of students who have landed their dream jobs with Placify's AI-powered interview coaching and placement assistance."
          tagline="Takes less than 2 minutes. No resume required."
          icon={<GraduationCap className="w-10 h-10 text-white" />}
          color="purple"
          userType="student"
        />
      </div>
      
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 transition-colors duration-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
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
              label="University Name"
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            
            <FormInput
              label="Major/Field of Study"
              value={formData.major}
              onChange={(e) => setFormData({...formData, major: e.target.value})}
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
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-200 disabled:bg-purple-400 dark:disabled:bg-purple-400"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Student'}
            </button>
          </form>
        </div>
      </div>

      {/* Toast container to show toast messages */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}