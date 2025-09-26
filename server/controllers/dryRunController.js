// dryRunController.js
// Controller for Python dry-run validation using Gemini AI via @google/generative-ai
// Accepts user code and test cases, compares AI output, returns result

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * POST /api/dryrun
 * Body: {
 *   code: string (Python code),
 *   testCases: [
 *     { input: string, expectedOutput: string }
 *   ]
 * }
 * Returns: {
 *   success: boolean,
 *   results: [ { input, expectedOutput, aiOutput, passed } ],
 *   message: string
 * }
 */
export const dryRunPython = async (req, res) => {
  try {
    const { code, testCases } = req.body;
    if (!code || !Array.isArray(testCases)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input." });
    }

    // Run all test cases in parallel
    const results = await Promise.all(
      testCases.map(async (tc) => {
        let aiOutput = "";
        let passed = false;

        try {
          const prompt = `Given the following Python code:\n${code}\n\nRun it with input:\n${tc.input}\n\nWhat is the output? Respond with only the output.`;

          const result = await model.generateContent(prompt);
          aiOutput = result.response.text().trim();

          passed = aiOutput === tc.expectedOutput.trim();
        } catch (err) {
          console.error("Gemini API error:", err.message);
          aiOutput = "[Gemini API error]";
        }

        return {
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          aiOutput,
          passed,
        };
      })
    );

    const allPassed = results.every((r) => r.passed);

    return res.json({
      success: allPassed,
      results,
      message: allPassed
        ? "All test cases passed."
        : "Some test cases failed.",
    });
  } catch (error) {
    console.error("Dry-run error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
