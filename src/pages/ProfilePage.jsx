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
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ring-4 ring-white dark:ring-gray-800 border-2 border-white/50 dark:border-gray-700/50`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User className={`${size === 'xlarge' ? 'w-16 h-16' : size === 'large' ? 'w-12 h-12' : size === 'medium' ? 'w-8 h-8' : 'w-6 h-6'} text-white drop-shadow-sm`} />
        )}
        {editable && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Camera className="w-6 h-6 text-white drop-shadow-lg" />
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
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 drop-shadow-sm">{fullName}</h2>
    <p className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm border border-blue-200 dark:border-blue-800">{role}</p>
  </div>
);

export const UniversityInfo = ({ university, major, className = "" }) => (
  <div className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50 ${className}`}>
    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
      <GraduationCap className="w-6 h-6 text-white drop-shadow-sm" />
    </div>
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{university}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{major}</p>
    </div>
  </div>
);

export const ContactInfo = ({ email, phone, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
        <Mail className="w-5 h-5 text-white drop-shadow-sm" />
      </div>
      <p className="text-gray-700 dark:text-gray-300 font-medium text-sm break-all">{email}</p>
    </div>
    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-lg flex items-center justify-center shadow-lg">
        <Phone className="w-5 h-5 text-white drop-shadow-sm" />
      </div>
      <p className="text-gray-700 dark:text-gray-300 font-medium">{phone}</p>
    </div>
  </div>
);

export const ProfileCard = ({ children, className = "" }) => (
  <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] ${className}`}>
    {children}
  </div>
);

const FormField = ({ label, name, value, type = "text", editable = true, icon: Icon, onChange, onFocus, onBlur, focusedField, isDark }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
      {Icon && (
        <div className="w-5 h-5 flex items-center justify-center p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </div>
      )}
      <span className="capitalize">{label === "dob" ? "Date of Birth" : label.replace(/([A-Z])/g, ' $1').trim()}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={editable ? onChange : undefined}
      onFocus={() => editable && onFocus && onFocus(name)}
      onBlur={onBlur}
      disabled={!editable}
      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm ${
        focusedField === name
          ? "border-blue-500 dark:border-blue-400 shadow-2xl ring-4 ring-blue-500/20 dark:ring-blue-400/20 scale-[1.02] bg-white dark:bg-gray-700"
          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-lg"
      } ${
        !editable 
          ? "bg-gray-100/80 dark:bg-gray-700/50 cursor-not-allowed text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600" 
          : "bg-gray-50/80 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700"
      } placeholder-gray-400 dark:placeholder-gray-500`}
      placeholder={`Enter your ${label.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      console.log("Profile saved:", profile);
    }, 1500);
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
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-10 -right-10 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          isDark ? "bg-purple-900/10" : "bg-purple-200/30"
        }`}></div>
        <div className={`absolute top-1/2 -left-10 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 ${
          isDark ? "bg-blue-900/10" : "bg-blue-200/30"
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl transition-all duration-1000 ${
          isDark ? "bg-indigo-900/10" : "bg-indigo-200/30"
        }`}></div>
      </div>

      {/* Enhanced Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        >
          <div className="relative overflow-hidden w-6 h-6">
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-500 transform transition-transform duration-300 group-hover:rotate-12" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700 transform transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </div>
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div
          className={`w-full max-w-7xl transform transition-all duration-1000 ease-out ${
            isLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Enhanced Profile Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Profile Card */}
              <ProfileCard className="text-center">
                <div className="flex flex-col items-center space-y-6">
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
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Education</span>
                </h3>
                <UniversityInfo university={profile.university} major={profile.major} />
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">{profile.education}</span>
                  </div>
                </div>
              </ProfileCard>

              {/* Contact Info */}
              <ProfileCard>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Contact Information</span>
                </h3>
                <ContactInfo email={profile.email} phone={profile.phone} />
              </ProfileCard>
            </div>

            {/* Enhanced Main Form */}
            <div className="xl:col-span-2">
              <ProfileCard>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
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
                      className="transition-all duration-300 hover:scale-[1.01]"
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

                {/* Enhanced Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px] justify-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
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