import { DecisionDomain } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function suggestDomain(
  problemText: string,
): Promise<DecisionDomain | null> {
  if (!problemText || problemText.trim().length < 20) return null;

  const prompt = `Analisis teks masalah berikut dan tentukan domain keputusan yang PALING sesuai. Jawab HANYA dengan satu kata: "karier", "pendidikan", "relasi", atau "finansial". Jangan beri penjelasan.

Domain:
- karier: pekerjaan, promosi, pindah kerja, negosiasi gaji, work-life balance
- pendidikan: kuliah, jurusan, beasiswa, kursus, S2/S3
- relasi: hubungan personal, konflik, komitmen, keluarga
- finansial: investasi, tabungan, properti, pengeluaran besar, kredit

Teks masalah:
"${problemText.substring(0, 500)}"

Domain yang paling sesuai:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 10,
        },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.toLowerCase()
      .trim();

    const validDomains: DecisionDomain[] = [
      "karier",
      "pendidikan",
      "relasi",
      "finansial",
    ];
    if (text && validDomains.includes(text as DecisionDomain)) {
      return text as DecisionDomain;
    }

    return null;
  } catch (error) {
    console.error("Domain suggestion failed:", error);
    return null;
  }
}
