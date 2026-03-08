---
name: faster-whisper
description: Transcribe audio and video to text using Faster-Whisper. FREE, local, no API key. Supports 99 languages. Use for transcription, subtitles, meeting notes, voice messages.
---

# Faster-Whisper (FREE Speech-to-Text)

No API key. Runs locally. 4x faster than original Whisper. 99 languages.

## Quick Transcribe

```bash
python3 /home/coder/.openclaw/workspace/skills/faster-whisper/scripts/transcribe.py /path/to/audio.mp3
```

## Python Usage

```python
from faster_whisper import WhisperModel

# Load model (downloads on first run to ~/.cache/huggingface)
model = WhisperModel("base", device="cpu", compute_type="int8")

# Transcribe
segments, info = model.transcribe("audio.mp3")
print(f"Language: {info.language} (probability: {info.language_probability:.2f})")

for segment in segments:
    print(f"[{segment.start:.1f}s -> {segment.end:.1f}s] {segment.text}")
```

## Models

| Model | Size | Speed | Accuracy | Best For |
|-------|------|-------|----------|----------|
| tiny | 39MB | ⚡⚡⚡⚡ | OK | Quick previews |
| base | 74MB | ⚡⚡⚡ | Good | General use |
| small | 244MB | ⚡⚡ | Better | Most tasks |
| medium | 769MB | ⚡ | Great | Important content |
| large-v3 | 1.5GB | 🐢 | Best | Critical accuracy |

**Recommendation:** Use `base` for quick stuff, `small` for anything important.

## Supported Formats

Any format ffmpeg supports: mp3, wav, m4a, ogg, flac, mp4, mkv, webm, etc.

## Generate Subtitles (SRT)

```python
from faster_whisper import WhisperModel
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, _ = model.transcribe("video.mp4")

with open("subtitles.srt", "w") as f:
    for i, seg in enumerate(segments, 1):
        start = f"{int(seg.start//3600):02d}:{int(seg.start%3600//60):02d}:{seg.start%60:06.3f}".replace(".", ",")
        end = f"{int(seg.end//3600):02d}:{int(seg.end%3600//60):02d}:{seg.end%60:06.3f}".replace(".", ",")
        f.write(f"{i}\n{start} --> {end}\n{seg.text.strip()}\n\n")
```

## Tips
- First run downloads the model (~74MB for base) — be patient
- CPU mode (`device="cpu"`) works fine, just slower than GPU
- Use `compute_type="int8"` for faster CPU inference
- For long audio, segments are streamed — you get output as it processes
