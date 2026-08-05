import { 
  ChatBubbleBottomCenterTextIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 overflow-x-hidden relative font-sans">
      {/* Decorative Radial Gradients for Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#080B10]/75 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="Guido.AI Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Guido.AI
              </span>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="px-5 py-2 rounded-xl text-sm font-semibold border border-white/10 hover:border-teal/50 hover:bg-teal/5 transition-all text-slate-200"
            >
              Masuk / Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal/20 to-blue/20 text-teal-300 border border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-pulse">
              <img src="/logo.png" alt="Guido.AI Logo" className="w-3.5 h-3.5 text-teal" />
              AI Sparring Partner Pengambilan Keputusan
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              Ambil Keputusan Penting dengan <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-400 drop-shadow-sm">
                Logika &amp; Tanpa Keraguan
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl">
              Guido.AI memandu Anda membedah pro-kontra, memetakan risiko finansial, karier, relasi, dan pendidikan melalui diskusi interaktif. Bebaskan diri dari pilihan emosional dan temukan keyakinan objektif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-teal to-blue hover:from-teal/90 hover:to-blue/90 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
              >
                Mulai Konsultasi Gratis
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <a 
                href="#fitur"
                className="px-8 py-4 rounded-xl text-slate-300 font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-center"
              >
                Pelajari Selengkapnya
              </a>
            </div>
            
            {/* Social Trust Metrics */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-teal text-base">★★★★★</span>
                <span className="text-slate-400">Mitra berpikir untuk keputusan penting</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div>
                <span className="text-slate-300 font-bold text-sm">Human-in-the-Loop</span> Principles
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity App Mockup */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            {/* Decorative Glow behind the mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl transform scale-95 -rotate-2" />
            
            {/* Main Mockup Card */}
            <div className="relative border border-white/10 rounded-2xl bg-[#0d1321]/90 backdrop-blur-xl shadow-2xl overflow-hidden p-6">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Guido.AI Partner</h4>
                    <p className="text-[10px] text-slate-400">Analisis Domain: Karier</p>
                  </div>
                </div>
                <span className="text-[10px] bg-teal/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Sesi Aktif
                </span>
              </div>

              {/* Mockup Chat Bubble */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal to-blue flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white">
                    M
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-[11px] text-slate-200 max-w-[85%] leading-relaxed">
                    Bagaimana jika kita bandingkan konsekuensi jangka panjangnya? Mari kita petakan alternatif Anda:
                  </div>
                </div>

                {/* Alternative Comparison Visual */}
                <div className="ml-8 p-3 bg-white/5 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold">Opsi A: Pindah Kerja ke Startup</span>
                    <span className="text-teal-400 font-bold">Skor: 8.2</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal h-full rounded-full" style={{ width: '82%' }} />
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold">Opsi B: Bertahan di Perusahaan Sekarang</span>
                    <span className="text-blue font-bold">Skor: 6.8</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                {/* Explainability Popup Mockup */}
                <div className="ml-8 border-l-2 border-teal pl-3 py-1 space-y-1 bg-teal/5 rounded-r-lg pr-2">
                  <p className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">💡 Insight Logika</p>
                  <p className="text-[10px] text-slate-300 italic">
                    "Opsi A memiliki potensi pengembangan skill lebih tinggi 35%, namun memiliki risiko stabilitas pendapatan yang perlu dimitigasi."
                  </p>
                </div>
              </div>

              {/* Mockup Input Box */}
              <div className="mt-5 pt-3 border-t border-white/5 flex gap-2">
                <div className="bg-white/5 rounded-lg px-3 py-2 text-[10px] text-slate-400 flex-1 border border-white/5">
                  Ketik tanggapan Anda...
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating badges surrounding the mockup */}
            <div className="absolute -top-6 -left-6 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 animate-bounce duration-1000">
              <span className="text-sm">💼</span>
              <span className="text-[10px] font-bold text-slate-200">Karier</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 animate-pulse">
              <span className="text-sm">💰</span>
              <span className="text-[10px] font-bold text-slate-200">Finansial</span>
            </div>
            <div className="absolute top-1/2 -right-8 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-lg items-center gap-2 hidden sm:flex">
              <span className="text-sm">🎓</span>
              <span className="text-[10px] font-bold text-slate-200">Pendidikan</span>
            </div>
          </div>

        </div>
      </section>


      {/* Feature / Difference Section */}
      <section id="fitur" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#090D15]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Kenapa Guido.AI Berbeda?
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Bukan chatbot biasa Guido.AI dirancang khusus sebagai mitra refleksi logis untuk mempertajam proses berpikir Anda.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-teal" />}
              title="Chat Interaktif"
              description="Diskusi dua arah yang reflektif. AI memandu dengan pertanyaan terarah, bukan mendikte pilihan Anda."
            />
            <FeatureCard
              icon={<LightBulbIcon className="w-6 h-6 text-cyan-400" />}
              title="Explainability"
              description="Transparan. Setiap wawasan atau sudut pandang AI dilengkapi penjelasan 'Kenapa saran ini?'."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-6 h-6 text-blue" />}
              title="Human-in-the-Loop"
              description="Kendali penuh. AI membantu menyusun struktur pertimbangan, namun keputusan mutlak milik Anda."
            />
            <FeatureCard
              icon={<BookOpenIcon className="w-6 h-6 text-indigo-400" />}
              title="Decision Journal"
              description="Catatan keputusan pribadi. Tinjau kembali keputusan masa lalu untuk bahan refleksi dan evaluasi diri."
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Cara Kerja Guido.AI
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Empat langkah terstruktur menuju keputusan yang lebih matang
            </p>
          </div>
          <div className="grid gap-8">
            <StepCard
              number="01"
              title="Personal Context Onboarding"
              description="Ceritakan profil singkat, situasi saat ini, dan apa tujuan utama yang ingin Anda capai agar diskusi lebih relevan."
            />
            <StepCard
              number="02"
              title="Pilih Domain Keputusan"
              description="Karier, Pendidikan, Relasi, atau Finansial. AI akan memuat kerangka berpikir (Decision Framework) yang spesifik."
            />
            <StepCard
              number="03"
              title="Eksplorasi Bersama AI"
              description="Bahas opsi yang ada. AI akan menantang asumsi Anda, menunjukkan pro-kontra, dan memberikan perspektif baru."
            />
            <StepCard
              number="04"
              title="Konfirmasi &amp; Catat di Jurnal"
              description="Tegaskan pilihan final Anda dengan penuh kesadaran dan simpan ke Decision Journal untuk referensi di masa depan."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-teal/5 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mx-auto mb-8 border border-teal/20">
            <img src="/logo.png" alt="Guido.AI Logo" className="w-50 h-50 object-contain" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Siap Membuat Keputusan yang Lebih Baik?
          </h3>
          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Mulailah berdiskusi secara gratis dan rasakan proses berpikir yang lebih jernih serta terorganisir.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-teal to-blue hover:from-teal/90 hover:to-blue/90 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            Mulai Sekarang
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 bg-[#06080c]">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p className="mb-2 text-slate-400 font-semibold">
            Guido.AI
          </p>
          <p className="text-sm">
            Mitra AI untuk Pengambilan Keputusan Tepat
          </p>
          <p className="text-xs mt-6 text-slate-600">
            Guido.AI | Built with Human-Centered AI Principles
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl shadow-sm border border-white/5 hover:border-teal/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-3">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-blue/30 transition-all duration-300">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal/20 to-blue/20 text-teal-300 rounded-xl flex items-center justify-center text-lg font-bold border border-teal/20 shadow-md">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
