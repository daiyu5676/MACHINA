import { useMachines } from "../context/useMachines";
import { Link } from "react-router-dom";

/*
  Assets page — table showing all dynamically registered machines.
  Completely dynamic: No predefined or hardcoded sample assets.
*/

function getStatusFromHealth(score) {
  if (score === null || score === undefined) {
    return { label: "Registered", className: "status-healthy" };
  }
  if (score >= 70) return { label: "Healthy", className: "status-healthy" };
  if (score >= 40) return { label: "Attention", className: "status-attention" };
  return { label: "Critical", className: "status-danger" };
}

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

function Assets() {
  const { machines, selectMachine } = useMachines();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Registered Fleet Assets</h2>
          <p className="page-subtitle">
            {machines.length} dynamically monitored {machines.length === 1 ? "machine" : "machines"}
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          + Ingest Telemetry
        </Link>
      </div>

      <div className="table-container">
        {machines.length === 0 ? (
          <div className="table-empty">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", color: "var(--dark-gray)" }}>
              No Assets Registered
            </p>
            <p style={{ marginBottom: "14px" }}>
              All predefined assets have been removed. Use the Sensor Log Input module on the dashboard to register machines dynamically.
            </p>
            <Link to="/" className="btn btn-secondary">
              Go to Sensor Log Input
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Machine Asset</th>
                <th>Health Score</th>
                <th>Failure Risk</th>
                <th>Status</th>
                <th>Decision</th>
                <th>Last Ingestion</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => {
                const isAnalyzed =
                  m.analysis?.status === "COMPLETED" &&
                  m.analysis?.healthScore !== null;
                const status = getStatusFromHealth(
                  isAnalyzed ? m.analysis.healthScore : null
                );

                return (
                  <tr key={m.id}>
                    <td>
                      <div className="asset-cell">
                        <Link
                          to="/"
                          onClick={() => selectMachine(m.id)}
                          className="asset-cell-name"
                          style={{ cursor: "pointer" }}
                        >
                          {m.name}
                        </Link>
                        <span className="asset-cell-id">{m.id}</span>
                      </div>
                    </td>
                    <td>
                      {isAnalyzed ? (
                        <div className="health-cell">
                          <div className="health-bar-small">
                            <div
                              className="health-bar-fill-small"
                              style={{ width: `${m.analysis.healthScore}%` }}
                            ></div>
                          </div>
                          <span>{m.analysis.healthScore}</span>
                        </div>
                      ) : (
                        <span className="text-muted">Awaiting Analysis</span>
                      )}
                    </td>
                    <td>
                      {isAnalyzed ? (
                        `${(m.analysis.failureProbability * 100).toFixed(1)}%`
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <span className={`decision-badge ${getDecisionClass(m.analysis.decision)}`}>
                        {m.analysis.decision || "PENDING"}
                      </span>
                    </td>
                    <td className="text-muted">{formatTime(m.lastUpdated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Assets;
