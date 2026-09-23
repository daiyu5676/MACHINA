# Machina — Technical Implementation Specification

---

## 1. Microservice Architecture — MVP

Machina uses a multi-language microservice architecture designed to isolate concerns, enforce strict OOP design principles, and deliver low-latency inference. RAG/ChromaDB/Groq are **excluded from the MVP architecture** below and documented separately as a future extension (Section 4).

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

The Express Gateway sits between the frontend and every backend service, so the frontend never needs to know how an individual service works. The gateway handles:

- API requests
- Routing
- Inter-service communication
- Authentication (if needed)
- Combining responses where useful

---

## 2. Component & Technology Breakdown — MVP

| Layer | Technologies | Functional Purpose |
|---|---|---|
| **Frontend UI** | React.js, Tailwind CSS, Recharts | Renders asset status cards, sensor trend charts, failure probability, SHAP explanation bars, and the final Java decision. |
| **Gateway API** | Node.js, Express.js | Orchestrates HTTP routing, client authentication, and inter-service communication between the ML and Java engines. |
| **ML Service** | Python, Pandas, NumPy, Scikit-learn, SHAP | Trains/serves the Random Forest MVP failure-prediction model and computes SHAP feature-importance values for transparency. |
| **Decision Engine** | Java 17+, Maven | Executes deterministic business rules, converts the health score into a REPAIR / REPLACE / MONITOR decision using strict OOP design patterns. |
| **Database** | MongoDB | Stores assets, sensor logs, predictions, and decisions — providing historical sensor and decision tracking. |

---

## 3. Java Module — OOP Design Pattern Implementation

The Java 17 decision engine enforces strict Object-Oriented Programming (OOP) design patterns to guarantee reliable, auditable maintenance evaluations.

| Pattern | Implementation | Purpose |
|---|---|---|
| **Strategy** | `StandardScoringStrategy`, `HighCriticalityStrategy` | Defines interchangeable health/risk scoring algorithms selected dynamically based on asset classification. |
| **Factory** | `AssetFactory.createAsset(AssetType)` | Instantiates asset handlers without coupling caller classes to concrete asset implementations. |
| **Observer** | `AnomalyNotifier` | Registers event listeners that broadcast real-time alerts across gateway endpoints when health scores breach critical thresholds. |
| **Singleton** | `RulesEngineConfig` | Manages global system state, configuration rulesets, and database connection pools across the JVM. |

### Example decision logic (illustrative thresholds — final rules TBD)

```
Health > 75        → MONITOR
Health 40–75        → REPAIR
Health < 40         → REPLACE
```

```
ML:      "Failure probability = 87%"
   ↓
Health:  "23/100"
   ↓
Java:    "REPLACE"
```

---

## 4. Data Model (MongoDB)

### Assets
```
asset_id
name
type
location
status
```

### Sensor Logs
```
asset_id
timestamp
temperature
vibration
rpm
load
```

### Predictions
```
asset_id
failure_probability
health_score
timestamp
```

### Decisions
```
asset_id
decision
reason
timestamp
```

---

## 5. Future Extension: RAG Knowledge Base (Post-MVP)

**Not part of the October 31 architecture.** Documented here so the extension point is clear when it's built.

| Layer | Technologies | Functional Purpose |
|---|---|---|
| **RAG & AI** | Groq API, ChromaDB, Sentence Transformers | Vectorizes maintenance manuals, SOPs, and historical logs to synthesize step-by-step repair guidance via Llama 3.3 / DeepSeek, triggered by the Java engine's decision output. |

Future extended architecture:

```
Java Decision Engine ──► RAG Pipeline (ChromaDB) ──► Groq (Llama 3.3 / DeepSeek) ──► Repair Guidance ──► React UI
```
