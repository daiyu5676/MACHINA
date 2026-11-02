const mongoose = require("mongoose");

const PredictionLogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    sensorData: {
        type: Object,
        required: true
    },
    prediction: {
        type: Object,
        required: true
    },
    explanation: {
        type: Object,
        default: null
    }
});

module.exports = mongoose.model("PredictionLog", PredictionLogSchema);
