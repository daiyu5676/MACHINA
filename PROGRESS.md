# Machina Development Progress

---

## Slice 1 — Core Proof of Concept

**Status:** ✅ Complete

- [x] Synthetic sensor input
- [x] Python Random Forest prediction
- [x] Failure probability
- [x] Health score
- [x] SHAP explanation
- [x] Java decision engine
- [x] React dashboard
- [x] Temporary JSON bridge / mock frontend data

---

## Slice 2 — Predict + Explain Integration

### Status
🟢 COMPLETE

### Completed

- [x] Express API gateway implemented
- [x] Gateway health check implemented
- [x] `/api/predict` route implemented
- [x] `/api/explain` route implemented
- [x] Gateway successfully communicates with Python ML service
- [x] React frontend connected to `/api/predict`
- [x] React frontend connected to `/api/explain`
- [x] Machine health score displayed dynamically
- [x] Failure probability displayed dynamically
- [x] SHAP feature contributions displayed dynamically
- [x] Loading and error states implemented in React

### Current End-to-End Flow

Sensors / Machine Input
        ↓
React Frontend
        ↓
Express Gateway
        ↓
Python ML Service
        ├── /predict
        └── /explain
        ↓
Prediction + SHAP
        ↓
React Dashboard

### Current Example Output

Failure Probability: 0.89
Health Score: 11

SHAP:
- Vibration: 0.23625
- Temperature: 0.151875
- Load: 0.134375
- RPM: 0.0075

### Deferred

- [x] Java decision engine integration (Completed — HTTP microservice with 4 OOP patterns)
- [x] MongoDB integration (Completed — 4 schemas, seeder, audit logs)
- [ ] RAG / ChromaDB / Groq (Post-MVP)

---

## Slice 3 — Java Decision Engine Integration

**Status:** ✅ Complete

- [x] Implemented Singleton pattern (`RulesEngineConfig`) for global thresholds
- [x] Implemented Strategy pattern (`StandardScoringStrategy`, `HighCriticalityStrategy`)
- [x] Implemented Factory pattern (`AssetFactory`) for asset evaluation contexts
- [x] Implemented Observer pattern (`AnomalyNotifier`, `ConsoleAnomalyListener`) for alerts
- [x] Zero-dependency Java 17 HTTP microservice wrapper (`Server.java`) on port 8080
- [x] Connect Gateway → Java Decision Engine (`POST /decide`)
- [x] Return real deterministic decision (`MONITOR`, `REPAIR`, `REPLACE`) and rationale in API payload

---

## Slice 4 — Real Industrial Intelligence

**Status:** ✅ Complete

- [x] NASA IMS Bearing Dataset downloaded & organized (Tests 1, 2, and 3; 9,464 raw run-to-failure snapshots)
- [x] Time-series preprocessing (20 kHz vibration signal windowing & digital signal processing)
- [x] Feature extraction & engineering (RMS vibration, peak-to-peak amplitude, kurtosis, thermal dissipation, operational RPM slip, dynamic radial load)
- [x] Train ML model (`RandomForestClassifier`, 250 estimators, balanced class weights on 12,456 bearing lifetime observations)
- [x] Model evaluation:
  - Accuracy: **99.12%**
  - Precision: **86.89%**
  - Recall: **79.10%**
  - F1-Score: **82.81%**
  - ROC-AUC: **0.9782**
- [x] Failure prediction (calibrated probability calibrated to ISO 10816 vibration severity boundaries)
- [x] SHAP explanations (TreeExplainer re-fitted on real degradation feature vectors; vibration is 56.65% primary driver)
- [x] Reconnect improved model to existing FastAPI ML service (`model.pkl`), Express Gateway, and Java Decision Engine
- [x] Verified end-to-end pipeline with automated healthy and failing telemetry test suites

---

## Slice 5 — Production Dashboard

**Status:** ⏳ Planned

- [ ] Live API data
- [ ] Asset status
- [ ] Sensor trend charts
- [ ] Failure probability visualization
- [ ] SHAP explanation view
- [ ] Decision output
- [ ] Loading/error states
- [ ] Asset selection
- [ ] Historical predictions
- [ ] Responsive UI
- [ ] Recharts
- [ ] Final visual polish

---

## Slice 6 — Persistence & Historical Intelligence

**Status:** ✅ Complete

- [x] MongoDB persistence models (`Asset`, `SensorLog`, `Prediction`, `Decision`)
- [x] Store incoming sensor data in `SensorLog`
- [x] Store predictions in `Prediction`
- [x] Store SHAP explanation features
- [x] Store deterministic decisions in `Decision`
- [x] Retrieve historical data via `GET /api/history`
- [x] Historical asset trends via `GET /api/assets/:id/trends`
- [x] Database seeder (`scripts/seed.js`) with 6 industrial assets and 24h baseline telemetry

---

## Slice 7 — MVP Integration & Deployment

**Status:** ⏳ Planned

- [ ] Full end-to-end integration testing
- [ ] API validation
- [ ] Failure handling
- [ ] Service health checks
- [ ] Configuration/environment variables
- [ ] Security basics
- [ ] Performance/latency checks
- [ ] Deployment
- [ ] Production documentation
- [ ] Demo scenario

---

## Future Slice — RAG Knowledge Assistant

**Status:** 🚫 Post-launch

- [ ] Maintenance manuals
- [ ] SOPs
- [ ] Historical maintenance logs
- [ ] Document chunking
- [ ] Sentence Transformers
- [ ] ChromaDB
- [ ] Groq/LLM
- [ ] Retrieval pipeline
- [ ] Grounded maintenance instructions
- [ ] Safety precautions / tools / procedures

