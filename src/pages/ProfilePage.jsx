import React, { useState, useEffect } from "react";
import { User, Camera, X, Save, Moon, Sun, Mail, Phone, MapPin, GraduationCap, Calendar, Briefcase } from "lucide-react";

// Mock data for demonstration (replace with your actual API calls)
export const mockProfile = {
  fullName: "John Smith",
  email: "john.smith@university.edu",
  phone: "+1 (555) 123-4567",
  dob: "1998-06-15",
  address: "123 University Ave, College Town, CT 06810",
  education: "Bachelor's Degree",
  gender: "Male",
  role: "Student",
  university: "Stanford University",
  major: "Computer Science",
  profileImage: "",
};

// Reusable Components for Export
export const UserAvatar = ({ imageUrl, fullName, size = "large", editable = false, onChange }) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-16 h-16", 
    large: "w-28 h-28",
    xlarge: "w-36 h-36"
  };

  return (
    <div className="relative group">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 ring-4 ring-white dark:ring-gray-800`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User className={`${size === 'large' ? 'w-12 h-12' : size === 'medium' ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
        )}
        {editable && (
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
        {editable && (
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export const UserName = ({ fullName, role, className = "" }) => (
  <div className={`text-center ${className}`}>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{fullName}</h2>
    <p className="text-blue-600 dark:text-blue-400 font-medium">{role}</p>
  </div>
);

export const UniversityInfo = ({ university, major, className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
      <GraduationCap className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{university}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{major}</p>
    </div>
  </div>
);

export const ContactInfo = ({ email, phone, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <p className="text-gray-700 dark:text-gray-300">{email}</p>
    </div>
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
        <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <p className="text-gray-700 dark:text-gray-300">{phone}</p>
    </div>
  </div>
);

export const ProfileCard = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const FormField = ({ label, name, value, type = "text", editable = true, icon: Icon, onChange, onFocus, onBlur, focusedField, isDark }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      {Icon && (
        <div className="w-4 h-4 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="capitalize">{label === "dob" ? "Date of Birth" : label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={editable ? onChange : undefined}
      onFocus={() => editable && onFocus && onFocus(name)}
      onBlur={onBlur}
      disabled={!editable}
      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
        focusedField === name
          ? "border-blue-500 dark:border-blue-400 shadow-lg ring-4 ring-blue-500 ring-opacity-20 dark:ring-blue-400 dark:ring-opacity-20 scale-[1.02]"
          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
      } ${
        !editable 
          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400" 
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      }`}
      placeholder={`Enter your ${label}`}
    />
  </div>
);

const ProfilePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    
    // Simulate loading delay
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setProfile({ ...profile, profileImage: "" });
  };

  const handleSave = async () => {
    // Your save logic here
    console.log("Saving profile:", profile);
  };

  const fields = [
    { key: "fullName", editable: false, icon: User },
    { key: "name", editable: true, icon: User },
    { key: "email", editable: false, type: "email", icon: Mail },
    { key: "phone", editable: true, type: "tel", icon: Phone },
    { key: "dob", editable: true, type: "date", icon: Calendar },
    { key: "address", editable: true, icon: MapPin },
    { key: "education", editable: true, icon: GraduationCap },
    { key: "gender", editable: true },
    { key: "role", editable: false, icon: Briefcase },
    { key: "university", editable: true, icon: GraduationCap },
    { key: "major", editable: true, icon: GraduationCap },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all duration-300"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div
          className={`w-full max-w-6xl transform transition-all duration-1000 ease-out ${
            isLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <ProfileCard className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <UserAvatar
                    imageUrl={imagePreview}
                    fullName={profile.fullName}
                    size="xlarge"
                    editable={true}
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <button
                      onClick={handleRemoveImage}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Remove Picture</span>
                    </button>
                  )}
                  <UserName fullName={profile.fullName} role={profile.role} />
                </div>
              </ProfileCard>

              {/* University Info */}
              <ProfileCard>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
                <UniversityInfo university={profile.university} major={profile.major} />
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{profile.education}</span>
                  </div>
                </div>
              </ProfileCard>

              {/* Contact Info */}
              <ProfileCard>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
                <ContactInfo email={profile.email} phone={profile.phone} />
              </ProfileCard>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <ProfileCard>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Profile Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Update your profile information and preferences
                    </p>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {fields.map(({ key, editable, type = "text", icon }, index) => (
                    <div
                      key={key}
                      className="transition-all duration-300"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <FormField
                        label={key}
                        name={key}
                        value={profile[key]}
                        type={type}
                        editable={editable}
                        icon={icon}
                        onChange={handleChange}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                        focusedField={focusedField}
                        isDark={isDark}
                      />
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </ProfileCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;