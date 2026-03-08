# 🏭 WaterScore — AI Agent Architecture

## Inspired by: Dubibubii's "Autonomous App Factory" (Shelldon)
## Our version: Specialized agents, free/cheap models, Claude as fallback

---

## The Team

```
                    ┌─────────────────────┐
                    │      CLAUDE          │
                    │   (Orchestrator)     │
                    │   Opus 4.6           │
                    │   5% context         │
                    │   Delegates tasks    │
                    └──────────┬──────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────┐
        ▼          ▼           ▼           ▼          ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ RESEARCH │ │  WRITER  │ │ BUILDER  │ │ REVIEWER │ │  PROMO   │
  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │
  │          │ │          │ │          │ │          │ │          │
  │ Grok     │ │ DeepSeek │ │ Claude   │ │ Gemini   │ │ Gemini   │
  │ (free)   │ │ (free)   │ │ Sonnet   │ │ (free)   │ │ (free)   │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
  Market       SEO content   Code/        Code review   Social media
  research     blog posts    complex      QA checks     promo content
  trends       page copy     features     data verify   images/copy
  competitors  meta tags     pipelines    scoring       email copy
```

---

## Agent Definitions

### 🧠 Claude (Orchestrator) — YOU ARE HERE
- **Model:** anthropic/claude-opus-4-6
- **Role:** Main brain. Delegates tasks to specialists. Handles complex code, architecture decisions, orchestration.
- **When to use:** Complex coding, system design, debugging, anything the others can't handle
- **Cost:** Most expensive — use sparingly, delegate everything possible

### 🔍 Research Agent (Grok)
- **Model:** xai/grok-3-mini-beta (free via X API)
- **Role:** Market research, competitor analysis, trend spotting, live data lookup
- **Tasks:**
  - Research competing water quality sites
  - Find trending water/health topics for content
  - Monitor competitor features
  - Analyze search trends
- **Fallback:** Claude (if Grok unavailable)

### ✍️ Writer Agent (DeepSeek)
- **Model:** deepseek/deepseek-chat-v3-0324 (free via OpenRouter)
- **Role:** SEO content creation, blog posts, page copy, meta descriptions
- **Tasks:**
  - Write SEO blog posts about water quality topics
  - Generate meta titles and descriptions for 500K+ pages
  - Write "What you can do" sections with affiliate copy
  - Create FAQ content for each page
  - Write email newsletter content
- **Fallback:** Claude Haiku (cheap) or Gemini

### 🔨 Builder Agent (Claude Sonnet)
- **Model:** anthropic/claude-sonnet-4-20250514
- **Role:** Code generation, feature building, bug fixes
- **Tasks:**
  - Build Next.js components
  - Write data pipeline scripts
  - Implement API routes
  - Fix bugs
- **Note:** Use Sonnet (not Opus) for routine coding — much cheaper, still great at code
- **Fallback:** Claude Opus for complex architecture decisions

### 🔎 Reviewer Agent (Gemini)
- **Model:** google/gemini-2.0-flash (free tier)
- **Role:** Code review, data verification, quality checks
- **Tasks:**
  - Review code before merging
  - Verify water quality data accuracy
  - Check scoring algorithm outputs
  - Validate SEO meta tags
  - Test page rendering
- **Fallback:** Claude

### 📣 Promo Agent (Gemini)
- **Model:** google/gemini-2.0-flash (free tier)
- **Role:** Marketing content, social media, promotional copy
- **Tasks:**
  - Create social media posts
  - Generate promotional copy
  - Write email campaigns
  - Create ad copy for water filter affiliates
  - Draft press releases
- **Fallback:** DeepSeek

---

## Pipeline for WaterScore

```
Step 1: RESEARCH (Grok)
  → Analyze water quality market, find content gaps, trending topics
  
Step 2: PLAN (Claude Opus)
  → Architecture decisions, task breakdown, sprint planning
  
Step 3: BUILD (Claude Sonnet)
  → Write code for data pipeline, frontend, APIs
  → Loop: build → test → fix (max 8 loops)
  
Step 4: REVIEW (Gemini)
  → Code review, data accuracy check
  → Score ≥ 8/10 to pass
  
Step 5: WRITE (DeepSeek)
  → SEO content: blog posts, page copy, meta tags
  → Generate content templates for programmatic pages
  
Step 6: PROMO (Gemini)
  → Social media copy, launch materials
  → Email sequences for subscribers
  
Step 7: SHIP (Claude)
  → Deploy to Vercel, verify, monitor
```

---

## How to Spawn Each Agent

In OpenClaw, you spawn sub-agents with specific models:

```
# Research task with Grok
sessions_spawn(task="Research...", model="xai/grok-3-mini-beta")

# SEO writing with DeepSeek
sessions_spawn(task="Write...", model="openrouter/deepseek/deepseek-chat-v3-0324")

# Code building with Sonnet
sessions_spawn(task="Build...", model="anthropic/claude-sonnet-4-20250514")

# Review with Gemini
sessions_spawn(task="Review...", model="google/gemini-2.0-flash")

# Promo with Gemini
sessions_spawn(task="Create promo...", model="google/gemini-2.0-flash")
```

Claude Opus (me) handles orchestration and only does the hard stuff directly.

---

## Cost Optimization

| Agent | Model | Cost | Usage |
|-------|-------|------|-------|
| Orchestrator | Claude Opus | $$$ | 5% — only delegates |
| Builder | Claude Sonnet | $$ | 30% — routine code |
| Research | Grok | FREE | 15% — market research |
| Writer | DeepSeek | FREE | 25% — SEO content |
| Reviewer | Gemini | FREE | 15% — code review, QA |
| Promo | Gemini | FREE | 10% — marketing content |

**Target: 50%+ of work done by FREE models**
