import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUserData, userData } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: "",
    nickname: "",
    usia: "",
    tujuan: "",
    preferensi: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData?.onboardingCompleted)
      navigate("/dashboard", { replace: true });
  }, [navigate, userData?.onboardingCompleted]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.nama.trim()) {
        newErrors.nama = "Nama harus diisi";
      }
      if (!formData.usia) {
        newErrors.usia = "Usia harus diisi";
      } else if (
        parseInt(formData.usia) < 13 ||
        parseInt(formData.usia) > 100
      ) {
        newErrors.usia = "Usia harus antara 13-100 tahun";
      }
    }

    if (currentStep === 2) {
      if (!formData.tujuan.trim() || formData.tujuan.length < 10) {
        newErrors.tujuan = "Jelaskan tujuan Anda minimal 10 karakter";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    await updateUserData({
      nama: formData.nama.trim(),
      nickname: formData.nickname.trim() || formData.nama.trim().split(" ")[0],
      usia: Number(formData.usia),
      tujuan: formData.tujuan.trim(),
      preferensi: formData.preferensi.trim(),
      onboardingCompleted: true,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col">
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Guidio<span className="text-teal-300">.AI</span>
            </h1>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl border border-white/10 bg-[#101722]/90 p-8 shadow-2xl shadow-black/30 md:p-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Personal Context
                </h2>
                <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-slate-400">
                  Langkah {step} dari 3
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2.5 flex-1 rounded-full transition-all ${
                      s <= step
                        ? "bg-gradient-to-r from-teal to-blue"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="min-h-[200px] md:min-h-[300px]">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-teal-400/15 bg-gradient-to-r from-teal/10 to-blue/10 p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Perkenalan
                      </h3>
                      <p className="text-sm text-slate-400">
                        Mari berkenalan terlebih dahulu
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Nama Lengkap"
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => handleChange("nama", e.target.value)}
                      error={errors.nama}
                    />

                    <Input
                      label="Nama Panggilan"
                      placeholder="Masukkan nama panggilan Anda"
                      value={formData.nickname}
                      onChange={(e) =>
                        handleChange("nickname", e.target.value)
                      }
                    />
                  </div>

                  <Input
                    label="Usia"
                    type="number"
                    placeholder="Masukkan usia Anda"
                    value={formData.usia}
                    onChange={(e) => handleChange("usia", e.target.value)}
                    error={errors.usia}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-teal-400/15 bg-gradient-to-r from-teal/10 to-blue/10 p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal to-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <FlagIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Tujuan Anda
                      </h3>
                      <p className="text-sm text-slate-400">
                        Apa yang ingin Anda capai dari konsultasi ini?
                      </p>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Tujuan Konsultasi
                    </label>
                    <textarea
                      className={`min-h-[200px] w-full rounded-xl border bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 ${
                        errors.tujuan ? "border-red-500" : "border-white/10"
                      }`}
                      placeholder="Contoh: Saya ingin mendapatkan perspektif objektif tentang apakah ini waktu yang tepat untuk pindah kerja..."
                      value={formData.tujuan}
                      onChange={(e) => handleChange("tujuan", e.target.value)}
                    />
                    {errors.tujuan && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.tujuan}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-teal-400/15 bg-gradient-to-r from-blue/10 to-teal/10 p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Preferensi (Opsional)
                      </h3>
                      <p className="text-sm text-slate-400">
                        Ada hal spesifik yang perlu kami ketahui?
                      </p>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Preferensi Konsultasi
                    </label>
                    <textarea
                      className="min-h-[150px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                      placeholder="Contoh: Saya lebih suka diskusi yang langsung to the point, atau saya butuh banyak contoh untuk memahami..."
                      value={formData.preferensi}
                      onChange={(e) =>
                        handleChange("preferensi", e.target.value)
                      }
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      Kolom ini boleh dikosongkan
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl border border-teal-400/20 bg-gradient-to-r from-blue/10 to-teal/10 p-5">
                    <h4 className="mb-3 flex items-center gap-2 font-bold text-white">
                      <CheckCircleIcon className="w-5 h-5 text-teal" />
                      Ringkasan Informasi Anda:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex gap-2">
                        <strong className="min-w-[80px]">Nama:</strong>{" "}
                        <span>{formData.nama}</span>
                      </li>
                      <li className="flex gap-2">
                        <strong className="min-w-[80px]">Panggilan:</strong>{" "}
                        <span>
                          {formData.nickname || formData.nama.split(" ")[0]}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <strong className="min-w-[80px]">Usia:</strong>{" "}
                        <span>{formData.usia} tahun</span>
                      </li>
                      <li className="flex gap-2">
                        <strong className="min-w-[80px]">Tujuan:</strong>{" "}
                        <span className="line-clamp-2">
                          {formData.tujuan.substring(0, 100)}...
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between border-t border-white/10 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="disabled:opacity-50"
              >
                Kembali
              </Button>
              <Button onClick={handleNext} className="flex items-center gap-2">
                {step === 3 ? "Selesai" : "Lanjut"}
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}