import os
import sys
import cv2
import numpy as np
import joblib
import pandas as pd
import requests
import warnings

warnings.filterwarnings("ignore")

# ---------------------------------------------------
# Setup
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from scripts.feature_extract import extract_features

# ---------------------------------------------------
# Load Models
# ---------------------------------------------------
log_model = joblib.load(os.path.join(BASE_DIR, "models", "log_model.pkl"))
rf_model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "models", "scaler.pkl"))

LOG_WEIGHT = 0.6
RF_WEIGHT = 0.4

feature_names = pd.read_csv(
    os.path.join(BASE_DIR, "features", "dataset_features.csv"),
    nrows=0
).columns[:-1]

# ---------------------------------------------------
# SAFE IMAGE LOADING
# ---------------------------------------------------
def safe_load_image(image_path):

    if not os.path.exists(image_path):
        raise ValueError("Image file does not exist.")

    try:
        img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

        if img is None:
            raise ValueError("Invalid or corrupted image.")

        if len(img.shape) == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        if img.dtype != np.uint8:
            img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX)
            img = img.astype(np.uint8)

        target_size = 512
        h, w = img.shape

        if h > target_size and w > target_size:
            start_y = (h - target_size) // 2
            start_x = (w - target_size) // 2
            img = img[start_y:start_y + target_size, start_x:start_x + target_size]

        h, w = img.shape
        if h < target_size or w < target_size:
            pad_y = max(target_size - h, 0)
            pad_x = max(target_size - w, 0)
            img = cv2.copyMakeBorder(
                img,
                0, pad_y,
                0, pad_x,
                cv2.BORDER_REFLECT
            )

        if np.std(img) < 1:
            raise ValueError("Image has insufficient texture.")

        return img

    except Exception as e:
        raise ValueError(f"Image loading failed: {str(e)}")

# ---------------------------------------------------
# SAFE PREDICTION
# ---------------------------------------------------
def predict_image(image_path):

    img = safe_load_image(image_path)

    try:
        features = extract_features(img)
    except Exception:
        raise ValueError("Feature extraction failed.")

    if len(features) != len(feature_names):
        raise ValueError("Feature mismatch with trained model.")

    if np.std(img) == 0:
        raise ValueError("Image has no texture information.")

    feature_array = np.array(features).reshape(1, -1)

    scaled_features = scaler.transform(feature_array)
    log_prob = float(log_model.predict_proba(scaled_features)[0][1])
    rf_prob = float(rf_model.predict_proba(feature_array)[0][1])

    final_prob = LOG_WEIGHT * log_prob + RF_WEIGHT * rf_prob
    prediction = "STEGO" if final_prob > 0.4 else "COVER"

    log_coefs = log_model.coef_[0]
    log_contrib = scaled_features[0] * log_coefs

    rf_importance = rf_model.feature_importances_
    rf_contrib = feature_array[0] * rf_importance

    ensemble_score = LOG_WEIGHT * log_contrib + RF_WEIGHT * rf_contrib
    feature_influence = dict(zip(feature_names, ensemble_score))

    top_features = sorted(
        feature_influence.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:5]

    return {
        "prediction": prediction,
        "confidence": round(final_prob, 4),
        "top_features": [
            {
                "feature": name,
                "influence_score": round(float(score), 6)
            }
            for name, score in top_features
        ]
    }

# ---------------------------------------------------
# STRICT PROMPT BUILDER
# ---------------------------------------------------
def build_prompt(result):

    feature_text = "\n".join(
        [f"- {f['feature']} (score: {f['influence_score']})"
         for f in result["top_features"]]
    )

    return f"""
You are explaining a steganography classification result.

The image was classified as: {result['prediction']}

Key influencing features:
{feature_text}

Write exactly 3 to 5 short sentences explaining this result.
Do NOT create new predictions.
Do NOT mention unrelated scenarios.
Keep it clear and technical but simple.
"""

# ---------------------------------------------------
# CONTROLLED LLM CALL (HTTP VERSION)
# ---------------------------------------------------
def generate_explanation(prompt):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3:latest",   # ← IMPORTANT FIX
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        response.raise_for_status()
        data = response.json()

        return data["response"].strip()

    except Exception as e:
        print("LLM ERROR:", str(e))
        return "Explanation generation failed. LLM unavailable."

# ---------------------------------------------------
# MAIN (Testing)
# ---------------------------------------------------
if __name__ == "__main__":

    image_path = os.path.join(BASE_DIR, "test_images", "sample.tif")

    try:
        result = predict_image(image_path)
        prompt = build_prompt(result)
        explanation = generate_explanation(prompt)

        print("\n==============================")
        print("Prediction:", result["prediction"])
        print("Confidence:", result["confidence"])
        print("==============================\n")

        print("Top Influencing Features:")
        for f in result["top_features"]:
            print(f" - {f['feature']} → {f['influence_score']}")

        print("\n==============================")
        print("LLM Explanation:")
        print("==============================\n")
        print(explanation)

    except Exception as e:
        print("\nERROR:", str(e))