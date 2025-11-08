import React, { useState, useEffect } from "react";
import { Award, User, Camera, X, Save, Mail, Phone, MapPin, GraduationCap, Calendar, Briefcase, Edit3, Check, AlertTriangle, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
// Mock data for demonstration (replace with your actual API calls)
export const mockProfile = {
  fullName: "John Smith",
  email: "john.smith@university.edu",
  phone: "+1 (555) 123-4567",
  dob: "1998-06-15",
  address: "123 University Ave, College Town, CT 06810",
  education: "Bachelor's Degree",
  gender: "Male",
  university: "Stanford University",
  major: "Computer Science",
  profileImage: "",
  skills: ["React", "Node.js", "JavaScript", "Python", "Tailwind CSS", "MongoDB"],
};

// Enhanced UserAvatar Component
export const UserAvatar = ({ imageUrl, fullName, size = "large", editable = false, onChange }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
    xlarge: "w-40 h-40"
  };

  return (
    <div className="relative group">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-500 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 hover:scale-105 transition-all duration-500 ring-4 ring-white/50 dark:ring-gray-800/50 border-4 border-white/80 dark:border-gray-700/80`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User className={`${size === 'xlarge' ? 'w-20 h-20' : size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-10 h-10' : 'w-8 h-8'} text-white drop-shadow-lg`} />
        )}
        {editable && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Camera className="w-8 h-8 text-white drop-shadow-lg" />
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
      {editable && (
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
          <Edit3 className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

// Enhanced UserName Component
export const UserName = ({ fullName, className = "" }) => (
  <div className={`text-center ${className}`}>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-sm bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
      {fullName}
    </h2>
    <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 rounded-full mx-auto"></div>
  </div>
);

// Enhanced UniversityInfo Component
export const UniversityInfo = ({ university, major, className = "" }) => (
  <div className={`relative overflow-hidden p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm ${className}`}>
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-transparent dark:from-emerald-600/20 rounded-full -translate-y-12 translate-x-12"></div>
    <div className="relative flex items-center space-x-4">
      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
        <GraduationCap className="w-7 h-7 text-white drop-shadow-sm" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg text-gray-900 dark:text-white">{university}</p>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{major}</p>
      </div>
    </div>
  </div>
);

// Enhanced ContactInfo Component
export const ContactInfo = ({ email, phone, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/30 dark:via-sky-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-transparent dark:from-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="relative flex items-center space-x-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Mail className="w-5 h-5 text-white drop-shadow-sm" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-medium text-sm break-all flex-1">{email}</p>
      </div>
    </div>
    
    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-2xl border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/20 to-transparent dark:from-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="relative flex items-center space-x-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Phone className="w-5 h-5 text-white drop-shadow-sm" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-medium flex-1">{phone}</p>
      </div>
    </div>
  </div>
);

// Enhanced ProfileCard Component
export const ProfileCard = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 hover:scale-[1.02] group ${className}`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Enhanced FormField Component
const FormField = ({ label, name, value, type = "text", editable = true, icon: Icon, onChange, onFocus, onBlur, focusedField, isTextarea = false }) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 text-sm font-bold text-gray-700 dark:text-gray-300">
        {Icon && (
          <div className="w-6 h-6 flex items-center justify-center p-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm">
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
        <span className="capitalize font-semibold">
          {label === "dob" ? "Date of Birth" : label.replace(/([A-Z])/g, ' $1').trim()}
        </span>
      </label>
      <div className="relative">
        <InputComponent
          type={type}
          name={name}
          value={value || ""}
          onChange={editable ? onChange : undefined}
          onFocus={() => editable && onFocus && onFocus(name)}
          onBlur={onBlur}
          disabled={!editable}
          rows={isTextarea ? 4 : undefined}
          className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm text-base font-medium ${isTextarea ? 'resize-none' : ''} ${
            focusedField === name
              ? "border-purple-500 dark:border-purple-400 shadow-2xl shadow-purple-500/20 dark:shadow-purple-400/20 ring-4 ring-purple-500/10 dark:ring-purple-400/10 scale-[1.02] bg-white dark:bg-gray-700"
              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-lg hover:shadow-xl"
          } ${
            !editable 
              ? "bg-gray-100/80 dark:bg-gray-700/50 cursor-not-allowed text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600" 
              : "bg-gray-50/80 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700"
          } placeholder-gray-400 dark:placeholder-gray-500`}
          placeholder={`Enter your ${label.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
        />
        {!editable && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced SkillsInput Component
const SkillsInput = ({ skills, setProfile }) => {
  const [currentSkill, setCurrentSkill] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && currentSkill.trim() !== "") {
      e.preventDefault();
      setIsAdding(true);
      setTimeout(() => {
        const newSkills = [...skills, currentSkill.trim()];
        setProfile(prev => ({ ...prev, skills: newSkills }));
        setCurrentSkill("");
        setIsAdding(false);
      }, 200);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setProfile(prev => ({ ...prev, skills: newSkills }));
  };

  const skillColors = [
    "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
    "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 text-sm font-bold text-gray-700 dark:text-gray-300">
        <div className="w-6 h-6 flex items-center justify-center p-1 bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900/50 dark:to-orange-900/50 rounded-lg shadow-sm">
          <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <span className="font-semibold">Skills & Technologies</span>
      </label>
      <div className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm min-h-[120px] transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105 hover:shadow-md ${skillColors[index % skillColors.length]}`}
            >
              <span>{skill}</span>
              <button 
                onClick={() => handleRemoveSkill(skill)} 
                className="hover:scale-110 transition-transform duration-200 hover:text-red-500 dark:hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {isAdding && (
            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          )}
        </div>
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium"
          placeholder={skills.length > 0 ? "Press Enter to add another skill..." : "Type a skill and press Enter..."}
        />
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { isDark } = useTheme(); // Use global theme context
  const [profile, setProfile] = useState(mockProfile);
  const [initialProfile, setInitialProfile] = useState(null); // To track changes
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading delay with staggered animation
    setInitialProfile(mockProfile); // Store initial state
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

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
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    const imageChanged = imageFile !== null;

    if (!profileChanged && !imageChanged) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:ring-slate-700`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertTriangle className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  No Changes
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  There's nothing new to save.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              OK
            </button>
          </div>
        </div>
      ));
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setProfile(profile);
      setInitialProfile(profile); // Update initial state after successful save
      setImageFile(null); // Reset image file after upload
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:ring-slate-700`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  Successfully Updated!
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Your profile is now up-to-date.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Close
            </button>
          </div>
        </div>
      ));

      setIsSaving(false);
      logger.debug("Profile saved:", profile);
    }, 2000);
  };

  const fields = [
    { key: "fullName", editable: false, icon: User },
    { key: "email", editable: false, type: "email", icon: Mail },
    { key: "phone", editable: true, type: "tel", icon: Phone },
    { key: "dob", editable: true, type: "date", icon: Calendar },
    { key: "address", editable: true, icon: MapPin },
    { key: "education", editable: true, icon: GraduationCap },
    { key: "gender", editable: true },
    { key: "university", editable: true, icon: GraduationCap },
    { key: "major", editable: true, icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 dark:from-purple-800/20 dark:to-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6 py-12">
        <div
          className={`w-full max-w-7xl transform transition-all duration-1000 ease-out ${
            isLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-20 opacity-0 scale-95"
          }`}
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Enhanced Profile Sidebar */}
            <div className="xl:col-span-1 space-y-8">
              {/* Profile Card */}
              <ProfileCard className="text-center">
                <div className="flex flex-col items-center space-y-8">
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
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold transition-all duration-300 bg-red-50 dark:bg-red-900/30 px-6 py-3 rounded-2xl border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <X className="w-5 h-5" />
                      <span>Remove Picture</span>
                    </button>
                  )}
                  <UserName fullName={profile.fullName} />
                </div>
              </ProfileCard>

              {/* University Info */}
              <ProfileCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span>Education</span>
                </h3>
                <UniversityInfo university={profile.university} major={profile.major} />
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-semibold text-base">{profile.education}</span>
                  </div>
                </div>
              </ProfileCard>

              {/* Contact Info */}
              <ProfileCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span>Contact Information</span>
                </h3>
                <ContactInfo email={profile.email} phone={profile.phone} />
              </ProfileCard>
            </div>

            {/* Enhanced Main Form */}
            <div className="xl:col-span-2">
              <ProfileCard>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      Profile Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Update your profile information and preferences
                    </p>
                    <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 rounded-full mt-3"></div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {fields.map(({ key, editable, type = "text", icon }, index) => (
                    <div
                      key={key}
                      className="transition-all duration-500 hover:scale-[1.02]"
                      style={{ transitionDelay: `${index * 100}ms` }}
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
                      />
                    </div>
                  ))}
                  {/* Skills Input Added Here */}
                  <div className="md:col-span-2 transition-all duration-500 hover:scale-[1.01]">
                    <SkillsInput skills={profile.skills} setProfile={setProfile} />
                  </div>
                </div>

                {/* Enhanced Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-500 dark:via-blue-500 dark:to-indigo-500 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[180px] justify-center text-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
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