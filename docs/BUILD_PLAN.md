# 🏗️ WaterScore Build Plan

## For AI Builders

This document tells any AI (Claude, GPT, Gemini, Copilot) exactly what to build. Each phase is independent and can be assigned to a different AI or session.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│            Next.js 14 (App Router)               │
│         Vercel Free Tier Hosting                 │
├─────────────────────────────────────────────────┤
│  /                    Landing page + search       │
│  /zip/[zipcode]       Water quality report page   │
│  /city/[state]/[city] City-level report           │
│  /utility/[id]        Utility violation history   │
│  /compare             Compare two locations       │
│  /api/score           Public API endpoint         │
│  /api/report          Paid detailed report        │
│  /blog/[slug]         SEO content (PFAS, lead)    │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│                   DATABASE                       │
│              Supabase (Postgres)                  │
├─────────────────────────────────────────────────┤
│  water_systems        EPA water system profiles   │
│  violations           SDWIS violation records     │
│  contaminants         Detected contaminants       │
│  water_scores         Computed quality scores     │
│  zip_mappings         Zip → water system lookup   │
│  lead_pipes           Lead service line data      │
│  superfund_sites      EPA Superfund locations     │
│  users                Auth + subscription data    │
│  reports              Generated report cache      │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│               DATA PIPELINE                      │
│        GitHub Actions (scheduled cron)            │
├─────────────────────────────────────────────────┤
│  Daily:   Fetch EPA SDWIS violations             │
│  Daily:   Fetch USGS water quality readings      │
│  Weekly:  Update Superfund site proximity data   │
│  Weekly:  Update lead pipe inventories           │
│  Monthly: Recalculate all water scores           │
│  Monthly: Regenerate sitemap                     │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: Data Pipeline (PRIORITY — Build First)
**Estimated time: 1-2 weeks**
**Complexity: Medium**
**Can be built by: Any AI with code execution**

### What to build:
Scripts that fetch, normalize, and store water quality data.

### Files to create:
```
scripts/
├── fetch-sdwis.ts          # Fetch EPA SDWIS data (violations + water systems)
├── fetch-usgs.ts           # Fetch USGS water quality monitoring data
├── fetch-superfund.ts      # Fetch EPA Superfund site locations
├── fetch-lead-pipes.ts     # Fetch state lead service line inventories
├── fetch-contaminants.ts   # Fetch EPA contaminant levels by system
├── compute-scores.ts       # Calculate water quality scores per location
├── map-zips.ts             # Map zip codes to water systems
└── utils/
    ├── epa-client.ts       # EPA API wrapper
    ├── usgs-client.ts      # USGS API wrapper
    └── db.ts               # Supabase client
```

### API Details:

**EPA SDWIS (Safe Drinking Water Information System)**
- Base URL: `https://data.epa.gov/efservice/`
- Endpoints:
  - `WATER_SYSTEM` — all US water systems (ID, name, population served, source type)
  - `VIOLATION` — violations by water system (contaminant, type, severity, date)
  - `LCR_SAMPLE_RESULT` — lead and copper sampling results
  - `GEOGRAPHIC_AREA` — zip code to water system mapping
- No API key needed. Free. Rate limit: be polite (1 req/sec).
- Docs: https://www.epa.gov/enviro/sdwis-search

**EPA Envirofacts (contamination sources)**
- Base URL: `https://data.epa.gov/efservice/`
- Endpoints:
  - `CERCLIS` — Superfund sites (lat/lon, status, contaminants)
  - `TRI_FACILITY` — Toxic Release Inventory (facilities + chemicals released)
  - `BR_REPORT` — Brownfield sites
- No API key. Free.

**USGS Water Data**
- Base URL: `https://waterservices.usgs.gov/nwis/`
- Endpoints:
  - `iv/` — instantaneous values (real-time readings)
  - `dv/` — daily values
  - `site/` — monitoring station info
