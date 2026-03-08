---
name: audio-music
description: Generate music, sound effects, and singing using free open-source tools. No API key. Use for jingles, background music, promo audio, podcast intros, sound effects.
---

# Audio & Music Creation (FREE)

## What's Available

### 🎵 Music Generation

| Tool | What It Does | Needs GPU? | Quality |
|------|-------------|-----------|---------|
| **MIDIUtil + FluidSynth** | MIDI composition → WAV | No | Good (instrumental) |
| **Pure Python synthesis** | Generate tones/chords | No | Basic (sine waves) |
| **Meta MusicGen** (audiocraft) | AI music from text prompts | YES ⚠️ | Excellent |
| **Riffusion** | AI music via spectrograms | YES ⚠️ | Great |
| **Mubert API** | AI-generated royalty-free music | No (cloud) | Great |

### 🎤 Singing / Voice

| Tool | What It Does | Needs GPU? | Quality |
|------|-------------|-----------|---------|
| **Edge-TTS** | Speaking voice (not singing) | No | Great speech |
| **Bark** (Suno) | Speech + singing + sound effects | YES ⚠️ | Amazing |
| **So-VITS-SVC** | Voice cloning + singing | YES ⚠️ | Amazing |
| **RVC** (Retrieval Voice Conversion) | Voice conversion | YES ⚠️ | Great |
| **DiffSinger** | AI singing synthesis | YES ⚠️ | Good |

### 🔊 Sound Effects

| Tool | What It Does | Needs GPU? |
|------|-------------|-----------|
| **Freesound.org API** | Download CC-licensed sounds | No |
| **BBC Sound Effects** | 16,000+ free sounds | No |
| **Python synthesis** | Generate programmatically | No |
| **AudioCraft SFX** | AI sound effects | YES ⚠️ |

### 🎼 Royalty-Free Music Libraries (Download, No Generation)

| Source | License | URL |
|--------|---------|-----|
| **Pixabay Music** | Free commercial use | pixabay.com/music |
| **Freesound.org** | CC licenses | freesound.org |
| **Incompetech** | CC-BY | incompetech.com |
| **Free Music Archive** | Various CC | freemusicarchive.org |
| **Musopen** | Public domain classical | musopen.org |
| **BBC Sound Effects** | Personal/education | sound-effects.bbcrewind.co.uk |
| **YouTube Audio Library** | Free with YT account | studio.youtube.com |
| **Bensound** | Free tier available | bensound.com |

---

## What Works NOW (No GPU)

### 1. Download Royalty-Free Music
Best immediate option. Thousands of free tracks available.

```bash
# Freesound.org API (needs free account)
# Get API key at: https://freesound.org/apiv2/apply/
curl "https://freesound.org/apiv2/search/text/?query=water+ambient&token=YOUR_KEY&fields=name,previews"
```

### 2. Generate MIDI Music (Installed ✅)

```python
from midiutil import MIDIFile

midi = MIDIFile(1)
midi.addTempo(0, 0, 100)  # BPM
midi.addProgramChange(0, 0, 0, 11)  # Vibraphone

# Your melody as (pitch, duration) pairs
# MIDI pitches: C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71, C5=72
melody = [(60,0.5), (64,0.5), (67,0.5), (72,1.0)]
time = 0
for pitch, dur in melody:
    midi.addNote(0, 0, pitch, time, dur, 80)
    time += dur

with open("output.mid", "wb") as f:
    midi.writeFile(f)
```

### 3. Pure Python Audio Synthesis (Installed ✅)

```python
import struct, wave, math

def make_tone(freq, duration, rate=44100, amp=0.3):
    samples = []
    for i in range(int(rate * duration)):
        t = i / rate
        env = min(t*10, 1) * min((duration-t)*10, 1)
        samples.append(amp * env * math.sin(2 * math.pi * freq * t))
    return samples

# Frequencies: C4=261.63, D4=293.66, E4=329.63, F4=349.23
#              G4=392.00, A4=440.00, B4=493.88, C5=523.25

samples = make_tone(440, 1.0)  # A4 for 1 second
with wave.open("tone.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100)
    for s in samples:
        w.writeframes(struct.pack('h', int(s * 32767)))
```

### 4. Audio Processing (Installed ✅)

```python
from pydub import AudioSegment

# Load + manipulate
song = AudioSegment.from_mp3("music.mp3")
intro = song[:10000]          # First 10 seconds
louder = song + 6             # Boost volume
faded = song.fade_in(2000).fade_out(3000)

# Overlay (mix two tracks)
mixed = voice.overlay(background_music - 10)  # Music 10dB quieter

# Export
mixed.export("final.mp3", format="mp3")
```

---

## What Needs GPU (Run in Cloud Later)

### Meta MusicGen (Best AI Music)
```bash
# Needs ~8GB VRAM. Run on Google Colab (free) or Replicate
pip install audiocraft

# In Python:
from audiocraft.models import MusicGen
model = MusicGen.get_pretrained('facebook/musicgen-small')
model.set_generation_params(duration=30)
wav = model.generate(["happy upbeat water theme song"])
```

**Free cloud options for GPU:**
- **Google Colab** — free GPU (T4), run MusicGen/Bark notebooks
- **Replicate** — free credits on signup, run models via API
- **Hugging Face Spaces** — some models have free demos

### Bark (Speech + Singing + SFX)
```bash
# Needs ~4GB VRAM. Or use via Replicate API
pip install git+https://github.com/suno-ai/bark.git

from bark import generate_audio, SAMPLE_RATE
audio = generate_audio("♪ Water water everywhere ♪", history_prompt="v2/en_speaker_6")
```

### Suno AI (Commercial Music)
- https://suno.com — free tier: 5 songs/day
- Full AI songs with lyrics and vocals
- Not open source but has a free tier
- Can't self-host

---

## Recommended Strategy for WaterScore

**Phase 1 (now):** Download royalty-free background music from Pixabay/Freesound
**Phase 2:** Use edge-tts for voiceovers + pydub to mix with background music
**Phase 3:** When we want AI-generated music, use Google Colab (free GPU) for MusicGen
**Phase 4:** If we want AI singing, use Suno free tier (5/day) or Bark on Colab

---

## Freesound.org API Setup (Free)

1. Create account at freesound.org
2. Get API key at https://freesound.org/apiv2/apply/
3. Search and download sounds:

```python
import requests

API_KEY = "your-freesound-key"
r = requests.get(f"https://freesound.org/apiv2/search/text/", params={
    "query": "water splash",
    "token": API_KEY,
    "fields": "id,name,previews",
    "page_size": 5
})
for sound in r.json()["results"]:
    print(f"{sound['name']}: {sound['previews']['preview-hq-mp3']}")
```
