// Controller for Java Dry-Run using Gemini AI
// Handles code submission, simulation, and response formatting

import { GoogleGenerativeAI } from "@google/generative-ai";

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/java-dry-run
 * Request body: {
 *   code: string (Java code),
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
 */
export const dryRunJava = async (req, res) => {
  try {
    const { code, testCases } = req.body;
    if (!code || !Array.isArray(testCases)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: code and testCases required.",
      });
    }

    // Prepare prompt for Gemini AI
    const prompt = buildGeminiPrompt(code, testCases);

    // Call Gemini AI
    const geminiResponse = await callGeminiAPI(prompt);
    if (!geminiResponse) {
      return res
        .status(500)
        .json({ success: false, message: "Gemini AI simulation failed." });
    }

    // Parse Gemini AI output
    const results = parseGeminiOutput(geminiResponse, testCases);
    const allPassed = results.every((r) => r.passed);

    return res.status(200).json({
      success: allPassed,
      results,
      message: allPassed
        ? "All test cases passed."
        : "Some test cases failed.",
    });
  } catch (error) {
    console.error("Java Dry-Run Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// ----------------- Helpers -----------------

// Build prompt for Gemini AI
function buildGeminiPrompt(code, testCases) {
  let prompt = `You are a Java code simulator. Given the following Java code and test cases, simulate the output for each input.\n`;
  prompt += `Java Code:\n${code}\n`;
  prompt += `Test Cases:\n`;
  testCases.forEach((tc, idx) => {
    prompt += `Test Case ${idx + 1}: Input: ${tc.input}\n`;
  });
  prompt += `\nRespond strictly in JSON array format: 
  [
    { "input": "<input>", "output": "<simulatedOutput>" }
  ]`;
  return prompt;
}

// Call Gemini AI API
async function callGeminiAPI(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    // Use .text() to extract plain text output
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return null;
  }
}

// Parse Gemini AI output and compare with expected
function parseGeminiOutput(geminiResponse, testCases) {
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
