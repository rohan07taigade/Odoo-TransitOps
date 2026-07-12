import {
  Truck,
  CheckCircle,
  Wrench,
  Navigation,
  Clock,
  UserCheck,
  Gauge,
} from "lucide-react";
import { useState, useEffect } from "react";

import FilterBar from "@/components/dashboard/FilterBar";
import KpiCard, { type KpiCardData } from "@/components/dashboard/KpiCard";
import RecentTripsTable from "@/components/dashboard/RecentTripsTable";
import VehicleStatusChart from "@/components/dashboard/VehicleStatusChart";

/* ─── KPI Mock Data ─── */
const kpiCards: KpiCardData[] = [
  {
    label: "Active Vehicles",
    value: 48,
    icon: <Truck size={20} strokeWidth={1.5} />,
    colorClass: "text-[#d97706]",
    bgClass: "bg-[#d97706]/10 border-2 border-[#d97706]/30",
    glowClass: "hover:border-[#d97706]",
    trend: { value: "+3 this week", positive: true, data: [10, 25, 30, 28, 40, 48] },
  },
  {
    label: "Available Vehicles",
    value: 24,
    icon: <CheckCircle size={20} strokeWidth={1.5} />,
    colorClass: "text-[#22c55e]",
    bgClass: "bg-[#22c55e]/10 border-2 border-[#22c55e]/30",
    glowClass: "hover:border-[#22c55e]",
    trend: { value: "+2 today", positive: true, data: [15, 12, 18, 16, 22, 24] },
  },
  {
    label: "In Maintenance",
    value: 6,
    icon: <Wrench size={20} strokeWidth={1.5} />,
    colorClass: "text-[#ef4444]",
    bgClass: "bg-[#ef4444]/10 border-2 border-[#ef4444]/30",
    glowClass: "hover:border-[#ef4444]",
    trend: { value: "-1 from yesterday", positive: true, data: [10, 9, 8, 8, 7, 6] },
  },
  {
    label: "Active Trips",
    value: 18,
    icon: <Navigation size={20} strokeWidth={1.5} />,
    colorClass: "text-[#3b82f6]",
    bgClass: "bg-[#3b82f6]/10 border-2 border-[#3b82f6]/30",
    glowClass: "hover:border-[#3b82f6]",
    trend: { value: "+5 today", positive: true, data: [5, 8, 12, 11, 15, 18] },
  },
  {
    label: "Pending Trips",
    value: 7,
    icon: <Clock size={20} strokeWidth={1.5} />,
    colorClass: "text-[var(--text-secondary)]",
    bgClass: "bg-[var(--surface)] border-2 border-[var(--border)]",
    glowClass: "hover:border-[var(--text-secondary)]",
  },
  {
    label: "Drivers On Duty",
    value: 32,
    icon: <UserCheck size={20} strokeWidth={1.5} />,
    colorClass: "text-[#22c55e]",
    bgClass: "bg-[#22c55e]/10 border-2 border-[#22c55e]/30",
    glowClass: "hover:border-[#22c55e]",
    trend: { value: "85% capacity", positive: true, data: [20, 22, 26, 25, 30, 32] },
  },
  {
    label: "Fleet Utilization",
    value: 73,
    icon: <Gauge size={20} strokeWidth={1.5} />,
    colorClass: "text-[#d97706]",
    bgClass: "bg-[#d97706]/10 border-2 border-[#d97706]/30",
    glowClass: "hover:border-[#d97706]",
    trend: { value: "+4% vs last week", positive: true, data: [65, 66, 68, 69, 70, 73] },
  },
];

/* ─── Dashboard Page ─── */
export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6 animate-fade-in">
      {/* Page Title + Filters (Shrink to fit) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 stagger-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {greeting}, Rohan
          </h1>
          <p className="text-lg font-medium mt-1 text-[var(--text-secondary)]">
            Here's what's happening with your fleet today.
          </p>
        </div>
        <FilterBar />
      </div>

      {/* KPI Cards Grid (Shrink to fit) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 shrink-0">
        {kpiCards.map((card, i) => (
          <div key={card.label} className={`h-full stagger-${(i % 5) + 1}`}>
            <KpiCard data={card} delayMs={i * 100} />
          </div>
        ))}
      </div>

      {/* Bottom Section — Takes remaining vertical space */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Recent Trips (wider) */}
        <div className="lg:col-span-3 h-full stagger-3">
          <RecentTripsTable />
        </div>

        {/* Right: Vehicle Status Chart */}
        <div className="lg:col-span-2 h-full stagger-4">
          <VehicleStatusChart />
        </div>
      </div>
    </div>
  );
}
