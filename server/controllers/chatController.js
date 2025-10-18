import { chatWithGemini } from "../services/ai/gemini.js";

/**
 * POST /api/chat
 * Body: { messages: [ { role: "user"|"assistant", content: string } ] }
 * Returns: { response: string }
 */
export async function chatHandler(req, res) {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array required" });
  }

  try {
    const response = await chatWithGemini(messages);
    if (response?.error) {
      return res.status(500).json({ error: response.error, raw: response.raw });
    }
    return res.json({ response });
  } catch (err) {
    console.error("[chatHandler] Error:", err);
    return res.status(500).json({ error: "Failed to get Gemini response" });
  }
}
