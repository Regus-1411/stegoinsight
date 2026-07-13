import os
import time
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from scripts.backend_service import analyze_image

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def _derive_risk_level(confidence):
    if confidence >= 0.70:
        return "High"
    elif confidence >= 0.40:
        return "Medium"
    return "Low"


def _derive_technique(top_features):
    if not top_features:
        return "Unknown"
    names = " ".join(f["feature"].lower() for f in top_features)
    if "lsb" in names:
        return "LSB Substitution"
    if "freq" in names or "spectral" in names or "dct" in names:
        return "DCT / Frequency Domain"
    if "residual" in names:
        return "Noise Residual Hiding"
    if "glcm" in names:
        return "Texture-Based Hiding"
    if "diff" in names:
        return "Pixel Difference Encoding"
    return "Statistical Anomaly"


@app.get("/")
def root():
    return {"message": "Stego Detection API Running"}


@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    file_size = len(content)

    ext = os.path.splitext(file.filename or "")[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        start_time = time.time()
        result = analyze_image(file_path)
        scan_duration = round(time.time() - start_time, 2)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    if result.get("status") == "error":
        raise HTTPException(status_code=422, detail=result.get("message", "Analysis failed."))

    confidence = result.get("confidence", 0.0)
    top_features = result.get("top_features", [])
    prediction = result.get("prediction", "COVER")

    return {
        "status": "success",
        "file_name": file.filename,
        "file_size": file_size,
        "prediction": prediction,
        "confidence": confidence,
        "risk_level": _derive_risk_level(confidence),
        "technique": _derive_technique(top_features) if prediction == "STEGO" else "None Detected",
        "top_features": top_features,
        "llm_explanation": result.get("llm_explanation", ""),
        "scan_duration": scan_duration,
    }