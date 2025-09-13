import React, { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Users,
  BookOpen,
  Bell,
  Link,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserPlus,
  GraduationCap,
  Building,
  TrendingUp,
  Award,
} from "lucide-react";

// Mock Data
const institutionStats = {
  name: "JNTUH College of Engineering",
  totalStudents: 1250,
  placedStudents: 890,
  placementRate: 71.2,
  averagePackage: 12.5,
  topPackage: 45,
};

const departmentSummary = [
  {
    dept: "CSE",
    total: 300,
    placed: 250,
    avgPackage: 14.2,
    topPackage: 45,
    companies: 25,
  },
  {
    dept: "CSM",
    total: 150,
    placed: 120,
    avgPackage: 12.5,
    topPackage: 38,
    companies: 15,
  },
  {
    dept: "ECE",
    total: 280,
    placed: 200,
    avgPackage: 10.4,
    topPackage: 28,
    companies: 18,
  },
  {
    dept: "EEE",
    total: 220,
    placed: 180,
    avgPackage: 9.5,
    topPackage: 20,
    companies: 12,
  },
  {
    dept: "IT",
    total: 300,
    placed: 240,
    avgPackage: 11.7,
    topPackage: 32,
    companies: 20,
  },
];

const internshipData = [
  { year: "2020", CSE: 35, CSM: 12, ECE: 8, EEE: 5, IT: 3 },
  { year: "2021", CSE: 28, CSM: 22, ECE: 6, EEE: 4, IT: 2 },
  { year: "2022", CSE: 82, CSM: 52, ECE: 68, EEE: 18, IT: 22 },
  { year: "2023", CSE: 168, CSM: 138, ECE: 145, EEE: 45, IT: 38 },
  { year: "2024", CSE: 122, CSM: 115, ECE: 18, EEE: 28, IT: 8 },
];

const mockUsers = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    role: "Admin",
    department: "CSE",
    status: "Active",
    lastLogin: "2024-08-05",
  },
  {
    id: 2,
    name: "Prof. Priya Sharma",
    email: "priya.sharma@college.edu",
    role: "TPO",
    department: "ECE",
    status: "Active",
    lastLogin: "2024-08-06",
  },
  {
    id: 3,
    name: "Dr. Anil Reddy",
    email: "anil.reddy@college.edu",
    role: "HOD",
    department: "IT",
    status: "Active",
    lastLogin: "2024-08-04",
  },
  {
    id: 4,
    name: "Ms. Kavita Singh",
    email: "kavita.singh@college.edu",
    role: "Faculty",
    department: "EEE",
    status: "Inactive",
    lastLogin: "2024-08-01",
  },
  {
    id: 5,
    name: "Mr. Suresh Babu",
    email: "suresh.babu@college.edu",
    role: "Faculty",
    department: "CSM",
    status: "Active",
    lastLogin: "2024-08-06",
  },
];

const mockCourses = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS301",
    department: "CSE",
    credits: 3,
    semester: "III",
    students: 85,
  },
  {
    id: 2,
    name: "Digital Signal Processing",
    code: "EC401",
    department: "ECE",
    credits: 4,
    semester: "IV",
    students: 72,
  },
  {
    id: 3,
    name: "Database Management",
    code: "IT302",
    department: "IT",
    credits: 3,
    semester: "III",
    students: 95,
  },
  {
    id: 4,
    name: "Power Systems",
    code: "EE501",
    department: "EEE",
    credits: 4,
    semester: "V",
    students: 68,
  },
  {
    id: 5,
    name: "Machine Learning",
    code: "CM401",
    department: "CSM",
    credits: 3,
    semester: "IV",
    students: 45,
  },
];

const InstitutionSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");

  // Form states
  const [institutionData, setInstitutionData] = useState({
    name: "JNTUH College of Engineering",
    address: "Hyderabad, Telangana, India",
    phone: "+91-40-23158661",
    email: "admin@jntuh.ac.in",
    website: "https://jntuh.ac.in",
    logo: null,
    description: "Premier engineering institution established in 1965",
    establishedYear: "1965",
    contactPerson: "Dr. Rajesh Kumar",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    placementUpdates: true,
    studentRegistrations: true,
    reportGeneration: false,
    systemMaintenance: true,
    emailConfig: {
      smtpServer: "smtp.gmail.com",
      smtpPort: "587",
      emailUsername: "noreply@college.edu",
      emailPassword: "",
    },
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    resumeParserApi: "",
    thirdPartyApiKey: "",
    smsGateway: "twilio",
    emailProvider: "smtp",
  });

  // Show notification
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    const bgColor =
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-0`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        ${
          type === "success"
            ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
            : type === "error"
            ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
            : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
        }
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX-full";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Save functions
  const saveInstitutionProfile = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification("Institution profile updated successfully!", "success");
    }, 1000);
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification("Notification settings saved successfully!", "success");
    }, 1000);
  };

  const saveIntegrationSettings = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification("Integration settings saved successfully!", "success");
    }, 1000);
  };

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesDept = filterDept === "all" || user.department === filterDept;
    return matchesSearch && matchesRole && matchesDept;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInstitutionData((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
      showNotification("Logo uploaded successfully!", "success");
    }
  };

  const tabs = [
    { id: "profile", label: "Institution Profile", icon: Building2 },
    { id: "users", label: "User Management", icon: Users },
    { id: "departments", label: "Departments & Courses", icon: BookOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Link },
  ];

  const renderInstitutionProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution Name
            </label>
            <input
              type="text"
              value={institutionData.name}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            <input
              type="number"
              value={institutionData.establishedYear}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  establishedYear: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={institutionData.contactPerson}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  contactPerson: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={institutionData.description}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={institutionData.email}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={institutionData.phone}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-1" />
              Website URL
            </label>
            <input
              type="url"
              value={institutionData.website}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  website: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Address
            </label>
            <input
              type="text"
              value={institutionData.address}
              onChange={(e) =>
                setInstitutionData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Institution Logo
        </h3>

        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {institutionData.logo ? (
              <img
                src={institutionData.logo}
                alt="Institution Logo"
                className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="logo-upload"
              className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 inline-flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Recommended: 200x200px, PNG or JPG
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveInstitutionProfile}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Total Users</p>
              <p className="text-lg font-bold text-gray-900">
                {mockUsers.length}
              </p>
            </div>
            <Users className="w-6 h-6 text-blue-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Active Users</p>
              <p className="text-lg font-bold text-green-600">
                {mockUsers.filter((u) => u.status === "Active").length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Admins</p>
              <p className="text-lg font-bold text-purple-600">
                {mockUsers.filter((u) => u.role === "Admin").length}
              </p>
            </div>
            <Settings className="w-6 h-6 text-purple-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Faculty</p>
              <p className="text-lg font-bold text-orange-600">
                {mockUsers.filter((u) => u.role === "Faculty").length}
              </p>
            </div>
            <GraduationCap className="w-6 h-6 text-orange-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              User Management
            </h3>
            <button className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 inline-flex items-center text-sm">
              <UserPlus className="w-4 h-4 mr-1" />
              Add User
            </button>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="TPO">TPO</option>
              <option value="HOD">HOD</option>
              <option value="Faculty">Faculty</option>
            </select>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0 text-sm"
            >
              <option value="all">All Departments</option>
              {departmentSummary.map((dept) => (
                <option key={dept.dept} value={dept.dept}>
                  {dept.dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Role
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Department
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[70px]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px]">
                    Last Login
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-3 py-3 whitespace-nowrap w-[180px]">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px]">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap w-[80px]">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "TPO"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "HOD"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[80px]">
                      {user.department}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap w-[70px]">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 w-[90px]">
                      {user.lastLogin}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium w-[80px]">
                      <div className="flex space-x-1">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="w-full">
      {/* Department Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 ">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Total Students</p>
              <p className="text-lg font-bold text-gray-900">
                {institutionStats.totalStudents}
              </p>
            </div>
            <Users className="w-6 h-6 text-blue-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Placed Students</p>
              <p className="text-lg font-bold text-green-600">
                {institutionStats.placedStudents}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Placement Rate</p>
              <p className="text-lg font-bold text-purple-600">
                {institutionStats.placementRate}%
              </p>
            </div>
            <Award className="w-6 h-6 text-purple-500 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Avg Package</p>
              <p className="text-lg font-bold text-orange-600">
                ₹{institutionStats.averagePackage}L
              </p>
            </div>
            <Building className="w-6 h-6 text-orange-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Department Summary */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Department Overview
            </h3>
            <button className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 inline-flex items-center text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Department
            </button>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                    Department
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px]">
                    Students
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[70px]">
                    Placed
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Rate
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px]">
                    Avg Pkg
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px]">
                    Top Pkg
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Companies
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentSummary.map((dept) => (
                  <tr
                    key={dept.dept}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-3 py-3 whitespace-nowrap w-[140px]">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-xs">
                            {dept.dept}
                          </span>
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {dept.dept}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[90px]">
                      {dept.total}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-green-600 font-medium w-[70px]">
                      {dept.placed}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap w-[100px]">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2 w-8">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{
                              width: `${(dept.placed / dept.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-900">
                          {Math.round((dept.placed / dept.total) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[90px]">
                      ₹{dept.avgPackage}L
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-purple-600 w-[90px]">
                      ₹{dept.topPackage}L
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[80px]">
                      {dept.companies}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium w-[80px]">
                      <div className="flex space-x-1">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Management
            </h3>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Credits
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Semester
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Students
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                        {course.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {course.code}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.credits}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.semester}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.students}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Internship Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Internship Overview
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Track internship data across departments and years
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Year
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      CSE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      CSM
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      ECE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      EEE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      IT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {internshipData.map((year) => {
                    const total =
                      year.CSE + year.CSM + year.ECE + year.EEE + year.IT;
                    return (
                      <tr
                        key={year.year}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                          {year.year}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {year.CSE}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {year.CSM}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {year.ECE}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {year.EEE}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {year.IT}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                          {total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Email Notifications
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  emailNotifications: !prev.emailNotifications,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.emailNotifications
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.emailNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                SMS Notifications
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications via SMS
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  smsNotifications: !prev.smsNotifications,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.smsNotifications
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.smsNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Placement Updates
              </h4>
              <p className="text-sm text-gray-500">
                Get notified about placement activities
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  placementUpdates: !prev.placementUpdates,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.placementUpdates
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.placementUpdates
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Student Registrations
              </h4>
              <p className="text-sm text-gray-500">
                Notifications for new student registrations
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  studentRegistrations: !prev.studentRegistrations,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.studentRegistrations
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.studentRegistrations
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Report Generation
              </h4>
              <p className="text-sm text-gray-500">
                Notifications when reports are ready
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  reportGeneration: !prev.reportGeneration,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.reportGeneration
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.reportGeneration
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                System Maintenance
              </h4>
              <p className="text-sm text-gray-500">
                Alerts about system updates and maintenance
              </p>
            </div>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  systemMaintenance: !prev.systemMaintenance,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.systemMaintenance
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.systemMaintenance
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Email Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              value={notificationSettings.emailConfig.smtpServer}
              onChange={(e) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  emailConfig: {
                    ...prev.emailConfig,
                    smtpServer: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={notificationSettings.emailConfig.smtpPort}
              onChange={(e) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  emailConfig: {
                    ...prev.emailConfig,
                    smtpPort: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="587"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Username
            </label>
            <input
              type="email"
              value={notificationSettings.emailConfig.emailUsername}
              onChange={(e) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  emailConfig: {
                    ...prev.emailConfig,
                    emailUsername: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="noreply@college.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={notificationSettings.emailConfig.emailPassword}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    emailConfig: {
                      ...prev.emailConfig,
                      emailPassword: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveNotificationSettings}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Third-Party Integrations
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Parser API Key
            </label>
            <input
              type="text"
              value={integrationSettings.resumeParserApi}
              onChange={(e) =>
                setIntegrationSettings((prev) => ({
                  ...prev,
                  resumeParserApi: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter API key for resume parsing service"
            />
            <p className="text-sm text-gray-500 mt-1">
              Used for automatic resume parsing and data extraction
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Third-Party API Key
            </label>
            <input
              type="text"
              value={integrationSettings.thirdPartyApiKey}
              onChange={(e) =>
                setIntegrationSettings((prev) => ({
                  ...prev,
                  thirdPartyApiKey: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter general third-party API key"
            />
            <p className="text-sm text-gray-500 mt-1">
              General API key for third-party service integrations
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Gateway Provider
            </label>
            <select
              value={integrationSettings.smsGateway}
              onChange={(e) =>
                setIntegrationSettings((prev) => ({
                  ...prev,
                  smsGateway: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="twilio">Twilio</option>
              <option value="aws-sns">AWS SNS</option>
              <option value="nexmo">Nexmo (Vonage)</option>
              <option value="textlocal">TextLocal</option>
              <option value="msg91">MSG91</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Choose your preferred SMS gateway provider
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Provider
            </label>
            <select
              value={integrationSettings.emailProvider}
              onChange={(e) =>
                setIntegrationSettings((prev) => ({
                  ...prev,
                  emailProvider: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="smtp">Custom SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="aws-ses">AWS SES</option>
              <option value="gmail">Gmail SMTP</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Select your email service provider
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Status
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Service
                </h4>
                <p className="text-sm text-gray-500">
                  Connected and operational
                </p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  SMS Gateway
                </h4>
                <p className="text-sm text-gray-500">Configuration pending</p>
              </div>
            </div>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Resume Parser
                </h4>
                <p className="text-sm text-gray-500">API key required</p>
              </div>
            </div>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-500">Data sync in progress</p>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveIntegrationSettings}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Integration Settings"}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderInstitutionProfile();
      case "users":
        return renderUserManagement();
      case "departments":
        return renderDepartments();
      case "notifications":
        return renderNotifications();
      case "integrations":
        return renderIntegrations();
      default:
        return renderInstitutionProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col gap-4">
          {/* Sidebar */}
          <div className="w-full flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-2">
              <nav className="space-y-1 flex justify-center items-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="w-full max-w-full">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionSettings;
