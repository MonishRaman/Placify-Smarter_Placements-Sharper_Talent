// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { User } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "janedoe@example.com",
    phone: "+91 9876543210",
    dob: "1995-07-15",
    address: "123, MG Road, Hyderabad",
    education: "B.Tech in Computer Science",
    gender: "Female",
  });

  const [image, setImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Load profile and image from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setImage(storedImage);
    }

    // Trigger animation after component mounts
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Handle profile input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImage(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile to localStorage
  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Create success animation
    const button = document.getElementById('save-button');
    button.style.transform = 'scale(0.95)';
    button.style.background = '#10b981';
    button.innerHTML = '✅ Saved!';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      button.style.background = '';
      button.innerHTML = 'Save Changes';
        
    }, 1500);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <>
      <Navbar />
       {/* Top redirect button */}
    {/* <div className="flex justify-start px-6 pt-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-md transition-all duration-300"
      >
        Go to Dashboard
      </button>
    </div> */}
      
      {/* Animated gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        {/* Floating orbs for background animation */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-pink-300 bg-opacity-20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300 bg-opacity-15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Main content container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
          <div 
            className={`w-full max-w-2xl bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-1000 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
            }`}
          >
            {/* Header with logo */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">User Profile</h2>
              <p className="text-gray-600 text-sm">Update your profile information</p>
            </div>

            {/* Profile image section */}
          
<div className="flex flex-col items-center mb-6 relative group">
  <label
    htmlFor="profile-upload"
    className={`w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm cursor-pointer relative overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isLoaded ? 'animate-bounce' : ''
    }`}
    style={{ animationDuration: '2s', animationIterationCount: '1' }}
  >
    {image ? (
      <img
        src={image}
        alt="user"
        className="w-full h-full object-cover rounded-full transition-all duration-300"
      />
    ) : (
      <User className="w-10 h-10 text-gray-500" />
    )}

    <input
      type="file"
      accept="image/*"
      id="profile-upload"
      onChange={handleImageChange}
      className="hidden"
    />

    {image && (
      <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
        <button
          onClick={(e) => {
            e.preventDefault();
            const action = window.confirm("Do you want to remove your profile picture?");
            if (action) {
              setImage(null);
              localStorage.removeItem("profileImage");
            }
          }}
          className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    )}
  </label>

  {image && (
    <label
      htmlFor="profile-upload"
      className="mt-2 text-purple-600 text-sm cursor-pointer hover:underline transition-colors duration-300"
    >
      Change Profile Picture
    </label>
  )}
</div>


            {/* Profile form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(profile).map(([key, value], index) => (
                <div 
                  key={key}
                  className={`transform transition-all duration-500 ease-out ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{transitionDelay: `${index * 100}ms`}}
                >
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                    {key === 'dob' ? 'Date of Birth' : key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className="relative">
                    <input
                      type={key === "dob" ? "date" : key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      onFocus={() => handleFocus(key)}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none bg-white bg-opacity-80 backdrop-blur-sm ${
                        focusedField === key
                          ? 'border-purple-500 shadow-lg ring-4 ring-purple-500 ring-opacity-20 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder={`Enter your ${key}`}
                    />
                    {focusedField === key && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 pointer-events-none animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <div 
              className={`mt-6 flex justify-center transform transition-all duration-700 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{transitionDelay: '800ms'}}
            >
              <button
                id="save-button"
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Save Changes
              </button>
            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;