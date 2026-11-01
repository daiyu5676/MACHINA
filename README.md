# MACHINA
 AI-Powered Predictive Maintenance & Decision Support

> Predict. Explain. Decide. Prevent.

MACHINA is an AI-powered industrial decision-support platform designed to transform raw machine sensor data into **failure predictions, explainable insights, and actionable maintenance decisions**.

Instead of simply predicting *whether* a machine may fail, MACHINA aims to answer three critical questions:

> Is the machine at risk? Why is it at risk? What should we do about it?

---

 What is MACHINA?

Industrial machines continuously generate sensor data such as:

- Temperature
- Vibration
- Load
- RPM

MACHINA processes these signals through an AI/ML pipeline to estimate machine health and failure probability.

The prediction is then explained using SHAP, while a dedicated Java Decision Engine converts the intelligence into a maintenance-oriented decision.


The Core Idea


        MACHINE / SENSOR DATA
                 |
                 v
        +-----------------+
        |   ML SERVICE    |
        |  Python + ML    |
        +--------+--------+
                 |
        Prediction + Risk
                 |
                 v
        +-----------------+
        | SHAP EXPLAINER  |
        |  Why this risk? |
        +--------+--------+
                 |
                 v
        +-----------------+
        | DECISION ENGINE |
        |      Java       |
        +--------+--------+
                 |
                 v
        Maintenance Decision
                 |
                 v
        +-----------------+
        | React Dashboard |
        +-----------------+




The Problem

Traditional maintenance approaches often rely on:

Reactive maintenance

> Machine fails → repair it.

or

Scheduled maintenance

> Replace or inspect components after a fixed period.

Both approaches have limitations.

MACHINA aims to move toward:

Predictive + Explainable + Actionable Maintenance


Sensor Data
     |
     v
AI Prediction
     |
     v
Failure Risk
     |
     v
Explainability
     |
     v
Maintenance Decision
     |
     v
Prevent Failure


---

 # Key Features

 Machine Failure Prediction

Uses machine sensor inputs to estimate the probability of failure.

 Machine Health Score

Converts model output into an intuitive machine-health indicator.

Explainable AI

Uses SHAP (SHapley Additive exPlanations) to identify which sensor features contribute most to the prediction.

Example:

Vibration       +0.236
Temperature     +0.152
Load            +0.134
RPM             +0.008


This makes the prediction more interpretable instead of treating the ML model as a black box.

 Decision Intelligence

A dedicated Java decision engine is being integrated to convert ML insights into maintenance-oriented decisions.

 Industrial Dashboard

The React dashboard provides a visual interface for:

- Machine health
- Failure probability
- Sensor information
- SHAP explanations
- Maintenance decisions
- Historical trends





 Architecture

```text
                         +----------------------+
                         |   Industrial Asset   |
                         |   / Sensor Inputs    |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |    React Frontend    |
                         |      Dashboard       |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   Express Gateway    |
                         |      API Layer       |
                         +-------+-------+------+
                                 |       |
                    +------------+       +-------------+
                    |                              |
                    v                              v
          +------------------+            +------------------+
          |   Python ML      |            |  Java Decision   |
          |     Service      |            |      Engine      |
          +------------------+            +--------+---------+
          | Prediction       |                     |
          | Failure Risk     |                     |
          | Health Score     |                     |
          | SHAP             |                     |
          +--------+---------+                     |
                   |                               |
                   +---------------+---------------+
                                   |
                                   v
                         +----------------------+
                         |  Actionable Result   |
                         | Prediction + Reason  |
                         | + Maintenance Action |
                         +----------------------+
```

---

Technology Stack

| Layer                           Technology |
| Frontend                             React |
| API Gateway              Node.js + Express |
| Machine Learning                    Python |
| ML Model                     Random Forest |
| Explainability                        SHAP |
| Decision Engine                       Java |
| Visualization                     Recharts |
| Persistence              MongoDB (planned) |
| RAG               ChromaDB + Groq (future) |
| Dataset NASA IMS Bearing Dataset (planned) |

---
Project Structure


MACHINA/
|
+-- data/
|   +-- Dataset / machine data
|
+-- frontend/
|   +-- React dashboard
|
+-- gateway/
|   +-- Express API gateway
|
+-- ml-service/
|   +-- Python ML service
|
+-- java-decision-engine/
|   +-- Java maintenance decision logic
|
+-- files/
|   +-- Project-related files
|
+-- PROGRESS.md
|
+-- README.md




Current Data Flow

MACHINA currently supports the core prediction and explanation pipeline:


Machine Input
      |
      v
React
      |
      v
Express Gateway
      |
      +----------------+
      |                |
      v                v
 /api/predict     /api/explain
      |                |
      v                v
 Python ML       SHAP Explanation
      |                |
      +--------+-------+
               |
               v
        React Dashboard

The current pipeline can produce outputs such as:


Failure Probability
        0.89

Health Score
        11 / 100

SHAP Contributions
        Vibration      +0.23625
        Temperature    +0.151875
        Load            +0.134375
        RPM             +0.0075




