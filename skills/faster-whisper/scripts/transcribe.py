#!/usr/bin/env python3
"""Transcribe audio/video to text using faster-whisper. Free, local, no API key."""
import argparse, sys

def main():
    parser = argparse.ArgumentParser(description="Transcribe audio/video to text")
    parser.add_argument("file", help="Audio or video file to transcribe")
    parser.add_argument("--model", default="base", choices=["tiny", "base", "small", "medium", "large-v3"], help="Model size (default: base)")
    parser.add_argument("--language", default=None, help="Language code (auto-detect if omitted)")
    parser.add_argument("--srt", default=None, help="Output SRT subtitle file path")
    parser.add_argument("--timestamps", action="store_true", help="Show timestamps")
    args = parser.parse_args()

    from faster_whisper import WhisperModel
    print(f"Loading {args.model} model...", file=sys.stderr)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")

    print(f"Transcribing {args.file}...", file=sys.stderr)
    segments, info = model.transcribe(args.file, language=args.language)
    print(f"Detected language: {info.language} ({info.language_probability:.0%})", file=sys.stderr)

    srt_file = open(args.srt, "w") if args.srt else None
    
    for i, segment in enumerate(segments, 1):
        if args.timestamps:
            print(f"[{segment.start:.1f}s - {segment.end:.1f}s] {segment.text.strip()}")
        else:
            print(segment.text.strip())
        
        if srt_file:
            start = f"{int(segment.start//3600):02d}:{int(segment.start%3600//60):02d}:{segment.start%60:06.3f}".replace(".", ",")
            end = f"{int(segment.end//3600):02d}:{int(segment.end%3600//60):02d}:{segment.end%60:06.3f}".replace(".", ",")
            srt_file.write(f"{i}\n{start} --> {end}\n{segment.text.strip()}\n\n")

    if srt_file:
        srt_file.close()
        print(f"\nSubtitles saved to {args.srt}", file=sys.stderr)

if __name__ == "__main__":
    main()
