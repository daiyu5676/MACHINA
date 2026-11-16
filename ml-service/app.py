from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle
import shap

# Create FastAPI application
app = FastAPI(title="Machina ML Service")


# Load the trained model
with open("model.pkl", "rb") as file:
    model = pickle.load(file)

explainer = shap.TreeExplainer(model)    


from typing import Optional

# Define the sensor data we expect
class SensorData(BaseModel):
    temperature: float
    vibration: float
    rpm: float
    load: float
    asset_id: Optional[str] = None


def preprocess_input(data: SensorData) -> pd.DataFrame:
    """
    Intelligently adapts real-world industrial UI inputs to the NASA IMS Bearing model feature space:
    - Load: If entered as percentage (0-100%), scales to the 6,000 lbs spring load range [5500, 6500].
    - RPM: NASA IMS baseline is 2,000 RPM. Typical motor inputs (e.g. 1400-1850 RPM) are mapped
           to the nominal operational baseline so a healthy 4-pole motor is not flagged as a stall.
    """
    load_val = float(data.load)
    if load_val <= 100.0:
        effective_load = 5500.0 + (load_val / 100.0) * 1000.0
    else:
        effective_load = load_val

    rpm_val = float(data.rpm)
    if rpm_val < 1850.0:
        effective_rpm = 1990.0 + min(max((rpm_val / 1850.0) * 15.0, 0.0), 20.0)
    else:
        effective_rpm = rpm_val

    return pd.DataFrame([{
        "temperature": float(data.temperature),
        "vibration": float(data.vibration),
        "rpm": float(effective_rpm),
        "load": float(effective_load)
    }])


# Health check
@app.get("/")
def home():
    return {
        "service": "Machina ML Service",
        "status": "running"
    }


# Prediction endpoint
@app.post("/predict")
def predict(data: SensorData):
    # Preprocess incoming telemetry into model domain
    input_data = preprocess_input(data)

    # Get probability of failure
    probabilities = model.predict_proba(input_data)[0]
    failure_probability = probabilities[1]

    # Convert probability into a health score
    health_score = round((1 - failure_probability) * 100)

    result = {
        "failure_probability": round(float(failure_probability), 4),
        "health_score": health_score
    }
    return result


# Explanation endpoint
@app.post("/explain")
def explain(data: SensorData):
    input_data = preprocess_input(data)

    shap_result = explainer(input_data)
    values = shap_result.values[0]

    # For binary classification, SHAP may return one set of values for each class
    if len(values.shape) == 2:
        values = values[:, 1]

    return {
        "features": {
            "temperature": float(values[0]),
            "vibration": float(values[1]),
            "rpm": float(values[2]),
            "load": float(values[3])
        }
    }