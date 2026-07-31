import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DecisionDomain } from '../types';

export async function createConsultation(uid: string, domain: DecisionDomain, problem: string) {
  return addDoc(collection(db, 'sessions'), {
    uid,
    domain,
    problem,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveMessage(
  sessionId: string,
  role: 'user' | 'ai',
  content: string,
  explanation?: string,
) {
  await addDoc(collection(db, 'messages'), {
    sessionId,
    role,
    content,
    ...(explanation ? { explanation } : {}),
    timestamp: serverTimestamp(),
  });
  await updateDoc(doc(db, 'sessions', sessionId), { updatedAt: serverTimestamp() });
}

export async function saveDecision(
  uid: string,
  sessionId: string,
  ringkasan: string,
  alasan: string,
) {
  const decision = await addDoc(collection(db, 'decisions'), {
    sessionId,
    uid,
    ringkasan,
    alasan,
    confirmedAt: serverTimestamp(),
  });

  await Promise.all([
    addDoc(collection(db, 'journal'), {
      uid,
      decisionId: decision.id,
      refleksi: alasan,
      createdAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'sessions', sessionId), {
      status: 'completed',
      updatedAt: serverTimestamp(),
    }),
  ]);
}
