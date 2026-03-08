# 🧑‍💻 Setup Guide — For Humans (Layman's Terms)

**Last updated:** 2026-03-09
**Your setup:** Windows with WSL2 (Ubuntu Linux running inside Windows)

---

## 🗺️ Where Everything Lives

```
YOUR COMPUTER
├── Windows (C:\)
│   ├── PowerShell / CMD        ← Windows terminal (DON'T use for this stuff)
│   └── Ubuntu (WSL2)           ← Linux inside Windows (USE THIS for everything)
│       └── /home/coder/
│           └── .openclaw/
│               ├── openclaw.json         ← Main config (API keys go here)
│               ├── workspace/            ← Your AI's brain (files, memory, docs)
│               │   ├── SOUL.md           ← AI personality
│               │   ├── USER.md           ← Info about you
│               │   ├── MEMORY.md         ← AI's long-term memory
│               │   ├── TOOLS.md          ← Tool-specific notes
│               │   └── docs/             ← All guides and plans
│               └── media/                ← Files the AI receives/sends
```

**Rule of thumb:** Always use Ubuntu/WSL2 terminal. Not PowerShell. Not CMD.

---

## 📖 How to Open Ubuntu Terminal

1. Press **Windows key**
2. Type **Ubuntu**
3. Click the Ubuntu app
4. You're now in Linux! The prompt looks like: `coder@YOURPC:~$`

---

## ✅ What's Already Installed on Your Server

These are installed and working RIGHT NOW:

| Tool | Version | What It Does | Cost |
|------|---------|-------------|------|
| **OpenClaw** | 2026.2.13 | Your AI brain — runs everything | — |
| **Claude Code** | 2.1.71 | AI coding agent | Uses your Anthropic key |
| **Gemini CLI** | 0.32.1 | Google Gemini for one-shot tasks | Free (needs API key) |
| **edge-tts** | 7.2.7 | Text-to-speech (Microsoft voices) | FREE |
| **faster-whisper** | 1.2.1 | Speech-to-text (transcription) | FREE |
| **moviepy** | 2.1.2 | Python video editing | FREE |
| **ffmpeg** | 5.1.8 | Video/audio Swiss army knife | FREE |
| **Node.js** | 22.22.0 | JavaScript runtime | FREE |
| **Python** | 3.11.2 | Python runtime | FREE |
| **gh** (GitHub CLI) | — | GitHub from terminal | FREE |

---

## 🔑 API Keys — Where They Go

API keys are passwords that let the AI talk to different services.

### Where to add them:

**On your OpenClaw server (the machine running 24/7):**

1. Open Ubuntu terminal
2. Type:
```bash
nano ~/.bashrc
```
3. Scroll to the bottom and add these lines:
```bash
# AI Model Keys
export ANTHROPIC_API_KEY=sk-ant-your-key-here        # ALREADY SET - don't change
export OPENROUTER_API_KEY=sk-or-your-key-here         # For DeepSeek (free)
export GOOGLE_GENERATIVE_AI_API_KEY=your-key-here     # For Gemini (free)
export XAI_API_KEY=your-key-here                      # For Grok (free)
```
4. Press **Ctrl+X**, then **Y**, then **Enter** to save
5. Restart OpenClaw:
```bash
source ~/.bashrc
openclaw gateway restart
```

### Where to get FREE API keys:

**OpenRouter (for DeepSeek — free):**
1. Go to https://openrouter.ai
2. Click Sign Up (use Google/GitHub)
3. Go to https://openrouter.ai/keys
4. Click "Create Key"
5. Copy the key (starts with `sk-or-`)

**Google Gemini (free):**
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

**xAI Grok (free):**
1. Go to https://console.x.ai
2. Sign up
3. Go to API Keys section
4. Create and copy key

---

## 🛠️ How to Install NEW Tools in the Future

### If it's a Python tool:
```bash
# Open Ubuntu terminal, then:
pip3 install --break-system-packages TOOL_NAME

# Example:
pip3 install --break-system-packages edge-tts
```

### If it's a Node.js/npm tool:
```bash
# Open Ubuntu terminal, then:
npm install -g TOOL_NAME

# Example:
npm install -g opencode
```

### If it's a system package:
```bash
# Open Ubuntu terminal, then:
sudo apt install TOOL_NAME

# Example:
sudo apt install ffmpeg
```

**After installing anything, tell me (your AI) and I'll start using it.**

---

