// src/pages/register/StudentForm.jsx
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';

export default function StudentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    major: '',
    email: '',
    password: ''
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
      // For demo purposes, simulate successful registration
      // Comment this block and uncomment the fetch block when backend is ready
      console.log('Student Registration Data (Demo Mode):', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      alert('Registration successful! (Demo Mode) Please login.');
      navigate('/auth'); // Redirect to login page
      
      /* Uncomment this when backend is ready
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
      alert('Registration successful! Please login.');
      navigate('/auth'); // Redirect to login page
      */
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
    <div className="min-h-screen bg-gray-50">
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
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
            
            <FormInput
              label="University Name"
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
              required
            />
            
            <FormInput
              label="Major/Field of Study"
              value={formData.major}
              onChange={(e) => setFormData({...formData, major: e.target.value})}
              required
            />
            
            <FormInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 disabled:bg-purple-400"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}