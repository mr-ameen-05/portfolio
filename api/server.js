import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ── 1. Comprehensive Environment Configuration Loader ─────────────────────────
function loadEnv() {
  const config = {
    PORT: process.env.PORT || process.env.API_PORT || '3001',
    HOST: process.env.HOST || '0.0.0.0',
    GOOGLE_SHEET_WEBHOOK_URL: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
    SEND_EMAIL: String(process.env.SEND_EMAIL || 'false').toLowerCase() === 'true',
    RECEIVER_EMAIL: process.env.RECEIVER_EMAIL || process.env.MAIL_TO || '26alameen2005@gmail.com',
    MAIL_TO: process.env.RECEIVER_EMAIL || process.env.MAIL_TO || '26alameen2005@gmail.com',
    MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL || '26alameen2005@gmail.com',
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || 'Al Ameen N R',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: process.env.SMTP_PORT || '465',
    SMTP_SECURE: process.env.SMTP_SECURE || 'true',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    RATE_LIMIT_PER_MINUTE: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '12', 10),
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
  };

  const candidateEnvFiles = [
    '/etc/aiameen/api.env',
    path.join(ROOT_DIR, 'deploy', 'deploy.env'),
    path.join(ROOT_DIR, '.env'),
    path.join(__dirname, '.env'),
  ];

  for (const envFile of candidateEnvFiles) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, 'utf8');
        const lines = content.split('\n');
        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith('#') || !line.includes('=')) continue;
          const [key, ...vals] = line.split('=');
          const trimmedKey = key.trim();
          let val = vals.join('=').trim();
          
          // Match quoted string first: "value" or 'value'
          const quoteMatch = val.match(/^"([^"]*)"/) || val.match(/^'([^']*)'/);
          if (quoteMatch) {
            val = quoteMatch[1];
          } else {
            // Strip trailing inline comment
            val = val.split('#')[0].trim();
          }

          // Only populate if not already set via process.env
          if (!process.env[trimmedKey] && val !== '') {
            config[trimmedKey] = val;
          }
        }
      } catch (err) {
        console.warn(`[Config] Note: Could not read ${envFile}:`, err.message);
      }
    }
  }

  // Ensure port numbers
  config.PORT = parseInt(config.PORT, 10) || 3001;
  config.SMTP_PORT = parseInt(config.SMTP_PORT, 10) || 465;
  config.SMTP_SECURE = String(config.SMTP_SECURE).toLowerCase() === 'true' || config.SMTP_PORT === 465;
  config.SEND_EMAIL = String(config.SEND_EMAIL).toLowerCase() === 'true';
  config.RECEIVER_EMAIL = config.RECEIVER_EMAIL || config.MAIL_TO || '26alameen2005@gmail.com';
  config.MAIL_TO = config.RECEIVER_EMAIL;

  // Clean Google App Password whitespace if user copied with spaces (e.g. "abcd efgh ijkl mnop")
  if (config.SMTP_PASS && (config.SMTP_HOST.includes('gmail.com') || !config.SMTP_HOST)) {
    config.SMTP_PASS = config.SMTP_PASS.replace(/\s+/g, '');
  }

  return config;
}

const ENV = loadEnv();

// ── 2. Lazy Nodemailer SMTP Transporter ───────────────────────────────────────
let mailerInstance = null;
async function getMailer() {
  if (mailerInstance) return mailerInstance;
  try {
    const nodemailer = (await import('nodemailer')).default;
    const isGmail = ENV.SMTP_HOST.includes('gmail.com') || (!ENV.SMTP_HOST && ENV.SMTP_USER.includes('@gmail.com'));
    const baseTimeoutOptions = {
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    };
    
    if (isGmail) {
      mailerInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
        ...baseTimeoutOptions,
      });
    } else {
      mailerInstance = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_SECURE,
        auth: ENV.SMTP_USER ? {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        } : undefined,
        tls: {
          rejectUnauthorized: true,
        },
        ...baseTimeoutOptions,
      });
    }
    return mailerInstance;
  } catch (err) {
    console.warn('[SMTP] Note: nodemailer package not found. Run "npm install nodemailer" if you wish to enable SMTP.');
    return null;
  }
}

// Output startup service modes
if (ENV.GOOGLE_SHEET_WEBHOOK_URL) {
  console.log(`[GoogleSheet] ✓ Google Sheet logging enabled via webhook`);
} else {
  console.log(`[GoogleSheet] Notice: GOOGLE_SHEET_WEBHOOK_URL not configured. Submissions are saved to enquiries.jsonl`);
}

