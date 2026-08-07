import { SparklesIcon } from "@heroicons/react/24/outline";

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ suggestions, onSelect, disabled = false }: QuickRepliesProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center gap-2 mb-3 px-2">
        <SparklesIcon className="h-4 w-4 text-teal-400" />
        <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
          Respons Cepat
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="group relative rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition-all hover:border-teal/40 hover:bg-teal/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 animate-in fade-in zoom-in-95 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="relative z-10">{suggestion}</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal/0 via-teal/5 to-blue/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
