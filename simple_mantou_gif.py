import os

# 创建输出目录
os.makedirs("frames", exist_ok=True)

# 检查PIL是否可用
try:
    from PIL import Image, ImageDraw
    print("PIL imported successfully")
except ImportError:
    print("PIL not available, please install: pip install Pillow")
    exit(1)

# 检查源图片
base_path = "assets/mantou_1.png"
if not os.path.exists(base_path):
    print(f"Source image not found: {base_path}")
    exit(1)

print(f"Found source image: {base_path}")

# 加载图片
base = Image.open(base_path).convert("RGBA")
print(f"Image loaded, size: {base.size}")

# 生成简单的动画帧
frames = []
num_frames = 20

for i in range(num_frames):
    # 创建新帧
    frame = base.copy()
    
    # 添加简单的动画效果（透明度变化）
    alpha = int(255 * (0.5 + 0.5 * (i / num_frames)))
    frame.putalpha(alpha)
    
    # 保存帧
    frame_path = f"frames/mantou_frame_{i+1:02d}.png"
    frame.save(frame_path, "PNG")
    frames.append(frame)
    
    if i == 0:
        print(f"First frame saved: {frame_path}")

print(f"Generated {len(frames)} frames")

# 生成GIF
try:
    frames[0].save(
        "mantou_simple_animation.gif",
        save_all=True,
        append_images=frames[1:],
        duration=200,
        loop=0
    )
    print("✅ GIF animation created: mantou_simple_animation.gif")
except Exception as e:
    print(f"Error creating GIF: {e}")

print("Animation generation completed!")
