import os
from PIL import Image

artifact_dir = r"C:\Users\Administrator\.gemini\antigravity-ide\brain\d03bf03c-e7f2-40f5-bf56-fc0a14f1b3b9"
out_dir = r"C:\Users\Administrator\Downloads\eib-lms-images\welcome-to-comprehensive-fusion-centre-operations"

images_to_process = []
for file in os.listdir(artifact_dir):
    if file.startswith("fusion_") and file.endswith(".png"):
        images_to_process.append(file)

print(f"Found {len(images_to_process)} images to optimize.")

for img_file in images_to_process:
    try:
        in_path = os.path.join(artifact_dir, img_file)
        # Extract the base name (e.g. fusion_lesson_1) without the timestamp
        base_name = img_file.rsplit("_", 1)[0]
        out_path = os.path.join(out_dir, f"{base_name}.jpg")
        
        img = Image.open(in_path).convert("RGB")
        img.thumbnail((1200, 630))
        img.save(out_path, format="JPEG", quality=80)
        print(f"Optimized and saved: {base_name}.jpg")
    except Exception as e:
        print(f"Error processing {img_file}: {e}")
