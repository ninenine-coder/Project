from PIL import Image, ImageDraw
import math, os

# === 檔案設定 ===
head_path = "assets/mantou_head.png"
body_path = "assets/mantou_body.png"
shadow_path = "assets/shadow_lines.png"
battery_path = "assets/battery_red.png"

output_dir = "frames_layers"
os.makedirs(output_dir, exist_ok=True)
frames = []
num_frames = 20
width, height = 768, 768

# === 動畫參數 ===
max_angle = 8  # 頭低下最大角度
battery_flash = [1, 0.5, 1, 0.5, 1, 1]  # 電量閃爍節奏
shadow_alpha = [80, 120, 180, 220, 180, 120]  # 陰影濃度變化

# === 載入各層 ===
head = Image.open(head_path).convert("RGBA").resize((width, height))
body = Image.open(body_path).convert("RGBA").resize((width, height))
shadow = Image.open(shadow_path).convert("RGBA").resize((width, height))
battery = Image.open(battery_path).convert("RGBA").resize((width, height))

for i in range(num_frames):
    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    f = i / (num_frames - 1)
    angle = max_angle * math.sin(f * math.pi)

    # ---- 身體固定 ----
    frame.alpha_composite(body, (0, 0))

    # ---- 頭部旋轉（以下巴附近為旋轉中心） ----
    pivot = (width // 2, height // 2 + 60)
    rotated_head = head.rotate(angle, resample=Image.BICUBIC, center=pivot)
    frame.alpha_composite(rotated_head, (0, 0))

    # ---- 陰影線透明度變化 ----
    shadow_temp = shadow.copy()
    alpha = shadow_alpha[i % len(shadow_alpha)]
    shadow_temp.putalpha(alpha)
    frame.alpha_composite(shadow_temp, (0, 0))

    # ---- 電量條閃爍 ----
    battery_temp = battery.copy()
    b_alpha = int(255 * battery_flash[i % len(battery_flash)])
    battery_temp.putalpha(b_alpha)
    frame.alpha_composite(battery_temp, (0, 0))

    # ---- 儲存每幀 ----
    frame_path = os.path.join(output_dir, f"mantou_1_frame{i+1:02d}.png")
    frame.save(frame_path, "PNG")
    frames.append(frame)

# === 匯出GIF ===
frames[0].save(
    "mantou_1_layers_animation.gif",
    save_all=True,
    append_images=frames[1:],
    duration=200,      # 每幀 0.2 秒
    loop=0,
    transparency=0,
    disposal=2,
)
print("✅ 已生成 mantou_1_layers_animation.gif")
