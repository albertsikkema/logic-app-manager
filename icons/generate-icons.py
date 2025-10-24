#!/usr/bin/env python3
"""
Simple icon generator for Chrome Extension
Requires: pip install pillow
"""

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("PIL (Pillow) not installed. Please run: pip install pillow")
    exit(1)


def create_gradient(draw, width, height):
    """Create a simple gradient background"""
    for y in range(height):
        # Calculate color for this row
        r = int(102 + (118 - 102) * y / height)
        g = int(126 + (75 - 126) * y / height)
        b = int(234 + (162 - 234) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def draw_icon(size):
    """Draw the Logic App icon"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 128

    # Draw gradient circle
    create_gradient(draw, size, size)

    # Draw circle mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([2, 2, size-2, size-2], fill=255)

    # Apply mask
    img.putalpha(mask)

    # Draw workflow elements in white
    draw = ImageDraw.Draw(img)

    # Adjust line width based on size
    line_width = max(1, int(3 * scale))

    # Top node
    node_size = int(8 * scale)
    draw.ellipse([
        int(64 * scale - node_size),
        int(30 * scale - node_size),
        int(64 * scale + node_size),
        int(30 * scale + node_size)
    ], fill='white')

    # Left branch
    draw.line([
        (int(64 * scale), int(38 * scale)),
        (int(64 * scale), int(50 * scale)),
        (int(40 * scale), int(50 * scale)),
        (int(40 * scale), int(65 * scale))
    ], fill='white', width=line_width)

    # Left rectangle
    draw.rectangle([
        int(30 * scale),
        int(65 * scale),
        int(50 * scale),
        int(81 * scale)
    ], fill='white')

    # Left branch continuation
    draw.line([
        (int(40 * scale), int(81 * scale)),
        (int(40 * scale), int(95 * scale))
    ], fill='white', width=line_width)

    # Left end node
    node_size = int(6 * scale)
    draw.ellipse([
        int(40 * scale - node_size),
        int(100 * scale - node_size),
        int(40 * scale + node_size),
        int(100 * scale + node_size)
    ], fill='white')

    # Right branch
    draw.line([
        (int(64 * scale), int(50 * scale)),
        (int(88 * scale), int(50 * scale)),
        (int(88 * scale), int(65 * scale))
    ], fill='white', width=line_width)

    # Right rectangle
    draw.rectangle([
        int(78 * scale),
        int(65 * scale),
        int(98 * scale),
        int(81 * scale)
    ], fill='white')

    # Right branch continuation
    draw.line([
        (int(88 * scale), int(81 * scale)),
        (int(88 * scale), int(95 * scale))
    ], fill='white', width=line_width)

    # Right end node
    node_size = int(6 * scale)
    draw.ellipse([
        int(88 * scale - node_size),
        int(100 * scale - node_size),
        int(88 * scale + node_size),
        int(100 * scale + node_size)
    ], fill='white')

    # Draw backup/restore arrows (simplified for small sizes)
    if size >= 48:
        # Down arrow
        draw.line([
            (int(100 * scale), int(35 * scale)),
            (int(100 * scale), int(50 * scale))
        ], fill='white', width=line_width)
        draw.polygon([
            (int(95 * scale), int(45 * scale)),
            (int(100 * scale), int(50 * scale)),
            (int(105 * scale), int(45 * scale))
        ], fill='white')

        # Up arrow
        draw.line([
            (int(110 * scale), int(50 * scale)),
            (int(110 * scale), int(35 * scale))
        ], fill='white', width=line_width)
        draw.polygon([
            (int(105 * scale), int(40 * scale)),
            (int(110 * scale), int(35 * scale)),
            (int(115 * scale), int(40 * scale))
        ], fill='white')

    return img


def main():
    """Generate all icon sizes"""
    sizes = [16, 48, 128]

    for size in sizes:
        print(f"Generating icon{size}.png...")
        img = draw_icon(size)
        img.save(f'icon{size}.png', 'PNG')
        print(f"  ✓ icon{size}.png created")

    print("\n✓ All icons generated successfully!")
    print("Icons saved in current directory.")


if __name__ == '__main__':
    main()
