interface TypingIndicatorProps {
  userName?: string;
}

export function TypingIndicator({ userName = "Guidio.AI" }: TypingIndicatorProps) {
  return (
    <div className="flex gap-4 justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-teal/20">
        <img src="/logo.png" alt="Guidio.AI" className="w-10 h-10 object-contain" />
      </div>
      
      <div className="max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]">
        <div className="rounded-2xl px-5 py-4 border border-white/10 bg-white/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-slate-400">
              {userName} sedang menyusun respons...
            </span>
          </div>
        </div>
        <p className="mt-1 px-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          Aktif sekarang
        </p>
      </div>
    </div>
  );
}
