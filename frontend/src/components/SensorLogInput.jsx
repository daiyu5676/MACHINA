import { useState } from "react";
import { useMachines } from "../context/useMachines";

/*
  SensorLogInput — Primary Entry Point for Machine Monitoring & Telemetry Ingestion.
  
  Features:
  - Introduces new machines dynamically through sensor log submission.
  - Allows entering readings for completely new machines or existing machines.
  - Form fields: Machine ID, Machine Name, Vibration, Temperature, Load, RPM, Timestamp.
  - Inline validation for mandatory and numeric fields.
  - Previews entered sensor logs across all registered machines.
  - Pure frontend state management via MachineContext.
*/

function getLocalDateTimeString(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatTime(isoString) {
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

function SensorLogInput({
  showPreview = false,
  onSuccess,
  onCancel,
  defaultMachineId
}) {
  const { machines, addSensorLog, clearMachines } = useMachines();

  // Mode: "NEW" (typing brand new machine) or existing machine ID
  const [selectedMode, setSelectedMode] = useState(() => {
    if (defaultMachineId && machines.some((m) => m.id === defaultMachineId)) {
      return defaultMachineId;
    }
    return machines.length > 0 ? machines[0].id : "NEW";
  });

  // Form field states
  const [machineId, setMachineId] = useState(() => {
    if (defaultMachineId) {
      const match = machines.find((m) => m.id === defaultMachineId);
      if (match) return match.id;
    }
    return machines.length > 0 ? machines[0].id : "";
  });
  const [machineName, setMachineName] = useState(() => {
    if (defaultMachineId) {
      const match = machines.find((m) => m.id === defaultMachineId);
      if (match) return match.name;
    }
    return machines.length > 0 ? machines[0].name : "";
  });
  const [vibration, setVibration] = useState("");
  const [temperature, setTemperature] = useState("");
  const [load, setLoad] = useState("");
  const [rpm, setRpm] = useState("");
  const [timestamp, setTimestamp] = useState(getLocalDateTimeString());

  // Validation & notification states
  const [errors, setErrors] = useState({});
  const [successNotification, setSuccessNotification] = useState(null);

  const handleModeChange = (e) => {
    const val = e.target.value;
    setSelectedMode(val);
    clearError("machineId");

    if (val === "NEW") {
      setMachineId("");
      setMachineName("");
    } else {
      const existing = machines.find((m) => m.id === val);
      if (existing) {
        setMachineId(existing.id);
        setMachineName(existing.name);
      }
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    clearError(field);
  };

  const validateForm = () => {
    const newErrors = {};

    // Machine ID validation
    const effectiveId = machineId.trim();
    if (!effectiveId) {
      newErrors.machineId = "Machine ID / Asset ID is required";
    } else if (effectiveId.length < 2) {
      newErrors.machineId = "Machine ID must be at least 2 characters";
    }

    // Vibration validation (numeric, non-negative)
    if (vibration === "" || vibration === null || vibration === undefined) {
      newErrors.vibration = "Vibration measurement is required";
    } else {
      const v = Number(vibration);
      if (isNaN(v)) {
        newErrors.vibration = "Vibration must be a valid number";
      } else if (v < 0) {
        newErrors.vibration = "Vibration cannot be negative";
      } else if (v > 100) {
        newErrors.vibration = "Vibration exceeds plausible limit (max 100 mm/s)";
      }
    }

    // Temperature validation (numeric, industrial range)
    if (temperature === "" || temperature === null || temperature === undefined) {
      newErrors.temperature = "Temperature measurement is required";
    } else {
      const t = Number(temperature);
      if (isNaN(t)) {
        newErrors.temperature = "Temperature must be a valid number";
      } else if (t < -50 || t > 350) {
        newErrors.temperature = "Temperature must be between -50°C and 350°C";
      }
    }

    // Load validation (numeric, 0-100%)
    if (load === "" || load === null || load === undefined) {
      newErrors.load = "Load measurement is required";
    } else {
      const l = Number(load);
      if (isNaN(l)) {
        newErrors.load = "Load must be a valid number";
      } else if (l < 0 || l > 100) {
        newErrors.load = "Load must be between 0% and 100%";
      }
    }

    // RPM validation (numeric, non-negative integer)
    if (rpm === "" || rpm === null || rpm === undefined) {
      newErrors.rpm = "RPM measurement is required";
    } else {
      const r = Number(rpm);
      if (isNaN(r)) {
        newErrors.rpm = "RPM must be a valid number";
      } else if (r < 0) {
        newErrors.rpm = "RPM cannot be negative";
      } else if (!Number.isInteger(r)) {
        newErrors.rpm = "RPM must be a whole integer";
      } else if (r > 30000) {
        newErrors.rpm = "RPM exceeds plausible limit (max 30,000 RPM)";
      }
    }

    // Timestamp validation
    if (!timestamp || !timestamp.trim()) {
      newErrors.timestamp = "Timestamp is required";
    } else {
      const parsedDate = new Date(timestamp);
      if (isNaN(parsedDate.getTime())) {
        newErrors.timestamp = "Invalid date-time format";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const effectiveId = machineId.trim().toUpperCase();
    const effectiveName =
      machineName && machineName.trim()
        ? machineName.trim()
        : `Machine ${effectiveId}`;

    const isExisting = machines.some((m) => m.id.toUpperCase() === effectiveId);

    // Call dynamic context handler
    addSensorLog({
      machineId: effectiveId,
      machineName: effectiveName,
      vibration,
      temperature,
      load,
      rpm,
      timestamp
    });

    // Success notification
    setSuccessNotification({
      machineId: effectiveId,
      machineName: effectiveName,
      isExisting,
      timestamp
    });

    // Reset sensor reading fields, but retain machine ID if user wants to log another point
    setVibration("");
    setTemperature("");
    setLoad("");
    setRpm("");
    setTimestamp(getLocalDateTimeString());
    setErrors({});

    if (onSuccess) {
      onSuccess(effectiveId);
    }
  };

  const applyPreset = (presetType) => {
    if (selectedMode === "NEW" && !machineId.trim()) {
      setMachineId("TURBINE-01");
      setMachineName("Gas Turbine Main");
      clearError("machineId");
    }

    if (presetType === "NOMINAL") {
      setVibration("0.06");
      setTemperature("52.0");
      setLoad("45.0");
      setRpm("1480");
    } else if (presetType === "ELEVATED") {
      setVibration("0.18");
      setTemperature("66.0");
      setLoad("72.0");
      setRpm("1720");
    } else if (presetType === "CRITICAL") {
      setVibration("0.38");
      setTemperature("86.5");
      setLoad("85.0");
      setRpm("1860");
    } else if (presetType === "RANDOM") {
      const randomVib = (0.05 + Math.random() * 0.35).toFixed(2);
      const randomTemp = (48.0 + Math.random() * 40.0).toFixed(1);
      const randomLoad = (30.0 + Math.random() * 60.0).toFixed(1);
      const randomRpm = Math.floor(1450 + Math.random() * 550);
      setVibration(String(randomVib));
      setTemperature(String(randomTemp));
      setLoad(String(randomLoad));
      setRpm(String(randomRpm));
    }

    clearError("vibration");
    clearError("temperature");
    clearError("load");
    clearError("rpm");
  };

  const handleReset = () => {
    setSelectedMode("NEW");
    setMachineId("");
    setMachineName("");
    setVibration("");
    setTemperature("");
    setLoad("");
    setRpm("");
    setTimestamp(getLocalDateTimeString());
    setErrors({});
    setSuccessNotification(null);
  };

  // Compile all logs across all dynamic machines for the preview table
  const allLogs = machines
    .flatMap((m) =>
      m.history.map((h) => ({
        ...h,
        machineName: m.name
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="sensor-log-section">
      {/* Sensor Log Input Form Panel */}
      <div className="panel sensor-form-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Sensor Log Telemetry Ingestion</h3>
            <p className="panel-subtitle">
              Enter machine telemetry to dynamically register machines or append readings to existing records
            </p>
          </div>

          {machines.length > 0 && (
            <div className="form-mode-selector">
              <span className="form-mode-label">Target:</span>
              <select
                className="filter-select"
                value={selectedMode}
                onChange={handleModeChange}
                aria-label="Select Target Machine"
              >
                <option value="NEW">+ Register New Machine</option>
                <optgroup label="Existing Registered Machines">
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} — {m.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </div>

        {/* Success Notification Banner */}
        {successNotification && (
          <div className="success-banner" role="status">
            <div className="success-banner-content">
              <span>
                {successNotification.isExisting ? (
                  <>
                    New telemetry point appended to existing machine <strong>{successNotification.machineId}</strong>{" "}
                    ({successNotification.machineName}) at {formatTime(successNotification.timestamp)}.
                  </>
                ) : (
                  <>
                    New machine <strong>{successNotification.machineId}</strong> ({successNotification.machineName}){" "}
                    registered dynamically and added to monitoring stream.
                  </>
                )}
              </span>
            </div>
            <button
              type="button"
              className="banner-close-btn"
              onClick={() => setSuccessNotification(null)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Telemetry Presets Toolbar for Demos */}
        <div className="telemetry-presets-bar">
          <span className="telemetry-presets-label">
            Demo Presets:
          </span>
          <div className="telemetry-presets-buttons">
            <button
              type="button"
              className="btn-preset btn-preset--nominal"
              onClick={() => applyPreset("NOMINAL")}
              title="Populate normal healthy operational telemetry (MONITOR)"
            >
              Nominal (Healthy)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset--elevated"
              onClick={() => applyPreset("ELEVATED")}
              title="Populate elevated vibration telemetry (REPAIR)"
            >
              Elevated Fault (Repair)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset--critical"
              onClick={() => applyPreset("CRITICAL")}
              title="Populate critical bearing failure telemetry (REPLACE)"
            >
              Critical Failure (Replace)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset--random"
              onClick={() => applyPreset("RANDOM")}
              title="Generate realistic randomized telemetry values"
            >
              Randomize
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="sensor-form-grid">
            {/* Field 1: Machine ID / Asset ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-machine-id">
                <span>Machine ID / Asset ID *</span>
                {selectedMode !== "NEW" && (
                  <button
                    type="button"
                    className="btn-inline-link"
                    onClick={() => {
                      setSelectedMode("NEW");
                      setMachineId("");
                      setMachineName("");
                      clearError("machineId");
                    }}
                  >
                    Enter New ID
                  </button>
                )}
              </label>

              <div className="form-input-wrapper">
                <input
                  id="sensor-machine-id"
                  type="text"
                  className={`form-input ${errors.machineId ? "form-input--error" : ""}`}
                  value={machineId}
                  onChange={(e) => {
                    setMachineId(e.target.value.toUpperCase());
                    clearError("machineId");
                  }}
                  disabled={selectedMode !== "NEW"}
                />
              </div>

              {errors.machineId && (
                <p className="form-error">{errors.machineId}</p>
              )}
            </div>

            {/* Field 2: Machine Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-machine-name">
                <span>Machine Name</span>
                <span className="form-label-unit">Optional</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-machine-name"
                  type="text"
                  className="form-input"
                  value={machineName}
                  onChange={handleFieldChange(setMachineName, "machineName")}
                />
              </div>
            </div>

            {/* Field 3: Vibration */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-vibration">
                <span>Vibration *</span>
                <span className="form-label-unit">mm/s</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-vibration"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className={`form-input form-input--has-unit ${errors.vibration ? "form-input--error" : ""}`}
                  value={vibration}
                  onChange={handleFieldChange(setVibration, "vibration")}
                />
                <span className="form-input-unit-badge">mm/s</span>
              </div>
              {errors.vibration && (
                <p className="form-error">{errors.vibration}</p>
              )}
            </div>

            {/* Field 4: Temperature */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-temperature">
                <span>Temperature *</span>
                <span className="form-label-unit">°C</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-temperature"
                  type="number"
                  step="0.1"
                  className={`form-input form-input--has-unit ${errors.temperature ? "form-input--error" : ""}`}
                  value={temperature}
                  onChange={handleFieldChange(setTemperature, "temperature")}
                />
                <span className="form-input-unit-badge">°C</span>
              </div>
              {errors.temperature && (
                <p className="form-error">{errors.temperature}</p>
              )}
            </div>

            {/* Field 5: Load */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-load">
                <span>Load *</span>
                <span className="form-label-unit">%</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-load"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className={`form-input form-input--has-unit ${errors.load ? "form-input--error" : ""}`}
                  value={load}
                  onChange={handleFieldChange(setLoad, "load")}
                />
                <span className="form-input-unit-badge">%</span>
              </div>
              {errors.load && (
                <p className="form-error">{errors.load}</p>
              )}
            </div>

            {/* Field 6: RPM */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-rpm">
                <span>RPM *</span>
                <span className="form-label-unit">RPM</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-rpm"
                  type="number"
                  step="1"
                  min="0"
                  className={`form-input form-input--has-unit ${errors.rpm ? "form-input--error" : ""}`}
                  value={rpm}
                  onChange={handleFieldChange(setRpm, "rpm")}
                />
                <span className="form-input-unit-badge">RPM</span>
              </div>
              {errors.rpm && (
                <p className="form-error">{errors.rpm}</p>
              )}
            </div>

            {/* Field 7: Timestamp */}
            <div className="form-group">
              <label className="form-label" htmlFor="sensor-timestamp">
                <span>Timestamp *</span>
                <button
                  type="button"
                  className="btn-inline-now"
                  onClick={() => {
                    setTimestamp(getLocalDateTimeString());
                    clearError("timestamp");
                  }}
                  title="Set timestamp to current local time"
                >
                  Set to Now
                </button>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="sensor-timestamp"
                  type="datetime-local"
                  className={`form-input ${errors.timestamp ? "form-input--error" : ""}`}
                  value={timestamp}
                  onChange={handleFieldChange(setTimestamp, "timestamp")}
                />
              </div>
              {errors.timestamp && (
                <p className="form-error">{errors.timestamp}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Back to Active Machine
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {selectedMode === "NEW" ? "Register Machine & Submit Log" : "Append Sensor Reading"}
            </button>
          </div>
        </form>
      </div>

      {/* Sensor Log Preview Table Panel (Optional preview) */}
      {showPreview && (
        <div className="panel sensor-preview-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Session Telemetry Log Stream</h3>
              <p className="panel-subtitle">
                All submitted sensor readings ({allLogs.length} {allLogs.length === 1 ? "entry" : "entries"} across {machines.length} registered {machines.length === 1 ? "machine" : "machines"})
              </p>
            </div>
            {machines.length > 0 && (
              <button
                type="button"
                className="btn btn-subtle"
                onClick={clearMachines}
                title="Clear all registered dynamic machines and session logs"
              >
                Clear Session Telemetry
              </button>
            )}
          </div>

          <div className="table-container">
            {allLogs.length === 0 ? (
              <div className="table-empty">
                <p>No sensor logs recorded yet. Use the form above to enter the first machine readings.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Machine ID</th>
                    <th>Machine Name</th>
                    <th>Vibration (mm/s)</th>
                    <th>Temperature (°C)</th>
                    <th>Load (%)</th>
                    <th>RPM</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {allLogs.map((log, index) => (
                    <tr key={log.id} className={index === 0 ? "row-highlight-new" : ""}>
                      <td>
                        <div className="asset-cell">
                          <span className="asset-cell-id font-bold">
                            {log.machineId}
                            {index === 0 && <span className="badge-new">LATEST</span>}
                          </span>
                        </div>
                      </td>
                      <td>{log.machineName}</td>
                      <td className="font-mono">{log.vibration}</td>
                      <td className="font-mono">{log.temperature}°C</td>
                      <td className="font-mono">{log.load}%</td>
                      <td className="font-mono">{log.rpm}</td>
                      <td className="text-muted">{formatTime(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SensorLogInput;
