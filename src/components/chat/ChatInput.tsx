import { useState, KeyboardEvent } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Ketik pesan Anda...' }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/5 bg-transparent p-4">
      <div className="flex gap-3 items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[48px] sm:min-h-[60px] max-h-[150px] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:bg-white/5"
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 rounded-xl bg-gradient-to-br from-teal to-blue p-3 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Tekan Enter untuk kirim, Shift+Enter untuk baris baru
      </p>
    </div>
  );
}
