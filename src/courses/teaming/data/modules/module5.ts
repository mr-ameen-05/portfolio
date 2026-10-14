import { ModuleData } from '../../types/course.types';

export const MODULE_5: ModuleData = {
  id: 'mod-05',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'red-team-assessment-contained-lab',
  title: 'Module 5 — Red Team Assessment in a Contained Lab',
  track: 'red',
  summary: 'Operate within an isolated, course-provided target sandbox, analyze pre-computed vulnerability scan results, safely validate an access control flaw, and construct a professional finding card.',
  orderIndex: 5,
  required: true,
  objectives: [
    'Verify lab boundaries and network isolation before initiating any technical evaluation.',
    'Analyze synthetic network and vulnerability scan outputs to formulate prioritized testing hypotheses.',
    'Safely validate a Broken Object Level Authorization (BOLA) weakness using synthetic test credentials.',
    'Capture cryptographically verified evidence using data minimization principles.',
    'Draft a production-grade Finding Card with severity rationale, reproduction steps, and remediation advice.'
  ],
  onePageCheatSheet: `### Module 5 Cheat Sheet: Contained Lab Validation & Finding Cards
- **Pre-Flight Verification:** Confirm you are connected to the isolated synthetic sandbox (\`*.sandbox.internal\`). Stop if any external IP is contacted.
- **Scan Result Analysis:** Do not blindly trust automated scanner outputs. Always verify:
  1. Is the port/endpoint actually reachable?
  2. Is the reported vulnerability a true positive or false positive?
  3. Does real business impact exist?
- **Finding Card Anatomy:**
  - Title: Clear, concise vulnerability description + affected component.
  - Severity: CVSS 3.1 Base Score + environmental impact context.
  - Evidence: Timestamped HTTP request/response with sensitive PII redacted.
  - Remediation: Practical code fix and architectural recommendation.`,
  lessons: [
    {
      id: 'lesson-05-01',
      moduleId: 'mod-05',
      slug: 'enter-isolated-target-verify-boundary',
      title: '5.1 Enter Course-Provided Isolated Target & Verify Boundary',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Before executing any technical test, a professional operator verifies that the environment in front of them is the designated authorized target. Accidentally testing the wrong host is a catastrophic operational failure.',
      objectives: [
        'Perform target verification steps (checking IP range, banner hashes, and sandbox tokens).',
        'Confirm network egress filtering prevents accidental traffic to public internet systems.',
        'Operate the lab reset and snapshot controls.'
      ],
      prerequisites: ['lesson-00-02', 'lesson-04-02'],
      keyTerms: [
        { term: 'Target Verification', definition: 'The mandatory operational procedure of cryptographically or contextually confirming that a system is the exact entity authorized in the scope of work.' },
        { term: 'Egress Filtering', definition: 'Network controls restricting outbound traffic from a lab or server to prevent unauthorized data exfiltration or unintended internet routing.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Pre-Flight Verification Checklist',
          content: `In professional operations, testers use a "Pre-Flight Checklist":
1. **IP Resolution Check:** Does \`target.sandbox.internal\` resolve strictly to the assigned local test IP (\`10.200.0.42\`)?
2. **Canary Verification Token:** Isolated training targets publish an intentional verification token on \`/canary.txt\` to confirm identity.
3. **Egress Isolation:** Verify that DNS queries or HTTP requests to external domains fail immediately, proving the sandbox cannot inadvertently route traffic to the open web.`
        }
      ],
      summaryTakeaways: [
        'Never send exploit payloads until target identity is cryptographically or contextually proven.',
        'Egress filtering guarantees no packets escape into production or the internet.',
        'Use the sandbox reset button whenever an experiment produces unpredictable state.'
      ],
      references: [
        { title: 'NIST SP 800-115 Section 4: Target Identification and Analysis', publisher: 'NIST', url: 'https://csrc.nist.gov/publications/detail/sp/800-115/final', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-05-02',
      moduleId: 'mod-05',
      slug: 'review-asset-inventory-test-hypotheses',
      title: '5.2 Review Asset Inventory and Identify Test Hypotheses',
      orderIndex: 2,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Scanning blindly wastes bandwidth and time. Reviewing the customer\'s asset inventory, architecture diagrams, and service listings allows testers to pinpoint high-probability exposure vectors.',
      objectives: [
        'Parse an asset inventory spreadsheet containing hosts, operating systems, and listening services.',
        'Correlate exposed services with known software vulnerabilities.',
        'Formulate three prioritized testing hypotheses.'
      ],
      prerequisites: ['lesson-05-01'],
      keyTerms: [
        { term: 'Asset Inventory', definition: 'A comprehensive catalog of all hardware, virtual machines, cloud instances, and software components owned by an organization.' },
        { term: 'Attack Vector', definition: 'The specific path or means by which an adversary gains unauthorized access to a computer or network to deliver a malicious outcome.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Synthetic Asset Inventory: "Apex Shipping Subnet"',
            datasetName: 'Apex-Asset-Inventory-v1',
            scenario: 'You are reviewing the authorized asset inventory for the Apex Shipping cluster.',
            syntheticData: `HOST ID    | IP ADDRESS   | OS / SERVICE           | EXPOSED ENDPOINTS            | TRUST ZONE
--------------------------------------------------------------------------------------------------
APEX-SRV-01 | 10.200.0.10  | Ubuntu 24.04 / Nginx   | Port 80, 443 (Public Portal) | DMZ
APEX-SRV-02 | 10.200.0.22  | Alpine / Node.js 20    | Port 3000 (Dispatch API)     | Internal App
APEX-SRV-03 | 10.200.0.50  | Debian / PostgreSQL 16 | Port 5432 (Postgres DB)      | Private Data`,
            analysisWalkthrough: [
              'Observation: APEX-SRV-02 exposes Node.js dispatch API directly to the internal subnet.',
              'Hypothesis: If APEX-SRV-01 proxies requests to APEX-SRV-02 without sanitizing path headers, an internal endpoint might be accessible via reverse proxy path traversal.',
              'Validation plan: Test proxy path mapping safely using test HTTP queries.'
            ],
            keyInsight: 'Correlating network tiers reveals where perimeter gateways connect to internal microservices.'
          }
        }
      ],
      summaryTakeaways: [
        'An asset inventory provides the map of the assessment terrain.',
        'Look for boundary transitions between DMZ proxies and internal APIs.',
        'Prioritize testing where sensitive business data intersects with user input.'
      ],
      references: [
        { title: 'CIS Control 1: Inventory and Control of Enterprise Assets', publisher: 'Center for Internet Security', url: 'https://www.cisecurity.org/controls/inventory-and-control-of-enterprise-assets', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-05-03',
      moduleId: 'mod-05',
      slug: 'analyze-supplied-scan-results',
      title: '5.3 Analyze Supplied Scan Results vs. Arbitrary Scanning',
      orderIndex: 3,
      estimatedMinutes: { reading: 14, practice: 20, total: 34 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Automated vulnerability scanners produce vast quantities of output filled with false positives, informational noise, and minor version banners. Analysts must filter scanner noise to isolate actionable weaknesses.',
      objectives: [
        'Interpret synthetic vulnerability scanner reports (Nessus/OpenVAS style).',
        'Identify false positives caused by backported patches and version banner masking.',
        'Extract high-confidence vulnerability indicators for manual validation.'
      ],
      prerequisites: ['lesson-05-02'],
      keyTerms: [
        { term: 'False Positive', definition: 'An alert or scanner finding that incorrectly indicates a vulnerability exists when the system is actually not vulnerable or properly mitigated.' },
        { term: 'Banner Grabbing', definition: 'A technique where a scanner inspects software version strings in service headers without verifying whether an actual vulnerability can be triggered.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Art of Scanner Output Triage',
          content: `Automated vulnerability scanners check version strings. If an Apache server reports version 2.4.52, the scanner flags CVE-2022-22720 as "High".

However, modern Linux distributions (Debian, Ubuntu, Red Hat) frequently **backport security patches** without updating the major version number. A banner scanner reports a vulnerability, but the vendor patch has already resolved the flaw.

### Manual Verification Workflow:
1. Review scanner report: Flagged finding = *Potential Hypothesis*.
2. Verify service configuration: Is the vulnerable feature or module actually enabled?
3. Execute non-destructive test: Verify if the system exhibits the flawed behavior.`
        }
      ],
      summaryTakeaways: [
        'Scanners produce hypotheses, not confirmed facts.',
        'Backported Linux patches frequently trick banner-based scanners into false positives.',
        'Manual verification confirms real exploitability and true business impact.'
      ],
      references: [
        { title: 'Debian Security FAQ: How does Debian handle security updates? (Backporting)', publisher: 'Debian Project', url: 'https://www.debian.org/security/faq#backport', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-05-04',
      moduleId: 'mod-05',
      slug: 'validate-finding-safely-contained-target',
      title: '5.4 Validate a Finding Safely in the Intentionally Vulnerable Target',
      orderIndex: 4,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Proving that a vulnerability exists must be done cleanly, reproducibly, and safely without crashing services, corrupting databases, or leaking unneeded data.',
      objectives: [
        'Execute a safe proof-of-concept validation for Broken Object Level Authorization (BOLA).',
        'Verify cross-account data exposure using synthetic test accounts (User A and User B).',
        'Capture complete, unedited HTTP transaction evidence.'
      ],
      prerequisites: ['lesson-05-03'],
      keyTerms: [
        { term: 'Proof of Concept (PoC)', definition: 'A non-destructive, repeatable demonstration showing that an alleged vulnerability can be successfully triggered.' },
        { term: 'Multi-Account Validation', definition: 'The testing methodology of using two authorized test accounts with identical privileges to prove horizontal authorization bypass.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Synthetic BOLA Validation Walkthrough',
            datasetName: 'Synthetic-BOLA-Evidence-v1',
            scenario: 'You are validating whether User A (analyst_alice) can view User B (manager_bob)\'s dispatch notes.',
            syntheticData: `REQUEST (Authenticated as analyst_alice):
GET /api/v1/dispatch/notes?ticket_id=8042 HTTP/1.1
Host: dispatch.sandbox.internal
Authorization: Bearer <token_for_alice>

RESPONSE (VULNERABLE):
HTTP/1.1 200 OK
Content-Type: application/json

{
  "ticket_id": 8042,
  "owner": "manager_bob@sandbox.internal",
  "cargo_type": "Pharmaceuticals",
  "driver_notes": "Gate code is 9942; driver confirmed route."
}`,
            analysisWalkthrough: [
              'Step 1: Authenticate as `analyst_alice` and observe her authorized ticket ID is `8041`.',
              'Step 2: Request ticket ID `8042`, which belongs to `manager_bob`.',
              'Step 3: Server returns ticket 8042 without validating that the authenticated session user matches the ticket owner.',
              'Conclusion: Confirmed Horizontal Broken Object Level Authorization (BOLA). Impact: Any authenticated user can read sensitive logistics notes for all other users.'
            ],
            keyInsight: 'Using two controlled test accounts provides definitive proof of authorization failure without touching unauthorized third-party records.'
          }
        }
      ],
      summaryTakeaways: [
        'Always validate authorization flaws using two controlled test accounts.',
        'Capture the exact HTTP request and response as unassailable proof.',
        'Stop after confirming the first record; do not exfiltrate bulk datasets.'
      ],
      references: [
        { title: 'OWASP Testing Guide: Testing for Insecure Direct Object References (WSTG-ATHZ-04)', publisher: 'OWASP', url: 'https://owasp.org/www-project-web-security-testing-guide/', lastReviewed: '2026-01-28' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-05-05',
      moduleId: 'mod-05',
      slug: 'record-evidence-assess-impact-finding-card',
      title: '5.5 Record Evidence, Assess Impact & Deliverable Finding Card',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Finding cards are the executive and technical summary units of security assessments. A well-written finding card gives developers everything needed to fix the root cause and provides leadership with clear risk context.',
      objectives: [
        'Draft a Finding Card adhering to the standard 6-part template.',
        'Calculate a defensible CVSS 3.1 base score for a horizontal authorization bypass.',
        'Propose an exact code-level remediation with architectural defense guidance.'
      ],
      prerequisites: ['lesson-05-04'],
      keyTerms: [
        { term: 'Finding Card', definition: 'A structured, single-issue security vulnerability report containing title, severity rationale, technical evidence, impact, reproduction steps, and remediation.' },
        { term: 'CVSS (Common Vulnerability Scoring System)', definition: 'An open industry standard for assessing the severity of computer system security vulnerabilities.' }
      ],
      sections: [
        {
          type: 'lab',
          labData: {
            id: 'lab-05-finding-card',
            title: 'Contained Lab: Finding Card Builder & BOLA Evidence Card Deliverable',
            environmentName: 'Vulnerability Reporting Studio Sandbox',
            scopeNotice: 'ATTENTION: Contained reporting exercise. Complete the finding card deliverable based on the confirmed synthetic BOLA vulnerability on the dispatch endpoint.',
            allowedActions: ['Draft finding card', 'Calculate CVSS score', 'Formulate remediation'],
            prohibitedActions: ['None - offline reporting tool'],
            stopConditions: ['None'],
            initialState: { deliverableSubmitted: false },
            instructions: [
              'Fill in the Finding Title: "Broken Object Level Authorization on Dispatch Notes API".',
              'Assign the verified CVSS score (Medium/High based on scope).',
              'Paste the sanitized HTTP proof-of-concept request and response.',
              'Submit the completed Finding Card for validation.'
            ],
            expectedResult: 'Finding Card validated with correct severity classification, reproduction steps, and prepared statement code remediation.',
            labType: 'finding_card'
          }
        }
      ],
      summaryTakeaways: [
        'A finding card must be reproducible by a developer without additional explanation.',
        'State impact objectively without inflating or minimizing risk.',
        'Provide actionable code remediations, not just "sanitize inputs".'
      ],
      references: [
        { title: 'FIRST: Common Vulnerability Scoring System v3.1 Specification', publisher: 'Forum of Incident Response and Security Teams', url: 'https://www.first.org/cvss/v3.1/specification-document', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-05',
    title: 'Module 5 Assessment: Contained Testing & Finding Validation',
    passingScore: 75,
    questions: [
      {
        id: 'q5-1',
        question: 'Why should a security tester verify target IP resolution and check for a designated canary token before executing assessment payloads?',
        choices: [
          'To ensure their internet connection has low latency.',
          'To guarantee with certainty that they are testing the authorized sandbox target and not inadvertently targeting production systems or an unintended third party.',
          'To bypass the target\'s intrusion detection system.',
          'To speed up automated vulnerability scanners.'
        ],
        correctIndex: 1,
        explanation: 'Target verification is the critical pre-flight check that prevents catastrophic testing of out-of-scope or third-party production infrastructure.'
      },
      {
        id: 'q5-2',
        question: 'An automated vulnerability scanner reports that an internal web server is vulnerable to an Apache remote code execution flaw based on header `Server: Apache/2.4.41`. How should the analyst proceed?',
        choices: [
          'Immediately declare a critical severity breach without testing.',
          'Verify if the underlying operating system vendor (e.g., Ubuntu/Debian) backported the security patch to that version release, and perform non-destructive behavioral testing to confirm.',
          'Delete the scanner report because automated tools are always 100% false positives.',
          'Shut down the web server immediately.'
        ],
        correctIndex: 1,
        explanation: 'Linux distributions regularly backport security fixes into existing version packages. Banner checks must be verified against vendor patch notes and tested non-destructively.'
      },
      {
        id: 'q5-3',
        question: 'When validating a suspected Broken Object Level Authorization (BOLA) vulnerability, what is the safest and most scientifically rigorous testing methodology?',
        choices: [
          'Write a script to iterate through 10,000 IDs and download all company records.',
          'Use two controlled, authorized test accounts (Account A and Account B) to verify if Account A can access an object explicitly owned by Account B.',
          'Ask the client for the production administrator password.',
          'Publish the finding on social media to see if others can reproduce it.'
        ],
        correctIndex: 1,
        explanation: 'Testing with two controlled test accounts proves horizontal privilege violation definitively while practicing data minimization and avoiding production exposure.'
      },
      {
        id: 'q5-4',
        question: 'Which of the following elements is ESSENTIAL for a high-quality Finding Card?',
        choices: [
          'Marketing buzzwords and dramatic threats of business collapse.',
          'Exact step-by-step reproduction instructions, sanitized request/response evidence, realistic impact assessment, and a practical remediation plan.',
          'A list of the attacker\'s favorite tools.',
          'The personal home address of the developer who wrote the code.'
        ],
        correctIndex: 1,
        explanation: 'High-quality finding cards focus on clarity, reproducible technical proof, objective impact, and engineering-ready remediation steps.'
      }
    ]
  }
};
