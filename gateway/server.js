require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const PredictionLog = require("./models/PredictionLog");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/Machina";

// Connect to MongoDB
mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

app.get("/health", (req, res) => {
    res.json({
        status: "Gateway is running",
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.post("/api/predict", async (req, res) => {
    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            req.body
        );

        // Save prediction log to MongoDB
        try {
            await PredictionLog.create({
                sensorData: req.body,
                prediction: response.data
            });
        } catch (dbErr) {
            console.error("Failed to save prediction log:", dbErr.message);
        }

        res.json(response.data);

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error: "ML service unavailable"
        });
    }
});

app.post("/api/explain", async (req, res) => {
    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/explain`,
            req.body
        );

        res.json(response.data);

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error: "ML explanation service unavailable"
        });
    }
});

// Fetch recent historical logs
app.get("/api/history", async (req, res) => {
    try {
        const logs = await PredictionLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        console.error("Failed to fetch history:", error.message);
        res.status(500).json({ error: "Failed to fetch history logs" });
    }
});

app.listen(PORT, () => {
    console.log(`Machina Gateway running on http://localhost:${PORT}`);
});