import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { DecisionDomain } from "../../types";

interface ActivityEvent {
  id: string;
  type: "session_started" | "decision_made" | "session_updated";
  domain: DecisionDomain;
  title: string;
  description: string;
  timestamp: Date;
}

const domainIcons: Record<DecisionDomain, string> = {
  karier: "💼",
  pendidikan: "🎓",
  relasi: "💖",
  finansial: "💰",
};

const typeColors = {
  session_started: "bg-blue-500",
  decision_made: "bg-teal-500",
  session_updated: "bg-indigo-500",
};

const typeIcons = {
  session_started: <ChatBubbleLeftRightIcon className="h-3 w-3 text-white" />,
  decision_made: <CheckCircleIcon className="h-3 w-3 text-white" />,
  session_updated: <PencilSquareIcon className="h-3 w-3 text-white" />,
};

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
        <p className="text-sm italic">Belum ada aktivitas terbaru.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
      {events.map((event, idx) => (
        <div key={event.id} className="relative flex items-start gap-4 animate-in fade-in slide-in-from-left-3" style={{ animationDelay: `${idx * 100}ms` }}>
          <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-[#080B10] ${typeColors[event.type]} z-10`}>
            {typeIcons[event.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-white truncate">
                {event.title}
              </h4>
              <time className="shrink-0 text-[10px] font-medium text-slate-500">
                {formatRelativeTime(event.timestamp)}
              </time>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {domainIcons[event.domain]} {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}h yang lalu`;
  if (hours > 0) return `${hours}j yang lalu`;
  if (minutes > 0) return `${minutes}m yang lalu`;
  return "Baru saja";
}
