import os
import cv2
import numpy as np
from tqdm import tqdm

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cover_folder = os.path.join(BASE_DIR, "dataset", "cover")
stego_02_folder = os.path.join(BASE_DIR, "dataset", "stego", "hill_0.2")
stego_05_folder = os.path.join(BASE_DIR, "dataset", "stego", "hill_0.5")

os.makedirs(stego_02_folder, exist_ok=True)
os.makedirs(stego_05_folder, exist_ok=True)

def hill_like_embed(img, bpp):

    stego = img.copy()
    h, w = stego.shape
    total_pixels = h * w
    bits_to_embed = int(bpp * total_pixels)

    # High-pass filter (Laplacian)
    residual = cv2.Laplacian(stego, cv2.CV_32F)
    residual_abs = np.abs(residual)

    flat = stego.flatten()
    residual_flat = residual_abs.flatten()

    sorted_indices = np.argsort(-residual_flat)
    selected_indices = sorted_indices[:bits_to_embed]

    random_bits = np.random.randint(0, 2, bits_to_embed)

    for i, bit in zip(selected_indices, random_bits):
        flat[i] = (flat[i] & 0xFE) | bit

    return flat.reshape((h, w))


files = [f for f in os.listdir(cover_folder) if f.endswith(".png")]

print("Generating HILL-like stego images")

for file in tqdm(files):

    img_path = os.path.join(cover_folder, file)
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    stego_02 = hill_like_embed(img, 0.2)
    stego_05 = hill_like_embed(img, 0.5)

    cv2.imwrite(os.path.join(stego_02_folder, file), stego_02)
    cv2.imwrite(os.path.join(stego_05_folder, file), stego_05)

print("HILL-like embedding completed.")