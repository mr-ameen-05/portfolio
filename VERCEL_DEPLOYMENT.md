# Vercel deployment and portfolio review

## Plan eligibility

Vercel Hobby is for personal, non-commercial use. This portfolio currently
advertises services, project budgets, and commercial enquiries. Review its
eligibility before publishing; technical optimization does not change that rule.
Use an eligible plan/host if the site is used to sell services.

Official references: [Hobby](https://vercel.com/docs/plans/hobby),
[fair use](https://vercel.com/docs/limits/fair-use-guidelines),
[Node functions](https://vercel.com/docs/functions/runtimes/node-js),
[caching](https://vercel.com/docs/caching/cache-control-headers).

## Deploy

1. Import the repository into Vercel, with the repository root as Root Directory.
2. Use Vite, Node 22, `npm ci`, `npm run build`, and output directory `dist`.
   Do not use `npm start`, nginx, PHP, MySQL, or `deploy.sh` on Vercel.
3. Set server environment variables for both Production and any Preview
   environments that should accept enquiries. Redeploy after changes.
4. Leave `VITE_CONTACT_ENDPOINT` unset to use same-origin `/api/contact`.
5. Configure the domain in Vercel and use its displayed DNS records. The separate
   learning site at `learn.aiameen.online` needs its own deployment and DNS.
6. Smoke-test `/`, `/privacy.html`, `/terms.html`, `/course/example`,
   `/courses/example`, `/api/health`, and one real contact enquiry.

The API is a single Node function, routed through `api/server.js`. Static pages,
assets, sprite sheets, and course redirects use the static Vite build. No SSR,
cron jobs, database, image-optimization service, or extra dependencies are needed.
The function budget is 60 seconds; outbound Sheets requests time out after 10.

## Contact delivery is required

Configure at least one delivery destination:

| Variable | Purpose |
| --- | --- |
| `GOOGLE_SHEET_WEBHOOK_URL` | Existing Apps Script Web App `/exec` URL; use `scripts/google-sheets-script.js` and complete its deployment steps |
| `SEND_EMAIL` | `true` to enable optional SMTP; otherwise `false` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Mail provider settings; typically port 465 and secure `true` |
| `SMTP_USER`, `SMTP_PASS` | Mail credentials |
| `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `ADMIN_EMAIL` | Sender identity and admin destination |
| `RATE_LIMIT_PER_MINUTE` | Optional per-instance limit, default 12 |

Never put secrets in `VITE_` variables: those are public browser configuration.
Vercel's local files are not durable storage. The API reports success only after
the Sheets webhook returns JSON `{ "success": true }` or admin email delivery
succeeds. Otherwise it returns 503 and the form retains the enquiry for retry.
The health endpoint confirms the handler runs, not that mail or Sheets work.
Live provider delivery must be checked after deployment. A timeout can occur
after a provider accepts an enquiry, so retries can produce duplicates.

The existing rate limiter is per instance and resets on cold starts. It is not
distributed bot protection; use available Vercel Firewall controls and monitor
usage. SMTP and Apps Script also have their own quotas.

## Review findings and changes

| Area | Finding and action |
| --- | --- |
| Build configuration | Both JS and TS Vite configs exist. Build/dev/preview now explicitly select `vite.config.ts`, activating existing vendor splitting consistently. |
| Browser caching | Hashed `/assets/*` files cache for a year with `immutable`. Unhashed sprite sheets cache for one day and revalidate. API JSON uses `no-store`. |
| Routes | Both singular `/course/*` and plural `/courses/*` load the SPA and preserve the existing redirect to the learning subdomain. Root-relative asset URLs support direct nested visits. |
| API lifecycle | Exported handler works without opening a persistent listener on Vercel. Direct `node api/server.js` retains local/EC2 operation. |
| Data retention | Removed dependence on local logs on Vercel; unconfirmed delivery returns an error. SMTP verification no longer runs at Vercel cold start. |
| Upload scope | `.vercelignore` excludes local configuration, logs, built files, AWS tooling, and the separate learning app from CLI uploads. Git-based builds still install root dependencies and build root source. |
| SEO | Generated sitemap lists actual HTML pages, rather than fragment IDs and `llms.txt`. |
| Runtime | Node 22 is declared and CI is aligned. Contact regressions run in CI. |

Baseline production output: entry JS 391.15 kB (126.43 kB gzip), CSS 56.56 kB
(10.12 kB gzip). With the intended chunk configuration active, entry JS is
98.18 kB (31.73 kB gzip), with React, motion, and icons in separate cacheable
vendor files. These vendor files are also needed on first load: this is a caching
improvement, not a claim of a 75% reduction in total initial transfer.
Sprite sheets total approximately 840 KiB on disk and remain the largest static
asset group. They use static delivery rather than paid image transformations.

Existing strengths: below-fold sections use React.lazy, the hero canvas pauses
offscreen, and fonts load asynchronously. Animations execute in the visitor's
browser; they do not consume Vercel Function CPU.

Remaining content issues: navigation includes `process`, `field-notes`, and
`about`, but the current home page does not render those sections. Community and
several other source sections are also not mounted; neither are the old embedded
course pages. They do not contribute to the active bundle. The site config labels
the domain `ALAMEEN.DEV`, while SEO uses `aiameen.online`. Resolve those content
choices separately rather than deleting source or changing the design here.

## Verification and limits

Run `npm test` and `npm run build`. Tests exercise invalid input, raw/parsed
request bodies, external-delivery failure, webhook application-level failure,
confirmed delivery, no-store responses, health privacy, and API 404s.
No real emails are sent by tests.

This review does not establish a Lighthouse score or measured Core Web Vitals.
No Vercel deployment or DNS change was performed. Confirm routing and response
headers on an actual preview, then check mobile performance and the Usage tab.
Free-tier traffic capacity depends on transferred bytes, cache hits, requests,
and contact submissions; it cannot be guaranteed from source code alone.
