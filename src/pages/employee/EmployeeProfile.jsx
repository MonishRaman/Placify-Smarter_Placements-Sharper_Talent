import React, { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({
    fullName: "",
    currentCompany: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    skills: "",
    department: "",
    workLocation: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
        if (res.data.profileImage) {
          setImagePreview(`${API_BASE}${res.data.profileImage}`);
        }
      } catch (err) {
        logger.error("Fetch profile error:", err);
        toast.error("Failed to load profile data");
      } finally {
        setTimeout(() => setIsLoaded(true), 150);
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
    try {
      const formData = new FormData();
      // Only editable fields for employee
      [
        "currentCompany",
        "jobTitle", 
        "phone", 
        "address", 
        "experience", 
        "skills", 
        "department", 
        "workLocation"
      ].forEach((key) =>
        formData.append(key, profile[key] || "")
      );
      
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }
      
      const response = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setProfile(response.data);
      if (response.data.profileImage) {
        setImagePreview(`${API_BASE}${response.data.profileImage}`);
      }
      toast.success("Employee profile updated successfully!");
      navigate("/dashboard/employee");
    } catch (err) {
      logger.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleFocus = (fieldName) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField(null);

  const fields = [
    { key: "fullName", label: "Full Name", editable: false },
    { key: "email", label: "Email", editable: false },
    { key: "currentCompany", label: "Current Company", editable: true },
    { key: "jobTitle", label: "Job Title", editable: true },
    { key: "department", label: "Department", editable: true },
    { key: "workLocation", label: "Work Location", editable: true },
    { key: "phone", label: "Phone", editable: true, type: "tel" },
    { key: "address", label: "Address", editable: true },
    { key: "experience", label: "Years of Experience", editable: true },
    { key: "skills", label: "Skills", editable: true, isTextarea: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div
          className={`w-full max-w-4xl bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-1000 ease-out ${
            isLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="w-12 h-12 text-green-600 mr-3" />
              <User className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Employee Profile
            </h2>
            <p className="text-gray-600 text-sm">
              Manage your professional information and career details
            </p>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8 relative group">
            <label
              htmlFor="profile-upload"
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden shadow-lg hover:scale-105 transition border-4 border-green-100"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="employee profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
            {imagePreview && (
              <button
                onClick={handleRemoveImage}
                className="mt-2 text-red-500 text-sm hover:underline"
              >
                Remove Photo
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ key, label, editable, type, isTextarea }, index) => (
              <div
                key={key}
                className={`transition-transform ${isTextarea ? 'md:col-span-2' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                  {!editable && <span className="text-gray-400 text-xs ml-2">(Read-only)</span>}
                </label>
                {isTextarea ? (
                  <textarea
                    name={key}
                    value={profile[key] || ""}
                    onChange={editable ? handleChange : undefined}
                    onFocus={() => editable && handleFocus(key)}
                    onBlur={handleBlur}
                    disabled={!editable}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none resize-none ${
                      focusedField === key
                        ? "border-green-500 shadow-lg ring-4 ring-green-500 ring-opacity-20 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    } ${!editable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={type || "text"}
                    name={key}
                    value={profile[key] || ""}
                    onChange={editable ? handleChange : undefined}
                    onFocus={() => editable && handleFocus(key)}
                    onBlur={handleBlur}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                      focusedField === key
                        ? "border-green-500 shadow-lg ring-4 ring-green-500 ring-opacity-20 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    } ${!editable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/dashboard/employee")}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Cancel
            </button>
            <button
              id="save-button"
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;