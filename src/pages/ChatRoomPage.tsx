import { useState, useEffect, useRef } from 'react';
import { 
  SparklesIcon, 
  BriefcaseIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ChatMessage, ChatInput } from '../components/chat';
import { Button } from '../components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  explanation?: string;
  timestamp: Date;
}

type DecisionDomain = 'karier' | 'pendidikan' | 'relasi' | 'finansial';

const domainLabels: Record<DecisionDomain, string> = {
  karier: 'Karier',
  pendidikan: 'Pendidikan',
  relasi: 'Relasi',
  finansial: 'Finansial'
};

export default function ChatRoomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentDomain: DecisionDomain = 'karier';

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        role: 'ai',
        content: `Halo! Saya MANTAP, AI Sparring Partner Anda. Saya siap membantu Anda mengeksplorasi keputusan ${domainLabels[currentDomain].toLowerCase()} yang sedang Anda hadapi.\n\nSaya tidak akan memberikan jawaban langsung, tapi akan membantu Anda berpikir lebih terstruktur. Keputusan akhir tetap sepenuhnya di tangan Anda.\n\nUntuk memulai, bisakah Anda ceritakan lebih detail tentang keputusan yang sedang Anda hadapi?`,
        explanation: 'Saya memulai dengan membangun rapport dan menegaskan peran sebagai thinking partner, bukan decision maker. Ini penting agar Anda tetap merasa memiliki kontrol penuh atas keputusan.',
        timestamp: new Date(Date.now() - 120000)
      }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(content),
        explanation: 'Saya mengajukan pertanyaan reflektif untuk membantu Anda mempertimbangkan berbagai aspek yang mungkin belum terpikirkan, termasuk nilai pribadi, konsekuensi jangka panjang, dan alternatif lain.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'Terima kasih sudah berbagi. Untuk memahami situasi Anda lebih dalam, saya ingin bertanya:\n\n1. Apa yang paling penting bagi Anda dalam keputusan ini?\n2. Jika Anda memilih opsi A, apa dampak jangka pendek dan jangka panjangnya?\n3. Bagaimana perasaan Anda saat membayangkan setiap pilihan?',
      
      'Saya mendengar kekhawatiran Anda. Mari kita eksplorasi lebih dalam:\n\n• Apa saja alternatif yang sudah Anda pertimbangkan?\n• Faktor apa yang membuat Anda ragu?\n• Jika teman Anda menghadapi situasi serupa, apa saran Anda untuk mereka?',
      
      'Menarik. Saya ingin membantu Anda melihat dari sudut pandang yang berbeda:\n\n- Bagaimana keputusan ini sejalan dengan tujuan jangka panjang Anda?\n- Apa risiko terburuk yang mungkin terjadi?\n- Apa peluang terbaik yang bisa Anda raih?',
      
      'Berdasarkan diskusi kita, sepertinya Anda sudah mulai menemukan arah. Beberapa hal yang bisa Anda pertimbangkan:\n\n✓ Pro dan kontra dari setiap pilihan\n✓ Nilai-nilai pribadi yang terlibat\n✓ Dampak terhadap orang-orang terdekat\n\nApakah ada aspek lain yang ingin kita eksplorasi?'
    ];
    
    return responses[Math.min(messages.length / 2, responses.length - 1)];
  };

  const handleConfirmDecision = () => {
    setShowConfirmation(true);
  };

  const handleFinalizeDecision = (decision: string) => {
    console.log('Decision confirmed:', decision);
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-8 h-8 text-teal" />
              <div>
                <h1 className="text-xl font-bold text-navy">MANTAP</h1>
                <div className="flex items-center gap-2 mt-1">
                  <BriefcaseIcon className="w-4 h-4 text-blue" />
                  <span className="text-sm text-gray-600">Domain: {domainLabels[currentDomain]}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleConfirmDecision}
              className="flex items-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Konfirmasi Keputusan
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-100 rounded-xl p-5 mb-6 shadow-sm">
            <p className="text-sm text-blue font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Tips untuk diskusi yang efektif:
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Jangan ragu berbagi detail. Semakin banyak konteks yang Anda berikan, 
              semakin baik saya bisa membantu mengeksplorasi pilihan-pilihan Anda.
            </p>
          </div>

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              explanation={message.explanation}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isTyping}
          placeholder="Ceritakan situasi Anda atau ajukan pertanyaan..."
        />
      </div>

      {showConfirmation && (
        <ConfirmationModal
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleFinalizeDecision}
        />
      )}
    </div>
  );
}

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: (decision: string) => void;
}

function ConfirmationModal({ onClose, onConfirm }: ConfirmationModalProps) {
  const [decision, setDecision] = useState('');
  const [reasoning, setReasoning] = useState('');

  const handleSubmit = () => {
    if (decision.trim() && reasoning.trim()) {
      onConfirm(JSON.stringify({ decision, reasoning }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-navy mb-2">Konfirmasi Keputusan</h3>
            <p className="text-gray-600">
              Tuliskan keputusan final Anda dan alasan di baliknya untuk disimpan ke Decision Journal.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Keputusan Anda
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="Contoh: Saya memutuskan untuk pindah kerja ke perusahaan baru"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Alasan & Pertimbangan
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue min-h-[120px]"
              placeholder="Jelaskan mengapa Anda memilih keputusan ini, apa pertimbangan utamanya..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!decision.trim() || !reasoning.trim()}
            className="flex items-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Simpan ke Decision Journal
          </Button>
        </div>
      </div>
    </div>
  );
}
