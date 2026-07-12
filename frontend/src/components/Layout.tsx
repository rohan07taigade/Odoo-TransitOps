import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";

/* ─── Nav Config ─── */
interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard",        path: "/dashboard",      icon: <LayoutDashboard size={18} /> },
  { label: "Fleet",            path: "/fleet",           icon: <Truck size={18} /> },
  { label: "Drivers",          path: "/drivers",         icon: <Users size={18} /> },
  { label: "Trips",            path: "/trips",           icon: <Route size={18} /> },
  { label: "Maintenance",      path: "/maintenance",     icon: <Wrench size={18} /> },
  { label: "Fuel & Expenses",  path: "/fuel-expenses",   icon: <Fuel size={18} /> },
  { label: "Analytics",        path: "/analytics",       icon: <BarChart3 size={18} /> },
  { label: "Settings",         path: "/settings",        icon: <Settings size={18} /> },
];

const teamAvatars = ["AK", "JP", "SM"];

/* ─── Layout Component ─── */
export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Sidebar (Light, Docked) ── */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-slate-200 flex flex-col z-30 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 shrink-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            TO
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-800">
            Transit<span style={{ color: "var(--accent)" }}>Ops</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 mt-4">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="group flex items-center gap-4 py-3 px-4 mb-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={({ isActive }) => ({
                    color: isActive ? "var(--accent)" : "#475569", // slate-600
                    background: isActive ? "var(--accent-subtle)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                  })}
                  onMouseEnter={(e) => {
                    const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                    if (!isActive) e.currentTarget.style.background = "#f1f5f9"; // slate-100
                  }}
                  onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="flex-shrink-0 transition-colors duration-200">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-screen" style={{ marginLeft: "240px" }}>
        {/* Top Header Bar (Glass) */}
        <header className="flex items-center justify-end px-8 py-3 shrink-0 z-20 bg-white/60 backdrop-blur-md border-b border-white/50 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Team avatars */}
            <div className="flex -space-x-3">
              {teamAvatars.map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 bg-white border-2 border-white/60 shadow-sm"
                  title={initials}
                >
                  {initials}
                </div>
              ))}
            </div>

            {/* Role badge */}
            <div className="flex items-center">
              <span className="bg-orange-100/80 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                FLEET MANAGER
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
