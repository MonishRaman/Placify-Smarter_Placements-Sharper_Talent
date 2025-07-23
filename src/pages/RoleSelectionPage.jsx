import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, Briefcase, Building } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    { 
      title: 'Student',
      icon: <GraduationCap className="w-8 h-8" />,
      route: '/register/student'
    },
    {
      title: 'Institution',
      icon: <School className="w-8 h-8" />,
      route: '/register/institution'
    },
    {
      title: 'Employee',
      icon: <Briefcase className="w-8 h-8" />,
      route: '/register/employee'
    },
    {
      title: 'Company',
      icon: <Building className="w-8 h-8" />,
      route: '/register/company'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.title}
              onClick={() => navigate(role.route)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            >
              <div className="p-3 bg-purple-100 rounded-full mb-4 text-purple-600">
                {role.icon}
              </div>
              <h2 className="text-xl font-semibold">{role.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;