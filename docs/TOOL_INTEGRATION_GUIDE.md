# 🔧 How to Integrate ANY Tool into OpenClaw

OpenClaw can use anything that runs on the command line. There are 3 ways to add tools:

---

## Method 1: Just Install It (CLI Tools)

If it runs in a terminal, I can use it. No special integration needed.

```bash
# Install any tool via npm, pip, apt, brew, etc.
pip install whisper         # Speech-to-text
pip install TTS             # Coqui TTS (free, local)
pip install bark            # Suno Bark TTS (free, local)
apt install ffmpeg          # Video/audio processing
pip install remotion        # Video generation
npm install -g opencode     # OpenCode coding agent
```

Once installed, I run it with `exec`:
```
exec command:"whisper audio.mp3 --model medium"
exec command:"bark --text 'Hello world' --output speech.wav"
exec command:"ffmpeg -i input.mp4 -vf scale=1080:-1 output.mp4"
```

**That's it.** If it has a CLI, I can use it immediately.

---

## Method 2: Skills (Structured Integration)

Skills are instruction manuals that teach me HOW to use a tool properly. They live in a folder with a `SKILL.md` file.

### Already Installed Skills (50+)
These came bundled with OpenClaw:
- **coding-agent** — Claude Code, Codex, OpenCode, Pi
- **openai-whisper** — Local speech-to-text (FREE, no API key)
- **openai-whisper-api** — Cloud Whisper via OpenAI API
- **sherpa-onnx-tts** — Local TTS (FREE, offline, no cloud)
- **sag** — ElevenLabs TTS (paid, high quality)
- **video-frames** — Extract frames/clips from video with ffmpeg
- **gemini** — Gemini CLI for one-shot tasks
- **github** — Full GitHub integration
- ...and 40+ more

### How to Create a Custom Skill

Create a folder in the workspace with a SKILL.md:

```
~/.openclaw/workspace/skills/
├── bark-tts/
│   ├── SKILL.md              # Instructions for using Bark
│   └── scripts/
│       └── generate.py       # Helper script
├── video-creator/
│   ├── SKILL.md              # Instructions for creating videos
│   └── scripts/
│       └── render.sh         # ffmpeg pipeline
└── data-scraper/
    └── SKILL.md              # How to scrape and clean data
```

Example SKILL.md for Bark TTS:
```markdown
---
name: bark-tts
description: Generate speech from text using Suno Bark (free, local, no API key). 
---
# Bark TTS
Generate natural speech locally with Bark.

## Quick Start
bark --text "Hello world" --output /tmp/speech.wav

## Voice Presets
- v2/en_speaker_0 through v2/en_speaker_9
- v2/zh_speaker_0 (Chinese)
- Custom: clone from 10s audio sample

## Tips
- Keep text under 200 words per generation
- Use ffmpeg to concatenate multiple clips for longer content
```

---

## Method 3: API Wrappers (for Cloud Services)

For services with APIs but no CLI, write a small script:

```python
# scripts/grok_research.py
import os, requests
response = requests.post("https://api.x.ai/v1/chat/completions",
    headers={"Authorization": f"Bearer {os.environ['XAI_API_KEY']}"},
    json={"model": "grok-3-mini-beta", "messages": [{"role": "user", "content": sys.argv[1]}]}
)
print(response.json()["choices"][0]["message"]["content"])
```

Then I call it: `exec command:"python scripts/grok_research.py 'research water quality trends'"`

---

## 🎯 Specific Tools You Asked About

### 🖥️ Coding Agents

| Tool | Install | How I Use It |
|------|---------|-------------|
| **Claude Code** | `npm i -g @anthropic-ai/claude-code` | ✅ Already installed! `claude 'build feature X'` |
| **OpenCode** | `npm i -g opencode` | `opencode run 'build feature X'` |
| **Codex CLI** | `npm i -g @openai/codex` | `codex exec 'build feature X'` (needs OPENAI_API_KEY) |
| **Pi Agent** | `npm i -g @mariozechner/pi-coding-agent` | `pi 'build feature X'` |

I already have Claude Code installed. For the others, just `npm install` them.

**Key detail:** Coding agents need `pty:true` (pseudo-terminal) and a git repo to work in. I handle this automatically.

### 🗣️ Text-to-Speech (FREE Options)

| Tool | Quality | Speed | Install |
|------|---------|-------|---------|
| **Sherpa-ONNX** | Good | Fast | ✅ Skill exists, needs runtime download |
| **Bark** (Suno) | Excellent | Slow | `pip install git+https://github.com/suno-ai/bark.git` |
| **Coqui TTS** | Great | Medium | `pip install TTS` |
| **Piper** | Good | Very fast | Download binary from GitHub |
| **edge-tts** | Great | Fast | `pip install edge-tts` (uses Microsoft Edge voices, free!) |

**My recommendation: `edge-tts`** — it's free, sounds great, fast, and dead simple:
```bash
edge-tts --text "Your water quality score is A" --write-media output.mp3
```

### 🎙️ Speech-to-Text (FREE)

| Tool | Install | Notes |
|------|---------|-------|
| **Whisper** | `pip install openai-whisper` | ✅ Skill exists. Local, free, excellent |
| **Whisper.cpp** | Build from GitHub | Faster than Python Whisper |
| **faster-whisper** | `pip install faster-whisper` | 4x faster than original |

### 🎬 Video Creation (FREE)

| Tool | What It Does | Install |
|------|-------------|---------|
| **ffmpeg** | Video editing, compositing, effects | `apt install ffmpeg` |
| **Remotion** | React-based video generation | `npm install remotion` |
| **MoviePy** | Python video editing | `pip install moviepy` |
| **Manim** | Math/explainer animations | `pip install manim` |
| **img2vid** | Images → video slideshows | ffmpeg one-liner |

**For WaterScore promo videos:**
```bash
# Generate frames (charts/data) → stitch into video with ffmpeg
ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# Add voiceover
edge-tts --text "Your water quality matters" --write-media voiceover.mp3
ffmpeg -i output.mp4 -i voiceover.mp3 -c:v copy -c:a aac final.mp4
```

### 🖼️ Image Generation (FREE)

| Tool | What It Does | Install |
|------|-------------|---------|
| **Stable Diffusion** | AI image generation | Needs GPU (not practical on free hosting) |
| **Playwright/Puppeteer** | Screenshot web pages as images | `npm install playwright` |
| **Sharp** | Image processing/manipulation | `npm install sharp` |
| **Canvas API** | Programmatic image creation | Built into Node.js |

---

## 📦 Quick Install Script

Run this to set up the key free tools:

```bash
# TTS
pip install edge-tts

# Speech-to-text  
pip install faster-whisper

# Video
apt install -y ffmpeg
pip install moviepy

# Coding agents (pick what you want)
npm install -g opencode
# npm install -g @openai/codex  # needs OPENAI_API_KEY
```

---

## 🏗️ Creating a Custom Skill for Any Tool

If you want me to use a tool WELL (not just blindly), create a skill:

1. Create folder: `~/.openclaw/workspace/skills/tool-name/`
2. Write `SKILL.md` with name, description, and usage instructions
3. Optionally add helper scripts in `scripts/`
4. I'll automatically discover it and use it when relevant

The description in SKILL.md frontmatter is how I know WHEN to use the skill. Make it descriptive!
