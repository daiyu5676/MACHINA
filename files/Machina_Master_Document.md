# Machina — Master Document

**Target production deadline:** October 31

---

## 1. Core Vision & Executive Summary

> **Machina predicts industrial equipment failure and converts that prediction into an explainable, rule-validated maintenance decision.**

Machina is an AI-powered decision support platform designed to close the critical operational gap in industrial asset maintenance.

Traditional monitoring platforms generate predictive alerts but stop short of guiding physical repairs. This leaves engineers with manual guesswork and knowledge scattered across unindexed manuals, standard operating procedures (SOPs), and historical logs — resulting in up to **40% wasted diagnostic time** on plant floors.

Machina converts raw sensor streams into a health score, an explainable failure prediction, and a single rule-validated maintenance decision — **Repair, Replace, or Monitor** — that maintenance teams can act on immediately.

**Scope note:** the October 31 MVP is intentionally scoped to *Predict → Explain → Decide*. The knowledge-base / repair-guidance layer (RAG) is a **planned future extension**, not a dependency for launch. This keeps the core product (ML + Java + Node + React + MongoDB) buildable and solid on its own, rather than also requiring a vector DB and LLM integration to ship.

---

## 2. System Value Chain Workflow — MVP

The MVP processes industrial asset health through a single, linear pipeline:

```
Sensor Data → Python ML Model → Failure Prediction → Health Score + SHAP Explanation
   → Java Decision Engine → REPAIR / REPLACE / MONITOR → MongoDB → React Dashboard
```

| Stage | Description |
|---|---|
| **1. Sensor / Asset Data** | Captures real-time sensor metrics (temperature, vibration, RPM, load) for an industrial asset, trained and benchmarked against the NASA IMS Bearing Dataset. |
| **2. ML Failure Prediction** | Python (Random Forest MVP) predicts a failure probability from sensor features, e.g. "Failure Probability: 87%". |
| **3. SHAP Explainability** | SHAP attributes the prediction to contributing features (e.g. vibration, temperature) so the result is never a bare percentage. |
| **4. Health Score** | Standardises the ML output into a single 0–100 operational score with a status band (Healthy / Warning / Critical / Failure). |
| **5. Java Decision Engine** | Passes the health score through deterministic, rule-based OOP logic to output REPAIR / REPLACE / MONITOR. |
| **6. MongoDB** | Persists assets, sensor logs, predictions, and decisions — giving historical sensor and decision tracking. |
| **7. React Dashboard** | Displays asset status, sensor trends, failure probability, SHAP explanation, and the final decision. |

### Example walk-through

```
Sensor:  Bearing B204 — Temp 82°C, Vibration 0.84, RPM 1800, Load 72%
   ↓
ML:      Failure Probability = 87%
   ↓
SHAP:    Vibration and rising temperature are the major contributors
   ↓
Health:  23/100 — CRITICAL
   ↓
Java:    REPLACE
```

---

## 3. Key User Profiles & Operational Roles

### Maintenance & Reliability Engineers
- Requires automated decision support to choose between asset repair or replacement.
- Goal: cut diagnostic time by up to 40%.

### Plant & Operations Managers
- Focuses on reducing unplanned equipment downtime.
- Optimizes spare parts inventory based on predicted failure lead times.

---

## 4. MVP Feature Summary

| Feature | Status |
|---|---|
| Industrial asset management | ✅ MVP |
| Sensor data ingestion | ✅ MVP |
| NASA IMS dataset | ✅ MVP |
| Failure prediction (Random Forest) | ✅ MVP |
| SHAP explainability | ✅ MVP |
| Health score | ✅ MVP |
| Rule-based maintenance decision (Java) | ✅ MVP |
| Repair / Replace / Monitor | ✅ MVP |
| Java OOP architecture (Strategy, Factory, Observer, Singleton) | ✅ MVP |
| MongoDB persistence (historical sensor data & decisions) | ✅ MVP |
| React dashboard + sensor trend graphs | ✅ MVP |
| Express API gateway | ✅ MVP |
| End-to-end integration | ✅ MVP |
| RAG / ChromaDB / manual ingestion / Groq repair assistant | 🔜 Planned (post-MVP) |

---

## 5. Future Phase: RAG-Based Repair Guidance

Kept in the roadmap and documentation as a defined extension, not a launch dependency.

```
                    CURRENT MVP
                        │
Sensor → ML → SHAP → Java → Decision → Dashboard
                                    │
                              FUTURE EXTENSION
                                    ↓
                          RAG Knowledge Base
                          (ChromaDB + Manuals)
                                    ↓
                                  Groq
                                    ↓
                       Detailed Repair Guidance
```

- **MVP story:** Predict → Explain → Decide
- **Future Machina story:** Predict → Explain → Decide → **Guide**

Once RAG is added, a decision like "REPLACE BEARING" can be followed by a synthesized maintenance procedure: required tools, safety precautions, removal/installation steps, torque specifications, etc., pulled from indexed manuals and SOPs.

---

## 6. Related Documents

- **Implementation Specification** — technical architecture, component breakdown, and OOP design patterns.
- **Phase Execution Roadmap** — phased delivery plan targeting the October 31 MVP, with RAG as a post-launch phase.
