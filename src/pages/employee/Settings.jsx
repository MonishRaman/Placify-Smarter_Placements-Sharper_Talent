import React, { useState, useEffect } from "react";
import { Camera, Save, Edit, X, Trash2, LogOut } from "lucide-react";
import {
  getProfile as fetchProfileApi,
  updateProfile as updateProfileApi,
  profileImageUrl,
} from "../../api/auth";

const MOCK_KEY = "employee_settings_dev";

const defaultMock = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+91 5512345671",
  currentCompany: "Acme Corp",
  jobTitle: "Frontend Engineer",
  experience: "3 years",
  skills: ["React", "JavaScript", "CSS"],
  address: "123 Main St, Springfield",
  profileImage: null, // data URL
  notifications: true,
  darkMode: false,
};

const Settings = () => {
  const [profile, setProfile] = useState(defaultMock);
  const [edited, setEdited] = useState(defaultMock);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // Try backend first
        const data = await fetchProfileApi();
        // backend returns user document
        setProfile(data || defaultMock);
        setEdited(data || defaultMock);
        if (data?.profileImage)
          setImagePreview(profileImageUrl(data.profileImage));
      } catch (err) {
        logger.warn(
          "Failed to fetch profile from API, falling back to local mock:",
          err.message || err
        );
        try {
          const raw = localStorage.getItem(MOCK_KEY);
          if (raw) {
            const data = JSON.parse(raw);
            setProfile(data);
            setEdited(data);
            if (data.profileImage) setImagePreview(data.profileImage);
          } else {
            setProfile(defaultMock);
            setEdited(defaultMock);
          }
        } catch (e) {
          logger.error("Failed to load mock settings", e);
          setProfile(defaultMock);
          setEdited(defaultMock);
        }
        setError("Could not load profile from server. Using local mock.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field, value) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const handleImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    // quick preview
    const url = URL.createObjectURL(f);
    setImagePreview(url);
    // Note: we don't set data URL into edited.profileImage here since we'll upload file
  };

  const save = () => {
    const doSave = async () => {
      setSaving(true);
      setError("");
      try {
        // If a file is selected, send multipart/form-data
        let updated;
        if (selectedFile) {
          const form = new FormData();
          // Append editable fields
          const allowed = [
            "name",
            "phone",
            "dob",
            "address",
            "gender",
            "education",
            "currentCompany",
            "jobTitle",
            "experience",
            "skills",
          ];
          allowed.forEach((k) => {
            if (edited[k] !== undefined && edited[k] !== null)
              form.append(
                k,
                Array.isArray(edited[k]) ? edited[k].join(",") : edited[k]
              );
          });
          form.append("profileImage", selectedFile);

          updated = await updateProfileApi(form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          // Send JSON payload
          const payload = {};
          [
            "name",
            "phone",
            "dob",
            "address",
            "gender",
            "education",
            "currentCompany",
            "jobTitle",
            "experience",
            "skills",
          ].forEach((k) => {
            if (edited[k] !== undefined && edited[k] !== null)
              payload[k] = edited[k];
          });
          updated = await updateProfileApi(payload);
        }

        // If backend returned updated user
        if (updated) {
          setProfile(updated);
          setEdited(updated);
          if (updated.profileImage)
            setImagePreview(profileImageUrl(updated.profileImage));
        } else {
          // fallback: persist locally
          localStorage.setItem(MOCK_KEY, JSON.stringify(edited));
          setProfile(edited);
        }
        setIsEditing(false);
        setSelectedFile(null);
      } catch (err) {
        logger.error("Failed to save profile:", err);
        setError("Failed to save profile. Changes not persisted.");
        // fallback: save locally so dev can continue
        try {
          localStorage.setItem(MOCK_KEY, JSON.stringify(edited));
          setProfile(edited);
          setIsEditing(false);
        } catch (e) {
          /*ignore*/
        }
      } finally {
        setSaving(false);
      }
    };

    doSave();
  };

  const cancel = () => {
    setEdited(profile);
    setImagePreview(profile.profileImage || null);
    setIsEditing(false);
  };

  const resetMock = () => {
    localStorage.removeItem(MOCK_KEY);
    setProfile(defaultMock);
    setEdited(defaultMock);
    setImagePreview(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Employee Settings</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancel}
                    className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={save}
                    className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                {imagePreview || profile.profileImage ? (
                  <img
                    src={imagePreview || profile.profileImage}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl font-bold text-gray-400">
                    {(profile.name || "U").charAt(0)}
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="mt-3 inline-flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-3 py-2 rounded">
                  <Camera size={16} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  {isEditing ? (
                    <input
                      value={edited.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    {profile.email}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      value={edited.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.phone}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Company
                  </label>
                  {isEditing ? (
                    <input
                      value={edited.currentCompany}
                      onChange={(e) =>
                        handleChange("currentCompany", e.target.value)
                      }
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.currentCompany}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Title
                  </label>
                  {isEditing ? (
                    <input
                      value={edited.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.jobTitle}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience
                  </label>
                  {isEditing ? (
                    <input
                      value={edited.experience}
                      onChange={(e) =>
                        handleChange("experience", e.target.value)
                      }
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.experience}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skills
                  </label>
                  {isEditing ? (
                    <input
                      value={edited.skills.join(", ")}
                      onChange={(e) =>
                        handleChange(
                          "skills",
                          e.target.value.split(",").map((s) => s.trim())
                        )
                      }
                      className="w-full p-3 border rounded-md dark:bg-gray-700"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      {profile.skills.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={edited.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={2}
                    className="w-full p-3 border rounded-md dark:bg-gray-700"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    {profile.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">Preferences</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Enable email notifications for updates
                </div>
              </div>
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={edited.notifications}
                    onChange={(e) =>
                      handleChange("notifications", e.target.checked)
                    }
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Use dark theme in the app
                </div>
              </div>
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={edited.darkMode}
                    onChange={(e) => handleChange("darkMode", e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded border-t dark:border-gray-700">
            <h3 className="text-red-600 font-semibold mb-3">Danger Zone</h3>
            <div className="flex gap-3">
              <button
                onClick={resetMock}
                className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
              >
                <Trash2 size={16} /> Reset Mock Data
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(MOCK_KEY);
                  alert("Logged out (dev)");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
