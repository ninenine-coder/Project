#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import math

print("=== 简单馒头动画生成器 ===")
print("基于 mantou_1.png 生成独立动画")

# 检查源文件
source_file = "assets/mantou_1.png"
if not os.path.exists(source_file):
    print(f"❌ 错误：找不到源文件 {source_file}")
    sys.exit(1)

print(f"✅ 找到源文件：{source_file}")

# 尝试导入PIL
try:
    from PIL import Image, ImageDraw
    print("✅ PIL库导入成功")
except ImportError as e:
    print(f"❌ PIL库导入失败：{e}")
    print("请运行：pip install Pillow")
    sys.exit(1)

# 创建输出目录
output_dir = "frames"
os.makedirs(output_dir, exist_ok=True)
print(f"✅ 创建输出目录：{output_dir}")

# 加载源图片
try:
    base = Image.open(source_file).convert("RGBA")
    print(f"✅ 加载源图片成功，尺寸：{base.size}")
except Exception as e:
    print(f"❌ 加载源图片失败：{e}")
    sys.exit(1)

# 动画参数
num_frames = 20
width, height = base.size
print(f"开始生成 {num_frames} 帧动画...")

# 生成动画帧
frames = []
for i in range(num_frames):
    # 创建新帧
    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    
    # 计算动画进度
    progress = i / (num_frames - 1)
    
    # 简单的动画效果：轻微的缩放和旋转
    scale = 1.0 + 0.1 * math.sin(progress * math.pi * 2)  # 轻微缩放
    angle = 5 * math.sin(progress * math.pi * 4)  # 轻微旋转
    
    # 缩放图片
    new_size = (int(width * scale), int(height * scale))
    scaled_img = base.resize(new_size, Image.LANCZOS)
    
    # 旋转图片
    rotated_img = scaled_img.rotate(angle, expand=False, fillcolor=(0, 0, 0, 0))
    
    # 计算居中位置
    paste_x = (width - rotated_img.width) // 2
    paste_y = (height - rotated_img.height) // 2
    
    # 粘贴到帧上
    frame.paste(rotated_img, (paste_x, paste_y), rotated_img)
    
    # 保存帧
    frame_path = f"{output_dir}/mantou_frame_{i+1:02d}.png"
    frame.save(frame_path, "PNG")
    frames.append(frame)
    
    if i == 0:
        print(f"✅ 第一帧已生成：{frame_path}")

print(f"✅ 已生成 {len(frames)} 帧")

# 生成GIF
try:
    gif_path = "mantou_1_animation.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=200,  # 每帧200毫秒
        loop=0,        # 无限循环
        optimize=True
    )
    print(f"✅ GIF动画已生成：{gif_path}")
    
    # 检查文件大小
    file_size = os.path.getsize(gif_path)
    print(f"📁 文件大小：{file_size / 1024:.1f} KB")
    
except Exception as e:
    print(f"❌ 生成GIF失败：{e}")
    sys.exit(1)

print("🎉 独立馒头动画生成完成！")
print(f"📁 输出文件：")
print(f"  - {gif_path}")
print(f"  - {output_dir}/ 文件夹（包含{num_frames}帧PNG）")
print("")
print("💡 使用说明：")
print("  - 这个GIF是基于 mantou_1.png 生成的独立动画")
print("  - 包含轻微的缩放和旋转效果")
print("  - 可以直接在网页中使用")
