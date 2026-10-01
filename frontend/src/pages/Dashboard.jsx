import { useState, useEffect } from "react";
import { assets as mockAssets, healthTrends } from "../data/mockData";
import AssetSelector from "../components/AssetSelector";
import MetricCard from "../components/MetricCard";
import SensorCard from "../components/SensorCard";
import HealthChart from "../components/HealthChart";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityPanel from "../components/ExplainabilityPanel";

/*
  Dashboard page — the main view.
  
  This preserves the original App.jsx functionality:
  - Calls /api/predict and /api/explain on the gateway
  - Falls back to mock data if the gateway is unavailable
  - Displays health score, failure risk, sensors, SHAP, and decision
  
  All the original sensor fields are preserved:
  temperature, vibration, rpm, load
*/

function getStatusFromHealth(score) {
  if (score >= 70) return "healthy";
  if (score >= 40) return "attention";
  return "danger";
}

function getStatusLabel(score) {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "Attention";
  return "Critical";
}

function getRiskLabel(prob) {
  if (prob < 0.15) return "Low Risk";
  if (prob < 0.40) return "Moderate Risk";
  return "High Risk";
}

function Dashboard() {
  const [selectedAssetId, setSelectedAssetId] = useState(mockAssets[0].id);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedAsset = mockAssets.find(a => a.id === selectedAssetId) || mockAssets[0];

  // Try to call the real API, fall back to mock data
  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);

      try {
        // Send sensor data to gateway — same API call as original App.jsx
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

        // Also try to get SHAP explanation
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
          // Explanation is optional — fallback to mock
        }

        setLiveData({
          healthScore: predData.health_score,
          failureProbability: predData.failure_probability,
          explanation: explainData ? explainData.features : null
        });

      } catch {
        // Gateway unavailable — use mock data (this is expected behavior)
        setLiveData(null);
        setError("Gateway offline — showing mock data");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [selectedAssetId, selectedAsset.temperature, selectedAsset.vibration, selectedAsset.rpm, selectedAsset.load]);

  // Merge live data with mock data (live takes priority)
  const healthScore = liveData?.healthScore ?? selectedAsset.healthScore;
  const failureProbability = liveData?.failureProbability ?? selectedAsset.failureProbability;
  const explanation = liveData?.explanation ?? selectedAsset.explanation;
  const decision = selectedAsset.decision;
  const status = getStatusFromHealth(healthScore);
  const trendData = healthTrends[selectedAssetId] || [];

  return (
    <div className="page">

      <AssetSelector
        assets={mockAssets}
        selectedId={selectedAssetId}
        onSelect={setSelectedAssetId}
      />

      {error && (
        <div className="error-banner">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Metric cards row */}
      <div className="section-label"><span className="section-number">01</span> Asset Condition</div>
      <div className="metrics-grid">
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

      {/* Health chart */}
      <HealthChart data={trendData} title="Asset Health Trend — 24h" />

      {/* Sensor readings */}
      <div className="panel">
        <div className="section-label"><span className="section-number">02</span> Sensor Readings</div>
        <div className="sensor-grid">
          <SensorCard label="Temperature" value={selectedAsset.temperature} unit="°C" change={4.2} />
          <SensorCard label="Vibration" value={selectedAsset.vibration} unit="" change={8.1} />
          <SensorCard label="Pressure" value={selectedAsset.load} unit="%" change={0.3} />
          <SensorCard label="RPM" value={selectedAsset.rpm} unit="" change={-1.2} />
        </div>
      </div>

      {/* Bottom row: Decision + Explainability side by side */}
      <div className="section-label"><span className="section-number">03</span> Analysis</div>
      <div className="dashboard-bottom">
        <DecisionCard decision={decision} />
        <ExplainabilityPanel explanation={explanation} />
      </div>

    </div>
  );
}

export default Dashboard;
