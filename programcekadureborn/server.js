import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
console.log("Cek Kunci API:", process.env.GEMINI_API_KEY ? "KUNCI AMAN 🔑" : "KUNCI KOSONG ❌");
const port = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { promptUser } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(promptUser);
        const response = await result.response;

        res.json({ success: true, text: response.text() });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, text: "Waduh, server CekAjaDulu lagi ngopi nih. Coba lagi bentar ya!" });
    }
});

app.listen(port, () => {
    console.log(`🚀 CekAjaDulu Reborn menyala di http://localhost:${port}`);
});