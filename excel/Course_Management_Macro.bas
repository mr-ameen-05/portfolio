Attribute VB_Name = "CourseManagementModule"
' ==============================================================================
' CYBERSECURITY & VIBE CODING ACADEMY - COURSE MANAGEMENT SYSTEM
' Enterprise VBA Automation Macro Module for Excel
' Author: Al Ameen N R
' Version: 2.1
' Description: Automated lead pipeline, batch follow-up emailer via Outlook,
'              enquiry JSONL importer, and cohort distribution dashboard.
' ==============================================================================

Option Explicit

' ------------------------------------------------------------------------------
' Constant Configuration
' ------------------------------------------------------------------------------
Public Const SHEET_LEADS As String = "Course_Leads"
Public Const SHEET_DASHBOARD As String = "Cohort_Dashboard"
Public Const SHEET_SETTINGS As String = "Academy_Settings"

' Color Palette (Cyber High-Contrast Dark & Modern Accents)
Public Const COLOR_HEADER_BG As Long = 1315860       ' Hex #141414 (Dark Slate)
Public Const COLOR_HEADER_FONT As Long = 16777215    ' Hex #FFFFFF (White)
Public Const COLOR_ACCENT As Long = 65480            ' Hex #C8FF00 (Phosphor Cyber Lime)
Public Const COLOR_BORDER As Long = 14540253         ' Hex #DDDDDD (Subtle Grey)

' ------------------------------------------------------------------------------
' 1. INITIALIZE ENTIRE WORKBOOK & SCHEMAS
' ------------------------------------------------------------------------------
Public Sub SetupCourseManagementSystem()
    Dim wsLeads As Worksheet
    Dim wsDash As Worksheet
    Dim wsSettings As Worksheet
    Dim wb As Workbook
    
    Set wb = ThisWorkbook
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    ' 1. Leads Sheet
    On Error Resume Next
    Set wsLeads = wb.Sheets(SHEET_LEADS)
    On Error GoTo 0
    If wsLeads Is Nothing Then
        Set wsLeads = wb.Sheets.Add(Before:=wb.Sheets(1))
        wsLeads.Name = SHEET_LEADS
    End If
    
    ' 2. Dashboard Sheet
    On Error Resume Next
    Set wsDash = wb.Sheets(SHEET_DASHBOARD)
    On Error GoTo 0
    If wsDash Is Nothing Then
        Set wsDash = wb.Sheets.Add(After:=wsLeads)
        wsDash.Name = SHEET_DASHBOARD
    End If
    
    ' 3. Settings Sheet
    On Error Resume Next
    Set wsSettings = wb.Sheets(SHEET_SETTINGS)
    On Error GoTo 0
    If wsSettings Is Nothing Then
        Set wsSettings = wb.Sheets.Add(After:=wsDash)
        wsSettings.Name = SHEET_SETTINGS
    End If
    
    ' Setup Sheets
    Call FormatSettingsSheet(wsSettings)
    Call FormatLeadsSheet(wsLeads)
    Call FormatDashboardSheet(wsDash)
    
    wsLeads.Activate
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    
    MsgBox "Course Management System successfully initialized!" & vbCrLf & _
           "- Course_Leads table configured with conditional formatting & validation" & vbCrLf & _
           "- Cohort_Dashboard ready for metrics analysis" & vbCrLf & _
           "- Outlook automated dispatch ready", vbInformation, "Academy Pipeline Initialized"
End Sub

