import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY not set.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  const { history, message } = req.body as {
    history: { role: string; parts: { text: string }[] }[];
    message: string;
  };

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction:
          "You are an expert PTN Counselor in Indonesia. You help students choose the right major and university based on their grades and interests. Be encouraging, informative, and professional.",
      },
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    return res.status(200).json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return res.status(500).json({ error: 'Failed to get AI response.' });
  }
}
