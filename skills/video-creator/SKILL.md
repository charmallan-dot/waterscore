---
name: video-creator
description: Create videos from images, text, and audio using ffmpeg and moviepy. FREE, local. Use for promo videos, slideshows, social media content, explainer videos, text overlays, combining audio with images.
---

# Video Creator (FREE — ffmpeg + moviepy)

Create videos locally. No API key. No cloud. Completely free.

## Common Recipes

### Image + Audio → Video
```bash
# Single image with voiceover (most common for promos)
ffmpeg -loop 1 -i image.png -i voiceover.mp3 -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest output.mp4
```

### Slideshow from Images
```bash
# 3 seconds per image, with crossfade
ffmpeg -framerate 1/3 -pattern_type glob -i 'slides/*.png' -c:v libx264 -r 30 -pix_fmt yuv420p slideshow.mp4

# Add audio to slideshow
ffmpeg -i slideshow.mp4 -i music.mp3 -c:v copy -c:a aac -shortest final.mp4
```

### Add Text Overlay
```bash
# White text, bottom center
ffmpeg -i input.mp4 -vf "drawtext=text='WaterScore.app':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.5:boxborderw=10" output.mp4
```

### Trim / Cut Video
```bash
# First 30 seconds
ffmpeg -i input.mp4 -t 30 -c copy trimmed.mp4

# From 1:00 to 2:30
ffmpeg -i input.mp4 -ss 00:01:00 -to 00:02:30 -c copy clip.mp4
```

### Resize for Social Media
```bash
# Instagram Square (1080x1080)
ffmpeg -i input.mp4 -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" instagram.mp4

# TikTok/Reels (1080x1920 vertical)
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" tiktok.mp4

# Twitter/X (1280x720)
ffmpeg -i input.mp4 -vf "scale=1280:720" twitter.mp4
```

### Combine Multiple Videos
```bash
# Create file list
echo "file 'clip1.mp4'" > list.txt
echo "file 'clip2.mp4'" >> list.txt
echo "file 'clip3.mp4'" >> list.txt

# Concatenate
ffmpeg -f concat -safe 0 -i list.txt -c copy combined.mp4
```

## Full Promo Video Pipeline

```bash
# Step 1: Generate voiceover (free)
edge-tts --text "Check your water quality at WaterScore" --voice en-US-GuyNeural --write-media /tmp/vo.mp3

# Step 2: Create video from image + voiceover
ffmpeg -loop 1 -i promo_bg.png -i /tmp/vo.mp3 -c:v libx264 -tune stillimage -c:a aac -shortest /tmp/raw.mp4

# Step 3: Add text overlay + branding
ffmpeg -i /tmp/raw.mp4 -vf "drawtext=text='WaterScore.app':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=h-100" /tmp/final.mp4
```

## MoviePy (Python — for complex edits)

```python
from moviepy import *

# Load clips
clip1 = VideoFileClip("intro.mp4")
clip2 = VideoFileClip("demo.mp4").subclipped(0, 15)

# Add text
txt = TextClip(text="WaterScore", font_size=70, color="white", duration=5)
txt = txt.with_position("center")

# Compose
final = concatenate_videoclips([clip1, clip2])
final = CompositeVideoClip([final, txt])
final.write_videofile("promo.mp4")
```

## Tips
- Always use `-pix_fmt yuv420p` for maximum compatibility
- MP4 (H.264) works everywhere — use it as default
- For social media, keep under 60 seconds
- ffmpeg is already installed; moviepy is already installed via pip
