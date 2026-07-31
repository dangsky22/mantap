import { ArrowRightIcon, BookOpenIcon, ChatBubbleLeftRightIcon, ClockIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { DecisionDomain } from '../types';

type SessionItem = { id: string; domain: DecisionDomain; problem: string; status: 'active' | 'completed' | 'abandoned'; updatedAt?: { toDate: () => Date } };
type DecisionItem = { id: string; ringkasan: string; alasan: string; confirmedAt?: { toDate: () => Date } };
const domainLabels: Record<DecisionDomain, string> = { karier: 'Karier', pendidikan: 'Pendidikan', relasi: 'Relasi', finansial: 'Finansial' };

export default function DashboardPage() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const stopSessions = onSnapshot(query(collection(db, 'sessions'), where('uid', '==', currentUser.uid)), (result) => {
      setSessions(result.docs.map((item) => ({ id: item.id, ...item.data() } as SessionItem)));
    }, () => setError('Dashboard belum bisa memuat sesi. Coba muat ulang halaman.'));
    const stopDecisions = onSnapshot(query(collection(db, 'decisions'), where('uid', '==', currentUser.uid)), (result) => {
      setDecisions(result.docs.map((item) => ({ id: item.id, ...item.data() } as DecisionItem)));
    });
    return () => { stopSessions(); stopDecisions(); };
  }, [currentUser]);

  const activeSessions = useMemo(() => sessions.filter((session) => session.status === 'active').sort(byLatest), [sessions]);
  const recentDecisions = useMemo(() => [...decisions].sort((a, b) => (b.confirmedAt?.toDate().getTime() || 0) - (a.confirmedAt?.toDate().getTime() || 0)).slice(0, 4), [decisions]);
  const displayName = userData?.nama?.trim() || 'teman';

  return <main className="min-h-screen bg-[#080B10] text-slate-100">
    <nav className="border-b border-white/5 bg-[#080B10]/80 backdrop-blur-md"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><Link to="/dashboard" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal to-blue"><SparklesIcon className="h-6 w-6" /></span><span className="text-xl font-extrabold">Gudio<span className="text-teal-300">.AI</span></span></Link><button onClick={() => navigate('/problem')} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-blue px-4 py-2.5 text-sm font-bold shadow-lg shadow-teal-950/30 transition hover:brightness-110"><PlusIcon className="h-4 w-4" />New Chat</button></div></nav>
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6"><div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal/10 blur-[120px] pointer-events-none" />
      <div className="relative"><p className="text-sm font-semibold text-teal-300">RUANG REFLEKSI PRIBADI</p><h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Halo, {displayName}.</h1><p className="mt-3 max-w-2xl leading-relaxed text-slate-400">Lanjutkan proses berpikirmu, atau mulai ruang diskusi baru untuk keputusan berikutnya.</p></div>
      {error && <p role="alert" className="relative mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <div className="relative mt-9 grid gap-6 lg:grid-cols-5"><section className="lg:col-span-3"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold"><ChatBubbleLeftRightIcon className="h-5 w-5 text-teal-300" />Sesi aktif</h2><span className="text-sm text-slate-500">{activeSessions.length} sesi</span></div><div className="space-y-3">{activeSessions.length ? activeSessions.map((session) => <button key={session.id} onClick={() => navigate(`/chat?session=${session.id}`)} className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-white/[0.07]"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-wide text-teal-300">{domainLabels[session.domain]}</span><p className="mt-2 line-clamp-2 leading-relaxed text-slate-200">{session.problem}</p></div><ArrowRightIcon className="mt-2 h-5 w-5 flex-none text-slate-400" /></div><p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><ClockIcon className="h-4 w-4" />Lanjutkan sesi</p></button>) : <EmptyState icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} title="Belum ada sesi aktif" text="Mulai dari masalah yang ingin kamu pikirkan hari ini." action={() => navigate('/problem')} actionLabel="Mulai New Chat" />}</div></section>
        <section className="lg:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold"><BookOpenIcon className="h-5 w-5 text-teal-300" />Decision Journal</h2><span className="text-sm text-slate-500">{decisions.length}</span></div><div className="space-y-3">{recentDecisions.length ? recentDecisions.map((decision) => <article key={decision.id} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-bold uppercase tracking-wide text-teal-300">Keputusan</p><h3 className="mt-2 font-semibold leading-relaxed text-slate-100">{decision.ringkasan}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{decision.alasan}</p></article>) : <EmptyState icon={<BookOpenIcon className="h-6 w-6" />} title="Journal masih kosong" text="Keputusan yang kamu konfirmasi akan tersimpan di sini." />}</div></section>
      </div>
    </section>
  </main>;
}

function byLatest(a: SessionItem, b: SessionItem) { return (b.updatedAt?.toDate().getTime() || 0) - (a.updatedAt?.toDate().getTime() || 0); }
function EmptyState({ icon, title, text, action, actionLabel }: { icon: React.ReactNode; title: string; text: string; action?: () => void; actionLabel?: string }) { return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-teal/10 text-teal-300">{icon}</span><h3 className="mt-4 font-semibold text-slate-200">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>{action && <button onClick={action} className="mt-5 text-sm font-bold text-teal-300 hover:text-teal-200">{actionLabel} →</button>}</div>; }