if (ENV.SEND_EMAIL && ENV.SMTP_USER && ENV.SMTP_PASS) {
  getMailer().then(mailer => {
    if (mailer) {
      mailer.verify()
        .then(() => console.log(`[SMTP] ✓ Connected & authenticated successfully to ${ENV.SMTP_HOST} (user: ${ENV.SMTP_USER})`))
        .catch(err => console.error(`[SMTP] ✗ Connection warning: ${err.message}`));
    }
  });
} else if (ENV.SEND_EMAIL) {
  console.warn(`[SMTP] ! SEND_EMAIL is true but SMTP credentials are not configured in environment.`);
} else {
  console.log(`[Dispatch] Mode: Google Sheets & local audit log (Email dispatch disabled)`);
}

// ── 3. Sliding-Window Rate Limiter ───────────────────────────────────────────
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  let records = rateLimitMap.get(ip) || [];
  records = records.filter(ts => now - ts < windowMs);

  if (records.length >= ENV.RATE_LIMIT_PER_MINUTE) {
    rateLimitMap.set(ip, records);
    return false;
  }

  records.push(now);
  rateLimitMap.set(ip, records);
  return true;
}

// Clean old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, records] of rateLimitMap.entries()) {
    const valid = records.filter(ts => now - ts < 60000);
    if (valid.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, valid);
  }
}, 5 * 60 * 1000).unref();

