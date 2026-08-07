import {
  ArrowRightIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProblemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { draft?: string; problem?: string; domain?: string } | null;

  const [problem, setProblem] = useState(state?.draft || state?.problem || "");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (problem.trim().length < 20) {
      setError("Ceritakan sedikit lebih detail, minimal 20 karakter.");
      return;
    }
    navigate("/select-domain", {
      state: { problem: problem.trim(), domain: state?.domain },
    });
  };

  return (
    <main className="min-h-screen bg-[#080B10] px-4 py-6 text-slate-100 sm:px-6">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-teal/10 blur-[120px] pointer-events-none" />
      <nav className="relative mx-auto flex max-w-3xl items-center gap-2.5 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
          <img
            src="/logo.png"
            alt="Guido.AI Logo"
            className="h-10 w-10 object-contain"
          />
        </span>
        <h1 className="text-lg sm:text-xl font-extrabold">
          Guidio<span className="text-teal-300">.AI</span>
        </h1>
      </nav>
      <section className="relative mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-[#101722]/90 p-7 shadow-2xl shadow-black/30 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
          <ChatBubbleBottomCenterTextIcon className="h-4 w-4" /> MULAI DARI
          CERITAMU
        </span>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Masalah apa yang sedang kamu hadapi?
        </h2>
        <p className="mt-3 leading-relaxed text-slate-400">
          Ceritakan dengan bahasamu sendiri. Setelah itu, kita pilih domain yang
          paling relevan sebelum mulai berdiskusi.
        </p>
        <label className="mt-7 block text-sm font-semibold text-slate-200">
          Situasi atau keputusan yang ingin kamu pikirkan
          <textarea
            value={problem}
            onChange={(event) => {
              setProblem(event.target.value);
              setError("");
            }}
            placeholder="Contoh: Saya mendapat tawaran kerja baru, tapi khawatir meninggalkan tim dan stabilitas yang sudah saya punya..."
            className="mt-3 min-h-32 sm:min-h-48 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
        </label>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>
            {error || "Semakin jelas konteksnya, semakin tajam diskusinya."}
          </span>
          <span>{problem.length} karakter</span>
        </div>
        <button
          onClick={handleContinue}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-blue px-5 py-3.5 font-bold text-white shadow-lg shadow-teal-950/30 transition hover:brightness-110"
        >
          Lanjut pilih domain <ArrowRightIcon className="h-5 w-5" />
        </button>
      </section>
    </main>
  );
}
