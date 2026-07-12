import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";

type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

interface Vehicle {
  registration_number: string;
  name_model: string;
  type: string;
  max_load_capacity: string;
  odometer: string;
  acquisition_cost: string;
  status: VehicleStatus;
}

const initialMockData: Vehicle[] = [
  { registration_number: "GJ01AB4523", name_model: "VAN-05", type: "Van", max_load_capacity: "500 kg", odometer: "74,000", acquisition_cost: "6,20,000", status: "Available" },
  { registration_number: "GJ01AB9987", name_model: "TRUCK-11", type: "Truck", max_load_capacity: "5 Ton", odometer: "182,000", acquisition_cost: "24,50,000", status: "On Trip" },
  { registration_number: "GJ01AB1120", name_model: "MINI-03", type: "Mini", max_load_capacity: "1 Ton", odometer: "66,000", acquisition_cost: "4,10,000", status: "In Shop" },
  { registration_number: "GJ01AB0087", name_model: "VAN-09", type: "Van", max_load_capacity: "750 kg", odometer: "241,900", acquisition_cost: "5,90,000", status: "Retired" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100/80 text-green-700 border-green-200";
    case "On Trip":
      return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "In Shop":
      return "bg-orange-100/80 text-orange-700 border-orange-200";
    case "Retired":
      return "bg-red-100/80 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    type: "Van",
    status: "Available"
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = v.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All" || v.type === typeFilter;
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchQuery, typeFilter, statusFilter]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.registration_number && formData.name_model) {
      setVehicles([
        ...vehicles,
        {
          registration_number: formData.registration_number || "",
          name_model: formData.name_model || "",
          type: formData.type || "Van",
          max_load_capacity: formData.max_load_capacity || "",
          odometer: formData.odometer || "0",
          acquisition_cost: formData.acquisition_cost || "0",
          status: (formData.status as VehicleStatus) || "Available",
        }
      ]);
      setIsModalOpen(false);
      setFormData({ type: "Van", status: "Available" });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Fleet
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Manage your vehicle registry
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0 animate-fade-in" style={{ animationDelay: '50ms' }}>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Reg No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent w-full sm:w-64 transition-all"
            />
          </div>

          {/* Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Mini">Mini</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 flex flex-col glass-panel animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-semibold">Registration No.</th>
                <th className="px-6 py-4 font-semibold">Name/Model</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold text-right">Odometer</th>
                <th className="px-6 py-4 font-semibold text-right">Acquisition Cost</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((vehicle, idx) => (
                <tr key={vehicle.registration_number} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-800">{vehicle.registration_number}</td>
                  <td className="px-6 py-4 text-slate-600">{vehicle.name_model}</td>
                  <td className="px-6 py-4 text-slate-600">{vehicle.type}</td>
                  <td className="px-6 py-4 text-slate-600">{vehicle.max_load_capacity}</td>
                  <td className="px-6 py-4 text-slate-600 text-right tabular-nums">{vehicle.odometer}</td>
                  <td className="px-6 py-4 text-slate-600 text-right tabular-nums">₹{vehicle.acquisition_cost}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No vehicles found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 font-medium shrink-0 bg-white/40 rounded-b-2xl">
          Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Registration Number *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. MH01AB1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.registration_number || ""}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name/Model *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. VAN-10"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.name_model || ""}
                    onChange={(e) => setFormData({ ...formData, name_model: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                    value={formData.type || "Van"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Mini">Mini</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Max Load Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 kg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.max_load_capacity || ""}
                    onChange={(e) => setFormData({ ...formData, max_load_capacity: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Odometer</label>
                  <input
                    type="text"
                    placeholder="e.g. 10,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.odometer || ""}
                    onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Acquisition Cost</label>
                  <input
                    type="text"
                    placeholder="e.g. 5,00,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.acquisition_cost || ""}
                    onChange={(e) => setFormData({ ...formData, acquisition_cost: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                    value={formData.status || "Available"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
            </form>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
