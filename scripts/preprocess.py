import os
import cv2
from tqdm import tqdm

# ---------------------------------------------------
# INPUT: Your UCID dataset folder (absolute path)
# ---------------------------------------------------
input_folder = r"C:\Users\ganes\Downloads\archive (2)\UCID1338"

# ---------------------------------------------------
# OUTPUT: Your project cover folder
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_folder = os.path.join(BASE_DIR, "dataset", "cover")

# Create output folder if not exists
os.makedirs(output_folder, exist_ok=True)

print("=====================================")
print(" STEGO-ANV Dataset Preprocessing ")
print("=====================================")
print(f"Input Folder  : {input_folder}")
print(f"Output Folder : {output_folder}")
print("-------------------------------------")

# Get all TIFF files
files = [f for f in os.listdir(input_folder) if f.lower().endswith((".tif", ".tiff"))]

print(f"Total TIFF images found: {len(files)}")
print("-------------------------------------")

# Process images
for filename in tqdm(files, desc="Processing Images"):

    img_path = os.path.join(input_folder, filename)

    # Read image
    img = cv2.imread(img_path)

    if img is None:
        print(f"Skipping unreadable file: {filename}")
        continue

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize to 512x512
    resized = cv2.resize(gray, (512, 512))

    # Save as PNG (lossless)
    save_name = os.path.splitext(filename)[0] + ".png"
    save_path = os.path.join(output_folder, save_name)

    cv2.imwrite(save_path, resized)

print("-------------------------------------")
print("✅ Preprocessing completed successfully!")
print("All images converted to 512x512 grayscale PNG.")
print("=====================================")