' ------------------------------------------------------------------------------
' 2. FORMAT SETTINGS & DROPDOWN REFERENCES
' ------------------------------------------------------------------------------
Private Sub FormatSettingsSheet(ws As Worksheet)
    ws.Cells.Clear
    
    ' Tracks
    ws.Range("A1").Value = "Tracks"
    ws.Range("A2").Value = "Cybersecurity Analyst"
    ws.Range("A3").Value = "SOC Operations"
    ws.Range("A4").Value = "VAPT & Offensive Security"
    ws.Range("A5").Value = "Vibe Coding & AI Architecture"
    ws.Range("A6").Value = "Forward Deployed Engineering (FDE)"
    
    ' Courses
    ws.Range("B1").Value = "Available Courses"
    ws.Range("B2").Value = "Vibe Coding for Security: AI-Augmented Defense"
    ws.Range("B3").Value = "Cybersecurity Foundations: Zero to SOC Analyst"
    ws.Range("B4").Value = "Enterprise SOC & Incident Response"
    ws.Range("B5").Value = "Modern VAPT & Offensive Cyber Operations"
    ws.Range("B6").Value = "Forward Deployed Engineering in Practice"
    
    ' Statuses
    ws.Range("C1").Value = "Lead Statuses"
    ws.Range("C2").Value = "1. New Enquiry"
    ws.Range("C3").Value = "2. Contacted / Followed Up"
    ws.Range("C4").Value = "3. Sandbox Invited"
    ws.Range("C5").Value = "4. Enrolled (Paid)"
    ws.Range("C6").Value = "5. Waitlisted (Next Cohort)"
    ws.Range("C7").Value = "6. Inactive / Closed"
    
    ' Experience
    ws.Range("D1").Value = "Experience Tiers"
    ws.Range("D2").Value = "Beginner / Student"
    ws.Range("D3").Value = "Mid-Level Practitioner (1-3 yrs)"
    ws.Range("D4").Value = "Senior Engineer / Lead (4+ yrs)"
    
    ' Styling Header Row
    With ws.Range("A1:D1")
        .Font.Bold = True
        .Interior.Color = RGB(220, 220, 230)
    End With
    ws.Columns("A:D").AutoFit
End Sub

