import { DecisionDomain, Message } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  response: string;
  explanation?: string;
}

export async function sendMessageToGemini(
  messages: Message[],
  domain: DecisionDomain,
  userContext?: string
): Promise<GeminiResponse> {
  const systemPrompt = getSystemPrompt(domain);
  
  const conversationHistory = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + (userContext ? `\n\nKonteks pengguna: ${userContext}` : '') }]
        },
        ...conversationHistory
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak bisa merespons saat ini.';

  return {
    response: text,
    explanation: extractExplanation(text)
  };
}

function getSystemPrompt(domain: DecisionDomain): string {
  const basePrompt = `Kamu adalah MANTAP, AI Sparring Partner untuk pengambilan keputusan pribadi. Peranmu adalah membantu pengguna berpikir lebih objektif dan terstruktur, BUKAN memberikan jawaban langsung.

Prinsip utama:
- Ajukan pertanyaan reflektif untuk membantu pengguna mengeksplorasi alternatif
- Bantu pengguna memahami konsekuensi dari setiap pilihan
- Berikan insight dengan SELALU menjelaskan alasan di baliknya (explainability)
- Keputusan akhir SELALU di tangan pengguna
- Gunakan bahasa Indonesia yang natural dan empatis`;

  const domainSpecific = {
    karier: '\n\nFokus domain: Keputusan karier (pindah kerja, promosi, perubahan jalur karier). Pertimbangkan: pengembangan skill, work-life balance, kompensasi, nilai & kultur perusahaan, dampak jangka panjang terhadap karier.',
    pendidikan: '\n\nFokus domain: Keputusan pendidikan (lanjut kuliah, pilih jurusan, beasiswa, kursus). Pertimbangkan: minat & bakat, prospek karier, biaya, durasi, reputasi institusi.',
    relasi: '\n\nFokus domain: Keputusan relasi (hubungan personal, konflik, komitmen). Pertimbangkan: nilai pribadi, komunikasi, batasan sehat, dampak emosional jangka panjang.',
    finansial: '\n\nFokus domain: Keputusan finansial (investasi, pengeluaran besar, tabungan). Pertimbangkan: tujuan keuangan, risiko, likuiditas, time horizon, dampak terhadap stabilitas finansial.'
  };

  return basePrompt + domainSpecific[domain];
}

function extractExplanation(text: string): string | undefined {
  const explanationMatch = text.match(/\[Penjelasan:(.+?)\]/s);
  return explanationMatch ? explanationMatch[1].trim() : undefined;
}
