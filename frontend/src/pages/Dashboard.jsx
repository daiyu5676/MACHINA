import { useMachines } from "../context/useMachines";
import MetricCard from "../components/MetricCard";
import SensorCard from "../components/SensorCard";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityPanel from "../components/ExplainabilityPanel";
import SensorLogInput from "../components/SensorLogInput";

/*
  Dashboard — Dynamic Production Monitoring Interface.
  
  Workflow:
  - 100% Dynamic: No predefined or hardcoded machine records.
  - Sensor Log Input is the primary entry point for machine creation & telemetry ingestion.
  - Supports multiple registered machines independently with dedicated sensor history.
  - Displays machine details: Asset info, Sensor readings, Asset conditions, Machine analysis.
  - Displays appropriate 'Awaiting ML Analysis' pending states without fabricating predictions.
  - Designed for seamless live backend connection via /api/predict and /api/explain.
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

function formatOnlyTime(isoString) {
  if (!isoString) return "--:--";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
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

function Dashboard() {
  const {
    machines,
    selectedMachine,
    selectedMachineId,
    selectMachine,
    runAnalysis
  } = useMachines();

  const isAnalyzed =
    selectedMachine?.analysis?.status === "COMPLETED" &&
    selectedMachine?.analysis?.healthScore !== null;

  const isAnalysisLoading = selectedMachine?.analysis?.status === "LOADING";
  const hasAnalysisError = selectedMachine?.analysis?.status === "OFFLINE";

  return (
    <div className="page">
      {/* Top Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Production Monitoring Dashboard</h2>
          <p className="page-subtitle">
            {machines.length === 0
              ? "0 Registered Machines · Awaiting Sensor Log Telemetry"
              : `${machines.length} Registered ${machines.length === 1 ? "Machine" : "Machines"} · Dynamic Monitoring Stream Active`}
          </p>
        </div>

        {machines.length > 0 && (
          <div className="page-controls">
            <span className="status-badge status-healthy">
              ● {machines.length} Monitored {machines.length === 1 ? "Asset" : "Assets"}
            </span>
          </div>
        )}
      </div>

      {/* Case A: No machines registered yet (Clean Empty State) */}
      {machines.length === 0 ? (
        <>
          <div className="empty-state-hero">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="empty-state-title">No Machines Registered Yet</h3>
            <p className="empty-state-description">
              MACHINA is operating with dynamic telemetry ingestion. All predefined sample assets have been removed.
              Use the Sensor Log Input form below to register your first machine and log real sensor readings.
            </p>
            <div className="empty-state-pills">
              <span className="empty-state-pill">1. Enter Machine ID & Name</span>
              <span className="empty-state-arrow">→</span>
              <span className="empty-state-pill">2. Input Sensor Readings</span>
              <span className="empty-state-arrow">→</span>
              <span className="empty-state-pill">3. View Dynamic Health & Analysis</span>
            </div>
          </div>

          {/* Primary Entry Point: Sensor Log Input Form */}
          <div className="section-label">
            <span className="section-number">01</span> Primary Entry Point — Sensor Log Telemetry
          </div>
          <SensorLogInput />
        </>
      ) : (
        /* Case B: At least 1 machine is registered dynamically */
        <>
          {/* Section 01: Dynamic Fleet Selection */}
          <div className="section-label">
            <span className="section-number">01</span> Registered Fleet ({machines.length} Active {machines.length === 1 ? "Machine" : "Machines"})
          </div>

          <div className="fleet-grid">
            {machines.map((m) => {
              const isSelected = m.id === selectedMachineId;
              return (
                <div
                  key={m.id}
                  className={`machine-fleet-card ${isSelected ? "machine-fleet-card--active" : ""}`}
                  onClick={() => selectMachine(m.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") selectMachine(m.id);
                  }}
                >
                  <div className="machine-card-header">
                    <div>
                      <div className="machine-card-id">{m.id}</div>
                      <div className="machine-card-name">{m.name}</div>
                    </div>
                    <span className="status-badge status-healthy">Active</span>
                  </div>

                  <div className="machine-card-readings">
                    <div className="machine-card-reading-item">
                      <span className="machine-card-reading-label">Vib:</span>
                      <span>{m.readings.vibration} mm/s</span>
                    </div>
                    <div className="machine-card-reading-item">
                      <span className="machine-card-reading-label">Temp:</span>
                      <span>{m.readings.temperature}°C</span>
                    </div>
                    <div className="machine-card-reading-item">
                      <span className="machine-card-reading-label">Load:</span>
                      <span>{m.readings.load}%</span>
                    </div>
                    <div className="machine-card-reading-item">
                      <span className="machine-card-reading-label">RPM:</span>
                      <span>{m.readings.rpm}</span>
                    </div>
                  </div>

                  <div className="machine-card-footer">
                    <span>{m.history.length} {m.history.length === 1 ? "reading" : "readings"}</span>
                    <span>{formatTime(m.lastUpdated).split(" ")[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedMachine && (
            <>
              {/* Section 02: Selected Machine Information & Conditions */}
              <div className="section-label">
                <span className="section-number">02</span> Machine Details & Condition Assessment
              </div>

              {/* Asset Information Banner */}
              <div className="machine-info-banner">
                <div className="machine-info-main">
                  <div>
                    <span className="machine-info-id">{selectedMachine.id}</span>
                    <span className="machine-info-name"> — {selectedMachine.name}</span>
                  </div>
                  <span className="status-badge status-healthy">Registered Asset</span>
                </div>
                <div className="machine-info-meta">
                  <span>Registered: <strong>{formatDate(selectedMachine.createdAt)}</strong></span>
                  <span>Last Reading: <strong>{formatTime(selectedMachine.lastUpdated)}</strong></span>
                  <span>Readings: <strong>{selectedMachine.history.length}</strong></span>
                </div>
              </div>

              {/* Condition Metrics Grid (Requirement 4C — Pending states without fabricated data) */}
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
                  subtitle={`Latest: ${formatOnlyTime(selectedMachine.readings.timestamp)}`}
                  status="healthy"
                />
              </div>

              {/* Section 03: Current Sensor Readings (Requirement 4B) */}
              <div className="panel">
                <div className="section-label">
                  <span className="section-number">03</span> Current Sensor Readings
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

              {/* Section 04: Machine Analysis & Decision Support (Requirement 4D) */}
              <div className="panel">
                <div className="panel-header-row">
                  <div>
                    <div className="section-label" style={{ border: "none", margin: 0, padding: 0 }}>
                      <span className="section-number">04</span> Machine Analysis & Decision Support
                    </div>
                    <p className="panel-subtitle" style={{ margin: "4px 0 0 0" }}>
                      AI-powered diagnostic inference and SHAP explainability
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isAnalysisLoading}
                    onClick={() => runAnalysis(selectedMachine.id)}
                    title="Execute prediction on live Express Gateway and ML Service"
                  >
                    {isAnalysisLoading ? (
                      "Scoring Telemetry..."
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Run ML Analysis
                      </>
                    )}
                  </button>
                </div>

                {hasAnalysisError && (
                  <div className="error-banner" style={{ marginTop: "14px" }}>
                    <span>⚠</span> {selectedMachine.analysis.errorMessage}
                  </div>
                )}

                <div className="dashboard-bottom" style={{ marginTop: "16px", marginBottom: 0 }}>
                  {/* Card 1: Maintenance Recommendation & Parameter Assessment */}
                  {isAnalyzed ? (
                    <DecisionCard decision={selectedMachine.analysis.decision} />
                  ) : (
                    <div className="decision-card decision--pending">
                      <p className="decision-card-label">MAINTENANCE RECOMMENDATION</p>
                      <h2 className="decision-card-value">AWAITING ML ANALYSIS</h2>
                      <p className="decision-card-description">
                        Sensor telemetry has been ingested into the pipeline. Connect the MACHINA Express Gateway and Python ML Service (or click Run ML Analysis) to generate automated maintenance decisions.
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

                  {/* Card 2: SHAP Feature Contributions */}
                  {isAnalyzed && selectedMachine.analysis.explanation ? (
                    <ExplainabilityPanel explanation={selectedMachine.analysis.explanation} />
                  ) : (
                    <div className="explainability-panel">
                      <h3 className="explainability-title">Model Contributions (SHAP)</h3>
                      <p className="explainability-subtitle">
                        Feature importance attributions for predictive inference
                      </p>
                      <div className="analysis-pending-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--steel)" }}>
                          <path d="M18 20V10" />
                          <path d="M12 20V4" />
                          <path d="M6 20v-6" />
                        </svg>
                        <p className="analysis-pending-title">Awaiting Model Inference</p>
                        <p className="analysis-pending-desc">
                          SHAP feature contribution values will be displayed here once ML inference evaluates this machine's telemetry parameters.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 05: Machine Telemetry History */}
              <div className="panel">
                <div className="panel-header-row">
                  <div>
                    <h3 className="panel-title">{selectedMachine.id} — Telemetry History</h3>
                    <p className="panel-subtitle">
                      Chronological progression of sensor readings recorded for this machine ({selectedMachine.history.length} {selectedMachine.history.length === 1 ? "entry" : "entries"})
                    </p>
                  </div>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Reading #</th>
                        <th>Timestamp</th>
                        <th>Vibration (mm/s)</th>
                        <th>Temperature (°C)</th>
                        <th>Load (%)</th>
                        <th>RPM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMachine.history.map((h, idx) => (
                        <tr key={h.id}>
                          <td className="font-mono">#{selectedMachine.history.length - idx}</td>
                          <td className="text-muted">{formatTime(h.timestamp)}</td>
                          <td className="font-mono">{h.vibration}</td>
                          <td className="font-mono">{h.temperature}°C</td>
                          <td className="font-mono">{h.load}%</td>
                          <td className="font-mono">{h.rpm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Section 06: Sensor Log Input Form */}
          <div className="section-label">
            <span className="section-number">05</span> Ingest New Telemetry / Register Machine
          </div>
          <SensorLogInput />
        </>
      )}
    </div>
  );
}

export default Dashboard;
