import os
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

# -------------------------------------------------------------
# 1. Load Real NASA IMS Bearing Dataset Features
# -------------------------------------------------------------
DATA_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "nasa_ims_features.csv")

if os.path.exists(DATA_CSV):
    print(f"Loading NASA IMS Bearing dataset from {DATA_CSV}...")
    df = pd.read_csv(DATA_CSV)
    print(f"Loaded {len(df)} records across all bearing run-to-failure lifecycles.")
else:
    print("Precomputed NASA features not found. Falling back to synthetic baseline...")
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

# -------------------------------------------------------------
# 2. Separate inputs and target
# -------------------------------------------------------------
X = df[["temperature", "vibration", "rpm", "load"]]
y = df["failure"]

# -------------------------------------------------------------
# 3. Split data into training/testing
# -------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------------------------------------------
# 4. Create the Random Forest model
# -------------------------------------------------------------
model = RandomForestClassifier(
    n_estimators=250,
    max_depth=12,
    min_samples_split=4,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

# -------------------------------------------------------------
# 5. Train the model
# -------------------------------------------------------------
model.fit(X_train, y_train)

# -------------------------------------------------------------
# 6. Test the model
# -------------------------------------------------------------
predictions = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, predictions)
roc_auc = roc_auc_score(y_test, proba)

print(f"Model accuracy: {accuracy * 100:.2f}%")
print(f"ROC-AUC: {roc_auc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, predictions, target_names=["Normal", "Failure"]))

# -------------------------------------------------------------
# 7. Save the trained model
# -------------------------------------------------------------
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(model_path, "wb") as file:
    pickle.dump(model, file)

print(f"Model saved as {model_path}")