# Machina — Phase Execution Roadmap

**Target production deadline: October 31 (MVP — RAG excluded)**

RAG/ChromaDB/Groq have been moved out of the launch-critical path and are now a **post-launch future phase**. The MVP no longer depends on building ML + Java + Node + React + MongoDB *and* a vector DB + LLM integration in parallel — the core predict/explain/decide product ships first.

```
[Phase 1: Setup & Gateway] ──► [Phase 2: ML & SHAP] ──► [Phase 3: Java Engine] ──► [Phase 4: UI, Integration & Launch]
      (Weeks 1-2)                (Weeks 3-4)               (Weeks 5-6)                    (Weeks 7-10, Deadline: Oct 31)

                                                                                        ──► [Future Phase: RAG] (Post-launch)
```

---

## Phase 1 — Infrastructure, Monorepo Setup & API Gateway
**Weeks 1–2**

**Core Tasks:**
- Scaffold monorepo directory structure (`/frontend`, `/gateway`, `/java-decision-engine`, `/ml-service`).
- Provision MongoDB instance and define schemas for Assets, SensorLogs, Predictions, and Decisions.
- Build Node.js / Express.js REST API gateway routes for service proxying.

**Deliverable:** Operating API Gateway connected to MongoDB with health-check endpoints.

---

## Phase 2 — Python Machine Learning & Explainable AI Pipeline
**Weeks 3–4**

**Core Tasks:**
- Preprocess time-series data from the NASA IMS Bearing Dataset.
- Train and evaluate the Random Forest MVP failure-prediction model.
- Integrate SHAP to output feature importance scores alongside each prediction.
- Wrap model scripts in a FastAPI/Flask microservice exposing `/predict` and `/explain` endpoints.

**Deliverable:** Working Python ML microservice delivering health predictions alongside SHAP transparency metrics.

---

## Phase 3 — Java 17 Advanced OOP Decision Engine
**Weeks 5–6**

**Core Tasks:**
- Initialize Java 17 Maven project with dependencies for REST controllers and JSON parsing.
- Implement Strategy Pattern for health score calculations and risk thresholds.
- Implement Factory Pattern for dynamic asset creation and Singleton Pattern for global rules management.
- Implement Observer Pattern to trigger alerts upon critical score breaches.
- Define and finalize REPAIR / REPLACE / MONITOR decision thresholds.

**Deliverable:** Rule-validating Java decision engine returning deterministic repair/replace/monitor decisions.

---

## Phase 4 — React Dashboard, End-to-End Integration & Deployment
**Weeks 7–10 (Deadline: October 31)**

**Core Tasks:**
- Develop React.js dashboard with Tailwind CSS and Recharts: asset status card, sensor trend graphs, failure-probability bar, SHAP explanation view, and decision output.
- Connect UI to Express gateway to render the full MVP pipeline:
  `Sensors → ML (Python) → SHAP → Health Score → Decision (Java) → MongoDB → React UI`
- Perform system integration testing, latency optimization, and final deployment.

**Deliverable:** Fully functional, production-ready Machina MVP — Predict → Explain → Decide.

---

## Future Phase — Knowledge Base RAG Pipeline & LLM Integration
**Post-launch (not part of the Oct 31 deadline)**

**Core Tasks:**
- Chunk and vectorize PDF maintenance manuals, SOPs, and historical logs using Sentence Transformers.
- Store embeddings in local ChromaDB vector collections.
- Connect Groq Cloud API (Llama 3.3 / DeepSeek) to retrieve matching passages and synthesize natural-language repair instructions triggered by the Java engine's decision output.

**Deliverable:** RAG service extending each decision (e.g. "REPLACE BEARING") with detailed repair guidance — tools, safety precautions, removal/installation steps, torque specs — evolving Machina from *Predict → Explain → Decide* to *Predict → Explain → Decide → Guide*.
