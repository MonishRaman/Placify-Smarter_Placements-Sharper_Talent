import { School, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient';

export default function InstitutionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    institutionName: '',
    website: '',
    contactPerson: '',
    email: '',
    password: '',
    role: 'institution'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.institutionName || !formData.website || !formData.contactPerson || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    try {
      new URL(formData.website);
    } catch (_) {
      setError('Please enter a valid website URL');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending institution registration data:', formData);
      await apiClient.post('/auth/register/institution', formData);
      alert('Institution registration successful! Please login.');
      navigate('/auth');
    } catch (err) {
      console.error('Registration error:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <div className="pt-16">
        <RegistrationHeader
          title="Institution Registration"
          subtitle="Transform your campus placements with our AI-powered recruitment platform. Join leading universities in revolutionizing the placement process."
          tagline="Complete setup in under 5 minutes"
          icon={<School className="w-10 h-10 text-white" />}
          color="blue"
          userType="institution"
        />
      </div>
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-md mx-auto p-6 rounded-2xl shadow-xl 
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-teal-400 before:via-cyan-400 before:to-emerald-400
                     before:animate-gradient-move before:-z-10"
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 
                         dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Institution Name"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              required
              focusColor="blue"
            />
            <FormInput
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              required
              focusColor="blue"
            />
            <FormInput
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
              focusColor="blue"
            />
            <FormInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              focusColor="blue"
            />
            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              focusColor="blue"
            />

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 
                         bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 
                         rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? 'Registering...' : 'Register Institution'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
