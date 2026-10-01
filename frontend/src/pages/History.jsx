import { useState } from "react";
import { predictionHistory, assets } from "../data/mockData";

/*
  History page — timeline of prediction events.
  Shows previous events in a clean timeline view.
*/

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "decision-badge--monitor";
  if (decision === "REPAIR") return "decision-badge--attention";
  return "decision-badge--danger";
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

  // Group by date
  const grouped = {};
  sorted.forEach(event => {
    const dateKey = formatDate(event.time);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(event);
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">History</h2>
          <p className="page-subtitle">Prediction event timeline</p>
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

      <div className="timeline">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date} className="timeline-group">
            <div className="timeline-date">{date}</div>

            {events.map((event, i) => {
              const asset = assets.find(a => a.id === event.assetId);
              return (
                <div key={`${event.assetId}-${event.time}-${i}`} className="timeline-item">
                  <div className="timeline-marker">
                    <span
                      className="timeline-dot"
                      style={{ background: getTimelineColor(event.decision) }}
                    ></span>
                    {i < events.length - 1 && <span className="timeline-line"></span>}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-content-header">
                      <span className="timeline-time">{formatTime(event.time)}</span>
                      <span className={`decision-badge decision-badge--small ${getDecisionClass(event.decision)}`}>
                        {event.decision}
                      </span>
                    </div>
                    <p className="timeline-asset">{asset ? asset.name : event.assetId}</p>
                    <div className="timeline-stats">
                      <span>Health: <strong>{event.healthScore}</strong></span>
                      <span>Risk: <strong>{(event.failureProbability * 100).toFixed(1)}%</strong></span>
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
