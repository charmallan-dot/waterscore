---
name: edge-tts
description: Convert text to speech using Microsoft Edge voices. FREE, no API key, 300+ voices, multiple languages. Use for voiceovers, promo content, audio versions of articles, notifications.
---

# Edge-TTS (FREE Text-to-Speech)

No API key. No cost. 300+ natural-sounding voices. All languages.

## Quick Generate

```bash
edge-tts --text "Your text here" --voice en-US-AriaNeural --write-media /tmp/output.mp3
```

## Best English Voices

| Voice | Gender | Vibe | Use For |
|-------|--------|------|---------|
| en-US-AriaNeural | Female | Friendly, warm | General, tutorials |
| en-US-GuyNeural | Male | Professional | Business, explainers |
| en-US-JennyNeural | Female | Casual, warm | Social media, casual |
| en-US-DavisNeural | Male | Calm, authoritative | Narration, reports |
| en-GB-SoniaNeural | Female | British, polished | Professional, elegant |
| en-GB-RyanNeural | Male | British, clear | Narration |
| en-AU-NatashaNeural | Female | Australian | Casual, friendly |

## Long Text (split into chunks)

For text over 500 words, split and concatenate:

```bash
# Generate parts
edge-tts --text "Part 1 text..." --voice en-US-AriaNeural --write-media /tmp/part1.mp3
edge-tts --text "Part 2 text..." --voice en-US-AriaNeural --write-media /tmp/part2.mp3

# Combine with ffmpeg
ffmpeg -i "concat:/tmp/part1.mp3|/tmp/part2.mp3" -c copy /tmp/full.mp3
```

## List All Voices

```bash
edge-tts --list-voices                    # All 300+ voices
edge-tts --list-voices | grep "en-US"     # US English only
edge-tts --list-voices | grep "zh-CN"     # Chinese voices
```

## Adjust Speed/Pitch

```bash
# Slower (for clarity)
edge-tts --text "Hello" --voice en-US-AriaNeural --rate=-20% --write-media out.mp3

# Faster
edge-tts --text "Hello" --voice en-US-AriaNeural --rate=+30% --write-media out.mp3

# Higher pitch
edge-tts --text "Hello" --voice en-US-AriaNeural --pitch=+10Hz --write-media out.mp3
```

## Output Formats

edge-tts outputs MP3 by default. Convert with ffmpeg:

```bash
# To WAV
ffmpeg -i output.mp3 output.wav

# To OGG (smaller file)
ffmpeg -i output.mp3 output.ogg
```
