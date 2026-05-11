import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
  }

  const { profileData, targetMajor, targetUniv } = req.body;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Anda adalah "Pakar Strategi SNBP" dari CekAjaDulu (Cekadu).
    Tugas Anda adalah mengevaluasi peluang siswa masuk ke jalur SNBP berdasarkan faktor-faktor akademis dan non-akademis.

    DATA PESERTA:
    - Target Jurusan: ${targetMajor} di ${targetUniv}
    - Rata-rata Nilai Keseluruhan: ${profileData.avgGrade}
    - Tren Nilai (Semester 1-5): ${profileData.gradeTrend}
    - Akreditasi Sekolah: ${profileData.accreditation}
    - Peringkat di Kelas: ${profileData.classRank || 'Tidak disebutkan'}
    - Sertifikat Prestasi: ${profileData.certificate || 'Tidak ada'}
    - Status Portofolio: ${profileData.portfolio || 'Tidak ada'}
    - Kekuatan Alumni di PTN Tujuan: ${profileData.alumni || 'Kurang/Tidak Tahu'}

    KRITERIA PENILAIAN SNBP:
    1. Nilai rapor konsisten (stabil/naik lebih baik).
    2. Akreditasi sekolah (A=40%, B=25%, C=5%).
    3. Rekam jejak alumni di PTN tujuan sangat penting.
    4. Prestasi tambahan (Nasional/Internasional sangat kuat).
    5. Jurusan favorit jauh lebih ketat.

    INSTRUKSI:
    Berikan jawaban yang SANGAT SINGKAT, PADAT, dan STRATEGIS. Jangan bertele-tele.
    Gunakan format persis seperti ini (harus berurutan 1 sampai 4):

    1. **Peluang Kelolosan**: (Sebutkan perkiraan peluang: "Sangat Tinggi", "Tinggi", "Sedang", "Rendah", atau "Sangat Rendah")
    2. **Kekuatan Profil**: (Sebutkan 1-2 faktor terkuat dari data peserta)
    3. **Kelemahan/Risiko**: (Sebutkan 1-2 kelemahan atau risiko dari data peserta)
    4. **Saran Strategis**: (1 kalimat saran strategis untuk menghadapi SNBP dengan profil ini)

    PENTING: Jangan tambahkan paragraf pembuka, sapaan, atau penutup apa pun. Langsung output 4 poin di atas.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("SNBP AI Analysis Error:", error);
    return res.status(500).json({ error: "Failed to generate SNBP analysis." });
  }
}