## 🗣️ Using Edge-TTS (Text to Speech)

**What it does:** Converts text to natural-sounding speech. FREE. No API key needed.

**You don't need to do anything** — I (your AI) use this directly. But if you want to test it yourself:

```bash
# Open Ubuntu terminal
edge-tts --text "Hello Charmaine, this is a test" --voice en-US-AriaNeural --write-media ~/test.mp3
```

**Available voices (best English ones):**
| Voice | Gender | Style |
|-------|--------|-------|
| en-US-AriaNeural | Female | Friendly, warm |
| en-US-GuyNeural | Male | Friendly, professional |
| en-US-JennyNeural | Female | Warm, casual |
| en-GB-SoniaNeural | Female | British, professional |
| en-GB-RyanNeural | Male | British, professional |
| en-AU-NatashaNeural | Female | Australian |

---

## 🎙️ Using Faster-Whisper (Speech to Text)

**What it does:** Transcribes audio/video to text. FREE. Runs locally. No API key.

**You don't need to do anything** — send me an audio file and I'll transcribe it. But if you want to test:

```bash
# Open Ubuntu terminal
python3 -c "
from faster_whisper import WhisperModel
model = WhisperModel('tiny', device='cpu')
segments, info = model.transcribe('YOUR_AUDIO_FILE.mp3')
for segment in segments:
    print(segment.text)
"
```

**Models (bigger = more accurate but slower):**
- `tiny` — fastest, OK accuracy
- `base` — good balance
- `small` — better accuracy
- `medium` — great accuracy (recommended)
- `large-v3` — best accuracy (slow without GPU)

---

## 🎬 Using Video Tools

**What they do:** Create, edit, and process videos. FREE.

### ffmpeg (Video Swiss Army Knife)
```bash
# Combine an image + audio into a video
ffmpeg -loop 1 -i image.png -i audio.mp3 -c:v libx264 -tune stillimage -c:a aac -shortest output.mp4

# Trim a video (first 30 seconds)
ffmpeg -i input.mp4 -t 30 -c copy output.mp4

# Convert format
ffmpeg -i input.mov output.mp4
```

### MoviePy (Python Video Editing)
```python
from moviepy import VideoFileClip
clip = VideoFileClip("input.mp4").subclipped(0, 30)  # First 30 seconds
clip.write_videofile("output.mp4")
```

---

## 🖥️ Using Coding Agents

**What they do:** AI that writes code for you. I (Claude) can launch them on your projects.

### Claude Code (already installed)
```bash
# Open Ubuntu terminal, go to your project:
cd ~/project-folder
claude "Build a login page with email and password"
```

### To install others later:
```bash
# OpenCode
npm install -g opencode

# Codex (needs OpenAI API key)
npm install -g @openai/codex
```

**You don't need to run these manually.** Tell me what to build and I'll pick the right coding agent and run it.

---

## 🔄 How to Update OpenClaw

```bash
# Open Ubuntu terminal
npm install -g openclaw@latest
openclaw gateway restart
```

---

## 🆘 If Things Go Wrong

### "Command not found"
```bash
# Add the local bin to your PATH
export PATH="$HOME/.local/bin:$PATH"
# Make it permanent:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "Permission denied"
```bash
# Add sudo before the command
sudo apt install WHATEVER
```

### "pip won't install"
```bash
# Use this flag (safe on WSL)
pip3 install --break-system-packages WHATEVER
```

### OpenClaw not responding
```bash
openclaw gateway status     # Check if running
openclaw gateway restart    # Restart it
```

### Need to restore your AI from backup
See: https://github.com/charmallan-dot/openclaw-backup → system/RESTORE.md

---

## 📱 Quick Reference Card

| I want to... | Command (Ubuntu terminal) |
|---|---|
| Open Ubuntu | Windows key → type "Ubuntu" → Enter |
| Check OpenClaw | `openclaw gateway status` |
| Restart OpenClaw | `openclaw gateway restart` |
| Install Python tool | `pip3 install --break-system-packages TOOL` |
| Install Node tool | `npm install -g TOOL` |
| Install system tool | `sudo apt install TOOL` |
| Edit config | `nano ~/.bashrc` |
| Save in nano | Ctrl+X → Y → Enter |
| Check what's installed | `pip3 list` or `npm ls -g` |
| Test TTS | `edge-tts --text "Hello" --write-media test.mp3` |
| Update OpenClaw | `npm install -g openclaw@latest` |
