import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { assets } from "../data/mockData";
import ExplainabilityPanel from "../components/ExplainabilityPanel";

/*
  Insights page — ML/explainability focused view.
  Shows feature importance, health distribution, and risk breakdown.
*/

const COLORS = {
  healthy: "#477A5A",
  attention: "#A87532",
  danger: "#A94B4B"
};

function Insights() {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0].id);
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  // Aggregate data for the overview charts
  const healthDistribution = [
    { name: "Healthy", value: assets.filter(a => a.healthScore >= 70).length, color: COLORS.healthy },
    { name: "Attention", value: assets.filter(a => a.healthScore >= 40 && a.healthScore < 70).length, color: COLORS.attention },
    { name: "Critical", value: assets.filter(a => a.healthScore < 40).length, color: COLORS.danger }
  ].filter(d => d.value > 0);

  // Feature importance across all assets (average SHAP values)
  const featureNames = ["temperature", "vibration", "rpm", "load"];
  const avgImportance = featureNames.map(name => {
    const avg = assets.reduce((sum, a) => sum + Math.abs(a.explanation[name]), 0) / assets.length;
    return { name: name.charAt(0).toUpperCase() + name.slice(1), importance: parseFloat(avg.toFixed(4)) };
  }).sort((a, b) => b.importance - a.importance);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Insights</h2>
        <p className="page-subtitle">ML predictions and explainability analysis</p>
      </div>

      {/* Overview row */}
      <div className="insights-overview">

        {/* Fleet health distribution */}
        <div className="panel">
          <h3 className="panel-title">Fleet Health Distribution</h3>
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
              {healthDistribution.map(d => (
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
          <p className="panel-subtitle">Mean |SHAP| across all assets</p>
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
      <div className="panel">
        <div className="insights-asset-header">
          <h3 className="panel-title">Asset Explainability</h3>
          <select
            className="filter-select"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="insights-detail">
          <div className="insights-detail-metrics">
            <div className="insight-stat">
              <span className="insight-stat-label">Health Score</span>
              <span className="insight-stat-value">{selectedAsset.healthScore}</span>
            </div>
            <div className="insight-stat">
              <span className="insight-stat-label">Failure Probability</span>
              <span className="insight-stat-value">{(selectedAsset.failureProbability * 100).toFixed(1)}%</span>
            </div>
            <div className="insight-stat">
              <span className="insight-stat-label">Decision</span>
              <span className="insight-stat-value">{selectedAsset.decision}</span>
            </div>
          </div>
          <ExplainabilityPanel explanation={selectedAsset.explanation} />
        </div>
      </div>

    </div>
  );
}

export default Insights;
