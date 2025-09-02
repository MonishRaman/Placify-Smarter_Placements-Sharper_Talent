export const validateResumeData = (formData) => {
    const errors = {};

    // Personal Information validation
    if (!formData.name || formData.name.trim().length === 0) {
        errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email || formData.email.trim().length === 0) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || formData.phone.trim().length === 0) {
        errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
    }

    // Education validation
    if (formData.education && formData.education.length > 0) {
        formData.education.forEach((edu, index) => {
            if (!edu.institution || edu.institution.trim().length === 0) {
                errors[`education_${index}_institution`] = 'Institution is required';
            }
            if (!edu.degree || edu.degree.trim().length === 0) {
                errors[`education_${index}_degree`] = 'Degree is required';
            }
        });
    }

    // Experience validation
    if (formData.experience && formData.experience.length > 0) {
        formData.experience.forEach((exp, index) => {
            if (!exp.company || exp.company.trim().length === 0) {
                errors[`experience_${index}_company`] = 'Company is required';
            }
            if (!exp.position || exp.position.trim().length === 0) {
                errors[`experience_${index}_position`] = 'Position is required';
            }
        });
    }

    // Projects validation
    if (formData.projects && formData.projects.length > 0) {
        formData.projects.forEach((project, index) => {
            if (!project.title || project.title.trim().length === 0) {
                errors[`project_${index}_title`] = 'Project title is required';
            }
        });
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

export const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format based on length
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }

    return phone; // Return as-is if it doesn't match expected patterns
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};
