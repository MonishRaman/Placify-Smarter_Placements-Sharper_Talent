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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
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
      
      <div className="py-12 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-10 w-32 h-32 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-3xl">
            {/* Form header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Registration</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Fill in your details to get started</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
              
              <FormInput
                label="University Name"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
              
              <FormInput
                label="Major/Field of Study"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
              
              <FormInput
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
              
              <FormInput
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Register as Student'
                )}
              </button>
            </form>

            {/* Additional info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Toast container */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16"
        toastClassName={(context) =>
          `${
            context?.type === 'success' 
              ? 'bg-green-600 dark:bg-green-500' 
              : context?.type === 'error'
              ? 'bg-red-600 dark:bg-red-500'
              : 'bg-blue-600 dark:bg-blue-500'
          } relative flex p-1 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer shadow-2xl`
        }
        bodyClassName={() => "text-white text-sm font-medium p-3"}
      />
    </div>
  );
}