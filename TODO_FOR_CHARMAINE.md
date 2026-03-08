# 📋 TODO for Charmaine (Updated by Claude overnight)

**Last updated:** 2026-03-09 04:00 AM Taipei time
**Status:** Claude is working autonomously 🤖

---

## ✅ DONE (by Claude)
- [x] Phase 1: Data pipeline built + tested (EPA SDWIS, contaminants, scoring)
- [x] Phase 2: Full Next.js frontend (homepage, search, system detail, worst list, about)
- [x] California data fetched (3,077 systems, 30,780 violations, 17,946 samples)
- [x] All skills created + backed up to GitHub
- [x] Agent architecture documented
- [ ] Fetching all 50 states data (IN PROGRESS...)

## 🔨 CLAUDE IS DOING (overnight)
- [ ] Fetch all 50 US states water data
- [ ] Recompute scores for entire US
- [ ] Push updated data + code to GitHub
- [ ] Any other improvements possible without your input

## 👩‍💻 CHARMAINE NEEDS TO DO (when you wake up)

### Priority 1: Set up Supabase (FREE — 5 mins)
1. Go to https://supabase.com
2. Click "Start your project" → sign up (use GitHub login)
3. Create new project → name it "waterscore"
4. Choose region closest to US users (e.g., US East)
5. Set a database password (save it somewhere safe!)
6. Wait ~2 min for project to spin up
7. Go to **Settings → API** (left sidebar)
8. Send me these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public key** (starts with: eyJ...)

### Priority 2: Set up Vercel (FREE — 5 mins)
1. Go to https://vercel.com
2. Click "Sign Up" → **Continue with GitHub** (charmallan-dot)
3. Click "Import Project" → select **waterscore** repo
4. Click Deploy (default settings are fine!)
5. You'll get a free URL like: waterscore-xxx.vercel.app

### Priority 3 (optional): Free API keys for other agents
- **OpenRouter** (DeepSeek free): https://openrouter.ai → sign up → keys
- **Google Gemini** (free): https://aistudio.google.com/apikey
- **xAI Grok** (free): https://console.x.ai

### Priority 4 (optional): Custom domain
- Buy waterscore.app or similar (~$10/yr)
- Connect to Vercel in project settings

---

## 📊 Current Data Status
- California: ✅ Complete (3,077 systems)
- Other states: ⏳ Fetching...
- Total US estimate: ~50,000 community water systems

## 💰 Cost So Far
- Hosting: $0
- APIs: $0 (all free government data)
- Domain: $0 (using Vercel subdomain for now)
- AI costs: Only your Anthropic API key

---

*This file auto-updates. Check GitHub for latest version:*
*https://github.com/charmallan-dot/waterscore/blob/main/TODO_FOR_CHARMAINE.md*
