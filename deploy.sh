#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  aiameen.online — one-shot deployment for an EC2 (Ubuntu) instance
#
#  Architecture
#    nginx (TLS termination, static SPA, HTTPS-only)
#      └── /api/*.php  →  php-fpm  (mailing system)
#                            └── MySQL (enrollments, contact, quiz audit)
#
#  Usage (run on the EC2 host, as a user with sudo):
#      sudo ./deploy.sh            # full deploy (default)
#      sudo ./deploy.sh provision  # install/refresh system packages
#      sudo ./deploy.sh config     # write env + php + nginx config
#      sudo ./deploy.sh db         # create database/user + apply schema
#      sudo ./deploy.sh build      # npm ci && npm run build  (needs Node)
#      sudo ./deploy.sh release    # copy dist/ + api/ into APP_ROOT
#      sudo ./deploy.sh tls        # obtain/renew the Let's Encrypt certificate
#      sudo ./deploy.sh audit      # npm + composer vulnerability report/fixes
#      sudo ./deploy.sh verify     # post-deploy checklist (services, php, tls, api)
#      sudo ./deploy.sh status     # service + certificate status
#      sudo ./deploy.sh logs       # tail application logs
#
#  Usage (run from your laptop, pushes the repo over SSH then deploys):
#      ./deploy.sh sync
#
#  Auto-generates secure passwords/tokens on first run and writes them to
#  deploy/deploy.env. Re-runs preserve existing values.
# ─────────────────────────────────────────────────────────────────────────────

set -Eeuo pipefail

# ── password/token generators ────────────────────────────────────────────────
generate_password() {
  # 32-char URL-safe password (no special chars that break shell/.env)
  openssl rand -base64 32 | tr -d '/+=' | cut -c1-32
}

generate_token() {
  # 64-char hex token for API/CSRF secrets
  openssl rand -hex 32
}

ensure_deploy_env() {
  local env_file="$ROOT/deploy/deploy.env"
  local example_file="$ROOT/deploy/deploy.env.example"

  # If deploy.env already exists, keep it (user may have customized)
  if [[ -f "$env_file" ]]; then
    return 0
  fi

  # If example doesn't exist, create minimal one
  if [[ ! -f "$example_file" ]]; then
    cat > "$example_file" <<'EXAMPLE'
# aiameen.online deployment configuration
# Copy to deploy.env and edit values as needed.
# This file is auto-populated with secure secrets on first run.

# Domain & TLS
DOMAIN=aiameen.online
LETSENCRYPT_EMAIL=admin@aiameen.online
INCLUDE_WWW=true

# Application paths
APP_ROOT=/var/www/aiameen.online
SITE_USER=www-data
PHP_VERSION=

# Database (auto-generated on first deploy)
DB_NAME=portfolio
DB_USER=portfolio_user
DB_PASS=CHANGE_ME

# MySQL root auth (socket = passwordless via unix_socket; password = with root password)
MYSQL_ROOT_AUTH=socket
MYSQL_ROOT_PASSWORD=

# Mail configuration
MAIL_TO=admin@aiameen.online
MAIL_FROM_EMAIL=no-reply@aiameen.online
MAIL_FROM_NAME=aiameen.online
MAIL_TRANSPORT=mail
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_ENCRYPTION=tls
SMTP_DEBUG=0

# Security secrets (auto-generated)
QUIZ_SECRET=CHANGE_ME
RATE_LIMIT_PER_MINUTE=20
ALLOWED_ORIGINS=https://aiameen.online

# Operational
ENABLE_UFW=true
CREATE_SWAP=true
SKIP_BUILD=false
SSH_PORT=22

# npm audit
NPM_AUDIT_FIX=true
NPM_AUDIT_FIX_FORCE=false

# Remote sync (for laptop → server deploy)
DEPLOY_HOST=
DEPLOY_PATH=
DEPLOY_SSH_KEY=
EXAMPLE
    log "created $example_file template"
  fi

  # Copy example to deploy.env
  cp "$example_file" "$env_file"

  # Generate secure values
  local db_pass quiz_secret quiz_token
  db_pass="$(generate_password)"
  quiz_secret="$(generate_token)"
  quiz_token="$(generate_token)"

  # Replace placeholders in deploy.env
  sed -i \
    -e "s/^DB_PASS=.*/DB_PASS=$db_pass/" \
    -e "s/^QUIZ_SECRET=.*/QUIZ_SECRET=$quiz_secret/" \
    -e "s/^DB_NAME=.*/DB_NAME=portfolio/" \
    -e "s/^DB_USER=.*/DB_USER=portfolio_user/" \
    "$env_file"

  # Also create a separate API token file for the PHP app
  local api_token_file="/etc/aiameen/api_token"
  mkdir -p /etc/aiameen
  echo "$quiz_token" > "$api_token_file"
  chmod 600 "$api_token_file"
  chown root:www-data "$api_token_file" 2>/dev/null || true

  log "generated deploy.env with secure passwords:"
  log "  DB_PASS=$db_pass"
  log "  QUIZ_SECRET=$quiz_secret"
  log "  API_TOKEN written to $api_token_file"
  log "  (edit deploy/deploy.env to customize)"
}

