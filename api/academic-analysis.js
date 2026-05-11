import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
  }

  const { analysisData, interestScores } = req.body;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Anda adalah Konsultan Pendidikan AI dari "CekAjaDulu (Cekadu)".
    Tugas Anda adalah memberikan analisis gabungan antara MINAT (RIASEC) dan AKADEMIK (Nilai Rapor).

    DATA AKADEMIK:
    - Rata-rata Bidang: ${JSON.stringify(analysisData.fieldAverages)}
    - Tren: ${analysisData.trendLabel}
    - Bidang Dominan Akademik: ${analysisData.dominantField}
    - Rekomendasi Final Gabungan: ${analysisData.finalDomField}

    DATA MINAT:
    - Skor RIASEC: ${JSON.stringify(interestScores)}

    INSTRUKSI:
    Berikan jawaban yang SANGAT SINGKAT, PADAT, dan JELAS. User malas membaca teks panjang.
    Gunakan format persis seperti ini (harus berurutan 1 sampai 4):

    1. **Saran Jurusan Final**: (Sebutkan 2-3 jurusan paling logis berdasarkan nilai & minat)
    2. **Alasan**: (1-2 kalimat menjelaskan apakah nilai dan minat sinkron/berseberangan)
    3. **Tantangan Perkuliahan**: (1-2 kalimat prediksi tantangan akademis)
    4. **Pesan**: (Pesan motivasi singkat 1 kalimat)

    PENTING: Jangan tambahkan paragraf pembuka, sapaan, atau penutup apa pun. Langsung output 4 poin di atas.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("AI Academic Analysis Error:", error);
    return res.status(500).json({ error: "Failed to generate academic analysis." });
  }
}
