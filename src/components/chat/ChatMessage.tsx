import { useState } from 'react';
import { LightBulbIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Alternative } from '../../types';
import { ComparisonMatrix } from '../decision/ComparisonMatrix';

interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
  explanation?: string;
  alternatives?: Alternative[];
  timestamp: Date;
}

export function ChatMessage({ role, content, explanation, alternatives, timestamp }: ChatMessageProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const isAI = role === 'ai';

  return (
    <div className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-teal/20">
          <img src="/logo.png" alt="Guido.AI" className="w-10 h-10 object-contain" />
        </div>
      )}
      
      <div className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${isAI ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md ${
            isAI
              ? "border border-white/10 bg-white/5 text-slate-200 shadow-none hover:border-white/20 hover:bg-white/[0.07]"
              : "bg-gradient-to-br from-teal to-blue text-white shadow-lg shadow-teal-950/30 hover:shadow-xl hover:shadow-teal-950/40"
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{renderMarkdown(content)}</div>
          
          {isAI && alternatives && alternatives.length > 0 && (
            <ComparisonMatrix alternatives={alternatives} />
          )}
        </div>
        
        {isAI && explanation && (
          <div className="mt-3">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-teal-300 transition-all hover:bg-teal/10 hover:text-teal-200 hover:scale-105 active:scale-95"
            >
              <LightBulbIcon className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-12' : ''}`} />
              <span>Kenapa saran ini?</span>
              {showExplanation ? (
                <ChevronUpIcon className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 transition-transform" />
              )}
            </button>
            
            {showExplanation && (
              <div className="mt-2 rounded-r-xl border-l-4 border-teal bg-teal/10 p-4 text-sm text-slate-300 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
                  <LightBulbIcon className="w-3 h-3 text-teal" />
                  Insight Logika:
                </p>
                <p className="leading-relaxed italic">{explanation}</p>
              </div>
            )}
          </div>
        )}
        
        <p className="mt-1 px-2 text-xs text-slate-500">
          {timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {!isAI && (
        <div className="order-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue/80">
          <span className="text-white font-semibold text-sm">You</span>
        </div>
      )}
    </div>
  );
}

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