# ── pretty output ────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  C_RESET='\033[0m'; C_BOLD='\033[1m'; C_BLUE='\033[34m'; C_GREEN='\033[32m'; C_YELLOW='\033[33m'; C_RED='\033[31m'
else
  C_RESET=''; C_BOLD=''; C_BLUE=''; C_GREEN=''; C_YELLOW=''; C_RED=''
fi
log()  { printf "${C_BLUE}${C_BOLD}▸${C_RESET} %s\n" "$*"; }
ok()   { printf "${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YELLOW}!${C_RESET} %s\n" "$*" >&2; }
die()  { printf "${C_RED}✗ %s${C_RESET}\n" "$*" >&2; exit 1; }
step() { printf "\n${C_BOLD}${C_BLUE}══ %s ══${C_RESET}\n" "$*"; }

trap 'die "aborted on line $LINENO"' ERR

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$ROOT/deploy/deploy.env"

require_root() { [[ "${EUID}" -eq 0 ]] || die "run as root:  sudo ./deploy.sh $COMMAND"; }

load_config() {
  ensure_deploy_env
  [[ -f "$CONFIG" ]] || die "missing $CONFIG — run:  cp deploy/deploy.env.example deploy/deploy.env  and edit it"
  set -a
  # shellcheck disable=SC1090
  source "$CONFIG"
  set +a

  : "${DOMAIN:?set DOMAIN in deploy/deploy.env}"
  INCLUDE_WWW="${INCLUDE_WWW:-true}"
  WWW_DOMAIN="${WWW_DOMAIN:-www.$DOMAIN}"
  [[ "$INCLUDE_WWW" == "true" ]] || WWW_DOMAIN=""

  : "${LETSENCRYPT_EMAIL:?set LETSENCRYPT_EMAIL in deploy/deploy.env}"
  APP_ROOT="${APP_ROOT:-/var/www/$DOMAIN}"
  SITE_USER="${SITE_USER:-www-data}"
  PHP_VERSION="${PHP_VERSION:-}"

  : "${DB_NAME:?}"; : "${DB_USER:?}"; : "${DB_PASS:?}"
  DB_HOST="${DB_HOST:-127.0.0.1}"; DB_PORT="${DB_PORT:-3306}"

  MAIL_TO="${MAIL_TO:-}"; MAIL_FROM_EMAIL="${MAIL_FROM_EMAIL:-no-reply@$DOMAIN}"
  MAIL_FROM_NAME="${MAIL_FROM_NAME:-$DOMAIN}"; MAIL_TRANSPORT="${MAIL_TRANSPORT:-mail}"
  SMTP_HOST="${SMTP_HOST:-}"; SMTP_PORT="${SMTP_PORT:-587}"; SMTP_USER="${SMTP_USER:-}"
  SMTP_PASS="${SMTP_PASS:-}"; SMTP_ENCRYPTION="${SMTP_ENCRYPTION:-tls}"; SMTP_DEBUG="${SMTP_DEBUG:-0}"
  QUIZ_SECRET="${QUIZ_SECRET:-}"; RATE_LIMIT_PER_MINUTE="${RATE_LIMIT_PER_MINUTE:-20}"
  ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-https://$DOMAIN}"
  ENABLE_UFW="${ENABLE_UFW:-true}"; CREATE_SWAP="${CREATE_SWAP:-true}"
  SKIP_BUILD="${SKIP_BUILD:-false}"; SSH_PORT="${SSH_PORT:-22}"
  NPM_AUDIT_FIX="${NPM_AUDIT_FIX:-true}"
  NPM_AUDIT_FIX_FORCE="${NPM_AUDIT_FIX_FORCE:-false}"
}

