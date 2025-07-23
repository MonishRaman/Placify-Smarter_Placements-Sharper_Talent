
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import FormInput from '../../components/FormInput';

export default function CompanyForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    hrEmail: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Company Registration Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="text-orange-600 h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">Company Registration</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          required
        />
        
        <FormInput
          label="Industry"
          value={formData.industry}
          onChange={(e) => setFormData({...formData, industry: e.target.value})}
          required
        />
        
        <FormInput
          type="email"
          label="HR Contact Email"
          value={formData.hrEmail}
          onChange={(e) => setFormData({...formData, hrEmail: e.target.value})}
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
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200"
        >
          Register Company
        </button>
      </form>
    </div>
  );
}