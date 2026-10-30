import { ModuleData } from '../../types/course.types';

export const MODULE_10: ModuleData = {
  id: 'mod-10',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'purple-team-capstone',
  title: 'Module 10 — Purple Team Capstone Exercise',
  track: 'purple',
  summary: 'Synthesize offensive analysis, defensive telemetry engineering, and collaborative communication into a dual-perspective capstone assessment on a fictional company sandbox.',
  orderIndex: 10,
  required: true,
  objectives: [
    'Execute Part A: Confirm legal scope, asset boundaries, and emergency stop conditions.',
    'Execute Part B: Validate an authorized seeded vulnerability in the isolated sandbox.',
    'Execute Part C: Inspect synthetic telemetry to identify the defensive visibility gap and draft a Sigma detection rule.',
    'Execute Part D: Propose root-cause engineering controls and design a retest verification plan.',
    'Execute Part E: Produce an Executive Summary, Technical Finding Card, and Limitations Reflection.',
    'Meet the Capstone Rubric requirements, including a mandatory 100% passing score on the Safety & Scope component.'
  ],
  onePageCheatSheet: `### Module 10 Cheat Sheet: Purple Team Capstone Rubric & Deliverables
- **Mandatory Gate:** Scope & Safety compliance must score 100% to pass the capstone regardless of other scores.
- **Part A (Scope):** Explicitly verify sandbox boundaries (\`10.200.0.0/24\`). Discard out-of-scope third-party vendor targets.
- **Part B (Offense):** Validate the seeded Broken Object Level Authorization (BOLA) weakness using synthetic test credentials. Record clean, minimized HTTP request/response evidence.
- **Part C (Defense):** Correlate the attack timestamp against the synthetic web and EDR logs. Identify why the existing rule failed to alert. Author a new Sigma detection rule.
- **Part D (Remediation):** Propose parameterized ORM query logic with ownership checks. Write an automated retest script specification.
- **Part E (Communication):** Author an Executive Summary for the C-suite and a Technical Finding for the engineering team.`,
  lessons: [
    {
      id: 'lesson-10-01',
      moduleId: 'mod-10',
      slug: 'capstone-scenario-scope-part-a',
      title: '10.1 Capstone Scenario Briefing & Scope Confirmation (Part A)',
      orderIndex: 1,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Before executing any assessment steps, the purple team lead confirms all legal scopes and boundaries. Real assessments begin with verified scope confirmation.',
      objectives: [
        'Analyze the fictional engagement brief for "Meridian Health Logistics".',
        'Verify in-scope IP targets (\`10.200.0.0/24\`) and flag excluded third-party SaaS portals.',
        'Complete the Capstone Scope Verification Checklist (Mandatory 100% requirement).'
      ],
      prerequisites: ['lesson-00-02', 'lesson-04-02', 'lesson-05-01'],
      keyTerms: [
        { term: 'Engagement Brief', definition: 'The foundational client document specifying business background, target assets, testing windows, and testing objectives.' },
        { term: 'Scope Verification Gate', definition: 'The mandatory safety compliance checkpoint that must be satisfied before any technical actions are authorized.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Capstone Scenario: Meridian Health Logistics',
          content: `You have been engaged by **Meridian Health Logistics**, a fictional healthcare supply chain provider.

### The Client Brief:
- **Client Organization:** Meridian Health Logistics
- **Authorized Target:** \`dispatch.meridian-hl.sandbox.internal\` (\`10.200.0.100\`)
- **Assigned Subnet:** \`10.200.0.0/24\` (Isolated Course Sandbox)
- **Explicit Exclusions:**
  - Payment gateway (\`payments.meridian-vendor.example\`)
  - Any IP outside \`10.200.0.0/24\`
  - Disruption of simulated refrigerator telemetry services
- **Objective:** Evaluate the security of the internal dispatch portal, inspect defensive logging fidelity, and collaborate with the engineering team to deploy verified defenses.`
        }
      ],
      summaryTakeaways: [
        'Confirm scope boundaries in writing before touching the lab.',
        'Excluded third-party systems are strictly off-limits.',
        'Safety compliance is a mandatory pass requirement for the capstone certificate.'
      ],
      references: [
        { title: 'Purple Team Exercise Framework (PTEF) v2', publisher: 'SANS Institute', url: 'https://www.sans.org/white-papers/purple-team-exercise-framework/', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-10-02',
      moduleId: 'mod-10',
      slug: 'capstone-offensive-validation-part-b',
      title: '10.2 Offensive Phase: Validate the Seeded Vulnerability (Part B)',
      orderIndex: 2,
      estimatedMinutes: { reading: 15, practice: 30, total: 45 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Executing the offensive phase safely in a contained sandbox models realistic adversary behavior while capturing precise, timestamped proof-of-concept evidence.',
      objectives: [
        'Authenticate as synthetic user `dispatcher_dan` on the sandbox portal.',
        'Execute a horizontal BOLA validation against patient delivery order `#5091`.',
        'Record sanitized HTTP request/response evidence adhering to data minimization.'
      ],
      prerequisites: ['lesson-10-01', 'lesson-05-04'],
      keyTerms: [
        { term: 'Seeded Weakness', definition: 'An intentional, isolated security vulnerability configured in a practice environment for educational detection and remediation testing.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Part B Evidence: BOLA on Delivery Orders Endpoint',
            datasetName: 'Meridian-BOLA-Evidence-v1',
            scenario: 'Dispatcher Dan accesses delivery order 5091 belonging to Regional Clinic North.',
            syntheticData: `REQUEST (Dispatcher Dan):
GET /api/v1/orders/details?order_id=5091 HTTP/1.1
Host: dispatch.meridian-hl.sandbox.internal
Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn... (dan_token)

RESPONSE (UNAUTHORIZED DATA RETURNED):
HTTP/1.1 200 OK
Content-Type: application/json

{
  "order_id": 5091,
  "facility": "Regional Clinic North",
  "contents": "Synthetic Insulin Shipment Batch #409",
  "access_pin": "8412",
  "assigned_dispatcher": "dispatcher_sarah@meridian-hl.sandbox.internal"
}`,
            analysisWalkthrough: [
              'Validation: Dispatcher Dan was able to view Sarah\'s shipment details and secure access PIN by changing the numeric parameter.',
              'Data Minimization: Only one record requested. PIN recorded in finding with middle digits masked (`8**2`).'
            ],
            keyInsight: 'Offensive validation proves the flaw exists without causing data corruption or service disruption.'
          }
        }
      ],
      summaryTakeaways: [
        'Document the exact timestamp of execution in UTC for blue team correlation.',
        'Stop after confirming the first record; do not iterate across the database.',
        'Mask sensitive synthetic tokens and credentials in report drafts.'
      ],
      references: [
        { title: 'OWASP API Security Top 10: API1:2023', publisher: 'OWASP', url: 'https://owasp.org/API-Security/', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-10-03',
      moduleId: 'mod-10',
      slug: 'capstone-defensive-telemetry-part-c',
      title: '10.3 Defensive Phase: Telemetry Analysis & Detection Engineering (Part C)',
      orderIndex: 3,
      estimatedMinutes: { reading: 15, practice: 30, total: 45 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Switching to the defender perspective, you analyze what the SIEM saw during the attack, explain why existing rules remained silent, and engineer high-fidelity detection logic.',
      objectives: [
        'Inspect the synthetic web server and application access logs during the Part B attack window.',
        'Identify the defensive visibility gap (why standard 403 error alerts did not trigger on HTTP 200 responses).',
        'Author an anomaly detection rule linking session identities with queried object IDs.'
      ],
      prerequisites: ['lesson-10-02', 'lesson-07-04'],
      keyTerms: [
        { term: 'Visibility Gap', definition: 'A blind spot in logging or detection coverage where adversary activity occurs without generating appropriate security alerts.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Analyzing the Defensive Blind Spot',
          content: `In the synthetic web log:
\`\`\`
10.200.0.50 - - [14/Oct/2026:14:02:11 +0000] "GET /api/v1/orders/details?order_id=5091 HTTP/1.1" 200 482
\`\`\`

### The Blue Team Discovery:
The SIEM was configured to alert on HTTP \`401 Unauthorized\` and \`403 Forbidden\` spikes. Because the application returned a \`200 OK\` status code with unauthorized data, the existing alert rule remained completely silent!

### The Detection Solution:
1. Log application-level authorization denials.
2. Monitor user session behavior: alert when a single user queries more than 5 distinct order IDs within 60 seconds without navigation referrers.`
        }
      ],
      summaryTakeaways: [
        'Attackers exploiting business logic flaws often generate legitimate HTTP 200 OK status codes.',
        'Network status codes are insufficient; application-level telemetry is required.',
        'Detection logic must account for user identity context.'
      ],
      references: [
        { title: 'Detecting Authorization Bypass with Behavioral Analytics', publisher: 'SANS Institute', url: 'https://www.sans.org/', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-10-04',
      moduleId: 'mod-10',
      slug: 'capstone-remediation-retest-plan-part-d',
      title: '10.4 Engineering Phase: Remediation & Retest Verification Plan (Part D)',
      orderIndex: 4,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Proposing a realistic fix requires software engineering empathy. You must provide a clean code patch that enforces authorization in the database query layer, plus a test to prove it works.',
      objectives: [
        'Refactor the vulnerable endpoint code to include tenancy ownership validation.',
        'Draft an automated unit/integration test verifying access denial for unauthorized IDs.',
        'Define a formal Retest Verification Plan.'
      ],
      prerequisites: ['lesson-10-03', 'lesson-03-02'],
      keyTerms: [
        { term: 'Tenancy Validation', definition: 'An architectural pattern where database queries automatically constrain record lookups to the tenant or user ID authenticated in the session token.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Remediation: Architecture-Level Tenancy Binding',
          content: `### Vulnerable Code:
\`\`\`typescript
// VULNERABLE: Queries purely by user-supplied order_id
const order = await db.orders.findOne({ where: { id: req.query.order_id } });
\`\`\`

### Remediated Code (Scoped to Authenticated User):
\`\`\`typescript
// SECURE: Enforces that order must belong to the requesting dispatcher's facility
const order = await db.orders.findOne({
  where: {
    id: req.query.order_id,
    facility_id: req.user.facility_id // Tenancy check enforced in query
  }
});
if (!order) {
  return res.status(404).json({ error: "Order not found" });
}
\`\`\``
        }
      ],
      summaryTakeaways: [
        'Enforce authorization directly in the database query layer.',
        'Return 404 Not Found rather than 403 Forbidden to prevent object ID enumeration.',
        'Automated regression tests ensure future code releases do not reintroduce the flaw.'
      ],
      references: [
        { title: 'OWASP Proactive Controls: Enforce Access Controls', publisher: 'OWASP', url: 'https://owasp.org/www-project-proactive-controls/', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-10-05',
      moduleId: 'mod-10',
      slug: 'capstone-reporting-reflection-part-e',
      title: '10.5 Executive Summary, Deliverable Submission & Reflection (Part E)',
      orderIndex: 5,
      estimatedMinutes: { reading: 20, practice: 40, total: 60 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'The final capstone deliverable brings together your offensive proof, defensive telemetry, remediation plan, and executive communication. This is your portfolio demonstration of full-spectrum cybersecurity proficiency.',
      objectives: [
        'Author an Executive Summary explaining technical findings in terms of business risk.',
        'Compile the complete Capstone Deliverable package adhering to the official grading rubric.',
        'Reflect on limitations and ethical responsibilities in cybersecurity practice.'
      ],
      prerequisites: ['lesson-10-04', 'lesson-06-01'],
      keyTerms: [
        { term: 'Executive Summary', definition: 'A high-level synthesis written for non-technical leadership outlining business risk, operational impact, and prioritized strategic recommendations.' }
      ],
      sections: [
        {
          type: 'lab',
          labData: {
            id: 'lab-10-capstone-workbench',
            title: 'Contained Lab: Purple Team Capstone Submission & Rubric Review',
            environmentName: 'Purple Team Capstone Studio Sandbox',
            scopeNotice: 'ATTENTION: Contained capstone workbench. Finalize your 5 deliverables (Scope Checklist, Finding Card, Detection Rule, Remediation Plan, Executive Summary) for rubric evaluation.',
            allowedActions: ['Verify scope checklist', 'Review finding card', 'Submit executive summary'],
            prohibitedActions: ['None - offline portfolio capstone studio'],
            stopConditions: ['None'],
            initialState: { capstoneComplete: false },
            instructions: [
              'Verify that Part A Scope Checklist passes 100% (Mandatory gate).',
              'Review your BOLA finding card with CVSS 6.5 (Medium/High).',
              'Review the Sigma detection rule for anomalous order enumeration.',
              'Submit the completed Capstone Package for automated rubric scoring.'
            ],
            expectedResult: 'Capstone verified with passing scores across Safety/Scope, Technical Reasoning, Evidence Quality, and Collaboration.',
            labType: 'purple_capstone'
          }
        }
      ],
      summaryTakeaways: [
        'Security professionals must translate technical weaknesses into strategic business priorities.',
        'Purple team collaboration strengthens defenses faster than siloed teams.',
        'Ethical commitment and continuous learning define long-term career success.'
      ],
      references: [
        { title: 'The Practical Purple Team Handbook', publisher: 'Al Ameen N R', url: 'https://aiameen.online/', lastReviewed: '2026-03-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-10',
    title: 'Module 10 Assessment: Purple Team Capstone Knowledge Check',
    passingScore: 80,
    questions: [
      {
        id: 'q10-1',
        isCriticalSafety: true,
        question: 'In the Capstone Scenario for Meridian Health Logistics, why was testing the third-party payment gateway (payments.meridian-vendor.example) strictly prohibited?',
        choices: [
          'Because the payment gateway uses slow internet connections.',
          'The payment gateway is owned and operated by an independent third-party vendor not authorized in Meridian\'s Scope of Work; testing it without direct written vendor authorization is illegal.',
          'Payment gateways cannot have security vulnerabilities.',
          'Because payment gateways only accept encrypted credit cards.'
        ],
        correctIndex: 1,
        explanation: 'Testing external third-party infrastructure without explicit written authorization from that third party violates legal boundaries and contracts.'
      },
      {
        id: 'q10-2',
        question: 'Why did the SIEM\'s automated alert rules fail to trigger when Dispatcher Dan exploited the BOLA weakness to view unauthorized order #5091?',
        choices: [
          'The web server was powered off during the test.',
          'The application returned a standard HTTP 200 OK status code with the data, whereas the SIEM was only monitoring for HTTP 401/403 status code spikes.',
          'The attacker used an encrypted VPN.',
          'The logs were deleted by the operating system.'
        ],
        correctIndex: 1,
        explanation: 'Business logic and authorization bypasses return HTTP 200 OK responses, rendering primitive HTTP error status code detection completely blind.'
      },
      {
        id: 'q10-3',
        question: 'What is the most secure architectural remediation for Broken Object Level Authorization on the order details endpoint?',
        choices: [
          'Hiding the order ID from the URL using an HTTP POST request.',
          'Enforcing tenancy checks directly in the database query (e.g., querying by both order_id AND authenticated facility_id) and returning 404 if no match exists.',
          'Base64 encoding the order number in the client browser.',
          'Asking dispatchers to promise not to change the order numbers.'
        ],
        correctIndex: 1,
        explanation: 'Enforcing the user\'s authorized tenant/facility ID directly in the database lookup query prevents access to unauthorized records regardless of parameter manipulation.'
      },
      {
        id: 'q10-4',
        question: 'Under the Capstone Rubric, what is the mandatory requirement regarding the Scope & Safety section?',
        choices: [
          'It is optional if the student receives an A on the technical exploit.',
          'It requires a mandatory 100% passing score; any safety or scope violation results in an immediate failing grade regardless of other scores.',
          'It only applies to graduate students.',
          'It can be replaced by writing a longer executive summary.'
        ],
        correctIndex: 1,
        explanation: 'The course specification mandates that legal authorization and safety boundaries are non-negotiable; passing the safety/scope check with 100% is strictly required.'
      }
    ]
  }
};
