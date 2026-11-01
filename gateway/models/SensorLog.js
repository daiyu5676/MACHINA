const mongoose = require("mongoose");

const SensorLogSchema = new mongoose.Schema({
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
    temperature: {
        type: Number,
        required: true
    },
    vibration: {
        type: Number,
        required: true
    },
    rpm: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});

// Compound index for efficient time-series queries per asset
SensorLogSchema.index({ asset_id: 1, timestamp: -1 });

module.exports = mongoose.model("SensorLog", SensorLogSchema);
