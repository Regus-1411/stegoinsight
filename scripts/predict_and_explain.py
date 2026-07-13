import os
import sys
import cv2
import numpy as np
import joblib
import pandas as pd
import requests
import warnings

from dotenv import load_dotenv
from groq import Groq

warnings.filterwarnings("ignore")

# ---------------------------------------------------
# Setup
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Load environment variables from .env
load_dotenv(os.path.join(BASE_DIR, ".env"))

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
            img = img[
                start_y:start_y + target_size,
                start_x:start_x + target_size
            ]

        h, w = img.shape

        if h < target_size or w < target_size:
            pad_y = max(target_size - h, 0)
            pad_x = max(target_size - w, 0)

            img = cv2.copyMakeBorder(
                img,
                0,
                pad_y,
                0,
                pad_x,
                cv2.BORDER_REFLECT
            )

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

    feature_array = np.array(
        features,
        dtype=np.float64
    ).reshape(1, -1)

    feature_array = np.nan_to_num(
        feature_array,
        nan=0.0,
        posinf=0.0,
        neginf=0.0
    )

    scaled_features = scaler.transform(feature_array)

    scaled_features = np.nan_to_num(
        scaled_features,
        nan=0.0,
        posinf=0.0,
        neginf=0.0
    )

    log_prob = float(
        log_model.predict_proba(scaled_features)[0][1]
    )

    rf_prob = float(
        rf_model.predict_proba(feature_array)[0][1]
    )

    final_prob = LOG_WEIGHT * log_prob + RF_WEIGHT * rf_prob

    prediction = "STEGO" if final_prob > 0.4 else "COVER"

    log_coefs = log_model.coef_[0]
    log_contrib = scaled_features[0] * log_coefs

    rf_importance = rf_model.feature_importances_
    rf_contrib = feature_array[0] * rf_importance

    ensemble_score = (
        LOG_WEIGHT * log_contrib
        + RF_WEIGHT * rf_contrib
    )

    feature_influence = dict(
        zip(feature_names, ensemble_score)
    )

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
        [
            f"- {f['feature']} (score: {f['influence_score']})"
            for f in result["top_features"]
        ]
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
# LOCAL OLLAMA LLM
# ---------------------------------------------------
def generate_ollama_explanation(prompt):

    OLLAMA_URL = "http://localhost:11434/api/generate"
    MODEL_NAME = "phi3:latest"

    print(
        f"\n[LLM] Calling Ollama at "
        f"{OLLAMA_URL} with model '{MODEL_NAME}'..."
    )

    print(f"[LLM] Prompt length: {len(prompt)} chars")

    try:

        # Check if Ollama is reachable
        try:
            health = requests.get(
                "http://localhost:11434/",
                timeout=5
            )

            print(
                f"[LLM] Ollama health check: "
                f"{health.status_code}"
            )

        except Exception as he:

            print(
                f"[LLM] Ollama NOT reachable: {he}"
            )

            return (
                "Explanation generation failed. "
                "Ollama is not running on localhost:11434."
            )

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": 200,
                    "temperature": 0.5
                }
            },
            timeout=120
        )

        print(
            f"[LLM] Response status: "
            f"{response.status_code}"
        )

        response.raise_for_status()

        data = response.json()

        explanation = data.get(
            "response",
            ""
        ).strip()

        print(
            f"[LLM] Got explanation "
            f"({len(explanation)} chars): "
            f"{explanation[:100]}..."
        )

        if not explanation:

            print(
                "[LLM] WARNING: "
                "LLM returned empty response"
            )

            return (
                "The AI model returned an empty "
                "explanation. Please try again."
            )

        return explanation

    except requests.exceptions.Timeout:

        print(
            "[LLM] ERROR: "
            "Request timed out after 120 seconds"
        )

        return (
            "Explanation generation timed out. "
            "The model may be loading."
        )

    except requests.exceptions.ConnectionError as ce:

        print(
            f"[LLM] ERROR: "
            f"Connection failed: {ce}"
        )

        return (
            "Explanation generation failed. "
            "Cannot connect to Ollama."
        )

    except Exception as e:

        print(
            f"[LLM] ERROR: "
            f"{type(e).__name__}: {e}"
        )

        return (
            f"Explanation generation failed: "
            f"{str(e)}"
        )


# ---------------------------------------------------
# GROQ CLOUD LLM
# ---------------------------------------------------
def generate_groq_explanation(prompt):

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )

    print(
        f"\n[LLM] Calling Groq "
        f"with model '{GROQ_MODEL}'..."
    )

    print(
        f"[LLM] Prompt length: "
        f"{len(prompt)} chars"
    )

    if not GROQ_API_KEY:

        print(
            "[LLM] ERROR: "
            "GROQ_API_KEY is missing"
        )

        return (
            "Explanation generation failed. "
            "GROQ_API_KEY is not configured."
        )

    try:

        client = Groq(
            api_key=GROQ_API_KEY
        )

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.5,
            max_completion_tokens=200
        )

        explanation = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

        print(
            f"[LLM] Got explanation "
            f"({len(explanation)} chars): "
            f"{explanation[:100]}..."
        )

        if not explanation:

            print(
                "[LLM] WARNING: "
                "Groq returned empty response"
            )

            return (
                "The AI model returned an empty "
                "explanation. Please try again."
            )

        return explanation

    except Exception as e:

        print(
            f"[LLM] GROQ ERROR: "
            f"{type(e).__name__}: {e}"
        )

        return (
            f"Explanation generation failed: "
            f"{str(e)}"
        )


# ---------------------------------------------------
# CONTROLLED LLM CALL
# ---------------------------------------------------
def generate_explanation(prompt):

    LLM_PROVIDER = os.getenv(
        "LLM_PROVIDER",
        "ollama"
    ).lower()

    print(
        f"\n[LLM] Selected provider: "
        f"{LLM_PROVIDER}"
    )

    if LLM_PROVIDER == "groq":

        return generate_groq_explanation(
            prompt
        )

    # Default remains your existing Ollama setup
    return generate_ollama_explanation(
        prompt
    )


# ---------------------------------------------------
# MAIN (Testing)
# ---------------------------------------------------
if __name__ == "__main__":

    image_path = os.path.join(
        BASE_DIR,
        "test_images",
        "sample.tif"
    )

    try:

        result = predict_image(
            image_path
        )

        prompt = build_prompt(
            result
        )

        explanation = generate_explanation(
            prompt
        )

        print("\n==============================")
        print(
            "Prediction:",
            result["prediction"]
        )
        print(
            "Confidence:",
            result["confidence"]
        )
        print("==============================\n")

        print(
            "Top Influencing Features:"
        )

        for f in result["top_features"]:
            print(
                f" - {f['feature']} "
                f"→ {f['influence_score']}"
            )

        print("\n==============================")
        print("LLM Explanation:")
        print("==============================\n")

        print(explanation)

    except Exception as e:

        print(
            "\nERROR:",
            str(e)
        )