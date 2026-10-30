"""
Sprite Normalization and Alignment Script

Aligns character frames from raw source images into perfectly normalized 
spritesheets (Pose.png, Actions.png, Runing.png) of identical dimensions:
- Frame size: 240 x 360 px
- Ground baseline: exactly y = 345 px (feet touch the same line across all sheets)
- Horizontal center: exactly x = 120 px (prevents horizontal jolt when flipping/animating)
- Eliminates frame jitters, baseline jumps, and aspect ratio distortion.
"""

import os
import io
import subprocess
from PIL import Image

def build_normalized_spritesheets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_sprites_dir = os.path.join(base_dir, 'public', 'sprites')
    dist_sprites_dir = os.path.join(base_dir, 'dist', 'sprites')
    os.makedirs(public_sprites_dir, exist_ok=True)
    os.makedirs(dist_sprites_dir, exist_ok=True)

    pose_path = os.path.join(base_dir, 'Sprite action', 'Pose.png')
    actions_path = os.path.join(base_dir, 'Sprite action', 'Actions.png')

    pose = Image.open(pose_path)
    actions = Image.open(actions_path)

    # Load 4-frame running sprite (from git history if workspace was truncated)
    try:
        git_run = subprocess.check_output(
            ['git', 'show', 'c77a0dd:public/sprites/Runing.png'],
            cwd=base_dir
        )
        orig_run = Image.open(io.BytesIO(git_run))
    except Exception:
        # Fallback to local sideRun images if git not accessible
        orig_run = Image.open(os.path.join(base_dir, 'Sprite action', 'Runing.png'))

    FRAME_W = 240
    FRAME_H = 360
    GROUND_Y = 345
    CENTER_X = 120

    sheets_def = {
        'Pose.png': [
            ('idle_front', pose, 0*216, 216, 381, 324, 0),
            ('idle_back',  pose, 1*216, 216, 381, 324, 0),
            ('look_left',  pose, 2*216, 216, 381, 324, 0),
            ('look_right', pose, 3*216, 216, 381, 323, 0),
        ],
        'Actions.png': [
            ('thumbs_up', actions, 0*216, 216, 381, 369, 0),
            ('wave',      actions, 1*216, 216, 381, 369, 0),
            ('talk',      actions, 2*216, 216, 381, 369, 0),
            ('jump',      actions, 3*216, 216, 381, 369, 369 - 330),
        ],
        'Runing.png': [
            ('walk_front_0', orig_run, 0*216, 216, 396, 363, 0),
            ('walk_front_1', orig_run, 1*216, 216, 396, 363, 0),
            ('run_side_0',   orig_run, 2*216, 216, 396, 363, 0),
            ('run_side_1',   orig_run, 3*216, 216, 396, 363, 0),
        ]
    }

    for sheet_name, frame_list in sheets_def.items():
        sheet_img = Image.new('RGBA', (FRAME_W * 4, FRAME_H), (0, 0, 0, 0))
        for i, (name, src_img, sx, sw, sh, src_ground, elev) in enumerate(frame_list):
            crop = src_img.crop((sx, 0, sx + sw, sh))
            bb = crop.getbbox()
            char = crop.crop(bb)
            cw, ch = char.size

            dest_bottom = GROUND_Y - elev
            dest_top = dest_bottom - ch
            dest_left = int(round(CENTER_X - cw / 2.0))

            sheet_img.paste(char, (i * FRAME_W + dest_left, dest_top))

        # Save to public/sprites and dist/sprites
        p_path = os.path.join(public_sprites_dir, sheet_name)
        d_path = os.path.join(dist_sprites_dir, sheet_name)
        sheet_img.save(p_path)
        sheet_img.save(d_path)
        print(f"Generated normalized {sheet_name} ({sheet_img.size}) -> {p_path}")

if __name__ == '__main__':
    build_normalized_spritesheets()
