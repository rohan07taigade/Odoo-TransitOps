import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Droplet, Activity, DollarSign, TrendingUp } from "lucide-react";
import KpiCard, { type KpiCardData } from "../components/dashboard/KpiCard";

const kpiCards: KpiCardData[] = [
  {
    label: "Fuel Efficiency",
    value: "8.4 km/l",
    icon: <Droplet size={18} />,
    colorClass: "text-blue-700",
    bgClass: "bg-blue-100/80",
    trend: { value: "+0.2 vs last month", positive: true },
  },
  {
    label: "Fleet Utilization",
    value: "81%",
    icon: <Activity size={18} />,
    colorClass: "text-green-700",
    bgClass: "bg-green-100/80",
    trend: { value: "+2% vs last month", positive: true },
  },
  {
    label: "Operational Cost",
    value: "₹34,070",
    icon: <DollarSign size={18} />,
    colorClass: "text-orange-700",
    bgClass: "bg-orange-100/80",
    trend: { value: "-5% vs last month", positive: true },
  },
  {
    label: "Vehicle ROI",
    value: "14.2%",
    icon: <TrendingUp size={18} />,
    colorClass: "text-amber-700",
    bgClass: "bg-amber-100/80",
    trend: { value: "+1.1% vs last year", positive: true },
  },
];

const revenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 11000 },
  { name: "Apr", revenue: 18000 },
  { name: "May", revenue: 14000 },
  { name: "Jun", revenue: 21000 },
  { name: "Jul", revenue: 19000 },
];

export default function Analytics() {
  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6 pb-6">
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Analytics
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Reports and performance insights
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg text-sm font-bold transition-all shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {kpiCards.map((card, i) => (
          <div key={card.label} style={{ animationDelay: `${i * 40}ms` }} className="h-full">
            <KpiCard data={card} />
          </div>
        ))}
      </div>
      <div className="text-[10px] font-medium text-slate-400 shrink-0">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </div>

      {/* Two-Column Section */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - Monthly Revenue */}
        <div className="flex-[2] glass-panel p-5 flex flex-col shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Monthly Revenue</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN - Top Costliest Vehicles */}
        <div className="flex-1 glass-panel p-5 flex flex-col shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Top Costliest Vehicles</h2>
          
          <div className="flex-1 flex flex-col gap-6 justify-center">
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-800">TRUCK-11</span>
                <span className="text-slate-500">₹26,400</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-800">MINI-03</span>
                <span className="text-slate-500">₹8,250</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-800">VAN-05</span>
                <span className="text-slate-500">₹3,270</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