' ------------------------------------------------------------------------------
' 3. FORMAT COURSE LEADS SHEET
' ------------------------------------------------------------------------------
Private Sub FormatLeadsSheet(ws As Worksheet)
    Dim headers As Variant
    Dim i As Long
    
    headers = Array("Ticket ID", "Timestamp", "Learner Name", "Email Address", _
                    "Target Course", "Track", "Experience Level", "Status", _
                    "Last Contacted", "Cohort Batch", "Payment Status", "Goals & Notes")
    
    ' Populate Headers
    For i = LBound(headers) To UBound(headers)
        ws.Cells(1, i + 1).Value = headers(i)
    Next i
    
    ' Header Style
    With ws.Range("A1:L1")
        .Interior.Color = COLOR_HEADER_BG
        .Font.Color = COLOR_HEADER_FONT
        .Font.Bold = True
        .Font.Name = "Segoe UI"
        .Font.Size = 10
        .RowHeight = 28
        .VerticalAlignment = xlCenter
        .HorizontalAlignment = xlCenter
    End With
    
    ' Data Validation: Target Course (Col E)
    With ws.Range("E2:E5000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
             Formula1:="='" & SHEET_SETTINGS & "'!$B$2:$B$6"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    ' Data Validation: Track (Col F)
    With ws.Range("F2:F5000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
             Formula1:="='" & SHEET_SETTINGS & "'!$A$2:$A$6"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    ' Data Validation: Experience Level (Col G)
    With ws.Range("G2:G5000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
             Formula1:="='" & SHEET_SETTINGS & "'!$D$2:$D$4"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    ' Data Validation: Status (Col H)
    With ws.Range("H2:H5000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
             Formula1:="='" & SHEET_SETTINGS & "'!$C$2:$C$7"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    ' Add Conditional Formatting on Status (Col H)
    Call ApplyStatusConditionalFormatting(ws)
    
    ' Set column widths
    ws.Columns("A").ColumnWidth = 14  ' Ticket
    ws.Columns("B").ColumnWidth = 16  ' Date
    ws.Columns("C").ColumnWidth = 20  ' Name
    ws.Columns("D").ColumnWidth = 26  ' Email
    ws.Columns("E").ColumnWidth = 32  ' Course
    ws.Columns("F").ColumnWidth = 24  ' Track
    ws.Columns("G").ColumnWidth = 22  ' Experience
    ws.Columns("H").ColumnWidth = 24  ' Status
    ws.Columns("I").ColumnWidth = 15  ' Last Contact
    ws.Columns("J").ColumnWidth = 15  ' Cohort Batch
    ws.Columns("K").ColumnWidth = 16  ' Payment
    ws.Columns("L").ColumnWidth = 40  ' Notes
    
    ws.Range("A1").Select
    ActiveWindow.FreezePanes = False
    ws.Range("A2").Select
    ActiveWindow.FreezePanes = True
End Sub

' ------------------------------------------------------------------------------
' 4. STATUS CONDITIONAL FORMATTING
' ------------------------------------------------------------------------------
Private Sub ApplyStatusConditionalFormatting(ws As Worksheet)
    Dim rng As Range
    Set rng = ws.Range("H2:H5000")
    rng.FormatConditions.Delete
    
    ' 1. New Enquiry -> Soft Amber
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=""1. New Enquiry""")
        .Interior.Color = RGB(254, 243, 199)
        .Font.Color = RGB(146, 64, 14)
        .Font.Bold = True
    End With
    
    ' 2. Contacted -> Soft Blue
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=""2. Contacted / Followed Up""")
        .Interior.Color = RGB(224, 242, 254)
        .Font.Color = RGB(3, 105, 161)
    End With
    
    ' 3. Sandbox Invited -> Soft Purple
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=""3. Sandbox Invited""")
        .Interior.Color = RGB(243, 232, 255)
        .Font.Color = RGB(107, 33, 168)
        .Font.Bold = True
    End With
    
    ' 4. Enrolled (Paid) -> Soft Emerald
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=""4. Enrolled (Paid)""")
        .Interior.Color = RGB(209, 250, 229)
        .Font.Color = RGB(6, 95, 70)
        .Font.Bold = True
    End With
End Sub

' ------------------------------------------------------------------------------
' 5. ADD NEW LEAD INTERACTIVELY
' ------------------------------------------------------------------------------
Public Sub QuickAddCourseLead()
    Dim ws As Worksheet
    Dim nextRow As Long
    Dim lName As String, lEmail As String, lCourse As String, lTrack As String
    Dim lRef As String
    
    Set ws = ThisWorkbook.Sheets(SHEET_LEADS)
    nextRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1
    
    lName = InputBox("Enter Prospective Learner Full Name:", "Quick Ingestion - Learner Name")
    If Trim(lName) = "" Then Exit Sub
    
    lEmail = InputBox("Enter Learner Email Address:", "Quick Ingestion - Email")
    If Trim(lEmail) = "" Then Exit Sub
    
    lRef = "CRS-" & Right("0000" & Hex(Int((Rnd * 65535) + 1)), 4)
    
    With ws
        .Cells(nextRow, "A").Value = lRef
        .Cells(nextRow, "B").Value = Format(Now, "YYYY-MM-DD HH:MM")
        .Cells(nextRow, "C").Value = lName
        .Cells(nextRow, "D").Value = lEmail
        .Cells(nextRow, "E").Value = "Cybersecurity Foundations: Zero to SOC Analyst"
        .Cells(nextRow, "F").Value = "SOC Operations"
        .Cells(nextRow, "G").Value = "Beginner / Student"
        .Cells(nextRow, "H").Value = "1. New Enquiry"
        .Cells(nextRow, "I").Value = Format(Date, "YYYY-MM-DD")
        .Cells(nextRow, "J").Value = "Cohort 2026-Q1"
        .Cells(nextRow, "K").Value = "Pending Verification"
        .Cells(nextRow, "L").Value = "Direct enquiry intake"
    End With
    
    MsgBox "Lead successfully recorded with ID: " & lRef, vbInformation, "Lead Ingested"
End Sub

' ------------------------------------------------------------------------------
' 6. BATCH DRAFT OUTLOOK FOLLOW-UP EMAILS FOR SELECTED LEADS
' ------------------------------------------------------------------------------
Public Sub DraftSelectedOutlookFollowUps()
    Dim OutlookApp As Object
    Dim OutlookMail As Object
    Dim ws As Worksheet
    Dim selRow As Range
    Dim r As Long
    Dim leadName As String, leadEmail As String, leadCourse As String, leadRef As String
    Dim emailCount As Long
    Dim htmlBody As String
    
    Set ws = ThisWorkbook.Sheets(SHEET_LEADS)
    
    ' Check if Outlook application is reachable
    On Error Resume Next
    Set OutlookApp = GetObject(Class:="Outlook.Application")
    If OutlookApp Is Nothing Then
        Set OutlookApp = CreateObject(Class:="Outlook.Application")
    End If
    On Error GoTo 0
    
    If OutlookApp Is Nothing Then
        MsgBox "Microsoft Outlook is not accessible or not installed on this workstation." & vbCrLf & _
               "Please ensure Outlook is open and configured.", vbCritical, "Outlook Connection Failed"
        Exit Sub
    End If
    
    emailCount = 0
    
    ' Loop through selected rows
    For Each selRow In Selection.Rows
        r = selRow.Row
        If r > 1 Then ' Skip Header
            leadRef = Trim(ws.Cells(r, "A").Value)
            leadName = Trim(ws.Cells(r, "C").Value)
            leadEmail = Trim(ws.Cells(r, "D").Value)
            leadCourse = Trim(ws.Cells(r, "E").Value)
            
            If leadEmail <> "" And InStr(leadEmail, "@") > 0 Then
                Set OutlookMail = OutlookApp.CreateItem(0)
                
                ' Cyber High-Tech Email Body
                htmlBody = "<div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#1E293B;max-width:600px;line-height:1.6;'>" & _
                           "<div style='border-left:4px solid #C8FF00;padding-left:14px;margin-bottom:16px;'>" & _
                           "<strong style='font-size:16px;color:#0F172A;'>Al Ameen N R — Operative Academy</strong><br>" & _
                           "<span style='font-size:12px;color:#64748B;'>Technical Engineering & Cybersecurity Cohort</span>" & _
                           "</div>" & _
                           "<p>Hello <strong>" & leadName & "</strong>,</p>" & _
                           "<p>Thank you for submitting your enquiry regarding <strong>" & leadCourse & "</strong> (Ref Ticket: <code>" & leadRef & "</code>).</p>" & _
                           "<p>We are currently onboarding engineers and analysts for our upcoming hands-on sandbox batch. " & _
                           "Here is what you will be accessing in the initial curriculum:</p>" & _
                           "<ul>" & _
                           "<li>Contained cloud lab sandboxes (SOC Incident Triage / VAPT testbed)</li>" & _
                           "<li>Vibe Coding workflows: AI-assisted automation, security policy auditing, and tool creation</li>" & _
                           "<li>Direct mentor code & dossier reviews</li>" & _
                           "</ul>" & _
                           "<p>Could you let me know if you would like me to reserve your sandbox access seat for the upcoming launch?</p>" & _
                           "<p>Best regards,<br><strong>Al Ameen N R</strong><br>" & _
                           "<span style='font-size:12px;color:#64748B;'>Cybersecurity Analyst & Systems Engineer</span><br>" & _
                           "<a href='https://aiameen.in/learn' style='color:#0F172A;font-size:12px;'>https://aiameen.in/learn</a></p>" & _
                           "</div>"
                
                With OutlookMail
                    .To = leadEmail
                    .Subject = "Course Onboarding & Sandbox Access — " & leadCourse & " [" & leadRef & "]"
                    .htmlBody = htmlBody
                    .Display ' Display in Outlook for review before sending
                End With
                
                ' Update Status and Timestamp
                ws.Cells(r, "H").Value = "2. Contacted / Followed Up"
                ws.Cells(r, "I").Value = Format(Date, "YYYY-MM-DD")
                emailCount = emailCount + 1
            End If
        End If
    Next selRow
    
    If emailCount > 0 Then
        MsgBox "Successfully created " & emailCount & " personalized Outlook follow-up draft(s)!" & vbCrLf & _
               "The lead status and 'Last Contacted' columns have been updated.", vbInformation, "Outlook Drafts Created"
    Else
        MsgBox "No valid rows with email addresses were selected." & vbCrLf & _
               "Please select one or more data rows in the Course_Leads sheet.", vbExclamation, "No Leads Selected"
    End If
End Sub

' ------------------------------------------------------------------------------
' 7. DASHBOARD GENERATION & METRICS
' ------------------------------------------------------------------------------
Public Sub GenerateCohortDashboard()
    Dim wsDash As Worksheet
    Dim wsLeads As Worksheet
    Dim lastRow As Long
    
    Set wsDash = ThisWorkbook.Sheets(SHEET_DASHBOARD)
    Set wsLeads = ThisWorkbook.Sheets(SHEET_LEADS)
    lastRow = wsLeads.Cells(wsLeads.Rows.Count, "A").End(xlUp).Row
    If lastRow < 2 Then lastRow = 2
    
    Application.ScreenUpdating = False
    wsDash.Cells.Clear
    
    ' Title
    With wsDash.Range("B2")
        .Value = "ACADEMY COHORT PIPELINE DASHBOARD"
        .Font.Size = 16
        .Font.Bold = True
        .Font.Name = "Segoe UI"
        .Font.Color = RGB(15, 23, 42)
    End With
    
    wsDash.Range("B3").Value = "Real-time metrics, lead conversions, and course distribution"
    wsDash.Range("B3").Font.Size = 10
    wsDash.Range("B3").Font.Color = RGB(100, 116, 139)
    
    ' KPI Cards
    ' Card 1: Total Enquiries
    wsDash.Range("B5:C5").Merge
    wsDash.Range("B5").Value = "TOTAL ENQUIRIES"
    wsDash.Range("B6").Formula = "=COUNTA(" & SHEET_LEADS & "!A2:A" & lastRow & ")"
    
    ' Card 2: Contacted Leads
    wsDash.Range("D5:E5").Merge
    wsDash.Range("D5").Value = "FOLLOW-UPS SENT"
    wsDash.Range("D6").Formula = "=COUNTIF(" & SHEET_LEADS & "!H2:H" & lastRow & ", ""*Contacted*"")"
    
    ' Card 3: Enrolled (Paid)
    wsDash.Range("F5:G5").Merge
    wsDash.Range("F5").Value = "ENROLLED LEARNERS"
    wsDash.Range("F6").Formula = "=COUNTIF(" & SHEET_LEADS & "!H2:H" & lastRow & ", ""*Enrolled*"")"
    
    ' Style KPI Cards
    With wsDash.Range("B5:G5")
        .Interior.Color = COLOR_HEADER_BG
        .Font.Color = COLOR_HEADER_FONT
        .Font.Bold = True
        .Font.Size = 9
        .HorizontalAlignment = xlCenter
    End With
    
    With wsDash.Range("B6:G6")
        .Interior.Color = RGB(248, 250, 252)
        .Font.Bold = True
        .Font.Size = 20
        .Font.Color = RGB(15, 23, 42)
        .HorizontalAlignment = xlCenter
        .Borders.Color = RGB(226, 232, 240)
    End With
    
    ' Track Breakdown Table
    wsDash.Range("B9").Value = "Track Breakdown"
    wsDash.Range("B9:C9").Merge
    wsDash.Range("B9").Font.Bold = True
    wsDash.Range("B9").Font.Size = 12
    
    wsDash.Range("B10").Value = "Learning Track"
    wsDash.Range("C10").Value = "Lead Count"
    With wsDash.Range("B10:C10")
        .Font.Bold = True
        .Interior.Color = RGB(241, 245, 249)
        .Borders(xlEdgeBottom).LineStyle = xlContinuous
    End With
    
    Dim tRow As Long
    For tRow = 2 To 6
        wsDash.Cells(9 + tRow, "B").Value = wsLeads.Parent.Sheets(SHEET_SETTINGS).Cells(tRow, "A").Value
        wsDash.Cells(9 + tRow, "C").Formula = "=COUNTIF(" & SHEET_LEADS & "!F2:F" & lastRow & ", B" & (9 + tRow) & ")"
    Next tRow
    
    wsDash.Columns("B:G").AutoFit
    wsDash.Activate
    Application.ScreenUpdating = True
    
    MsgBox "Dashboard refreshed successfully with latest cohort metrics!", vbInformation, "Dashboard Synchronized"
End Sub

' ------------------------------------------------------------------------------
' 8. LIVE SYNC COURSE LEADS DIRECTLY FROM BACKEND API
' ------------------------------------------------------------------------------
Public Sub SyncCourseLeadsFromAPI()
    Dim http As Object
    Dim apiUrl As String
    Dim csvText As String
    Dim lines() As String
    Dim i As Long
    Dim wsLeads As Worksheet
    Dim fields() As String
    Dim rowIdx As Long
    Dim existingIds As Object
    Dim ticketId As String
    Dim importedCount As Long
    
    Set wsLeads = ThisWorkbook.Sheets(SHEET_LEADS)
    apiUrl = InputBox("Enter API URL endpoint for Course Enquiries CSV:", _
                      "Live Excel Web Sync", _
                      "http://localhost:3001/api/course-enquiries.csv")
    
    If Trim(apiUrl) = "" Then Exit Sub
    
    Application.ScreenUpdating = False
    
    On Error Resume Next
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    If http Is Nothing Then Set http = CreateObject("MSXML2.XMLHTTP")
    On Error GoTo 0
    
    If http Is Nothing Then
        MsgBox "Unable to create XMLHTTP component for live sync.", vbCritical, "Sync Error"
        Exit Sub
    End If
    
    ' Fetch live data
    On Error Resume Next
    http.Open "GET", apiUrl, False
    http.setRequestHeader "User-Agent", "Excel-Course-Sync/1.0"
    http.Send
    
    If Err.Number <> 0 Or http.Status <> 200 Then
        MsgBox "Failed to connect to API: " & apiUrl & vbCrLf & _
               "Status: " & http.Status & " " & http.statusText, vbCritical, "Connection Failed"
        Application.ScreenUpdating = True
        Exit Sub
    End If
    On Error GoTo 0
    
    csvText = http.responseText
    lines = Split(csvText, vbCrLf)
    If UBound(lines) < 1 Then lines = Split(csvText, vbLf)
    
    ' Track existing Ticket IDs to prevent duplicates
    Set existingIds = CreateObject("Scripting.Dictionary")
    rowIdx = wsLeads.Cells(wsLeads.Rows.Count, "A").End(xlUp).Row
    For i = 2 To rowIdx
        ticketId = Trim(wsLeads.Cells(i, "A").Value)
        If ticketId <> "" Then existingIds(ticketId) = True
    Next i
    
    importedCount = 0
    ' Parse incoming CSV lines (skip header)
    For i = 1 To UBound(lines)
        If Trim(lines(i)) <> "" Then
            fields = ParseCSVLine(lines(i))
            If UBound(fields) >= 3 Then
                ticketId = CleanField(fields(0))
                If ticketId <> "" And Not existingIds.Exists(ticketId) Then
                    rowIdx = rowIdx + 1
                    wsLeads.Cells(rowIdx, "A").Value = ticketId
                    If UBound(fields) >= 1 Then wsLeads.Cells(rowIdx, "B").Value = CleanField(fields(1))
                    If UBound(fields) >= 2 Then wsLeads.Cells(rowIdx, "C").Value = CleanField(fields(2))
                    If UBound(fields) >= 3 Then wsLeads.Cells(rowIdx, "D").Value = CleanField(fields(3))
                    If UBound(fields) >= 4 Then wsLeads.Cells(rowIdx, "E").Value = CleanField(fields(4))
                    If UBound(fields) >= 5 Then wsLeads.Cells(rowIdx, "F").Value = CleanField(fields(5))
                    If UBound(fields) >= 6 Then wsLeads.Cells(rowIdx, "G").Value = CleanField(fields(6))
                    wsLeads.Cells(rowIdx, "H").Value = "1. New Enquiry"
                    wsLeads.Cells(rowIdx, "I").Value = Format(Date, "YYYY-MM-DD")
                    wsLeads.Cells(rowIdx, "J").Value = "Cohort 2026-Q1"
                    wsLeads.Cells(rowIdx, "K").Value = "Pending Verification"
                    If UBound(fields) >= 11 Then wsLeads.Cells(rowIdx, "L").Value = CleanField(fields(11))
                    existingIds(ticketId) = True
                    importedCount = importedCount + 1
                End If
            End If
        End If
    Next i
    
    wsLeads.Columns("A:L").AutoFit
    Application.ScreenUpdating = True
    
    MsgBox "Live Synchronization Complete!" & vbCrLf & _
           "Imported: " & importedCount & " new course enquiry lead(s).", vbInformation, "Live Sync Success"
End Sub

Private Function CleanField(val As String) As String
    Dim s As String
    s = Trim(val)
    If Left(s, 1) = """" And Right(s, 1) = """" And Len(s) >= 2 Then
        s = Mid(s, 2, Len(s) - 2)
    End If
    CleanField = Replace(s, """""", """")
End Function

Private Function ParseCSVLine(lineText As String) As String()
    Dim inQuotes As Boolean
    Dim ch As String
    Dim currentField As String
    Dim result() As String
    Dim count As Long
    Dim j As Long
    
    ReDim result(0 To 20)
    count = 0
    inQuotes = False
    currentField = ""
    
    For j = 1 To Len(lineText)
        ch = Mid(lineText, j, 1)
        If ch = """" Then
            inQuotes = Not inQuotes
            currentField = currentField & ch
        ElseIf ch = "," And Not inQuotes Then
            result(count) = currentField
            count = count + 1
            currentField = ""
        Else
            currentField = currentField & ch
        End If
    Next j
    result(count) = currentField
    
    ReDim Preserve result(0 To count)
    ParseCSVLine = result
End Function

