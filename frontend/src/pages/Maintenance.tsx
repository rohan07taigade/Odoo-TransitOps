import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

type ServiceStatus = "In Shop" | "Completed";

interface ServiceRecord {
  vehicle: string;
  service: string;
  cost: string;
  status: ServiceStatus;
}

const mockServiceData: ServiceRecord[] = [
  { vehicle: "VAN-05", service: "Oil Change", cost: "2,500", status: "In Shop" },
  { vehicle: "TRUCK-11", service: "Engine Repair", cost: "18,000", status: "Completed" },
  { vehicle: "MINI-03", service: "Tyre Replace", cost: "6,200", status: "In Shop" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100/80 text-green-700 border-green-200";
    case "In Shop":
      return "bg-orange-100/80 text-orange-700 border-orange-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

interface MaintenanceFormData {
  vehicle: string;
  service: string;
  cost: number;
  date: string;
  status: "Active" | "Closed";
}

export default function Maintenance() {
  const [records, setRecords] = useState<ServiceRecord[]>(mockServiceData);
  
  const { register, handleSubmit, reset } = useForm<MaintenanceFormData>({
    defaultValues: {
      vehicle: "VAN-05",
      service: "",
      cost: 0,
      date: "",
      status: "Active"
    }
  });

  const onSubmit = (data: MaintenanceFormData) => {
    const newRecord: ServiceRecord = {
      vehicle: data.vehicle,
      service: data.service,
      cost: data.cost.toLocaleString(), // simple formatting
      status: data.status === "Active" ? "In Shop" : "Completed"
    };
    
    setRecords([newRecord, ...records]);
    reset();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Maintenance
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Vehicle Service & Repair Log
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - Log Service Record form card */}
        <div className="flex-1 lg:max-w-md flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="glass-panel p-6 flex flex-col shadow-sm">
            
            <h2 className="text-lg font-bold text-slate-800 mb-5">Log Service Record</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Vehicle *</label>
                <select
                  {...register("vehicle", { required: true })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="MINI-03">MINI-03</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Service Type *</label>
                <input
                  {...register("service", { required: true })}
                  type="text"
                  placeholder="e.g. Oil Change"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Cost (₹) *</label>
                  <input
                    {...register("cost", { required: true, valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Date *</label>
                  <input
                    {...register("date", { required: true })}
                    type="date"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Status *</label>
                <select
                  {...register("status", { required: true })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-5 py-2.5 text-sm font-bold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col gap-3 text-xs font-medium text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Available</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <ArrowRight size={12} /> creating active record <ArrowRight size={12} />
                  </div>
                  <span className="text-orange-600">In Shop</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600">In Shop</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <ArrowRight size={12} /> closing record, not retired <ArrowRight size={12} />
                  </div>
                  <span className="text-green-600">Available</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Note: In Shop vehicles are removed from the dispatch pool.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Service Log table */}
        <div className="flex-[2] flex flex-col glass-panel overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0">
            <h2 className="text-lg font-bold text-slate-800">Service Log</h2>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold text-right">Cost</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{record.vehicle}</td>
                    <td className="px-6 py-4 text-slate-600">{record.service}</td>
                    <td className="px-6 py-4 text-slate-600 text-right tabular-nums">₹{record.cost}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No service records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
