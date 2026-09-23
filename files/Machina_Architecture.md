# Machina — Architecture Document

---

## 1. Architecture Overview

Machina is a multi-language microservice system. Each service is isolated by responsibility and communicates through a single API gateway, so the frontend never talks to the ML or decision services directly.

```
Sensor Data → Python ML Model → Failure Prediction → Health Score + SHAP Explanation
   → Java Decision Engine → REPAIR / REPLACE / MONITOR → MongoDB → React Dashboard
```

**MVP scope (Oct 31):** everything above.
**Post-MVP extension:** RAG knowledge base (ChromaDB + Groq) — see Section 5.

---

## 2. MVP System Diagram

```
                     ┌───────────────────┐
                     │   React Dashboard │
                     └─────────┬─────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │ Express Gateway   │
                     └─────────┬─────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌──────────────────┐
        │ Python ML       │        │ Java Decision    │
        │                 │        │ Engine            │
        │ Random Forest   │───────►│ Rules + OOP      │
        │ SHAP            │        │                  │
        └────────┬────────┘        └────────┬─────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌───────────────────┐
                    │     MongoDB       │
                    │ Assets / Logs /   │
                    │ Predictions /     │
                    │ Decisions         │
                    └───────────────────┘
```

---

## 3. Service Responsibilities

| Service | Owns | Talks to |
|---|---|---|
| **React Dashboard** | UI rendering: asset cards, sensor trend charts, failure %, SHAP bars, decision output | Express Gateway only |
| **Express Gateway** | Routing, auth, inter-service orchestration, response combining | React, Python ML, Java Engine |
| **Python ML Service** | Random Forest failure prediction, SHAP explainability | Express Gateway, Java Engine (passes prediction downstream) |
| **Java Decision Engine** | Deterministic rule evaluation, OOP-driven scoring, REPAIR/REPLACE/MONITOR output | Python ML (receives prediction), MongoDB, Express Gateway |
| **MongoDB** | Persistent store: assets, sensor logs, predictions, decisions | Java Engine, Express Gateway |

---

## 4. Request / Data Flow

```
1. Sensor reading ingested        → stored in MongoDB (SensorLogs)
2. Express requests prediction    → Python ML Service
3. Python returns                 → failure_probability + SHAP feature weights
4. Express forwards prediction    → Java Decision Engine
5. Java computes health_score     → applies Strategy-selected scoring rules
6. Java outputs decision          → REPAIR / REPLACE / MONITOR
7. Decision + prediction persisted → MongoDB (Predictions, Decisions)
8. Express returns combined payload → React Dashboard renders result
```

### Example trace

```
Sensor:  Bearing B204 — Temp 82°C, Vibration 0.84, RPM 1800, Load 72%
   ↓
ML:      Failure Probability = 87%
   ↓
SHAP:    Vibration + rising temperature = major contributors
   ↓
Health:  23/100 — CRITICAL
   ↓
Java:    REPLACE
```

---

## 5. Java Decision Engine — Internal Architecture

The decision engine is the deterministic core of Machina and is built with four OOP design patterns:

```
┌─────────────────────────────────────────────────────┐
│                Java Decision Engine                  │
│                                                       │
│  RulesEngineConfig (Singleton)                        │
│      └── holds global thresholds & DB connections     │
│                                                       │
│  AssetFactory.createAsset(AssetType) (Factory)         │
│      └── instantiates asset-specific handlers          │
│                                                       │
│  ScoringStrategy (Strategy)                            │
│      ├── StandardScoringStrategy                       │
│      └── HighCriticalityStrategy                       │
│                                                       │
│  AnomalyNotifier (Observer)                            │
│      └── broadcasts alerts on threshold breach          │
└─────────────────────────────────────────────────────┘
```

| Pattern | Class | Purpose |
|---|---|---|
| Singleton | `RulesEngineConfig` | Global config, thresholds, connection pooling |
| Factory | `AssetFactory` | Creates asset handlers without coupling to concrete types |
| Strategy | `ScoringStrategy` implementations | Interchangeable scoring logic per asset classification |
| Observer | `AnomalyNotifier` | Real-time alert broadcast on critical breaches |

### Illustrative thresholds (final rules TBD)
```
Health > 75        → MONITOR
Health 40–75        → REPAIR
Health < 40         → REPLACE
```

---

## 6. Data Model (MongoDB)

```
Assets            SensorLogs         Predictions          Decisions
─────────         ─────────          ─────────            ─────────
asset_id          asset_id           asset_id             asset_id
name              timestamp          failure_probability  decision
type              temperature        health_score         reason
location          vibration          timestamp            timestamp
status            rpm
                  load
```

Relationships: `SensorLogs`, `Predictions`, and `Decisions` all key off `asset_id` in `Assets`, giving full historical traceability per asset.

---

## 7. Future Architecture Extension: RAG Knowledge Base

Not part of the Oct 31 MVP. Extends the Java Decision Engine's output with retrieval-augmented repair guidance.

```
                    CURRENT MVP
                        │
Sensor → ML → SHAP → Java → Decision → MongoDB → React
                                    │
                                    │  (decision output, e.g. "REPLACE")
                                    ▼
                          RAG Knowledge Base
                    ┌───────────────────────────┐
                    │ Sentence Transformers      │
                    │   → chunk & embed PDFs     │
                    │   (manuals, SOPs, logs)    │
                    │        ↓                   │
                    │      ChromaDB              │
                    │   (vector store)           │
                    │        ↓                   │
                    │  Groq API                  │
                    │  (Llama 3.3 / DeepSeek)    │
                    └──────────┬─────────────────┘
                               ▼
                    Detailed Repair Guidance
                    (tools, safety, steps, torque specs)
                               ▼
                        React Dashboard
```

**Evolution:** *Predict → Explain → Decide* (MVP) becomes *Predict → Explain → Decide → Guide* (future).

---

## 8. Technology Stack Summary

| Layer | Technologies |
|---|---|
| Frontend | React.js, Tailwind CSS, Recharts |
| Gateway | Node.js, Express.js |
| ML Service | Python, Pandas, NumPy, Scikit-learn, SHAP |
| Decision Engine | Java 17+, Maven |
| Database | MongoDB |
| *(Future)* RAG | ChromaDB, Sentence Transformers, Groq API (Llama 3.3 / DeepSeek) |
