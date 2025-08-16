import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyForm() {
  const navigate = useNavigate();
  const { addUser } = useUser();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    email: '',
    password: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.companyName || !formData.industry || !formData.email || !formData.password || !formData.website) {
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/register/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      toast.success('Company registration successful! Please login with your email and password.');
      setTimeout(() => navigate('/auth'), 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-200 disabled:bg-orange-400 dark:disabled:bg-orange-400"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}