import { useState, useEffect } from "react";
import { MachineContext } from "./MachineContextInstance";

/*
  MachineContext — Central dynamic machine and sensor telemetry store.
  
  Separation of Concerns:
  - Machine records (ID, name, registration timestamp, status)
  - Sensor reading history (per-machine chronological telemetry records)
  - Latest sensor readings (vibration, temperature, load, rpm)
  - Machine condition & analysis state (pending until real ML scoring is executed)
*/

export function MachineProvider({ children }) {
  // Start with an empty list — NO hardcoded or predefined sample assets
  const [machines, setMachines] = useState(() => {
    try {
      const saved = sessionStorage.getItem("machina_dynamic_machines");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedMachineId, setSelectedMachineId] = useState(() => {
    try {
      return sessionStorage.getItem("machina_selected_machine_id") || null;
    } catch {
      return null;
    }
  });

  // Session storage persistence to avoid loss on accidental refresh
  useEffect(() => {
    try {
      sessionStorage.setItem("machina_dynamic_machines", JSON.stringify(machines));
    } catch {
      // ignore storage errors
    }
  }, [machines]);

  useEffect(() => {
    try {
      if (selectedMachineId) {
        sessionStorage.setItem("machina_selected_machine_id", selectedMachineId);
      } else {
        sessionStorage.removeItem("machina_selected_machine_id");
      }
    } catch {
      // ignore
    }
  }, [selectedMachineId]);

  // Derived selected machine (falls back to first machine if selected is missing)
  const selectedMachine =
    machines.find((m) => m.id === selectedMachineId) ||
    machines[0] ||
    null;

  /**
   * addSensorLog:
   * Dynamic machine creation and telemetry logging.
   * If the machine already exists, appends to its history and updates current readings.
   * If new, creates a new machine entry.
   */
  const addSensorLog = ({
    machineId,
    machineName,
    vibration,
    temperature,
    load,
    rpm,
    timestamp
  }) => {
    const normalizedId = machineId.trim().toUpperCase();
    const effectiveName =
      machineName && machineName.trim()
        ? machineName.trim()
        : `Machine ${normalizedId}`;
    const effectiveTimestamp = timestamp || new Date().toISOString();

    const newReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      machineId: normalizedId,
      vibration: parseFloat(Number(vibration).toFixed(2)),
      temperature: parseFloat(Number(temperature).toFixed(1)),
      load: parseFloat(Number(load).toFixed(1)),
      rpm: Math.round(Number(rpm)),
      timestamp: effectiveTimestamp
    };

    setMachines((prevMachines) => {
      const existingIndex = prevMachines.findIndex(
        (m) => m.id.toUpperCase() === normalizedId
      );

      if (existingIndex >= 0) {
        // Update existing machine
        const existing = prevMachines[existingIndex];
        const updatedMachine = {
          ...existing,
          name: machineName && machineName.trim() ? effectiveName : existing.name,
          lastUpdated: effectiveTimestamp,
          status: "Active",
          readings: {
            vibration: newReading.vibration,
            temperature: newReading.temperature,
            load: newReading.load,
            rpm: newReading.rpm,
            timestamp: effectiveTimestamp
          },
          history: [newReading, ...existing.history],
          // Reset analysis state to pending when new sensor readings arrive
          analysis: {
            status: "PENDING",
            healthScore: null,
            failureProbability: null,
            decision: null,
            strategy: null,
            reason: null,
            explanation: null,
            analyzedAt: null,
            errorMessage: null
          }
        };

        const next = [...prevMachines];
        next[existingIndex] = updatedMachine;
        return next;
      } else {
        // Register brand new machine
        const newMachine = {
          id: normalizedId,
          name: effectiveName,
          createdAt: effectiveTimestamp,
          lastUpdated: effectiveTimestamp,
          status: "Active",
          readings: {
            vibration: newReading.vibration,
            temperature: newReading.temperature,
            load: newReading.load,
            rpm: newReading.rpm,
            timestamp: effectiveTimestamp
          },
          history: [newReading],
          analysis: {
            status: "PENDING",
            healthScore: null,
            failureProbability: null,
            decision: null,
            strategy: null,
            reason: null,
            explanation: null,
            analyzedAt: null,
            errorMessage: null
          }
        };

        return [newMachine, ...prevMachines];
      }
    });

    // Make this machine the active selected machine
    setSelectedMachineId(normalizedId);

    return newReading;
  };

  /**
   * runAnalysis:
   * Connects to live Express Gateway (/api/predict and /api/explain) if available.
   * If gateway is unavailable, safely sets OFFLINE state without fabricating fake predictions.
   */
  const runAnalysis = async (machineId) => {
    const target = machines.find((m) => m.id === machineId);
    if (!target) return;

    // Set status to LOADING
    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              analysis: {
                ...m.analysis,
                status: "LOADING",
                errorMessage: null
              }
            }
          : m
      )
    );

    try {
      const predRes = await fetch("http://localhost:3000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: target.id,
          temperature: target.readings.temperature,
          vibration: target.readings.vibration,
          rpm: target.readings.rpm,
          load: target.readings.load
        })
      });

      if (!predRes.ok) throw new Error("Gateway prediction failed");
      const predData = await predRes.json();

      let explainData = null;
      try {
        const explainRes = await fetch("http://localhost:3000/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asset_id: target.id,
            temperature: target.readings.temperature,
            vibration: target.readings.vibration,
            rpm: target.readings.rpm,
            load: target.readings.load
          })
        });
        if (explainRes.ok) {
          explainData = await explainRes.json();
        }
      } catch {
        // explanation is optional
      }

      const score = predData.health_score;
      // Real deterministic decision, strategy, and rationale from Java Decision Engine
      const decision = predData.decision || (score < 40 ? "REPLACE" : score < 70 ? "REPAIR" : "MONITOR");
      const strategy = predData.strategy || "StandardScoringStrategy";
      const reason = predData.reason || null;
      const explanation = explainData?.features || predData.explanation?.features || null;

      setMachines((prev) =>
        prev.map((m) =>
          m.id === machineId
            ? {
                ...m,
                analysis: {
                  status: "COMPLETED",
                  healthScore: score,
                  failureProbability: predData.failure_probability,
                  decision: decision,
                  strategy: strategy,
                  reason: reason,
                  explanation: explanation,
                  analyzedAt: new Date().toISOString(),
                  errorMessage: null
                }
              }
            : m
        )
      );
    } catch {
      // Gateway offline — never fabricate fake predictions
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machineId
            ? {
                ...m,
                analysis: {
                  ...m.analysis,
                  status: "OFFLINE",
                  errorMessage:
                    "Express Gateway (localhost:3000) offline. ML analysis unavailable."
                }
              }
            : m
        )
      );
    }
  };

  const clearMachines = () => {
    setMachines([]);
    setSelectedMachineId(null);
    try {
      sessionStorage.removeItem("machina_dynamic_machines");
      sessionStorage.removeItem("machina_selected_machine_id");
    } catch {
      // ignore
    }
  };

  return (
    <MachineContext.Provider
      value={{
        machines,
        selectedMachine,
        selectedMachineId,
        selectMachine: setSelectedMachineId,
        addSensorLog,
        runAnalysis,
        clearMachines
      }}
    >
      {children}
    </MachineContext.Provider>
  );
}

export default MachineProvider;
