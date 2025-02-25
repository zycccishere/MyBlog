#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
图片扩展工具：将JPG图片扩展为1:2比例（宽:高=2:1），原图像居中，扩展部分用透明背景填充
"""

from PIL import Image
import os
import argparse


def pad_image(input_path, output_path=None, ratio=(2, 1), bg_color=(0, 0, 0, 0)):
    """
    将图片扩展为指定比例，原图像居中，扩展部分用透明背景填充

    参数:
        input_path (str): 输入图片路径
        output_path (str): 输出图片路径，默认为在原文件名后添加"_padded"
        ratio (tuple): 目标比例，默认为(2, 1)，即宽:高=2:1
        bg_color (tuple): 背景填充颜色，默认为透明(0, 0, 0, 0)

    返回:
        str: 输出图片路径
    """
    # 打开原图
    img = Image.open(input_path)

    # 将图像转换为带有透明通道的模式
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    width, height = img.size

    # 计算目标尺寸
    target_ratio = ratio[0] / ratio[1]
    current_ratio = width / height

    if current_ratio < target_ratio:
        # 如果原图比例小于目标比例，需要在左右添加填充
        new_width = int(height * target_ratio)
        new_height = height
        new_img = Image.new("RGBA", (new_width, new_height), bg_color)
        # 计算粘贴位置（居中）
        paste_x = (new_width - width) // 2
        paste_y = 0
    else:
        # 如果原图比例大于目标比例，需要在上下添加填充
        new_width = width
        new_height = int(width / target_ratio)
        new_img = Image.new("RGBA", (new_width, new_height), bg_color)
        # 计算粘贴位置（居中）
        paste_x = 0
        paste_y = (new_height - height) // 2

    # 将原图粘贴到新图上
    new_img.paste(img, (paste_x, paste_y), img if img.mode == "RGBA" else None)

    # 如果没有指定输出路径，则在原文件名后添加"_padded"
    if output_path is None:
        filename, ext = os.path.splitext(input_path)
        # 使用PNG格式保存，以支持透明度
        output_path = f"{filename}_padded.png"
    elif not output_path.lower().endswith(".png"):
        # 确保输出文件是PNG格式，以支持透明度
        filename, _ = os.path.splitext(output_path)
        output_path = f"{filename}.png"

    # 保存结果
    new_img.save(output_path)
    print(f"已将图片扩展为 {ratio[0]}:{ratio[1]} 比例，保存至: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="将图片扩展为指定比例，原图像居中，扩展部分用透明背景填充"
    )
    parser.add_argument("input", help="输入图片路径")
    parser.add_argument("-o", "--output", help="输出图片路径（PNG格式）")
    parser.add_argument(
        "-r",
        "--ratio",
        nargs=2,
        type=int,
        default=[2, 1],
        help='目标比例，格式为"宽 高"，默认为"2 1"',
    )
    parser.add_argument(
        "-c",
        "--color",
        nargs=4,
        type=int,
        default=[0, 0, 0, 0],
        help='背景填充颜色，格式为"R G B A"，默认为"0 0 0 0"（完全透明）',
    )

    args = parser.parse_args()

    pad_image(args.input, args.output, tuple(args.ratio), tuple(args.color))


if __name__ == "__main__":
    main()
