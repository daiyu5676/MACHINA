import { assets } from "../data/mockData";

function getStatusFromHealth(score) {
  if (score >= 70) return { label: "Healthy", className: "bg-[#477A5A]/10 text-[#477A5A]" };
  if (score >= 40) return { label: "Attention", className: "bg-[#A87532]/10 text-[#A87532]" };
  return { label: "Critical", className: "bg-[#A94B4B]/10 text-[#A94B4B]" };
}

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "bg-[#477A5A]/10 text-[#477A5A]";
  if (decision === "REPAIR") return "bg-[#A87532]/10 text-[#A87532]";
  return "bg-[#A94B4B]/10 text-[#A94B4B]";
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  }) + " " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit"
  });
}

function Assets() {
  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-start mb-6 max-md:flex-col max-md:gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-[3px] text-[#17191B] m-0">Assets</h2>
          <p className="text-[13px] text-[#7B858C] m-0">
            {assets.length} monitored assets
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#CDD2D6] rounded-[6px] overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#ECEFF1] border-b border-[#CDD2D6]">
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Asset</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Health</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Failure Risk</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Decision</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Last Analysis</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => {
              const status = getStatusFromHealth(asset.healthScore);
              return (
                <tr key={asset.id} className="border-b border-[#E2E6E9] last:border-b-0 hover:bg-[#F0F2F4] transition-colors">
                  <td className="px-4 py-[11px] text-[#25292C]">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#17191B]">{asset.name}</span>
                      <span className="font-mono text-[11px] text-[#7B858C] mt-[1px] tracking-[-0.01em]">{asset.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-[11px] text-[#25292C]">
                    <div className="flex items-center gap-2.5 font-mono text-[13px]">
                      <div className="w-[60px] h-[3px] bg-[#D7DCE0] rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-[#60727D] rounded-sm"
                          style={{ width: `${asset.healthScore}%` }}
                        ></div>
                      </div>
                      <span>{asset.healthScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-[11px] text-[#25292C]">{(asset.failureProbability * 100).toFixed(1)}%</td>
                  <td className="px-4 py-[11px] text-[#25292C]">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold tracking-[0.04em] ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-[11px] text-[#25292C]">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-[0.08em] font-mono ${getDecisionClass(asset.decision)}`}>
                      {asset.decision}
                    </span>
                  </td>
                  <td className="px-4 py-[11px] text-[#7B858C] font-mono text-xs">{formatTime(asset.lastAnalysis)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assets;
