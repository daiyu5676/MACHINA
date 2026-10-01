import { assets } from "../data/mockData";

/*
  Assets page — table showing all monitored assets.
  Columns: Asset, Health, Failure Risk, Status, Decision, Last Analysis
  Uses the actual MACHINA data fields.
*/

function getStatusFromHealth(score) {
  if (score >= 70) return { label: "Healthy", className: "status-healthy" };
  if (score >= 40) return { label: "Attention", className: "status-attention" };
  return { label: "Critical", className: "status-danger" };
}

function getDecisionClass(decision) {
  if (decision === "MONITOR") return "decision-badge--monitor";
  if (decision === "REPAIR") return "decision-badge--attention";
  return "decision-badge--danger";
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
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Assets</h2>
        <p className="page-subtitle">
          {assets.length} monitored assets
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Health</th>
              <th>Failure Risk</th>
              <th>Status</th>
              <th>Decision</th>
              <th>Last Analysis</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => {
              const status = getStatusFromHealth(asset.healthScore);
              return (
                <tr key={asset.id}>
                  <td>
                    <div className="asset-cell">
                      <span className="asset-cell-name">{asset.name}</span>
                      <span className="asset-cell-id">{asset.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="health-cell">
                      <div className="health-bar-small">
                        <div
                          className="health-bar-fill-small"
                          style={{ width: `${asset.healthScore}%` }}
                        ></div>
                      </div>
                      <span>{asset.healthScore}</span>
                    </div>
                  </td>
                  <td>{(asset.failureProbability * 100).toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <span className={`decision-badge ${getDecisionClass(asset.decision)}`}>
                      {asset.decision}
                    </span>
                  </td>
                  <td className="text-muted">{formatTime(asset.lastAnalysis)}</td>
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
