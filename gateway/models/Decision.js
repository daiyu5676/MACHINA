const mongoose = require("mongoose");

const DecisionSchema = new mongoose.Schema({
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
    decision: {
        type: String,
        enum: ["MONITOR", "REPAIR", "REPLACE"],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    health_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    strategy: {
        type: String,
        default: "StandardScoringStrategy"
    }
}, {
    timestamps: false
});

// Compound index for historical decision lookups per asset
DecisionSchema.index({ asset_id: 1, timestamp: -1 });

module.exports = mongoose.model("Decision", DecisionSchema);
