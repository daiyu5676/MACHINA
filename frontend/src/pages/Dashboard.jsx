import { useState, useEffect } from "react";
import { assets as mockAssets, healthTrends } from "../data/mockData";
import AssetSelector from "../components/AssetSelector";
import MetricCard from "../components/MetricCard";
import SensorCard from "../components/SensorCard";
import HealthChart from "../components/HealthChart";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityPanel from "../components/ExplainabilityPanel";

function getStatusFromHealth(score) {
  if (score >= 70) return "healthy";
  if (score >= 40) return "attention";
  return "danger";
}

function getStatusLabel(score) {
  if (score >= 70) return "Optimal";
  if (score >= 40) return "Warning";
  return "Critical";
}

function getRiskLabel(prob) {
  if (prob >= 0.70) return "Critical";
  if (prob >= 0.40) return "Elevated";
  if (prob >= 0.15) return "Moderate";
  return "Nominal";
}

function Dashboard() {
  const [selectedAssetId, setSelectedAssetId] = useState(mockAssets[0].id);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedAsset = mockAssets.find(a => a.id === selectedAssetId) || mockAssets[0];

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: selectedAsset.temperature,
            vibration: selectedAsset.vibration,
            rpm: selectedAsset.rpm,
            load: selectedAsset.load
          })
        });

        if (!response.ok) throw new Error("Prediction request failed");

        const predData = await response.json();

        let explainData = null;
        try {
          const explainRes = await fetch("http://localhost:3000/api/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              temperature: selectedAsset.temperature,
              vibration: selectedAsset.vibration,
              rpm: selectedAsset.rpm,
              load: selectedAsset.load
            })
          });
          if (explainRes.ok) {
            explainData = await explainRes.json();
          }
        } catch {
          // Explanation is optional
        }

        setLiveData({
          healthScore: predData.health_score,
          failureProbability: predData.failure_probability,
          explanation: explainData ? explainData.features : null
        });

      } catch {
        setLiveData(null);
        setError("Gateway offline — showing mock data");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [selectedAssetId, selectedAsset.temperature, selectedAsset.vibration, selectedAsset.rpm, selectedAsset.load]);

  const healthScore = liveData?.healthScore ?? selectedAsset.healthScore;
  const failureProbability = liveData?.failureProbability ?? selectedAsset.failureProbability;
  const explanation = liveData?.explanation ?? selectedAsset.explanation;
  const decision = selectedAsset.decision;
  const status = getStatusFromHealth(healthScore);
  const trendData = healthTrends[selectedAssetId] || [];

  return (
    <div className="max-w-[1200px]">
      <AssetSelector
        assets={mockAssets}
        selectedId={selectedAssetId}
        onSelect={setSelectedAssetId}
      />

      {error && (
        <div className="bg-[#A87532]/10 border border-[#A87532]/20 rounded px-4 py-[9px] text-[13px] text-[#A87532] mb-5 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Section 01 */}
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#60727D] mb-3.5 pb-2.5 border-b border-[#E2E6E9] flex items-center gap-2">
        <span className="text-[#7B858C] font-mono text-[10px]">01</span> Asset Condition
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#CDD2D6] border border-[#CDD2D6] rounded-[6px] overflow-hidden mb-5">
        <MetricCard
          title="Asset Health"
          value={loading ? "..." : `${healthScore} / 100`}
          subtitle={getStatusLabel(healthScore)}
          status={status}
        />
        <MetricCard
          title="Failure Probability"
          value={loading ? "..." : `${(failureProbability * 100).toFixed(1)}%`}
          subtitle={getRiskLabel(failureProbability)}
          status={failureProbability >= 0.40 ? "danger" : failureProbability >= 0.15 ? "attention" : "healthy"}
        />
        <MetricCard
          title="Maintenance Decision"
          value={decision}
          subtitle={decision === "MONITOR" ? "No action required" : decision === "REPAIR" ? "Schedule maintenance" : "Immediate action"}
          status={decision === "MONITOR" ? "healthy" : decision === "REPAIR" ? "attention" : "danger"}
        />
        <MetricCard
          title="Last Prediction"
          value={new Date(selectedAsset.lastAnalysis).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          subtitle={new Date(selectedAsset.lastAnalysis).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        />
      </div>

      {/* Health Chart */}
      <HealthChart data={trendData} title="Asset Health Trend — 24h" />

      {/* Section 02 */}
      <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-5 mb-5">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#60727D] mb-3.5 pb-2.5 border-b border-[#E2E6E9] flex items-center gap-2">
          <span className="text-[#7B858C] font-mono text-[10px]">02</span> Sensor Readings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E6E9] border border-[#E2E6E9] rounded overflow-hidden">
          <SensorCard label="Temperature" value={selectedAsset.temperature} unit="°C" change={4.2} />
          <SensorCard label="Vibration" value={selectedAsset.vibration} unit="" change={8.1} />
          <SensorCard label="Load" value={selectedAsset.load} unit="%" change={0.3} />
          <SensorCard label="RPM" value={selectedAsset.rpm} unit="" change={-1.2} />
        </div>
      </div>

      {/* Section 03 */}
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#60727D] mb-3.5 pb-2.5 border-b border-[#E2E6E9] flex items-center gap-2">
        <span className="text-[#7B858C] font-mono text-[10px]">03</span> Analysis
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-5">
        <DecisionCard decision={decision} />
        <ExplainabilityPanel explanation={explanation} />
      </div>
    </div>
  );
}

export default Dashboard;
