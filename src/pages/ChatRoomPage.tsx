import { useEffect, useRef, useState } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatInput, ChatMessage, TypingIndicator, QuickReplies } from "../components/chat";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { saveDecision, saveMessage } from "../services/consultations";
import { db } from "../services/firebase";
import { DecisionDomain, Message as GeminiMessage } from "../types";
import { sendMessageToGemini } from "../services/gemini";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  explanation?: string;
  alternatives?: { name: string; pros: string[]; cons: string[]; score?: number }[];
  timestamp: Date;
}
const domainLabels: Record<DecisionDomain, string> = {
  karier: "Karier",
  pendidikan: "Pendidikan",
  relasi: "Relasi",
  finansial: "Finansial",
};

export default function ChatRoomPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const [domain, setDomain] = useState<DecisionDomain | null>(null);
  const [problem, setProblem] = useState("");
  const [userName, setUserName] = useState(""); // ⬅️ tambahan: nickname dari Firestore
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false); // ⬅️ tambahan: nandain snapshot pertama sudah masuk
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const introStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sessionId || !currentUser) {
      navigate("/select-domain", { replace: true });
      return;
    }
    let unsubscribeMessages: (() => void) | undefined;
    getDoc(doc(db, "sessions", sessionId))
      .then(async (snapshot) => {
        const data = snapshot.data();
        if (!snapshot.exists() || data?.uid !== currentUser.uid) {
          navigate("/select-domain", { replace: true });
          return;
        }
        setDomain(data.domain as DecisionDomain);
        setProblem(data.problem || "");

        // ⬅️ tambahan: ambil nama panggilan dari Firestore
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userSnap.data();
        setUserName(userData?.nickname || "");

        unsubscribeMessages = onSnapshot(
          query(
            collection(db, "messages"),
            where("sessionId", "==", sessionId),
          ),
          (result) => {
            setMessages(
              result.docs
                .map((item) => {
                  const message = item.data();
                  return {
                    id: item.id,
                    role: message.role,
                    content: message.content,
                    explanation: message.explanation,
                    alternatives: message.alternatives,
                    timestamp: message.timestamp?.toDate?.() || new Date(),
                  } as Message;
                })
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
            );
            setMessagesLoaded(true); // ⬅️ tambahan: snapshot pertama sudah diterima
          },
          () => setError("Pesan tidak dapat dimuat. Coba muat ulang halaman."),
        );
      })
      .catch(() => setError("Sesi tidak dapat dimuat."));
    return () => unsubscribeMessages?.();
  }, [currentUser, navigate, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      !sessionId ||
      !domain ||
      !problem ||
      !messagesLoaded || // ⬅️ tambahan: tunggu history lama selesai dimuat dulu
      messages.length > 0 ||
      introStartedRef.current
    )
      return;

    introStartedRef.current = true;
    setIsTyping(true);
    const startConversation = async () => {
      try {
        const result = await sendMessageToGemini(
          [
            {
              messageId: crypto.randomUUID(),
              sessionId,
              role: "user",
              content:
                "Ini awal sesi. Buka percakapan berdasarkan konteks masalah saya. Tunjukkan bahwa kamu memahami inti masalahnya, lalu ajukan satu atau dua pertanyaan reflektif yang paling relevan. Jangan langsung memberi keputusan.",
              timestamp: new Date(),
            },
          ],
          domain,
          problem,
          undefined,
          userName,
        );
        await saveMessage(sessionId, "ai", result.response, result.explanation, result.alternatives);
        generateQuickReplies(result.response);
      } catch (err) {
        console.error("Initial AI response failed:", err);
        setError(
          "Guidio.AI belum bisa membuka percakapan. Coba muat ulang halaman.",
        );
        introStartedRef.current = false;
      } finally {
        setIsTyping(false);
      }
    };
    void startConversation();
  }, [domain, messages.length, messagesLoaded, problem, sessionId, userName]);

  const handleStopGenerating = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsTyping(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!sessionId || !domain) return;
    setError("");
    setIsTyping(true);
    setQuickReplies([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await saveMessage(sessionId, "user", content);
      const pendingMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      const history: GeminiMessage[] = [...messages, pendingMessage].map(
        (message) => ({
          messageId: message.id,
          sessionId,
          role: message.role,
          content: message.content,
          explanation: message.explanation,
          timestamp: message.timestamp,
        }),
      );
      const result = await sendMessageToGemini(
        history,
        domain,
        problem,
        controller.signal,
        userName,
      );
      if (controller.signal.aborted) return;

      await saveMessage(sessionId, "ai", result.response, result.explanation, result.alternatives);
      
      generateQuickReplies(result.response);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Chat request failed:", err);
      setError(
        "Pesan belum terkirim atau Guidio.AI belum bisa merespons. Periksa API key Gemini dan coba lagi.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  const generateQuickReplies = (aiResponse: string) => {
    const replies: string[] = [];
    
    if (aiResponse.includes("?")) {
      replies.push("Bisa jelaskan lebih detail?");
      replies.push("Saya sudah cukup paham");
    }
    
    if (aiResponse.toLowerCase().includes("alternatif") || aiResponse.toLowerCase().includes("opsi")) {
      replies.push("Tolong bantu saya bandingkan");
    }
    
    if (aiResponse.toLowerCase().includes("konsekuensi") || aiResponse.toLowerCase().includes("risiko")) {
      replies.push("Apa risiko terbesarnya?");
    }
    
    if (replies.length === 0) {
      replies.push("Lanjutkan", "Saya ingin tahu lebih banyak");
    }
    
    setQuickReplies(replies.slice(0, 3));
  };

  const handleFinalizeDecision = async (
    decision: string,
    reasoning: string,
  ) => {
    if (!sessionId || !currentUser) return;
    try {
      await saveDecision(currentUser.uid, sessionId, decision, reasoning);
      setShowConfirmation(false);
      navigate("/dashboard");
    } catch {
      setError("Keputusan belum tersimpan. Coba lagi.");
    }
  };

  if (!domain)
    return (
      <div className="min-h-screen bg-[#080B10] text-slate-300 grid place-items-center">
        Menyiapkan ruang diskusi...
      </div>
    );
  return (
    <div className="flex min-h-screen flex-col bg-[#080B10] text-slate-100">
      <nav
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? "border-white/15 bg-[#080B10]/80 backdrop-blur-2xl backdrop-saturate-150 shadow-xl shadow-black/30"
            : "border-white/10 bg-[#080B10]/60 backdrop-blur-xl shadow-lg shadow-black/10"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/Dashboard")}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Kembali"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Guidio.AI Logo"
                className="h-10 w-10 object-contain"
              />
            </span>
            <div>
              <h1 className="font-extrabold text-white">
                Guidio<span className="text-teal-300">.AI</span>
              </h1>
              <p className="text-xs text-slate-400">
                Domain: {domainLabels[domain]}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirmation(true)}
            className="flex items-center gap-2"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Konfirmasi keputusan</span>
          </Button>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6">
        <div className="mb-6 rounded-2xl border border-teal-400/20 bg-gradient-to-r from-teal/10 to-blue/10 p-4">
          <p className="font-semibold text-teal-200">
            Ruang untuk berpikir, bukan mencari jawaban instan.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            Jelaskan konteks, pilihan, dan hal yang paling kamu pertimbangkan.
            Guidio.AI akan membantu memetakannya.
          </p>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}
        {messagesLoaded && messages.length === 0 && !isTyping && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
            <span className="flex-none w-9 h-9 rounded-xl overflow-hidden">
              <img
                src="/logo.png"
                alt="Guido.AI"
                className="w-9 h-9 object-contain"
              />
            </span>
            <p className="leading-relaxed text-slate-300">
              Konteksmu sudah diterima. Guido.AI akan memulai diskusi dari
              masalah ini.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
        {isTyping && <TypingIndicator userName="Guidio.AI" />}
        {!isTyping && quickReplies.length > 0 && (
          <QuickReplies
            suggestions={quickReplies}
            onSelect={handleSendMessage}
            disabled={isTyping}
          />
        )}
        <div ref={messagesEndRef} />
      </main>
      <div className="sticky bottom-0 border-t border-white/10 bg-[#080B10]/95 backdrop-blur px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            onStop={handleStopGenerating}
            isTyping={isTyping}
            placeholder="Ceritakan situasi atau pilihan yang sedang kamu pertimbangkan..."
          />
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleFinalizeDecision}
          lastAlternatives={[...messages]
            .reverse()
            .find((m) => m.role === "ai" && m.alternatives)?.alternatives}
        />
      )}
    </div>
  );
}

