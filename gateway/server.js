const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "Gateway is running"
    });
});

app.post("/api/predict", async (req, res) => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            req.body
        );

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
            "http://127.0.0.1:8000/explain",
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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Machina Gateway running on http://localhost:${PORT}`);
});