import apiClient from './apiClient.js';


// Because the router is mounted at /api/resume/score, we should call relative to that root:
// POST   /resume/score          -> '/resume/score'  (for consistency) but to avoid confusion we define a BASE
// To prevent accidental double 'score/score', we centralize the base path here.
const BASE = '/resume/score';

// Helper: detect if backend returned HTML (likely due to wrong baseURL or dev server fallback)
const isHTMLPayload = (data) => {
    if (typeof data === 'string') return /<!DOCTYPE html>/i.test(data) || /<html[\s>]/i.test(data);
    return false;
};

// Normalize axios response ensuring JSON
const validateJSONResponse = (response, endpointLabel) => {
    if (!response) {
        throw new Error(`No response received for ${endpointLabel}`);
    }
    if (isHTMLPayload(response.data)) {
        logger.error(`❌ Received HTML instead of JSON from ${endpointLabel}. Check VITE_API_URL and backend server.`);
        return {
            success: false,
            message: `Unexpected HTML response from ${endpointLabel}. Backend URL misconfigured?`,
            error: 'HTML_RESPONSE'
        };
    }
    return null; // OK
};

// ==================== RESUME SCORE API SERVICE ====================

/**
 * Resume Score API service for handling all resume score-related API calls
 * Uses the configured apiClient which automatically handles authentication
 */

// Save a new resume score to user's history
export const saveResumeScore = async (scoreData) => {
    try {
        logger.debug('📊 Saving resume score:', scoreData);
        const response = await apiClient.post(`${BASE}`, scoreData);
        const htmlError = validateJSONResponse(response, 'saveResumeScore');
        if (htmlError) return htmlError;
        logger.debug('✅ Resume score saved successfully:', response.data);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('❌ Error saving resume score:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to save resume score',
            error: error.response?.data || error.message
        };
    }
};

// Get user's score history with pagination
export const getUserScoreHistory = async (options = {}) => {
    try {
        const { limit = 20, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const params = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            sortBy,
            sortOrder
        });

        logger.debug('📈 Fetching user score history with params:', { limit, page, sortBy, sortOrder });
        const response = await apiClient.get(`${BASE}?${params}`);
        const htmlError = validateJSONResponse(response, 'getUserScoreHistory');
        if (htmlError) return htmlError;
        logger.debug('✅ Score history fetched successfully:', response.data);

        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination,
            message: response.data.message
        };
    } catch (error) {
        logger.error('❌ Error fetching score history:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch score history',
            error: error.response?.data || error.message
        };
    }
};

// Get user's latest score
export const getLatestScore = async () => {
    try {
        logger.debug('🔍 Fetching latest resume score...');
        const response = await apiClient.get(`${BASE}/latest`);
        const htmlError = validateJSONResponse(response, 'getLatestScore');
        if (htmlError) return htmlError;
        logger.debug('✅ Latest score fetched successfully:', response.data);

        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('❌ Error fetching latest score:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch latest score',
            error: error.response?.data || error.message
        };
    }
};

// Get comprehensive analytics for user's scores
export const getUserScoreAnalytics = async () => {
    try {
        logger.debug('📊 Fetching user score analytics...');
        const response = await apiClient.get(`${BASE}/analytics`);
        const htmlError = validateJSONResponse(response, 'getUserScoreAnalytics');
        if (htmlError) return htmlError;
        logger.debug('✅ Score analytics fetched successfully:', response.data);

        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('❌ Error fetching score analytics:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch score analytics',
            error: error.response?.data || error.message
        };
    }
};

// Delete a specific score entry by ID (soft delete)
export const deleteScoreEntry = async (scoreId) => {
    try {
        logger.debug('🗑️ Deleting score entry:', scoreId);
        const response = await apiClient.delete(`${BASE}/${scoreId}`);
        const htmlError = validateJSONResponse(response, 'deleteScoreEntry');
        if (htmlError) return htmlError;
        logger.debug('✅ Score entry deleted successfully:', response.data);

        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        logger.error('❌ Error deleting score entry:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete score entry',
            error: error.response?.data || error.message
        };
    }
};

