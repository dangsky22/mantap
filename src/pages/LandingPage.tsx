import { 
  ChatBubbleBottomCenterTextIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  BookOpenIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';

import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-teal" />
              <h1 className="text-2xl font-bold text-navy">MANTAP</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/onboarding')}>
              Masuk
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal bg-opacity-10 text-teal px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <SparklesIcon className="w-4 h-4" />
            AI Sparring Partner untuk Anda
          </div>
          <h2 className="text-5xl font-bold text-navy mb-6 leading-tight">
            Buat Keputusan Lebih<br />
            <span className="text-blue">Objektif & Terstruktur</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Diskusikan keputusan karier, pendidikan, relasi, dan finansial dengan AI 
            yang membantu Anda mengeksplorasi alternatif, memahami konsekuensi, 
            dan mengambil keputusan dengan <strong>penuh kesadaran</strong>.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2 shadow-lg shadow-blue/30" onClick={() => navigate('/onboarding')}>
              Mulai Konsultasi Gratis
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-navy mb-4">
              Kenapa MANTAP Berbeda?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bukan chatbot biasa — MANTAP dirancang sebagai mitra diskusi yang membantu Anda
              berpikir lebih jernih dan terarah.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ChatBubbleBottomCenterTextIcon className="w-8 h-8" />}
              title="Chat Interaktif"
              description="Diskusi dua arah yang natural. AI bertanya, Anda menjawab — bukan sekadar tanya-jawab kaku."
            />
            <FeatureCard
              icon={<LightBulbIcon className="w-8 h-8" />}
              title="Explainability"
              description="Setiap saran disertai penjelasan 'Kenapa saran ini?' — transparan dan mudah dipahami."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-8 h-8" />}
              title="Human-in-the-Loop"
              description="Keputusan akhir 100% milik Anda. AI hanya alat bantu, bukan pengambil keputusan."
            />
            <FeatureCard
              icon={<BookOpenIcon className="w-8 h-8" />}
              title="Decision Journal"
              description="Catat dan tinjau kembali setiap keputusan sebagai bahan refleksi berharga."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-navy mb-4">
              Cara Kerja MANTAP
            </h3>
            <p className="text-gray-600">
              Empat langkah sederhana menuju keputusan yang lebih baik
            </p>
          </div>
          <div className="space-y-6">
            <StepCard
              number="1"
              title="Personal Context Onboarding"
              description="Ceritakan situasi Anda agar AI memahami konteks keputusan yang akan diambil."
            />
            <StepCard
              number="2"
              title="Pilih Domain Keputusan"
              description="Karier, Pendidikan, Relasi, atau Finansial — pilih yang sesuai kebutuhan Anda."
            />
            <StepCard
              number="3"
              title="Eksplorasi dengan AI"
              description="AI mengajukan pertanyaan reflektif dan membantu Anda melihat dari berbagai sudut pandang."
            />
            <StepCard
              number="4"
              title="Konfirmasi Keputusan"
              description="Setelah yakin, Anda menegaskan keputusan dan menyimpannya ke Decision Journal."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Siap Membuat Keputusan Lebih Baik?
          </h3>
          <p className="text-xl mb-8 text-gray-300">
            Mulai konsultasi gratis sekarang dan rasakan perbedaannya.
          </p>
          <Button size="lg" className="bg-teal hover:bg-opacity-90 flex items-center gap-2 mx-auto" onClick={() => navigate('/onboarding')}>
            Mulai Sekarang
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-2">
            <strong className="text-navy">MANTAP</strong> — Mitra AI untuk Pengambilan Keputusan Tepat
          </p>
          <p className="text-sm">
            Hackathon IT FEST 6.0 2026 | Built with Human-Centered AI Principles
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
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-teal bg-opacity-10 rounded-lg flex items-center justify-center text-teal mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-navy mb-2">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
    <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-teal transition-colors">
      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal to-blue text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-md">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold text-navy mb-2">{title}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
