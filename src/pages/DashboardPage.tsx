import { 
  ArrowRightIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon, 
  PlusIcon, 
  ArrowRightStartOnRectangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { DecisionDomain } from '../types';

type SessionItem = { id: string; domain: DecisionDomain; problem: string; status: 'active' | 'completed' | 'abandoned'; updatedAt?: { toDate: () => Date } };
type DecisionItem = { id: string; ringkasan: string; alasan: string; confirmedAt?: { toDate: () => Date } };
const domainLabels: Record<DecisionDomain, string> = { karier: 'Karier', pendidikan: 'Pendidikan', relasi: 'Relasi', finansial: 'Finansial' };

const domainBadgeStyles: Record<DecisionDomain, string> = {
  karier: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  pendidikan: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  relasi: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
  finansial: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

const domainIcons: Record<DecisionDomain, string> = {
  karier: '💼',
  pendidikan: '🎓',
  relasi: '💖',
  finansial: '💰',
};

function formatTimestamp(timestamp?: { toDate: () => Date }) {
  if (!timestamp) return 'Baru saja';
  const date = timestamp.toDate();
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function DashboardPage() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const completionRate = useMemo(() => {
    if (!sessions.length) return 0;
    return Math.round((decisions.length / sessions.length) * 100);
  }, [sessions.length, decisions.length]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Gagal keluar. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans selection:bg-teal-500 selection:text-white relative">
      {/* Decorative Blur Background Blobs - Wrapped to prevent breaking position: sticky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal/5 blur-[130px]" />
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'border-white/15 bg-[#080B10]/85 backdrop-blur-2xl shadow-xl shadow-black/40' 
          : 'border-white/5 bg-[#080B10]/40 backdrop-blur-md'
      }`}>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="grid h-10 w-10 place-items-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Guido.AI Logo" className="h-10 w-10 object-contain" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Guido<span className="text-teal-300">.AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/problem')} 
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-blue hover:from-teal/90 hover:to-blue/90 px-4 py-2.5 text-sm font-bold shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all hover:-translate-y-0.5"
            >
              <PlusIcon className="h-4 w-4" />New Chat
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Keluar"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Dashboard Content */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 z-10">
        
        {/* Welcome Banner */}
        <div className="relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-md shadow-2xl">
          <div className="absolute top-4 right-4 text-6xl opacity-10 select-none">🧠</div>
          <p className="text-xs font-bold tracking-widest text-teal-300 uppercase">RUANG REFLEKSI PRIBADI</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Halo, {displayName}.
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-400 text-sm sm:text-base">
            Guido.AI adalah sparring partner-mu. Urai kebisingan pikiran, petakan konsekuensi logis, dan buat keputusan dengan jernih.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm relative group hover:border-teal/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">💬</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesi Berjalan</p>
            <p className="mt-2 text-3xl font-extrabold text-white">{activeSessions.length}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm relative group hover:border-teal/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">📚</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keputusan Final</p>
            <p className="mt-2 text-3xl font-extrabold text-teal-300">{decisions.length}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm col-span-2 sm:col-span-1 relative group hover:border-blue/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">⚡</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Rate</p>
            <p className="mt-2 text-3xl font-extrabold text-blue-400">{completionRate}%</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        
        {/* Main Grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          
          {/* Active Sessions List */}
          <section className="lg:col-span-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
                <span className="p-1.5 rounded-lg bg-teal/10 text-teal-300">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </span>
                Diskusi Berlangsung
              </h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">{activeSessions.length} Aktif</span>
            </div>
            
            <div className="space-y-4">
              {activeSessions.length ? activeSessions.map((session) => (
                <button 
                  key={session.id} 
                  onClick={() => navigate(`/chat?session=${session.id}`)} 
                  className="w-full rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-teal-500/[0.02] group relative overflow-hidden"
                >
                  <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <ChevronRightIcon className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{domainIcons[session.domain]}</span>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${domainBadgeStyles[session.domain]}`}>
                      {domainLabels[session.domain]}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-200 text-sm font-medium pr-6">{session.problem}</p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>Terakhir update: {formatTimestamp(session.updatedAt)}</span>
                  </div>
                </button>
              )) : (
                <EmptyState 
                  icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} 
                  title="Tidak ada diskusi aktif" 
                  text="Mulai konsultasi baru untuk membedah masalah atau keputusan yang sedang berkecamuk di pikiranmu." 
                  action={() => navigate('/problem')} 
                  actionLabel="Buat Diskusi Baru" 
                />
              )}
            </div>
          </section>

          {/* Decision Journal List */}
          <section className="lg:col-span-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
                <span className="p-1.5 rounded-lg bg-blue/10 text-blue-400">
                  <BookOpenIcon className="h-5 w-5" />
                </span>
                Decision Journal
              </h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">{decisions.length} Total</span>
            </div>
            
            <div className="space-y-4">
              {recentDecisions.length ? recentDecisions.map((decision) => (
                <article 
                  key={decision.id} 
                  className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent p-6 shadow-sm hover:border-blue/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      Keputusan Final
                    </span>
                    <span className="text-[9px] text-slate-500">{formatTimestamp(decision.confirmedAt)}</span>
                  </div>
                  <h3 className="font-bold leading-relaxed text-slate-100 text-sm tracking-tight">{decision.ringkasan}</h3>
                  <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-slate-800 text-lg select-none pointer-events-none">“</div>
                    <p className="pl-4 text-xs leading-relaxed text-slate-400 italic">
                      {decision.alasan}
                    </p>
                  </div>
                </article>
              )) : (
                <EmptyState 
                  icon={<BookOpenIcon className="h-6 w-6" />} 
                  title="Jurnal masih kosong" 
                  text="Setelah kamu berdiskusi dengan AI dan mengambil pilihan final, keputusannya akan otomatis tercatat di sini." 
                />
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function byLatest(a: SessionItem, b: SessionItem) { 
  return (b.updatedAt?.toDate().getTime() || 0) - (a.updatedAt?.toDate().getTime() || 0); 
}

function EmptyState({ 
  icon, 
  title, 
  text, 
  action, 
  actionLabel 
}: { 
  icon: React.ReactNode; 
  title: string; 
  text: string; 
  action?: () => void; 
  actionLabel?: string 
}) { 
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center backdrop-blur-sm flex flex-col items-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/5 text-slate-400 mb-4">
        {icon}
      </span>
      <h3 className="font-bold text-slate-200 text-sm">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-xs">{text}</p>
      {action && (
        <button 
          onClick={action} 
          className="mt-6 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-teal-300 hover:text-white hover:bg-teal hover:border-teal hover:shadow-lg hover:shadow-teal/20 transition-all duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  ); 
}


