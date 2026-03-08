#!/usr/bin/env python3
"""Free web search via DuckDuckGo. No API key needed."""
import argparse, json, sys

def main():
    parser = argparse.ArgumentParser(description="Search the web (free, no API key)")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--max", type=int, default=5, help="Max results (default: 5)")
    parser.add_argument("--type", choices=["text", "news", "images", "answers"], default="text", help="Search type")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    from duckduckgo_search import DDGS
    ddgs = DDGS()

    if args.type == "text":
        results = ddgs.text(args.query, max_results=args.max)
    elif args.type == "news":
        results = ddgs.news(args.query, max_results=args.max)
    elif args.type == "images":
        results = ddgs.images(args.query, max_results=args.max)
    elif args.type == "answers":
        results = ddgs.answers(args.query)

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for i, r in enumerate(results, 1):
            if args.type == "images":
                print(f"{i}. {r.get('title', 'No title')}")
                print(f"   {r.get('image', 'No URL')}")
            elif args.type == "answers":
                print(f"{i}. {r.get('text', 'No text')[:200]}")
                print(f"   Source: {r.get('url', 'N/A')}")
            else:
                print(f"{i}. {r.get('title', 'No title')}")
                print(f"   {r.get('href', r.get('url', 'No URL'))}")
                body = r.get("body", r.get("snippet", ""))
                if body:
                    print(f"   {body[:150]}")
            print()

if __name__ == "__main__":
    main()
