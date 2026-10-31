/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Google Apps Script: Contact Enquiries Logger
 *  
 *  Instructions:
 *  1. Open Google Sheets (https://sheets.new)
 *  2. Go to "Extensions" > "Apps Script"
 *  3. Paste this code into the editor (replace any default code)
 *  4. Click "Deploy" > "New deployment"
 *  5. Select type: "Web app"
 *  6. Description: "Portfolio Contact Webhook"
 *  7. Execute as: "Me"
 *  8. Who has access: "Anyone"  <-- IMPORTANT
 *  9. Click "Deploy" and Authorize access
 * 10. Copy the Web app URL (ends in /exec) and add to deploy/deploy.env:
 *     GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 * ─────────────────────────────────────────────────────────────────────────────
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Initialize header row if sheet is fresh/empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead Name",
        "Work Email",
        "Company / Org",
        "Service Scope",
        "Timeline",
        "Budget",
        "Project Description",
        "Client IP",
        "User Agent"
      ]);

      // Style header row with portfolio dark-cyber theme
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#111111");
      headerRange.setFontColor("#C8FF00");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "Anonymous",
      data.email || "No Email",
      data.company || "Individual",
      data.service || "Technical Consultation",
      data.timeline || "Flexible",
      data.budget || "To be scoped",
      data.description || data.message || "",
      data.clientIp || "127.0.0.1",
      data.userAgent || "Browser"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Enquiry successfully logged" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", service: "portfolio-sheets-webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
