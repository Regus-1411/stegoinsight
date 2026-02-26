import os
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

log_model = joblib.load(os.path.join(BASE_DIR, "models", "log_model.pkl"))
rf_model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "models", "scaler.pkl"))

# Load dataset features
data = pd.read_csv(os.path.join(BASE_DIR, "features", "dataset_features.csv"))

X = data.iloc[:, :-1]
y = data.iloc[:, -1]

X_scaled = scaler.transform(X)

log_prob = log_model.predict_proba(X_scaled)[:, 1]
rf_prob = rf_model.predict_proba(X)[:, 1]

final_prob = 0.6 * log_prob + 0.4 * rf_prob
y_pred = y_pred = (final_prob > 0.4).astype(int)

print("Accuracy:", accuracy_score(y, y_pred))
print("Precision:", precision_score(y, y_pred))
print("Recall:", recall_score(y, y_pred))
print("F1 Score:", f1_score(y, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y, y_pred))
 