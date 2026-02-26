from fastapi import FastAPI, UploadFile, File
import shutil
import os
from scripts.backend_service import analyze_image

app = FastAPI()

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_image(file_path)

    os.remove(file_path)

    return result