# ── helpers ──────────────────────────────────────────────────────────────────
detect_php_socket() {
  if [[ -n "$PHP_VERSION" ]]; then
    PHP_SOCK="/run/php/php${PHP_VERSION}-fpm.sock"
  else
    PHP_SOCK="$(ls /run/php/php*-fpm.sock 2>/dev/null | head -n1 || true)"
    [[ -n "$PHP_SOCK" ]] && PHP_VERSION="$(basename "$PHP_SOCK" | sed -E 's/php([0-9.]+)-fpm.sock/\1/')"
  fi
  [[ -n "${PHP_SOCK:-}" && -S "$PHP_SOCK" ]] || die "php-fpm socket not found (tried $PHP_SOCK). Is php-fpm installed/running?"
}

mysql_root() {
  if [[ "${MYSQL_ROOT_AUTH:-socket}" == "password" && -n "${MYSQL_ROOT_PASSWORD:-}" ]]; then
    mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$@"
  else
    mysql "$@"
  fi
}

check() { # check <label> <command...>
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf "  ${C_GREEN}✓${C_RESET} %s\n" "$label"; return 0
  fi
  printf "  ${C_RED}✗${C_RESET} %s\n" "$label"; return 1
}

render() { # render <template> <destination>
  local src="$1" dst="$2"
  sed \
    -e "s|__DOMAIN__|$DOMAIN|g" \
    -e "s|__WWW_DOMAIN__|$WWW_DOMAIN|g" \
    -e "s|__CERT_NAME__|$DOMAIN|g" \
    -e "s|__APP_ROOT__|$APP_ROOT|g" \
    -e "s|__PHP_SOCK__|$PHP_SOCK|g" \
    "$src" > "$dst"
  if [[ "$INCLUDE_WWW" != "true" ]]; then
    sed -i '/# >>> WWW_REDIRECT/,/# <<< WWW_REDIRECT/d' "$dst"
  fi
}

