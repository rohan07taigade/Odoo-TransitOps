import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";

interface FuelLog {
  vehicle: string;
  date: string;
  liters: string;
  fuel_cost: string;
}

interface OtherExpense {
  trip: string;
  vehicle: string;
  toll: string;
  other: string;
  maint_linked: string;
  total_status: string;
  description?: string;
}

const initialFuelLogs: FuelLog[] = [
  { vehicle: "VAN-05", date: "05 Jul 2026", liters: "42 L", fuel_cost: "3,150" },
  { vehicle: "TRUCK-11", date: "06 Jul 2026", liters: "110 L", fuel_cost: "8,400" },
  { vehicle: "MINI-03", date: "06 Jul 2026", liters: "28 L", fuel_cost: "2,050" }
];

const initialOtherExpenses: OtherExpense[] = [
  { trip: "TR001", vehicle: "VAN-05", toll: "120", other: "0", maint_linked: "0", total_status: "Available" },
  { trip: "TR002", vehicle: "TRK-12", toll: "340", other: "150", maint_linked: "18,000", total_status: "Completed" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "Available":
      return "bg-green-100/80 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const parseNum = (val: string) => {
  if (!val) return 0;
  return parseInt(val.replace(/[^\d.-]/g, ''), 10) || 0;
};

interface FuelFormData {
  vehicle: string;
  date: string;
  liters: number;
  fuel_cost: number;
}

interface ExpenseFormData {
  trip: string;
  vehicle: string;
  toll: number;
  other: number;
  description: string;
}

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>(initialOtherExpenses);
  
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fuelForm = useForm<FuelFormData>({
    defaultValues: { vehicle: "VAN-05" }
  });

  const expenseForm = useForm<ExpenseFormData>({
    defaultValues: { trip: "TR001", vehicle: "VAN-05", toll: 0, other: 0 }
  });

  const onFuelSubmit = (data: FuelFormData) => {
    setFuelLogs([
      {
        vehicle: data.vehicle,
        date: data.date,
        liters: `${data.liters} L`,
        fuel_cost: data.fuel_cost.toLocaleString()
      },
      ...fuelLogs
    ]);
    setIsFuelModalOpen(false);
    fuelForm.reset();
  };

  const onExpenseSubmit = (data: ExpenseFormData) => {
    setOtherExpenses([
      {
        trip: data.trip,
        vehicle: data.vehicle,
        toll: data.toll.toLocaleString(),
        other: data.other.toLocaleString(),
        maint_linked: "0",
        total_status: "Available",
        description: data.description
      },
      ...otherExpenses
    ]);
    setIsExpenseModalOpen(false);
    expenseForm.reset();
  };

  const totalCost = useMemo(() => {
    let sum = 0;
    fuelLogs.forEach(log => sum += parseNum(log.fuel_cost));
    otherExpenses.forEach(exp => {
      sum += parseNum(exp.toll) + parseNum(exp.other) + parseNum(exp.maint_linked);
    });
    return sum;
  }, [fuelLogs, otherExpenses]);

  return (
    <div className="flex flex-col h-full overflow-y-auto max-w-[1200px] mx-auto gap-6 pb-12">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 animate-fade-in pt-2">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Fuel & Expenses
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Track operational costs across the fleet
          </p>
        </div>
      </div>

      {/* SECTION 1 - Fuel Logs */}
      <div className="flex flex-col glass-panel animate-fade-in shadow-sm" style={{ animationDelay: '50ms' }}>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Fuel Logs</h2>
          <button
            onClick={() => setIsFuelModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus size={14} /> Log Fuel
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/95 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Liters</th>
                <th className="px-6 py-4 font-semibold text-right">Fuel Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fuelLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-800">{log.vehicle}</td>
                  <td className="px-6 py-4 text-slate-600">{log.date}</td>
                  <td className="px-6 py-4 text-slate-600 text-right">{log.liters}</td>
                  <td className="px-6 py-4 text-slate-600 text-right font-medium">₹{log.fuel_cost}</td>
                </tr>
              ))}
              {fuelLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No fuel logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 - Other Expenses */}
      <div className="flex flex-col glass-panel animate-fade-in shadow-sm" style={{ animationDelay: '100ms' }}>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Other Expenses (Toll / Misc)</h2>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/95 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-semibold">Trip</th>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold text-right">Toll</th>
                <th className="px-6 py-4 font-semibold text-right">Other</th>
                <th className="px-6 py-4 font-semibold text-right">Maint. (Linked)</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {otherExpenses.map((exp, idx) => {
                const rowTotal = parseNum(exp.toll) + parseNum(exp.other) + parseNum(exp.maint_linked);
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{exp.trip}</td>
                    <td className="px-6 py-4 text-slate-600">{exp.vehicle}</td>
                    <td className="px-6 py-4 text-slate-600 text-right">₹{exp.toll}</td>
                    <td className="px-6 py-4 text-slate-600 text-right">₹{exp.other}</td>
                    <td className="px-6 py-4 text-slate-600 text-right">₹{exp.maint_linked}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(exp.total_status)}`}>
                        ₹{rowTotal.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {otherExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No other expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3 - Summary line */}
      <div className="glass-panel p-5 flex items-center justify-between bg-slate-800 border-slate-700 shadow-md animate-fade-in" style={{ animationDelay: '150ms' }}>
        <div className="text-sm font-semibold text-slate-300">
          Total Operational Cost (Auto) = Fuel + Maint.
        </div>
        <div className="text-xl font-black text-amber-500 tracking-tight">
          ₹{totalCost.toLocaleString()}
        </div>
      </div>

      {/* Log Fuel Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Log Fuel</h2>
              <button onClick={() => setIsFuelModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={fuelForm.handleSubmit(onFuelSubmit)} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Vehicle</label>
                <select
                  {...fuelForm.register("vehicle", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="MINI-03">MINI-03</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Date</label>
                <input
                  {...fuelForm.register("date", { required: true })}
                  type="text"
                  placeholder="DD MMM YYYY"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Liters</label>
                <input
                  {...fuelForm.register("liters", { required: true, valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Fuel Cost (₹)</label>
                <input
                  {...fuelForm.register("fuel_cost", { required: true, valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                >
                  Log Fuel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Trip ID</label>
                <select
                  {...expenseForm.register("trip", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="TR001">TR001</option>
                  <option value="TR002">TR002</option>
                  <option value="TR003">TR003</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Vehicle</label>
                <select
                  {...expenseForm.register("vehicle", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="TRK-12">TRK-12</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Toll (₹)</label>
                  <input
                    {...expenseForm.register("toll", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Other (₹)</label>
                  <input
                    {...expenseForm.register("other", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Description</label>
                <input
                  {...expenseForm.register("description")}
                  type="text"
                  placeholder="e.g. Parking fee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
