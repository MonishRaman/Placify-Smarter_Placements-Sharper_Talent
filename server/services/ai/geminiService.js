// Gemini API Service for generating aptitude questions
import axios from 'axios';

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generates an aptitude question using Gemini API
 * @param {Object} params - { topic: string, difficulty: string }
 * @returns {Promise<Object>} - { question, options, answer, explanation }
 */
export async function generateAptitudeQuestion(params) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not set');
    }

    const prompt = `Generate a multiple-choice aptitude question on the topic '${params.topic}' with difficulty '${params.difficulty}'. Provide the question, 4 options, the correct answer, and a brief explanation in JSON format.`;

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );
        // Gemini returns the result in response.data.candidates[0].content.parts[0].text
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No response from Gemini API');
        // Parse the JSON from Gemini's response
        const questionObj = JSON.parse(text);
        return questionObj;
    } catch (err) {
        console.error('Gemini API error:', err.message);
        throw err;
    }
}
