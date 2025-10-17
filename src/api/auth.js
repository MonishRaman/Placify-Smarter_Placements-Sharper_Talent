import apiClient from './apiClient';

// Build a full URL for profile images returned from the backend (they are stored as "/uploads/filename")
export const profileImageUrl = (path) => {
    if (!path) return null;
    // prefer VITE_API_URL if present
    const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const base = rawBase.replace(/\/$/, '');
    return `${base}${path}`;
};

export const getProfile = async () => {
    const res = await apiClient.get('/auth/profile');
    return res.data;
};

export const updateProfile = async (payload, options = {}) => {
    // payload may be FormData or plain object
    const res = await apiClient.put('/auth/profile', payload, options);
    return res.data;
};

export default {
    getProfile,
    updateProfile,
    profileImageUrl,
};
