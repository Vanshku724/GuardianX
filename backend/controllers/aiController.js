// backend/controllers/aiController.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create OpenAI instance only if API key exists
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI API Key loaded successfully.");
} else {
  console.warn(
    "⚠️ No OpenAI API key found! AI responses will be mocked for local testing."
  );
}

/**
 * Controller: invokeLLM
 * Handles AI prompt requests and returns generated content.
 */
export const invokeLLM = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required." });
    }

    // ✅ Mock response if API key missing
    if (!openai) {
      return res.json({
        response: `🔧 [Mock Response] You sent: "${prompt}". Add a valid OPENAI_API_KEY in your .env file to get real AI output.`,
      });
    }

    // ✅ Actual OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use gpt-4o for better quality if available
      messages: [{ role: "user", content: prompt }],
    });

    return res.json({
      response: completion.choices[0]?.message?.content || "No response received.",
    });
  } catch (error) {
    console.error("❌ AI Controller Error:", error);
    return res.status(500).json({
      message: "Error generating AI response.",
      error: error.message,
    });
  }
};
