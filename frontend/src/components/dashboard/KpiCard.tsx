import type { ReactNode } from "react";

export interface KpiCardData {
  label: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string;
  bgClass: string;
  trend?: { value: string; positive: boolean };
}

export default function KpiCard({ data }: { data: KpiCardData }) {
  return (
    <div
      className="glass-panel relative p-4 flex flex-col justify-between h-full min-h-[110px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in group"
    >
      {/* Icon — absolutely positioned top-right */}
      <div
        className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center ${data.bgClass} ${data.colorClass} shadow-sm`}
      >
        {data.icon}
      </div>

      {/* Text content */}
      <div className="relative pr-10">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis text-slate-500">
          {data.label}
        </p>
        <p className="text-2xl font-extrabold tracking-tight leading-none text-slate-800">
          {data.value}
        </p>
      </div>

      {/* Trend or placeholder to maintain equal height */}
      <div className="mt-2 h-4">
        {data.trend ? (
          <p
            className={`text-[10px] font-bold ${
              data.trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.trend.positive ? "↑" : "↓"} {data.trend.value}
          </p>
        ) : null}
      </div>
    </div>
  );
}
