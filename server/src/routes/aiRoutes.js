import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/explain", async (req, res) => {
  const { text, context } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  const prompt = `
You are an AI reading companion.

Selected text:
"${text}"

Surrounding context:
"${context}"

Return ONLY valid JSON.
Do not use markdown.
Do not add extra text.

Use this exact structure:

{
  "meaning": "give meaning as per the selected text in this context",
  "explanation": "simple explanation in easy English as per text size ( one line for short text, deeper for long text)",
  "example": "one real-life example",
  "synonyms": ["word1", "word2", "word3"],
  
}

If selected text is short, keep the answer concise.
If selected text is a long sentence or paragraph, give a deeper explanation with 1-2 clear lines per field.
Do not make it too short.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    return res.json({
      answer,
      provider: "gemini",
    });
  } catch (geminiError) {
    
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const answer =
      completion.choices[0].message.content;

    return res.json({
      answer,
      provider: "groq",
    });
  } catch (groqError) {
    
  }

  return res.json({
    provider: "fallback",
    answer: JSON.stringify({
      meaning: `"${text}" is important in this selected passage.`,
      explanation:
        "Both Gemini and Groq are unavailable right now.",
      example:
        "AI examples will appear here when an AI provider is active.",
      synonyms: [
        "context",
        "phrase",
        "meaning",
      ]
    }),
  });
});

export default router;