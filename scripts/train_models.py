import os
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, classification_report

# ---------------------------------------------------
# Load Dataset
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, "features", "dataset_features.csv")

df = pd.read_csv(data_path)

print("Original dataset size:", len(df))

# ---------------------------------------------------
# BALANCE DATASET (Downsample Stego)
# ---------------------------------------------------
cover_df = df[df["label"] == 0]
stego_df = df[df["label"] == 1]

print("Cover samples :", len(cover_df))
print("Stego samples :", len(stego_df))

# Downsample stego to match cover count
stego_downsampled = stego_df.sample(n=len(cover_df), random_state=42)

# Combine
balanced_df = pd.concat([cover_df, stego_downsampled])

# Shuffle
balanced_df = balanced_df.sample(frac=1, random_state=42).reset_index(drop=True)

print("Balanced dataset size:", len(balanced_df))

# ---------------------------------------------------
# Split Features and Labels
# ---------------------------------------------------
X = balanced_df.drop("label", axis=1)
y = balanced_df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ---------------------------------------------------
# Standardization (for Logistic Regression)
# ---------------------------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ---------------------------------------------------
# Logistic Regression
# ---------------------------------------------------
log_model = LogisticRegression(max_iter=2000)
log_model.fit(X_train_scaled, y_train)

log_probs = log_model.predict_proba(X_test_scaled)[:, 1]
log_preds = (log_probs > 0.5).astype(int)

log_f1 = f1_score(y_test, log_preds)
log_auc = roc_auc_score(y_test, log_probs)

# ---------------------------------------------------
# Random Forest
# ---------------------------------------------------
rf_model = RandomForestClassifier(n_estimators=200, random_state=42)
rf_model.fit(X_train, y_train)

rf_probs = rf_model.predict_proba(X_test)[:, 1]
rf_preds = (rf_probs > 0.5).astype(int)

rf_f1 = f1_score(y_test, rf_preds)
rf_auc = roc_auc_score(y_test, rf_probs)

# ---------------------------------------------------
# Compare Models
# ---------------------------------------------------
print("\nLogistic Regression")
print("F1  :", round(log_f1, 4))
print("AUC :", round(log_auc, 4))

print("\nRandom Forest")
print("F1  :", round(rf_f1, 4))
print("AUC :", round(rf_auc, 4))

if (rf_f1 + rf_auc) > (log_f1 + log_auc):
    print("\n✅ Best Model: Random Forest")
    print(classification_report(y_test, rf_preds))
else:
    print("\n✅ Best Model: Logistic Regression")
    print(classification_report(y_test, log_preds))

import joblib

model_dir = os.path.join(BASE_DIR, "models")
os.makedirs(model_dir, exist_ok=True)

joblib.dump(log_model, os.path.join(model_dir, "log_model.pkl"))
joblib.dump(rf_model, os.path.join(model_dir, "rf_model.pkl"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

print("Models saved successfully.")