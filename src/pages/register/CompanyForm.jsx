import { Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient';

export default function CompanyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    hrEmail: '',
    password: '',
    role: 'company'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.companyName || !formData.industry || !formData.website || !formData.hrEmail || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.hrEmail)) {
      setError('Please enter a valid email address for the HR contact');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/auth/register/company', formData);
      toast.success('Company registration successful! Please login.');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <ToastContainer 
        position="top-center" 
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      <div className="pt-16">
        <RegistrationHeader
          title="Company Registration"
          subtitle="Scale your hiring process with enterprise-grade AI assessment platform. Join 500+ companies transforming recruitment with intelligent automation."
          tagline="Enterprise setup in minutes"
          icon={<Building2 className="w-10 h-10 text-white" />}
          color="orange"
          userType="company"
        />
      </div>

      <div className="py-12 px-4">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 transition-colors duration-200">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <FormInput
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              type="email"
              label="HR Contact Email"
              value={formData.hrEmail}
              onChange={(e) => setFormData({ ...formData, hrEmail: e.target.value })}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 rounded-md shadow-lg hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-70 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 transition duration-200 disabled:bg-orange-400 dark:disabled:bg-orange-400"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? 'Registering...' : 'Register Company'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
