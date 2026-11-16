import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMachines } from "../context/useMachines";
import MetricCard from "../components/MetricCard";
import SensorCard from "../components/SensorCard";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityPanel from "../components/ExplainabilityPanel";
import SensorLogInput from "../components/SensorLogInput";

/*
  Dashboard — Focused Machine Diagnostic Console.
  
  Workflow:
  - 100% Dynamic Telemetry Ingestion.
  - Telemetry Entry Mode: Clean instruction panel + concise ingestion form.
  - Active Machine Diagnostic Mode: Header with "+ Enter Another Telemetry" action,
    Condition metrics, Sensor cards, DecisionCard & SHAP explainability.
  - Fleet management is distributed to /assets, telemetry logs to /history.
*/

function getStatusFromHealth(score) {
  if (score === null || score === undefined) return "pending";
  if (score >= 70) return "healthy";
  if (score >= 40) return "attention";
  return "danger";
}

function getStatusLabel(score) {
  if (score === null || score === undefined) return "Awaiting ML Analysis";
  if (score >= 70) return "Healthy";
  if (score >= 40) return "Attention";
  return "Critical";
}

function getRiskLabel(prob) {
  if (prob === null || prob === undefined) return "Pending Model Inference";
  if (prob < 0.15) return "Low Risk";
  if (prob < 0.40) return "Moderate Risk";
  return "High Risk";
}

function formatTime(isoString) {
  if (!isoString) return "--:--";
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
      minute: "2-digit",
      second: "2-digit"
    })
  );
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