Development Progress

MACHINA is being developed incrementally through implementation slices.

Slice 1 — Core Proof of Concept

Status: Complete

- [x] Synthetic sensor input
- [x] Random Forest prediction
- [x] Failure probability
- [x] Health score
- [x] SHAP explanation
- [x] Java decision engine prototype
- [x] React dashboard
- [x] Initial JSON/mock bridge

---

Slice 2 — Predict + Explain Integration

Status: Complete

- [x] Express API gateway
- [x] Gateway health check
- [x] `/api/predict`
- [x] `/api/explain`
- [x] Python ML communication
- [x] React prediction API integration
- [x] React explanation API integration
- [x] Dynamic health score
- [x] Dynamic failure probability
- [x] Dynamic SHAP contributions
- [x] Loading states
- [x] Error states

---

Slice 3 — Decision Engine Integration

Status: In Progress

- [ ] Integrate Java Decision Engine
- [ ] Gateway → Java Decision Engine
- [ ] Replace hardcoded frontend decisions
- [ ] Expose decision output to React

---

Slice 4 — Real Industrial Intelligence

Status: Planned

- [ ] NASA IMS Bearing Dataset
- [ ] Time-series preprocessing
- [ ] Feature engineering
- [ ] ML model training
- [ ] Model evaluation
- [ ] Failure prediction
- [ ] SHAP explanations
- [ ] Connect improved model to existing pipeline

---

Slice 5 — Production Dashboard

Status: Planned

- [ ] Live API data
- [ ] Asset status
- [ ] Sensor trend charts
- [ ] Failure probability visualization
- [ ] SHAP explanation view
- [ ] Decision output
- [ ] Asset selection
- [ ] Historical prediction UI
- [ ] Recharts integration
- [ ] Responsive UI
- [ ] Final visual polish

---

Slice 6 — Persistence & Historical Intelligence

Status: Planned

- [ ] MongoDB integration
- [ ] Store sensor data
- [ ] Store predictions
- [ ] Store SHAP results
- [ ] Store decisions
- [ ] Retrieve historical data
- [ ] Historical trends
- [ ] Asset/time-linked predictions

---

Slice 7 — MVP Integration & Deployment

Status: Planned

- [ ] End-to-end testing
- [ ] API validation
- [ ] Failure handling
- [ ] Service health checks
- [ ] Environment configuration
- [ ] Security basics
- [ ] Performance checks
- [ ] Deployment
- [ ] Production documentation
- [ ] Demo scenario

---

Future: RAG Maintenance Assistant

After the core predictive-maintenance system is complete, MACHINA is planned to evolve into a maintenance knowledge assistant.

The future system will combine machine intelligence with industrial documentation.


Maintenance Manuals
        |
SOPs ---+
        |
Historical Logs
        |
        v
Document Chunking
        |
        v
Sentence Transformers
        |
        v
     ChromaDB
        |
        v
    Retrieval
        |
        v
    Groq / LLM
        |
        v
Grounded Maintenance Guidance

The assistant will be designed to provide:

- Maintenance instructions
- Relevant SOPs
- Safety precautions
- Required tools
- Troubleshooting procedures
- Evidence-backed recommendations



Roadmap


                    MACHINA ROADMAP

      +-----------------------------+
      |  1. Core Proof of Concept  |
      |            COMPLETE         |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  2. Predict + Explain      |
      |            COMPLETE         |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  3. Decision Engine        |
      |            IN PROGRESS      |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  4. Industrial ML           |
      |            PLANNED          |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  5. Production Dashboard   |
      |            PLANNED          |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  6. Persistence             |
      |            PLANNED          |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  7. Deployment              |
      |            PLANNED          |
      +--------------+--------------+
                     |
                     v
      +-----------------------------+
      |  RAG Maintenance Assistant |
      |            FUTURE           |
      +-----------------------------+


---

Design Philosophy

MACHINA is built around four principles:

 01 — Predict

Identify potential machine failures before they happen.

 02 — Explain

Show the factors responsible for the model's prediction.

 03 — Decide

Translate predictions into maintenance-oriented decisions.

 04 — Act

Eventually provide grounded instructions that help maintenance teams respond safely and effectively.


Additional dependencies may be required by individual services.

---

Project Services


# Example Prediction

For a machine exhibiting elevated operating conditions, the system may produce:


+------------------------------------+
|          MACHINE HEALTH            |
+------------------------------------+
|                                    |
| Failure Probability       89%      |
| Health Score              11/100   |
|                                    |
+------------------------------------+
|        TOP CONTRIBUTORS            |
|                                    |
| Vibration               +0.23625   |
| Temperature             +0.15188   |
| Load                    +0.13438   |
| RPM                     +0.00750   |
+------------------------------------+


The goal is to move from a raw numerical prediction to a complete decision:


"What is likely to happen?"
             |
             v
"Why?"
             |
             v
"What should we do?"

---


MACHINA is a research/prototype project for **AI-assisted industrial maintenance decision support**.

 MACHINA

From machine signals → to intelligence → to action.