- Parameters: `parameterCd=00010` (temp), `00400` (pH), `00300` (dissolved oxygen), etc.
- No API key. Free.
- Docs: https://waterservices.usgs.gov/

**FEMA Flood Zones**
- URL: `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer`
- Query by lat/lon to get flood zone designation
- No API key. Free.

**Census/ACS (demographics)**
- URL: `https://api.census.gov/data/`
- Free API key from census.gov (instant)
- Get population, income, demographics per zip/tract

### Scoring Algorithm:
```
Water Score (0-100) = weighted average of:
  - Violation history (40%) — fewer/older violations = higher score
  - Contaminant levels (30%) — below MCL = good, above = bad
  - Source type (10%) — groundwater vs surface water
  - Infrastructure age (10%) — newer systems score higher
  - Proximity to contamination (10%) — distance from Superfund/TRI sites
```

### Database Schema (Supabase SQL):
```sql
-- Run this in Supabase SQL editor

CREATE TABLE water_systems (
  id TEXT PRIMARY KEY,           -- EPA PWSID
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  population_served INTEGER,
  source_type TEXT,              -- 'GW' (groundwater) or 'SW' (surface water)
  city TEXT,
  county TEXT,
  lat FLOAT,
  lon FLOAT,
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE violations (
  id SERIAL PRIMARY KEY,
  system_id TEXT REFERENCES water_systems(id),
  contaminant_code TEXT,
  contaminant_name TEXT,
  violation_type TEXT,           -- MCL, TT, MON, RPT
  severity TEXT,
  begin_date DATE,
  end_date DATE,
  is_resolved BOOLEAN DEFAULT false
);

CREATE TABLE contaminants (
  id SERIAL PRIMARY KEY,
  system_id TEXT REFERENCES water_systems(id),
  contaminant_name TEXT,
  measured_value FLOAT,
  unit TEXT,
  mcl FLOAT,                    -- Maximum Contaminant Level (legal limit)
  mclg FLOAT,                   -- MCL Goal (health goal)
  sample_date DATE
);

CREATE TABLE water_scores (
  zip_code TEXT PRIMARY KEY,
  system_id TEXT REFERENCES water_systems(id),
  overall_score INTEGER,         -- 0-100
  violation_score INTEGER,
  contaminant_score INTEGER,
  infrastructure_score INTEGER,
  proximity_score INTEGER,
  grade CHAR(1),                 -- A, B, C, D, F
  top_concerns TEXT[],           -- array of main issues
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE zip_mappings (
  zip_code TEXT PRIMARY KEY,
  system_id TEXT,
  city TEXT,
  state TEXT,
  county TEXT,
  lat FLOAT,
  lon FLOAT
);

CREATE TABLE superfund_sites (
  id TEXT PRIMARY KEY,
  name TEXT,
  city TEXT,
  state TEXT,
  lat FLOAT,
  lon FLOAT,
  status TEXT,
  contaminants TEXT[],
  npl_status TEXT
);

CREATE TABLE lead_pipes (
  id SERIAL PRIMARY KEY,
  system_id TEXT,
  state TEXT,
  city TEXT,
  total_service_lines INTEGER,
  lead_lines INTEGER,
  lead_percentage FLOAT,
  replacement_deadline DATE,
  source_url TEXT
);

-- Indexes for performance
CREATE INDEX idx_violations_system ON violations(system_id);
CREATE INDEX idx_contaminants_system ON contaminants(system_id);
CREATE INDEX idx_zip_state ON zip_mappings(state);
CREATE INDEX idx_scores_grade ON water_scores(grade);
```

### Deliverable:
- All scripts working and tested
- Database populated with initial data
- GitHub Action workflow for daily/weekly runs

---

## Phase 2: Frontend — Core Pages
**Estimated time: 1-2 weeks**
**Complexity: Medium**
**Can be built by: Any AI with Next.js knowledge**

### What to build:
Next.js app with the main user-facing pages.

