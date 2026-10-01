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
const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const DATABASE_URL =
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/Machina";


// ==================================================
// MONGODB — OPTIONAL
// ==================================================

let mongoConnected = false;

mongoose.connect(DATABASE_URL)
    .then(() => {
        mongoConnected = true;
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        mongoConnected = false;
        console.log("MongoDB unavailable — running without database");
    });


// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/health", (req, res) => {

    res.json({
        status: "Gateway is running",

        dbStatus:
            mongoConnected
                ? "connected"
                : "disconnected"
    });

});


// ==================================================
// PREDICT
// ==================================================

app.post("/api/predict", async (req, res) => {

    try {

        // Send sensor data to ML service
        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            req.body
        );


        // ==================================================
        // SAVE TO MONGODB ONLY IF DATABASE IS AVAILABLE
        // ==================================================

        if (mongoConnected) {

            try {

                await PredictionLog.create({
                    sensorData: req.body,
                    prediction: response.data
                });

            } catch (dbErr) {

                console.error(
                    "Failed to save prediction log:",
                    dbErr.message
                );

            }

        }


        // Return ML result regardless of MongoDB status
        res.json(response.data);


    } catch (error) {

        console.error(
            "Prediction error:",
            error.message
        );

        res.status(500).json({
            error: "ML service unavailable"
        });

    }

});


// ==================================================
// SHAP EXPLANATION
// ==================================================

app.post("/api/explain", async (req, res) => {

    try {

        const response = await axios.post(
            `${ML_SERVICE_URL}/explain`,
            req.body
        );

        res.json(response.data);


    } catch (error) {

        console.error(
            "Explanation error:",
            error.message
        );

        res.status(500).json({
            error: "ML explanation service unavailable"
        });

    }

});


// ==================================================
// HISTORY
// ==================================================

app.get("/api/history", async (req, res) => {

    if (!mongoConnected) {

        return res.json([]);

    }


    try {

        const logs =
            await PredictionLog
                .find()
                .sort({ timestamp: -1 })
                .limit(50);

        res.json(logs);


    } catch (error) {

        console.error(
            "Failed to fetch history:",
            error.message
        );

        res.status(500).json({
            error: "Failed to fetch history logs"
        });

    }

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

    console.log(
        `Machina Gateway running on http://localhost:${PORT}`
    );

});