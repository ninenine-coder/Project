from PIL import Image, ImageDraw, ImageSequence
import math, os

# === 參數設定 ===
base_path = "assets/mantou_1.png"   # 你的饅頭人底圖
output_dir = "frames"
os.makedirs(output_dir, exist_ok=True)
frames = []
num_frames = 20
width, height = 768, 768

# === 動畫參數 ===
# 饅頭人低頭角度（0 → 8度）
max_angle = 8
# 陰影線透明度變化（0.2 → 0.8）
shadow_start, shadow_end = 0.2, 0.8
# 電量閃爍周期（兩次亮暗）
battery_flash = [1, 0.5, 1, 0.5, 1, 1]

# === 載入饅頭人底圖 ===
base = Image.open(base_path).convert("RGBA").resize((width, height))

# === 幀生成 ===
for i in range(num_frames):
    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    f = i / (num_frames - 1)
    angle = max_angle * math.sin(f * math.pi)  # 低頭起伏
    shadow_alpha = int(255 * (shadow_start + (shadow_end - shadow_start) * abs(math.sin(f * math.pi))))
    
    # ---- 饅頭人本體 ----
    rotated = base.rotate(angle, resample=Image.BICUBIC, center=(width//2, height//2))
    frame.alpha_composite(rotated, (0, 0))

    # ---- 陰影三條線 ----
    draw = ImageDraw.Draw(frame)
    x0, y0 = width//2 + 130, height//2 - 220
    spacing = 16
    for j in range(3):
        color = (50, 50, 50, shadow_alpha - j*30)
        draw.line([(x0 + j*spacing, y0 + j*spacing), (x0 + j*spacing + 80, y0 + j*spacing)], fill=color, width=8)

    # ---- 電量條 ----
    bar_x, bar_y = width - 230, height//2 - 60
    bar_w, bar_h = 180, 80
    draw.rectangle([bar_x, bar_y, bar_x+bar_w, bar_y+bar_h], outline=(30, 30, 30, 255), width=6)
    fill_ratio = battery_flash[i % len(battery_flash)]
    fill_w = int((bar_w - 16) * fill_ratio)
    draw.rectangle([bar_x+8, bar_y+8, bar_x+8+fill_w, bar_y+bar_h-8], fill=(255, 60, 60, 255))

    # ---- 輸出每幀 PNG ----
    frame_path = os.path.join(output_dir, f"mantou_1_frame{i+1:02d}.png")
    frame.save(frame_path, "PNG")
    frames.append(frame)

# === 匯出 GIF ===
frames[0].save(
    "mantou_1_animation.gif",
    save_all=True,
    append_images=frames[1:],
    duration=200,      # 每幀0.2秒
    loop=0,
    transparency=0,
    disposal=2,
)
print("✅ 已生成 20 幀並輸出 mantou_1_animation.gif")
