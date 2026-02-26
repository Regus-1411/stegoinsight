import os
from scripts.backend_service import analyze_image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(BASE_DIR, "test_images", "sample.tif")

response = analyze_image(image_path)

print("\nBackend Response:\n")
print(response)