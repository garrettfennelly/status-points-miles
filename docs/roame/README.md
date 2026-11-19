# Roame MCP Setup Report — Gemini OPS

_Prepared 2026-11-19. Status: **endpoint verified; ChatGPT and Codex not yet connected.**_

## Why it stopped here

The task needs a logged-in browser on the Mac mini (Gemini OPS). This session runs in a cloud
container. **No computer was attached to it** (`list_computer_folders` returned no folders),
so I couldn't drive ChatGPT, approve OAuth, or inspect the Mac's automation. Everything below was
verified from Roame's public pages and public OAuth metadata. **No Roame credits were used and no
connection was created.**

## Status summary

| Item | Status |
|---|---|
| Verified MCP endpoint | ✅ `https://routes.roame.travel/mcp` (live: returns `401 invalid_token` without a Bearer token, as expected) |
| Official docs | ✅ https://roame.travel/help/connected-apps (linked from the endpoint's own `resource_documentation`) |
| Auth method | ✅ OAuth 2.1 via Clerk (`https://clerk.roame.travel`): auth code + PKCE (S256), **dynamic client registration supported**, refresh tokens / `offline_access` |
| Roame account authenticated? | ⛔ Unknown: `/settings/connected-apps` redirects to sign-in, which needs your browser session |
| Existing ChatGPT connection to reuse? | ⛔ Unknown: check **Roame → Settings → Connected apps** before adding (avoids duplicates) |
| ChatGPT connection | ⛔ Not started: needs your Mac/browser |
| Codex connection | ⛔ Not started: config prepared below, not applied |
| Credit allowance / usage | ⛔ Unknown until connected (exposed via the `usage:read` scope) |
| Validation search (LAX→HND/NRT, JAL, J/F) | ⛔ Not run |

## What Roame's MCP exposes (OAuth scopes)

| Scope | Capability |
|---|---|
| `docs:read` | Read the Roame member guide |
| `usage:read` | Remaining credits and reset date |
| `search:cached` | Award search against recent cached results (uses credits) |
| `search:live` | Live search across supported programs (slower; uses credits) |
| `alerts:read` | List flight alerts and recent matches (matches cover the **last 2 days**) |
| `alerts:write` | Create, change, and delete alerts on your account |

Roame's documented limits:
- Free and paid members can both connect. Membership sets the **monthly credit allowance**, search limits, and alert slots.
- Searches and alert changes share a **per-minute rate limit**.
- Public pricing: Friends of Roame is $109.99/yr with 10 Super Alerts; Inner Circle is $299.99/yr with 100 Super Alerts. Roame doesn't publish the per-tier MCP credit amounts. Ask `@Roame` for your remaining credits after you connect.
- Roame warns: allow only connections you started, and check the callback domain on the consent page. For ChatGPT it should be an `openai.com`/`chatgpt.com` domain.

## Steps that need you (on the Mac mini)

**A. ChatGPT** (about 3 minutes)
1. Sign in at https://roame.travel/settings/connected-apps. If ChatGPT is already listed, **don't add a second one**. Just test it (step 6).
2. Go to https://chatgpt.com/plugins, click **+**, then **Add custom MCP server**. If it's missing, enable Developer mode under Settings → Apps/Connectors → Advanced. Custom MCP needs a Plus/Pro/Business/Enterprise plan, and workspace accounts may need admin enablement. If neither option exists, that's the blocker. Don't use a workaround.
3. Name: `Roame`. URL: `https://routes.roame.travel/mcp`. Auth: **OAuth** (leave client ID/secret blank; Roame supports dynamic registration).
4. Sign in to Roame with your verified email and complete any MFA. **You** do this; never paste credentials into chat.
5. On Roame's consent page, check the app name and callback domain, then click **Allow**. To keep alerts read-only for now, deny or uncheck `alerts:write` if Roame offers per-scope choice.
6. New chat, run: `@Roame show my connection, remaining credits and reset date.` Then run `@Roame which programs support live award searches?`
7. Only then run the validation search in `prompts.md` (§0).

**B. Codex** (separate integration; connecting ChatGPT does **not** connect Codex)
Run this on the Mac, after checking it doesn't overwrite an existing `roame` entry:
```bash
grep -n "mcp_servers.roame" ~/.codex/config.toml   # must print nothing before you add
codex mcp add roame --url https://routes.roame.travel/mcp   # starts the OAuth browser flow
codex mcp list
```
Or as a manual config entry in `~/.codex/config.toml`:
```toml
[mcp_servers.roame]
url = "https://routes.roame.travel/mcp"
```
then `codex mcp login roame`. I didn't confirm Codex's exact syntax against current Codex docs from here. Run `codex mcp --help` first and check it.

## Gemini OPS integration plan

| Path | Feasible? | Notes |
|---|---|---|
| ChatGPT directly | ✅ Yes | Main path for interactive searches |
| Codex via its own MCP config | ✅ Likely | Separate OAuth grant; shows up as a second app in Roame's Connected apps |
| Existing award-monitoring scripts | ⚠️ Possible | The MCP needs a user OAuth token. Roame's auth server supports the **device-code grant** and refresh tokens, so a script *could* authorize once. That isn't documented as supported for scripts. Ask support@roame.travel before you build it. |
| Scheduled tasks on Gemini OPS | ⚠️ Prefer Roame alerts | Native Roame alerts (`alerts:write`) cost no polling credits and run on Roame's side. Polling searches on a schedule would burn monthly credits. |

I didn't inspect the Mac's existing scripts or launchd/cron jobs because no machine was attached.

## Needs your approval

1. Completing OAuth for ChatGPT, and separately for Codex.
2. Granting `alerts:write`, which lets AI apps create/delete alerts on your account.
3. Running the one validation search, which spends credits.
4. Any new Roame alerts. Paid tiers set the slot count; free shows "Alerts (0/1)".
5. Any change to existing Gemini OPS scheduled jobs or MCP configs.
