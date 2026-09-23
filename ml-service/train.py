import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle


# -----------------------------------
# 1. Create our initial training data
# -----------------------------------

data = {
    "temperature": [50, 52, 55, 58, 60, 62, 65, 68, 70, 72,
                    75, 78, 80, 82, 85, 88, 90, 92, 95, 98],

    "vibration": [0.10, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.28,
                  0.30, 0.32, 0.40, 0.45, 0.50, 0.60, 0.65, 0.72,
                  0.80, 0.85, 0.90, 0.95],

    "rpm": [1400, 1450, 1500, 1550, 1600, 1600, 1650, 1700, 1700, 1750,
            1750, 1800, 1800, 1800, 1850, 1850, 1900, 1900, 1950, 1950],

    "load": [30, 32, 35, 38, 40, 42, 45, 48, 50, 52,
             55, 58, 60, 65, 68, 72, 75, 80, 85, 90],

    "failure": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 1, 1, 1, 1]
}

df = pd.DataFrame(data)


# -----------------------------------
# 2. Separate inputs and target
# -----------------------------------

X = df[["temperature", "vibration", "rpm", "load"]]
y = df["failure"]


# -----------------------------------
# 3. Split data into training/testing
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------------
# 4. Create the Random Forest model
# -----------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# -----------------------------------
# 5. Train the model
# -----------------------------------

model.fit(X_train, y_train)


# -----------------------------------
# 6. Test the model
# -----------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model accuracy: {accuracy:.2f}")


# -----------------------------------
# 7. Save the trained model
# -----------------------------------

with open("model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model saved as model.pkl")