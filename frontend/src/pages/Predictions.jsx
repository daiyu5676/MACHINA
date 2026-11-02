import { useState } from "react";
import { predictionHistory, assets } from "../data/mockData";

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "bg-[#477A5A]/10 text-[#477A5A]";
  if (decision === "REPAIR") return "bg-[#A87532]/10 text-[#A87532]";
  return "bg-[#A94B4B]/10 text-[#A94B4B]";
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short"
  }) + " " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit"
  });
}

function Predictions() {
  const [filterAsset, setFilterAsset] = useState("ALL");

  const filtered = filterAsset === "ALL"
    ? predictionHistory
    : predictionHistory.filter(p => p.assetId === filterAsset);

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.time) - new Date(a.time)
  );

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-start mb-6 max-md:flex-col max-md:gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-[3px] text-[#17191B] m-0">Predictions</h2>
          <p className="text-[13px] text-[#7B858C] m-0">Historical prediction results</p>
        </div>
        <div className="flex gap-2.5">
          <select
            className="bg-white border border-[#CDD2D6] rounded text-[#17191B] px-3 py-1.5 text-[13px] font-sans font-medium cursor-pointer outline-none focus:border-[#315D72]"
            value={filterAsset}
            onChange={(e) => setFilterAsset(e.target.value)}
          >
            <option value="ALL">All Assets</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#CDD2D6] rounded-[6px] overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#ECEFF1] border-b border-[#CDD2D6]">
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Time</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Asset</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Health</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Failure Probability</th>
              <th className="text-left px-4 py-[11px] text-[10px] font-semibold tracking-[0.1em] uppercase text-[#60727D] whitespace-nowrap">Decision</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((pred, i) => {
              const asset = assets.find(a => a.id === pred.assetId);
              return (
                <tr key={`${pred.assetId}-${pred.time}-${i}`} className="border-b border-[#E2E6E9] last:border-b-0 hover:bg-[#F0F2F4] transition-colors">
                  <td className="px-4 py-[11px] text-[#7B858C] font-mono text-xs">{formatTime(pred.time)}</td>
                  <td className="px-4 py-[11px] text-[#25292C]">{asset ? asset.name : pred.assetId}</td>
                  <td className="px-4 py-[11px] text-[#25292C]">{pred.healthScore}</td>
                  <td className="px-4 py-[11px] text-[#25292C]">{(pred.failureProbability * 100).toFixed(1)}%</td>
                  <td className="px-4 py-[11px] text-[#25292C]">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-[0.08em] font-mono ${getDecisionClass(pred.decision)}`}>
                      {pred.decision}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Predictions;
