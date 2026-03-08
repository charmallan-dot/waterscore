---
name: seo-generator
description: Generate SEO content — meta titles, descriptions, blog posts, FAQ sections, schema markup. Use for programmatic SEO pages, content templates, and bulk content generation for WaterScore and similar pSEO projects.
---

# SEO Content Generator

Generate SEO-optimized content for programmatic pages.

## Meta Tags Template

```python
def generate_meta(city, state, score, grade):
    title = f"Water Quality in {city}, {state} — Grade: {grade} | WaterScore"
    description = f"Is the water safe in {city}, {state}? Water quality score: {score}/100 ({grade}). Check contaminants, violations, lead pipe risk, and PFAS levels. Free report."
    return {"title": title[:60], "description": description[:160]}
```

## FAQ Schema (Auto-Generated)

```python
def generate_faq(city, state, contaminants, score):
    faqs = [
        {
            "question": f"Is the tap water safe to drink in {city}, {state}?",
            "answer": f"{city}'s water scores {score}/100. {'It meets federal standards.' if score >= 70 else 'There are some concerns — see details below.'}"
        },
        {
            "question": f"What contaminants are in {city}'s water?",
            "answer": f"Detected contaminants include: {', '.join(contaminants[:5])}. Click for full breakdown."
        },
        {
            "question": f"Does {city} have lead pipes?",
            "answer": "Check the lead service line section below for current data from your utility's inventory."
        },
        {
            "question": f"What water filter is best for {city}?",
            "answer": "Based on your local contaminants, we recommend a reverse osmosis system. See our filter recommendations below."
        }
    ]
    return faqs
```

## Blog Post Outline Generator

```
Topic: [keyword from search data]
Target keyword: [primary keyword]

H1: [Include primary keyword naturally]
Intro: 100-150 words, hook + what reader will learn
H2: What is [topic]?
H2: Why does [topic] matter for your health?
H2: How to test for [topic] in your water
H2: Best water filters for [topic] removal
H2: [City-specific] data on [topic]
H2: FAQ (4-6 questions with schema markup)
CTA: Check your water quality at WaterScore
```

## Programmatic Page Content Tips

1. **Every page must have UNIQUE content** — don't just swap city names
2. **Use real data** — actual contaminant levels, actual violations
3. **Data-driven sentences:** "In [City], [contaminant] was detected at [X] ppb, which is [above/below] the EPA limit of [Y] ppb"
4. **Internal links:** Link to nearby zip codes, parent city, state overview
5. **Schema markup:** FAQPage, Dataset, LocalBusiness (for utilities)
6. **Updated dates:** Show "Last updated: [date]" — Google rewards freshness
