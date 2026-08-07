import {
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckBadgeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { DecisionDomain } from "../../types";

interface DomainStat {
  domain: DecisionDomain;
  total: number;
  completed: number;
  avgDecisionTime: number;
  avgConfidence: number;
}

const domainMeta: Record<
  DecisionDomain,
  { label: string; icon: string; color: string; bar: string }
> = {
  karier: { label: "Karier", icon: "💼", color: "text-blue-400", bar: "bg-blue-500" },
  pendidikan: { label: "Pendidikan", icon: "🎓", color: "text-teal-400", bar: "bg-teal-500" },
  relasi: { label: "Relasi", icon: "💖", color: "text-pink-400", bar: "bg-pink-500" },
  finansial: { label: "Finansial", icon: "💰", color: "text-green-400", bar: "bg-green-500" },
};

export function InsightGrid({ stats }: { stats: DomainStat[] }) {
  if (stats.length === 0) {
    return null;
  }

  const totalSessions = stats.reduce((sum, s) => sum + s.total, 0);
  const totalCompleted = stats.reduce((sum, s) => sum + s.completed, 0);
  const topDomain = [...stats].sort((a, b) => b.completed - a.completed)[0];
  const avgTime =
    stats.reduce((sum, s) => sum + s.avgDecisionTime, 0) / stats.length;

  const insights = [
    {
      icon: <CheckBadgeIcon className="h-4 w-4" />,
      color: "text-teal-400 bg-teal/10 border-teal-400/20",
      label: "Completion Rate",
      value: totalSessions ? `${Math.round((totalCompleted / totalSessions) * 100)}%` : "0%",
      desc: `${totalCompleted} dari ${totalSessions} sesi`,
    },
    {
      icon: <ClockIcon className="h-4 w-4" />,
      color: "text-blue-400 bg-blue/10 border-blue-400/20",
      label: "Rata-rata Waktu Decide",
      value: `${avgTime.toFixed(1)} hari`,
      desc: "Dari problem sampai keputusan",
    },
    {
      icon: <HeartIcon className="h-4 w-4" />,
      color: "text-pink-400 bg-pink-500/10 border-pink-400/20",
      label: "Domain Teraktif",
      value: topDomain ? domainMeta[topDomain.domain].label : "-",
      desc: topDomain ? `${topDomain.completed} keputusan final` : "Belum ada data",
    },
    {
      icon: <ArrowTrendingUpIcon className="h-4 w-4" />,
      color: "text-green-400 bg-green-500/10 border-green-400/20",
      label: "Avg Confidence",
      value: stats.length
        ? `${(stats.reduce((sum, s) => sum + s.avgConfidence, 0) / stats.length).toFixed(1)}/10`
        : "-",
      desc: "Tingkat keyakinan keputusan",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {insights.map((insight, idx) => (
        <div
          key={insight.label}
          className="rounded-2xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.04] animate-in fade-in zoom-in-95 duration-300"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${insight.color}`}>
            {insight.icon}
          </div>
          <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {insight.label}
          </p>
          <p className="mt-1 text-lg font-extrabold text-white">{insight.value}</p>
          <p className="text-[11px] text-slate-500">{insight.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function DomainPerformanceBar({ stats }: { stats: DomainStat[] }) {
  if (stats.length === 0) return null;

  return (
    <div className="space-y-3.5">
      {stats.map((stat, idx) => {
        const meta = domainMeta[stat.domain];
        const percent = stat.total
          ? Math.round((stat.completed / stat.total) * 100)
          : 0;
        return (
          <div key={stat.domain} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 120}ms` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </span>
              <span className={`text-xs font-bold ${meta.color}`}>
                {stat.completed}/{stat.total} selesai
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${meta.bar} transition-all duration-700 ease-out`}
                style={{ width: `${percent}%`, opacity: 0.8 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
