from PIL import Image
import os

# Larger dimensions for better fit in route card frame
# The card height is h-48 (192px), so we need larger source images
# Target: 1280x720px (16:9 aspect ratio, much larger for better quality)
TARGET_WIDTH = 1280
TARGET_HEIGHT = 720

public_dir = "public"
images = [f for f in os.listdir(public_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

print(f"Resizing {len(images)} images to {TARGET_WIDTH}x{TARGET_HEIGHT}px for better frame fit...")
print("-" * 70)

for img_name in sorted(images):
    img_path = os.path.join(public_dir, img_name)
    
    try:
        # Open image
        img = Image.open(img_path)
        original_dims = img.size
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # Resize to larger dimensions with LANCZOS for quality
        img_resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save with high quality
        img_resized.save(img_path, 'JPEG', quality=92, optimize=True)
        
        new_size = os.path.getsize(img_path)
        
        print(f"✓ {img_name}")
        print(f"  {original_dims[0]}x{original_dims[1]} → {TARGET_WIDTH}x{TARGET_HEIGHT}")
        print(f"  Size: {new_size:,} bytes")
        
    except Exception as e:
        print(f"✗ {img_name}: {str(e)}")

print("-" * 70)
print(f"All images resized to {TARGET_WIDTH}x{TARGET_HEIGHT}px - should fit frame perfectly!")
