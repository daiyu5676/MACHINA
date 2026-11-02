require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

// Mongoose Models
const Asset = require("./models/Asset");
const SensorLog = require("./models/SensorLog");
const Prediction = require("./models/Prediction");
const Decision = require("./models/Decision");
const PredictionLog = require("./models/PredictionLog");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
const JAVA_ENGINE_URL = process.env.JAVA_ENGINE_URL || "http://127.0.0.1:8080";
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/machina";

// ==================================================
// MONGODB CONNECTION
// ==================================================

let mongoConnected = false;

mongoose.connect(DATABASE_URL)
    .then(() => {
        mongoConnected = true;
        console.log("Connected to MongoDB successfully at " + DATABASE_URL);
    })
    .catch((err) => {
        mongoConnected = false;
        console.warn("MongoDB unavailable — running without database persistence:", err.message);
    });

mongoose.connection.on("connected", () => { mongoConnected = true; });
mongoose.connection.on("disconnected", () => { mongoConnected = false; });
mongoose.connection.on("error", () => { mongoConnected = false; });


// ==================================================
// 1. HEALTH CHECK (All Microservices & Database)
// ==================================================

app.get("/health", async (req, res) => {
    let mlStatus = "offline";
    let javaStatus = "offline";

    try {
        const mlRes = await axios.get(`${ML_SERVICE_URL}/`, { timeout: 2000 });
        if (mlRes.status === 200) mlStatus = "running";
    } catch (_) {}

    try {
        const javaRes = await axios.get(`${JAVA_ENGINE_URL}/health`, { timeout: 2000 });
        if (javaRes.status === 200) javaStatus = "running";
    } catch (_) {}

    res.json({
        status: "Gateway is running",
        timestamp: new Date().toISOString(),
        services: {
            database: mongoConnected ? "connected" : "disconnected",
            mlService: mlStatus,
            decisionEngine: javaStatus
        },
        dbStatus: mongoConnected ? "connected" : "disconnected"
    });
});


// ==================================================
// 2. UNIFIED PREDICTION + EXPLANATION + DECISION
// ==================================================

