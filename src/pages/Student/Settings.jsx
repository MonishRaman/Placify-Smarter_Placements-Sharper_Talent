import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Bell, BellOff, Trash2, LogOut, Camera, Save, Edit, X } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editedProfile, setEditedProfile] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { user, setIsAuthenticated } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/auth/profile');
        setProfile(response.data);
        setEditedProfile(response.data);
        setError("");
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Handle profile field changes
  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");

      const formData = new FormData();
      
      // Add profile fields to form data
      Object.keys(editedProfile).forEach(key => {
        if (editedProfile[key] !== undefined && editedProfile[key] !== null) {
          formData.append(key, editedProfile[key]);
        }
      });

      // Add image if selected
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      const response = await apiClient.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data);
      setEditedProfile(response.data);
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Profile</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {imagePreview || profile.profileImage ? (
                    <img
                      src={imagePreview || `${import.meta.env.VITE_API_URL}${profile.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-400">
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
                  >
                    <Camera size={16} />
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                {profile.role?.charAt(0)?.toUpperCase() + profile.role?.slice(1) || 'User'}
              </p>
            </div>

            {/* Profile Fields */}
            <div className="md:col-span-3 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name || ''}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {profile.name || 'Not provided'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400">
                    {profile.email || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {profile.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.dob ? new Date(editedProfile.dob).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleProfileChange('dob', e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Student-specific fields */}
              {profile.role === 'student' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">University</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.university || ''}
                          onChange={(e) => handleProfileChange('university', e.target.value)}
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Enter your university"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {profile.university || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Major</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.major || ''}
                          onChange={(e) => handleProfileChange('major', e.target.value)}
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Enter your major"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {profile.major || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.department || ''}
                          onChange={(e) => handleProfileChange('department', e.target.value)}
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Enter your department"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {profile.department || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Year</label>
                      {isEditing ? (
                        <select
                          value={editedProfile.year || ''}
                          onChange={(e) => handleProfileChange('year', e.target.value)}
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {profile.year || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Semester</label>
                      {isEditing ? (
                        <select
                          value={editedProfile.semester || ''}
                          onChange={(e) => handleProfileChange('semester', e.target.value)}
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                          <option value="">Select Semester</option>
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                          <option value="3rd Semester">3rd Semester</option>
                          <option value="4th Semester">4th Semester</option>
                          <option value="5th Semester">5th Semester</option>
                          <option value="6th Semester">6th Semester</option>
                          <option value="7th Semester">7th Semester</option>
                          <option value="8th Semester">8th Semester</option>
                          <option value="9th Semester">9th Semester</option>
                          <option value="10th Semester">10th Semester</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {profile.semester || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Placement Status</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          profile.placementStatus === 'Placed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {profile.placementStatus || 'Not Placed'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Interview Attendance</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {profile.interviewAttendance || 0} interviews attended
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address || ''}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your address"
                    rows="2"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {profile.address || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={editedProfile.gender || ''}
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Preferences</h2>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-medium">App Theme</span>
            <ThemeToggle />
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base">
              {notifications ? <Bell size={20} /> : <BellOff size={20} />}
              {notifications ? "Notifications On" : "Notifications Off"}
            </span>
            <Switch
              checked={notifications}
              onChange={setNotifications}
              className={`${
                notifications ? "bg-green-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  notifications ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Danger Zone</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full sm:w-auto">
              <Trash2 size={18} />
              Delete Account
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition w-full sm:w-auto"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
