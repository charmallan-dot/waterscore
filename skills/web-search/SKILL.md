---
name: web-search
description: Search the web for free using DuckDuckGo. No API key needed. Use for research, fact-checking, finding URLs, news, and current information. Replaces Brave Search when no API key is available.
---

# Web Search (DuckDuckGo — FREE)

No API key. No credit card. No limits. Works right now.

## Quick Search

```bash
python3 /home/coder/.openclaw/workspace/skills/web-search/scripts/search.py "your search query"
```

## Options

```bash
# Basic search (5 results)
python3 scripts/search.py "water quality PFAS regulations 2026"

# More results
python3 scripts/search.py "water quality" --max 10

# News only
python3 scripts/search.py "PFAS water contamination" --type news

# Images
python3 scripts/search.py "water filtration diagram" --type images
```

## Python Direct Usage

```python
from duckduckgo_search import DDGS

# Text search
results = DDGS().text("query here", max_results=5)
for r in results:
    print(r["title"], r["href"])

# News search
news = DDGS().news("query here", max_results=5)

# Image search  
images = DDGS().images("query here", max_results=5)

# Instant answers (Wikipedia-style)
answers = DDGS().answers("query here")
```

## Notes
- No rate limit documented, but be polite (1-2 req/sec max)
- Results quality is good for research, slightly less comprehensive than Google
- For Google-quality results: set up Google Custom Search (100/day free, see docs/API_KEYS_SETUP.md)
