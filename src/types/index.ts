export interface User {
  uid: string;
  nama: string;
  usia: number;
  tujuan: string;
  createdAt: Date;
  situasi?: string;
  preferensi?: string;
  onboardingCompleted?: boolean;
}

export interface Session {
  sessionId: string;
  uid: string;
  domain: DecisionDomain;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  messageId: string;
  sessionId: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  explanation?: string;
}

export interface Decision {
  decisionId: string;
  sessionId: string;
  ringkasan: string;
  alasan: string;
  confirmedAt: Date;
  alternatives?: Alternative[];
}

export interface Alternative {
  name: string;
  pros: string[];
  cons: string[];
  score?: number;
}

export interface JournalEntry {
  entryId: string;
  uid: string;
  decisionId: string;
  refleksi: string;
  createdAt: Date;
}

export type DecisionDomain = 'karier' | 'pendidikan' | 'relasi' | 'finansial';

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export interface OnboardingData {
  nama: string;
  usia: number;
  situasi: string;
  tujuan: string;
  preferensi?: string;
}

export interface DecisionFramework {
  domain: DecisionDomain;
  questions: string[];
  considerations: string[];
}
