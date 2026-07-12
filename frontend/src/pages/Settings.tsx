import { useForm } from "react-hook-form";

interface SettingsFormData {
  depotName: string;
  currency: string;
  distanceUnit: string;
}

const rbacData = [
  { role: "Fleet Manager", vehicles: "CRUD", drivers: "R", trips: "R", maintenance: "CRUD", fuel_exp: "R", analytics: "All" },
  { role: "Dispatcher", vehicles: "R (available)", drivers: "R (available)", trips: "Create/Dispatch/Complete/Cancel", maintenance: "—", fuel_exp: "Create", analytics: "Trip summary" },
  { role: "Safety Officer", vehicles: "R", drivers: "CRUD", trips: "R", maintenance: "R", fuel_exp: "—", analytics: "Compliance widgets" },
  { role: "Financial Analyst", vehicles: "R", drivers: "R", trips: "R", maintenance: "R (cost view)", fuel_exp: "CRUD", analytics: "Cost/ROI widgets" }
];

const getPermissionStyle = (text: string) => {
  if (text.includes("CRUD") || text === "All") return "text-green-600 font-bold";
  if (text.includes("Create") || text.includes("Dispatch")) return "text-blue-600 font-bold";
  if (text === "—") return "text-slate-300 font-bold";
  return "text-slate-500 font-medium";
};

export default function Settings() {
  const { register, handleSubmit } = useForm<SettingsFormData>({
    defaultValues: {
      depotName: "Gandhinagar Depot GJ4",
      currency: "INR (₹)",
      distanceUnit: "Kilometers"
    }
  });

  const onSubmit = (data: SettingsFormData) => {
    // Mock save
    console.log("Settings saved", data);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Settings
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Settings & RBAC
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - General Settings */}
        <div className="flex-1 lg:max-w-md flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="glass-panel p-6 flex flex-col shadow-sm h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">General</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Depot Name</label>
                <input
                  {...register("depotName")}
                  type="text"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Currency</label>
                <select
                  {...register("currency")}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Distance Unit</label>
                <select
                  {...register("distanceUnit")}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                >
                  <option value="Kilometers">Kilometers</option>
                  <option value="Miles">Miles</option>
                </select>
              </div>

              <div className="pt-6 mt-auto">
                <button
                  type="submit"
                  className="w-full px-5 py-2.5 text-sm font-bold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - RBAC Table */}
        <div className="flex-[2.5] flex flex-col glass-panel overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0">
            <h2 className="text-lg font-bold text-slate-800">Role-Based Access (RBAC)</h2>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/95 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Vehicles</th>
                  <th className="px-6 py-4 font-semibold">Drivers</th>
                  <th className="px-6 py-4 font-semibold">Trips</th>
                  <th className="px-6 py-4 font-semibold">Maintenance</th>
                  <th className="px-6 py-4 font-semibold">Fuel/Exp.</th>
                  <th className="px-6 py-4 font-semibold">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rbacData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-800">{row.role}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.vehicles)}`}>{row.vehicles}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.drivers)}`}>{row.drivers}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.trips)}`}>{row.trips}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.maintenance)}`}>{row.maintenance}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.fuel_exp)}`}>{row.fuel_exp}</td>
                    <td className={`px-6 py-4 ${getPermissionStyle(row.analytics)}`}>{row.analytics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
