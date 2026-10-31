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

  if (description.length < 2) {
    return "Please provide a brief project description (minimum 2 characters).";
  }

  return null;
}

var RECEIVER_EMAIL = "26alameen2005@gmail.com";

function renderAcknowledgementHtml(data, refId) {
  var name = escapeHtml(data.name || "Client");
  var service = escapeHtml(data.service || "Technical Consultation");
  var company = escapeHtml(data.company || "Your Organization");
  var timeline = escapeHtml(data.timeline || "Flexible");
  var budget = escapeHtml(data.budget || "To be scoped");

  return "<!DOCTYPE html>" +
  "<html>" +
  "<head><meta charset='UTF-8'></head>" +
  "<body style='margin:0;padding:24px;background-color:#F1F5F9;color:#1E293B;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;font-size:14px;line-height:1.6;'>" +
    "<div style='max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.06);'>" +
      "<div style='padding:26px 32px;background:#F8FAFC;border-bottom:2px solid #2563EB;'>" +
        "<div style='font-size:11px;text-transform:uppercase;color:#2563EB;letter-spacing:1.5px;font-weight:700;margin-bottom:4px;'>AL AMEEN N R &bull; TRANSMISSION ACKNOWLEDGEMENT</div>" +
        "<h1 style='font-size:20px;font-weight:700;color:#0F172A;margin:0;'>Enquiry Received &amp; Queued</h1>" +
      "</div>" +
      "<div style='padding:32px;'>" +
        "<div style='font-size:16px;font-weight:700;color:#0F172A;margin-bottom:14px;'>Hello " + name + ",</div>" +
        "<p style='margin:0 0 16px 0;color:#334155;line-height:1.6;'>Thank you for reaching out. Your project enquiry regarding <strong style='color:#0F172A;'>" + service + "</strong> has been logged and queued for evaluation.</p>" +
        
        "<div style='background:#F8FAFC;border-left:4px solid #2563EB;border-top:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;padding:18px 20px;border-radius:0 8px 8px 0;margin:22px 0;'>" +
          "<h4 style='margin:0 0 10px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#0F172A;font-weight:700;'>What Happens Next?</h4>" +
          "<ul style='margin:0;padding-left:18px;color:#334155;font-size:13.5px;'>" +
            "<li style='margin-bottom:6px;'><strong style='color:#0F172A;'>Architecture &amp; Scope Review:</strong> I will personally review your technical problem statement and delivery timeline.</li>" +
            "<li style='margin-bottom:6px;'><strong style='color:#0F172A;'>Direct Response (24–48 Hours):</strong> You will receive a direct follow-up with feasibility notes or an invitation to a technical scoping call.</li>" +
            "<li><strong style='color:#0F172A;'>Strict Confidentiality:</strong> All specifications, architectures, and business contexts are held with strict professional confidentiality.</li>" +
          </ul>" +
        "</div>" +

        "<div style='background:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;padding:18px 20px;margin:22px 0;'>" +
          "<div style='font-size:11px;text-transform:uppercase;color:#64748B;letter-spacing:1px;margin-bottom:12px;font-weight:700;'>Specification Copy (Reference: #" + refId + ")</div>" +
          "<div style='font-size:13.5px;margin-bottom:8px;color:#475569;'><strong>Service Scope:</strong> <span style='color:#0F172A;'>" + service + "</span></div>" +
          "<div style='font-size:13.5px;margin-bottom:8px;color:#475569;'><strong>Organization:</strong> <span style='color:#0F172A;'>" + company + "</span></div>" +
          "<div style='font-size:13.5px;margin-bottom:8px;color:#475569;'><strong>Target Timeline:</strong> <span style='color:#0F172A;'>" + timeline + "</span></div>" +
          "<div style='font-size:13.5px;color:#475569;'><strong>Estimated Budget:</strong> <span style='color:#0F172A;'>" + budget + "</span></div>" +
        "</div>" +

        "<div style='padding:14px 18px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;font-size:13px;color:#166534;margin-top:24px;line-height:1.5;'>" +
          "<strong>Need to attach technical docs?</strong> You can reply directly to this email with architecture diagrams, threat models, or API specs at any time." +
        "</div>" +

        "<div style='margin-top:28px;padding-top:20px;border-top:1px solid #E2E8F0;'>" +
          "<div style='font-weight:700;color:#0F172A;font-size:15px;'>Al Ameen N R</div>" +
          "<div style='font-size:12px;color:#64748B;margin-top:2px;'>Security Engineer &bull; Forward Deployed Engineer &bull; Systems Builder</div>" +
          "<div style='font-size:12px;color:#64748B;margin-top:4px;'>Kerala, India &bull; <a href='https://aiameen.online' style='color:#2563EB;text-decoration:none;'>aiameen.online</a></div>" +
        "</div>" +
      "</div>" +
      "<div style='padding:18px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center;'>" +
        "AUTOMATED CONFIRMATION DISPATCH &bull; REFERENCE: #" + refId +
      "</div>" +
    "</div>" +
  "</body>" +
  "</html>";
}