function ConfirmationModal({
  onClose,
  onConfirm,
  lastAlternatives,
}: {
  onClose: () => void;
  onConfirm: (decision: string, reasoning: string) => void;
  lastAlternatives?: { name: string; pros: string[]; cons: string[]; score?: number }[];
}) {
  const sorted = lastAlternatives?.sort((a, b) => (b.score || 0) - (a.score || 0)) || [];
  const topScore = sorted[0]?.score || 0;
  const topAlternatives = sorted.filter((a) => a.score === topScore);
  const isTie = topAlternatives.length > 1;
  const topAlternative = isTie ? null : sorted[0];
  
  const [decision, setDecision] = useState(
    isTie ? "" : (topAlternative?.name || "")
  );
  const [reasoning, setReasoning] = useState(
    isTie 
      ? `Beberapa opsi memiliki score yang sama (${topScore}/10). Pertimbangkan prioritas dan nilai pribadimu.`
      : topAlternative?.pros?.length
        ? `Setelah mempertimbangkan: ${topAlternative.pros.slice(0, 2).join(", ")}.`
        : ""
  );
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#101722] p-5 sm:p-8 shadow-2xl">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-300">
              KEPUTUSAN FINAL
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
              Apa pilihanmu?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Keputusan ini disimpan ke Decision Journal milikmu.
              {!isTie && topAlternative && (
                <span className="mt-1 block text-xs text-teal-300">
                  💡 Saran berdasarkan diskusi kita. Kamu bisa ubah sesuai pilihanmu.
                </span>
              )}
              {isTie && (
                <span className="mt-1 block text-xs text-amber-300">
                  ⚠️ Beberapa opsi memiliki score yang sama. Pilih berdasarkan prioritas pribadimu.
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Keputusan
            <input
              value={decision}
              onChange={(event) => setDecision(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-teal-400"
              placeholder="Contoh: Saya memutuskan untuk..."
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Alasan dan pertimbangan
            <textarea
              value={reasoning}
              onChange={(event) => setReasoning(event.target.value)}
              className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-teal-400"
              placeholder="Hal yang paling memengaruhi keputusan ini..."
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={() => onConfirm(decision.trim(), reasoning.trim())}
            disabled={!decision.trim() || !reasoning.trim()}
          >
            Simpan keputusan
          </Button>
        </div>
      </div>
    </div>
  );
}
