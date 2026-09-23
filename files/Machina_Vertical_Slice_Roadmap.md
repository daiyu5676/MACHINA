# Machina — Vertical Slice Roadmap

### **Slice 1 — Core Proof of Concept**

**Predict → Explain → Decide → Display**

Prove the fundamental Machina loop works.

* Synthetic sensor input
* Python Random Forest prediction
* Failure probability
* Health score
* SHAP explanation
* Java decision engine
* React dashboard
* Temporary JSON bridge / mock frontend data

**Deliverable:** A demonstrable Machina prototype.

**Current status:** ✅ Complete

---

### **Slice 2 — Real Service Integration**

**React → Gateway → ML → Decision Engine → Database**

Remove the prototype shortcuts and make the services communicate.

* Express/Node gateway
* React → Gateway
* Gateway → Python ML
* Python → Java
* Java → Gateway
* MongoDB persistence
* Replace React mock data
* Remove temporary JSON bridge
* API error handling

**Deliverable:** A genuinely connected multi-service Machina pipeline.

**Current status:** ⏳ Next

---

### **Slice 3 — Real Industrial Intelligence**

**Real Data → Prediction → Explain → Decide**

Replace the synthetic ML foundation with the actual industrial dataset.

* NASA IMS Bearing Dataset
* Time-series preprocessing
* Feature extraction/engineering
* Train ML model
* Model evaluation
* Failure prediction
* SHAP explanations
* Reconnect the improved model to the existing pipeline

**Deliverable:** Machina's prediction pipeline operating on real industrial data with measurable model performance.

**Current status:** ⏳ Planned

---

### **Slice 4 — Decision Engine Maturity**

**Prediction → Risk Assessment → Maintenance Decision**

Turn the Java prototype into the proper deterministic decision layer.

* Java 17 Maven project
* REST API
* Strategy Pattern
* Factory Pattern where actually needed
* Singleton/rules management if justified
* Observer-based alerts
* Asset-specific decision rules
* Finalize `MONITOR / REPAIR / REPLACE`
* Input validation and edge cases

**Deliverable:** A robust Java decision service that converts model output into deterministic maintenance actions.

**Current status:** ⏳ Planned

---

### **Slice 5 — Production Dashboard**

**Live Pipeline → Usable Maintenance Interface**

Turn the current React prototype into the actual operator-facing product.

* Live API data
* Asset status
* Sensor trend charts
* Failure probability visualization
* SHAP explanation view
* Decision output
* Loading/error states
* Asset selection
* Historical predictions
* Responsive UI
* Recharts
* Final visual polish

**Deliverable:** A complete Machina operator dashboard.

**Current status:** ⏳ Planned

---

### **Slice 6 — Persistence & Historical Intelligence**

**Store → Retrieve → Analyze**

Make Machina remember what happened.

MongoDB collections for things like:

```text
Assets
SensorLogs
Predictions
Decisions
```

Then:

* Store incoming sensor data
* Store predictions
* Store SHAP results where appropriate
* Store decisions
* Retrieve historical data
* Display historical trends
* Link predictions to assets/time

**Deliverable:** Machina can maintain and query an asset's operational history.

**Current status:** ⏳ Planned

---

### **Slice 7 — MVP Integration & Deployment**

**Everything → One Deployable Product**

Bring the pieces together and harden the system.

* Full end-to-end integration testing
* API validation
* Failure handling
* Service health checks
* Configuration/environment variables
* Security basics
* Performance/latency checks
* Deployment
* Production documentation
* Demo scenario

**Deliverable:** **Machina MVP — Predict → Explain → Decide**, ready for the October 31 target.

**Current status:** ⏳ Planned

---

# Future Slice — RAG Knowledge Assistant

**Decision → Knowledge Retrieval → Maintenance Guidance**

Explicitly **post-launch / outside MVP**.

* Maintenance manuals
* SOPs
* Historical maintenance logs
* Document chunking
* Sentence Transformers
* ChromaDB
* Groq/LLM
* Retrieval pipeline
* grounded maintenance instructions
* Safety precautions / tools / procedures

**Deliverable:**

```text
Predict
   ↓
Explain
   ↓
Decide
   ↓
Guide
```

**Current status:** 🚫 Post-launch
