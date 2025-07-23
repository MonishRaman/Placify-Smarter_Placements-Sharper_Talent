// src/pages/register/StudentForm.jsx
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import FormInput from '../../components/FormInput';

export default function StudentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    major: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Student Registration Data:', formData);
    // Add form validation here
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="text-purple-600 h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">Student Registration</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          required
        />
        
        <FormInput
          label="University Name"
          value={formData.university}
          onChange={(e) => setFormData({...formData, university: e.target.value})}
          required
        />
        
        <FormInput
          label="Major/Field of Study"
          value={formData.major}
          onChange={(e) => setFormData({...formData, major: e.target.value})}
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
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
        >
          Register as Student
        </button>
      </form>
    </div>
  );
}