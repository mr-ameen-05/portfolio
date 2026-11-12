function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "";
    var data = raw ? JSON.parse(raw) : e.parameter;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.type === 'COURSE_ENQUIRY' ? 'Course_Leads' : 'Project_Enquiries';
    var sheet = ss.getSheetByName(sheetName);
    
    // Auto-create sheet if not present
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (data.type === 'COURSE_ENQUIRY') {
        sheet.appendRow([
          'Ticket ID', 'Timestamp', 'Learner Name', 'Email Address', 
          'Target Course', 'Track', 'Experience Level', 'Status', 
          'Last Contacted', 'Cohort Batch', 'Payment Status', 'Goals & Notes'
        ]);
        sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#141414').setFontColor('#FFFFFF');
      } else {
        sheet.appendRow([
          'Ticket ID', 'Timestamp', 'Client Name', 'Email Address', 
          'Company', 'Service Domain', 'Timeline', 'Budget', 'Status', 'Description'
        ]);
        sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#141414').setFontColor('#FFFFFF');
      }
    }
    
    if (data.type === 'COURSE_ENQUIRY') {
      sheet.appendRow([
        data.reference || ("CRS-" + new Date().getTime().toString(36).toUpperCase()),
        data.timestamp || new Date().toISOString(),
        data.name || "",
        data.email || "",
        data.course || "",
        data.track || "",
        data.experience || "",
        "1. New Enquiry",
        Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd"),
        "Cohort 2026-Q1",
        "Pending Verification",
        data.goals || ""
      ]);
    } else {
      sheet.appendRow([
        data.reference || ("PRJ-" + new Date().getTime().toString(36).toUpperCase()),
        data.timestamp || new Date().toISOString(),
        data.name || "",
        data.email || "",
        data.company || "",
        data.service || "",
        data.timeline || "",
        data.budget || "",
        "New",
        data.description || ""
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", received: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
