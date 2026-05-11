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
  const userData = req.body;

  const prompt = `Analyze the following student data and predict their chance of admission to their target PTN and Major.
  Student Data: ${JSON.stringify(userData)}
  Provide:
  1. Percentage chance (0-100) as "chance"
  2. Brief insights (strengths/weaknesses) as "insights"
  3. 3 alternative recommended majors based on their grades as "recommendedMajors" (array of strings)
  Return ONLY valid JSON with these three keys.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(result.text || '{}');
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("Gemini predict error:", error);
    return res.status(500).json({ error: 'Failed to generate prediction.' });
  }
}
