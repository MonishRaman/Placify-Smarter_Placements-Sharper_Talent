import apiClient from './apiClient.js';


// ==================== RESUME API SERVICE ====================

/**
 * Resume API service for handling all resume-related API calls
 * Uses the configured apiClient which automatically handles authentication
 */

// Create a new resume
export const createResume = async (resumeData) => {
    try {
        const response = await apiClient.post('/resume', resumeData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error creating resume:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create resume',
            error: error.response?.data || error.message
        };
    }
};

// Get all resumes for the authenticated user
export const getUserResumes = async () => {
    try {
        const response = await apiClient.get('/resume');
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error fetching resumes:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch resumes',
            error: error.response?.data || error.message
        };
    }
};

// Get a specific resume by ID
export const getResumeById = async (resumeId) => {
    try {
        const response = await apiClient.get(`/resume/${resumeId}`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error fetching resume:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch resume',
            error: error.response?.data || error.message
        };
    }
};

// Update an existing resume
export const updateResume = async (resumeId, resumeData) => {
    try {
        const response = await apiClient.put(`/resume/${resumeId}`, resumeData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error updating resume:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update resume',
            error: error.response?.data || error.message
        };
    }
};

// Delete a resume (soft delete)
export const deleteResume = async (resumeId) => {
    try {
        const response = await apiClient.delete(`/resume/${resumeId}`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error deleting resume:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete resume',
            error: error.response?.data || error.message
        };
    }
};

// Get resume analytics
export const getResumeAnalytics = async () => {
    try {
        const response = await apiClient.get('/resume/analytics');
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('Error fetching resume analytics:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch analytics',
            error: error.response?.data || error.message
        };
    }
};

// ==================== DATA TRANSFORMATION UTILITIES ====================

/**
 * Transform frontend form data to backend API format
 * @param {Object} formData - Frontend form data
 * @returns {Object} - Backend compatible data structure
 */
export const transformFormDataToAPI = (formData) => {
    return {
        fullName: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        summary: formData.summary || '',
        skills: Array.isArray(formData.skills) ? formData.skills.filter(skill => skill.trim()) : [],
        education: Array.isArray(formData.education) ? formData.education.map(edu => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || ''
        })) : [],
        workExperience: Array.isArray(formData.experience) ? formData.experience.map(exp => ({
            company: exp.company || '',
            role: exp.position || exp.role || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || ''
        })) : [],
        projects: Array.isArray(formData.projects) ? formData.projects.map(project => ({
            title: project.title || '',
            description: project.description || '',
            techStack: Array.isArray(project.technologies) ? project.technologies.filter(tech => tech.trim()) : [],
            link: project.githubUrl || project.liveUrl || project.link || ''
        })) : []
    };
};

/**
 * Transform backend API data to frontend form format
 * @param {Object} apiData - Backend API data
 * @returns {Object} - Frontend compatible data structure
 */
export const transformAPIDataToForm = (apiData) => {
    return {
        name: apiData.fullName || '',
        email: apiData.email || '',
        phone: apiData.phone || '',
        summary: apiData.summary || '',
        skills: Array.isArray(apiData.skills) ? apiData.skills : [],
        education: Array.isArray(apiData.education) ? apiData.education.map(edu => ({
            id: edu._id || Date.now() + Math.random(),
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            current: !edu.endDate || edu.endDate === '',
            description: edu.description || ''
        })) : [],
        experience: Array.isArray(apiData.workExperience) ? apiData.workExperience.map(exp => ({
            id: exp._id || Date.now() + Math.random(),
            company: exp.company || '',
            position: exp.role || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: !exp.endDate || exp.endDate === '',
            description: exp.description || ''
        })) : [],
        projects: Array.isArray(apiData.projects) ? apiData.projects.map(project => ({
            id: project._id || Date.now() + Math.random(),
            title: project.title || '',
            description: project.description || '',
            technologies: Array.isArray(project.techStack) ? project.techStack : [],
            githubUrl: project.link || '',
            liveUrl: '',
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            current: !project.endDate || project.endDate === '',
            features: project.features || ''
        })) : []
    };
};
