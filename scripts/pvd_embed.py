import os
import cv2
import numpy as np
from tqdm import tqdm

# ---------------------------------------------------
# Project Base Directory
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cover_folder = os.path.join(BASE_DIR, "dataset", "cover")
stego_02_folder = os.path.join(BASE_DIR, "dataset", "stego", "pvd_0.2")
stego_05_folder = os.path.join(BASE_DIR, "dataset", "stego", "pvd_0.5")

os.makedirs(stego_02_folder, exist_ok=True)
os.makedirs(stego_05_folder, exist_ok=True)

# ---------------------------------------------------
# Simplified PVD Embedding Function
# ---------------------------------------------------
def pvd_embed(image, bpp):

    stego = image.copy()
    h, w = stego.shape
    total_pixels = h * w

    bits_to_embed = int(bpp * total_pixels)

    flat = stego.flatten()

    num_pairs = len(flat) // 2
    pairs_to_modify = min(bits_to_embed, num_pairs)

    indices = np.random.choice(num_pairs, pairs_to_modify, replace=False)

    for idx in indices:
        i = idx * 2

        p1 = int(flat[i])
        p2 = int(flat[i + 1])

        d = abs(p1 - p2)

        # Random small adjustment
        change = np.random.randint(-2, 3)

        if p1 >= p2:
            p1_new = np.clip(p1 + change, 0, 255)
            p2_new = np.clip(p2 - change, 0, 255)
        else:
            p1_new = np.clip(p1 - change, 0, 255)
            p2_new = np.clip(p2 + change, 0, 255)

        flat[i] = p1_new
        flat[i + 1] = p2_new

    stego = flat.reshape((h, w))
    return stego

# ---------------------------------------------------
# Process All Cover Images
# ---------------------------------------------------
files = [f for f in os.listdir(cover_folder) if f.endswith(".png")]

print("=====================================")
print("Generating PVD Stego Images")
print("=====================================")
print(f"Total cover images found: {len(files)}")
print("-------------------------------------")

for filename in tqdm(files):

    img_path = os.path.join(cover_folder, filename)
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        continue

    # Generate 0.2 bpp
    stego_02 = pvd_embed(img, 0.2)
    cv2.imwrite(os.path.join(stego_02_folder, filename), stego_02)

    # Generate 0.5 bpp
    stego_05 = pvd_embed(img, 0.5)
    cv2.imwrite(os.path.join(stego_05_folder, filename), stego_05)

print("-------------------------------------")
print("✅ PVD embedding completed successfully!")
print("Folders created:")
print(" - dataset/stego/pvd_0.2")
print(" - dataset/stego/pvd_0.5")
print("=====================================")