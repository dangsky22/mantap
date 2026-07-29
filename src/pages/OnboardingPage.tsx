import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, ArrowRightIcon, UserIcon, CalendarIcon, DocumentTextIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    situasi: '',
    tujuan: '',
    preferensi: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.nama.trim()) {
        newErrors.nama = 'Nama harus diisi';
      }
      if (!formData.usia) {
        newErrors.usia = 'Usia harus diisi';
      } else if (parseInt(formData.usia) < 13 || parseInt(formData.usia) > 100) {
        newErrors.usia = 'Usia harus antara 13-100 tahun';
      }
    }

    if (currentStep === 2) {
      if (!formData.situasi.trim() || formData.situasi.length < 10) {
        newErrors.situasi = 'Ceritakan situasi Anda minimal 10 karakter';
      }
    }

    if (currentStep === 3) {
      if (!formData.tujuan.trim() || formData.tujuan.length < 10) {
        newErrors.tujuan = 'Jelaskan tujuan Anda minimal 10 karakter';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
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

  const handleSubmit = () => {
    console.log('Onboarding completed:', formData);
    navigate('/select-domain');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-teal" />
            <h1 className="text-2xl font-bold text-navy">MANTAP</h1>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-navy">Personal Context</h2>
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Langkah {step} dari 4</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2.5 flex-1 rounded-full transition-all ${
                      s <= step ? 'bg-gradient-to-r from-teal to-blue' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-teal/10 to-blue/10 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">Perkenalan</h3>
                      <p className="text-gray-600 text-sm">Mari berkenalan terlebih dahulu</p>
                    </div>
                  </div>

                  <Input
                    label="Nama Lengkap"
                    placeholder="Masukkan nama Anda"
                    value={formData.nama}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    error={errors.nama}
                  />

                  <Input
                    label="Usia"
                    type="number"
                    placeholder="Masukkan usia Anda"
                    value={formData.usia}
                    onChange={(e) => handleChange('usia', e.target.value)}
                    error={errors.usia}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-teal/10 to-blue/10 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">Situasi Anda</h3>
                      <p className="text-gray-600 text-sm">Ceritakan kondisi yang sedang Anda hadapi</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Situasi Saat Ini
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue min-h-[200px] ${
                        errors.situasi ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: Saya sedang mempertimbangkan untuk pindah kerja karena merasa stagnan di posisi saat ini..."
                      value={formData.situasi}
                      onChange={(e) => handleChange('situasi', e.target.value)}
                    />
                    {errors.situasi && (
                      <p className="mt-1 text-sm text-red-500">{errors.situasi}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-teal/10 to-blue/10 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal to-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <FlagIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">Tujuan Anda</h3>
                      <p className="text-gray-600 text-sm">Apa yang ingin Anda capai dari konsultasi ini?</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Tujuan Konsultasi
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue min-h-[200px] ${
                        errors.tujuan ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: Saya ingin mendapatkan perspektif objektif tentang apakah ini waktu yang tepat untuk pindah kerja..."
                      value={formData.tujuan}
                      onChange={(e) => handleChange('tujuan', e.target.value)}
                    />
                    {errors.tujuan && (
                      <p className="mt-1 text-sm text-red-500">{errors.tujuan}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-blue/10 to-teal/10 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">Preferensi (Opsional)</h3>
                      <p className="text-gray-600 text-sm">Ada hal spesifik yang perlu kami ketahui?</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Preferensi Konsultasi
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue min-h-[150px]"
                      placeholder="Contoh: Saya lebih suka diskusi yang langsung to the point, atau saya butuh banyak contoh untuk memahami..."
                      value={formData.preferensi}
                      onChange={(e) => handleChange('preferensi', e.target.value)}
                    />
                    <p className="mt-2 text-sm text-gray-500">Kolom ini boleh dikosongkan</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-teal/20 rounded-xl p-5 mt-6">
                    <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-teal" />
                      Ringkasan Informasi Anda:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex gap-2"><strong className="min-w-[80px]">Nama:</strong> <span>{formData.nama}</span></li>
                      <li className="flex gap-2"><strong className="min-w-[80px]">Usia:</strong> <span>{formData.usia} tahun</span></li>
                      <li className="flex gap-2"><strong className="min-w-[80px]">Situasi:</strong> <span className="line-clamp-2">{formData.situasi.substring(0, 100)}...</span></li>
                      <li className="flex gap-2"><strong className="min-w-[80px]">Tujuan:</strong> <span className="line-clamp-2">{formData.tujuan.substring(0, 100)}...</span></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="disabled:opacity-50"
              >
                Kembali
              </Button>
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {step === 4 ? 'Selesai' : 'Lanjut'}
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
