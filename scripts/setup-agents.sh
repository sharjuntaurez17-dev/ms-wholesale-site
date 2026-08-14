#!/usr/bin/env bash
# Reinstall the agent tooling for this repo.
#
# ruflo's config (.claude/, .mcp.json, .agents/, CLAUDE.md) is committed, so it
# is already present after a clone — this script installs gstack, which lives
# outside the repo, and verifies ruflo can run.
#
# Safe to re-run. Usage: ./scripts/setup-agents.sh
set -euo pipefail

GSTACK_DIR="${GSTACK_DIR:-$HOME/gstack}"
PW_DIR="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"

log() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

# ---------------------------------------------------------------------------
# Claude Code's remote containers ship a Chromium build under /opt/pw-browsers
# and block cdn.playwright.dev, so gstack's `playwright install chromium` step
# fails. If the shipped build differs from the one gstack's playwright expects,
# expose the local build under the expected revision + directory names so the
# preflight launch check passes instead of trying to download.
# ---------------------------------------------------------------------------
shim_playwright_browser() {
  [ -d "$PW_DIR" ] || return 0

  local installed want
  installed=$(ls -d "$PW_DIR"/chromium-[0-9]* 2>/dev/null | head -1) || true
  [ -n "$installed" ] || return 0

  want=$(node -e '
    try {
      const b = require("'"$GSTACK_DIR"'/node_modules/playwright-core/browsers.json");
      const c = b.browsers.find(x => x.name === "chromium");
      process.stdout.write(c ? c.revision : "");
    } catch (e) { process.stdout.write(""); }
  ' 2>/dev/null) || true
  [ -n "$want" ] || return 0

  [ -d "$PW_DIR/chromium-$want" ] && [ ! -L "$PW_DIR/chromium-$want" ] && return 0
  [ "$(basename "$installed")" = "chromium-$want" ] && return 0

  log "Shimming Chromium $(basename "$installed") -> chromium-$want (cdn.playwright.dev is blocked here)"

  rm -rf "$PW_DIR/chromium-$want" "$PW_DIR/chromium_headless_shell-$want"
  mkdir -p "$PW_DIR/chromium-$want"
  ln -s "$installed/chrome-linux" "$PW_DIR/chromium-$want/chrome-linux64"
  touch "$PW_DIR/chromium-$want/INSTALLATION_COMPLETE" \
        "$PW_DIR/chromium-$want/DEPENDENCIES_VALIDATED"

  local shell_src="$PW_DIR/$(basename "$installed" | sed 's/^chromium-/chromium_headless_shell-/')/chrome-linux"
  if [ -d "$shell_src" ]; then
    local dest="$PW_DIR/chromium_headless_shell-$want/chrome-headless-shell-linux64"
    mkdir -p "$dest"
    for f in "$shell_src"/*; do ln -sf "$f" "$dest/$(basename "$f")"; done
    ln -sf "$shell_src/headless_shell" "$dest/chrome-headless-shell"
    touch "$PW_DIR/chromium_headless_shell-$want/INSTALLATION_COMPLETE" \
          "$PW_DIR/chromium_headless_shell-$want/DEPENDENCIES_VALIDATED"
  fi
}

# ---------------------------------------------------------------------------
# gstack — 55 planning/review/QA/ship skills, registered globally for Claude Code
# ---------------------------------------------------------------------------
log "Installing gstack into $GSTACK_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "gstack needs bun and it is not installed." >&2
  echo "Install it, then re-run: https://bun.sh" >&2
  exit 1
fi

if [ -d "$GSTACK_DIR/.git" ]; then
  git -C "$GSTACK_DIR" pull --ff-only
else
  git clone --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR"
fi

# Build deps first so browsers.json exists for the revision lookup.
( cd "$GSTACK_DIR" && bun install --frozen-lockfile 2>/dev/null || bun install )
shim_playwright_browser

PLAYWRIGHT_BROWSERS_PATH="$PW_DIR" GSTACK_SKIP_FONTS=1 "$GSTACK_DIR/setup" --host claude

# ---------------------------------------------------------------------------
# ruflo — multi-agent orchestration; config is committed, just verify it runs
# ---------------------------------------------------------------------------
log "Verifying ruflo"

if [ ! -d .claude/skills ] || [ ! -f .mcp.json ]; then
  echo "ruflo config missing — running 'ruflo init'" >&2
  npx -y ruflo@latest init --force
fi

npx -y ruflo@latest status >/dev/null 2>&1 \
  && echo "ruflo OK ($(npx -y ruflo@latest --version 2>/dev/null | head -1))" \
  || echo "warning: 'ruflo status' failed — run 'npx ruflo@latest doctor'" >&2

# ---------------------------------------------------------------------------
# ui-ux-pro-max — design intelligence: font pairings, palettes, UX guidelines,
# GSAP presets. Ships ~3.8 MB of CSV data, so it is installed rather than
# vendored (see .gitignore). Also lays down design/, design-system/,
# ui-styling/, brand/, banner-design/ and slides/.
# ---------------------------------------------------------------------------
log "Installing ui-ux-pro-max design skills"

npm install -g ui-ux-pro-max-cli --silent 2>/dev/null || \
  echo "warning: could not install ui-ux-pro-max-cli" >&2

if command -v uipro >/dev/null 2>&1; then
  uipro init --ai claude >/dev/null 2>&1 \
    && echo "ui-ux-pro-max OK ($(uipro --version 2>/dev/null | head -1))" \
    || echo "warning: 'uipro init' failed" >&2
fi

# ---------------------------------------------------------------------------
# Standalone community skills (single-file, fetched straight from GitHub)
# ---------------------------------------------------------------------------
log "Installing standalone design skills"

fetch_skill() {  # $1 = local name, $2 = raw URL
  mkdir -p "$HOME/.claude/skills/$1"
  curl -fsSL "$2" -o "$HOME/.claude/skills/$1/SKILL.md" \
    && echo "  $1" \
    || echo "  warning: $1 failed to download" >&2
}

EMIL=https://raw.githubusercontent.com/emilkowalski/skills/main/skills
for s in apple-design emil-design-eng animate review-animations improve-animations \
         find-animation-opportunities animation-vocabulary pick-ui-library; do
  fetch_skill "$s" "$EMIL/$s/SKILL.md"
done
fetch_skill prototype-variants "$EMIL/prototype/SKILL.md"
fetch_skill taste-web      https://raw.githubusercontent.com/tryproduck/produck-skills/main/skills/taste/SKILL.md
fetch_skill taste-critique https://raw.githubusercontent.com/alebgl77/claude-inc/main/skills/taste/SKILL.md
fetch_skill 21st-dev       https://raw.githubusercontent.com/21st-dev/claude-code-plugin/main/plugins/21st/skills/21st-registry/SKILL.md

# impeccable (pbakaus) — 23 commands + 59 deterministic detector rules, built on
# Anthropic's frontend-design. Cloned rather than fetched: it ships reference
# files and scripts, not a single SKILL.md.
log "Installing impeccable + frontend-design"
_TMP=$(mktemp -d)
if git clone --depth 1 https://github.com/pbakaus/impeccable.git "$_TMP/impeccable" >/dev/null 2>&1; then
  rm -rf "$HOME/.claude/skills/impeccable"
  cp -r "$_TMP/impeccable/.claude/skills/impeccable" "$HOME/.claude/skills/impeccable"
  echo "  impeccable ($(ls "$HOME/.claude/skills/impeccable/reference"/*.md 2>/dev/null | wc -l) reference files)"
else
  echo "  warning: impeccable clone failed" >&2
fi

# Anthropic's frontend-design — the skill impeccable builds on
if git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/skills.git "$_TMP/anthropic" >/dev/null 2>&1; then
  ( cd "$_TMP/anthropic" && git sparse-checkout set skills/frontend-design >/dev/null 2>&1 )
  [ -d "$_TMP/anthropic/skills/frontend-design" ] && \
    cp -r "$_TMP/anthropic/skills/frontend-design" "$HOME/.claude/skills/frontend-design" && \
    echo "  frontend-design"
fi
rm -rf "$_TMP"

# ---------------------------------------------------------------------------
# playwright-cli (Microsoft) — browser automation as skills. More token-frugal
# than Playwright MCP: it does not push the accessibility tree into context.
# ---------------------------------------------------------------------------
log "Installing playwright-cli"

npm install -g @playwright/cli@latest --silent 2>/dev/null || \
  echo "warning: could not install @playwright/cli" >&2

if command -v playwright-cli >/dev/null 2>&1; then
  # 'install --skills' exits non-zero here (workspace init fails) but still
  # writes the skill, so the failure is tolerated.
  playwright-cli install --skills >/dev/null 2>&1 || true

  # The CLI defaults to the Chrome channel at /opt/google/chrome/chrome. In
  # containers that ship only Playwright's Chromium, point the channel at it.
  if [ ! -e /opt/google/chrome/chrome ] && [ -d "$PW_DIR" ]; then
    _CHROME=$(ls -d "$PW_DIR"/chromium-[0-9]*/chrome-linux/chrome 2>/dev/null | head -1)
    if [ -n "$_CHROME" ]; then
      mkdir -p /opt/google/chrome && ln -sf "$_CHROME" /opt/google/chrome/chrome
      echo "  linked chrome channel -> $_CHROME"
    fi
  fi
  echo "playwright-cli OK ($(playwright-cli --version 2>/dev/null | head -1))"
fi

# .playwright/cli.config.json is committed: running as root needs --no-sandbox.

log "Done. gstack skills: $(ls -d "$GSTACK_DIR"/*/SKILL.md 2>/dev/null | wc -l) | ruflo skills: $(ls .claude/skills 2>/dev/null | wc -l)"
