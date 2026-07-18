from PIL import Image
import sys

def change_color(input_path, output_path, target_color_hex):
    try:
        # Open the image and convert to RGBA if it isn't
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        # Parse hex color
        target_color_hex = target_color_hex.lstrip('#')
        target_r, target_g, target_b = tuple(int(target_color_hex[i:i+2], 16) for i in (0, 2, 4))
        
        new_data = []
        for item in data:
            # item is (R, G, B, A)
            # If the pixel is white or very close to white, change it to the target color
            # Adjust the threshold (200) as needed for anti-aliasing
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                # Replace with target color, keeping original alpha
                new_data.append((target_r, target_g, target_b, item[3]))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Successfully saved recolored image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python change_color.py <input_image_path> <output_image_path>")
    else:
        change_color(sys.argv[1], sys.argv[2], "#1f3a6f")
