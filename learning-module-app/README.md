# Practical Cybersecurity Teaming Course (Standalone Application)

This is the standalone web application for the **Practical Cybersecurity Teaming (11-Module Interactive Course)**, extracted from the main portfolio to be hosted on its own dedicated subdomain (e.g., `https://learn.aiameen.online` or `https://teaming.aiameen.online`).

## Features
- **11 Interactive Modules**: Covering Threat Modeling, Red/Blue/Purple Teaming, Incident Response, and Meridian Health Logistics Capstone.
- **Interactive Labs & Quizzes**: Live exercises with client-side & API-driven answer verification.
- **Client-Side Progress Storage**: Saves learner module completion, quiz grades, and bookmarks in `localStorage`.
- **Search & Glossary**: Fast modal search across terms, tactics, and lessons.
- **Course Gate**: Name & email enrollment gate with persistent access tokens.

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server (port 5174)
npm run dev

# 3. Optional: Run PHP quiz validation backend
php -S localhost:8000
```

## Production Build & Subdomain Deployment

### Build
```bash
npm run build
```
This produces an optimized production bundle in `dist/`.

### Subdomain Deployment Example (Nginx)

```nginx
server {
    listen 80;
    server_name learn.aiameen.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn.aiameen.online;

    ssl_certificate /etc/letsencrypt/live/learn.aiameen.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn.aiameen.online/privkey.pem;

    root /var/www/learn-module/dist;
    index index.html;

    # Single Page App routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional PHP Quiz API backend
    location /api/ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/learn-module/api$fastcgi_script_name;
    }
}
```

### Vercel / Netlify / Cloudflare Pages
Deploy `dist/` directly, with an SPA rewrite rule (`/* -> /index.html`).
