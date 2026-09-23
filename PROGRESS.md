# Machina Development Progress

## Phase 1 — End-to-End Prototype

**Status:** ✅ Complete

### Goal

Build the first working vertical slice from ML prediction
to maintenance decision and frontend visualization.

### Completed

- [x] Created project structure
- [x] Created Python ML service
- [x] Trained initial Random Forest model
- [x] Added `/predict` endpoint
- [x] Added `/explain` endpoint using SHAP
- [x] Created Java Decision Engine
- [x] Added Strategy pattern
- [x] Connected Python output to Java using temporary JSON bridge
- [x] Created React frontend
- [x] Displayed machine health
- [x] Displayed failure probability
- [x] Displayed sensor data
- [x] Displayed SHAP explanations
- [x] Displayed maintenance decision

### Current Flow

Sensor Data
→ Python ML
→ Health Score
→ Java Decision Engine
→ Maintenance Decision
→ React Dashboard

### Limitations

- Synthetic dataset
- Temporary JSON bridge
- React currently uses mock data
- Java is not yet an HTTP service
- Health-score formula is provisional
- Decision thresholds are demonstration rules
- No database
- No RAG

---

## Phase 2 — Real Service Integration

**Status:** ⏳ Not started

### Goal

Replace the temporary connections with actual APIs.

### Planned

- [ ] Connect React to Python API
- [ ] Create Java HTTP API
- [ ] Connect Python → Java through HTTP
- [ ] Connect Java → frontend/gateway
- [ ] Remove temporary JSON bridge
- [ ] Remove frontend mock data

---

## Phase 3 — Real Dataset

**Status:** ⏳ Not started

### Planned

- [ ] NASA IMS dataset
- [ ] Data preprocessing
- [ ] Feature engineering
- [ ] Model evaluation
- [ ] Replace synthetic model

---

## Phase 4 — ...
