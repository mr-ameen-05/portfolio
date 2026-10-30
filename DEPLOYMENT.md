# Deploying aiameen.online to AWS EC2

This document describes the production architecture and the one-command
deployment flow for **https://aiameen.online**.

```
                    ┌───────────────────────────────────────────────┐
   Internet ──443──▶│  nginx  (TLS termination, HTTP→HTTPS 301)      │
        ────80────▶ │    • serves the built React SPA (dist/)        │
                    │    • /api/<name>.php  ──▶  php-fpm (mailing)   │
                    └───────────────────────────┬───────────────────┘
                                                 │ PDO
                                        ┌────────▼────────┐
                                        │   MySQL 8       │
                                        │  contact /      │
                                        │  enrollments /  │
                                        │  quiz audit     │
                                        └─────────────────┘
```

| Component | Role |
|-----------|------|
| **nginx** | TLS termination, HTTPS-only redirect, serves `dist/`, routes `/api/*.php` to PHP-FPM |
| **php-fpm** | Runs the PHP mailing API (contact, enrollment, quiz, health) |
| **MySQL** | Stores contact messages, course enrollments and quiz attempts |
| **Postfix/SMTP** | Outbound mail — uses your SMTP provider (Amazon SES, Gmail …) |

---

## 1. Create the EC2 instance

1. Launch **Ubuntu 22.04 or 24.04 LTS** (`t3.small` / 2 GB RAM recommended — a
   `t2.micro` works but the build adds swap automatically).
2. **Security group — inbound rules:**

   | Type | Port | Source | Purpose |
   |------|------|--------|---------|
   | SSH | 22 | *your IP* | administration |
   | HTTP | 80 | `0.0.0.0/0` | ACME challenge + HTTPS redirect |
   | HTTPS | 443 | `0.0.0.0/0` | the site |

   Do **not** open 3306 (MySQL) to the internet.
3. Allocate an **Elastic IP** and associate it with the instance so the address
   survives reboots.
4. Point DNS **A records** at that Elastic IP:

   ```
   aiameen.online       A    <elastic-ip>
   www.aiameen.online   A    <elastic-ip>
   ```

   Wait for DNS to propagate (`dig +short aiameen.online`) before running the
   TLS step — Let's Encrypt validates over HTTP.

---

## 2. Configure

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@<elastic-ip>

git clone <your-repo-url> ~/portfolio     # or use `./deploy.sh sync` from your laptop
cd ~/portfolio
cp deploy/deploy.env.example deploy/deploy.env
nano deploy/deploy.env                     # fill in secrets (see below)
```

Required values in `deploy/deploy.env`:

| Variable | Notes |
|----------|-------|
| `LETSENCRYPT_EMAIL` | your email, for certificate expiry notices |
| `DB_PASS` | strong password; avoid `'` and `\` |
| `MAIL_TO` | where notifications are delivered |
| `SMTP_HOST/USER/PASS` | your SMTP provider |
| `QUIZ_SECRET` | long random string (`openssl rand -hex 32`) |

### Mail on AWS (important)

EC2 **blocks outbound port 25** by default, so PHP `mail()` through a local MTA
usually will not deliver. Use authenticated SMTP on 587/465:

* **Amazon SES** — verify `aiameen.online` (DomainKey/SPF), create SMTP
  credentials, and set `SMTP_HOST=email-smtp.<region>.amazonaws.com`.
  *While in the SES sandbox you can only send to verified addresses — request
  production access, or verify `MAIL_TO`.*
* **Gmail** — an App Password with `SMTP_HOST=smtp.gmail.com`,
  `SMTP_PORT=587`. The `From` address must match the authenticated account.
* Set `MAIL_TRANSPORT=mail` only if you deliberately run a local MTA and have
  requested the port-25 unblock from AWS.

Also add these DNS records so mail is not marked as spam:

```
SPF   TXT  "v=spf1 include:amazonses.com -all"
DKIM TXT  <provided by your SMTP provider>
DMARC TXT "v=DMARC1; p=quarantine; rua=mailto:you@aiameen.online"
```

---

## 3. Deploy

```bash
sudo ./deploy.sh
```

This runs, in order:

1. **provision** – nginx, MySQL, php-fpm, PHP extensions, certbot, Composer, Node.js 20, swap, ufw
2. **config** – writes `/etc/aiameen/api.env`, PHP hardening, the nginx site
3. **db** – creates the database + user and applies `deploy/mysql/schema.sql`
4. **build** – `npm ci && npm run build` → `dist/`
5. **release** – copies `dist/` and `api/` into `/var/www/aiameen.online`, runs `composer install`
6. **tls** – issues the Let's Encrypt certificate and enables auto-renewal
7. **verify** – local health checks

When it finishes, open **https://aiameen.online** — HTTP is 301-redirected to
HTTPS and `www` redirects to the apex domain.

Individual steps can be re-run safely (they are idempotent):

```bash
sudo ./deploy.sh release     # after changing frontend/PHP code
sudo ./deploy.sh config      # after editing deploy.env
sudo ./deploy.sh tls         # renew
```

### Deploying from your laptop

Instead of SSH-ing and pulling, push the working tree and deploy remotely:

```bash
# in deploy/deploy.env set DEPLOY_HOST / DEPLOY_SSH_KEY / DEPLOY_PATH
./deploy.sh sync
```

### Post-deploy checklist

