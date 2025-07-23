// src/pages/register/InstitutionForm.jsx
import { School } from 'lucide-react';
import { useState } from 'react';
import FormInput from '../../components/FormInput';

export default function InstitutionForm() {
  const [formData, setFormData] = useState({
    institutionName: '',
    website: '',
    contactPerson: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Institution Registration Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <School className="text-blue-600 h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">Institution Registration</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Institution Name"
          value={formData.institutionName}
          onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
          required
        />
        
        <FormInput
          label="Website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
          required
        />
        
        <FormInput
          label="Contact Person"
          value={formData.contactPerson}
          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Register Institution
        </button>
      </form>
    </div>
  );
}