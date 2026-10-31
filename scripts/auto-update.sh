#!/usr/bin/env bash
# =============================================================================
#  portfolio-autoupdate.sh
#  Autonomous 24/7 Git Pull, Build, Health-Check & Automatic Rollback
#
#  Usage:
#    ./scripts/auto-update.sh             # Run a single check & update if new commits exist
#    ./scripts/auto-update.sh --check     # Explicit single check (ideal for systemd timer)
#    ./scripts/auto-update.sh --daemon    # Run 24/7 continuous loop (3 times/day = every 8h)
#    ./scripts/auto-update.sh --interval 4h  # Run in daemon mode with custom interval
#    ./scripts/auto-update.sh --force     # Force pull, re-install, build, and verify
#    ./scripts/auto-update.sh --rollback  # Revert immediately to previous good commit
# =============================================================================

set -Eeuo pipefail

# ── Paths & Configuration ────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BRANCH="${AUTOUPDATE_BRANCH:-main}"
REMOTE="${AUTOUPDATE_REMOTE:-origin}"
CHECK_INTERVAL="${AUTOUPDATE_INTERVAL:-28800}" # 28800 seconds = 8 hours (3 times a day)
LOG_FILE="${AUTOUPDATE_LOG:-$REPO_ROOT/logs/auto-update.log}"
LOCK_FILE="/tmp/portfolio-autoupdate.lock"
STATE_FILE="$REPO_ROOT/.last_successful_commit"

# Ensure git trusts this repository directory even under different service users
git config --global --add safe.directory "$REPO_ROOT" 2>/dev/null || true

# Safe directory creation for log file
if ! mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null; then
  LOG_FILE="/tmp/portfolio-autoupdate.log"
fi

# ── Formatting / Logger ──────────────────────────────────────────────────────
timestamp() { date "+%Y-%m-%d %H:%M:%S"; }

log() {
  local msg="[$(timestamp)] [INFO] $*"
  echo -e "\033[34m▸\033[0m $msg"
  echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

ok() {
  local msg="[$(timestamp)] [SUCCESS] $*"
  echo -e "\033[32m✓\033[0m $msg"
  echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

warn() {
  local msg="[$(timestamp)] [WARN] $*"
  echo -e "\033[33m!\033[0m $msg" >&2
  echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

err() {
  local msg="[$(timestamp)] [ERROR] $*"
  echo -e "\033[31m✗ $msg\033[0m" >&2
  echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

# ── Lock Management (Prevent Concurrent Update Instances) ───────────────────
acquire_lock() {
  if ! exec 200>"$LOCK_FILE" 2>/dev/null; then
    LOCK_FILE="/tmp/portfolio-autoupdate-$$.lock"
    exec 200>"$LOCK_FILE"
  fi
  if ! flock -n 200; then
    warn "Another instance of auto-update is currently running. Exiting cleanly."
    exit 0
  fi
}

release_lock() {
  flock -u 200 2>/dev/null || true
}
trap release_lock EXIT

# ── Parse Human Intervals (e.g. 8h -> 28800) ─────────────────────────────────
parse_interval() {
  local val="$1"
  case "$val" in
    *h|*H) echo "$((${val%[hH]} * 3600))" ;;
    *m|*M) echo "$((${val%[mM]} * 60))" ;;
    *s|*S) echo "${val%[sS]}" ;;
    *)     echo "$val" ;;
  esac
}

# ── Health & Verification Check ──────────────────────────────────────────────
verify_application() {
  log "Verifying application build integrity..."
  
  # 1. Verify build output folder exists
  if [[ ! -d "$REPO_ROOT/dist" ]]; then
    err "Health Check Failed: 'dist' directory does not exist."
    return 1
  fi

  # 2. Verify dist/index.html exists and is not empty
  if [[ ! -s "$REPO_ROOT/dist/index.html" ]]; then
    err "Health Check Failed: 'dist/index.html' is missing or 0 bytes."
    return 1
  fi

  # 3. Verify built assets exist (JS & CSS bundles)
  local js_count css_count
  js_count=$(find "$REPO_ROOT/dist/assets" -type f -name "*.js" 2>/dev/null | wc -l)
  css_count=$(find "$REPO_ROOT/dist/assets" -type f -name "*.css" 2>/dev/null | wc -l)

  if [[ "$js_count" -lt 1 || "$css_count" -lt 1 ]]; then
    err "Health Check Failed: Missing JavaScript ($js_count) or CSS ($css_count) bundles in dist/assets."
    return 1
  fi

  # 4. Optional: If production release script exists and running under root/sudo, verify deployment
  if [[ -f "$REPO_ROOT/deploy.sh" && -f "$REPO_ROOT/deploy/deploy.env" && "${EUID}" -eq 0 ]]; then
    log "Triggering production release via deploy.sh..."
    if ! "$REPO_ROOT/deploy.sh" release; then
      err "Health Check Failed: deploy.sh release failed."
      return 1
    fi
  fi

  ok "Application passed all health and verification checks."
  return 0
}

# ── Automatic Rollback ───────────────────────────────────────────────────────
rollback_to() {
  local target_commit="$1"
  err "Initiating automatic rollback to commit: $target_commit"

  cd "$REPO_ROOT"
  git reset --hard "$target_commit" || {
    err "Failed to git reset --hard to $target_commit!"
    return 1
  }

  log "Rebuilding previous good state..."
  if npm run build; then
    ok "Rollback rebuild succeeded. Application successfully recovered to $target_commit."
    if [[ -f "$REPO_ROOT/deploy.sh" && -f "$REPO_ROOT/deploy/deploy.env" && "${EUID}" -eq 0 ]]; then
      "$REPO_ROOT/deploy.sh" release || true
    fi
  else
    err "CRITICAL: Rollback rebuild on $target_commit failed! Manual intervention required."
    return 1
  fi
}

