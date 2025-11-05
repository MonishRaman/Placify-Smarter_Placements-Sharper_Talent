import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const dryRunC = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;
    if (
      !code ||
      !Array.isArray(testCases) ||
      !["c", "cpp"].includes(language)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request: code, language ('c' or 'cpp'), and testCases required.",
      });
    }

    const prompt = buildGeminiPromptC(code, language, testCases);
    const geminiResponse = await callGeminiAPIC(prompt);

    if (!geminiResponse) {
      return res
        .status(500)
        .json({ success: false, message: "Gemini AI simulation failed." });
    }

    const results = parseGeminiOutputC(geminiResponse, testCases);
    const allPassed = results.every((r) => r.passed);

    return res.status(200).json({
      success: allPassed,
      results,
      message: allPassed ? "All test cases passed." : "Some test cases failed.",
    });
  } catch (error) {
    logger.error("C/C++ Dry-Run Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// ----------------- Helpers -----------------
function buildGeminiPromptC(code, language, testCases) {
  const langName = language === "cpp" ? "C++" : "C";
  const cases = testCases
    .map((tc, i) => `Test Case ${i + 1}: Input: ${tc.input}`)
    .join("\n");
  return `You are a ${langName} code simulator. Given the following ${langName} code and test cases, simulate the output for each input.
${langName} Code:
${code}
Test Cases:
${cases}

Respond strictly in JSON array format:
[ { "input": "<input>", "output": "<simulatedOutput>" } ]`;
}

async function callGeminiAPIC(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    logger.error("Gemini API error:", err.message);
    return null;
  }
}

function parseGeminiOutputC(geminiResponse, testCases) {
  let outputs = [];
  try {
    outputs = JSON.parse(geminiResponse);
  } catch {
    const match = geminiResponse.match(/\[.*\]/s);
    if (match) outputs = JSON.parse(match[0]);
  }

  return testCases.map((tc, i) => {
    const actual = outputs[i]?.output?.trim() ?? "";
    const expected = tc.expectedOutput.trim();
    return {
      input: tc.input,
      expectedOutput: expected,
      actualOutput: actual,
      passed: actual === expected,
    };
  });
}

export default { dryRunC };
