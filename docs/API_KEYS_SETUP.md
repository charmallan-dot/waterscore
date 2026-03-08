# 🔑 API Keys — Where They Go

## Environment Variables

API keys for different model providers are set as environment variables on the server running OpenClaw. They go in the shell environment (e.g., `.bashrc`, `.env`, or your hosting platform's secret manager).

```bash
# REQUIRED (already set — this is what powers Claude)
export ANTHROPIC_API_KEY=sk-ant-...

# FOR FREE MODELS (add these when ready)
export OPENROUTER_API_KEY=sk-or-...          # DeepSeek via OpenRouter (free tier)
export GOOGLE_GENERATIVE_AI_API_KEY=...      # Gemini (free tier: 60 req/min)
export XAI_API_KEY=...                       # Grok (free tier via X/xAI)
```

## How to Get Free API Keys

### 1. OpenRouter (for DeepSeek free)
- Go to: https://openrouter.ai/
- Sign up (free)
- Get API key from dashboard
- DeepSeek models are free on OpenRouter
- Model ID: `openrouter/deepseek/deepseek-chat-v3-0324`

### 2. Google Gemini (free tier)
- Go to: https://aistudio.google.com/apikey
- Sign in with Google account
- Create API key (instant, free)
- Free: 60 requests/minute, 1500/day
- Model ID: `google/gemini-2.0-flash`

### 3. xAI / Grok (free tier)
- Go to: https://console.x.ai/
- Sign up
- Get API key
- Free tier: limited requests
- Model ID: `xai/grok-3-mini-beta`

## OpenClaw Config

The models are specified per-agent when spawning sub-agents. The main config
(`~/.openclaw/openclaw.json`) only needs the primary model. Other models are
selected at spawn time using the `model` parameter.

The orchestrator (Claude Opus) stays as the primary model in config.
Specialist agents are spawned with their specific model via `sessions_spawn`.

## Adding Keys to the Server

### On your hosting platform (Railway/VPS):
Add each key as an environment variable in the dashboard.

### On local machine:
```bash
# Add to ~/.bashrc or ~/.zshrc
export OPENROUTER_API_KEY=sk-or-...
export GOOGLE_GENERATIVE_AI_API_KEY=...
export XAI_API_KEY=...

# Then restart OpenClaw
openclaw gateway restart
```

## Security Notes
- NEVER commit API keys to GitHub
- NEVER send keys in chat (except to me for setup — I don't store them)
- Use environment variables, not config files
- The openclaw-backup repo uses a template with placeholder tokens
