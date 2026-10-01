import { useState } from "react";
import { predictionHistory, assets } from "../data/mockData";

/*
  Predictions page — shows historical prediction results.
  Columns: Time, Asset, Health, Failure Probability, Decision
*/

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "decision-badge--monitor";
  if (decision === "REPAIR") return "decision-badge--attention";
  return "decision-badge--danger";
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

  // Sort by time, most recent first
  const sorted = [...filtered].sort((a, b) =>
    new Date(b.time) - new Date(a.time)
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Predictions</h2>
          <p className="page-subtitle">Historical prediction results</p>
        </div>
        <div className="page-controls">
          <select
            className="filter-select"
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

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Asset</th>
              <th>Health</th>
              <th>Failure Probability</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((pred, i) => {
              const asset = assets.find(a => a.id === pred.assetId);
              return (
                <tr key={`${pred.assetId}-${pred.time}-${i}`}>
                  <td className="text-muted">{formatTime(pred.time)}</td>
                  <td>{asset ? asset.name : pred.assetId}</td>
                  <td>{pred.healthScore}</td>
                  <td>{(pred.failureProbability * 100).toFixed(1)}%</td>
                  <td>
                    <span className={`decision-badge ${getDecisionClass(pred.decision)}`}>
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
