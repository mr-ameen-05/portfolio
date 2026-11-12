# Excel Course Management System & Mailing Architecture

This document provides complete instructions for setting up and using the **Course Management Excel Macro Pipeline** and explains the **Mailing Architecture** implemented for project and course enquiries.

---

## 1. Mailing Architecture Overview

Both **Project Enquiries** and **Course Enquiries** are routed through [api/server.js](file:///home/ameen/Desktop/portfolio/api/server.js) with end-to-end security, rate-limiting, and dual-dispatch delivery:

| Enquiry Type | API Endpoint | Admin Dossier Template | Learner / Client Confirmation |
| :--- | :--- | :--- | :--- |
| **Project Enquiries** | `POST /api/contact` | `renderAdminDossier` (Light/Clean dossier with client IP, budget, timeline, company, description) | `renderClientAcknowledgement` (Official receipt with ticket ID & SLA confirmation) |
| **Course Enquiries** | `POST /api/course-enquiry` | `renderCourseAdminDossier` (Target course, track, experience tier, learner goals, client telemetry) | `renderCourseClientAcknowledgement` (Course curriculum guide, sandbox roadmap, syllabus confirmation) |

### Key Deliverability Features
1. **Dual Dispatch**: 
   - An administrator notification is sent immediately to your inbox (`ADMIN_EMAIL` / `SMTP_USER`).
   - A branded acknowledgment email with ticket reference is dispatched automatically to the user's provided email.
2. **Anti-Anonymous & Spam Filtering**: Rejects disposable domains (`tempmail.com`, etc.) and invalid identity markers.
3. **Google Sheets Webhook Sync**: If `GOOGLE_SHEET_WEBHOOK_URL` is set in `.env`, submissions are automatically logged to your Google Sheet in real time.
4. **Persistent JSONL Audit Trail**: All enquiries are recorded to `logs/enquiries.jsonl` (with ticket ID, timestamp, status, and client telemetry).

---

## 2. Excel Course Management Macro (`Course_Management_Macro.bas`)

The macro file is located at [excel/Course_Management_Macro.bas](file:///home/ameen/Desktop/portfolio/excel/Course_Management_Macro.bas).

### Included Automated Features:
- **`SetupCourseManagementSystem`**: Builds 3 interconnected sheets (`Course_Leads`, `Cohort_Dashboard`, and `Academy_Settings`) with data validation dropdowns, status-based color highlights, and freeze panes.
- **`QuickAddCourseLead`**: Interactive popup dialogue to quickly log a walk-in or offline course lead with an auto-generated `CRS-XXXX` ticket reference.
- **`DraftSelectedOutlookFollowUps`**: Batch drafts personalized follow-up emails in Microsoft Outlook for every highlighted row in the sheet, automatically populating the learner's name, target course, ticket ID, and sandbox access details, while updating the lead status to *2. Contacted / Followed Up*.
- **`GenerateCohortDashboard`**: Aggregates total enquiries, contacted candidates, paid enrolments, and breakdown counts across each learning track (*Cybersecurity Analyst*, *SOC Operations*, *VAPT*, *Vibe Coding*, *FDE*).

---

## 3. Step-by-Step Installation in Microsoft Excel

1. **Open Microsoft Excel** and create a blank workbook (or open your existing tracking workbook).
2. Save the workbook as **Excel Macro-Enabled Workbook (`.xlsm`)**:
   - `File` > `Save As` > Choose format: **Excel Macro-Enabled Workbook (*.xlsm)**.
3. **Open the VBA Editor**:
   - Press <kbd>Alt</kbd> + <kbd>F11</kbd> (or go to `Developer` tab > `Visual Basic`).
4. **Import the Macro File**:
   - In the VBA menu, click `File` > `Import File...` (or <kbd>Ctrl</kbd> + <kbd>M</kbd>).
   - Select [Course_Management_Macro.bas](file:///home/ameen/Desktop/portfolio/excel/Course_Management_Macro.bas).
   *(Alternatively, right-click `VBAProject` > `Insert` > `Module`, and copy-paste the code).*
5. **Initialize the Workbook**:
   - In Excel, press <kbd>Alt</kbd> + <kbd>F8</kbd>.
   - Select **`SetupCourseManagementSystem`** and click **Run**.
   - The tables, headers, conditional formatting, and settings will be configured automatically.
6. **Assigning Quick Buttons (Optional)**:
   - Go to `Insert` > `Shapes` (e.g., a rounded rectangle button labeled *"Send Outlook Follow-ups"*).
   - Right-click the button > **Assign Macro** > Choose `DraftSelectedOutlookFollowUps`.