// Helper function to transform score data for dashboard display
export const transformScoreDataForDashboard = (scoreData) => {
    if (!scoreData) {
        return {
            lastScore: 0,
            previousScore: 0,
            totalScans: 0,
            lastUpdated: 'Never',
            issues: ['No resume analysis available'],
            strengths: [],
            keywordMatch: 0,
            atsCompatibility: 0
        };
    }

    const { scoreBreakdown, score, createdAt } = scoreData;

    return {
        lastScore: Math.round(score || 0),
        previousScore: Math.round((score || 0) - 5), // Placeholder for improvement calculation
        totalScans: 1, // This would need to come from analytics
        lastUpdated: new Date(createdAt).toLocaleDateString(),
        issues: extractIssuesFromAnalysis(scoreData),
        strengths: extractStrengthsFromAnalysis(scoreData),
        keywordMatch: Math.round(scoreBreakdown?.keywordMatch?.score || 0),
        atsCompatibility: Math.round(scoreBreakdown?.formatAndStructure?.score || 0)
    };
};

// Helper function to extract issues from AI analysis
const extractIssuesFromAnalysis = (scoreData) => {
    const issues = [];
    const { scoreBreakdown, aiAnalysis } = scoreData;

    // Add issues based on low scores
    if (scoreBreakdown?.keywordMatch?.score < 70) {
        issues.push('Improve keyword relevance for better ATS matching');
    }
    if (scoreBreakdown?.skillsRelevance?.score < 70) {
        issues.push('Add more relevant skills for the target position');
    }
    if (scoreBreakdown?.experienceRelevance?.score < 70) {
        issues.push('Highlight more relevant work experience');
    }
    if (scoreBreakdown?.educationRelevance?.score < 70) {
        issues.push('Better align education with job requirements');
    }
    if (scoreBreakdown?.formatAndStructure?.score < 80) {
        issues.push('Improve resume format and structure');
    }

    // Add AI-generated improvement suggestions
    if (aiAnalysis?.improvements?.length > 0) {
        issues.push(...aiAnalysis.improvements.slice(0, 3)); // Limit to 3 suggestions
    }

    return issues.length > 0 ? issues : ['Continue optimizing your resume for better results'];
};

// Helper function to extract strengths from AI analysis
const extractStrengthsFromAnalysis = (scoreData) => {
    const strengths = [];
    const { scoreBreakdown, aiAnalysis } = scoreData;

    // Add strengths based on high scores
    if (scoreBreakdown?.keywordMatch?.score >= 80) {
        strengths.push('Excellent keyword optimization');
    }
    if (scoreBreakdown?.skillsRelevance?.score >= 80) {
        strengths.push('Strong relevant skills section');
    }
    if (scoreBreakdown?.experienceRelevance?.score >= 80) {
        strengths.push('Well-aligned work experience');
    }
    if (scoreBreakdown?.educationRelevance?.score >= 80) {
        strengths.push('Good educational background match');
    }
    if (scoreBreakdown?.formatAndStructure?.score >= 85) {
        strengths.push('Professional format and structure');
    }

    // Add AI-generated strengths
    if (aiAnalysis?.strengths?.length > 0) {
        strengths.push(...aiAnalysis.strengths.slice(0, 3)); // Limit to 3 strengths
    }

    return strengths.length > 0 ? strengths : ['Keep up the good work on your resume'];
};

// Helper function to create score history array for chart display
export const transformScoreHistoryForChart = (scoreHistory) => {
    if (!Array.isArray(scoreHistory) || scoreHistory.length === 0) {
        return [45, 52, 58, 63, 68, 75]; // Default placeholder data
    }

    return scoreHistory
        .slice(-6) // Get last 6 scores
        .map(entry => Math.round(entry.score || 0))
        .reverse(); // Reverse to show oldest to newest
};
