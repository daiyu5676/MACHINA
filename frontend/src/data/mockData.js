/*
  MACHINA — Mock Data
  
  This file contains sample data that matches the real MACHINA API structure.
  Fields: temperature, vibration, rpm, load, failure_probability, health_score,
  explanation (SHAP values), decision.
  
  When the real backend is connected, these can be replaced with API calls.
*/

export const assets = [
  {
    id: "BEARING-A01",
    name: "Bearing Unit A-01",
    type: "Bearing",
    temperature: 72.4,
    vibration: 0.41,
    rpm: 1480,
    load: 55,
    failureProbability: 0.124,
    healthScore: 87,
    decision: "MONITOR",
    explanation: {
      vibration: 0.142,
      temperature: 0.098,
      load: 0.061,
      rpm: 0.038
    },
    lastAnalysis: "2026-09-30T18:42:00"
  },
  {
    id: "BEARING-A02",
    name: "Bearing Unit A-02",
    type: "Bearing",
    temperature: 88.1,
    vibration: 0.72,
    rpm: 1720,
    load: 74,
    failureProbability: 0.382,
    healthScore: 64,
    decision: "REPAIR",
    explanation: {
      vibration: 0.285,
      temperature: 0.195,
      load: 0.122,
      rpm: 0.068
    },
    lastAnalysis: "2026-09-30T18:42:00"
  },
  {
    id: "PUMP-B01",
    name: "Pump B-01",
    type: "Pump",
    temperature: 61.3,
    vibration: 0.22,
    rpm: 1350,
    load: 42,
    failureProbability: 0.061,
    healthScore: 91,
    decision: "MONITOR",
    explanation: {
      vibration: 0.045,
      temperature: 0.032,
      load: 0.021,
      rpm: 0.015
    },
    lastAnalysis: "2026-09-30T18:42:00"
  },
  {
    id: "MOTOR-C01",
    name: "Motor C-01",
    type: "Motor",
    temperature: 94.7,
    vibration: 0.88,
    rpm: 1920,
    load: 88,
    failureProbability: 0.741,
    healthScore: 26,
    decision: "REPLACE",
    explanation: {
      vibration: 0.380,
      temperature: 0.245,
      load: 0.165,
      rpm: 0.095
    },
    lastAnalysis: "2026-09-30T18:42:00"
  },
  {
    id: "COMPRESSOR-D01",
    name: "Compressor D-01",
    type: "Compressor",
    temperature: 67.8,
    vibration: 0.35,
    rpm: 1550,
    load: 61,
    failureProbability: 0.158,
    healthScore: 82,
    decision: "MONITOR",
    explanation: {
      vibration: 0.112,
      temperature: 0.078,
      load: 0.055,
      rpm: 0.042
    },
    lastAnalysis: "2026-09-30T18:42:00"
  }
];