function renderAdminDossierHtml(data, refId) {
  var name = escapeHtml(data.name || "Client");
  var email = escapeHtml(data.email || "");
  var company = escapeHtml(data.company || "N/A");
  var service = escapeHtml(data.service || "Technical Consultation");
  var timeline = escapeHtml(data.timeline || "Flexible");
  var budget = escapeHtml(data.budget || "To be scoped");
  var description = escapeHtml(data.description || data.message || "");
  var clientIp = escapeHtml(data.clientIp || "N/A");
  var userAgent = escapeHtml(data.userAgent || "N/A");
  var timestamp = escapeHtml(data.timestamp || new Date().toISOString());

  return "<!DOCTYPE html>" +
  "<html>" +
  "<head><meta charset='UTF-8'></head>" +
  "<body style='margin:0;padding:24px;background-color:#F1F5F9;color:#1E293B;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;font-size:14px;line-height:1.6;'>" +
    "<div style='max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.06);'>" +
      "<div style='padding:26px 32px;background:#F8FAFC;border-bottom:2px solid #2563EB;'>" +
        "<div style='font-size:11px;text-transform:uppercase;color:#2563EB;letter-spacing:1.5px;font-weight:700;margin-bottom:4px;'>NEW PROJECT ENQUIRY &bull; AL AMEEN N R PORTFOLIO</div>" +
        "<h1 style='font-size:20px;font-weight:700;color:#0F172A;margin:0;'>Enquiry Dossier from " + name + "</h1>" +
      "</div>" +
      "<div style='padding:32px;'>" +
        "<table style='width:100%;border-collapse:collapse;margin-bottom:24px;'>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Client / Lead:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;font-weight:600;'>" + name + "</td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Work Email:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;'><a href='mailto:" + email + "' style='color:#2563EB;font-weight:600;text-decoration:underline;'>" + email + "</a></td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Organization:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;'>" + company + "</td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Domain / Scope:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;'><span style='display:inline-block;padding:3px 10px;border-radius:6px;background:#EFF6FF;color:#1D4ED8;border:1px solid #DBEAFE;font-size:12px;font-weight:600;'>" + service + "</span></td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Timeline:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;'>" + timeline + "</td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Budget:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;font-weight:600;'>" + budget + "</td></tr>" +
          "<tr><td style='width:140px;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px;text-transform:uppercase;color:#64748B;font-weight:600;'>Reference ID:</td><td style='padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-family:monospace;color:#64748B;'>#" + refId + "</td></tr>" +
        "</table>" +

        "<div style='font-size:12px;text-transform:uppercase;color:#475569;letter-spacing:0.5px;margin-bottom:8px;font-weight:700;'>Project Description &amp; Technical Requirements:</div>" +
        "<div style='background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:18px 20px;color:#1E293B;white-space:pre-wrap;font-size:14px;line-height:1.6;'>" + description + "</div>" +

        "<div style='margin-top:24px;'>" +
          "<a href='mailto:" + email + "?subject=Re:%20[" + encodeURIComponent(service) + "]%20Technical%20Enquiry%20Discussion' style='display:inline-block;padding:11px 22px;background:#0F172A;color:#FFFFFF;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;'>Reply Directly to " + name + " &rarr;</a>" +
        "</div>" +

        "<div style='margin-top:24px;padding:14px 18px;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:6px;font-family:monospace;font-size:11px;color:#64748B;line-height:1.6;'>" +
          "<div><strong>TIMESTAMP:</strong> " + timestamp + "</div>" +
          "<div><strong>CLIENT IP:</strong> " + clientIp + "</div>" +
          "<div><strong>USER AGENT:</strong> " + userAgent + "</div>" +
        "</div>" +
      "</div>" +
      "<div style='padding:18px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center;'>" +
        "TRANSMITTED FROM AL AMEEN N R PORTFOLIO PLATFORM &bull; SENDER: " + email +
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

    // 4. Send Admin Notification & Auto-Acknowledgement
    var ackStatus = "PENDING";
    var recipientEmail = data.receiverEmail || RECEIVER_EMAIL;

    // Send Enquiry Dossier to Portfolio Owner (Receiver)
    // The sender is the user who entered their details on the contact page
    try {
      var adminSubject = "[" + (data.service || "Project Enquiry") + "] Enquiry from " + data.name + " (" + data.company + ")";
      var adminHtml = renderAdminDossierHtml(data, refId);
      GmailApp.sendEmail(recipientEmail, adminSubject, "New Technical Enquiry from " + data.name + " (" + clientEmail + ", " + data.company + ")\nDomain: " + data.service + "\nTimeline: " + data.timeline + " | Budget: " + data.budget + "\n\nDescription:\n" + (data.description || data.message || "") + "\n\nClient IP: " + (data.clientIp || "127.0.0.1"), {
        htmlBody: adminHtml,
        name: data.name + " (" + clientEmail + ")",
        replyTo: clientEmail
      });
    } catch (adminErr) {
      Logger.log("Admin notification email error: " + adminErr.message);
    }

    // Send Auto-Acknowledgement Receipt to Enquirer
    try {
      var subject = "Technical Enquiry Received — Al Ameen N R [Ref: #" + refId + "]";
      var htmlBody = renderAcknowledgementHtml(data, refId);

      GmailApp.sendEmail(clientEmail, subject, "Hello " + data.name + ",\n\nYour project enquiry regarding '" + data.service + "' has been received and queued.\n\nAl Ameen will follow up within 24-48 hours.\nReference: #" + refId, {
        htmlBody: htmlBody,
        name: "Al Ameen N R",
        replyTo: recipientEmail
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
