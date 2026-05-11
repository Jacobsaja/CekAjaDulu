import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ─── API Routes (same logic as /api/*.ts Vercel functions) ─────────────────

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/predict", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set." });

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
        config: { responseMimeType: "application/json" },
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (e: any) {
      console.error("Predict error:", e);
      res.status(500).json({ error: "Failed to generate prediction." });
    }
  });

  app.post("/api/chat", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set." });

    const ai = new GoogleGenAI({ apiKey });
    const { history, message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required." });

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
      res.json({ text: result.text });
    } catch (e: any) {
      console.error("Chat error:", e);
      res.status(500).json({ error: "Failed to get AI response." });
    }
  });

  // ─── Vite / Static ──────────────────────────────────────────────────────────

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
