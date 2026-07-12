import { ChevronDown } from "lucide-react";

interface FilterOption {
  label: string;
  options: string[];
}

const filters: FilterOption[] = [
  { label: "Vehicle Type", options: ["All", "Van", "Truck", "Mini Bus", "Sedan"] },
  { label: "Status",       options: ["All", "Available", "On Trip", "In Shop", "Retired"] },
  { label: "Region",       options: ["All", "North", "South", "East", "West"] },
];

export default function FilterBar() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {filters.map((filter) => (
        <div key={filter.label} className="relative group">
          <select
            className="appearance-none pl-4 pr-16 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 outline-none bg-white/60 backdrop-blur-md border border-white/50 shadow-sm text-slate-700 hover:bg-white/80 focus:bg-white focus:border-orange-300"
            defaultValue={filter.options[0]}
            aria-label={filter.label}
          >
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {filter.label}: {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-800 transition-colors duration-300"
          />
        </div>
      ))}
    </div>
  );
}
