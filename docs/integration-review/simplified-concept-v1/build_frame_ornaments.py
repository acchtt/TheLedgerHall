from pathlib import Path

from PIL import Image


ASSET_DIR = Path(__file__).resolve().parent / "assets"
source = ASSET_DIR / "frame-corner-v1-alpha.png"
destination = ASSET_DIR / "frame-corner-v1.png"

image = Image.open(source).convert("RGBA")
bounds = image.getchannel("A").getbbox()
if bounds is None:
    raise RuntimeError(f"No visible pixels found in {source}")

cropped = image.crop(bounds)
longest = max(cropped.size)
padding = max(20, round(longest * 0.06))
square_size = longest + padding * 2
square = Image.new("RGBA", (square_size, square_size), (0, 0, 0, 0))
square.alpha_composite(cropped, ((square_size - cropped.width) // 2, (square_size - cropped.height) // 2))
square.thumbnail((128, 128), Image.Resampling.LANCZOS)

output = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
output.alpha_composite(square, ((128 - square.width) // 2, (128 - square.height) // 2))
output.save(destination, optimize=True)
print(f"Wrote {destination}")
