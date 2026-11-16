# MACHINA — End-to-End System Explanation

> **Industrial Predictive Maintenance & Decision Support Platform**  
> An enterprise AI-driven microservice platform that transforms sensor telemetry into explainable predictions and deterministic, auditable engineering decisions.

---

## 1. System Architecture Overview

MACHINA is built as a multi-language microservice architecture. Each service has a single responsibility and communicates over HTTP REST APIs orchestrated by an Express Gateway:

```
┌────────────────────────────────────────────────────────┐
│                   React Dashboard UI                   │
│             (Vite / Tailwind / Recharts / 5173)        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP (POST /api/predict)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Express API Gateway                   │
│                 (Node.js / Port 3000)                  │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│     Python ML Service     │ │   Java Decision Engine   │
│     (FastAPI / 8000)      │ │   (Java 17 / Port 8080)  │
│  - NASA IMS Random Forest │ │  - 4 GoF OOP Patterns    │
│  - SHAP TreeExplainer     │ │  - Deterministic Rules   │
└───────────────────────────┘ └──────────────────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
              ┌──────────────────────────┐
              │    Persistence Layer     │
              │ - MongoDB Atlas / Local  │
              │ - In-Memory / Session    │
              └──────────────────────────┘
```

---

## 2. Core Subsystems

### 1. Frontend UI (`frontend/` — Port 5173)
- **Tech Stack:** React 19, Vite, Tailwind CSS, Recharts, React Router.
- **Dynamic Fleet Store (`MachineContext.jsx`):** 
  - Manages registered machines completely dynamically (no static hardcoded data).
  - Persists state in browser `sessionStorage` so refreshing does not lose entered data.
  - Exposes `addSensorLog()`, `runAnalysis()`, and `selectMachine()`.
- **Telemetry Ingestion (`SensorLogInput.jsx`):**
  - Allows manual input of `Machine ID`, `Name`, `Vibration`, `Temperature`, `Load`, `RPM`, and `Timestamp`.
  - Includes **One-Click Calibrated Presets**:
    - 🟢 **Nominal (Healthy):** Vibration `0.06`, Temp `52.0°C`, Load `45%`, RPM `1480` ➔ `MONITOR`
    - 🟡 **Elevated Fault (Repair):** Vibration `0.18`, Temp `66.0°C`, Load `72%`, RPM `1720` ➔ `REPAIR`
    - 🔴 **Critical Failure (Replace):** Vibration `0.38`, Temp `86.5°C`, Load `85%`, RPM `1860` ➔ `REPLACE`
    - 🎲 **Randomize:** Generates valid, physically plausible industrial telemetry.
- **Production Dashboard (`Dashboard.jsx`):**
  - Displays registered fleet cards with live sensor badges.
  - Renders 4 condition metrics (`Asset Health`, `Failure Probability`, `Operational Condition`, `Telemetry Stream`).
  - Displays **Model Contributions (SHAP)** bars and **Maintenance Recommendation (Java Decision Engine)**.

---

### 2. Express API Gateway (`gateway/` — Port 3000)
- **Tech Stack:** Node.js, Express, Axios, Mongoose.
- **Role:** Central orchestrator. The frontend never talks directly to Python or Java; it only interacts with the Gateway.
- **Unified Pipeline (`POST /api/predict`):**
  1. Validates incoming telemetry (`temperature`, `vibration`, `rpm`, `load`, `asset_id`).
  2. Dispatches telemetry to **Python ML Service** for failure prediction and SHAP explanation.
  3. Forwards health score and probability to **Java Decision Engine** for rule evaluation.
  4. Persists the unified analysis into MongoDB (if connected) or continues in-memory (if offline).
  5. Combines ML inference, SHAP weights, and Java OOP decisions into a single JSON response.

---

### 3. Python ML Service (`ml-service/` — Port 8000)
- **Tech Stack:** FastAPI, Uvicorn, Scikit-learn, Pandas, SHAP.
- **Model:** `RandomForestClassifier` trained on high-frequency run-to-failure vibration signals from the **NASA IMS Bearing Dataset**.
- **Metrics:** **99.12% Accuracy**, **0.9774 ROC-AUC**.
- **Explainability:** Integrated `shap.TreeExplainer` providing mathematical feature importance contributions per inference.
- **Domain Preprocessing:** Automatically maps user inputs (e.g., percentage loads `0–100%`) into the model's physical training space (`5,500–6,500 lbs` radial spring load), ensuring accurate scoring across standard industrial machines.

---

### 4. Java Decision Engine (`java-decision-engine/` — Port 8080)
- **Tech Stack:** Java 17, zero external dependencies (`com.sun.net.httpserver`).
- **Role:** Deterministic engineering logic. It receives the probabilistic ML output and converts it into auditable maintenance directives (`MONITOR`, `REPAIR`, `REPLACE`).
- **4 Gang of Four (GoF) OOP Design Patterns Implemented:**
  1. **Singleton Pattern (`RulesEngineConfig`):** Manages thread-safe global thresholds, safety margins, and server ports across the JVM.
  2. **Strategy Pattern (`DecisionStrategy`, `StandardScoringStrategy`, `HighCriticalityStrategy`):** Decouples the decision logic into interchangeable algorithms selected dynamically based on machine criticality tiers.
  3. **Factory Pattern (`AssetFactory`, `AssetEvaluator`):** Decouples creation of asset evaluation contexts based on runtime asset classification.
  4. **Observer Pattern (`AnomalyNotifier`, `ConsoleAnomalyListener`):** Broadcasts real-time events whenever health breaches critical limits.

---

## 3. End-to-End Data Flow

```
[ User inputs telemetry / clicks Preset on Dashboard ]
                        │
                        ▼
[ React dispatches POST http://localhost:3000/api/predict ]
                        │
                        ▼
            [ Express API Gateway ]
           ┌────────────┴────────────┐
           ▼                         ▼
 [ POST /predict & /explain ]     [ POST /decide ]
    Python ML Service (8000)      Java Decision Engine (8080)
    - failure_probability: 0.0%    - Evaluates Strategy Pattern
    - health_score: 100            - Decision: MONITOR
    - SHAP: Vibration, Temp        - Rationale: "Health score 100..."
           │                         │
           └────────────┬────────────┘
                        ▼
    [ Gateway assembles Unified Payload ]
                        │
                        ▼
[ React Dashboard Updates in Real Time ]
  - Health: 100 / 100 (Optimal)
  - Failure Risk: 0.0% (Low Risk)
  - Maintenance: MONITOR (Strategy: StandardScoringStrategy)
  - SHAP Bars: Real feature attributions
```

---

## 4. Port & Service Summary

| Service | Port | Health Check | Description |
|---|---|---|---|
| **React Frontend** | `5173` | `http://localhost:5173` | Interactive dynamic dashboard & telemetry ingest |
| **Express Gateway** | `3000` | `http://localhost:3000/health` | Central API orchestrator & persistence layer |
| **Python ML** | `8000` | `http://localhost:8000/` | Random Forest failure prediction + SHAP |
| **Java Decision Engine** | `8080` | `http://localhost:8080/health` | 4 GoF OOP patterns deterministic decision support |
| **MongoDB** | `27017` / Atlas | Connection check in Gateway | Historical audit store (runs fallback if offline) |

---

## 5. Quickstart

To launch all backend microservices and the frontend in separate terminal windows:
```powershell
.\start_all.ps1
```
*(Or use `.\start_backend.ps1` for backend services only).*
