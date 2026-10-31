import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ── 1. Comprehensive Environment Configuration Loader ─────────────────────────
function loadEnv() {
  const config = {
    PORT: process.env.PORT || process.env.API_PORT || '3001',
    HOST: process.env.HOST || '0.0.0.0',
    MAIL_TO: process.env.MAIL_TO || '26alameen2005@gmail.com',
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

  // Clean Google App Password whitespace if user copied with spaces (e.g. "abcd efgh ijkl mnop")
  if (config.SMTP_PASS && (config.SMTP_HOST.includes('gmail.com') || !config.SMTP_HOST)) {
    config.SMTP_PASS = config.SMTP_PASS.replace(/\s+/g, '');
  }

  return config;
}

const ENV = loadEnv();

// ── 2. Nodemailer SMTP Transporter ───────────────────────────────────────────
function createMailerTransport() {
  const isGmail = ENV.SMTP_HOST.includes('gmail.com') || (!ENV.SMTP_HOST && ENV.SMTP_USER.includes('@gmail.com'));
  const baseTimeoutOptions = {
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  };
  
  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
      ...baseTimeoutOptions,
    });
  }

  return nodemailer.createTransport({
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

const mailer = createMailerTransport();

// Verify SMTP connection on startup for fast diagnostics
if (ENV.SMTP_USER && ENV.SMTP_PASS) {
  mailer.verify()
    .then(() => {
      console.log(`[SMTP] ✓ Connected & authenticated successfully to ${ENV.SMTP_HOST} (user: ${ENV.SMTP_USER})`);
    })
    .catch((err) => {
      console.error(`[SMTP] ✗ Connection verification warning: ${err.message}`);
      console.error(`[SMTP] Tip: For Gmail SMTP, ensure you use a 16-character Google App Password (https://myaccount.google.com/apppasswords) with 2FA enabled.`);
    });
} else {
  console.warn(`[SMTP] ! SMTP credentials not fully configured. Set SMTP_USER and SMTP_PASS in deploy/deploy.env or /etc/aiameen/api.env.`);
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

// ── 5. Branded HTML Email Templates ──────────────────────────────────────────
function renderAdminDossier(data) {
  const { name, email, company, service, timeline, budget, description, clientIp, userAgent, timestamp } = data;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; background-color: #0A0A0A; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { padding: 24px 30px; background: #161616; border-bottom: 2px solid #C8FF00; }
    .header-tag { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #C8FF00; letter-spacing: 2px; margin-bottom: 6px; font-weight: bold; }
    .header-title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; }
    .content { padding: 30px; }
    .grid { margin-bottom: 24px; }
    .row { padding: 10px 0; border-bottom: 1px solid #1A1A1A; display: flex; }
    .label { width: 140px; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #777777; letter-spacing: 1px; font-weight: bold; padding-top: 2px; }
    .value { flex: 1; color: #FFFFFF; font-size: 14px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(200, 255, 0, 0.12); color: #C8FF00; border: 1px solid rgba(200, 255, 0, 0.3); font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; }
    .brief-title { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #777777; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold; }
    .brief-box { background: #0A0A0A; border: 1px solid #262626; border-radius: 8px; padding: 18px; color: #E5E5E5; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .telemetry { margin-top: 24px; padding: 14px 18px; background: #0E0E0E; border: 1px dashed #222222; border-radius: 6px; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #666666; }
    .footer { padding: 18px 30px; background: #0E0E0E; border-top: 1px solid #1A1A1A; font-size: 11px; color: #666666; text-align: center; font-family: 'Courier New', Courier, monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-tag">SECURITY &bull; SYSTEMS &bull; FORWARD DEPLOYED</div>
      <h1 class="header-title">New Technical Enquiry Received</h1>
    </div>
    <div class="content">
      <div class="grid">
        <div class="row">
          <div class="label">Client / Lead:</div>
          <div class="value"><strong>${escapeHtml(name)}</strong></div>
        </div>
        <div class="row">
          <div class="label">Work Email:</div>
          <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #C8FF00; text-decoration: none;">${escapeHtml(email)}</a></div>
        </div>
        <div class="row">
          <div class="label">Organization:</div>
          <div class="value">${escapeHtml(company)}</div>
        </div>
        <div class="row">
          <div class="label">Domain / Scope:</div>
          <div class="value"><span class="badge">${escapeHtml(service)}</span></div>
        </div>
        <div class="row">
          <div class="label">Target Timeline:</div>
          <div class="value">${escapeHtml(timeline)}</div>
        </div>
        <div class="row">
          <div class="label">Budget:</div>
          <div class="value">${escapeHtml(budget)}</div>
        </div>
      </div>

      <div class="brief-title">Project Description &amp; Technical Requirements:</div>
      <div class="brief-box">${escapeHtml(description)}</div>

      <div class="telemetry">
        <div><strong>TIMESTAMP:</strong> ${escapeHtml(timestamp)}</div>
        <div><strong>CLIENT IP:</strong> ${escapeHtml(clientIp)}</div>
        <div><strong>USER AGENT:</strong> ${escapeHtml(userAgent)}</div>
      </div>
    </div>
    <div class="footer">
      TRANSMITTED FROM AL AMEEN N R PORTFOLIO PLATFORM &bull; NODE.JS DISPATCHER
    </div>
  </div>
</body>
</html>`;
}

function renderClientAcknowledgement(data) {
  const { name, service, company, timeline, budget } = data;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; background-color: #0A0A0A; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { padding: 26px 30px; background: #161616; border-bottom: 2px solid #C8FF00; }
    .brand { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #C8FF00; letter-spacing: 2px; font-weight: bold; margin-bottom: 4px; }
    .header-title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; }
    .content { padding: 30px; }
    .salutation { font-size: 16px; font-weight: 600; color: #FFFFFF; margin-bottom: 14px; }
    p { margin: 0 0 16px 0; color: #B5B5B5; line-height: 1.6; }
    .steps-card { background: #161616; border-left: 3px solid #C8FF00; padding: 18px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .steps-card h4 { margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; }
    .steps-card ul { margin: 0; padding-left: 18px; color: #CCCCCC; }
    .steps-card li { margin-bottom: 6px; }
    .summary-card { background: #0D0D0D; border: 1px solid #222222; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .summary-title { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #888888; letter-spacing: 1px; margin-bottom: 10px; font-weight: bold; }
    .summary-item { font-size: 13px; margin-bottom: 6px; color: #A0A0A0; }
    .summary-item strong { color: #E5E5E5; }
    .reply-box { padding: 14px 18px; background: rgba(200, 255, 0, 0.05); border: 1px solid rgba(200, 255, 0, 0.2); border-radius: 6px; font-size: 13px; color: #C8FF00; margin-top: 24px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #222222; }
    .sig-name { font-weight: 700; color: #FFFFFF; font-size: 15px; }
    .sig-title { font-size: 12px; color: #777777; font-family: 'Courier New', Courier, monospace; margin-top: 2px; }
    .footer { padding: 18px 30px; background: #0A0A0A; border-top: 1px solid #1A1A1A; font-size: 11px; color: #555555; text-align: center; font-family: 'Courier New', Courier, monospace; }
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
      <p>Thank you for reaching out. Your project enquiry regarding <strong>${escapeHtml(service)}</strong> has been received and securely queued for evaluation.</p>
      
      <div class="steps-card">
        <h4>What Happens Next?</h4>
        <ul>
          <li><strong>Architecture &amp; Scope Review:</strong> I will personally review your problem statement, technical requirements, and delivery timeline.</li>
          <li><strong>Direct Response (24–48 Hours):</strong> You will receive a direct reply with preliminary observations, feasibility assessments, or an invitation to a technical scoping call.</li>
          <li><strong>Confidentiality Assurance:</strong> All project specifications, workflows, and business contexts are held with strict professional confidentiality.</li>
        </ul>
      </div>

      <div class="summary-card">
        <div class="summary-title">Submitted Specification Copy</div>
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
        <div class="sig-title" style="color: #555555; margin-top: 4px;">Kerala, India &bull; <a href="https://aiameen.online" style="color: #777777;">aiameen.online</a></div>
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
      smtp: {
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
    const company = String(payload.company || 'Individual / Confidential').trim();
    const service = String(payload.service || payload.subject || 'Technical Consultation').trim();
    const timeline = String(payload.timeline || 'Flexible / TBD').trim();
    const budget = String(payload.budget || 'To be scoped').trim();
    const description = String(payload.description || payload.message || '').trim();

    // Validation
    if (!name || !email || !description) {
      sendJson(res, 400, {
        success: false,
        error: 'Name, work email, and a project description are required.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendJson(res, 400, {
        success: false,
        error: 'Please provide a valid work email address.',
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const dossierData = { name, email, company, service, timeline, budget, description, clientIp, userAgent, timestamp };

    let adminSent = false;
    let ackSent = false;
    let lastError = null;

    if (ENV.SMTP_USER && ENV.SMTP_PASS) {
      // 1. Dispatch Admin Notification Dossier
      const adminMailOptions = {
        from: `"${ENV.MAIL_FROM_NAME}" <${ENV.SMTP_USER}>`,
        to: ENV.MAIL_TO,
        replyTo: `"${name}" <${email}>`,
        subject: `[${service}] Project Enquiry from ${name} (${company})`,
        html: renderAdminDossier(dossierData),
        text: `New Technical Enquiry from ${name} (${email}, ${company})\nDomain: ${service}\nTimeline: ${timeline} | Budget: ${budget}\n\nDescription:\n${description}\n\nClient IP: ${clientIp} | Timestamp: ${timestamp}`,
      };

      // 2. Dispatch Client Confirmation Receipt
      const clientMailOptions = {
        from: `"${ENV.MAIL_FROM_NAME}" <${ENV.SMTP_USER}>`,
        to: email,
        replyTo: `"${ENV.MAIL_FROM_NAME}" <${ENV.MAIL_TO}>`,
        subject: `Technical Enquiry Received — Al Ameen N R`,
        html: renderClientAcknowledgement(dossierData),
        text: `Hello ${name},\n\nThank you for reaching out. Your project enquiry regarding "${service}" has been received and queued for evaluation.\n\nAl Ameen N R will review your specification and follow up within 24–48 hours.\n\nSummary:\nService: ${service}\nTimeline: ${timeline}\nBudget: ${budget}\n\nBest regards,\nAl Ameen N R\nSecurity & Systems Engineer\nhttps://aiameen.online`,
      };

      const results = await Promise.allSettled([
        mailer.sendMail(adminMailOptions),
        mailer.sendMail(clientMailOptions),
      ]);

      if (results[0].status === 'fulfilled') {
        adminSent = true;
      } else {
        lastError = results[0].reason?.message || 'Admin mail delivery failed';
        console.error('[SMTP] Admin email dispatch failed:', results[0].reason);
      }

      if (results[1].status === 'fulfilled') {
        ackSent = true;
      } else {
        console.warn('[SMTP] Client acknowledgement email dispatch failed:', results[1].reason);
      }
    } else {
      console.warn('[SMTP] Skipped live dispatch because SMTP credentials are not configured in environment.');
    }

    logEnquiry({
      timestamp,
      name,
      email,
      company,
      service,
      timeline,
      budget,
      admin_sent: adminSent,
      ack_sent: ackSent,
      client_ip: clientIp,
      error: lastError,
    });

    sendJson(res, 200, {
      success: true,
      message: `Project enquiry successfully dispatched to Al Ameen. A receipt confirmation has been transmitted to ${email}.`,
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
