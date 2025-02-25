# 图片扩展工具

这是一个简单的图片扩展工具，可以将图片扩展为指定比例（默认为宽:高=2:1），原图像居中，扩展部分用透明背景填充。

## 依赖

- Python 3.6+
- Pillow 库

## 安装依赖

```bash
pip install pillow
```

或者使用requirements.txt安装：

```bash
pip install -r requirements.txt
```

## 使用方法

### 基本用法

```bash
python picture_padding.py 输入图片路径
```

例如：

```bash
python picture_padding.py my_image.jpg
```

这将生成一个名为 `my_image_padded.png` 的新图片，比例为2:1（宽:高），原图像居中，扩展部分为透明背景。

**注意**：输出图片将自动保存为PNG格式，以支持透明背景。

### 高级选项

```bash
python picture_padding.py 输入图片路径 [选项]
```

可用选项：

- `-o, --output`: 指定输出图片路径（将自动转换为PNG格式）
- `-r, --ratio`: 指定目标比例，格式为"宽 高"，默认为"2 1"
- `-c, --color`: 指定背景填充颜色，格式为"R G B A"，默认为"0 0 0 0"（完全透明）

例如：

```bash
# 指定输出路径
python picture_padding.py input.jpg -o output.png

# 指定比例为3:2
python picture_padding.py input.jpg -r 3 2

# 指定半透明黑色背景
python picture_padding.py input.jpg -c 0 0 0 128

# 组合使用
python picture_padding.py input.jpg -o custom_output.png -r 16 9 -c 255 255 255 200
```

## 作为模块使用

您也可以在其他Python脚本中导入并使用此工具：

```python
from picture_padding import pad_image

# 基本用法
pad_image('input.jpg')

# 高级用法
pad_image(
    input_path='input.jpg',
    output_path='output.png',
    ratio=(16, 9),
    bg_color=(255, 255, 255, 128)  # 半透明白色
)
```
