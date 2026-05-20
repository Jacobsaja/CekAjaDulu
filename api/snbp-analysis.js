import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
  }

  const { payload } = req.body;
  const { profileSummary, targetMajors, avgScore, achievements, filterResults } = payload;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Kamu adalah AI Konselor Pendidikan milik Cekadu.

Seorang siswa memiliki profil berikut:
Nama: ${profileSummary.name}
Sekolah: ${profileSummary.school}
Target jurusan: ${targetMajors.join(", ")}
Target kota: ${profileSummary.targetCities.join(", ")}
Jenis sekolah: ${profileSummary.schoolType}
Jurusan: ${profileSummary.major}
Rata-rata nilai: ${avgScore}
Mapel terkuat: ${profileSummary.strongestSubject}
Prestasi: ${achievements.map(a => `${a.name} (${a.rank} - ${a.level})`).join(", ")}

Berikut hasil rekomendasi sistem:
${filterResults.map(r => `- ${r.univ} (${r.major}) - Kota ${r.city} [${r.competitiveness}]`).join("\n")}

Tugasmu:
1. Berikan rekomendasi kampus paling realistis.
2. Jelaskan alasan kecocokan berdasarkan profil akademik.
3. Berikan saran strategi pemilihan kampus.
4. Jangan pernah memberikan angka persen peluang lolos.
5. Gunakan label:
   - Sangat Kompetitif
   - Kompetitif
   - Peluang Terbuka
6. Gunakan bullet points singkat dan mudah dipahami siswa SMA.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("SNBP AI Analysis Error:", error);
    return res.status(500).json({ error: "Failed to generate AI analysis." });
  }
}