cert_exists() { [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; }

install_nginx_site() { # install_nginx_site [auto|full]
  local mode="${1:-auto}"
  detect_php_socket
  local avail="/etc/nginx/sites-available/$DOMAIN"
  if [[ "$mode" == "full" ]] || { [[ "$mode" == "auto" ]] && cert_exists; }; then
    render "$ROOT/deploy/nginx/aiameen.online.conf.template" "$avail"
    log "installed full HTTPS nginx config"
  else
    render "$ROOT/deploy/nginx/bootstrap-http.conf.template" "$avail"
    log "installed HTTP-only bootstrap nginx config (certificate pending)"
  fi
  ln -sf "$avail" "/etc/nginx/sites-enabled/$DOMAIN"
  rm -f /etc/nginx/sites-enabled/default
  nginx -t || die "nginx configuration test failed"
  systemctl reload nginx 2>/dev/null || systemctl restart nginx
}

write_api_env() {
  local dir="/etc/aiameen"
  mkdir -p "$dir" /var/log/aiameen

  # Read API token if generated
  local api_token=""
  [[ -f "$dir/api_token" ]] && api_token="$(cat "$dir/api_token")"

  cat > "$dir/api.env" <<ENV
# Managed by deploy.sh — do not edit by hand.
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS

MAIL_TO=$MAIL_TO
MAIL_FROM_EMAIL=$MAIL_FROM_EMAIL
MAIL_FROM_NAME=$MAIL_FROM_NAME
MAIL_TRANSPORT=$MAIL_TRANSPORT
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
SMTP_ENCRYPTION=$SMTP_ENCRYPTION
SMTP_DEBUG=$SMTP_DEBUG

QUIZ_SECRET=$QUIZ_SECRET
API_TOKEN=$api_token
RATE_LIMIT_PER_MINUTE=$RATE_LIMIT_PER_MINUTE
ALLOWED_ORIGINS=$ALLOWED_ORIGINS
LOG_DIR=/var/log/aiameen
ENV
  chown root:"$SITE_USER" "$dir/api.env"
  chmod 640 "$dir/api.env"
  ok "wrote $dir/api.env"
}

# ─────────────────────────────────────────────────────────────────────────────
#  commands
# ─────────────────────────────────────────────────────────────────────────────
cmd_provision() {
  require_root
  step "Provisioning system packages"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y \
    nginx mysql-server ca-certificates curl git rsync unzip jq openssl ufw \
    php-fpm php-cli php-mysql php-mbstring php-curl php-xml php-zip php-opcache \
    certbot

  if [[ "$CREATE_SWAP" == "true" ]] && ! swapon --show | grep -q .; then
    log "creating 2G swapfile (safer builds on small instances)"
    fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
    grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi

  if [[ "$SKIP_BUILD" != "true" ]]; then
    local node_major=0
    command -v node >/dev/null && node_major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
    if (( node_major < 18 )); then
      log "installing Node.js 20.x (needed to build the SPA)"
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    fi
  fi

  if ! command -v composer >/dev/null; then
    log "installing Composer (PHP mailer dependency)"
    curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  fi

  systemctl enable --now nginx >/dev/null 2>&1 || true
  systemctl enable --now mysql >/dev/null 2>&1 || systemctl enable --now mysqld >/dev/null 2>&1 || true
  # enable whichever php-fpm service exists
  for svc in /lib/systemd/system/php*-fpm.service; do
    [[ -e "$svc" ]] && systemctl enable --now "$(basename "$svc")" >/dev/null 2>&1 || true
  done

  if [[ "$ENABLE_UFW" == "true" ]] && command -v ufw >/dev/null; then
    ufw allow "${SSH_PORT}/tcp" >/dev/null || true
    ufw allow 'Nginx Full' >/dev/null || true
    ufw --force enable >/dev/null || true
    ok "ufw enabled (SSH ${SSH_PORT}, Nginx Full)"
  fi

  ok "packages installed"
}

cmd_config() {
  require_root
  step "Writing configuration"
  detect_php_socket

  mkdir -p "/etc/aiameen" /var/log/aiameen "$APP_ROOT/public" "$APP_ROOT/api" /var/www/certbot

  # Ensure API token exists (created by ensure_deploy_env on first run)
  if [[ ! -f /etc/aiameen/api_token ]]; then
    generate_token > /etc/aiameen/api_token
    chmod 600 /etc/aiameen/api_token
    chown root:"$SITE_USER" /etc/aiameen/api_token 2>/dev/null || true
    ok "generated API token"
  fi

  write_api_env

  # PHP hardening/limits
  for sapi in /etc/php/*/fpm/conf.d /etc/php/*/cli/conf.d; do
    [[ -d "$sapi" ]] && cp "$ROOT/deploy/php/99-aiameen.ini" "$sapi/99-aiameen.ini"
  done
  chown -R "$SITE_USER":"$SITE_USER" /var/log/aiameen
  ok "installed PHP ini"

  install_nginx_site
}

cmd_db() {
  require_root
  step "Configuring MySQL"
  [[ "$DB_PASS" != *"'"* && "$DB_PASS" != *"\\"* ]] || die "DB_PASS must not contain single quotes or backslashes"

  # Generate MySQL root password if using password auth and not set
  if [[ "${MYSQL_ROOT_AUTH:-socket}" == "password" && -z "${MYSQL_ROOT_PASSWORD:-}" ]]; then
    MYSQL_ROOT_PASSWORD="$(generate_password)"
    log "generated MySQL root password: $MYSQL_ROOT_PASSWORD"
    # Save it to deploy.env for future runs
    sed -i "s/^MYSQL_ROOT_PASSWORD=.*/MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD/" "$CONFIG"
  fi

  mysql_root <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';
ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
ALTER USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

  mysql_root "$DB_NAME" < "$ROOT/deploy/mysql/schema.sql"
  ok "database '$DB_NAME' ready (user '$DB_USER')"

  # Apply incremental migrations. --force keeps re-runs safe by continuing past
  # "already applied" DDL errors (e.g. duplicate column on a guarded ALTER).
  if compgen -G "$ROOT/deploy/mysql/migrations/*.sql" >/dev/null; then
    for migration in "$ROOT"/deploy/mysql/migrations/*.sql; do
      mysql_root --force "$DB_NAME" < "$migration" >/dev/null 2>&1 || true
    done
    ok "migrations applied"
  fi

  # Seed structured course content when the API env + PHP are available.
  if [[ -f /etc/aiameen/api.env ]] && command -v php >/dev/null 2>&1; then
    php "$ROOT/api/tools/seed_content.php" >/dev/null 2>&1 \
      && ok "course content seeded" \
      || warn "course content seed skipped (run: sudo php api/tools/seed_content.php)"
  else
    warn "content seed skipped — run 'sudo ./deploy.sh config' then 'php api/tools/seed_content.php'"
  fi
}

cmd_build() {
  step "Building the SPA"
  if [[ "$SKIP_BUILD" == "true" ]]; then
    warn "SKIP_BUILD=true — reusing existing $ROOT/dist"
    [[ -d "$ROOT/dist" ]] || die "no dist/ directory to reuse"
    return
  fi
  command -v npm >/dev/null || die "npm not found (install Node.js 18+, or set SKIP_BUILD=true)"
  cd "$ROOT"
  if [[ -f package-lock.json ]]; then npm ci; else npm install; fi

  # Auto-patch npm vulnerabilities. `npm audit fix` only applies fixes allowed
  # by the semver ranges in package.json (non-breaking). --force is opt-in.
  if [[ "$NPM_AUDIT_FIX" == "true" ]]; then
    log "npm audit fix (non-breaking security patches)"
    npm audit fix --audit-level=high || warn "npm audit fix could not resolve everything (run: sudo ./deploy.sh audit)"
    if [[ "$NPM_AUDIT_FIX_FORCE" == "true" ]]; then
      warn "NPM_AUDIT_FIX_FORCE=true — applying potentially breaking fixes"
      npm audit fix --force || true
    fi
  fi

  NODE_OPTIONS="--max-old-space-size=768" npm run build
  [[ -f "$ROOT/dist/index.html" ]] || die "build produced no dist/index.html"
  ok "built dist/"
}

cmd_release() {
  require_root
  step "Releasing to $APP_ROOT"
  [[ -d "$ROOT/dist" ]] || die "no dist/ — run './deploy.sh build' first"

  mkdir -p "$APP_ROOT/public" "$APP_ROOT/api" /var/log/aiameen

  rsync -a --delete "$ROOT/dist/" "$APP_ROOT/public/"

  rsync -a --delete \
    --exclude '.env' --exclude '.env.example' --exclude 'vendor/' --exclude 'tmp-logs/' \
    "$ROOT/api/" "$APP_ROOT/api/"

  if command -v composer >/dev/null && [[ -f "$APP_ROOT/api/composer.json" ]]; then
    log "composer install (PHPMailer)"
    ( cd "$APP_ROOT/api" && composer install --no-dev --no-interaction --optimize-autoloader --quiet ) \
      || warn "composer install failed — the API will fall back to mail(). Check network."
  fi

  chown -R "$SITE_USER":"$SITE_USER" "$APP_ROOT" /var/log/aiameen
  find "$APP_ROOT" -type d -exec chmod 755 {} \;
  find "$APP_ROOT" -type f -exec chmod 644 {} \;

  systemctl reload php*-fpm 2>/dev/null || true
  ok "released"
}

cmd_tls() {
  require_root
  step "Obtaining TLS certificate (Let's Encrypt)"
  mkdir -p /var/www/certbot

  # ensure nginx is serving :80 for the HTTP-01 challenge
  install_nginx_site

  local domains=(-d "$DOMAIN")
  [[ "$INCLUDE_WWW" == "true" ]] && domains+=(-d "$WWW_DOMAIN")

  if cert_exists; then
    log "certificate already present — checking for renewal"
    certbot renew --quiet --deploy-hook "systemctl reload nginx" || true
  else
    certbot certonly --webroot -w /var/www/certbot \
      "${domains[@]}" \
      --email "$LETSENCRYPT_EMAIL" --agree-tos --no-eff-email \
      --non-interactive --keep-until-expiring
  fi

  systemctl enable --now certbot.timer >/dev/null 2>&1 || true
  install_nginx_site full
  ok "HTTPS enabled for $DOMAIN"
}

cmd_status() {
  require_root
  step "Service status"
  for svc in nginx mysql; do
    printf "  %-12s %s\n" "$svc" "$(systemctl is-active "$svc" 2>/dev/null || echo unknown)"
  done
  for sock in /run/php/php*-fpm.sock; do
    [[ -S "$sock" ]] && printf "  %-12s %s\n" "php-fpm" "active ($sock)"
  done
  echo
  command -v certbot >/dev/null && certbot certificates 2>/dev/null | grep -E "Certificate Name|Domains|Expiry" || warn "certbot not installed"
  echo
  df -h / | tail -1
}

cmd_logs() {
  require_root
  step "Tailing logs (Ctrl-C to stop)"
  local files=(/var/log/nginx/error.log /var/log/nginx/access.log /var/log/aiameen/*.jsonl /var/log/aiameen/php-error.log)
  tail -n 30 -F "${files[@]}"
}

cmd_audit() {
  step "Dependency security audit"
  command -v npm >/dev/null || die "npm not found (needed for npm audit)"
  cd "$ROOT"

  log "npm audit — production dependencies"
  npm audit --omit=dev --audit-level=high || warn "high/critical vulnerabilities in production dependencies"

  log "npm audit — all dependencies"
  npm audit --audit-level=high || warn "high/critical vulnerabilities (including dev dependencies)"

  if [[ "$NPM_AUDIT_FIX" == "true" ]]; then
    log "applying non-breaking fixes (npm audit fix)"
    npm audit fix || warn "some advisories require manual major upgrades"
    if [[ "$NPM_AUDIT_FIX_FORCE" == "true" ]]; then
      warn "applying potentially breaking fixes (npm audit fix --force)"
      npm audit fix --force || true
    fi
  fi

  if command -v composer >/dev/null && [[ -f "$ROOT/api/composer.json" ]]; then
    log "composer audit — PHP dependencies"
    ( cd "$ROOT/api" && composer audit --no-dev ) || warn "composer audit reported advisories"
  fi
  ok "audit complete"
}

cmd_verify() {
  require_root
  step "Deployment checklist"
  local failures=0 code health

  # ── services ──
  check "nginx service is active" systemctl is-active --quiet nginx || failures=$((failures + 1))
  check "MySQL service is active" bash -c 'systemctl is-active --quiet mysql || systemctl is-active --quiet mysqld' || failures=$((failures + 1))
  check "php-fpm is running (socket present)" bash -c 'ls /run/php/php*-fpm.sock >/dev/null 2>&1' || failures=$((failures + 1))

  # ── php extensions required by the API / mailer ──
  for ext in pdo_mysql openssl mbstring curl dom zip opcache; do
    check "php extension: $ext" php -r "exit(extension_loaded('$ext') ? 0 : 1);" || failures=$((failures + 1))
  done

  # ── configuration ──
  check "api env exists with 640 perms" bash -c '[[ "$(stat -c %a /etc/aiameen/api.env)" == "640" ]]' || failures=$((failures + 1))
  check "nginx config test passes" nginx -t || failures=$((failures + 1))
  if [[ "$CREATE_SWAP" == "true" ]]; then
    check "swap is active" bash -c 'swapon --show | grep -q .' || failures=$((failures + 1))
  fi

  # ── HTTP behaviour ──
  code="$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $DOMAIN" "http://127.0.0.1/" || echo 000)"
  check "HTTP :80 redirects to HTTPS (301)" bash -c "[[ '$code' == 301 ]]" || failures=$((failures + 1))
  code="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: $DOMAIN" "https://127.0.0.1/" || echo 000)"
  check "HTTPS site responds 200" bash -c "[[ '$code' == 200 ]]" || failures=$((failures + 1))

  # ── API + database ──
  health="$(curl -sk -H "Host: $DOMAIN" "https://127.0.0.1/api/health.php" 2>/dev/null || true)"
  printf "  · API health: %s\n" "${health:-unreachable}"
  if echo "$health" | grep -q '"database":"up"'; then
    ok "database reachable from the API"
  else
    warn "API reported the database is down"; failures=$((failures + 1))
  fi

  # ── TLS certificate ──
  if cert_exists; then
    local expiry
    expiry="$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" | cut -d= -f2)"
    ok "TLS certificate present (expires: $expiry)"
  else
    warn "no TLS certificate yet (run: sudo ./deploy.sh tls)"; failures=$((failures + 1))
  fi

  echo
  if (( failures == 0 )); then
    ok "All checklist items passed — https://$DOMAIN is live"
  else
    warn "$failures checklist item(s) need attention"
    return 1
  fi
}

print_credentials() {
  echo
  step "Generated Credentials (save these securely!)"
  printf "  ${C_BOLD}Database:${C_RESET}\n"
  printf "    Name:     %s\n" "$DB_NAME"
  printf "    User:     %s\n" "$DB_USER"
  printf "    Password: %s\n" "$DB_PASS"
  if [[ "${MYSQL_ROOT_AUTH:-socket}" == "password" && -n "${MYSQL_ROOT_PASSWORD:-}" ]]; then
    printf "    Root PW:  %s\n" "$MYSQL_ROOT_PASSWORD"
  fi
  printf "\n"
  printf "  ${C_BOLD}API / App:${C_RESET}\n"
  printf "    QUIZ_SECRET: %s\n" "$QUIZ_SECRET"
  [[ -f /etc/aiameen/api_token ]] && printf "    API_TOKEN:   %s\n" "$(cat /etc/aiameen/api_token)"
  printf "\n"
  printf "  ${C_YELLOW}These values are stored in deploy/deploy.env and /etc/aiameen/api.env${C_RESET}\n"
  printf "  ${C_YELLOW}Copy them to your password manager now!${C_RESET}\n"
  echo
}

cmd_deploy() {
  require_root
  cmd_provision
  cmd_config
  cmd_db
  cmd_build
  cmd_release
  cmd_tls
  if cmd_verify; then
    print_credentials
    echo; ok "Deployment complete → https://$DOMAIN"
  else
    print_credentials
    echo; warn "Deployment completed with warnings — review the checklist above"
  fi
}

cmd_sync() {
  : "${DEPLOY_HOST:?set DEPLOY_HOST in deploy/deploy.env for 'sync'}"
  : "${DEPLOY_PATH:?set DEPLOY_PATH in deploy/deploy.env for 'sync'}"
  local key="${DEPLOY_SSH_KEY:-}"
  [[ -n "$key" ]] && key="${key/#\~/$HOME}"
  local ssh_opt=(-o StrictHostKeyChecking=accept-new)
  [[ -n "$key" ]] && ssh_opt+=(-i "$key")

  step "Syncing repository → $DEPLOY_HOST:$DEPLOY_PATH"
  ssh "${ssh_opt[@]}" "$DEPLOY_HOST" "mkdir -p '$DEPLOY_PATH'"
  rsync -az --delete -e "ssh ${ssh_opt[*]}" \
    --exclude '.git' --exclude 'node_modules' --exclude 'dist' \
    "$ROOT/" "$DEPLOY_HOST:$DEPLOY_PATH/"
  ok "source synced"

  step "Running remote deploy"
  ssh "${ssh_opt[@]}" "$DEPLOY_HOST" "cd '$DEPLOY_PATH' && sudo bash deploy.sh deploy"
  ok "remote deployment finished"
}

cmd_rotate_secrets() {
  require_root
  step "Rotating secrets (generates new passwords/tokens)"
  local env_file="$ROOT/deploy/deploy.env"

  # Backup old
  cp "$env_file" "$env_file.bak.$(date +%s)"

  # Generate new
  local db_pass quiz_secret api_token
  db_pass="$(generate_password)"
  quiz_secret="$(generate_token)"
  api_token="$(generate_token)"

  # Update deploy.env
  sed -i \
    -e "s/^DB_PASS=.*/DB_PASS=$db_pass/" \
    -e "s/^QUIZ_SECRET=.*/QUIZ_SECRET=$quiz_secret/" \
    "$env_file"

  # Update MySQL user password
  mysql_root "$DB_NAME" -e "ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$db_pass'; ALTER USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$db_pass'; FLUSH PRIVILEGES;"
  ok "rotated database password"

  # Update API token
  echo "$api_token" > /etc/aiameen/api_token
  chmod 600 /etc/aiameen/api_token
  chown root:"$SITE_USER" /etc/aiameen/api_token 2>/dev/null || true
  ok "rotated API token"

  # Reload configs
  write_api_env
  systemctl reload php*-fpm 2>/dev/null || true
  systemctl reload nginx 2>/dev/null || true

  log "Secrets rotated. Update any external services using the old credentials."
  print_credentials
}

usage() {
  cat <<'USAGE'
aiameen.online deployment (nginx + php-fpm + MySQL on EC2)

  Run ON the server:
    sudo ./deploy.sh              full deploy (provision, config, db, build, release, tls)
    sudo ./deploy.sh provision    install/refresh system packages
    sudo ./deploy.sh config       write api env, php ini, nginx site
    sudo ./deploy.sh db           create database/user + apply schema
    sudo ./deploy.sh build        npm ci && npm run build
    sudo ./deploy.sh release      copy dist/ + api/ into APP_ROOT
    sudo ./deploy.sh tls          obtain/renew the Let's Encrypt certificate
    sudo ./deploy.sh audit        npm + composer vulnerability report/fixes
    sudo ./deploy.sh verify       run the post-deploy checklist
    sudo ./deploy.sh status       service + certificate status
    sudo ./deploy.sh logs         tail application logs
    sudo ./deploy.sh rotate-secrets  rotate DB password, QUIZ_SECRET, API token

  Run FROM your laptop (pushes the repo over SSH, then deploys):
    ./deploy.sh sync

  Configuration: copy deploy/deploy.env.example → deploy/deploy.env and edit.
  On first run, secure passwords/tokens are auto-generated and saved to deploy/deploy.env.
USAGE
  exit 0
}

# ─────────────────────────────────────────────────────────────────────────────
main() {
  COMMAND="${1:-deploy}"
  case "$COMMAND" in
    -h|--help|help) usage ;;
  esac
  load_config
  case "$COMMAND" in
    deploy)    cmd_deploy ;;
    provision) cmd_provision ;;
    config)    cmd_config ;;
    db)        cmd_db ;;
    build)     cmd_build ;;
    release)   cmd_release ;;
    tls)       cmd_tls ;;
    audit)     cmd_audit ;;
    verify)    cmd_verify ;;
    status)    cmd_status ;;
    logs)      cmd_logs ;;
    sync)      cmd_sync ;;
    rotate-secrets) cmd_rotate_secrets ;;
    *)         die "unknown command '$COMMAND' (try: ./deploy.sh help)" ;;
  esac
}

main "$@"
