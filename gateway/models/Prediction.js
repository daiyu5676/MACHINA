const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    failure_probability: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    health_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    explanation: {
        temperature: { type: Number, default: 0 },
        vibration: { type: Number, default: 0 },
        rpm: { type: Number, default: 0 },
        load: { type: Number, default: 0 }
    }
}, {
    timestamps: false
});

// Compound index for historical prediction queries per asset
PredictionSchema.index({ asset_id: 1, timestamp: -1 });

module.exports = mongoose.model("Prediction", PredictionSchema);
