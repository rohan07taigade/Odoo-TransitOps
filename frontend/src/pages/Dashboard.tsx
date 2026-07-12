import {
  Truck,
  CheckCircle,
  Wrench,
  Navigation,
  Clock,
  UserCheck,
  Gauge,
} from "lucide-react";

import FilterBar from "../components/dashboard/FilterBar";
import KpiCard, { type KpiCardData } from "../components/dashboard/KpiCard";
import RecentTripsTable from "../components/dashboard/RecentTripsTable";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";

/* ─── KPI Mock Data ─── */
const kpiCards: KpiCardData[] = [
  {
    label: "Active Vehicles",
    value: 48,
    icon: <Truck size={18} />,
    colorClass: "text-orange-700",
    bgClass: "bg-orange-100/80",
    trend: { value: "+3 this week", positive: true },
  },
  {
    label: "Available Vehicles",
    value: 24,
    icon: <CheckCircle size={18} />,
    colorClass: "text-green-700",
    bgClass: "bg-green-100/80",
    trend: { value: "+2 today", positive: true },
  },
  {
    label: "In Maintenance",
    value: 6,
    icon: <Wrench size={18} />,
    colorClass: "text-orange-600",
    bgClass: "bg-orange-100/80",
    trend: { value: "-1 from yesterday", positive: true },
  },
  {
    label: "Active Trips",
    value: 18,
    icon: <Navigation size={18} />,
    colorClass: "text-blue-700",
    bgClass: "bg-blue-100/80",
    trend: { value: "+5 today", positive: true },
  },
  {
    label: "Pending Trips",
    value: 7,
    icon: <Clock size={18} />,
    colorClass: "text-slate-600",
    bgClass: "bg-slate-200/80",
  },
  {
    label: "Drivers On Duty",
    value: 32,
    icon: <UserCheck size={18} />,
    colorClass: "text-green-700",
    bgClass: "bg-green-100/80",
    trend: { value: "85% capacity", positive: true },
  },
  {
    label: "Fleet Utilization",
    value: "73%",
    icon: <Gauge size={18} />,
    colorClass: "text-orange-700",
    bgClass: "bg-orange-100/80",
    trend: { value: "+4% vs last week", positive: true },
  },
];

/* ─── Dashboard Page ─── */
export default function Dashboard() {
  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      {/* Page Title + Filters (Shrink to fit) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Real-time overview of your transit operations
          </p>
        </div>
        <FilterBar />
      </div>

      {/* KPI Cards Grid (Shrink to fit) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 shrink-0">
        {kpiCards.map((card, i) => (
          <div key={card.label} style={{ animationDelay: `${i * 40}ms` }} className="h-full">
            <KpiCard data={card} />
          </div>
        ))}
      </div>

      {/* Bottom Section — Takes remaining vertical space */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Recent Trips (wider) */}
        <div className="lg:col-span-3 h-full">
          <RecentTripsTable />
        </div>

        {/* Right: Vehicle Status Chart */}
        <div className="lg:col-span-2 h-full">
          <VehicleStatusChart />
        </div>
      </div>
    </div>
  );
}
