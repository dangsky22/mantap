import { Alternative, DecisionDomain, Message } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Model lama "gemini-pro" udah shutdown (404). Pakai alias -latest biar auto-update.
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiResponse {
  response: string;
  explanation?: string;
  alternatives?: Alternative[];
}

export async function sendMessageToGemini(
  messages: Message[],
  domain: DecisionDomain,
  userContext?: string,
  signal?: AbortSignal, // ⬅️ tambahan: buat fitur stop/cancel di ChatRoomPage
  userName?: string, // ⬅️ tambahan: nama panggilan dari Firestore
): Promise<GeminiResponse> {
  const systemPrompt =
    getSystemPrompt(domain) +
    (userContext ? `\n\nKonteks pengguna: ${userContext}` : "") +
    (userName ? `\n\nNama panggilan pengguna: ${userName}.` : ""); // ⬅️ tambahan

  const conversationHistory = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal, // ⬅️ tambahan
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
  const alternatives = extractAlternatives(rawText);
  const text = rawText
    .replace(/\n?\[Alternatives:[\s\S]+?\]\s*/g, "")
    .replace(/\n?\[Penjelasan:.+?\]\s*$/s, "")
    .trim();

  return {
    response: text,
    explanation,
    alternatives,
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
- Jika nama panggilan pengguna diberikan, selipkan sesekali di tengah kalimat secara alami (misal: "Kalau dilihat dari ceritamu, [nama]..." atau "Menurutku, [nama], ada dua hal yang perlu dipikirkan..."), BUKAN selalu di awal sebagai sapaan seperti "Halo, [nama]". Jangan pakai nama itu di setiap respons — cukup sesekali saat terasa pas, supaya tidak terdengar seperti template.

Guardrail anti-bias dan keselamatan:
- Jangan memilihkan keputusan atau menggunakan kalimat direktif seperti "kamu harus". Gunakan bahasa probabilistik seperti "mungkin", "perlu dipertimbangkan", atau "salah satu opsi".
- Ringkas konteks pengguna secara netral sebelum memberi insight. Bedakan dengan jelas antara fakta yang diberikan pengguna, asumsi, dan hal yang masih perlu ditanyakan.
- Jangan membuat asumsi berdasarkan usia, gender, agama, suku, status ekonomi, atau latar belakang pengguna.
- Sebelum menyimpulkan, bantu pengguna melihat minimal dua perspektif, alternatif, atau konsekuensi yang relevan. Jangan menonjolkan satu opsi tanpa alasan yang transparan.
- Jika informasinya belum cukup, ajukan pertanyaan klarifikasi alih-alih mengisi kekosongan dengan tebakan.
- Untuk finansial, jangan memberi instruksi investasi/pinjaman spesifik; jelaskan risiko dan sarankan verifikasi dengan profesional bila dampaknya besar.
- Untuk relasi yang mengandung kekerasan, ancaman, pemaksaan, self-harm, atau situasi darurat, prioritaskan keselamatan pengguna dan sarankan bantuan profesional/darurat setempat.

Batasan domain (PENTING):
- Pengguna telah memilih satu domain spesifik. Seluruh pembahasan HANYA boleh seputar domain tersebut.
- Jika pertanyaan pengguna TIDAK berkaitan dengan domain yang dipilih (misal memilih finansial tapi bertanya soal karier, hubungan, atau topik di luar domain), tolak dengan sopan.
- Format penolakan: jelaskan bahwa topik itu di luar cakupan domain saat ini, ringkas domain yang sedang dibahas, dan sarankan agar pengguna memilih dan menanyakan ulang di domain yang sesuai (karier, pendidikan, relasi, atau finansial).
- Jangan pernah menjawab substansi pertanyaan yang di luar domain, meskipun kamu tahu jawabannya.

Format respons:
- Berikan respons utama yang singkat, jelas, dan mudah dibaca.
- Akhiri SELALU dengan baris terpisah persis seperti ini: [Penjelasan: alasan netral mengapa pertanyaan atau insight tersebut relevan berdasarkan konteks pengguna.]
- HANYA generate blok [Alternatives:] jika semua kondisi berikut terpenuhi:
  1. Percakapan sudah berlangsung minimal 3-4 giliran (bukan awal diskusi)
  2. User sudah mengklarifikasi konteks, nilai, dan constraint-nya
  3. User EKSPLISIT menanyakan perbandingan opsi ATAU sudah siap mempertimbangkan keputusan final
  4. Ada 2-3 alternatif konkret yang layak dibandingkan secara objektif
  JANGAN generate [Alternatives:] di awal percakapan atau saat masih tahap eksplorasi/klarifikasi.
  Format blok (hanya jika kondisi terpenuhi):
  [Alternatives:
  1. Nama Opsi A | Pro: keuntungan 1, keuntungan 2 | Con: kerugian 1, kerugian 2 | Score: 7
  2. Nama Opsi B | Pro: keuntungan 1, keuntungan 2 | Con: kerugian 1, kerugian 2 | Score: 8
  ]
  Score adalah penilaian objektif 1-10 berdasarkan konteks pengguna.`;

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

function extractAlternatives(text: string): Alternative[] | undefined {
  const altMatch = text.match(/\[Alternatives:\s*([\s\S]+?)\]/);
  if (!altMatch) return undefined;

  const lines = altMatch[1]
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  const alternatives: Alternative[] = [];
  for (const line of lines) {
    // Format: "1. Nama Opsi | Pro: x, y | Con: a, b | Score: 7"
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;

    const nameMatch = parts[0].match(/^\d+\.\s*(.+)$/);
    const name = nameMatch ? nameMatch[1].trim() : parts[0].trim();

    const proMatch = parts.find((p) => p.startsWith("Pro:"));
    const pros = proMatch
      ? proMatch
          .replace(/^Pro:\s*/, "")
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const conMatch = parts.find((p) => p.startsWith("Con:"));
    const cons = conMatch
      ? conMatch
          .replace(/^Con:\s*/, "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const scoreMatch = parts.find((p) => p.startsWith("Score:"));
    const score = scoreMatch
      ? parseInt(scoreMatch.replace(/^Score:\s*/, "").trim())
      : undefined;

    if (name) {
      alternatives.push({ name, pros, cons, score });
    }
  }

  return alternatives.length > 0 ? alternatives : undefined;
}
