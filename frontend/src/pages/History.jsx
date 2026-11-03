import { useState } from "react";
import { predictionHistory, assets } from "../data/mockData";

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "bg-[#477A5A]/10 text-[#477A5A]";
  if (decision === "REPAIR") return "bg-[#A87532]/10 text-[#A87532]";
  return "bg-[#A94B4B]/10 text-[#A94B4B]";
}

function getTimelineColor(decision) {
  if (decision === "MONITOR") return "#477A5A";
  if (decision === "REPAIR") return "#A87532";
  return "#A94B4B";
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit"
  });
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function History() {
  const [filterAsset, setFilterAsset] = useState("ALL");

  const filtered = filterAsset === "ALL"
    ? predictionHistory
    : predictionHistory.filter(p => p.assetId === filterAsset);

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.time) - new Date(a.time)
  );

  const grouped = {};
  sorted.forEach(event => {
    const dateKey = formatDate(event.time);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(event);
  });

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-start mb-6 max-md:flex-col max-md:gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-[3px] text-[#17191B] m-0">History</h2>
          <p className="text-[13px] text-[#7B858C] m-0">Prediction event timeline</p>
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

      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date}>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-3 pb-2 border-b border-[#E2E6E9]">
              {date}
            </div>

            {events.map((event, i) => {
              const asset = assets.find(a => a.id === event.assetId);
              return (
                <div key={`${event.assetId}-${event.time}-${i}`} className="flex gap-4 relative">
                  <div className="flex flex-col items-center w-4 shrink-0 pt-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: getTimelineColor(event.decision) }}
                    ></span>
                    {i < events.length - 1 && <span className="w-[1px] flex-1 bg-[#D7DCE0] mt-1.5"></span>}
                  </div>

                  <div className="bg-white border border-[#E2E6E9] rounded-[6px] px-4 py-3 flex-1 mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[13px] font-semibold text-[#25292C]">{formatTime(event.time)}</span>
                      <span className={`inline-block px-[7px] py-0.5 rounded text-[10px] font-semibold tracking-[0.08em] font-mono ${getDecisionClass(event.decision)}`}>
                        {event.decision}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#596168] mb-1">{asset ? asset.name : event.assetId}</p>
                    <div className="flex gap-5 text-xs text-[#7B858C]">
                      <span>Health: <strong className="font-mono text-[#25292C] font-semibold">{event.healthScore}</strong></span>
                      <span>Risk: <strong className="font-mono text-[#25292C] font-semibold">{(event.failureProbability * 100).toFixed(1)}%</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
