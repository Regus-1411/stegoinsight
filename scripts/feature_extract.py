import os
import cv2
import numpy as np
import pandas as pd
from tqdm import tqdm
from scipy.stats import skew, kurtosis
from skimage.feature import graycomatrix, graycoprops
from scipy.fft import fft2

# ---------------------------------------------------
# Project Base Directory
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cover_folder = os.path.join(BASE_DIR, "dataset", "cover")
stego_folder = os.path.join(BASE_DIR, "dataset", "stego")
output_csv = os.path.join(BASE_DIR, "features", "dataset_features.csv")

os.makedirs(os.path.join(BASE_DIR, "features"), exist_ok=True)

# ---------------------------------------------------
# Feature Extraction Functions
# ---------------------------------------------------

def histogram_features(img):
    return [
        np.mean(img),
        np.var(img),
        skew(img.flatten()),
        kurtosis(img.flatten())
    ]

def lsb_features(img):
    lsb = img % 2
    counts = np.bincount(lsb.flatten(), minlength=2)
    probs = counts / lsb.size
    entropy = -np.sum(probs * np.log2(probs + 1e-10))
    ratio = np.mean(lsb)
    transitions = np.mean(lsb[:, :-1] != lsb[:, 1:])
    return [entropy, ratio, transitions]

def pixel_diff_features(img):
    diff = img[:, :-1] - img[:, 1:]
    return [
        np.mean(diff),
        np.var(diff),
        skew(diff.flatten())
    ]

def glcm_features(img):
    angles = [0, np.pi/4, np.pi/2, 3*np.pi/4]

    glcm = graycomatrix(
        img,
        distances=[1],
        angles=angles,
        levels=256,
        symmetric=True,
        normed=True
    )

    features = []

    for prop in ['contrast', 'correlation', 'energy', 'homogeneity']:
        values = graycoprops(glcm, prop)[0]
        features.extend(values)

    return features

def residual_features(img):
    blur = cv2.GaussianBlur(img, (3, 3), 0)
    residual = img.astype(np.float32) - blur.astype(np.float32)
    return [
        np.var(residual),
        np.sum(residual**2),
        skew(residual.flatten())
    ]

def frequency_features(img):
    f = fft2(img)
    magnitude = np.abs(f)

    h, w = magnitude.shape
    total_energy = np.sum(magnitude)

    high_freq_energy = np.sum(magnitude[h//4:, w//4:]) / (total_energy + 1e-10)

    norm_mag = magnitude / (total_energy + 1e-10)
    spectral_entropy = -np.sum(norm_mag * np.log2(norm_mag + 1e-10))

    return [high_freq_energy, spectral_entropy]

def extract_features(img):
    features = []
    features += histogram_features(img)
    features += lsb_features(img)
    features += pixel_diff_features(img)
    features += glcm_features(img)
    features += residual_features(img)
    features += frequency_features(img)
    return features


# ===================================================
# RUN DATASET EXTRACTION ONLY IF FILE EXECUTED
# ===================================================

if __name__ == "__main__":

    data = []

    print("=====================================")
    print("Extracting Features From Dataset")
    print("=====================================")

    # COVER IMAGES
    cover_files = os.listdir(cover_folder)

    for file in tqdm(cover_files, desc="Processing Cover"):
        img_path = os.path.join(cover_folder, file)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            continue
        features = extract_features(img)
        data.append(features + [0])

    # STEGO IMAGES
    for root, dirs, files in os.walk(stego_folder):
        for file in tqdm(files, desc="Processing Stego"):
            img_path = os.path.join(root, file)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue
            features = extract_features(img)
            data.append(features + [1])

    columns = [
        "mean", "variance", "skewness", "kurtosis",
        "lsb_entropy", "lsb_ratio", "lsb_transitions",
        "diff_mean", "diff_variance", "diff_skew",

        "glcm_contrast_0", "glcm_contrast_45", "glcm_contrast_90", "glcm_contrast_135",
        "glcm_correlation_0", "glcm_correlation_45", "glcm_correlation_90", "glcm_correlation_135",
        "glcm_energy_0", "glcm_energy_45", "glcm_energy_90", "glcm_energy_135",
        "glcm_homogeneity_0", "glcm_homogeneity_45", "glcm_homogeneity_90", "glcm_homogeneity_135",

        "residual_variance", "residual_energy", "residual_skew",
        "high_freq_energy", "spectral_entropy",
        "label"
    ]

    df = pd.DataFrame(data, columns=columns)

    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.fillna(0)

    df.to_csv(output_csv, index=False)

    print("-------------------------------------")
    print("✅ Feature extraction completed successfully!")
    print(f"Saved to: {output_csv}")
    print("=====================================")