// ── 4. Logging Helper ────────────────────────────────────────────────────────
function logEnquiry(entry) {
  const jsonLine = JSON.stringify(entry) + '\n';
  console.log(`[Enquiry] [${entry.timestamp}] Lead: "${entry.name}" <${entry.email}> | Service: "${entry.service}" | AdminSent: ${entry.admin_sent} | AckSent: ${entry.ack_sent}`);

  const possibleLogDirs = [
    '/var/log/aiameen',
    path.join(ROOT_DIR, 'logs'),
    __dirname,
  ];

  for (const dir of possibleLogDirs) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, 'enquiries.jsonl'), jsonLine);
      break;
    } catch {
      // Try next directory
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── 5. Branded HTML Email Templates (Light Themed) ───────────────────────────
function renderAdminDossier(data) {
  const { name, email, company, service, timeline, budget, description, clientIp, userAgent, timestamp, refId } = data;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 24px; background-color: #F1F5F9; color: #1E293B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); }
    .header { padding: 26px 32px; background: #F8FAFC; border-bottom: 2px solid #2563EB; }
    .header-tag { font-size: 11px; text-transform: uppercase; color: #2563EB; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 700; }
    .header-title { font-size: 20px; font-weight: 700; color: #0F172A; margin: 0; }
    .content { padding: 32px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table-details td { padding: 10px 0; border-bottom: 1px solid #F1F5F9; vertical-align: top; }
    .label { width: 140px; font-size: 12px; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; font-weight: 600; padding-top: 3px; }
    .value { color: #0F172A; font-size: 14px; font-weight: 500; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE; font-size: 12px; font-weight: 600; }
    .brief-title { font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 700; }
    .brief-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; color: #1E293B; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .action-row { margin-top: 24px; }
    .reply-btn { display: inline-block; padding: 11px 22px; background: #0F172A; color: #FFFFFF !important; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.3px; }
    .telemetry { margin-top: 24px; padding: 14px 18px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #64748B; line-height: 1.6; }
    .footer { padding: 18px 32px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-tag">PROJECT ENQUIRY &bull; AL AMEEN N R PORTFOLIO</div>
      <h1 class="header-title">New Technical Enquiry Received</h1>
    </div>
    <div class="content">
      <table class="table-details">
        <tr>
          <td class="label">Client / Lead:</td>
          <td class="value"><strong>${escapeHtml(name)}</strong></td>
        </tr>
        <tr>
          <td class="label">Work Email:</td>
          <td class="value"><a href="mailto:${escapeHtml(email)}" style="color: #2563EB; text-decoration: underline; font-weight: 600;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td class="label">Organization:</td>
          <td class="value">${escapeHtml(company)}</td>
        </tr>
        <tr>
          <td class="label">Domain / Scope:</td>
          <td class="value"><span class="badge">${escapeHtml(service)}</span></td>
        </tr>
        <tr>
          <td class="label">Target Timeline:</td>
          <td class="value">${escapeHtml(timeline)}</td>
        </tr>
        <tr>
          <td class="label">Budget:</td>
          <td class="value"><strong>${escapeHtml(budget)}</strong></td>
        </tr>
        ${refId ? `<tr><td class="label">Reference ID:</td><td class="value" style="font-family: ui-monospace, monospace; color: #64748B;">#${escapeHtml(refId)}</td></tr>` : ''}
      </table>

      <div class="brief-title">Project Description &amp; Technical Requirements:</div>
      <div class="brief-box">${escapeHtml(description)}</div>

      <div class="action-row">
        <a class="reply-btn" href="mailto:${escapeHtml(email)}?subject=Re:%20[${escapeHtml(encodeURIComponent(service))}]%20Technical%20Enquiry%20Discussion">Reply Directly to ${escapeHtml(name)} &rarr;</a>
      </div>

      <div class="telemetry">
        <div><strong>TIMESTAMP:</strong> ${escapeHtml(timestamp)}</div>
        <div><strong>CLIENT IP:</strong> ${escapeHtml(clientIp)}</div>
        <div><strong>USER AGENT:</strong> ${escapeHtml(userAgent)}</div>
      </div>
    </div>
    <div class="footer">
      TRANSMITTED FROM AL AMEEN N R PORTFOLIO PLATFORM &bull; SENDER: ${escapeHtml(email)}
    </div>
  </div>
</body>
</html>`;
}

function renderClientAcknowledgement(data) {
  const { name, service, company, timeline, budget, refId } = data;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 24px; background-color: #F1F5F9; color: #1E293B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); }
    .header { padding: 26px 32px; background: #F8FAFC; border-bottom: 2px solid #2563EB; }
    .brand { font-size: 11px; text-transform: uppercase; color: #2563EB; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 4px; }
    .header-title { font-size: 20px; font-weight: 700; color: #0F172A; margin: 0; }
    .content { padding: 32px; }
    .salutation { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 14px; }
    p { margin: 0 0 16px 0; color: #334155; line-height: 1.6; }
    .steps-card { background: #F8FAFC; border-left: 4px solid #2563EB; border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 18px 20px; border-radius: 0 8px 8px 0; margin: 22px 0; }
    .steps-card h4 { margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #0F172A; font-weight: 700; }
    .steps-card ul { margin: 0; padding-left: 18px; color: #334155; font-size: 13.5px; }
    .steps-card li { margin-bottom: 6px; }
    .summary-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin: 22px 0; }
    .summary-title { font-size: 11px; text-transform: uppercase; color: #64748B; letter-spacing: 1px; margin-bottom: 12px; font-weight: 700; }
    .summary-item { font-size: 13.5px; margin-bottom: 8px; color: #475569; }
    .summary-item strong { color: #0F172A; }
    .reply-box { padding: 14px 18px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; font-size: 13px; color: #166534; margin-top: 24px; line-height: 1.5; }
    .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0; }
    .sig-name { font-weight: 700; color: #0F172A; font-size: 15px; }
    .sig-title { font-size: 12px; color: #64748B; margin-top: 2px; }
    .footer { padding: 18px 32px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">AL AMEEN N R &bull; TRANSMISSION ACKNOWLEDGEMENT</div>
      <h1 class="header-title">Enquiry Received &amp; Queued</h1>
    </div>
    <div class="content">
      <div class="salutation">Hello ${escapeHtml(name)},</div>
      <p>Thank you for reaching out. Your project enquiry regarding <strong style="color: #0F172A;">${escapeHtml(service)}</strong> has been received and securely queued for evaluation.</p>
      
      <div class="steps-card">
        <h4>What Happens Next?</h4>
        <ul>
          <li><strong style="color: #0F172A;">Architecture &amp; Scope Review:</strong> I will personally review your problem statement, technical requirements, and delivery timeline.</li>
          <li><strong style="color: #0F172A;">Direct Response (24–48 Hours):</strong> You will receive a direct reply with preliminary observations, feasibility assessments, or an invitation to a technical scoping call.</li>
          <li><strong style="color: #0F172A;">Confidentiality Assurance:</strong> All project specifications, workflows, and business contexts are held with strict professional confidentiality.</li>
        </ul>
      </div>

      <div class="summary-card">
        <div class="summary-title">Submitted Specification Copy ${refId ? `(Reference: #${escapeHtml(refId)})` : ''}</div>
        <div class="summary-item"><strong>Service Scope:</strong> ${escapeHtml(service)}</div>
        <div class="summary-item"><strong>Organization:</strong> ${escapeHtml(company)}</div>
        <div class="summary-item"><strong>Target Timeline:</strong> ${escapeHtml(timeline)}</div>
        <div class="summary-item"><strong>Estimated Budget:</strong> ${escapeHtml(budget)}</div>
      </div>

      <div class="reply-box">
        <strong>Need to add artifacts?</strong> If you have technical architecture diagrams, API specs, or security guidelines to share, you can reply directly to this email at any time.
      </div>

      <div class="signature">
        <div class="sig-name">Al Ameen N R</div>
        <div class="sig-title">Security Engineer &bull; Forward Deployed Engineer &bull; Systems Builder</div>
        <div class="sig-title" style="color: #64748B; margin-top: 4px;">Kerala, India &bull; <a href="https://aiameen.online" style="color: #2563EB; text-decoration: none;">aiameen.online</a></div>
      </div>
    </div>
    <div class="footer">
      AUTOMATED CONFIRMATION DISPATCH &bull; NO MARKETING EMAILS WILL BE SENT
    </div>
  </div>
</body>
</html>`;
}

// ── 6. Request Handlers ──────────────────────────────────────────────────────
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 512) { // 512KB payload ceiling
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  res.end(JSON.stringify(data));
}

// ── 7. HTTP Server ───────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  // Route: GET /api/health (and alias /api/health.php)
  if ((pathname === '/api/health' || pathname === '/api/health.php') && req.method === 'GET') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'portfolio-node-api',
      engine: 'Node.js',
      version: process.version,
      timestamp: new Date().toISOString(),
      google_sheet: {
        configured: Boolean(ENV.GOOGLE_SHEET_WEBHOOK_URL),
      },
      smtp: {
        enabled: ENV.SEND_EMAIL,
        configured: Boolean(ENV.SMTP_USER && ENV.SMTP_PASS),
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_SECURE,
        user: ENV.SMTP_USER ? `${ENV.SMTP_USER.slice(0, 3)}***@${ENV.SMTP_USER.split('@')[1] || 'gmail.com'}` : 'none',
        mail_to: ENV.MAIL_TO,
      },
      uptime_seconds: Math.floor(process.uptime()),
    });
    return;
  }

  // Route: POST /api/contact (and alias /api/contact.php)
  if ((pathname === '/api/contact' || pathname === '/api/contact.php') && req.method === 'POST') {
    const clientIp = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Rate limit check
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, {
        success: false,
        error: 'Too many requests. Please wait a minute before submitting again.',
      });
      return;
    }

    let payload;
    try {
      payload = await parseJsonBody(req);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
      return;
    }

    const name = String(payload.name || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const company = String(payload.company || '').trim();
    const service = String(payload.service || payload.subject || 'Technical Consultation').trim();
    const timeline = String(payload.timeline || 'Flexible / TBD').trim();
    const budget = String(payload.budget || 'To be scoped').trim();
    const description = String(payload.description || payload.message || '').trim();

    // ── Strict Anti-Anonymous & Format Validation ───────────────────────────
    const blockedKeywords = ['anonymous', 'anon', 'unknown', 'n/a', 'na', 'none', 'test', 'tester', 'fake', 'someone', 'asdf', 'null', 'undefined'];
    const blockedDomains = ['example.com', 'test.com', 'fake.com', 'tempmail.com', 'throwaway.com'];

    const lowerName = name.toLowerCase();
    const lowerCompany = company.toLowerCase();

    if (!name || name.length < 2 || blockedKeywords.includes(lowerName)) {
      sendJson(res, 400, {
        success: false,
        error: 'Anonymous requests are strictly blocked. Please provide your real full name.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      sendJson(res, 400, {
        success: false,
        error: 'Please provide a valid, deliverable work email address.',
      });
      return;
    }

    const emailDomain = email.split('@')[1];
    if (blockedDomains.includes(emailDomain) || email.startsWith('anon') || email.startsWith('test@')) {
      sendJson(res, 400, {
        success: false,
        error: 'Disposable, temporary, or placeholder email addresses are not accepted.',
      });
      return;
    }

    if (!company || company.length < 2 || blockedKeywords.includes(lowerCompany)) {
      sendJson(res, 400, {
        success: false,
        error: 'Please specify your real organization, company, or domain name. Anonymous submissions are not accepted.',
      });
      return;
    }

    if (!description || description.length < 2) {
      sendJson(res, 400, {
        success: false,
        error: 'Please provide a brief technical description of your project requirements (minimum 2 characters).',
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const refId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const dossierData = { name, email, company, service, timeline, budget, description, clientIp, userAgent, timestamp, refId };

    // ── 1. Dispatch to Google Sheet Webhook ──────────────────────────────────
    let sheetSaved = false;
    let sheetError = null;

    if (ENV.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        const sheetRes = await fetch(ENV.GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp,
            reference: refId,
            name,
            email,
            company,
            service,
            timeline,
            budget,
            description,
            clientIp,
            userAgent,
          }),
          redirect: 'follow',
        });
        if (sheetRes.ok) {
          sheetSaved = true;
          console.log(`[GoogleSheet] ✓ Logged enquiry for "${name}" <${email}>`);
        } else {
          sheetError = `HTTP ${sheetRes.status}`;
          console.warn(`[GoogleSheet] ✗ Google Sheet webhook responded with HTTP ${sheetRes.status}`);
        }
      } catch (err) {
        sheetError = err.message;
        console.error('[GoogleSheet] Error posting to Google Sheet:', err.message);
      }
    }

    // ── 2. Optional SMTP Email Dispatch (Only if explicitly enabled) ─────────
    let adminSent = false;
    let ackSent = false;
    let lastError = null;

    if (ENV.SEND_EMAIL && ENV.SMTP_USER && ENV.SMTP_PASS) {
      const receiverEmail = ENV.RECEIVER_EMAIL || ENV.MAIL_TO || '26alameen2005@gmail.com';

      // Admin Notification Dossier (Enquiry sent to the portfolio owner / receiver)
      // Sender is clearly identified as the user who submitted the contact page enquiry
      const adminMailOptions = {
        from: `"${name} (${email})" <${ENV.SMTP_USER}>`,
        to: receiverEmail,
        replyTo: `"${name}" <${email}>`,
        subject: `[${service}] Project Enquiry from ${name} (${company})`,
        html: renderAdminDossier(dossierData),
        text: `New Technical Enquiry from ${name} (${email}, ${company})\nDomain: ${service}\nTimeline: ${timeline} | Budget: ${budget}\n\nDescription:\n${description}\n\nClient IP: ${clientIp} | Timestamp: ${timestamp}`,
      };

      // Client Confirmation Receipt (Sent to the user who entered the form)
      const clientMailOptions = {
        from: `"${ENV.MAIL_FROM_NAME}" <${ENV.SMTP_USER}>`,
        to: email,
        replyTo: `"${ENV.MAIL_FROM_NAME}" <${receiverEmail}>`,
        subject: `Technical Enquiry Received — Al Ameen N R`,
        html: renderClientAcknowledgement(dossierData),
        text: `Hello ${name},\n\nThank you for reaching out. Your project enquiry regarding "${service}" has been received and queued.\n\nSummary:\nService: ${service}\nTimeline: ${timeline}\nBudget: ${budget}\n\nBest regards,\nAl Ameen N R`,
      };

      const mailer = await getMailer();
      if (mailer) {
        const results = await Promise.allSettled([
          mailer.sendMail(adminMailOptions),
          mailer.sendMail(clientMailOptions),
        ]);

        if (results[0].status === 'fulfilled') adminSent = true;
        else lastError = results[0].reason?.message;

        if (results[1].status === 'fulfilled') ackSent = true;
      }
    }

    // ── 3. Persistent Local Log ──────────────────────────────────────────────
    logEnquiry({
      timestamp,
      name,
      email,
      company,
      service,
      timeline,
      budget,
      sheet_saved: sheetSaved,
      sheet_error: sheetError,
      admin_sent: adminSent,
      ack_sent: ackSent,
      client_ip: clientIp,
      error: lastError,
    });

    sendJson(res, 200, {
      success: true,
      message: sheetSaved
        ? `Project enquiry successfully submitted and recorded in Google Sheet.`
        : `Project enquiry successfully received and securely queued.`,
      sheet_saved: sheetSaved,
      admin_sent: adminSent,
      ack_sent: ackSent,
      reference: Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
    return;
  }

  // Route: Fallback 404
  sendJson(res, 404, {
    error: 'Not found',
    path: pathname,
  });
});

// Start listening
server.listen(ENV.PORT, ENV.HOST, () => {
  console.log(`[Server] Portfolio Node API running at http://${ENV.HOST}:${ENV.PORT}`);
  console.log(`[Server] Healthcheck available at http://${ENV.HOST}:${ENV.PORT}/api/health`);
  console.log(`[Server] Contact endpoint available at http://${ENV.HOST}:${ENV.PORT}/api/contact`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`[Server] Received ${signal}, closing server...`);
  server.close(() => {
    console.log('[Server] Closed successfully.');
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