app.post("/api/predict", async (req, res) => {
    const { temperature, vibration, rpm, load } = req.body;
    const asset_id = req.body.asset_id || "ENGINE-185";

    // Validate sensor inputs
    if (temperature === undefined || vibration === undefined || rpm === undefined || load === undefined) {
        return res.status(400).json({
            error: "Missing required sensor telemetry: temperature, vibration, rpm, and load are required."
        });
    }

    try {
        // --- Step 1: Request Prediction from Python ML Service ---
        const mlPredictRes = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            { temperature, vibration, rpm, load, asset_id },
            { timeout: 5000 }
        );
        const { failure_probability, health_score } = mlPredictRes.data;

        // --- Step 2: Request Explanation (SHAP) from Python ML Service ---
        let explanationFeatures = null;
        try {
            const mlExplainRes = await axios.post(
                `${ML_SERVICE_URL}/explain`,
                { temperature, vibration, rpm, load, asset_id },
                { timeout: 5000 }
            );
            explanationFeatures = mlExplainRes.data.features || null;
        } catch (explainErr) {
            console.warn("SHAP explanation unavailable:", explainErr.message);
        }

        // --- Step 3: Fetch Asset Metadata from Database (if available) ---
        let assetType = "Bearing";
        let criticality = "STANDARD";
        if (mongoConnected) {
            try {
                const assetDoc = await Asset.findOne({ asset_id });
                if (assetDoc) {
                    assetType = assetDoc.type || "Bearing";
                    criticality = assetDoc.criticality || "STANDARD";
                }
            } catch (dbReadErr) {
                console.warn("Could not fetch asset metadata from DB:", dbReadErr.message);
            }
        }

        // --- Step 4: Request Decision from Java Decision Engine ---
        let decisionData = null;
        try {
            const javaRes = await axios.post(
                `${JAVA_ENGINE_URL}/decide`,
                {
                    asset_id,
                    asset_type: assetType,
                    criticality,
                    health_score,
                    failure_probability
                },
                { timeout: 5000 }
            );
            decisionData = javaRes.data;
        } catch (javaErr) {
            console.warn("Java Decision Engine unavailable, evaluating local fallback rules:", javaErr.message);
            const fallbackDecision = health_score > 75 ? "MONITOR" : health_score >= 40 ? "REPAIR" : "REPLACE";
            decisionData = {
                decision: fallbackDecision,
                reason: `Deterministic rule fallback: Health score is ${health_score}/100`,
                strategy: "FallbackStrategy"
            };
        }

        const now = new Date();

        // --- Step 5: Persist Telemetry, Prediction & Decision to MongoDB ---
        if (mongoConnected) {
            try {
                // 1. Log raw sensor telemetry
                const sensorLog = new SensorLog({
                    asset_id,
                    timestamp: now,
                    temperature,
                    vibration,
                    rpm,
                    load
                });

                // 2. Log ML prediction + SHAP
                const predictionDoc = new Prediction({
                    asset_id,
                    timestamp: now,
                    failure_probability,
                    health_score,
                    explanation: explanationFeatures || {}
                });

                // 3. Log Java decision
                const decisionDoc = new Decision({
                    asset_id,
                    timestamp: now,
                    decision: decisionData.decision,
                    reason: decisionData.reason,
                    health_score,
                    strategy: decisionData.strategy || "StandardScoringStrategy"
                });

                // 4. Update asset status
                let assetStatus = "HEALTHY";
                if (decisionData.decision === "REPLACE" || health_score < 40) assetStatus = "CRITICAL";
                else if (decisionData.decision === "REPAIR" || health_score <= 75) assetStatus = "ATTENTION";

                const updateAsset = Asset.findOneAndUpdate(
                    { asset_id },
                    {
                        $set: {
                            status: assetStatus,
                            healthScore: health_score,
                            failureProbability: failure_probability,
                            decision: decisionData.decision,
                            latestSensors: { temperature, vibration, rpm, load },
                            lastAnalysis: now
                        }
                    },
                    { upsert: false }
                );

                // 5. PredictionLog for backwards compatibility
                const legacyLog = PredictionLog.create({
                    sensorData: req.body,
                    prediction: mlPredictRes.data,
                    explanation: explanationFeatures
                });

                await Promise.all([
                    sensorLog.save(),
                    predictionDoc.save(),
                    decisionDoc.save(),
                    updateAsset,
                    legacyLog
                ]);

            } catch (dbWriteErr) {
                console.error("Failed to persist analysis to MongoDB:", dbWriteErr.message);
            }
        }

        // --- Step 6: Return Unified Payload to Client ---
        res.json({
            asset_id,
            failure_probability,
            health_score,
            decision: decisionData.decision,
            reason: decisionData.reason,
            strategy: decisionData.strategy,
            explanation: explanationFeatures ? { features: explanationFeatures } : null,
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error("Prediction pipeline error:", error.message);
        res.status(500).json({
            error: "ML prediction service error",
            details: error.message
        });
    }
});


// ==================================================
// 3. EXPLAINABILITY ENDPOINT (Python SHAP)
// ==================================================

app.post("/api/explain", async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/explain`, req.body, { timeout: 5000 });
        res.json(response.data);
    } catch (error) {
        console.error("Explanation error:", error.message);
        res.status(500).json({ error: "ML explanation service unavailable" });
    }
});


// ==================================================
// 4. DIRECT DECISION ENDPOINT (Java Engine)
// ==================================================

app.post("/api/decide", async (req, res) => {
    try {
        const response = await axios.post(`${JAVA_ENGINE_URL}/decide`, req.body, { timeout: 5000 });
        res.json(response.data);
    } catch (error) {
        console.error("Decision engine error:", error.message);
        res.status(500).json({ error: "Java Decision Engine unavailable", details: error.message });
    }
});


// ==================================================
// 5. ASSET MANAGEMENT ENDPOINTS (MongoDB)
// ==================================================

// List all registered assets
app.get("/api/assets", async (req, res) => {
    if (!mongoConnected) {
        return res.status(503).json({ error: "Database offline", assets: [] });
    }
    try {
        const assets = await Asset.find().sort({ asset_id: 1 });
        res.json(assets);
    } catch (error) {
        console.error("Failed to fetch assets:", error.message);
        res.status(500).json({ error: "Failed to fetch assets" });
    }
});

// Get a single asset by asset_id
app.get("/api/assets/:id", async (req, res) => {
    if (!mongoConnected) {
        return res.status(503).json({ error: "Database offline" });
    }
    try {
        const asset = await Asset.findOne({ asset_id: req.params.id });
        if (!asset) {
            return res.status(404).json({ error: `Asset ${req.params.id} not found` });
        }
        res.json(asset);
    } catch (error) {
        console.error(`Failed to fetch asset ${req.params.id}:`, error.message);
        res.status(500).json({ error: "Failed to fetch asset details" });
    }
});

// Get 24-hour sensor and health trends for an asset
app.get("/api/assets/:id/trends", async (req, res) => {
    if (!mongoConnected) {
        return res.json({ asset_id: req.params.id, trends: [] });
    }
    try {
        const predictions = await Prediction.find({ asset_id: req.params.id })
            .sort({ timestamp: 1 })
            .limit(50);

        const trends = predictions.map(p => ({
            time: new Date(p.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
            timestamp: p.timestamp,
            health: p.health_score,
            failureProbability: p.failure_probability
        }));

        res.json({ asset_id: req.params.id, trends });
    } catch (error) {
        console.error(`Failed to fetch trends for asset ${req.params.id}:`, error.message);
        res.status(500).json({ error: "Failed to fetch asset trends" });
    }
});


// ==================================================
// 6. HISTORICAL AUDIT LOGS (MongoDB)
// ==================================================

app.get("/api/history", async (req, res) => {
    if (!mongoConnected) {
        return res.json([]);
    }

    try {
        const assetId = req.query.asset_id;
        const query = assetId ? { asset_id: assetId } : {};

        // Fetch recent predictions and join with decisions
        const recentPredictions = await Prediction.find(query)
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

        // Also fetch decisions for matching timestamps
        const timestamps = recentPredictions.map(p => p.timestamp);
        const decisions = await Decision.find({ timestamp: { $in: timestamps } }).lean();
        const decisionMap = new Map();
        for (const d of decisions) {
            decisionMap.set(`${d.asset_id}_${d.timestamp.getTime()}`, d);
        }

        const history = recentPredictions.map(p => {
            const dec = decisionMap.get(`${p.asset_id}_${new Date(p.timestamp).getTime()}`);
            return {
                asset_id: p.asset_id,
                time: p.timestamp,
                healthScore: p.health_score,
                failureProbability: p.failure_probability,
                decision: dec ? dec.decision : (p.health_score > 75 ? "MONITOR" : p.health_score >= 40 ? "REPAIR" : "REPLACE"),
                reason: dec ? dec.reason : null,
                strategy: dec ? dec.strategy : null,
                explanation: p.explanation || null
            };
        });

        res.json(history);

    } catch (error) {
        console.error("Failed to fetch history:", error.message);
        res.status(500).json({ error: "Failed to fetch history logs" });
    }
});


// ==================================================
// START GATEWAY SERVER
// ==================================================

app.listen(PORT, () => {
    console.log(`Machina Express Gateway running on http://localhost:${PORT}`);
    console.log(`- Python ML Service target:    ${ML_SERVICE_URL}`);
    console.log(`- Java Decision Engine target: ${JAVA_ENGINE_URL}`);
    console.log(`- MongoDB database:            ${DATABASE_URL}`);
});