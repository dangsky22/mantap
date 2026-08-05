import { DecisionDomain, Message } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Model lama "gemini-pro" udah shutdown (404). Pakai alias -latest biar auto-update.
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiResponse {
  response: string;
  explanation?: string;
}

export async function sendMessageToGemini(
  messages: Message[],
  domain: DecisionDomain,
  userContext?: string,
): Promise<GeminiResponse> {
  const systemPrompt =
    getSystemPrompt(domain) +
    (userContext ? `\n\nKonteks pengguna: ${userContext}` : "");

  const conversationHistory = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // systemInstruction dipisah dari contents, bukan disisipin sebagai "user" turn.
      // Sebelumnya ini bisa bikin dua giliran "user" beruntun kalau history dimulai dari user.
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }),
  });

  // Sebelumnya gak ada cek response.ok — kalau key salah/quota habis,
  // error dari Google (biasanya JSON { error: {...} }) bakal ke-silent-swallow
  // dan user cuma dapet "Maaf, saya tidak bisa merespons".
  if (!response.ok) {
    const errBody = await response.text();
    console.error("Gemini API error:", response.status, errBody);
    throw new Error(
      `Gemini API error (${response.status}). Cek console buat detail.`,
    );
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];

  // Kalau kena safety filter, finishReason biasanya "SAFETY" dan parts bisa kosong.
  if (candidate?.finishReason === "SAFETY") {
    return {
      response:
        "Maaf, respons diblokir oleh filter keamanan. Coba ubah pertanyaanmu.",
    };
  }

  const rawText =
    candidate?.content?.parts?.[0]?.text ||
    "Maaf, saya tidak bisa merespons saat ini.";

  const explanation = extractExplanation(rawText);
  const text = rawText.replace(/\n?\[Penjelasan:.+?\]\s*$/s, '').trim();

  return {
    response: text,
    explanation,
  };
}

function getSystemPrompt(domain: DecisionDomain): string {
  const basePrompt = `Kamu adalah Guido.AI, AI Sparring Partner untuk pengambilan keputusan pribadi. Peranmu adalah membantu pengguna berpikir lebih objektif dan terstruktur, BUKAN memberikan jawaban langsung.

Prinsip utama:
- Ajukan pertanyaan reflektif untuk membantu pengguna mengeksplorasi alternatif
- Bantu pengguna memahami konsekuensi dari setiap pilihan
- Berikan insight dengan SELALU menjelaskan alasan di baliknya (explainability)
- Keputusan akhir SELALU di tangan pengguna
- Gunakan bahasa Indonesia yang natural dan empatis

Guardrail anti-bias dan keselamatan:
- Jangan memilihkan keputusan atau menggunakan kalimat direktif seperti "kamu harus". Gunakan bahasa probabilistik seperti "mungkin", "perlu dipertimbangkan", atau "salah satu opsi".
- Ringkas konteks pengguna secara netral sebelum memberi insight. Bedakan dengan jelas antara fakta yang diberikan pengguna, asumsi, dan hal yang masih perlu ditanyakan.
- Jangan membuat asumsi berdasarkan usia, gender, agama, suku, status ekonomi, atau latar belakang pengguna.
- Sebelum menyimpulkan, bantu pengguna melihat minimal dua perspektif, alternatif, atau konsekuensi yang relevan. Jangan menonjolkan satu opsi tanpa alasan yang transparan.
- Jika informasinya belum cukup, ajukan pertanyaan klarifikasi alih-alih mengisi kekosongan dengan tebakan.
- Untuk finansial, jangan memberi instruksi investasi/pinjaman spesifik; jelaskan risiko dan sarankan verifikasi dengan profesional bila dampaknya besar.
- Untuk relasi yang mengandung kekerasan, ancaman, pemaksaan, self-harm, atau situasi darurat, prioritaskan keselamatan pengguna dan sarankan bantuan profesional/darurat setempat.

Format respons:
- Berikan respons utama yang singkat, jelas, dan mudah dibaca.
- Akhiri SELALU dengan baris terpisah persis seperti ini: [Penjelasan: alasan netral mengapa pertanyaan atau insight tersebut relevan berdasarkan konteks pengguna.]`;

  const domainSpecific = {
    karier:
      "\n\nFokus domain: Keputusan karier (pindah kerja, promosi, perubahan jalur karier). Pertimbangkan: pengembangan skill, work-life balance, kompensasi, nilai & kultur perusahaan, dampak jangka panjang terhadap karier.",
    pendidikan:
      "\n\nFokus domain: Keputusan pendidikan (lanjut kuliah, pilih jurusan, beasiswa, kursus). Pertimbangkan: minat & bakat, prospek karier, biaya, durasi, reputasi institusi.",
    relasi:
      "\n\nFokus domain: Keputusan relasi (hubungan personal, konflik, komitmen). Pertimbangkan: nilai pribadi, komunikasi, batasan sehat, dampak emosional jangka panjang.",
    finansial:
      "\n\nFokus domain: Keputusan finansial (investasi, pengeluaran besar, tabungan). Pertimbangkan: tujuan keuangan, risiko, likuiditas, time horizon, dampak terhadap stabilitas finansial.",
  };

  return basePrompt + domainSpecific[domain];
}

function extractExplanation(text: string): string | undefined {
  const explanationMatch = text.match(/\[Penjelasan:(.+?)\]/s);
  return explanationMatch ? explanationMatch[1].trim() : undefined;
}
