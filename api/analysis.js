import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
  }

  const { scores, dominantCluster, top3 } = req.body;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Anda adalah "AI Senior Counselor" dari CekAjaDulu (Cekadu). 
    Anda memiliki otoritas penuh untuk menentukan masa depan pendidikan siswa berdasarkan data minat ini.

    DATA SISWA:
    - Skor RIASEC (0-100): ${JSON.stringify(scores)}
    - Klaster Dominan (Hasil Hitung Sistem): ${dominantCluster.name}
    - Top 3 Minat: ${top3.join(", ")}
    - Daftar Saran Jurusan Sistem: ${dominantCluster.majors.join(", ")}

    INSTRUKSI:
    Berikan jawaban yang SANGAT SINGKAT, PADAT, dan JELAS. User malas membaca teks panjang.
    Gunakan format persis seperti ini (harus berurutan 1 sampai 4):

    1. **Saran Jurusan**: (Pilih 2-3 jurusan HANYA dari "Daftar Saran Jurusan Sistem" di atas)
    2. **Alasan**: (Alasan singkat 1-2 kalimat mengapa jurusan ini cocok dengan skor mereka)
    3. **Analisis Psikologi**: (Analisis karakter singkat 1-2 kalimat berdasarkan top 3 minat)
    4. **Pesan**: (Pesan motivasi singkat 1 kalimat)

    PENTING: Jangan tambahkan paragraf pembuka, sapaan, atau penutup apa pun. Langsung output 4 poin di atas.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ error: "Failed to generate analysis." });
  }
}
