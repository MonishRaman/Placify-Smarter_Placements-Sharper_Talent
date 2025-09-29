import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const dryRunJava = async (req, res) => {
  try {
    const { code, testCases } = req.body;
    if (!code || !Array.isArray(testCases)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: code and testCases required.",
      });
    }

    const prompt = buildGeminiPrompt(code, testCases);
    const geminiResponse = await callGeminiAPI(prompt);
    if (!geminiResponse) {
      return res
        .status(500)
        .json({ success: false, message: "Gemini AI simulation failed." });
    }

    const results = parseGeminiOutput(geminiResponse, testCases);
    const allPassed = results.every((r) => r.passed);

    return res.status(200).json({
      success: allPassed,
      results,
      message: allPassed ? "All test cases passed." : "Some test cases failed.",
    });
  } catch (error) {
    console.error("Java Dry-Run Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// ----------------- Helpers -----------------

function buildGeminiPrompt(code, testCases) {
  const cases = testCases
    .map((tc, idx) => `Test Case ${idx + 1}: Input: ${tc.input}`)
    .join("\n");
  return `You are a Java code simulator. Given the following Java code and test cases, simulate the output for each input.
Java Code:
${code}
Test Cases:
${cases}

Respond strictly in JSON array format:
[ { "input": "<input>", "output": "<simulatedOutput>" } ]`;
}

async function callGeminiAPI(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return null;
  }
}

function parseGeminiOutput(geminiResponse, testCases) {
  let outputs = [];
  try {
    outputs = JSON.parse(geminiResponse);
  } catch {
    const match = geminiResponse.match(/\[.*\]/s);
    if (match) outputs = JSON.parse(match[0]);
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
