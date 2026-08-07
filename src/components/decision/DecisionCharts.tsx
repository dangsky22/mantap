import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { DecisionDomain } from "../../types";

interface DomainStats {
  domain: DecisionDomain;
  total: number;
  completed: number;
  avgConfidence: number;
  avgDecisionTime: number;
}

const domainLabels: Record<DecisionDomain, string> = {
  karier: "Karier",
  pendidikan: "Pendidikan",
  relasi: "Relasi",
  finansial: "Finansial",
};

const domainColors: Record<DecisionDomain, string> = {
  karier: "#3b82f6",     // blue-500
  pendidikan: "#14b8a6",  // teal-500
  relasi: "#ec4899",     // pink-500
  finansial: "#22c55e",  // green-500
};

export function DecisionRadarChart({ data }: { data: DomainStats[] }) {
  const chartData = data.map((d) => ({
    subject: domainLabels[d.domain],
    value: d.avgConfidence * 10, // Scale to 100
    fullMark: 100,
  }));

  if (data.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center p-6 border border-white/5 bg-white/[0.01] rounded-2xl">
        <p className="text-xs text-slate-500 italic max-w-[180px]">
          Butuh minimal 3 domain keputusan untuk melihat profil radar pengambilan keputusanmu.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
          />
          <Radar
            name="Confidence Score"
            dataKey="value"
            stroke="#2dd4bf"
            fill="#2dd4bf"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#f1f5f9",
              fontSize: "12px",
              borderRadius: "8px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DomainActivityChart({ data }: { data: DomainStats[] }) {
  const chartData = data.map((d) => ({
    name: domainLabels[d.domain],
    total: d.total,
    domain: d.domain,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f1f5f9",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={35}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={domainColors[entry.domain as DecisionDomain]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