`sudo ./deploy.sh verify` runs all of the automated checks; here is what it
confirms (plus the manual follow-ups it can't do from the box):

| # | Check | Expected |
|---|-------|----------|
| 1 | `nginx` service | active |
| 2 | `mysql` service | active |
| 3 | `php-fpm` socket | present |
| 4 | PHP extensions `pdo_mysql`, `openssl`, `mbstring`, `curl`, `dom`, `zip`, `opcache` | loaded |
| 5 | `/etc/aiameen/api.env` | present, mode `640` |
| 6 | `nginx -t` | syntax OK |
| 7 | swap (when `CREATE_SWAP=true`) | active |
| 8 | `http://aiameen.online` | `301` → https |
| 9 | `https://aiameen.online` | `200` |
| 10 | `https://aiameen.online/api/health.php` | `200`, `"database":"up"` |
| 11 | TLS certificate | present, prints expiry |

Manual follow-ups:

- Submit the contact form; confirm delivery in `sudo tail -f /var/log/aiameen/mail.jsonl`.
- Enroll in the course; confirm a row lands in `course_enrollments`.
- Confirm auto-renewal: `systemctl status certbot.timer`.
- Add SPF/DKIM/DMARC DNS records for deliverability.

### What deploy.sh installs

`sudo ./deploy.sh provision` installs everything the stack needs:

| Layer | Packages / tools |
|-------|------------------|
| Web server | `nginx` |
| Database | `mysql-server` (server + client) |
| PHP runtime | `php-fpm`, `php-cli`, `php-mysql`, `php-mbstring`, `php-curl`, `php-xml`, `php-zip`, `php-opcache` |
| TLS | `certbot` (+ `certbot.timer` auto-renewal) |
| Build | Node.js 20.x (NodeSource) + npm |
| PHP deps | Composer → `phpmailer/phpmailer` (`composer install`) |
| System | `curl`, `git`, `rsync`, `unzip`, `jq`, `openssl`, `ca-certificates`, `ufw` |
| Headroom | 2 GB swapfile on small instances |

**Deliberately not installed:** a local MTA/Postfix (EC2 blocks outbound port 25 —
use authenticated SMTP) and any container runtime (not needed for this stack).

---

## 4. Files on the server

```
/var/www/aiameen.online/
├── public/            # built React SPA + sitemap.xml + robots.txt + legal pages
└── api/               # PHP authenticated SMTP mailing API
    ├── contact.php           POST  project enquiry → SMTP dossier + client receipt
    └── enquiries.jsonl       structured audit log (permissions www-data)

/etc/aiameen/api.env         # runtime config & SMTP secrets (chmod 640 root:www-data)
/etc/nginx/sites-available/aiameen.online
/etc/letsencrypt/live/aiameen.online/
/var/log/aiameen/            # runtime server logs
```

---

## 5. Operations

```bash
sudo ./deploy.sh status      # services + certificate expiry
sudo ./deploy.sh logs        # tail nginx + app logs
sudo nginx -t                # validate nginx config
sudo systemctl restart php*-fpm

curl -s https://aiameen.online/api/health.php | jq
```

**Database access**

```bash
sudo mysql aiameen
SELECT email, name, enrolled_at FROM course_enrollments ORDER BY id DESC LIMIT 10;
SELECT name, email, subject, created_at FROM contact_messages ORDER BY id DESC LIMIT 10;
```

**Backups** — cron a nightly `mysqldump`:

```bash
sudo crontab -e
# 0 3 * * * mysqldump --single-transaction aiameen | gzip > /var/backups/aiameen-$(date +\%F).sql.gz
```

---

## 5.1 Dependency & vulnerability management

Patching happens at three levels:

1. **On every deploy (automatic).** `./deploy.sh build` runs
   `npm audit fix --audit-level=high` before building. `npm audit fix` only
   applies fixes permitted by the semver ranges in `package.json`, so it is
   non-breaking. Disable with `NPM_AUDIT_FIX=false`, or opt into breaking
   upgrades with `NPM_AUDIT_FIX_FORCE=true`.
2. **On demand.** Run the full report and apply fixes:

   ```bash
   sudo ./deploy.sh audit      # npm audit (prod + all) + composer audit, then fixes
   ```

3. **Continuously (GitHub).** `.github/dependabot.yml` opens weekly PRs for npm,
   Composer and GitHub Actions (including security advisories). CI
   (`.github/workflows/deploy.yml`) type-checks and builds every PR before merge.

Check current production exposure any time:

```bash
npm audit --omit=dev
```

For operating-system packages, keep the box current:

```bash
sudo apt-get update && sudo apt-get upgrade -y     # and/or enable unattended-upgrades
```

---

## 6. Troubleshooting

| Symptom | Check |
|---------|-------|
| 502 on `/api/*.php` | `sudo ./deploy.sh status`; is php-fpm running and is the socket path in `deploy/deploy.env` (`PHP_VERSION`) correct? |
| Certificate not issued | DNS must resolve to the Elastic IP; ports 80/443 open in the security group |
| Mail not arriving | `sudo tail -f /var/log/aiameen/mail.jsonl`; check SMTP credentials; remember port 25 is blocked on EC2 |
| `Permission denied` writing logs | `/var/log/aiameen` must be owned by `www-data` (`sudo ./deploy.sh config`) |
| Old assets served | `sudo ./deploy.sh release` (rebuilds cache-busting hashes) |
| `composer install` skipped | No outbound HTTPS from the instance, or composer missing; API falls back to `mail()` |

---

## 7. CI (optional)

`.github/workflows/deploy-ec2.yml` can deploy on demand. Configure repository
secrets `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` and run the workflow manually from
the **Actions** tab.