# ── Core Update Logic ────────────────────────────────────────────────────────
check_and_update() {
  local force="${1:-false}"
  cd "$REPO_ROOT"

  # Ensure git tree is not dirty with conflicting untracked files
  if ! git diff --quiet || ! git diff --cached --quiet; then
    warn "Local git modifications detected. Creating temporary safety stash..."
    git stash push -u -m "autoupdate-safety-stash-$(date +%s)" || true
  fi

  log "Checking remote '$REMOTE' for branch '$BRANCH'..."
  if ! git fetch "$REMOTE" "$BRANCH" --quiet; then
    local remote_url
    remote_url=$(git remote get-url "$REMOTE" 2>/dev/null || echo "")
    if [[ "$remote_url" =~ git@github\.com:(.+)\.git ]]; then
      local https_url="https://github.com/${BASH_REMATCH[1]}.git"
      warn "SSH fetch failed. Attempting fallback to public HTTPS ($https_url)..."
      if git fetch "$https_url" "$BRANCH" --quiet; then
        git remote set-url "$REMOTE" "$https_url"
        ok "Switched remote '$REMOTE' to HTTPS for non-interactive 24/7 service."
      else
        err "Failed to fetch from remote '$REMOTE'. Check network or Git credentials."
        return 1
      fi
    else
      err "Failed to fetch from remote '$REMOTE'. Check network or Git credentials."
      return 1
    fi
  fi

  local local_commit remote_commit
  local_commit=$(git rev-parse HEAD)
  remote_commit=$(git rev-parse "$REMOTE/$BRANCH")

  if [[ "$local_commit" == "$remote_commit" && "$force" != "true" ]]; then
    log "Application is already up to date at commit: ${local_commit:0:7}. No action needed."
    return 0
  fi

  log "New commit available!"
  log "Current version : ${local_commit:0:7}"
  log "Target version  : ${remote_commit:0:7}"
  
  # Log new commits summary
  echo "--- Commits to apply ---"
  git log --oneline "${local_commit}..${remote_commit}" || true
  echo "------------------------"

  # Save previous commit as rollback target
  local prev_commit="$local_commit"

  # Check if package.json or lockfile will change
  local deps_changed=false
  if git diff --name-only "$local_commit" "$remote_commit" | grep -E -q '^(package\.json|package-lock\.json)$'; then
    deps_changed=true
  fi

  # Attempt Fast-Forward Pull
  log "Pulling latest changes from $REMOTE/$BRANCH..."
  if ! git pull --ff-only "$REMOTE" "$BRANCH"; then
    err "Fast-forward git pull failed. Repository may have diverged. Aborting update without corrupting state."
    return 1
  fi

  # Re-install dependencies if package files changed
  if [[ "$deps_changed" == "true" ]]; then
    log "Dependencies changed in package.json/package-lock.json. Running npm ci..."
    if ! npm ci --prefer-offline --no-audit; then
      warn "npm ci failed, falling back to npm install..."
      if ! npm install --prefer-offline --no-audit; then
        err "Dependency installation failed!"
        rollback_to "$prev_commit"
        return 1
      fi
    fi
  fi

  # Build the Application
  log "Building production distribution (npm run build)..."
  if ! npm run build; then
    err "Build failed on commit $remote_commit!"
    rollback_to "$prev_commit"
    return 1
  fi

  # Run Health & Verification Checks
  if ! verify_application; then
    err "Integrity verification failed for commit $remote_commit!"
    rollback_to "$prev_commit"
    return 1
  fi

  # Save state & record success
  echo "$remote_commit" > "$STATE_FILE"
  ok "Update completed successfully! Upgraded from ${prev_commit:0:7} to ${remote_commit:0:7}."
  return 0
}

# ── Daemon Mode (Runs 24/7) ──────────────────────────────────────────────────
run_daemon() {
  log "Starting 24/7 auto-update daemon."
  log "Interval: $CHECK_INTERVAL seconds (~$(( CHECK_INTERVAL / 3600 )) hours between checks)."

  while true; do
    log "── Running scheduled repository update check ──"
    check_and_update false || warn "Update check returned with warnings/errors. Will re-try at next interval."
    log "Sleeping for $CHECK_INTERVAL seconds..."
    sleep "$CHECK_INTERVAL" &
    wait $!
  done
}

# ── Manual Rollback Handler ──────────────────────────────────────────────────
handle_manual_rollback() {
  if [[ -f "$STATE_FILE" ]]; then
    local target
    target=$(cat "$STATE_FILE")
    rollback_to "$target"
  else
    local target
    target=$(git rev-parse HEAD~1)
    rollback_to "$target"
  fi
}

# ── CLI Arguments ────────────────────────────────────────────────────────────
main() {
  acquire_lock

  local mode="check"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --daemon|-d)
        mode="daemon"
        shift
        ;;
      --check|-c)
        mode="check"
        shift
        ;;
      --force|-f)
        mode="force"
        shift
        ;;
      --rollback|-r)
        mode="rollback"
        shift
        ;;
      --interval|-i)
        CHECK_INTERVAL=$(parse_interval "$2")
        shift 2
        ;;
      --help|-h)
        echo "Usage: $0 [--check | --daemon | --force | --rollback | --interval <time>]"
        exit 0
        ;;
      *)
        err "Unknown parameter: $1"
        exit 1
        ;;
    esac
  done

  case "$mode" in
    daemon)
      run_daemon
      ;;
    check)
      check_and_update false
      ;;
    force)
      check_and_update true
      ;;
    rollback)
      handle_manual_rollback
      ;;
  esac
}

main "$@"
