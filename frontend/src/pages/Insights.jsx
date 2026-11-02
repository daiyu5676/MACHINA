import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { assets } from "../data/mockData";
import ExplainabilityPanel from "../components/ExplainabilityPanel";

const COLORS = {
  healthy: "#477A5A",
  attention: "#A87532",
  danger: "#A94B4B"
};

function Insights() {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0].id);
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const healthDistribution = [
    { name: "Healthy", value: assets.filter(a => a.healthScore >= 70).length, color: COLORS.healthy },
    { name: "Attention", value: assets.filter(a => a.healthScore >= 40 && a.healthScore < 70).length, color: COLORS.attention },
    { name: "Critical", value: assets.filter(a => a.healthScore < 40).length, color: COLORS.danger }
  ].filter(d => d.value > 0);

  const featureNames = ["temperature", "vibration", "rpm", "load"];
  const avgImportance = featureNames.map(name => {
    const avg = assets.reduce((sum, a) => sum + Math.abs(a.explanation[name]), 0) / assets.length;
    return { name: name.charAt(0).toUpperCase() + name.slice(1), importance: parseFloat(avg.toFixed(4)) };
  }).sort((a, b) => b.importance - a.importance);

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-start mb-6 max-md:flex-col max-md:gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-[3px] text-[#17191B] m-0">Insights</h2>
          <p className="text-[13px] text-[#7B858C] m-0">ML predictions and explainability analysis</p>
        </div>
      </div>

      {/* Overview row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-5">
        {/* Fleet health distribution */}
        <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-5">
          <h3 className="font-heading text-[13px] font-semibold tracking-[0.04em] mb-3.5 text-[#25292C] m-0">Fleet Health Distribution</h3>
          <div className="flex flex-col items-center">
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
            <div className="flex gap-4 mt-2 justify-center">
              {healthDistribution.map(d => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-[#596168]">
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: d.color }}></span>
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Average feature importance */}
        <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-5">
          <h3 className="font-heading text-[13px] font-semibold tracking-[0.04em] mb-3.5 text-[#25292C] m-0">Average Feature Importance</h3>
          <p className="text-xs text-[#7B858C] -mt-2 mb-3.5 m-0">Mean |SHAP| across all assets</p>
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
      <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading text-[13px] font-semibold tracking-[0.04em] text-[#25292C] m-0">Asset Explainability</h3>
          <select
            className="bg-white border border-[#CDD2D6] rounded text-[#17191B] px-3 py-1.5 text-[13px] font-sans font-medium cursor-pointer outline-none focus:border-[#315D72]"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          <div className="flex flex-col gap-[18px] min-w-[160px]">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-1 m-0">Health Score</span>
              <span className="font-heading text-xl font-bold text-[#17191B] m-0">{selectedAsset.healthScore}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-1 m-0">Failure Probability</span>
              <span className="font-heading text-xl font-bold text-[#17191B] m-0">{(selectedAsset.failureProbability * 100).toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-1 m-0">Decision</span>
              <span className="font-heading text-xl font-bold text-[#17191B] m-0">{selectedAsset.decision}</span>
            </div>
          </div>
          <div>
            <ExplainabilityPanel explanation={selectedAsset.explanation} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Insights;
