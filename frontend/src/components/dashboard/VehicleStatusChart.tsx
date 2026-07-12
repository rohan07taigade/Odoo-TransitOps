import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Available", count: 24, color: "#16a34a" }, // green-600
  { name: "On Trip",   count: 18, color: "#2563eb" }, // blue-600
  { name: "In Shop",   count: 6,  color: "#ea580c" }, // orange-600
  { name: "Retired",   count: 3,  color: "#dc2626" }, // red-600
];

export default function VehicleStatusChart() {
  return (
    <div className="glass-panel animate-fade-in h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0 border-b border-white/40">
        <h2 className="text-lg font-bold text-slate-800">
          Vehicle Status
        </h2>
        <div className="flex items-center gap-4">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ background: d.color }}
              />
              <span className="text-xs font-bold text-slate-600">
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart — fills remaining space */}
      <div className="flex-1 px-6 py-6 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            barCategoryGap="28%"
          >
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 13, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "12px",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.5)" }}
              formatter={(value: number) => [`${value} vehicles`, "Count"]}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