export const predictionHistory = [
  { time: "2026-09-30T18:42:00", assetId: "BEARING-A01", healthScore: 87, failureProbability: 0.124, decision: "MONITOR" },
  { time: "2026-09-30T14:42:00", assetId: "BEARING-A01", healthScore: 89, failureProbability: 0.097, decision: "MONITOR" },
  { time: "2026-09-30T10:42:00", assetId: "BEARING-A01", healthScore: 91, failureProbability: 0.081, decision: "MONITOR" },
  { time: "2026-09-30T06:42:00", assetId: "BEARING-A01", healthScore: 88, failureProbability: 0.112, decision: "MONITOR" },
  { time: "2026-09-30T02:42:00", assetId: "BEARING-A01", healthScore: 90, failureProbability: 0.088, decision: "MONITOR" },
  { time: "2026-09-29T22:42:00", assetId: "BEARING-A01", healthScore: 92, failureProbability: 0.074, decision: "MONITOR" },
  { time: "2026-09-29T18:42:00", assetId: "BEARING-A01", healthScore: 85, failureProbability: 0.142, decision: "MONITOR" },
  { time: "2026-09-29T14:42:00", assetId: "BEARING-A01", healthScore: 83, failureProbability: 0.168, decision: "MONITOR" },

  { time: "2026-09-30T18:42:00", assetId: "BEARING-A02", healthScore: 64, failureProbability: 0.382, decision: "REPAIR" },
  { time: "2026-09-30T14:42:00", assetId: "BEARING-A02", healthScore: 68, failureProbability: 0.341, decision: "REPAIR" },
  { time: "2026-09-30T10:42:00", assetId: "BEARING-A02", healthScore: 72, failureProbability: 0.298, decision: "MONITOR" },
  { time: "2026-09-30T06:42:00", assetId: "BEARING-A02", healthScore: 74, failureProbability: 0.275, decision: "MONITOR" },

  { time: "2026-09-30T18:42:00", assetId: "PUMP-B01", healthScore: 91, failureProbability: 0.061, decision: "MONITOR" },
  { time: "2026-09-30T14:42:00", assetId: "PUMP-B01", healthScore: 93, failureProbability: 0.048, decision: "MONITOR" },

  { time: "2026-09-30T18:42:00", assetId: "MOTOR-C01", healthScore: 26, failureProbability: 0.741, decision: "REPLACE" },
  { time: "2026-09-30T14:42:00", assetId: "MOTOR-C01", healthScore: 31, failureProbability: 0.694, decision: "REPLACE" },
  { time: "2026-09-30T10:42:00", assetId: "MOTOR-C01", healthScore: 38, failureProbability: 0.628, decision: "REPAIR" },
  { time: "2026-09-30T06:42:00", assetId: "MOTOR-C01", healthScore: 45, failureProbability: 0.558, decision: "REPAIR" },

  { time: "2026-09-30T18:42:00", assetId: "COMPRESSOR-D01", healthScore: 82, failureProbability: 0.158, decision: "MONITOR" },
  { time: "2026-09-30T14:42:00", assetId: "COMPRESSOR-D01", healthScore: 84, failureProbability: 0.138, decision: "MONITOR" }
];


// Health trend data for charts (per asset, hourly snapshots)
export const healthTrends = {
  "BEARING-A01": [
    { time: "00:00", health: 90 },
    { time: "02:00", health: 90 },
    { time: "04:00", health: 89 },
    { time: "06:00", health: 88 },
    { time: "08:00", health: 89 },
    { time: "10:00", health: 91 },
    { time: "12:00", health: 90 },
    { time: "14:00", health: 89 },
    { time: "16:00", health: 88 },
    { time: "18:00", health: 87 }
  ],
  "BEARING-A02": [
    { time: "00:00", health: 78 },
    { time: "02:00", health: 76 },
    { time: "04:00", health: 75 },
    { time: "06:00", health: 74 },
    { time: "08:00", health: 73 },
    { time: "10:00", health: 72 },
    { time: "12:00", health: 70 },
    { time: "14:00", health: 68 },
    { time: "16:00", health: 66 },
    { time: "18:00", health: 64 }
  ],
  "PUMP-B01": [
    { time: "00:00", health: 93 },
    { time: "02:00", health: 93 },
    { time: "04:00", health: 92 },
    { time: "06:00", health: 92 },
    { time: "08:00", health: 93 },
    { time: "10:00", health: 92 },
    { time: "12:00", health: 92 },
    { time: "14:00", health: 93 },
    { time: "16:00", health: 92 },
    { time: "18:00", health: 91 }
  ],
  "MOTOR-C01": [
    { time: "00:00", health: 58 },
    { time: "02:00", health: 55 },
    { time: "04:00", health: 52 },
    { time: "06:00", health: 45 },
    { time: "08:00", health: 42 },
    { time: "10:00", health: 38 },
    { time: "12:00", health: 35 },
    { time: "14:00", health: 31 },
    { time: "16:00", health: 28 },
    { time: "18:00", health: 26 }
  ],
  "COMPRESSOR-D01": [
    { time: "00:00", health: 86 },
    { time: "02:00", health: 86 },
    { time: "04:00", health: 85 },
    { time: "06:00", health: 85 },
    { time: "08:00", health: 84 },
    { time: "10:00", health: 84 },
    { time: "12:00", health: 83 },
    { time: "14:00", health: 84 },
    { time: "16:00", health: 83 },
    { time: "18:00", health: 82 }
  ]
};


// Decision descriptions
export const decisionDescriptions = {
  MONITOR: "Current operating conditions remain within acceptable limits. Continue standard monitoring protocol.",
  REPAIR: "One or more parameters exceed safe thresholds. Schedule maintenance within the next operational window.",
  REPLACE: "Critical degradation detected. Immediate replacement recommended to prevent unplanned downtime."
};
