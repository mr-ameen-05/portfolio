import sys
from PIL import Image

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # The background is a checkerboard. We will do a multi-seed flood fill
    # to find all contiguous background pixels.
    # Seeds along the top and left edges
    seeds = [(x, 0) for x in range(width)] + [(0, y) for y in range(height)]
    
    # We define background as light grayish/white pixels
    def is_bg(color):
        r, g, b, a = color
        # The checkerboard is mostly 221-255 range and grayish
        return a == 255 and r > 200 and g > 200 and b > 200 and abs(r-g) < 20 and abs(g-b) < 20

    visited = set()
    stack = []
    
    # Initialize stack with valid edge seeds
    for sx, sy in seeds:
        if is_bg(pixels[sx, sy]) and (sx, sy) not in visited:
            stack.append((sx, sy))
            visited.add((sx, sy))
            
    # Flood fill
    while stack:
        x, y = stack.pop()
        pixels[x, y] = (0, 0, 0, 0) # Make transparent
        
        # Check neighbors
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    if is_bg(pixels[nx, ny]):
                        visited.add((nx, ny))
                        stack.append((nx, ny))

    img.save(output_path)
    print(f"Processed {output_path}")

import os
os.makedirs('public/sprites', exist_ok=True)

remove_background('Sprite action/Pose.png', 'public/sprites/Pose.png')
remove_background('Sprite action/Actions.png', 'public/sprites/Actions.png')
remove_background('Sprite action/Runing.png', 'public/sprites/Runing.png')
