/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Google Apps Script: Contact Enquiries Logger & Auto-Acknowledgement Mailer
 *  
 *  Features:
 *  1. Rejects anonymous submissions (enforces real name, email, company, brief).
 *  2. Logs every valid enquiry to Google Sheets in real-time.
 *  3. Automatically sends a branded Dark-Cyber acknowledgement email to the client.
 *  4. Records the exact "Ack Email Status" directly into the Google Sheet.
 *  
 *  Setup Instructions:
 *  1. Open your Google Sheet (https://sheets.new).
 *  2. Go to "Extensions" > "Apps Script".
 *  3. Replace any code with this entire script.
 *  4. Click "Deploy" > "New deployment".
 *  5. Select type: "Web app".
 *  6. Description: "Portfolio Contact Webhook & Auto-Acknowledgement".
 *  7. Execute as: "Me".
 *  8. Who has access: "Anyone" (allows your server/website to post).
 *  9. Click "Deploy", authorize permissions with your Google Account.
 * 10. Copy the Web app URL (ends with /exec) and add it to your deploy.env:
 *     GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 * ─────────────────────────────────────────────────────────────────────────────
 */

var BLOCKED_NAMES = ["anonymous", "anon", "unknown", "n/a", "na", "none", "test", "tester", "fake", "someone", "asdf", "null", "undefined"];
var BLOCKED_DOMAINS = ["example.com", "test.com", "fake.com", "tempmail.com", "throwaway.com"];

function isAnonymousOrInvalid(data) {
  var name = String(data.name || "").trim().toLowerCase();
  var email = String(data.email || "").trim().toLowerCase();
  var company = String(data.company || "").trim().toLowerCase();
  var description = String(data.description || data.message || "").trim();

  if (name.length < 2 || BLOCKED_NAMES.indexOf(name) !== -1) {
    return "Anonymous submissions are not accepted. Please provide your real full name.";
  }

  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    return "Please provide a valid work email address.";
  }

  var parts = email.split("@");
  if (parts.length === 2 && BLOCKED_DOMAINS.indexOf(parts[1]) !== -1) {
    return "Disposable or placeholder email domains are not accepted. Please provide a legitimate work email.";
  }

  if (company.length < 2 || BLOCKED_NAMES.indexOf(company) !== -1) {
    return "Please provide your organization or company name (or freelance domain). Anonymous requests are blocked.";
  }

  if (description.length < 8) {
    return "Please provide a brief project description (minimum 8 characters).";
  }

  return null;
}

