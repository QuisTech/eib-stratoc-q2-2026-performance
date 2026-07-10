import sys
try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Please install with 'pip install Pillow'")
    sys.exit(1)

input_path = "app/opengraph-image.png"
output_path = "app/opengraph-image.jpg"

try:
    with Image.open(input_path) as img:
        # Convert to RGB if it's RGBA (PNG)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # WhatsApp strongly prefers 1200x630 or 1.91:1 ratio.
        # Let's resize it if it's too big, maintaining aspect ratio roughly or exact.
        img = img.resize((1200, 630), Image.Resampling.LANCZOS)
        
        # Save as JPG with heavy compression to ensure it's under 300KB!
        img.save(output_path, "JPEG", quality=75, optimize=True)
        
    print(f"Successfully converted and compressed to {output_path}")
except Exception as e:
    print(f"Error: {e}")
