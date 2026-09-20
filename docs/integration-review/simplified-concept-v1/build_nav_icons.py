from pathlib import Path

from PIL import Image


ASSET_DIR = Path(__file__).resolve().parent / "assets"
ICON_NAMES = (
    "council-notes",
    "open-wagers",
    "closed-ledgers",
    "battle-reports",
    "chamber-settings",
)


for name in ICON_NAMES:
    source = ASSET_DIR / f"nav-{name}-v1-alpha.png"
    destination = ASSET_DIR / f"nav-{name}-v1.png"
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise RuntimeError(f"No visible pixels found in {source}")

    cropped = image.crop(bounds)
    longest = max(cropped.size)
    padding = max(24, round(longest * 0.075))
    square_size = longest + padding * 2
    square = Image.new("RGBA", (square_size, square_size), (0, 0, 0, 0))
    offset = ((square_size - cropped.width) // 2, (square_size - cropped.height) // 2)
    square.alpha_composite(cropped, offset)
    square.thumbnail((128, 128), Image.Resampling.LANCZOS)

    output = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    output.alpha_composite(square, ((128 - square.width) // 2, (128 - square.height) // 2))
    output.save(destination, optimize=True)
    print(f"Wrote {destination} ({cropped.width}x{cropped.height} source bounds)")
