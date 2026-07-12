interface Trip {
  trip: string;
  vehicle: string;
  driver: string;
  status: "On Trip" | "Completed" | "Dispatched" | "Draft";
  eta: string;
}

const mockTrips: Trip[] = [
  { trip: "TR001", vehicle: "VAN-05",  driver: "Alex",  status: "On Trip",    eta: "45 min" },
  { trip: "TR002", vehicle: "TRK-12",  driver: "John",  status: "Completed",  eta: "—" },
  { trip: "TR003", vehicle: "MINI-03", driver: "Priya", status: "Dispatched", eta: "In 10m" },
  { trip: "TR004", vehicle: "—",       driver: "—",     status: "Draft",      eta: "Awaiting vehicle" },
];

export default function RecentTripsTable() {
  return (
    <div className="glass-panel overflow-hidden animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0 border-b border-white/40">
        <h2 className="text-lg font-bold text-slate-800">
          Recent Trips
        </h2>
        <button className="text-sm font-bold px-4 py-1.5 rounded-full transition-colors duration-200 bg-orange-100/80 text-orange-700 hover:bg-orange-200/80 shadow-sm">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/40">
              {["Trip", "Vehicle", "Driver", "Status", "ETA"].map((col) => (
                <th
                  key={col}
                  className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/20"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTrips.map((row, i) => (
              <tr
                key={row.trip}
                className="transition-colors duration-200 cursor-default hover:bg-white/40"
                style={{
                  borderBottom:
                    i < mockTrips.length - 1 ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                }}
              >
                <td className="px-6 py-4 font-bold text-slate-800">
                  {row.trip}
                </td>
                <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-600">
                  {row.vehicle}
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {row.driver}
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {row.eta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Status Pill ─── */
function StatusPill({ status }: { status: Trip["status"] }) {
  let bgClass = "";
  let textClass = "";

  switch (status) {
    case "Completed":
      bgClass = "bg-green-100/80";
      textClass = "text-green-700";
      break;
    case "On Trip":
      bgClass = "bg-blue-100/80";
      textClass = "text-blue-700";
      break;
    case "Dispatched":
      bgClass = "bg-orange-100/80";
      textClass = "text-orange-700";
      break;
    case "Draft":
      bgClass = "bg-slate-200/80";
      textClass = "text-slate-600";
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${bgClass} ${textClass}`}>
      {status}
    </span>
  );
}
