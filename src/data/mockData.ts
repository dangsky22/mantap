import { DecisionDomain } from "../types";

export interface MockSession {
  id: string;
  domain: DecisionDomain;
  problem: string;
  status: "active" | "completed" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

export interface MockDecision {
  id: string;
  sessionId: string;
  domain: DecisionDomain;
  ringkasan: string;
  alasan: string;
  confirmedAt: Date;
  impact?: number;
  confidence?: number;
}

export const DEMO_SESSIONS: MockSession[] = [
  {
    id: "demo-session-1",
    domain: "karier",
    problem: "Saya dapat tawaran kerja di startup dengan gaji 30% lebih tinggi, tapi harus meninggalkan tim yang sudah nyaman dan posisi yang stabil.",
    status: "active",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "demo-session-2",
    domain: "finansial",
    problem: "Punya dana 200 juta, bingung mau DP rumah atau invest ke reksadana untuk passive income jangka panjang.",
    status: "active",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-session-3",
    domain: "pendidikan",
    problem: "Bingung ambil beasiswa S2 di luar negeri sekarang atau kerja dulu 2-3 tahun untuk pengalaman.",
    status: "completed",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_DECISIONS: MockDecision[] = [
  {
    id: "demo-decision-1",
    sessionId: "demo-session-3",
    domain: "pendidikan",
    ringkasan: "Ambil beasiswa S2 sekarang, kesempatan tidak datang dua kali",
    alasan: "Setelah analisis, beasiswa ini fully-funded dan timing-nya pas dengan usia saya. Kalau ditunda, kompetisinya makin ketat dan komitmen keluarga bisa jadi penghalang. Networking di luar negeri akan buka peluang karier yang tidak bisa didapat kalau saya kerja dulu di Indonesia.",
    confirmedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    impact: 9,
    confidence: 8,
  },
  {
    id: "demo-decision-2",
    sessionId: "demo-session-4",
    domain: "relasi",
    ringkasan: "Tetap mempertahankan hubungan dengan komunikasi yang lebih jujur",
    alasan: "Setelah diskusi panjang, masalah kami bukan tentang kompatibilitas tapi lebih ke pola komunikasi yang buruk. Kami sepakat untuk konseling hubungan dan memberi waktu 3 bulan dengan komitmen penuh sebelum mengambil keputusan drastis.",
    confirmedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    impact: 8,
    confidence: 7,
  },
  {
    id: "demo-decision-3",
    sessionId: "demo-session-5",
    domain: "karier",
    ringkasan: "Tolak promosi, fokus work-life balance",
    alasan: "Promosi ke manager memang menggoda dari sisi finansial (+40% gaji), tapi setelah hitung-hitungan, mental health dan family time saya lebih berharga. Saya memilih tetap di posisi senior engineer yang flexible daripada terjebak meeting marathon dan politik kantor.",
    confirmedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    impact: 7,
    confidence: 9,
  },
  {
    id: "demo-decision-4",
    sessionId: "demo-session-6",
    domain: "finansial",
    ringkasan: "Investasi 60% ke index fund, 40% DP rumah",
    alasan: "Hybrid approach: 120 juta ke index fund untuk compounding jangka panjang (target 15-20 tahun), 80 juta untuk DP rumah tipe 36 di pinggiran kota. Dengan cara ini saya dapat aset properti untuk ditinggali sambil tetap punya portfolio investasi yang grow.",
    confirmedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    impact: 9,
    confidence: 8,
  },
];

export interface DomainStats {
  domain: DecisionDomain;
  totalSessions: number;
  completedSessions: number;
  avgDecisionTime: number;
  avgConfidence: number;
}

export const DEMO_DOMAIN_STATS: DomainStats[] = [
  {
    domain: "karier",
    totalSessions: 5,
    completedSessions: 3,
    avgDecisionTime: 4.2,
    avgConfidence: 8.1,
  },
  {
    domain: "finansial",
    totalSessions: 4,
    completedSessions: 3,
    avgDecisionTime: 6.8,
    avgConfidence: 7.8,
  },
  {
    domain: "relasi",
    totalSessions: 3,
    completedSessions: 2,
    avgDecisionTime: 5.5,
    avgConfidence: 6.9,
  },
  {
    domain: "pendidikan",
    totalSessions: 2,
    completedSessions: 2,
    avgDecisionTime: 3.1,
    avgConfidence: 8.5,
  },
];

export interface ActivityEvent {
  id: string;
  type: "session_started" | "decision_made" | "session_updated";
  domain: DecisionDomain;
  title: string;
  description: string;
  timestamp: Date;
}

export const DEMO_ACTIVITY: ActivityEvent[] = [
  {
    id: "activity-1",
    type: "session_updated",
    domain: "karier",
    title: "Sesi diperbarui",
    description: "Diskusi tentang tawaran kerja startup",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "activity-2",
    type: "session_started",
    domain: "karier",
    title: "Sesi baru dimulai",
    description: "Evaluasi tawaran pindah kerja dengan kenaikan gaji signifikan",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "activity-3",
    type: "session_updated",
    domain: "finansial",
    title: "Sesi diperbarui",
    description: "Analisis opsi investasi vs properti",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "activity-4",
    type: "session_started",
    domain: "finansial",
    title: "Sesi baru dimulai",
    description: "Alokasi dana 200 juta untuk masa depan",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "activity-5",
    type: "decision_made",
    domain: "pendidikan",
    title: "Keputusan final dibuat",
    description: "Ambil beasiswa S2 sekarang",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "activity-6",
    type: "decision_made",
    domain: "relasi",
    title: "Keputusan final dibuat",
    description: "Pertahankan hubungan dengan komunikasi lebih baik",
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];