### Files to create:
```
src/
├── app/
│   ├── layout.tsx              # Root layout with nav, footer
│   ├── page.tsx                # Landing page with search
│   ├── zip/
│   │   └── [zipcode]/
│   │       └── page.tsx        # Zip code report page
│   ├── city/
│   │   └── [state]/
│   │       └── [city]/
│   │           └── page.tsx    # City report page
│   ├── utility/
│   │   └── [id]/
│   │       └── page.tsx        # Utility detail page
│   ├── compare/
│   │   └── page.tsx            # Compare two locations
│   ├── about/
│   │   └── page.tsx            # About + methodology
│   └── api/
│       ├── score/
│       │   └── route.ts        # Public API: get score by zip
│       └── search/
│           └── route.ts        # Search autocomplete
├── components/
│   ├── ScoreGauge.tsx          # Visual A-F grade display
│   ├── ContaminantTable.tsx    # Table of detected contaminants
│   ├── ViolationTimeline.tsx   # Timeline of violations
│   ├── WaterSourceMap.tsx      # Map showing water system
│   ├── ComparisonCard.tsx      # Side-by-side comparison
│   ├── SearchBar.tsx           # Zip/city search with autocomplete
│   ├── FilterRecommendation.tsx # Water filter affiliate recs
│   ├── ScoreExplainer.tsx      # How the score is calculated
│   └── SEOHead.tsx             # Dynamic meta tags
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── scoring.ts              # Score computation helpers
│   └── seo.ts                  # SEO metadata generators
└── styles/
    └── globals.css             # Tailwind + custom styles
```

### Design Requirements:
- **Clean, trustworthy feel** — think health/science, not flashy startup
- **Color scheme:** Blues and greens (water themed). Score colors: A=green, B=light green, C=yellow, D=orange, F=red
- **Mobile-first** — most traffic will be mobile
- **Fast** — use ISR (Incremental Static Regeneration) for zip pages, revalidate every 24h
- **Score display:** Large circular gauge with letter grade + numeric score
- **Key sections per zip page:**
  1. Overall score + grade (hero)
  2. Top concerns (bullet list)
  3. Contaminant breakdown (table with MCL comparison)
  4. Violation history (timeline)
  5. Water source info
  6. Nearby contamination sources (Superfund, TRI)
  7. Lead pipe risk
  8. "What you can do" section (filter recommendations = affiliate $$)
  9. Compare with nearby cities (internal links = SEO juice)

### SEO Requirements:
- Each page needs unique `<title>` and `<meta description>`
- Pattern: "Water Quality in [City], [State] — Score: [Grade] | WaterScore"
- Schema.org markup (FAQ, Dataset)
- Sitemap auto-generation
- Internal linking between related zip codes and cities

### Deliverable:
- Working Next.js app deployable to Vercel
- All page templates rendering with real data from Supabase
- Mobile responsive
- Lighthouse score > 90

---

## Phase 3: Programmatic SEO Engine
**Estimated time: 1 week**
**Complexity: Low-Medium**
**Can be built by: Any AI**

### What to build:
Auto-generate static pages and sitemaps for all 41,000+ US zip codes.

### Files to create:
```
scripts/
├── generate-sitemap.ts         # Build sitemap XML (chunked per 50k URLs)
├── generate-static-paths.ts    # Export all zip/city paths for SSG
src/app/
├── sitemap.ts                  # Next.js sitemap route
├── robots.ts                   # Robots.txt
```

### Pages to auto-generate:
- `/zip/[zipcode]` — 41,000+ pages
- `/city/[state]/[city]` — 30,000+ pages
- `/utility/[id]` — ~50,000 water systems
- `/state/[state]` — 50 state overview pages
- `/compare/[zip1]-vs-[zip2]` — top 1000 comparison combos

