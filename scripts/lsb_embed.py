import os
import cv2
import numpy as np
from tqdm import tqdm

# ---------------------------------------------------
# Project Base Directory
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cover_folder = os.path.join(BASE_DIR, "dataset", "cover")
stego_02_folder = os.path.join(BASE_DIR, "dataset", "stego", "lsb_0.2")
stego_05_folder = os.path.join(BASE_DIR, "dataset", "stego", "lsb_0.5")

os.makedirs(stego_02_folder, exist_ok=True)
os.makedirs(stego_05_folder, exist_ok=True)

# ---------------------------------------------------
# LSB Embedding Function
# ---------------------------------------------------
def lsb_embed(image, bpp):

    stego = image.copy()
    h, w = stego.shape
    total_pixels = h * w

    # Number of bits to embed
    bits_to_embed = int(bpp * total_pixels)

    # Flatten image
    flat = stego.flatten()

    # Random indices for embedding
    indices = np.random.choice(total_pixels, bits_to_embed, replace=False)

    # Random bits (0 or 1)
    random_bits = np.random.randint(0, 2, bits_to_embed)

    # Modify LSB
    for i, bit in zip(indices, random_bits):
        flat[i] = (flat[i] & 0xFE) | bit

    # Reshape back
    stego = flat.reshape((h, w))

    return stego

# ---------------------------------------------------
# Process All Cover Images
# ---------------------------------------------------
files = [f for f in os.listdir(cover_folder) if f.endswith(".png")]

print("=====================================")
print("Generating LSB Stego Images")
print("=====================================")
print(f"Total cover images found: {len(files)}")
print("-------------------------------------")

for filename in tqdm(files):

    img_path = os.path.join(cover_folder, filename)
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        continue

    # Generate 0.2 bpp
    stego_02 = lsb_embed(img, 0.2)
    cv2.imwrite(os.path.join(stego_02_folder, filename), stego_02)

    # Generate 0.5 bpp
    stego_05 = lsb_embed(img, 0.5)
    cv2.imwrite(os.path.join(stego_05_folder, filename), stego_05)

print("-------------------------------------")
print("✅ LSB embedding completed successfully!")
print("Folders created:")
print(" - dataset/stego/lsb_0.2")
print(" - dataset/stego/lsb_0.5")
print("=====================================")