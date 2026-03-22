from PIL import Image
import os

# Target dimensions: 640x384 (16:9 aspect ratio)
# Height matches 2x the h-48 (192px) display size for retina
# Width scales for typical card layouts
TARGET_WIDTH = 640
TARGET_HEIGHT = 384

public_dir = "public"
images = [f for f in os.listdir(public_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

print(f"Resizing {len(images)} images to {TARGET_WIDTH}x{TARGET_HEIGHT}px...")
print("-" * 60)

for img_name in sorted(images):
    img_path = os.path.join(public_dir, img_name)
    original_size = os.path.getsize(img_path)
    
    try:
        # Open image
        img = Image.open(img_path)
        original_dims = img.size
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # Resize with high quality - using LANCZOS
        img_resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save optimized
        img_resized.save(img_path, 'JPEG', quality=90, optimize=True)
        
        new_size = os.path.getsize(img_path)
        
        print(f"✓ {img_name}")
        print(f"  {original_dims[0]}x{original_dims[1]} → {TARGET_WIDTH}x{TARGET_HEIGHT}")
        print(f"  {original_size:,} → {new_size:,} bytes")
        
    except Exception as e:
        print(f"✗ {img_name}: {str(e)}")

print("-" * 60)
print("All images resized and optimized!")
