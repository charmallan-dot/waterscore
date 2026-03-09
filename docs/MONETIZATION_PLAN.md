# 💰 WaterScore Monetization Plan

**Last updated:** 2026-03-09
**Status:** Site is live, data loaded, auto-updates configured
**Current revenue:** $0 (pre-monetization)

---

## Overview

WaterScore has 48,720 pages of water quality data. Each page is a potential revenue generator. Here's how to monetize, in order of ease and impact.

---

## Revenue Stream 1: Water Filter Affiliate Links

**Expected revenue:** $500-5,000/month at scale
**Difficulty:** Easy
**Time to set up:** 1-2 hours
**Cost:** $0

### What It Is
Every water system page with contaminant issues recommends specific water filters. When someone clicks and buys, you earn 3-8% commission.

### How to Set Up

#### Step 1: Sign up for Amazon Associates
1. Go to https://affiliate-program.amazon.com
2. Click "Sign Up"
3. You need: a website (waterscore.app or your Vercel URL), a description of your site, and a valid payment method
4. They'll give you an **Associate Tag** (like `waterscore-20`)
5. Note: Amazon requires you to make 3 sales within 180 days or they close the account. So sign up only when you have some traffic.

#### Step 2: Alternative affiliate programs (no 3-sale requirement)
- **ShareASale** (https://shareasale.com) — has Berkey, Aquasana, Clearly Filtered
- **Rakuten** (https://rakuten.com) — has Brita, PUR
- **Direct programs:**
  - Clearly Filtered: https://clearlyfiltered.com/affiliate (15% commission!)
  - Aquasana: https://aquasana.com/affiliate (10% commission)
  - Berkey: via ShareASale (8% commission)

These specialty filter brands pay MORE than Amazon and are easier to get approved.

#### Step 3: Tell Claude to integrate
Once you have an affiliate tag/link, tell me:
> "My Amazon tag is waterscore-20" or "My Clearly Filtered affiliate link is https://..."

I will then add product recommendation cards to every system page that has:
- Lead above EPA limits → recommend RO filters + lead pitchers
- Copper above limits → recommend RO filters
- General poor score → recommend carbon filters
- Good score → recommend basic Brita for taste

#### What the integration looks like
On each system page with issues, a section appears:

```
💧 Recommended Filters for Your Water
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Lead detected above EPA limits

🏆 Best Overall: Clearly Filtered 3-Stage Pitcher
   Removes 99.5% of lead, 98% of PFAS
   $90 → [Check Price] (affiliate link)

💰 Budget Pick: PUR PLUS Pitcher
   Removes 99% of lead, NSF certified
   $35 → [Check Price] (affiliate link)

🔧 Whole House: Aquasana EQ-1000
   Filters all taps, 10-year lifespan
   $800 → [Check Price] (affiliate link)
```

#### Revenue math
- 48,720 system pages × ~6.5% have F grade = 3,187 high-intent pages
- If 1% of visitors click affiliate links = standard rate
- Average filter purchase = $50-200
- Commission = 8-15%
- **At 10,000 monthly visitors: $200-800/month**
- **At 100,000 monthly visitors: $2,000-8,000/month**

---

## Revenue Stream 2: Google AdSense

**Expected revenue:** $200-2,000/month at scale
**Difficulty:** Easy
**Time to set up:** 30 mins (but approval takes 1-2 weeks)
**Cost:** $0

### How to Set Up

#### Step 1: Apply for AdSense
1. Go to https://adsense.google.com
2. Sign in with a Google account
3. Enter your site URL
4. Wait for approval (1-14 days)
5. Requirements: original content (✅ we have unique scored data), privacy policy page, enough content

#### Step 2: Tell Claude to integrate
Once approved, you'll get an **AdSense Publisher ID** (like `ca-pub-1234567890`).
Tell me and I'll add ad slots to:
- Between sections on the homepage
- Sidebar on system pages
- Between search results
- Before/after the "What You Can Do" section

#### Step 3: Alternative ad networks (if AdSense rejects)
- **Ezoic** (https://ezoic.com) — lower threshold, AI-optimized ads
- **Mediavine** — needs 50K sessions/month (apply later when traffic grows)
- **Carbon Ads** — tech/developer audience, cleaner ads

#### Revenue math
- Water/health niche CPM: $2-8 (above average)
- **At 10,000 monthly pageviews: $20-80/month**
- **At 100,000 monthly pageviews: $200-800/month**
- **At 1,000,000 monthly pageviews: $2,000-8,000/month**

---

## Revenue Stream 3: Premium Water Reports (PDF)

**Expected revenue:** $1,000-10,000/month at scale
**Difficulty:** Medium
**Time to set up:** 3-4 hours (Claude builds it)
**Cost:** $0 (Stripe takes 2.9% + 30¢ per transaction)

### What It Is
A detailed, downloadable PDF report for any address. Includes:
- Full water quality score with explanation
- All contaminants detected with health effects
- Historical violation timeline
- Comparison with state and national averages
- Personalized filter recommendations
- Nearby alternative water systems
- Property impact assessment (how it affects home value)

### How to Set Up

#### Step 1: Create Stripe account
1. Go to https://stripe.com
2. Sign up (free)
3. Complete verification (ID + bank account for payouts)
4. Get your **Publishable Key** and **Secret Key**

#### Step 2: Tell Claude to build it
Tell me:
> "My Stripe keys are pk_live_xxx and sk_live_xxx, build the premium reports"

I will build:
- A "Get Full Report" button on every system page ($4.99 or $9.99)
- Stripe Checkout integration (handles payment)
- PDF generation (using the data we already have)
- Email delivery of the PDF
- A `/pricing` page showing what's included

#### Step 3: Pricing strategy
- **Single Report:** $4.99 (impulse buy for homeowners)
- **City Bundle:** $14.99 (all systems in a city — useful for realtors)
- **State Report:** $29.99 (researchers, journalists)
- **API Access:** $49/month (developers, real estate platforms)

#### Revenue math
- Conversion rate on freemium data sites: 0.5-2%
- **At 10,000 monthly visitors × 1% conversion × $4.99 = $500/month**
- **At 100,000 monthly visitors × 1% × $4.99 = $5,000/month**

---

## Revenue Stream 4: API Access

**Expected revenue:** $500-5,000/month
**Difficulty:** Medium
**Time to set up:** 2-3 hours (Claude builds it)
**Cost:** $0

### What It Is
A REST API that returns water quality data for any zip code or system ID. Target customers: real estate platforms, home inspection companies, insurance companies, health apps.

### How to Set Up

#### Step 1: Build API routes
Tell Claude:
> "Build the WaterScore API with rate limiting and API key auth"

I will create:
- `GET /api/v1/score?zip=90210` — returns score for a zip
- `GET /api/v1/system/:id` — returns full system data
- `GET /api/v1/search?q=Los+Angeles` — search systems
- API key authentication
- Rate limiting (100 req/day free, unlimited paid)

#### Step 2: Pricing
- **Free tier:** 100 requests/day (attracts developers)
- **Starter:** $49/month — 10,000 requests/day
- **Pro:** $199/month — 100,000 requests/day
- **Enterprise:** $499/month — unlimited + SLA

#### Step 3: List on API marketplaces
- RapidAPI (https://rapidapi.com) — handles billing, brings customers
- API Layer (https://apilayer.com)

---

## Revenue Stream 5: Lead Generation

**Expected revenue:** $1,000-10,000/month at scale
**Difficulty:** Medium-Hard
**Time to set up:** Ongoing partnership building
**Cost:** $0

### What It Is
Connect worried homeowners with:
- Water testing companies ($5-20 per lead)
- Plumbers for pipe replacement ($20-50 per lead)
- Water treatment installation companies ($50-100 per lead)

### How to Set Up
1. Add "Get Your Water Tested" CTA on F-grade pages
2. Collect name + zip + email via a form
3. Partner with local service providers
4. Services to approach: HomeAdvisor, Angi, Thumbtack (they buy leads)

---

## Implementation Priority & Timeline

| Week | Action | Revenue Stream | Expected Setup Time |
|------|--------|---------------|-------------------|
| 1 | Sign up for Clearly Filtered + ShareASale affiliates | Affiliates | 1 hour |
| 1 | Apply for Google AdSense | Ads | 30 mins |
| 2 | Create Stripe account | Premium Reports | 30 mins |
| 2 | Tell Claude to build affiliate cards + ad slots | Affiliates + Ads | 2 hours (Claude does it) |
| 3 | Tell Claude to build premium PDF reports | Premium Reports | 3 hours (Claude does it) |
| 4 | Tell Claude to build API + list on RapidAPI | API | 3 hours (Claude does it) |
| 5+ | Reach out to water testing companies | Lead Gen | Ongoing |

## Free Tier Limits We're Working Within

| Service | Free Tier | Our Usage | Status |
|---------|-----------|-----------|--------|
| Vercel | 100GB bandwidth, 100 deploys/day | Well under | ✅ |
| Supabase | 500MB database, 2GB bandwidth | ~50MB data | ✅ |
| GitHub Actions | 2,000 mins/month | ~90 mins/month | ✅ |
| Stripe | No monthly fee (2.9% per transaction) | Pay as you earn | ✅ |
| EPA API | Unlimited, no key needed | ~50K requests/month | ✅ |

## SEO Strategy (drives all revenue)

See `docs/SEO_CHECKLIST.md` for the full checklist. Key points:
- 48,720 unique pages = 48,720 chances to rank on Google
- Each page targets "[city name] water quality" keywords
- Programmatic SEO means we scale content without writing anything
- Water quality + PFAS is a trending topic (regulatory tailwinds)
- Target: 100K monthly organic visitors within 6 months

---

## Quick Start Checklist

When you're ready to monetize, just tell Claude:

- [ ] "Sign me up for Clearly Filtered affiliate" → I'll guide you through it
- [ ] "Here's my affiliate tag: XXX" → I'll add product recs to all pages
- [ ] "I got AdSense approved, publisher ID is XXX" → I'll add ad slots
- [ ] "Here are my Stripe keys" → I'll build premium reports
- [ ] "Build the API" → I'll create API routes with auth

**You handle the signups. I handle the code. Zero cost.**
