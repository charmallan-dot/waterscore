---
name: screenshot-tool
description: Take screenshots of any webpage. FREE, local. Use for social proof, competitor analysis, OG images, documentation, visual testing. Uses Playwright or Puppeteer.
---

# Screenshot Tool (FREE)

Capture any webpage as an image. Useful for promo content, OG images, competitor monitoring.

## Using OpenClaw Browser (Built-in)

The browser tool can screenshot any page:
```
browser action:screenshot targetUrl:"https://example.com"
browser action:screenshot targetUrl:"https://example.com" fullPage:true
```

## Using Playwright (if installed)

```bash
# Install
pip3 install --break-system-packages playwright
playwright install chromium

# Screenshot
python3 -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('https://example.com')
    page.screenshot(path='screenshot.png', full_page=True)
    browser.close()
"
```

## Batch Screenshots (Competitor Monitoring)

```python
urls = [
    "https://ewg.org/tapwater",
    "https://competitor1.com",
    "https://competitor2.com"
]
for url in urls:
    page.goto(url)
    name = url.split("//")[1].replace("/", "_")
    page.screenshot(path=f"screenshots/{name}.png")
```
