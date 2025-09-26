// Controller for C/C++ Dry-Run using Gemini AI
// Handles code submission, simulation, and response formatting for C and C++
// Follows best practices and is well-commented for frontend integration

import { GoogleGenerativeAI } from "@google/generative-ai";

// Load Gemini API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/c-dry-run
 * Request body: {
 *   code: string (C or C++ code),
 *   language: 'c' | 'cpp',
 *   testCases: [
 *     { input: string, expectedOutput: string }
 *   ]
 * }
 * Response: {
 *   success: boolean,
 *   results: [
 *     { input: string, expectedOutput: string, actualOutput: string, passed: boolean }
 *   ],
 *   message: string
 * }
 *
 * This endpoint simulates C/C++ code execution using Gemini AI, without running untrusted code on the server.
 * The output is standardized for easy frontend integration.
 */
export const dryRunC = async (req, res) => {
    try {
        const { code, language, testCases } = req.body;
        if (!code || !Array.isArray(testCases) || !['c', 'cpp'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: code, language ('c' or 'cpp'), and testCases required.",
            });
        }

        // Build prompt for Gemini AI
        const prompt = buildGeminiPromptC(code, language, testCases);

        // Call Gemini AI
        const geminiResponse = await callGeminiAPIC(prompt);
        if (!geminiResponse) {
            return res.status(500).json({ success: false, message: "Gemini AI simulation failed." });
        }

        // Parse Gemini AI output
        const results = parseGeminiOutputC(geminiResponse, testCases);
        const allPassed = results.every((r) => r.passed);

        return res.status(200).json({
            success: allPassed,
            results,
            message: allPassed ? "All test cases passed." : "Some test cases failed.",
        });
    } catch (error) {
        console.error("C/C++ Dry-Run Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ----------------- Helpers -----------------

// Build prompt for Gemini AI for C/C++
function buildGeminiPromptC(code, language, testCases) {
    let langName = language === 'cpp' ? 'C++' : 'C';
    let prompt = `You are a ${langName} code simulator. Given the following ${langName} code and test cases, simulate the output for each input.\n`;
    prompt += `${langName} Code:\n${code}\n`;
    prompt += `Test Cases:\n`;
    testCases.forEach((tc, idx) => {
        prompt += `Test Case ${idx + 1}: Input: ${tc.input}\n`;
    });
    prompt += `\nRespond strictly in JSON array format: \n[
    { "input": "<input>", "output": "<simulatedOutput>" }
  ]`;
    return prompt;
}

// Call Gemini AI API for C/C++
async function callGeminiAPIC(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Gemini API error:", err.message);
        return null;
    }
}

// Parse Gemini AI output and compare with expected for C/C++
function parseGeminiOutputC(geminiResponse, testCases) {
    let outputs = [];
    try {
        outputs = JSON.parse(geminiResponse);
    } catch {
        // fallback: try to extract JSON from string
        const match = geminiResponse.match(/\[.*\]/s);
        if (match) {
            outputs = JSON.parse(match[0]);
        }
    }

    return testCases.map((tc, idx) => {
        const actual = outputs[idx]?.output?.trim() ?? "";
        const expected = tc.expectedOutput.trim();
        return {
            input: tc.input,
            expectedOutput: expected,
            actualOutput: actual,
            passed: actual === expected,
        };
    });
}

// Export for testing or route import
export default { dryRunC };
