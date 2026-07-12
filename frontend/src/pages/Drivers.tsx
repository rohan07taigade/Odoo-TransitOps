import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";

type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";

interface Driver {
  name: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string;
  contact_number: string;
  trip_completion: string;
  safety_status: DriverStatus;
  status: DriverStatus;
}

const initialMockData: Driver[] = [
  { name: "Alex", license_number: "DL-88213", license_category: "LMV", license_expiry_date: "12/2028", contact_number: "98765xxxxx", trip_completion: "96%", safety_status: "Available", status: "Available" },
  { name: "John", license_number: "DL-44120", license_category: "HMV", license_expiry_date: "03/2025", contact_number: "98220xxxxx", trip_completion: "81%", safety_status: "Suspended", status: "Suspended" },
  { name: "Priya", license_number: "DL-77031", license_category: "LMV", license_expiry_date: "08/2027", contact_number: "99110xxxxx", trip_completion: "99%", safety_status: "On Trip", status: "On Trip" },
  { name: "Suresh", license_number: "DL-90045", license_category: "HMV", license_expiry_date: "01/2027", contact_number: "97440xxxxx", trip_completion: "89%", safety_status: "Available", status: "Off Duty" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100/80 text-green-700 border-green-200";
    case "On Trip":
      return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "Suspended":
      return "bg-orange-100/80 text-orange-700 border-orange-200";
    case "Off Duty":
      return "bg-slate-100/80 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const isExpired = (expiryStr: string) => {
  const parts = expiryStr.split('/');
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;
  return false;
};

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(initialMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState<Partial<Driver>>({
    license_category: "LMV",
    status: "Available",
    safety_status: "Available",
  });

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      return d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             d.license_number.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [drivers, searchQuery]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.license_number) {
      setDrivers([
        ...drivers,
        {
          name: formData.name || "",
          license_number: formData.license_number || "",
          license_category: formData.license_category || "LMV",
          license_expiry_date: formData.license_expiry_date || "",
          contact_number: formData.contact_number || "",
          trip_completion: formData.trip_completion || "0%",
          safety_status: (formData.status as DriverStatus) || "Available",
          status: (formData.status as DriverStatus) || "Available",
        }
      ]);
      setIsModalOpen(false);
      setFormData({ license_category: "LMV", status: "Available", safety_status: "Available" });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Drivers
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Manage driver profiles and safety compliance
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
              placeholder="Search Name or License..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 flex flex-col glass-panel animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-semibold">Driver</th>
                <th className="px-6 py-4 font-semibold">License No.</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Expiry</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold text-right">Trip Completion %</th>
                <th className="px-6 py-4 font-semibold text-center">Safety Status</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.map((driver, idx) => {
                const expired = isExpired(driver.license_expiry_date);
                return (
                  <tr key={driver.license_number} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{driver.name}</td>
                    <td className="px-6 py-4 text-slate-600">{driver.license_number}</td>
                    <td className="px-6 py-4 text-slate-600">{driver.license_category}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 ${expired ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                        {driver.license_expiry_date}
                        {expired && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                            EXPIRED
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{driver.contact_number}</td>
                    <td className="px-6 py-4 text-slate-600 text-right tabular-nums">{driver.trip_completion}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(driver.safety_status)}`}>
                        {driver.safety_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No drivers found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 font-medium shrink-0 bg-white/40 rounded-b-2xl">
          Rule: Expired license or Suspended status blocks assignment to trips
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add New Driver</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">License Number *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. DL-12345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.license_number || ""}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">License Category</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                    value={formData.license_category || "LMV"}
                    onChange={(e) => setFormData({ ...formData, license_category: e.target.value })}
                  >
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">License Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.license_expiry_date || ""}
                    onChange={(e) => setFormData({ ...formData, license_expiry_date: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    value={formData.contact_number || ""}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                    value={formData.status || "Available"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
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
                Save Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
