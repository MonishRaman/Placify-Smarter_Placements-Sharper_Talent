import { GraduationCap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Animation library
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import apiClient from '../../api/apiClient';

export default function StudentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    major: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.university || !formData.major || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/auth/register/student', formData);
      alert('Registration successful! Please login.');
      navigate('/auth');
    } catch (err) {
      if (err.response) {
        setError(err.response?.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top header */}
      <Header />

      {/* Hero section */}
      <div className="pt-16">
        <RegistrationHeader
          title="Student Registration"
          subtitle="Join thousands of students who have landed their dream jobs with Placify's AI-powered interview coaching."
          tagline="Takes less than 2 minutes. No resume required."
          icon={<GraduationCap className="w-10 h-10 text-white" />}
          color="purple"
          userType="student"
        />
      </div>

      {/* Form section */}
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-lg mx-auto p-8 rounded-2xl shadow-xl
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-indigo-600 before:via-purple-600 before:to-indigo-700
                     before:animate-gradient-move before:-z-10"
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <FormInput
              label="University Name"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
            />
            <FormInput
              label="Major/Field of Study"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              required
            />
            <FormInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <FormInput
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 text-lg font-medium rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? 'Registering...' : 'Register as Student'}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}