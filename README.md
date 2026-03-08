# 🌊 WaterScore

**Water Quality Intelligence by Address** — Know what's in your water before you drink it.

WaterScore aggregates water quality data from EPA, USGS, state agencies, and municipal utilities into a single, searchable platform with auto-generated reports for every US zip code.

## How It Works

1. **Data Pipeline** (automated) — Cron jobs pull from 6+ free government APIs daily
2. **Processing** — Normalizes, scores, and combines data into per-location water profiles
3. **Programmatic SEO** — Auto-generates 500K+ unique pages for every zip/city/utility
4. **Monetization** — Free tier + paid reports + real estate API + water filter affiliates

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Hosting:** Vercel (free tier)
- **Database:** Supabase (free tier — 500MB Postgres)
- **Data Pipeline:** GitHub Actions (cron) + Cloudflare Workers
- **APIs:** EPA SDWIS, EPA Envirofacts, USGS Water Data, FEMA Flood, Census
- **Payments:** Stripe

## Project Status

🚧 **In Development** — See `docs/BUILD_PLAN.md` for current status.

## License

MIT
