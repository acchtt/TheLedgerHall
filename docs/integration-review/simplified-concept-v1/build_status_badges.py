from pathlib import Path

from PIL import Image


ASSET_DIR = Path(__file__).resolve().parent / "assets"
source = ASSET_DIR / "status-pending-v1-alpha.png"
destination = ASSET_DIR / "status-pending-v1.png"

image = Image.open(source).convert("RGBA")
bounds = image.getchannel("A").getbbox()
if bounds is None:
    raise RuntimeError(f"No visible pixels found in {source}")

cropped = image.crop(bounds)
target = (256, 112)
cropped.thumbnail((244, 100), Image.Resampling.LANCZOS)

output = Image.new("RGBA", target, (0, 0, 0, 0))
output.alpha_composite(cropped, ((target[0] - cropped.width) // 2, (target[1] - cropped.height) // 2))
output.save(destination, optimize=True)
print(f"Wrote {destination}")
