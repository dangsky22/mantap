import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Alternative } from "../../types";

interface ComparisonMatrixProps {
  alternatives: Alternative[];
}

export function ComparisonMatrix({ alternatives }: ComparisonMatrixProps) {
  if (!alternatives || alternatives.length === 0) return null;

  const maxScore = Math.max(...alternatives.map((a) => a.score || 0));

  return (
    <div className="my-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1 w-1 rounded-full bg-teal-400" />
        <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
          Perbandingan Alternatif
        </h4>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {alternatives.map((alt, index) => {
          const isTopScore = alt.score === maxScore;
          return (
            <div
              key={index}
              className={`rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in zoom-in-95 duration-300 ${
                isTopScore
                  ? "border-teal-500/40 bg-gradient-to-br from-teal-500/10 to-blue-500/10 ring-2 ring-teal-500/20"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <h5 className="flex-1 text-sm font-bold text-white leading-tight">
                  {alt.name}
                </h5>
                {alt.score !== undefined && (
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold ${
                      isTopScore
                        ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40"
                        : "bg-white/5 text-slate-300"
                    }`}
                  >
                    <span className="text-lg">{alt.score}</span>
                    <span className="text-[9px] text-slate-500">/10</span>
                  </div>
                )}
              </div>

              {/* Score Bar */}
              {alt.score !== undefined && (
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isTopScore
                        ? "bg-gradient-to-r from-teal-400 to-blue-400"
                        : "bg-slate-500"
                    }`}
                    style={{ width: `${(alt.score / 10) * 100}%` }}
                  />
                </div>
              )}

              {/* Pros */}
              {alt.pros && alt.pros.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <CheckCircleIcon className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                      Keuntungan
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {alt.pros.map((pro, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                        <span className="leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {alt.cons && alt.cons.length > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <XCircleIcon className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      Kerugian
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {alt.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                        <span className="leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Top Score Badge */}
              {isTopScore && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2 py-1 text-[10px] font-bold text-teal-300">
                  <span>⭐</span>
                  <span>Skor Tertinggi</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Note */}
      <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-slate-400 italic">
        💡 Skor dihitung berdasarkan konteks yang kamu berikan. Keputusan akhir
        tetap milikmu.
      </div>
    </div>
  );
}
