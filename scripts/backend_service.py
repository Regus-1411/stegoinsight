import os
from scripts.predict_and_explain import predict_image, build_prompt, generate_explanation

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def analyze_image(image_path):
    try:
        # Step 1: Model Prediction
        result = predict_image(image_path)

        # Step 2: Build Structured Prompt
        prompt = build_prompt(result)

        # Step 3: Call Local LLM
        explanation = generate_explanation(prompt)

        # Step 4: Return Final Response
        return {
            "status": "success",
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "top_features": result["top_features"],
            "llm_explanation": explanation
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }