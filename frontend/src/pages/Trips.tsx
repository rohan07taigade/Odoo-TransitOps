import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowRight, AlertTriangle } from "lucide-react";

const vehicleCapacities: Record<string, number> = {
  "VAN-05": 500,
  "MINI-03": 1000,
  "TRUCK-04": 5000,
};

type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

interface Trip {
  id: string;
  vehicle: string | null;
  driver: string | null;
  source: string;
  destination: string;
  status: TripStatus;
  note: string;
}

const mockTrips: Trip[] = [
  { id: "TR001", vehicle: "VAN-05", driver: "Alex", source: "Gandhinagar Depot", destination: "Ahmedabad Hub", status: "Dispatched", note: "45 min" },
  { id: "TR004", vehicle: "TRUCK-04", driver: "Suresh", source: "Vatva Industrial Area", destination: "Sanand Warehouse", status: "Draft", note: "Awaiting driver" },
  { id: "TR006", vehicle: null, driver: null, source: "Mansa", destination: "Kalol Depot", status: "Cancelled", note: "Vehicle went to shop" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100/80 text-green-700 border-green-200";
    case "Dispatched":
      return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "Draft":
      return "bg-slate-100/80 text-slate-700 border-slate-200";
    case "Cancelled":
      return "bg-red-100/80 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

interface TripFormData {
  source: string;
  destination: string;
  vehicle: string;
  driver: string;
  cargoWeight: number;
  plannedDistance: number;
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  
  const { register, handleSubmit, watch, reset, control } = useForm<TripFormData>({
    defaultValues: {
      source: "",
      destination: "",
      vehicle: "VAN-05",
      driver: "Alex",
      cargoWeight: 0,
      plannedDistance: 0,
    }
  });

  const selectedVehicle = watch("vehicle");
  const cargoWeight = watch("cargoWeight") || 0;
  
  const capacity = vehicleCapacities[selectedVehicle] || 0;
  const isOverweight = cargoWeight > capacity;
  const weightDifference = cargoWeight - capacity;

  const onSubmit = (data: TripFormData) => {
    if (isOverweight) return;
    
    const newTrip: Trip = {
      id: `TR00${trips.length + 7}`,
      vehicle: data.vehicle,
      driver: data.driver,
      source: data.source,
      destination: data.destination,
      status: "Draft", // New trips start as Draft initially
      note: "Just created",
    };
    
    setTrips([newTrip, ...trips]);
    reset();
  };

  const steps = ["Draft", "Dispatched", "Completed", "Cancelled"];
  const currentStep = "Draft";

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto gap-4 lg:gap-6">
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 animate-fade-in">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Trips
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Trip Dispatcher
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - Create Trip form card */}
        <div className="flex-[3] flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="glass-panel p-6 flex flex-col h-full overflow-auto shadow-sm">
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
              {steps.map((step, idx) => {
                const isCurrent = step === currentStep;
                const isPast = false; // We just fix it to Draft for the form
                const isFuture = !isCurrent && !isPast;
                
                return (
                  <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      isCurrent ? 'border-accent bg-accent text-white' : 
                      isFuture ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-accent bg-accent/10 text-accent'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <h2 className="text-lg font-bold text-slate-800 mb-4">Create Trip</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Source *</label>
                  <input
                    {...register("source", { required: true })}
                    type="text"
                    placeholder="e.g. Warehouse A"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Destination *</label>
                  <input
                    {...register("destination", { required: true })}
                    type="text"
                    placeholder="e.g. Factory B"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Vehicle (Available) *</label>
                  <select
                    {...register("vehicle")}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                  >
                    <option value="VAN-05">VAN-05 (500kg)</option>
                    <option value="MINI-03">MINI-03 (1 Ton)</option>
                    <option value="TRUCK-04">TRUCK-04 (5 Ton)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Driver (Available) *</label>
                  <select
                    {...register("driver")}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer transition-all"
                  >
                    <option value="Alex">Alex</option>
                    <option value="Priya">Priya</option>
                    <option value="Suresh">Suresh</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Cargo Weight (kg) *</label>
                  <input
                    {...register("cargoWeight", { required: true, valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="e.g. 400"
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                      isOverweight ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-200 focus:ring-accent/50 focus:border-accent'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Planned Distance (km) *</label>
                  <input
                    {...register("plannedDistance", { required: true, valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Validation Alert */}
              {isOverweight && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-sm animate-fade-in">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-semibold block">Vehicle Capacity Exceeded</span>
                    Vehicle Capacity: {capacity}kg. Cargo Weight: {cargoWeight}kg. Capacity exceeded by {weightDifference}kg — dispatch blocked.
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOverweight}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                    isOverweight 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  {isOverweight ? "Dispatch (disabled)" : "Dispatch"}
                </button>
              </div>
            </form>
            
          </div>
        </div>

        {/* RIGHT COLUMN - Live Board panel */}
        <div className="flex-[2] flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-panel flex flex-col h-full shadow-sm">
            
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0">
              <h2 className="text-lg font-bold text-slate-800">Live Board</h2>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{trip.id}</span>
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{trip.note}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="truncate font-medium">{trip.source}</div>
                    <ArrowRight size={14} className="text-slate-400 shrink-0" />
                    <div className="truncate font-medium">{trip.destination}</div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {trip.vehicle || "Unassigned"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {trip.driver || "Unassigned"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl shrink-0 text-xs text-slate-500 font-medium text-center">
              On Complete: odometer → fuel log → expenses → vehicle & driver available
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
