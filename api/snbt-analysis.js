import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
  }

  const { utbkScore, choicesData } = req.body;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Anda adalah "Pakar Strategi SNBT" dari CekAjaDulu (Cekadu).
    Tugas Anda adalah mengevaluasi strategi pemilihan jurusan peserta SNBT berdasarkan skor tryout dan jurusan yang mereka pilih.

    DATA PESERTA:
    - Skor Tryout UTBK: ${utbkScore}
    - Pilihan Jurusan & Peluang:
    ${choicesData.map((c, i) => `      Pilihan ${i + 1}: ${c.majorName} di ${c.univName} (Keketatan 1:${c.ratio}, Peluang Sistem: ${c.chance}% - ${c.status})`).join('\n')}

    INSTRUKSI:
    Berikan jawaban yang SANGAT SINGKAT, PADAT, dan STRATEGIS. Jangan bertele-tele.
    Gunakan format persis seperti ini (harus berurutan 1 sampai 3):

    1. **Evaluasi Strategi**: (1-2 kalimat mengevaluasi apakah kombinasi pilihan ini rasional, terlalu berisiko, atau sudah aman)
    2. **Saran Pengurutan**: (1 kalimat saran apakah urutan pilihannya sudah tepat atau ada yang perlu dipindah)
    3. **Kesimpulan Final**: (1 kalimat kesimpulan tegas: "Layak di-submit", "Perlu dirombak", atau "Sangat Berisiko")

    PENTING: Jangan tambahkan paragraf pembuka, sapaan, atau penutup apa pun. Langsung output 3 poin di atas.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("SNBT AI Analysis Error:", error);
    return res.status(500).json({ error: "Failed to generate SNBT analysis." });
  }
}
