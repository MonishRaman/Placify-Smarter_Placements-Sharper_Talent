import { Briefcase } from 'lucide-react';
import { useState } from 'react';
import FormInput from '../../components/FormInput';

export default function EmployeeForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    currentCompany: '',
    jobTitle: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee Registration Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="text-green-600 h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">Employee Registration</h1>
      </div>
      
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
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          Register as Employee
        </button>
      </form>
    </div>
  );
}