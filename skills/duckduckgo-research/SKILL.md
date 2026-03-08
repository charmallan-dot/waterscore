---
name: duckduckgo-research
description: Deep research using DuckDuckGo search + web fetching. FREE, no API key. Use for market research, competitor analysis, fact checking, finding data sources, news monitoring. Alternative to Brave Search and Grok for research tasks.
---

# DuckDuckGo Research (FREE)

Combine DuckDuckGo search with web_fetch for deep research. No API key needed.

## Quick Research

```python
from duckduckgo_search import DDGS

# Search
results = DDGS().text("PFAS water regulations 2026", max_results=10)
for r in results:
    print(f"- {r['title']}: {r['href']}")

# News
news = DDGS().news("water contamination", max_results=5)

# Instant answers
answers = DDGS().answers("EPA PFAS standards")
```

## Research Script

```bash
python3 /home/coder/.openclaw/workspace/skills/web-search/scripts/search.py "your query" --max 10
```

## Deep Research Pattern

For thorough research, combine search + fetch:

1. **Search** for relevant URLs with DuckDuckGo
2. **Fetch** full content from the best results using web_fetch tool
3. **Synthesize** findings into a report

## Search Types

| Type | Method | Best For |
|------|--------|----------|
| `text` | `DDGS().text(q)` | General search |
| `news` | `DDGS().news(q)` | Current events, trends |
| `images` | `DDGS().images(q)` | Finding graphics, diagrams |
| `answers` | `DDGS().answers(q)` | Quick facts (Wikipedia-style) |

## Alternatives (if needed later)

| Service | Free Tier | API Key | Credit Card |
|---------|----------|---------|-------------|
| DuckDuckGo | Unlimited | No key needed | No |
| Google Custom Search | 100/day | Yes (free) | No |
| Serper.dev | 2,500 searches | Yes (free) | No |
| Tavily | 1,000/month | Yes (free) | No |
| Brave Search | 2,000/month | Yes (free) | YES ❌ |
| SearXNG (self-hosted) | Unlimited | No | No |

**Current recommendation:** DuckDuckGo for most things. Add Google Custom Search (100/day) for better quality when needed.