function renderAcknowledgementHtml(data, refId) {
  var name = escapeHtml(data.name || "Client");
  var service = escapeHtml(data.service || "Technical Consultation");
  var company = escapeHtml(data.company || "Your Organization");
  var timeline = escapeHtml(data.timeline || "Flexible");
  var budget = escapeHtml(data.budget || "To be scoped");

  return "<!DOCTYPE html>" +
  "<html>" +
  "<head><meta charset='UTF-8'></head>" +
  "<body style='margin:0;padding:24px;background-color:#0A0A0A;color:#E5E5E5;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;font-size:14px;line-height:1.6;'>" +
    "<div style='max-width:620px;margin:0 auto;background:#111111;border:1px solid #222222;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);'>" +
      "<div style='padding:26px 30px;background:#161616;border-bottom:2px solid #C8FF00;'>" +
        "<div style='font-family:monospace;font-size:11px;text-transform:uppercase;color:#C8FF00;letter-spacing:2px;font-weight:bold;margin-bottom:4px;'>AL AMEEN N R &bull; TRANSMISSION ACKNOWLEDGEMENT</div>" +
        "<h1 style='font-size:20px;font-weight:700;color:#FFFFFF;margin:0;'>Enquiry Received &amp; Queued</h1>" +
      "</div>" +
      "<div style='padding:30px;'>" +
        "<div style='font-size:16px;font-weight:600;color:#FFFFFF;margin-bottom:14px;'>Hello " + name + ",</div>" +
        "<p style='margin:0 0 16px 0;color:#B5B5B5;'>Thank you for reaching out. Your project enquiry regarding <strong style='color:#FFFFFF;'>" + service + "</strong> has been logged and queued for evaluation.</p>" +
        
        "<div style='background:#161616;border-left:3px solid #C8FF00;padding:18px 20px;border-radius:0 8px 8px 0;margin:20px 0;'>" +
          "<h4 style='margin:0 0 10px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#FFFFFF;font-family:monospace;'>What Happens Next?</h4>" +
          "<ul style='margin:0;padding-left:18px;color:#CCCCCC;font-size:13px;'>" +
            "<li style='margin-bottom:6px;'><strong style='color:#FFFFFF;'>Architecture &amp; Scope Review:</strong> I will personally review your technical problem statement and delivery timeline.</li>" +
            "<li style='margin-bottom:6px;'><strong style='color:#FFFFFF;'>Direct Response (24–48 Hours):</strong> You will receive a direct follow-up with feasibility notes or an invitation to a technical scoping call.</li>" +
            "<li><strong style='color:#FFFFFF;'>Strict Confidentiality:</strong> All specifications, architectures, and business contexts are held with strict non-disclosure integrity.</li>" +
          "</ul>" +
        "</div>" +

        "<div style='background:#0D0D0D;border:1px solid #222222;border-radius:8px;padding:18px;margin:20px 0;'>" +
          "<div style='font-family:monospace;font-size:11px;text-transform:uppercase;color:#888888;letter-spacing:1px;margin-bottom:10px;font-weight:bold;'>Specification Copy (Reference: #" + refId + ")</div>" +
          "<div style='font-size:13px;margin-bottom:6px;color:#A0A0A0;'><strong>Service Scope:</strong> <span style='color:#FFFFFF;'>" + service + "</span></div>" +
          "<div style='font-size:13px;margin-bottom:6px;color:#A0A0A0;'><strong>Organization:</strong> <span style='color:#FFFFFF;'>" + company + "</span></div>" +
          "<div style='font-size:13px;margin-bottom:6px;color:#A0A0A0;'><strong>Target Timeline:</strong> <span style='color:#FFFFFF;'>" + timeline + "</span></div>" +
          "<div style='font-size:13px;color:#A0A0A0;'><strong>Estimated Budget:</strong> <span style='color:#FFFFFF;'>" + budget + "</span></div>" +
        "</div>" +

        "<div style='padding:14px 18px;background:rgba(200,255,0,0.06);border:1px solid rgba(200,255,0,0.25);border-radius:6px;font-size:13px;color:#C8FF00;margin-top:24px;'>" +
          "<strong>Need to attach technical docs?</strong> You can reply directly to this email with architecture diagrams, threat models, or API specs at any time." +
        "</div>" +

        "<div style='margin-top:30px;padding-top:20px;border-top:1px solid #222222;'>" +
          "<div style='font-weight:700;color:#FFFFFF;font-size:15px;'>Al Ameen N R</div>" +
          "<div style='font-size:12px;color:#888888;font-family:monospace;margin-top:2px;'>Security Engineer &bull; Forward Deployed Engineer &bull; Systems Builder</div>" +
          "<div style='font-size:12px;color:#555555;margin-top:4px;'>Kerala, India &bull; <a href='https://aiameen.online' style='color:#888888;text-decoration:none;'>aiameen.online</a></div>" +
        "</div>" +
      "</div>" +
      "<div style='padding:16px 30px;background:#0A0A0A;border-top:1px solid #1A1A1A;font-size:11px;color:#555555;text-align:center;font-family:monospace;'>" +
        "SECURE TRANSMISSION RECEIPT &bull; REFERENCE: " + refId +
      "</div>" +
    "</div>" +
  "</body>" +
  "</html>";
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. Initialize Sheet Headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Reference ID",
        "Lead Name",
        "Work Email",
        "Company / Org",
        "Service Scope",
        "Timeline",
        "Budget",
        "Project Description",
        "Ack Email Status",
        "Client IP",
        "User Agent"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#111111");
      headerRange.setFontColor("#C8FF00");
      sheet.setFrozenRows(1);
    }

    // 2. Parse Incoming Payload
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (parseErr) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Reject Anonymous or Incomplete Submissions
    var validationError = isAnonymousOrInvalid(data);
    if (validationError) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: validationError,
          blocked: true
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var refId = data.reference || Utilities.getUuid().substring(0, 8).toUpperCase();
    var clientEmail = String(data.email).trim();

    // 4. Send Auto-Acknowledgement Email to Enquirer
    var ackStatus = "PENDING";
    try {
      var subject = "Technical Enquiry Received — Al Ameen N R [Ref: " + refId + "]";
      var htmlBody = renderAcknowledgementHtml(data, refId);

      GmailApp.sendEmail(clientEmail, subject, "Hello " + data.name + ",\n\nYour project enquiry regarding '" + data.service + "' has been received and queued.\n\nAl Ameen will follow up within 24-48 hours.\nReference: #" + refId, {
        htmlBody: htmlBody,
        name: "Al Ameen N R",
        replyTo: "26alameen2005@gmail.com"
      });
      ackStatus = "SENT (" + new Date().toLocaleTimeString() + ")";
    } catch (mailErr) {
      ackStatus = "FAILED: " + mailErr.message;
    }

    // 5. Append Row to Google Sheet with Ack Email Status
    sheet.appendRow([
      timestamp,
      refId,
      data.name,
      clientEmail,
      data.company,
      data.service || "Technical Consultation",
      data.timeline || "Flexible",
      data.budget || "To be scoped",
      data.description || data.message || "",
      ackStatus,
      data.clientIp || "127.0.0.1",
      data.userAgent || "Browser"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Enquiry successfully logged and acknowledgement email sent to " + clientEmail,
        reference: refId,
        ack_status: ackStatus
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      service: "portfolio-sheets-webhook-with-ack",
      policy: "Anonymous requests are strictly blocked"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
