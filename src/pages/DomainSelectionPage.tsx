import {
  SparklesIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createConsultation } from "../services/consultations";

type DecisionDomain = "karier" | "pendidikan" | "relasi" | "finansial";

interface DomainOption {
  id: DecisionDomain;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  color: string;
}

const domains: DomainOption[] = [
  {
    id: "karier",
    title: "Karier",
    description:
      "Keputusan seputar pekerjaan, promosi, dan pengembangan karier",
    icon: <BriefcaseIcon className="w-12 h-12" />,
    examples: [
      "Pindah kerja atau bertahan?",
      "Ambil promosi atau tidak?",
      "Ganti jalur karier?",
      "Negosiasi gaji",
    ],
    color: "blue",
  },
  {
    id: "pendidikan",
    title: "Pendidikan",
    description: "Keputusan terkait studi, jurusan, dan pengembangan skill",
    icon: <AcademicCapIcon className="w-12 h-12" />,
    examples: [
      "Lanjut S2 atau kerja dulu?",
      "Pilih jurusan kuliah",
      "Ambil beasiswa atau tidak?",
      "Ikut kursus/bootcamp",
    ],
    color: "teal",
  },
  {
    id: "relasi",
    title: "Relasi",
    description: "Keputusan tentang hubungan personal dan interpersonal",
    icon: <HeartIcon className="w-12 h-12" />,
    examples: [
      "Lanjutkan hubungan atau tidak?",
      "Pindah kota meninggalkan keluarga?",
      "Atasi konflik dengan teman",
      "Komitmen jangka panjang",
    ],
    color: "pink",
  },
  {
    id: "finansial",
    title: "Finansial",
    description: "Keputusan seputar keuangan, investasi, dan pengeluaran besar",
    icon: <CurrencyDollarIcon className="w-12 h-12" />,
    examples: [
      "Beli rumah atau sewa?",
      "Investasi di mana?",
      "Ambil kredit atau tabung dulu?",
      "Alokasi dana darurat",
    ],
    color: "green",
  },
];

export default function DomainSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const state = location.state as { problem?: string; domain?: DecisionDomain } | null;
  const problem = state?.problem;
  const [selectedDomain, setSelectedDomain] = useState<DecisionDomain | null>(
    state?.domain || null,
  );
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!problem) navigate("/problem", { replace: true });
  }, [navigate, problem]);

  const handleSelectDomain = (domain: DecisionDomain) => {
    setSelectedDomain(domain);
  };

  const handleContinue = async () => {
    if (!selectedDomain || !currentUser || !problem) return;
    setError("");
    setIsStarting(true);
    try {
      const session = await createConsultation(
        currentUser.uid,
        selectedDomain,
        problem,
      );
      navigate(`/chat?session=${session.id}`);
    } catch {
      setError(
        "Sesi belum bisa dibuat. Periksa koneksi atau konfigurasi Firestore lalu coba lagi.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  if (!problem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 overflow-x-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue/10 blur-[120px] pointer-events-none" />
      <nav className="relative border-b border-white/5 bg-[#080B10]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Guido.AI Logo"
                className="h-10 w-10 object-contain"
              />
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              Guido<span className="text-teal-300">.AI</span>
            </h1>
          </div>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal/10 px-4 py-2 text-sm font-semibold text-teal-200 mb-4">
            <SparklesIcon className="w-4 h-4" />
            Langkah 2 dari 4
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pilih Domain Keputusan
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dari ceritamu, domain mana yang paling relevan? Guido.AI akan
            menyesuaikan pertanyaan dan kerangka berpikirnya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              isSelected={selectedDomain === domain.id}
              onSelect={() => handleSelectDomain(domain.id)}
            />
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="mx-auto mb-5 max-w-xl rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200"
          >
            {error}
          </p>
        )}
        {selectedDomain && (
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={isStarting}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-teal to-blue px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-teal-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStarting ? "Menyiapkan sesi..." : "Mulai Konsultasi"}
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface DomainCardProps {
  domain: DomainOption;
  isSelected: boolean;
  onSelect: () => void;
}

function DomainCard({ domain, isSelected, onSelect }: DomainCardProps) {
  const getColorClasses = () => {
    switch (domain.color) {
      case "blue":
        return {
          border: "border-blue",
          bg: "bg-blue",
          text: "text-blue",
          icon: "text-blue",
          ring: "ring-blue-500",
        };
      case "teal":
        return {
          border: "border-teal",
          bg: "bg-teal",
          text: "text-teal",
          icon: "text-teal",
          ring: "ring-teal-500",
        };
      case "pink":
        return {
          border: "border-pink-500",
          bg: "bg-pink-500",
          text: "text-pink-500",
          icon: "text-pink-500",
          ring: "ring-pink-500",
        };
      case "green":
        return {
          border: "border-green-500",
          bg: "bg-green-500",
          text: "text-green-500",
          icon: "text-green-500",
          ring: "ring-green-500",
        };
      default:
        return {
          border: "border-gray-300",
          bg: "bg-gray-500",
          text: "text-gray-500",
          icon: "text-gray-500",
          ring: "ring-gray-500",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <button
      onClick={onSelect}
      className={`rounded-2xl bg-white/5 p-6 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.08] border ${
        isSelected
          ? `${colors.border} shadow-lg ring-4 ring-opacity-20 ${colors.ring}`
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`${colors.icon} flex-shrink-0`}>{domain.icon}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{domain.title}</h3>
          <p className="text-slate-400 text-sm">{domain.description}</p>
        </div>
        {isSelected && (
          <div
            className={`${colors.bg} text-white rounded-full p-2 flex-shrink-0`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
        <p
          className={`text-xs font-bold ${colors.text} mb-3 uppercase tracking-wide`}
        >
          Contoh keputusan:
        </p>
        <ul className="space-y-2">
          {domain.examples.map((example, idx) => (
            <li
              key={idx}
              className="text-sm text-slate-300 flex items-start gap-2"
            >
              <span className={`${colors.text} font-bold flex-shrink-0`}>
                •
              </span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
