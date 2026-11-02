# MACHINA
> **Industrial Predictive Maintenance & Decision Support Platform**  
> An AI-powered decision support platform that transforms industrial asset telemetry into explainable, actionable maintenance decisions.

---

## Architecture Overview

MACHINA operates as a distributed microservice architecture designed for real-time industrial telemetry processing, explainable machine learning, deterministic engineering decisions, and persistent operational auditing:

```
                              ┌────────────────────────┐
                              │  React Dashboard UI    │
                              │  (Vite / Tailwind /    │
                              │   Recharts)            │
                              └───────────┬────────────┘
                                          │ HTTP
                                          ▼
                              ┌────────────────────────┐
                              │  Express API Gateway   │
                              │  (Node.js / Port 3000) │
                              └─────┬──────────────┬───┘
                                    │              │
                   ┌────────────────┴───┐          │
                   ▼                    ▼          ▼
         ┌───────────────────┐  ┌─────────────┐ ┌────────────────┐
         │ Python ML Service │  │ Java Engine │ │ MongoDB        │
         │ (FastAPI / 8000)  │  │ (Java 17 /  │ │ (Database:     │
         │ - Random Forest   │  │   Port 8080)│ │  'machina')   │
         │ - SHAP Explainer  │  │ - 4 GoF OOP │ │ - Assets       │
         │ - NASA IMS Model  │  │   Patterns  │ │ - SensorLogs   │
         └───────────────────┘  └─────────────┘ │ - Predictions  │
                                                │ - Decisions    │
                                                └────────────────┘
```

---

## Core Subsystems

### 1. Express API Gateway (`gateway/`)
- **Port**: `3000`
- **Role**: Central orchestrator for client traffic, authentication, telemetry validation, service fan-out, and audit persistence.
- **Key Routes**:
  - `GET /health`: Comprehensive multi-service health status.
  - `POST /api/predict`: Unified predictive maintenance pipeline (ML prediction + SHAP explanation + Java decision evaluation + MongoDB persistence).
  - `POST /api/explain`: Pure SHAP feature contribution breakdown.
  - `GET /api/assets`: List all tracked industrial plant assets.
  - `GET /api/assets/:id`: Specific asset metadata and health state.
  - `GET /api/assets/:id/trends`: Historical time-series telemetry trends.
  - `GET /api/history`: Recent operational prediction & decision audit log.

### 2. Python ML Service (`ml-service/`)
- **Port**: `8000`
- **Framework**: FastAPI + Uvicorn
- **Model**: `RandomForestClassifier` (250 estimators, balanced class weights, max depth 12) trained on the **NASA IMS Bearing Run-to-Failure Dataset**.
- **Metrics**: **99.12% Accuracy**, **0.9774 ROC-AUC**, **86.89% Precision**, **79.10% Recall**.
- **Explainability**: Integrated `shap.TreeExplainer` providing local feature attributions per telemetry snapshot in under 6.5 ms.

### 3. Java Decision Engine (`java-decision-engine/`)
- **Port**: `8080`
- **Runtime**: Zero-dependency Java 17 HTTP Microservice (`Server.java`)
- **Design Patterns Implemented (Gang of Four)**:
  - **Singleton Pattern** (`RulesEngineConfig`): Global thread-safe configuration for operational and safety thresholds.
  - **Strategy Pattern** (`DecisionStrategy`, `StandardScoringStrategy`, `HighCriticalityStrategy`): Pluggable domain heuristics tailored to asset criticality tiers.
  - **Factory Pattern** (`AssetFactory`, `AssetEvaluator`): Decoupled creation of evaluation contexts based on asset types and runtime criticality.
  - **Observer Pattern** (`AnomalyNotifier`, `ConsoleAnomalyListener`): Event-driven alerts and logging whenever health breaches critical limits.

### 4. Database & Persistence Layer (`gateway/models/`)
- **Database**: MongoDB (`machina`)
- **Mongoose Models**:
  - `Asset`: Asset registry, serial numbers, operational criticality, installation metadata, and live operational status.
  - `SensorLog`: High-resolution raw telemetry ingest (`temperature`, `vibration`, `rpm`, `load`).
  - `Prediction`: Model inference logs (`failure_probability`, `health_score`, SHAP `features`).
  - `Decision`: Actionable maintenance directives (`MONITOR`, `REPAIR`, `REPLACE`) with audit rationale and timestamps.

---

## NASA IMS Bearing Intelligence

MACHINA is trained on high-frequency run-to-failure vibration data collected by the **NASA Center for Intelligent Maintenance Systems (IMS)**:
- **Datasets**: Tests 1, 2, and 3 (9,464 raw snapshot files, ~193 million sensor data points).
- **Sampling Frequency**: 20 kHz acceleration signals across PCB 353B33 quartz accelerometers.
- **Physical Failure Modes**: Outer race fatigue spalling (Test 2 & 3), inner race defect, and roller element defect (Test 1).
- **Feature Extraction**: Extracted RMS vibration, kurtosis, peak amplitude, and correlated thermodynamic friction dissipation to synthesize [`data/nasa_ims_features.csv`](data/nasa_ims_features.csv) (12,456 observations).

---

## Quickstart & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Java JDK (17+)
- MongoDB (running locally on `mongodb://localhost:27017`)

### 1. Automated One-Command Startup (Windows PowerShell)
```powershell
.\start_backend.ps1
```
This script validates dependencies, compiles the Java engine, seeds MongoDB baseline assets, and launches the Java Decision Engine, Python ML Service, and Express Gateway concurrently.

---

### 2. Manual Service Launch

#### A. Java Decision Engine
```bash
cd java-decision-engine
javac -d bin src/*.java src/config/*.java src/engine/*.java src/factory/*.java src/model/*.java src/observer/*.java src/strategy/*.java src/util/*.java
java -cp bin Server
```

#### B. Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app:app --port 8000
```

#### C. Database Seeding & Express Gateway
```bash
cd gateway
npm install
node scripts/seed.js
node server.js
```

---

## Unified Prediction API Example

### Request
```bash
POST http://localhost:3000/api/predict
Content-Type: application/json

{
  "asset_id": "PUMP-001",
  "temperature": 88.0,
  "vibration": 0.65,
  "rpm": 1950.0,
  "load": 6200.0
}
```

### Response
```json
{
  "asset_id": "PUMP-001",
  "failure_probability": 1,
  "health_score": 0,
  "decision": "REPLACE",
  "reason": "Health score (0/100) breached critical safety boundary (<40). Immediate replacement required.",
  "strategy": "StandardScoringStrategy",
  "explanation": {
    "features": {
      "temperature": 0.1576,
      "vibration": 0.2355,
      "rpm": 0.1143,
      "load": -0.0082
    }
  },
  "timestamp": "2026-11-01T13:13:05.224Z"
}
```
