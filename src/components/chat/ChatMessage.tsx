import { useState } from 'react';
import { SparklesIcon, LightBulbIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
  explanation?: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, explanation, timestamp }: ChatMessageProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const isAI = role === 'ai';

  return (
    <div className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal to-blue rounded-xl flex items-center justify-center shadow-md">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isAI ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 shadow-sm ${
            isAI
              ? 'bg-white border border-gray-100 text-gray-800'
              : 'bg-gradient-to-br from-blue to-blue-700 text-white shadow-blue-200'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        
        {isAI && explanation && (
          <div className="mt-3">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-sm text-teal hover:text-opacity-80 transition-all font-bold px-2 py-1 rounded-lg hover:bg-teal/5"
            >
              <LightBulbIcon className="w-4 h-4" />
              <span>Kenapa saran ini?</span>
              {showExplanation ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            
            {showExplanation && (
              <div className="mt-2 p-4 bg-gradient-to-br from-white to-blue-50 border-l-4 border-teal rounded-r-xl shadow-sm text-sm text-gray-700 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="font-bold text-navy mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <SparklesIcon className="w-3 h-3 text-teal" />
                  Insight Logika:
                </p>
                <p className="leading-relaxed italic">{explanation}</p>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-1 px-2">
          {timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 bg-blue rounded-full flex items-center justify-center order-2">
          <span className="text-white font-semibold text-sm">You</span>
        </div>
      )}
    </div>
  );
}
