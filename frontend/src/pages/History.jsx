import { useState } from "react";
import { useMachines } from "../context/useMachines";
import { Link } from "react-router-dom";

/*
  History page — timeline of dynamic machine ingestion & prediction events.
  Completely dynamic: Zero predefined assets.
*/

function getDecisionClass(decision) {
  if (!decision || decision === "PENDING") return "decision-badge--small";
  if (decision === "MONITOR") return "decision-badge--monitor";
  if (decision === "REPAIR") return "decision-badge--attention";
  return "decision-badge--danger";
}

function getTimelineColor(decision) {
  if (decision === "MONITOR") return "#477A5A";
  if (decision === "REPAIR") return "#A87532";
  if (decision === "REPLACE") return "#A94B4B";
  return "#60727D";
}

function formatTime(isoString) {
  if (!isoString) return "--";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(isoString) {
  if (!isoString) return "--";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function History() {
  const { machines } = useMachines();
  const [filterAsset, setFilterAsset] = useState("ALL");

  const events = machines.flatMap((m) =>
    m.history.map((h) => ({
      time: h.timestamp,
      assetId: m.id,
      assetName: m.name,
      vibration: h.vibration,
      temperature: h.temperature,
      load: h.load,
      rpm: h.rpm,
      healthScore: m.analysis.healthScore !== null ? m.analysis.healthScore : "--",
      failureProbability:
        m.analysis.failureProbability !== null
          ? `${(m.analysis.failureProbability * 100).toFixed(1)}%`
          : "Pending",
      decision: m.analysis.decision || "INGESTED"
    }))
  );

  const filtered =
    filterAsset === "ALL"
      ? events
      : events.filter((p) => p.assetId === filterAsset);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  // Group by date
  const grouped = {};
  sorted.forEach((event) => {
    const dateKey = formatDate(event.time);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(event);
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Fleet Telemetry History</h2>
          <p className="page-subtitle">Timeline of ingested telemetry and prediction events</p>
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

      {machines.length === 0 ? (
        <div className="table-container">
          <div className="table-empty">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", color: "var(--dark-gray)" }}>
              No Telemetry History
            </p>
            <p style={{ marginBottom: "14px" }}>
              All predefined assets have been removed. Ingest machine telemetry on the dashboard to build event history.
            </p>
            <Link to="/" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="table-container">
          <div className="table-empty">
            <p>No events found for the selected filter.</p>
          </div>
        </div>
      ) : (
        <div className="timeline">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date} className="timeline-group">
              <div className="timeline-date">{date}</div>

              {dayEvents.map((event, i) => (
                <div key={`${event.assetId}-${event.time}-${i}`} className="timeline-item">
                  <div className="timeline-marker">
                    <span
                      className="timeline-dot"
                      style={{ background: getTimelineColor(event.decision) }}
                    ></span>
                    {i < dayEvents.length - 1 && <span className="timeline-line"></span>}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-content-header">
                      <span className="timeline-time">{formatTime(event.time)}</span>
                      <span className={`decision-badge decision-badge--small ${getDecisionClass(event.decision)}`}>
                        {event.decision}
                      </span>
                    </div>
                    <p className="timeline-asset">
                      <strong>{event.assetId}</strong> — {event.assetName}
                    </p>
                    <div className="timeline-stats">
                      <span>Vib: <strong>{event.vibration} mm/s</strong></span>
                      <span>Temp: <strong>{event.temperature}°C</strong></span>
                      <span>Load: <strong>{event.load}%</strong></span>
                      <span>RPM: <strong>{event.rpm}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
