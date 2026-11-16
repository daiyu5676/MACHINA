import { useState } from "react";
import { useMachines } from "../context/useMachines";
import { Link } from "react-router-dom";

/*
  Predictions page — displays dynamic machine prediction records.
  Completely dynamic: zero predefined assets.
*/

function getDecisionClass(decision) {
  if (!decision || decision === "PENDING") return "decision-badge--small";
  if (decision === "MONITOR") return "decision-badge--monitor";
  if (decision === "REPAIR") return "decision-badge--attention";
  return "decision-badge--danger";
}

function formatTime(isoString) {
  if (!isoString) return "--";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return (
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) +
    " " +
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
}

function Predictions() {
  const { machines } = useMachines();
  const [filterAsset, setFilterAsset] = useState("ALL");

  // Flatten all readings or predictions across registered machines
  const records = machines.flatMap((m) =>
    m.history.map((h) => ({
      time: h.timestamp,
      assetId: m.id,
      assetName: m.name,
      healthScore: m.analysis.healthScore !== null ? m.analysis.healthScore : "--",
      failureProbability:
        m.analysis.failureProbability !== null
          ? `${(m.analysis.failureProbability * 100).toFixed(1)}%`
          : "Pending",
      decision: m.analysis.decision || "PENDING"
    }))
  );

  const filtered =
    filterAsset === "ALL"
      ? records
      : records.filter((p) => p.assetId === filterAsset);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Predictions & Inference</h2>
          <p className="page-subtitle">Historical machine predictions</p>
        </div>

        {machines.length > 0 && (
          <div className="page-controls">
            <select
              className="filter-select"
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
            >
              <option value="ALL">All Machines ({machines.length})</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="table-container">
        {machines.length === 0 ? (
          <div className="table-empty">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", color: "var(--dark-gray)" }}>
              No Prediction Records
            </p>
            <p style={{ marginBottom: "14px" }}>
              All predefined assets have been removed. Ingest machine telemetry on the dashboard to generate records.
            </p>
            <Link to="/" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        ) : sorted.length === 0 ? (
          <div className="table-empty">
            <p>No records found for the selected filter.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Machine Asset</th>
                <th>Health Score</th>
                <th>Failure Risk</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((pred, i) => (
                <tr key={`${pred.assetId}-${pred.time}-${i}`}>
                  <td className="text-muted">{formatTime(pred.time)}</td>
                  <td>
                    <strong>{pred.assetId}</strong> — {pred.assetName}
                  </td>
                  <td>{pred.healthScore}</td>
                  <td>{pred.failureProbability}</td>
                  <td>
                    <span className={`decision-badge ${getDecisionClass(pred.decision)}`}>
                      {pred.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Predictions;
