import { Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    currentCompany: '',
    jobTitle: '',
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
    if (!formData.fullName || !formData.currentCompany || !formData.jobTitle || !formData.email || !formData.password) {
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
      console.log('Employee Registration Data (Demo Mode):', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      alert('Employee registration successful! (Demo Mode) Please login.');
      navigate('/auth'); // Redirect to login page
      
      /* Uncomment this when backend is ready
      const response = await fetch('http://localhost:5000/api/auth/register/employee', {
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
      alert('Employee registration successful! Please login.');
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
              label="Current Company"
              value={formData.currentCompany}
              onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
              required
            />
            
            <FormInput
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
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
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-green-400"
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