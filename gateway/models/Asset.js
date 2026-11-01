const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["Engine", "Bearing", "Pump", "Compressor", "Gearbox", "Industrial Motor"],
        default: "Bearing"
    },
    location: {
        type: String,
        default: "Sector A"
    },
    criticality: {
        type: String,
        enum: ["STANDARD", "HIGH"],
        default: "STANDARD"
    },
    status: {
        type: String,
        enum: ["HEALTHY", "ATTENTION", "CRITICAL"],
        default: "HEALTHY"
    },
    healthScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    failureProbability: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    decision: {
        type: String,
        enum: ["MONITOR", "REPAIR", "REPLACE"],
        default: "MONITOR"
    },
    latestSensors: {
        temperature: { type: Number, default: 0 },
        vibration: { type: Number, default: 0 },
        rpm: { type: Number, default: 0 },
        load: { type: Number, default: 0 }
    },
    lastAnalysis: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Asset", AssetSchema);
