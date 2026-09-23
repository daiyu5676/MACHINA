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


# Define the sensor data we expect
class SensorData(BaseModel):
    temperature: float
    vibration: float
    rpm: float
    load: float


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

    # Convert incoming data into a DataFrame
    input_data = pd.DataFrame([{
        "temperature": data.temperature,
        "vibration": data.vibration,
        "rpm": data.rpm,
        "load": data.load
    }])

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
#Explanation
@app.post("/explain")
def explain(data: SensorData):

    input_data = pd.DataFrame([{
        "temperature": data.temperature,
        "vibration": data.vibration,
        "rpm": data.rpm,
        "load": data.load
    }])

    shap_result = explainer(input_data)

    values = shap_result.values[0]

    # For binary classification, SHAP may return
    # one set of values for each class.
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