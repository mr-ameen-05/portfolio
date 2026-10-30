import { ResourceItem } from '../types/course.types';

export const COURSE_RESOURCES: ResourceItem[] = [
  {
    id: 'res-roe-checklist',
    title: 'Scope & Rules of Engagement (ROE) Pre-Flight Checklist',
    description: 'A comprehensive pre-assessment legal, technical, and operational checklist for defining boundaries, exclusions, emergency contacts, and stop conditions.',
    type: 'checklist',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '4.8 KB',
    version: '2.1',
    lastUpdated: '2026-03-01',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    accessibilityNotes: 'Screen reader accessible plain text with structured Markdown headers and form checkboxes.',
    downloadFileName: 'scope-and-roe-checklist-v2.1.md',
    contentMarkdown: `# SCOPE AND RULES OF ENGAGEMENT (ROE) PRE-FLIGHT CHECKLIST
Version: 2.1 | Author: Al Ameen N R | License: CC BY 4.0

## 1. LEGAL & STAKEHOLDER AUTHORIZATION
- [ ] Written contract executed by authorized legal entity (CISO, VP Eng, or Board).
- [ ] Target ownership verified (Whois, cloud account ID, IP delegation).
- [ ] Third-party service providers (SaaS, hosting) notified and consented if required.
- [ ] Emergency stop authority designated with 24/7 direct phone contact.
- [ ] Non-Disclosure Agreement (NDA) in effect.

## 2. TECHNICAL SCOPE DEFINITION
- [ ] Explicit CIDR blocks and IP addresses specified (no wildcard assumptions).
- [ ] Exact hostnames and domain names cataloged.
- [ ] Excluded IP ranges and cloud assets documented in writing.
- [ ] Production databases and shared infrastructure explicitly flagged as off-limits.
- [ ] Testing source IPs provided to client SOC for deconfliction allowlisting.

## 3. OPERATIONAL CONSTRAINTS & WINDOWS
- [ ] Authorized testing window specified (e.g., Monday-Thursday 20:00 - 04:00 UTC).
- [ ] Prohibited techniques documented (e.g., Denial of Service, physical intrusion, phishing).
- [ ] Data handling protocol established: maximum of 1 proof-of-concept record retained.
- [ ] Communication protocol established (encrypted channels, deconfliction code-word).

## 4. STOP CONDITIONS (HALT TESTING IMMEDIATELY IF OBSERVED)
- [!] Contact with an IP or host not listed in the SOW.
- [!] Degradation of critical production system availability.
- [!] Accidental discovery of unencrypted regulatory data (cardholder data, patient PII).
- [!] Identification of active real-world malicious intruders on target.`
  },
  {
    id: 'res-threat-model-worksheet',
    title: 'STRIDE Threat Modeling Worksheet & Data Flow Template',
    description: 'A structured worksheet for decomposing application components, drawing trust boundaries, mapping STRIDE threats, and assigning verifiable security controls.',
    type: 'worksheet',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '6.2 KB',
    version: '1.4',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Accessible tabular layout with text descriptions for all data flow diagram entities.',
    downloadFileName: 'stride-threat-model-worksheet-v1.4.md',
    contentMarkdown: `# STRIDE THREAT MODELING WORKSHEET
Application Name: ___________________________ | Analyst: ___________________________

## 1. COMPONENT DECOMPOSITION & TRUST BOUNDARIES
- Process 1: [e.g., Web Server Gateway (Nginx)]
- Process 2: [e.g., Authentication Microservice (Node.js/Go)]
- Data Store 1: [e.g., Relational Database (PostgreSQL)]
- External Entity 1: [e.g., Client Web Browser]
- Trust Boundary A: [Public Internet to DMZ]
- Trust Boundary B: [DMZ to Internal Private Data Tier]

## 2. STRIDE THREAT INVENTORY TABLE
| STRIDE Category | Threat Description | Affected Component | Existing Control | Proposed Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **S** - Spoofing | Impersonating valid user session | Web Gateway | None | JWT Signature + Secure Cookies |
| **T** - Tampering | Modifying order price in transit | API Endpoint | None | Server-side validation |
| **R** - Repudiation | Admin deleting user without audit log | Admin Panel | None | Append-only audit logs |
| **I** - Info Disclosure | Directory listing exposing .env file | Web Server | Default Config | Disable autoindex & hide dotfiles |
| **D** - Denial of Service | Flooding login endpoint with requests | Auth API | None | IP Rate limiting & CAPTCHA |
| **E** - Elevation of Priv | Normal user modifying ?role=admin | Profile API | Client check | Server-side RBAC validation |`
  },
  {
    id: 'res-finding-report-template',
    title: 'Vulnerability Finding Card & Assessment Report Template',
    description: 'Standardized 6-part finding card template for documenting security vulnerabilities with CVSS 3.1 scoring, evidence formatting, and developer-friendly code remediations.',
    type: 'template',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '5.5 KB',
    version: '2.0',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Structured Markdown headers, code block formatting, and standardized labels.',
    downloadFileName: 'vulnerability-finding-card-template-v2.0.md',
    contentMarkdown: `# VULNERABILITY FINDING CARD TEMPLATE
Finding Reference: FINDING-[YEAR]-[NUM] (e.g., FINDING-2026-001)

## 1. TITLE & OVERVIEW
- **Finding Title:** [Vulnerability Type] in [Component/Endpoint]
- **Severity Rating:** [Critical / High / Medium / Low / Informational]
- **CVSS v3.1 Vector:** CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N (Score: 6.5)
- **CWE Classification:** CWE-[ID]: [CWE Name]

## 2. AFFECTED COMPONENT
- **Target Host/URL:** https://target.example.internal/api/v1/[endpoint]
- **Environment:** [Production / Staging / Internal]

## 3. TECHNICAL DESCRIPTION & ROOT CAUSE
[Concise explanation of why the vulnerability occurs at the architectural or code level.]

## 4. REPRODUCTION STEPS (STEP-BY-STEP)
1. Authenticate to the application as test user [User A].
2. Issue the following HTTP request using curl or browser devtools:
\`\`\`http
GET /api/v1/orders?id=5091 HTTP/1.1
Host: target.example.internal
Authorization: Bearer <user_a_token>
\`\`\`
3. Observe that the response returns private data belonging to [User B].

## 5. BUSINESS & OPERATIONAL IMPACT
[Objective, non-hyperbolic statement of what an adversary achieves upon exploitation.]

## 6. ACTIONABLE REMEDIATION GUIDANCE
### Recommended Code Patch:
\`\`\`typescript
// Enforce tenancy directly in database query
const record = await db.orders.findOne({
  where: { id: req.query.id, user_id: req.user.id }
});
if (!record) return res.status(404).json({ error: "Not found" });
\`\`\``
  },
  {
    id: 'res-incident-triage-worksheet',
    title: 'Security Operations (SOC) Incident Triage & Scoping Worksheet',
    description: 'A rapid triage checklist for SOC analysts to evaluate incoming alerts, determine true positive likelihood, calculate blast radius, and execute initial escalations.',
    type: 'worksheet',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '4.2 KB',
    version: '1.2',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Step-by-step numbered instructions and clear criteria tables.',
    downloadFileName: 'incident-triage-worksheet-v1.2.md',
    contentMarkdown: `# SOC INCIDENT TRIAGE & SCOPING WORKSHEET
Alert ID: ____________________ | Timestamp (UTC): ____________________ | Analyst: ____________________

## 1. SENSOR VERIFICATION
- Alert Name: [e.g., Web Server Spawning Shell]
- Sensor Source: [EDR / Firewall / Web Log / SIEM]
- Affected Hostname & IP: _____________________________________________
- User Account Involved: ______________________________________________

## 2. CLASSIFICATION
- [ ] True Positive (Actionable Intrusion)
- [ ] True Positive (Authorized Benign Maintenance / Pen Test)
- [ ] False Positive (Rule Misconfiguration)

## 3. SCOPING & BLAST RADIUS
- Has the suspicious process communicated out to external IPs? [Yes / No]
- Have other hosts on the same subnet reported similar alerts? [Yes / No]
- Did the command execute under administrative/root privileges? [Yes / No]

## 4. IMMEDIATE ACTION TAKEN
- [ ] EDR Network Isolation applied to host.
- [ ] External IP blocked on perimeter firewall.
- [ ] Compromised account disabled and active sessions revoked.
- [ ] Memory image (RAM) captured for forensics.`
  },
  {
    id: 'res-tabletop-worksheet',
    title: 'Incident Response Tabletop Exercise Facilitator Guide & Scenarios',
    description: 'Discussion-based tabletop scenario guide with injects, branching decision prompts, and post-exercise lessons learned review framework.',
    type: 'guide',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '5.1 KB',
    version: '1.5',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Plain text facilitator notes with structured scenario phases.',
    downloadFileName: 'incident-response-tabletop-guide-v1.5.md',
    contentMarkdown: `# INCIDENT RESPONSE TABLETOP EXERCISE FACILITATOR GUIDE
Scenario: Healthcare Supply Chain Ransomware / Data Exfiltration

## PHASE 1: THE INITIAL DETECTION (T+00:00)
- **Inject:** Sunday at 02:15 UTC, the SIEM triggers an alert for an outbound TCP connection on port 8080 from the main web server.
- **Discussion Prompts:**
  1. Who is on call? How is the alert acknowledged within 15 minutes?
  2. Does the Tier 1 analyst reboot the machine or apply EDR network isolation?
  3. What out-of-band communication channel is opened?

## PHASE 2: LATERAL MOVEMENT & EXFILTRATION (T+01:30)
- **Inject:** The attacker uses stolen credentials to query the internal billing database.
- **Discussion Prompts:**
  1. How is the blast radius identified across active sessions?
  2. At what point is the incident escalated to the CISO and legal counsel?

## PHASE 3: LESSONS LEARNED & HARDENING (T+Post Incident)
- **Discussion Prompts:**
  1. What defensive visibility gap allowed the initial web shell to land?
  2. What preventive control (e.g., container filesystem read-only) would have stopped the drop script?`
  },
  {
    id: 'res-remediation-prioritization-sheet',
    title: 'Vulnerability Remediation Prioritization Calculator (EPSS + KEV)',
    description: 'A risk-based vulnerability triage matrix combining CISA Known Exploited Vulnerabilities (KEV), Exploit Prediction Scoring System (EPSS), and asset exposure.',
    type: 'worksheet',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '4.6 KB',
    version: '2.0',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Clear logic scoring formula and plain-text decision tree.',
    downloadFileName: 'remediation-prioritization-matrix-v2.0.md',
    contentMarkdown: `# VULNERABILITY REMEDIATION PRIORITIZATION MATRIX
Guideline: Prioritize real-world exploitability and exposure over raw theoretical CVSS score.

## SCORING TIERS:
- **TIER 1 (EMERGENCY - 24-48 HOUR SLA):**
  - Listed on CISA KEV (Actively exploited in the wild) OR EPSS > 0.50 (50%+ probability).
  - AND host is exposed directly to the Public Internet.
  - Action: Immediate emergency patch or perimeter mitigation.

- **TIER 2 (HIGH - 14-DAY SLA):**
  - High/Critical CVSS (>= 7.0) with EPSS between 0.10 and 0.50.
  - Internal network asset or public asset with compensating controls.
  - Action: Scheduled patch in current sprint cycle.

- **TIER 3 (STANDARD - 30-60 DAY SLA):**
  - Medium/Low CVSS (< 7.0) with low EPSS (< 0.05).
  - Isolated internal asset with strict egress filtering.
  - Action: Standard patch maintenance schedule.`
  },
  {
    id: 'res-capstone-brief-rubric',
    title: 'Purple Team Capstone Brief, Submission Form & Official Rubric',
    description: 'The complete specification for the Module 10 Capstone Project, including scenario background, 5 mandatory deliverables, and the grading rubric with safety requirement.',
    type: 'rubric',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '7.8 KB',
    version: '2.4',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Detailed Markdown tables with explicit grading criteria for each milestone.',
    downloadFileName: 'purple-team-capstone-brief-and-rubric-v2.4.md',
    contentMarkdown: `# PURPLE TEAM CAPSTONE BRIEF & OFFICIAL GRADING RUBRIC
Course: Practical Cybersecurity: Red Teaming, Blue Teaming, and Purple Teaming

## 1. CAPSTONE OVERVIEW
Learners analyze a fictional healthcare logistics company (Meridian Health Logistics), validate a seeded Broken Object Level Authorization (BOLA) weakness, analyze defensive telemetry to identify detection blind spots, engineer a Sigma detection rule, and write an executive debrief.

## 2. MANDATORY FIVE DELIVERABLES
1. **Deliverable A:** Scope & Safety Pre-Flight Verification Checklist.
2. **Deliverable B:** Offensive BOLA Finding Card with sanitized HTTP evidence.
3. **Deliverable C:** Defensive Detection Gap Analysis & Authoring of Sigma Rule.
4. **Deliverable D:** Engineering Remediation Code Patch & Automated Retest Specification.
5. **Deliverable E:** Executive Summary & Limitations Reflection.

## 3. OFFICIAL GRADING RUBRIC
| Category | Weight | Criteria for Full Score |
| :--- | :--- | :--- |
| **1. Safety & Scope** | **MANDATORY PASS (100% required)** | Target strictly within 10.200.0.0/24; zero out-of-scope targets touched; stop conditions honored. |
| **2. Technical Reasoning** | 25% | Clear explanation of BOLA root cause and why SIEM failed on HTTP 200 responses. |
| **3. Evidence Quality** | 25% | Data minimization applied; complete HTTP request/response with sensitive fields masked. |
| **4. Defense & Remediation** | 25% | Sigma rule is context-rich; code patch enforces tenancy in query layer with automated unit test. |
| **5. Communication & Clarity** | 25% | Executive summary is business-oriented; finding card is developer-friendly; limitations acknowledged. |`
  },
  {
    id: 'res-course-glossary-download',
    title: 'Complete Course Glossary & Security Acronyms Reference',
    description: 'Comprehensive offline reference handbook containing definitions and acronyms for all 40+ cybersecurity terms taught across the 11 course modules.',
    type: 'glossary',
    fileFormat: 'Markdown (.md) / Text',
    fileSize: '8.4 KB',
    version: '2.4',
    lastUpdated: '2026-03-01',
    license: 'CC BY 4.0',
    accessibilityNotes: 'Alphabetical glossary format with expanded acronyms on first mention.',
    downloadFileName: 'practical-cybersecurity-complete-glossary.md',
    contentMarkdown: `# PRACTICAL CYBERSECURITY: COMPLETE COURSE GLOSSARY
Comprehensive vocabulary reference covering Core, Red, Blue, and Purple Teaming domains.
[Refer to the interactive Glossary section at /courses/teaming/glossary for full searchable terms.]`
  }
];
