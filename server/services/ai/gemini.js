
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function parseJsonLoose(txt) {
    // Strip code fences if model wraps JSON
    const cleaned = txt.replace(/^```json\s*|```$/gim, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("[parseJsonLoose] Failed to parse JSON:", err);
        console.error("[parseJsonLoose] Raw response:", txt);
        return { error: "Gemini returned non-JSON response", raw: txt };
    }
}

export async function analyzeWithGemini(resumeText, jobDescription) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `You are an ATS expert. Compare the resume and the job description and output STRICT JSON only with keys: fitScore (0-100), strengths (string[]), weaknesses (string[]), suggestions (string[]). No prose.\n\nResume:\n"""${resumeText}"""\n\nJob Description:\n"""${jobDescription}"""`;

        console.log("[analyzeWithGemini] Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("[analyzeWithGemini] Gemini response received.");
        return parseJsonLoose(text);
    } catch (err) {
        console.error("[analyzeWithGemini] Gemini Error:", err?.message || err);
        return { error: "Gemini AI failed" };
    }
}

/**
 * Generates an aptitude question using Gemini API
 * @param {Object} params - { topic: string, difficulty: string }
 * @returns {Promise<Object>} - { question, options, answer, explanation }
 */

export async function generateAptitudeQuestionWithGemini({ topic, difficulty }) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Generate a multiple-choice aptitude question on the topic '${topic}' with difficulty '${difficulty}'. Provide the question, 4 options, the correct answer, and a brief explanation in STRICT JSON format with keys: question, options (string[]), answer, explanation. No prose.`;

        console.log("[generateAptitudeQuestionWithGemini] Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("[generateAptitudeQuestionWithGemini] Gemini response received.");
        return parseJsonLoose(text);
    } catch (err) {
        console.error("[generateAptitudeQuestionWithGemini] Gemini Error:", err?.message || err);
        return { error: "Gemini AI failed" };
    }
}

/**
 * Chat with Gemini API, preserving chat history and roles
 * @param {Array<{role: "user"|"assistant", content: string}>} messages
 * @returns {Promise<string|{error:string,raw:string}>}
 */
export async function chatWithGemini(messages) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // Gemini expects [{role, parts:[{text}]}]
        const formatted = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));
        const result = await model.generateContent({ contents: formatted });
        const text = result.response.text();
        return text;
    } catch (err) {
        console.error("[chatWithGemini] Gemini Error:", err?.message || err);
        return { error: "Gemini AI failed" };
    }
}
