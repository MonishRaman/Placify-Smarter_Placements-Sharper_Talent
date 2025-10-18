// dryRunController.js
// Controller for Python dry-run validation using Gemini AI via @google/generative-ai
// Accepts user code and test cases, compares AI output, and returns structured results.

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * POST /api/dryrun
 * Body:
 * {
 *   code: string (Python code),
 *   testCases: [{ input: string, expectedOutput: string }]
 * }
 * Response:
 * {
 *   success: boolean,
 *   results: [{ input, expectedOutput, aiOutput, passed }],
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

    // Process test cases concurrently
    const results = await Promise.all(
      testCases.map(async ({ input, expectedOutput }) => {
        let aiOutput = "[Gemini API error]";
        let passed = false;

        try {
          const prompt = `
Given the following Python code:
${code}

Run it with input:
${input}

What is the output? Respond with only the output.
          `.trim();

          const response = await model.generateContent(prompt);
          aiOutput = response?.response?.text()?.trim() || "";

          passed = aiOutput === expectedOutput.trim();
        } catch (err) {
          console.error("Gemini API error:", err.message);
        }

        return { input, expectedOutput, aiOutput, passed };
      })
    );

    const allPassed = results.every((r) => r.passed);

    return res.json({
      success: allPassed,
      results,
      message: allPassed ? "All test cases passed." : "Some test cases failed.",
    });
  } catch (error) {
    console.error("Dry-run error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
