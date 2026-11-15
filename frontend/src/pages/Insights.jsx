import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useMachines } from "../context/useMachines";
import ExplainabilityPanel from "../components/ExplainabilityPanel";
import { Link } from "react-router-dom";

/*
  Insights page — ML/explainability focused view for dynamic fleet.
  Zero predefined assets: derives insights only from dynamically registered machines.
*/

const COLORS = {
  healthy: "#477A5A",
  attention: "#A87532",
  danger: "#A94B4B",
  pending: "#60727D"
};

function Insights() {
  const { machines, selectedMachineId, selectMachine } = useMachines();
  const [filterAssetId, setFilterAssetId] = useState(selectedMachineId || machines[0]?.id || "");

  const selectedMachine =
    machines.find((m) => m.id === filterAssetId) || machines[0] || null;

  // Analyzed machines
  const analyzedMachines = machines.filter(
    (m) => m.analysis?.status === "COMPLETED" && m.analysis?.healthScore !== null
  );

  const healthDistribution = [
    {
      name: "Healthy (>=70)",
      value: analyzedMachines.filter((a) => a.analysis.healthScore >= 70).length,
      color: COLORS.healthy
    },
    {
      name: "Attention (40-69)",
      value: analyzedMachines.filter(
        (a) => a.analysis.healthScore >= 40 && a.analysis.healthScore < 70
      ).length,
      color: COLORS.attention
    },
    {
      name: "Critical (<40)",
      value: analyzedMachines.filter((a) => a.analysis.healthScore < 40).length,
      color: COLORS.danger
    },
    {
      name: "Pending Analysis",
      value: machines.length - analyzedMachines.length,
      color: COLORS.pending
    }
  ].filter((d) => d.value > 0);

  // Average feature importance from machines with explanations
  const machinesWithShap = analyzedMachines.filter(
    (m) => m.analysis?.explanation
  );

  const featureNames = ["temperature", "vibration", "rpm", "load"];
  const avgImportance =
    machinesWithShap.length > 0
      ? featureNames
          .map((name) => {
            const avg =
              machinesWithShap.reduce(
                (sum, a) => sum + Math.abs(a.analysis.explanation[name] || 0),
                0
              ) / machinesWithShap.length;
            return {
              name: name.charAt(0).toUpperCase() + name.slice(1),
              importance: parseFloat(avg.toFixed(4))
            };
          })
          .sort((a, b) => b.importance - a.importance)
      : [
          { name: "Vibration", importance: 0 },
          { name: "Temperature", importance: 0 },
          { name: "Load", importance: 0 },
          { name: "RPM", importance: 0 }
        ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Fleet Diagnostic Insights</h2>
          <p className="page-subtitle">
            ML predictions and explainability analysis for dynamically registered machines
          </p>
        </div>
      </div>

      {machines.length === 0 ? (
        <div className="table-container">
          <div className="table-empty">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", color: "var(--dark-gray)" }}>
              No Registered Machines Available
            </p>
            <p style={{ marginBottom: "14px" }}>
              All predefined assets have been removed. Register machines and submit sensor telemetry on the Dashboard to populate diagnostic insights.
            </p>
            <Link to="/" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Overview row */}
          <div className="insights-overview">
            {/* Fleet health distribution */}
            <div className="panel">
              <h3 className="panel-title">Fleet Health Distribution</h3>
              <p className="panel-subtitle">Status breakdown across {machines.length} registered machines</p>
              <div className="chart-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #CDD2D6",
                        borderRadius: "4px",
                        color: "#25292C",
                        fontSize: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {healthDistribution.map((d) => (
                    <span key={d.name} className="pie-legend-item">
                      <span className="pie-legend-dot" style={{ background: d.color }}></span>
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Average feature importance */}
            <div className="panel">
              <h3 className="panel-title">Average Feature Importance</h3>
              <p className="panel-subtitle">
                {machinesWithShap.length > 0
                  ? `Mean |SHAP| across ${machinesWithShap.length} scored machines`
                  : "Awaiting ML analysis scoring"}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={avgImportance} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E9" />
                  <XAxis type="number" stroke="#7B858C" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#7B858C" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #CDD2D6",
                      borderRadius: "4px",
                      color: "#25292C",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                  />
                  <Bar dataKey="importance" fill="#60727D" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-asset explainability */}
          {selectedMachine && (
            <div className="panel">
              <div className="insights-asset-header">
                <h3 className="panel-title">Asset Explainability</h3>
                <select
                  className="filter-select"
                  value={filterAssetId || selectedMachine.id}
                  onChange={(e) => {
                    setFilterAssetId(e.target.value);
                    selectMachine(e.target.value);
                  }}
                >
                  {machines.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="insights-detail">
                <div className="insights-detail-metrics">
                  <div className="insight-stat">
                    <span className="insight-stat-label">Health Score</span>
                    <span className="insight-stat-value">
                      {selectedMachine.analysis.healthScore !== null
                        ? selectedMachine.analysis.healthScore
                        : "--"}
                    </span>
                  </div>
                  <div className="insight-stat">
                    <span className="insight-stat-label">Failure Probability</span>
                    <span className="insight-stat-value">
                      {selectedMachine.analysis.failureProbability !== null
                        ? `${(selectedMachine.analysis.failureProbability * 100).toFixed(1)}%`
                        : "Pending"}
                    </span>
                  </div>
                  <div className="insight-stat">
                    <span className="insight-stat-label">Decision</span>
                    <span className="insight-stat-value">
                      {selectedMachine.analysis.decision || "PENDING"}
                    </span>
                  </div>
                </div>

                {selectedMachine.analysis.explanation ? (
                  <ExplainabilityPanel explanation={selectedMachine.analysis.explanation} />
                ) : (
                  <div className="analysis-pending-placeholder">
                    <p className="analysis-pending-title">Awaiting Model Inference</p>
                    <p className="analysis-pending-desc">
                      SHAP feature importance contributions will appear here once inference is performed via the Dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Insights;
