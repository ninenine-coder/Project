#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

print("=== 馒头动画生成器 ===")
print("开始执行...")

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

# 生成动画帧
frames = []
num_frames = 20
print(f"开始生成 {num_frames} 帧动画...")

for i in range(num_frames):
    # 创建新帧（简单复制）
    frame = base.copy()
    
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
        duration=200,
        loop=0
    )
    print(f"✅ GIF动画已生成：{gif_path}")
except Exception as e:
    print(f"❌ 生成GIF失败：{e}")
    sys.exit(1)

print("🎉 动画生成完成！")
print(f"📁 输出文件：")
print(f"  - {gif_path}")
print(f"  - {output_dir}/ 文件夹（包含{num_frames}帧PNG）")
