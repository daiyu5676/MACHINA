import os
import sys
import time
import zipfile
import urllib.request

DATA_URL = "https://phm-datasets.s3.amazonaws.com/NASA/4.+Bearings.zip"
TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "nasa_ims"))
ZIP_PATH = os.path.join(TARGET_DIR, "NASA_IMS_Bearings.zip")

def download_file(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    print(f"Connecting to {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    with urllib.request.urlopen(req, timeout=30) as response:
        total_size = int(response.headers.get("Content-Length", 0))
        total_mb = total_size / (1024 * 1024)
        print(f"Total file size: {total_mb:.2f} MB")
        
        chunk_size = 1024 * 1024 * 4  # 4 MB chunks
        downloaded = 0
        start_time = time.time()
        
        with open(target_path, "wb") as f:
            while True:
                chunk = response.read(chunk_size)
                if not chunk:
                    break
                f.write(chunk)
                downloaded += len(chunk)
                
                percent = (downloaded / total_size) * 100 if total_size > 0 else 0
                elapsed = time.time() - start_time
                speed = (downloaded / (1024 * 1024)) / (elapsed + 0.001)
                
                print(f"\rDownloading: {downloaded / (1024 * 1024):.1f}/{total_mb:.1f} MB ({percent:.1f}%) at {speed:.2f} MB/s", end="", flush=True)

    print(f"\nDownload completed successfully: {target_path}")

def extract_archive(zip_path, extract_to):
    print(f"Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        names = zip_ref.namelist()
        print(f"Found {len(names)} items inside the archive.")
        zip_ref.extractall(extract_to)
    print("Extraction complete!")

def main():
    print("=" * 60)
    print("  NASA IMS BEARING RUN-TO-FAILURE DATASET DOWNLOADER")
    print("=" * 60)
    print(f"Target folder: {TARGET_DIR}")
    
    # 1. Download
    if os.path.exists(ZIP_PATH) and os.path.getsize(ZIP_PATH) > 1000_000_000:
        print(f"Archive already downloaded: {ZIP_PATH}")
    else:
        download_file(DATA_URL, ZIP_PATH)
        
    # 2. Extract
    extract_archive(ZIP_PATH, TARGET_DIR)
    
    # Check contents
    extracted_items = os.listdir(TARGET_DIR)
    print(f"Contents in {TARGET_DIR}: {extracted_items}")
    print("NASA IMS Dataset ready for time-series feature engineering and model training.")

if __name__ == "__main__":
    main()
