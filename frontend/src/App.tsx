import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Fleet from "./pages/Fleet";
import FuelExpenses from "./pages/FuelExpenses";
import Login from "./pages/Login";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import Trips from "./pages/Trips";
import { useAuthStore } from "./stores/authStore";

function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/fuel-expenses" element={<FuelExpenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

/** Placeholder for unimplemented pages */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary text-sm">This page is under construction.</p>
      </div>
    </div>
  );
}

export default App;
