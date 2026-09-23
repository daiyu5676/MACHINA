import pandas as pd
import pickle
import json

with open("model.pkl", "rb") as file:
    model = pickle.load(file)

input_data = pd.DataFrame([{
    "temperature": 82,
    "vibration": 0.84,
    "rpm": 1800,
    "load": 72
}])

probabilities = model.predict_proba(input_data)[0]

failure_probability = probabilities[1]
health_score = round((1 - failure_probability) * 100)

result = {
    "failure_probability": float(failure_probability),
    "health_score": health_score
}

with open("../data/prediction.json", "w") as file:
    json.dump(result, file, indent=4)

print("Prediction generated:")
print(json.dumps(result, indent=4))