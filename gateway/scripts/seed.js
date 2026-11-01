require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Asset = require("../models/Asset");
const SensorLog = require("../models/SensorLog");
const Prediction = require("../models/Prediction");
const Decision = require("../models/Decision");

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/machina";

const initialAssets = [
    {
        asset_id: "ENGINE-185",
        name: "Engine 185",
        type: "Engine",
        location: "Plant 1 - Turbomachinery Bay",
        criticality: "HIGH",
        status: "CRITICAL",
        healthScore: 30,
        failureProbability: 0.80,
        decision: "REPLACE",
        latestSensors: { temperature: 82.0, vibration: 0.84, rpm: 1800, load: 72 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    },
    {
        asset_id: "BEARING-A01",
        name: "Bearing Unit A-01",
        type: "Bearing",
        location: "Conveyor Line 1",
        criticality: "STANDARD",
        status: "HEALTHY",
        healthScore: 87,
        failureProbability: 0.124,
        decision: "MONITOR",
        latestSensors: { temperature: 72.4, vibration: 0.41, rpm: 1480, load: 55 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    },
    {
        asset_id: "BEARING-A02",
        name: "Bearing Unit A-02",
        type: "Bearing",
        location: "Conveyor Line 2",
        criticality: "STANDARD",
        status: "ATTENTION",
        healthScore: 64,
        failureProbability: 0.382,
        decision: "REPAIR",
        latestSensors: { temperature: 88.1, vibration: 0.72, rpm: 1720, load: 74 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    },
    {
        asset_id: "PUMP-B01",
        name: "Pump B-01",
        type: "Pump",
        location: "Cooling Circuit",
        criticality: "STANDARD",
        status: "HEALTHY",
        healthScore: 91,
        failureProbability: 0.061,
        decision: "MONITOR",
        latestSensors: { temperature: 61.3, vibration: 0.22, rpm: 1350, load: 42 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    },
    {
        asset_id: "MOTOR-C01",
        name: "Motor C-01",
        type: "Industrial Motor",
        location: "Extruder Bay",
        criticality: "HIGH",
        status: "CRITICAL",
        healthScore: 26,
        failureProbability: 0.741,
        decision: "REPLACE",
        latestSensors: { temperature: 94.7, vibration: 0.88, rpm: 1920, load: 88 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    },
    {
        asset_id: "COMPRESSOR-D01",
        name: "Compressor D-01",
        type: "Compressor",
        location: "Pneumatics Station",
        criticality: "STANDARD",
        status: "HEALTHY",
        healthScore: 82,
        failureProbability: 0.158,
        decision: "MONITOR",
        latestSensors: { temperature: 67.8, vibration: 0.35, rpm: 1550, load: 61 },
        lastAnalysis: new Date("2026-09-30T18:42:00Z")
    }
];

// Generate 24-hour historical records (intervals of 2 hours)
function generateHistory(asset, hoursBack = 24, stepHours = 2) {
    const sensorLogs = [];
    const predictions = [];
    const decisions = [];
    const now = new Date();

    const baseHealth = asset.healthScore;
    const baseFail = asset.failureProbability;
    const baseTemp = asset.latestSensors.temperature;
    const baseVib = asset.latestSensors.vibration;
    const baseRpm = asset.latestSensors.rpm;
    const baseLoad = asset.latestSensors.load;

    for (let h = hoursBack; h >= 0; h -= stepHours) {
        const time = new Date(now.getTime() - h * 60 * 60 * 1000);
        // Add subtle variation backwards in time
        const driftFactor = (hoursBack - h) / hoursBack;
        const temp = +(baseTemp - (driftFactor * 3.5) + (Math.random() * 1.5 - 0.75)).toFixed(1);
        const vib = +(baseVib - (driftFactor * 0.08) + (Math.random() * 0.04 - 0.02)).toFixed(3);
        const rpm = Math.round(baseRpm - (driftFactor * 40) + (Math.random() * 20 - 10));
        const load = Math.round(baseLoad - (driftFactor * 5) + (Math.random() * 4 - 2));

        const health = Math.min(100, Math.max(10, Math.round(baseHealth + (h * 0.35))));
        const failProb = +(Math.max(0.02, Math.min(0.98, baseFail - (h * 0.004)))).toFixed(3);
        
        let decision = "MONITOR";
        let reason = "Asset operating within acceptable standard tolerances";
        if (health < 40) {
            decision = "REPLACE";
            reason = `Critical health score (${health}/100) below threshold. Immediate replacement required.`;
        } else if (health <= 75) {
            decision = "REPAIR";
            reason = `Degraded health score (${health}/100). Maintenance and overhaul recommended.`;
        }

        sensorLogs.push({
            asset_id: asset.asset_id,
            timestamp: time,
            temperature: temp,
            vibration: vib,
            rpm: rpm,
            load: load
        });

        predictions.push({
            asset_id: asset.asset_id,
            timestamp: time,
            failure_probability: failProb,
            health_score: health,
            explanation: {
                vibration: +(vib * 0.35).toFixed(3),
                temperature: +(temp * 0.002).toFixed(3),
                load: +(load * 0.0015).toFixed(3),
                rpm: +(rpm * 0.00004).toFixed(3)
            }
        });

        decisions.push({
            asset_id: asset.asset_id,
            timestamp: time,
            decision: decision,
            reason: reason,
            health_score: health,
            strategy: asset.criticality === "HIGH" ? "HighCriticalityStrategy" : "StandardScoringStrategy"
        });
    }

    return { sensorLogs, predictions, decisions };
}

async function seedDatabase() {
    try {
        console.log(`Connecting to MongoDB at ${DATABASE_URL}...`);
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to MongoDB.");

        console.log("Clearing existing collections...");
        await Promise.all([
            Asset.deleteMany({}),
            SensorLog.deleteMany({}),
            Prediction.deleteMany({}),
            Decision.deleteMany({})
        ]);

        console.log(`Inserting ${initialAssets.length} core assets...`);
        await Asset.insertMany(initialAssets);

        let totalSensors = 0;
        let totalPreds = 0;
        let totalDecisions = 0;

        for (const asset of initialAssets) {
            const { sensorLogs, predictions, decisions } = generateHistory(asset);
            await SensorLog.insertMany(sensorLogs);
            await Prediction.insertMany(predictions);
            await Decision.insertMany(decisions);

            totalSensors += sensorLogs.length;
            totalPreds += predictions.length;
            totalDecisions += decisions.length;
        }

        console.log("Database seeded successfully!");
        console.log(`- Assets created: ${initialAssets.length}`);
        console.log(`- Sensor log entries: ${totalSensors}`);
        console.log(`- Predictions stored: ${totalPreds}`);
        console.log(`- Decision logs created: ${totalDecisions}`);

        await mongoose.disconnect();
        console.log("MongoDB disconnected cleanly.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedDatabase();