### SEO Checklist:
- [ ] Unique H1 per page with target keyword
- [ ] 2-3 paragraphs of data-driven content (not boilerplate)
- [ ] Data table/chart unique to each page
- [ ] FAQ section (auto-generated from related queries)
- [ ] Internal links to nearby zip codes and parent city
- [ ] Schema.org markup (FAQPage, Dataset)
- [ ] Canonical URLs
- [ ] Sitemap submitted to Google Search Console
- [ ] Open Graph + Twitter card images

### Deliverable:
- All static paths generated
- Sitemaps auto-building on deploy
- Google Search Console ready

---

## Phase 4: Monetization Layer
**Estimated time: 1 week**
**Complexity: Low**
**Can be built by: Any AI**

### What to build:

**A. Water Filter Affiliates (Day 1 Revenue)**
- Component that recommends water filters based on detected contaminants
- Affiliate links to Amazon (Associates), Berkey, AquaTru, iSpring
- Logic: "Your water has high lead → we recommend [reverse osmosis filter]"

**B. Stripe Payments (Premium Reports)**
- One-time purchase: $4.99 for detailed PDF report
- Subscription: $29/yr for monitoring + alerts
- Real estate pro: $49-199/mo for embeddable scores

**C. Google AdSense**
- Display ads on free pages
- Health/water niche = high CPM

### Files to create:
```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts        # Stripe checkout session
│   │   └── webhook/
│   │       └── route.ts        # Stripe webhook handler
│   ├── pricing/
│   │   └── page.tsx            # Pricing page
│   └── report/
│       └── [id]/
│           └── page.tsx        # Premium report view
├── components/
│   ├── FilterRecs.tsx          # Affiliate filter recommendations
│   ├── PricingTable.tsx        # Pricing plans
│   ├── PaywallGate.tsx         # Soft paywall for premium data
│   └── AdUnit.tsx              # AdSense component
└── lib/
    ├── stripe.ts               # Stripe helpers
    └── affiliates.ts           # Affiliate link management
```

### Affiliate Strategy:
| Contaminant | Recommended Filter | Affiliate Program |
|---|---|---|
| Lead | Reverse osmosis | Amazon Associates, iSpring direct |
| PFAS | Activated carbon + RO | AquaTru ($30-50/sale), Berkey |
| Chlorine | Whole-house carbon | Amazon, Pelican Water |
| Nitrates | RO system | Amazon Associates |
| Bacteria | UV + filter | Amazon, Viqua |

### Deliverable:
- Affiliate recommendations working per contaminant type
- Stripe checkout flow for premium reports
- AdSense integrated on free pages

---

## Phase 5: Growth & Automation
**Estimated time: Ongoing**
**Complexity: Low**

### Auto-content:
- Blog posts about PFAS, lead, water safety (AI-generated, human-reviewed)
- "Water Quality Report for [City] — [Month] [Year]" monthly update pages
- Social media auto-posting (water quality facts, city spotlights)

### Email:
- "Your water quality changed" alerts for subscribers
- Weekly newsletter: worst water quality discoveries
- Drip sequence for new signups

### Monitoring:
- Track Google Search Console rankings
- Monitor API uptime
- Alert on data pipeline failures

---

## Task Assignment Guide

| Phase | Difficulty | Best AI For | Dependencies |
|-------|-----------|-------------|--------------|
| Phase 1: Data Pipeline | Medium | Claude/GPT (code execution) | None — start here |
| Phase 2: Frontend | Medium | Claude/Cursor/Copilot | Phase 1 (needs data) |
| Phase 3: pSEO | Low-Med | Any AI | Phase 2 (needs pages) |
| Phase 4: Monetization | Low | Any AI | Phase 2 (needs frontend) |
| Phase 5: Growth | Low | Any AI | Phase 2+3 |

**Phase 1 is the foundation.** Everything else builds on the data.

---

## Environment Setup

```bash
# Clone repo
git clone https://github.com/charmallan-dot/waterscore.git
cd waterscore

# Install dependencies
npm install

# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_GA_ID=G-...        # Google Analytics (optional)
CENSUS_API_KEY=your-key        # Free from census.gov
```
