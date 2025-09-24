import React, { useState, useEffect } from "react";
import axios from "axios";
import { Building2, Briefcase, Mail, Phone, Calendar, Users, Globe, Save, Camera, X, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Reusable UI Components
const ProfileCard = ({ children, className = "" }) => (
  <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] ${className}`}>
    {children}
  </div>
);

const CompanyAvatar = ({ imageUrl, companyName, editable = false, onChange }) => (
  <div className="relative group">
    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ring-4 ring-white dark:ring-gray-800 border-2 border-white/50 dark:border-gray-700/50">
      {imageUrl ? (
        <img src={imageUrl} alt={companyName} className="w-full h-full object-cover rounded-full" />
      ) : (
        <Building2 className="w-16 h-16 text-white drop-shadow-sm" />
      )}
      {editable && (
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Camera className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      )}
      {editable && (
        <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      )}
    </div>
  </div>
);

const FormField = ({ label, name, value, type = "text", editable = true, icon: Icon, onChange, onFocus, onBlur, focusedField, isTextarea = false }) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {Icon && (
          <div className="w-5 h-5 flex items-center justify-center p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </div>
        )}
        <span>{label}</span>
      </label>
      <InputComponent
        type={type}
        name={name}
        value={value || ""}
        onChange={editable ? onChange : undefined}
        onFocus={() => editable && onFocus && onFocus(name)}
        onBlur={onBlur}
        disabled={!editable}
        rows={isTextarea ? 4 : undefined}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm ${isTextarea ? 'resize-none' : ''} ${
          focusedField === name
            ? "border-orange-500 dark:border-orange-400 shadow-2xl ring-4 ring-orange-500/20 dark:ring-orange-400/20 scale-[1.02] bg-white dark:bg-gray-700"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-lg"
        } ${
          !editable 
            ? "bg-gray-100/80 dark:bg-gray-700/50 cursor-not-allowed text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600" 
            : "bg-gray-50/80 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700"
        } placeholder-gray-400 dark:placeholder-gray-500`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};


const CompanyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    foundedYear: "",
    employeeCount: "",
    profileImage: "",
  });
  
  const [initialProfile, setInitialProfile] = useState(null); // To track changes
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setInitialProfile(res.data); // Store initial state
        if (res.data.profileImage) {
          setImagePreview(`${API_BASE}${res.data.profileImage}`);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load profile data");
      } finally {
        setTimeout(() => setIsLoaded(true), 300);
      }
    };
    fetchProfile();
  }, [navigate, token]);

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
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (profile[key] !== null && profile[key] !== undefined) {
          formData.append(key, profile[key]);
        }
      });

      if (imageFile) {
        formData.append("profileImage", imageFile);
      } else if (profile.profileImage === "") {
        formData.append("profileImage", "");
      }

      const response = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data);
      setInitialProfile(response.data); // Update initial state after successful save
      setImageFile(null); // Reset image file after upload
      if (response.data.profileImage) {
        setImagePreview(`${API_BASE}${response.data.profileImage}`);
      }
      
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
                  Your company profile is now up-to-date.
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

    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { key: "name", label: "Company Name", editable: false, icon: Building2 },
    { key: "email", label: "HR Contact Email", editable: false, icon: Mail },
    { key: "industry", label: "Industry", editable: true, icon: Briefcase },
    { key: "website", label: "Website", editable: true, type: "url", icon: Globe },
    { key: "phone", label: "Phone", editable: true, type: "tel", icon: Phone },
    { key: "foundedYear", label: "Founded Year", editable: true, type: "number", icon: Calendar },
    { key: "employeeCount", label: "Employee Count", editable: true, type: "number", icon: Users },
    { key: "address", label: "Address", editable: true, icon: Globe },
    { key: "description", label: "Company Description", editable: true, isTextarea: true, icon: Info, className: "md:col-span-2" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-all duration-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-red-200/30 dark:bg-red-900/10 blur-3xl transition-all duration-1000"></div>
        <div className="absolute top-1/2 -left-10 w-80 h-80 rounded-full bg-orange-200/30 dark:bg-orange-900/10 blur-3xl transition-all duration-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-yellow-200/30 dark:bg-yellow-900/10 blur-3xl transition-all duration-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div className={`w-full max-w-7xl transform transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"}`}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <ProfileCard className="text-center">
                <div className="flex flex-col items-center space-y-6">
                  <CompanyAvatar imageUrl={imagePreview} companyName={profile.name} editable={true} onChange={handleImageChange} />
                  {imagePreview && (
                    <button onClick={handleRemoveImage} className="flex items-center space-x-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30">
                      <X className="w-4 h-4" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 drop-shadow-sm">{profile.name}</h2>
                    <p className="text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full text-sm border border-orange-200 dark:border-orange-800">{profile.industry}</p>
                  </div>
                </div>
              </ProfileCard>

              <ProfileCard>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3"><Mail className="w-4 h-4 text-gray-500" /><span className="text-gray-700 dark:text-gray-300 font-medium text-sm break-all">{profile.email}</span></div>
                  <div className="flex items-center space-x-3"><Phone className="w-4 h-4 text-gray-500" /><span className="text-gray-700 dark:text-gray-300 font-medium">{profile.phone}</span></div>
                  <div className="flex items-center space-x-3"><Globe className="w-4 h-4 text-gray-500" /><a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm break-all">{profile.website}</a></div>
                </div>
              </ProfileCard>
            </div>

            {/* Main Form */}
            <div className="xl:col-span-2">
              <ProfileCard>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Company Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Update your company information and preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {fields.map(({ key, label, editable, type, icon, isTextarea, className }, index) => (
                    <div key={key} className={`transition-all duration-300 hover:scale-[1.01] ${className}`} style={{ transitionDelay: `${index * 50}ms` }}>
                      <FormField
                        label={label}
                        name={key}
                        value={profile[key]}
                        type={type}
                        editable={editable}
                        icon={icon}
                        isTextarea={isTextarea}
                        onChange={handleChange}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                        focusedField={focusedField}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                   <button onClick={() => navigate("/dashboard/company")} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px] justify-center">
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

export default CompanyProfile;