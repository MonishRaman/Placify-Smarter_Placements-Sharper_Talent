import { School } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import FormInput from '../../components/FormInput';
import RegistrationHeader from '../../components/RegistrationHeader';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InstitutionForm() {
  const navigate = useNavigate();
  const { addUser } = useUser();

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
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.institutionName || !formData.website || !formData.contactPerson || !formData.email || !formData.password) {
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

    // Website validation
    try {
      new URL(formData.website);
    } catch {
      setError('Please enter a valid website URL');
      setLoading(false);
      return;
    }

    // Password length check
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending registration data:', formData);

      const response = await fetch(`${API_URL}/api/auth/register/institution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Institution registration successful! Please login.');
      setTimeout(() => navigate('/auth'), 3000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Server connection error. Is your backend running on port 5000?');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
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
        autoClose={3000} 
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      <div className="pt-16">
        <RegistrationHeader
          title="Institution Registration"
          subtitle="Transform your campus placements with our AI-powered recruitment platform."
          tagline="Complete setup in under 5 minutes"
          icon={<School className="w-10 h-10 text-white" />}
          color="blue"
          userType="institution"
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
              label="Institution Name" 
              value={formData.institutionName} 
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })} 
              required 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            
            <FormInput 
              label="Website" 
              type="url" 
              value={formData.website} 
              onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
              required 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            
            <FormInput 
              label="Contact Person" 
              value={formData.contactPerson} 
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} 
              required 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            
            <FormInput 
              type="email" 
              label="Email" 
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
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-400 dark:disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Institution'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}