function Dashboard() {
  const location = useLocation();
  const {
    machines,
    selectedMachine,
    selectedMachineId,
    selectMachine,
    runAnalysis
  } = useMachines();

  const [isEnteringTelemetry, setIsEnteringTelemetry] = useState(
    Boolean(location.state?.enterTelemetry)
  );

  useEffect(() => {
    if (location.state?.enterTelemetry) {
      setIsEnteringTelemetry(true);
    }
  }, [location.state]);

  const isAnalyzed =
    selectedMachine?.analysis?.status === "COMPLETED" &&
    selectedMachine?.analysis?.healthScore !== null;

  const isAnalysisLoading = selectedMachine?.analysis?.status === "LOADING";
  const hasAnalysisError = selectedMachine?.analysis?.status === "OFFLINE";

  // Mode 1: No machines registered yet, or user clicked "+ Enter Another Telemetry"
  const showTelemetryInput = machines.length === 0 || isEnteringTelemetry;

  return (
    <div className="page">
      {showTelemetryInput ? (
        <>
          {/* Small clean instruction panel on how to start working */}
          <div className="instruction-card">
            <div className="instruction-header">
              <h3 className="instruction-title">How to Start Working</h3>
              <p className="instruction-subtitle">
                MACHINA evaluates real-time sensor streams using predictive ML models and GoF behavioural decision strategies.
              </p>
            </div>
            <div className="instruction-steps">
              <div className="instruction-step">
                <span className="instruction-step-num">1</span>
                <div>
                  <strong>Input Parameters:</strong> Choose a preset (Nominal, Elevated, or Critical) or input custom telemetry values.
                </div>
              </div>
              <div className="instruction-step">
                <span className="instruction-step-num">2</span>
                <div>
                  <strong>Ingest Telemetry:</strong> Submit the form to dynamically register a machine or append readings to an existing asset.
                </div>
              </div>
              <div className="instruction-step">
                <span className="instruction-step-num">3</span>
                <div>
                  <strong>Diagnostic Evaluation:</strong> View automated asset health scores, SHAP contributions, and GoF maintenance decisions.
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Ingestion Form */}
          <SensorLogInput
            showPreview={false}
            defaultMachineId={selectedMachineId}
            onSuccess={() => setIsEnteringTelemetry(false)}
            onCancel={machines.length > 0 ? () => setIsEnteringTelemetry(false) : undefined}
          />
        </>
      ) : (
        /* Mode 2: Clean Machine Diagnostic Console (One uncluttered view) */
        selectedMachine && (
          <>
            {/* Machine Header & Action Banner */}
            <div className="machine-info-banner">
              <div className="machine-info-main">
                <div>
                  <span className="machine-info-id">{selectedMachine.id}</span>
                  <span className="machine-info-name"> — {selectedMachine.name}</span>
                </div>
                <div className="machine-info-meta">
                  <span>Registered: <strong>{formatDate(selectedMachine.createdAt)}</strong></span>
                  <span>Last Reading: <strong>{formatTime(selectedMachine.lastUpdated)}</strong></span>
                  <span>Readings: <strong>{selectedMachine.history.length}</strong></span>
                </div>
              </div>

              <div className="machine-info-actions">
                {machines.length > 1 && (
                  <select
                    className="filter-select"
                    value={selectedMachine.id}
                    onChange={(e) => selectMachine(e.target.value)}
                    aria-label="Switch Machine"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} — {m.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEnteringTelemetry(true)}
                  title="Enter new telemetry readings or register another machine"
                >
                  + Enter Another Telemetry
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isAnalysisLoading}
                  onClick={() => runAnalysis(selectedMachine.id)}
                  title="Execute prediction on live Express Gateway and ML Service"
                >
                  {isAnalysisLoading ? "Scoring Telemetry..." : "Run ML Analysis"}
                </button>
              </div>
            </div>

            {hasAnalysisError && (
              <div className="error-banner" style={{ marginBottom: "16px" }}>
                <span>Warning:</span> {selectedMachine.analysis.errorMessage}
              </div>
            )}

            {/* Condition Metrics Grid */}
            <div className="metrics-grid">
              <MetricCard
                title="Asset Health"
                value={
                  isAnalyzed
                    ? `${selectedMachine.analysis.healthScore} / 100`
                    : "-- / 100"
                }
                subtitle={
                  isAnalyzed
                    ? getStatusLabel(selectedMachine.analysis.healthScore)
                    : "Awaiting ML Analysis"
                }
                status={
                  isAnalyzed
                    ? getStatusFromHealth(selectedMachine.analysis.healthScore)
                    : "pending"
                }
              />
              <MetricCard
                title="Failure Probability"
                value={
                  isAnalyzed
                    ? `${(selectedMachine.analysis.failureProbability * 100).toFixed(1)}%`
                    : "--%"
                }
                subtitle={
                  isAnalyzed
                    ? getRiskLabel(selectedMachine.analysis.failureProbability)
                    : "Pending Model Inference"
                }
                status={
                  isAnalyzed
                    ? selectedMachine.analysis.failureProbability >= 0.4
                      ? "danger"
                      : selectedMachine.analysis.failureProbability >= 0.15
                      ? "attention"
                      : "healthy"
                    : "pending"
                }
              />
              <MetricCard
                title="Operational Condition"
                value={isAnalyzed ? selectedMachine.analysis.decision : "PENDING"}
                subtitle={
                  isAnalyzed
                    ? "Action evaluated by model"
                    : "Pending Risk Assessment"
                }
                status={
                  isAnalyzed
                    ? selectedMachine.analysis.decision === "MONITOR"
                      ? "healthy"
                      : selectedMachine.analysis.decision === "REPAIR"
                      ? "attention"
                      : "danger"
                    : "pending"
                }
              />
              <MetricCard
                title="Telemetry Stream"
                value={`${selectedMachine.history.length} Ingested`}
                subtitle={`Latest: ${formatTime(selectedMachine.readings.timestamp).split(" ")[1]}`}
                status="healthy"
              />
            </div>

            {/* Current Sensor Readings */}
            <div className="panel" style={{ marginBottom: "20px" }}>
              <div className="section-label" style={{ border: "none", margin: 0, padding: 0, marginBottom: "12px" }}>
                Current Sensor Readings
              </div>
              <div className="sensor-grid">
                <SensorCard
                  label="Temperature"
                  value={selectedMachine.readings.temperature}
                  unit="°C"
                />
                <SensorCard
                  label="Vibration"
                  value={selectedMachine.readings.vibration}
                  unit="mm/s"
                />
                <SensorCard
                  label="Load"
                  value={selectedMachine.readings.load}
                  unit="%"
                />
                <SensorCard
                  label="RPM"
                  value={selectedMachine.readings.rpm}
                  unit="RPM"
                />
              </div>
            </div>

            {/* Machine Analysis & Decision Support */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header-row" style={{ marginBottom: "14px" }}>
                <div>
                  <div className="section-label" style={{ border: "none", margin: 0, padding: 0 }}>
                    Machine Analysis & Decision Support
                  </div>
                  <p className="panel-subtitle" style={{ margin: "4px 0 0 0" }}>
                    AI-powered diagnostic inference and SHAP explainability
                  </p>
                </div>
              </div>

              <div className="dashboard-bottom" style={{ marginTop: 0, marginBottom: 0 }}>
                {/* Left Card: Maintenance Recommendation & Parameter Assessment */}
                {isAnalyzed ? (
                  <DecisionCard
                    decision={selectedMachine.analysis.decision}
                    strategy={selectedMachine.analysis.strategy}
                    reason={selectedMachine.analysis.reason}
                  />
                ) : (
                  <div className="decision-card decision--pending">
                    <p className="decision-card-label">MAINTENANCE RECOMMENDATION</p>
                    <h2 className="decision-card-value">AWAITING ML ANALYSIS</h2>
                    <p className="decision-card-description">
                      Sensor telemetry has been ingested into the pipeline. Click Run ML Analysis to generate automated maintenance decisions.
                    </p>

                    <table className="baseline-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Current Value</th>
                          <th>Nominal Industrial Band</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Vibration</td>
                          <td className="font-mono">{selectedMachine.readings.vibration} mm/s</td>
                          <td className="text-muted">&lt; 0.70 mm/s</td>
                        </tr>
                        <tr>
                          <td>Temperature</td>
                          <td className="font-mono">{selectedMachine.readings.temperature} °C</td>
                          <td className="text-muted">40 – 90 °C</td>
                        </tr>
                        <tr>
                          <td>Load</td>
                          <td className="font-mono">{selectedMachine.readings.load} %</td>
                          <td className="text-muted">20 – 85 %</td>
                        </tr>
                        <tr>
                          <td>RPM</td>
                          <td className="font-mono">{selectedMachine.readings.rpm} RPM</td>
                          <td className="text-muted">1000 – 2500 RPM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Right Card: SHAP Feature Contributions */}
                {isAnalyzed && selectedMachine.analysis.explanation ? (
                  <ExplainabilityPanel explanation={selectedMachine.analysis.explanation} />
                ) : (
                  <div className="explainability-panel">
                    <h3 className="explainability-title">Model Contributions (SHAP)</h3>
                    <p className="explainability-subtitle">
                      Feature importance attributions for predictive inference
                    </p>
                    <div className="analysis-pending-placeholder">
                      <p className="analysis-pending-title">Awaiting Model Inference</p>
                      <p className="analysis-pending-desc">
                        SHAP feature contribution values will be displayed here once ML inference evaluates this machine's telemetry parameters.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default Dashboard;
