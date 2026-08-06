import {
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PlusIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { deleteSession } from "../services/consultations";
import { db } from "../services/firebase";
import { DecisionDomain } from "../types";

type SessionItem = {
  id: string;
  domain: DecisionDomain;
  problem: string;
  status: "active" | "completed" | "abandoned";
  updatedAt?: { toDate: () => Date };
};

type DecisionItem = {
  id: string;
  ringkasan: string;
  alasan: string;
  confirmedAt?: { toDate: () => Date };
};

const domainLabels: Record<DecisionDomain, string> = {
  karier: "Karier",
  pendidikan: "Pendidikan",
  relasi: "Relasi",
  finansial: "Finansial",
};

const domainBadgeStyles: Record<DecisionDomain, string> = {
  karier: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  pendidikan: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  relasi: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  finansial: "bg-green-500/10 text-green-400 border border-green-500/20",
};

const domainIcons: Record<DecisionDomain, string> = {
  karier: "💼",
  pendidikan: "🎓",
  relasi: "💖",
  finansial: "💰",
};

const quickPrompts: { domain: DecisionDomain; text: string }[] = [
  { domain: "karier", text: "Aku bingung mau resign atau bertahan" },
  { domain: "finansial", text: "Uang tabungan mending buat DP rumah atau invest?" },
  { domain: "relasi", text: "Aku ragu lanjut hubungan ini atau enggak" },
  { domain: "pendidikan", text: "Lanjut S2 sekarang atau kerja dulu?" },
];

function formatTimestamp(timestamp?: { toDate: () => Date }) {
  if (!timestamp) return "Baru saja";
  const date = timestamp.toDate();
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [error, setError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [draft, setDraft] = useState("");

  // Domain Filter state for active sessions
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<
    "all" | DecisionDomain
  >("all");

  // Deletion modal state & dropdown menu state
  const [activeMenuSessionId, setActiveMenuSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<SessionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close open dropdown menu when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuSessionId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const stopSessions = onSnapshot(
      query(collection(db, "sessions"), where("uid", "==", currentUser.uid)),
      (result) => {
        setSessions(
          result.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as SessionItem,
          ),
        );
      },
      () =>
        setError("Dashboard belum bisa memuat sesi. Coba muat ulang halaman."),
    );
    const stopDecisions = onSnapshot(
      query(collection(db, "decisions"), where("uid", "==", currentUser.uid)),
      (result) => {
        setDecisions(
          result.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as DecisionItem,
          ),
        );
      },
    );
    return () => {
      stopSessions();
      stopDecisions();
    };
  }, [currentUser]);

  const activeSessions = useMemo(
    () =>
      sessions.filter((session) => session.status === "active").sort(byLatest),
    [sessions],
  );

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: activeSessions.length,
      karier: 0,
      pendidikan: 0,
      relasi: 0,
      finansial: 0,
    };
    activeSessions.forEach((s) => {
      if (counts[s.domain] !== undefined) counts[s.domain]++;
    });
    return counts;
  }, [activeSessions]);

  const filteredActiveSessions = useMemo(() => {
    if (selectedDomainFilter === "all") return activeSessions;
    return activeSessions.filter((s) => s.domain === selectedDomainFilter);
  }, [activeSessions, selectedDomainFilter]);

  const recentDecisions = useMemo(
    () =>
      [...decisions]
        .sort(
          (a, b) =>
            (b.confirmedAt?.toDate().getTime() || 0) -
            (a.confirmedAt?.toDate().getTime() || 0),
        )
        .slice(0, 4),
    [decisions],
  );

  const displayName = userData?.nickname?.trim() || userData?.nama?.trim() || "teman";

  const completionRate = useMemo(() => {
    if (!sessions.length) return 0;
    return Math.round((decisions.length / sessions.length) * 100);
  }, [sessions.length, decisions.length]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError("Gagal keluar. Coba lagi.");
    }
  };

  const startChat = (text?: string, domain?: DecisionDomain) => {
    navigate("/problem", { state: { draft: text ?? draft, domain } });
  };

  const handleQuickStartSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    startChat(draft.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim()) {
        startChat(draft.trim());
      }
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    } catch (err) {
      setError("Gagal menghapus sesi. Coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans selection:bg-teal-500 selection:text-white relative overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-teal/5 blur-[130px]" />
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-blue/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? "border-white/15 bg-[#080B10]/85 backdrop-blur-2xl shadow-xl shadow-black/40"
            : "border-white/5 bg-[#080B10]/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Guido.AI Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
              />
            </span>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              Guido<span className="text-teal-300">.AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/problem")}
              className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-blue hover:from-teal/90 hover:to-blue/90 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all hover:-translate-y-0.5"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Chat</span>
              {activeSessions.length === 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-300" />
                </span>
              )}
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

      {/* Main Dashboard Section */}
      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:py-12 sm:px-6 z-10">
        {/* Hero Welcome Banner */}
        <div className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-5xl sm:text-6xl opacity-15 select-none pointer-events-none">
            🧠
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal/10 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest text-teal-300 uppercase">
            <SparklesIcon className="h-3.5 w-3.5" /> RUANG REFLEKSI PRIBADI
          </span>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Halo, {displayName}.
          </h1>
          <p className="mt-2 sm:mt-3 max-w-2xl leading-relaxed text-slate-400 text-xs sm:text-base">
            Guido.AI adalah sparring partner-mu. Urai kebisingan pikiran, petakan konsekuensi logis, dan buat keputusan dengan jernih.
          </p>

          {/* Quick-start input bar */}
          <form
            onSubmit={handleQuickStartSubmit}
            className="mt-6 group relative rounded-2xl border border-white/15 bg-[#0B0F16]/90 focus-within:border-teal/50 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-3 sm:px-5 sm:py-4">
              <SparklesIcon className="h-5 w-5 shrink-0 text-teal-300/80" />
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Lagi mikirin apa? Tulis aja, tekan Enter untuk lanjut..."
                className="flex-1 bg-transparent text-xs sm:text-base text-slate-100 placeholder:text-slate-500 outline-none min-w-0"
              />
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/10 select-none shrink-0">
                Enter ↵
              </span>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="shrink-0 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-teal to-blue text-white disabled:opacity-30 disabled:grayscale transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                title="Mulai obrolan (Enter)"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Domain Prompts Chips (Scrollable on mobile) */}
          <div className="mt-4 flex items-center gap-2 flex-wrap pb-1 pt-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.domain}
                onClick={() => startChat(prompt.text, prompt.domain)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 ${domainBadgeStyles[prompt.domain]} hover:brightness-125`}
              >
                <span>{domainIcons[prompt.domain]}</span>
                <span className="whitespace-nowrap">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-4 sm:p-5 backdrop-blur-sm relative group hover:border-teal/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">💬</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Sesi Berjalan
            </p>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {activeSessions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-4 sm:p-5 backdrop-blur-sm relative group hover:border-teal/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">📚</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Keputusan Final
            </p>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-teal-300">
              {decisions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-4 sm:p-5 backdrop-blur-sm col-span-2 sm:col-span-1 relative group hover:border-blue/20 transition-colors">
            <div className="absolute top-4 right-4 text-slate-700 text-xs">⚡</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Completion Rate
            </p>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-blue-400">
              {completionRate}%
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="mt-10 sm:mt-12 grid gap-8 lg:grid-cols-12">
          {/* Active Sessions Column */}
          <section className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white tracking-tight">
                <span className="p-1.5 rounded-lg bg-teal/10 text-teal-300">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                Diskusi Berlangsung
              </h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 font-medium">
                {activeSessions.length} Total Sesi
              </span>
            </div>

            {/* Domain Filter Tabs (Mobile-Friendly Horizontal Scroll) */}
            {activeSessions.length > 0 && (
              <div className="mb-4 flex items-center gap-1.5 flex-wrap pb-2">
                <button
                  onClick={() => setSelectedDomainFilter("all")}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedDomainFilter === "all"
                      ? "bg-white/15 text-white border border-white/20 shadow-sm"
                      : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent"
                  }`}
                >
                  Semua ({domainCounts.all})
                </button>
                {(Object.keys(domainLabels) as DecisionDomain[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomainFilter(d)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                      selectedDomainFilter === d
                        ? `${domainBadgeStyles[d]} font-bold shadow-sm`
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border-transparent"
                    }`}
                  >
                    <span>{domainIcons[d]}</span>
                    <span>{domainLabels[d]}</span>
                    <span className="opacity-75">({domainCounts[d] || 0})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Sessions Cards Container */}
            <div className="space-y-3.5">
              {filteredActiveSessions.length ? (
                filteredActiveSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/chat?session=${session.id}`)}
                    className="w-full rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-5 sm:p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-teal-500/[0.02] group relative cursor-pointer overflow-visible"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {domainIcons[session.domain]}
                        </span>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${domainBadgeStyles[session.domain]}`}
                        >
                          {domainLabels[session.domain]}
                        </span>
                      </div>

                      {/* 3-dots Context Menu Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuSessionId(
                              activeMenuSessionId === session.id ? null : session.id,
                            );
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Opsi sesi"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {activeMenuSessionId === session.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-white/15 bg-[#121824] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                          >
                            <button
                              onClick={() => {
                                setActiveMenuSessionId(null);
                                navigate(`/chat?session=${session.id}`);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors text-left"
                            >
                              <ChevronRightIcon className="h-4 w-4 text-teal-400" />
                              Lanjutkan Diskusi
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuSessionId(null);
                                setSessionToDelete(session);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                            >
                              <TrashIcon className="h-4 w-4 text-red-400" />
                              Hapus Sesi
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-3.5 leading-relaxed text-slate-200 text-xs sm:text-sm font-medium pr-2 line-clamp-3">
                      {session.problem}
                    </p>

                    <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {formatTimestamp(session.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-teal-300 text-[11px] sm:text-xs opacity-90 group-hover:opacity-100 transition-all">
                        Lanjutkan
                        <ChevronRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
                  title={
                    selectedDomainFilter === "all"
                      ? "Belum ada diskusi aktif"
                      : `Belum ada diskusi domain ${domainLabels[selectedDomainFilter]}`
                  }
                  text={
                    selectedDomainFilter === "all"
                      ? "Ketik masalahmu di atas untuk mulai berdiskusi dengan Guido.AI."
                      : "Mulai sesi baru tentang topik ini dari bar di atas."
                  }
                  chips={
                    selectedDomainFilter === "all"
                      ? quickPrompts.map((prompt) => ({
                          label: `${domainIcons[prompt.domain]} ${domainLabels[prompt.domain]}`,
                          onClick: () => startChat(prompt.text, prompt.domain),
                        }))
                      : undefined
                  }
                  action={() => navigate("/problem")}
                  actionLabel="Buat Diskusi Baru"
                />
              )}
            </div>
          </section>

          {/* Decision Journal Column */}
          <section className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white tracking-tight">
                <span className="p-1.5 rounded-lg bg-blue/10 text-blue-400">
                  <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                Decision Journal
              </h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 font-medium">
                {decisions.length} Total
              </span>
            </div>

            <div className="space-y-3.5">
              {recentDecisions.length ? (
                recentDecisions.map((decision) => (
                  <article
                    key={decision.id}
                    className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.015] to-transparent p-5 sm:p-6 shadow-sm hover:border-blue/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        Keputusan Final
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {formatTimestamp(decision.confirmedAt)}
                      </span>
                    </div>
                    <h3 className="font-bold leading-relaxed text-slate-100 text-xs sm:text-sm tracking-tight">
                      {decision.ringkasan}
                    </h3>
                    <div className="mt-3.5 p-3.5 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden">
                      <div className="absolute top-1 left-2 text-slate-700 text-base select-none pointer-events-none">
                        "
                      </div>
                      <p className="pl-3.5 text-xs leading-relaxed text-slate-400 italic">
                        {decision.alasan}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
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

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0F141F] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSessionToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                <TrashIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hapus Diskusi ini?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tindakan ini permanen dan tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs">{domainIcons[sessionToDelete.domain]}</span>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {domainLabels[sessionToDelete.domain]}
                </span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 italic">
                "{sessionToDelete.problem}"
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSession}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Sesi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button (Mobile & Desktop Friendly) */}
      <button
        onClick={() => navigate("/problem")}
        className="fixed bottom-6 right-5 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-blue px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Mulai Ngobrol</span>
      </button>
    </div>
  );
}

function byLatest(a: SessionItem, b: SessionItem) {
  return (
    (b.updatedAt?.toDate().getTime() || 0) -
    (a.updatedAt?.toDate().getTime() || 0)
  );
}

function EmptyState({
  icon,
  title,
  text,
  action,
  actionLabel,
  chips,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action?: () => void;
  actionLabel?: string;
  chips?: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 sm:p-8 text-center backdrop-blur-sm flex flex-col items-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/5 text-slate-400 mb-3.5">
        {icon}
      </span>
      <h3 className="font-bold text-slate-200 text-xs sm:text-sm">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500 max-w-xs">
        {text}
      </p>

      {chips && chips.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-teal/30 hover:text-teal-300 hover:bg-teal/5 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {action && (
        <button
          onClick={action}
          className="mt-5 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-teal-300 hover:text-white hover:bg-teal hover:border-teal hover:shadow-lg hover:shadow-teal/20 transition-all duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}