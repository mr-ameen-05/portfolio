import { ModuleData } from '../../types/course.types';

export const MODULE_0: ModuleData = {
  id: 'mod-00',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'orientation-ethics-safe-practice',
  title: 'Module 0 — Orientation, Ethics, and Safe Practice',
  track: 'core',
  summary: 'Establish non-negotiable legal and ethical boundaries, understand rules of engagement, explore synthetic lab environments, and learn professional evidence handling.',
  orderIndex: 0,
  required: true,
  objectives: [
    'Define the legal and ethical boundaries separating authorized security testing from unauthorized access.',
    'Differentiate between in-scope targets, out-of-scope assets, and explicit stop conditions.',
    'Understand how synthetic datasets and isolated sandboxes protect real systems and privacy.',
    'Pass the mandatory Safety and Rules of Engagement verification check.'
  ],
  onePageCheatSheet: `### Module 0 Cheat Sheet: Rules of Engagement & Ethics
- **Golden Rule:** Authorization must be explicit, documented, and current. Assumptions are not permission.
- **Scope Documents:** Always specify IP ranges, domains, allowed methods, exclusions, testing windows, and escalation contacts.
- **Stop Conditions:** Immediately halt testing if you observe: out-of-scope systems, data destruction, service degradation, production customer data, or suspected active real intrusions.
- **Evidence Handling:** Practice data minimization. Hash sensitive artifacts, store logs securely, and never share client findings on public platforms.`,
  lessons: [
    {
      id: 'lesson-00-01',
      moduleId: 'mod-00',
      slug: 'how-to-use-this-course',
      title: '0.1 How to Use This Course, Learning Paths & Pacing',
      orderIndex: 1,
      estimatedMinutes: { reading: 10, practice: 15, total: 25 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Security is not a collection of disjointed tricks; it is a discipline combining deep foundational computing, adversarial hypothesis testing, and operational defense. Setting clear expectations ensures you progress safely and effectively.',
      objectives: [
        'Understand the structure of the 11 course modules across Core, Red, Blue, and Purple tracks.',
        'Estimate personal pacing (recommended 4–6 hours per week over 10–12 weeks).',
        'Learn how learner progress is tracked locally and verified on completion.'
      ],
      prerequisites: [],
      keyTerms: [
        { term: 'Red Teaming', definition: 'Goal-oriented, adversarial assessment simulating realistic threat actors to test an organization\'s detection, response, and resilience.' },
        { term: 'Blue Teaming', definition: 'The defensive security personnel responsible for proactive hardening, continuous telemetry monitoring, alert triage, and incident response.' },
        { term: 'Purple Teaming', definition: 'A collaborative methodology where offensive and defensive teams work in tandem to validate, measure, and improve detection coverage and controls.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Course Philosophy: Defense Through Deep Understanding',
          content: `Welcome to **Practical Cybersecurity: Red Teaming, Blue Teaming, and Purple Teaming**.

In modern organizations, attackers and defenders frequently speak different languages. Red teams often report isolated weaknesses without contextualizing detection realities, while blue teams configure rules without fully understanding how adversaries navigate real environments.

This course bridges that gap. By studying computing fundamentals, offensive planning, defensive telemetry, and collaborative purple team validation, you develop a unified mental model of cybersecurity engineering.

### The Four Tracks:
1. **Core Foundations (Modules 0–3):** Ethics, networking, operating systems, threat modeling, and web architecture.
2. **Red Team Track (Modules 4–6):** Scoping, reconnaissance, hypothesis-driven testing in isolated labs, and professional reporting.
3. **Blue Team Track (Modules 7–9):** Security operations, telemetry pipelines, log analysis, alert triage, incident response, and resilience.
4. **Purple Team Capstone (Module 10):** A dual-perspective assessment testing a fictional organization's infrastructure from both angles.`
        },
        {
          type: 'diagram',
          title: 'Course Curriculum Architecture',
          diagramAscii: `
  +-------------------------------------------------------------+
  |              CORE FOUNDATIONS (Modules 0 - 3)              |
  |  Ethics & ROE -> Systems & CLI -> Threat Model -> Web Sec   |
  +-------------------------------------------------------------+
               /                                  \\
              v                                    v
  +--------------------------+       +--------------------------+
  |    RED TEAM TRACK        |       |    BLUE TEAM TRACK       |
  |   (Modules 4 - 6)        |       |   (Modules 7 - 9)        |
  | - Plan & Reconnaissance  | <---> | - Telemetry & Detection  |
  | - Contained Lab Testing  |       | - Triage & IR Lifecycle  |
  | - Professional Reporting |       | - Hardening & Resilience |
  +--------------------------+       +--------------------------+
               \\                                  /
                v                                v
  +-------------------------------------------------------------+
  |         PURPLE TEAM CAPSTONE EXERCISE (Module 10)           |
  | Dual-Perspective Assessment, Detection Tuning & Reflection  |
  +-------------------------------------------------------------+`,
          diagramAltText: 'ASCII diagram showing Core Foundations feeding into Red Team and Blue Team tracks simultaneously, culminating in the unified Purple Team Capstone.'
        }
      ],
      summaryTakeaways: [
        'Cybersecurity requires dual-perspective literacy: understanding both how controls are built and how they are challenged.',
        'Pacing is self-directed; 4–6 hours per week allows deep exploration of the hands-on labs.',
        'All technical exercises are sandboxed and offline.'
      ],
      references: [
        { title: 'NIST Special Publication 800-115: Technical Guide to Information Security Testing', publisher: 'National Institute of Standards and Technology', url: 'https://csrc.nist.gov/publications/detail/sp/800-115/final', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-00-02',
      slug: 'authorization-scope-rules-of-engagement',
      moduleId: 'mod-00',
      title: '0.2 Authorization, Scope, Rules of Engagement & Stop Conditions',
      orderIndex: 2,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'The sole boundary separating a cybersecurity analyst from a cybercriminal is legal, explicit, and written authorization. Understanding rules of engagement protects both you and the organizations you assess.',
      objectives: [
        'Distinguish between in-scope, out-of-scope, and gray-area assets in a security contract.',
        'Enumerate standard Rules of Engagement (ROE) clauses including hours, allowed tools, and emergency contacts.',
        'Identify unambiguous stop conditions that require immediate testing cessation and client notification.'
      ],
      prerequisites: ['lesson-00-01'],
      keyTerms: [
        { term: 'Rules of Engagement (ROE)', definition: 'A formally signed agreement between the client and assessment team defining targets, methods, limitations, emergency contacts, and operational hours.' },
        { term: 'Scope of Work (SOW)', definition: 'The specific technical boundary (IP ranges, domain names, physical locations, user accounts) that may be evaluated.' },
        { term: 'Stop Condition', definition: 'A predetermined critical threshold or unexpected event (such as encountering production medical systems or real malicious intrusions) where all activity halts immediately.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Legal Foundation of Security Testing',
          content: `In every legal jurisdiction, accessing or attempting to evaluate a computer system without explicit owner authorization is a serious crime under statutes such as the United States Computer Fraud and Abuse Act (CFAA), the UK Computer Misuse Act, and equivalent global frameworks.

### Anatomy of a Rules of Engagement Document
Before sending a single network packet, professional practitioners insist on:
1. **Identified Stakeholders:** Signature from an executive with legal authority to authorize access (e.g., CISO, VP of Engineering).
2. **Explicit Target List:** Specific CIDR blocks, hostnames, and application endpoints.
3. **Blacklisted / Excluded Targets:** Third-party cloud SaaS, payment gateways, shared staging environments, and employee personal devices.
4. **Authorized Windows:** Permitted execution times (e.g., business hours vs. off-peak maintenance windows).
5. **Prohibited Techniques:** Denials of Service (DoS), brute force against shared SSO, social engineering of critical infrastructure operators.
6. **Emergency Escalation Contacts:** 24/7 phone numbers for security operations and engineering leadership.

### Non-Negotiable Stop Conditions
Testing must cease instantly if any of the following occur:
- An IP address or host is found to belong to a third party or vendor not named in the scope agreement.
- Unintended denial-of-service or service instability is detected.
- Evidence of an existing, unauthorized real-world attacker is uncovered on the target.
- Sensitive regulatory data (PCI card numbers, patient health records) is unexpectedly encountered.`
        },
        {
          type: 'example',
          exampleData: {
            title: 'Synthetic ROE Scope Analysis: Fictional Acme Logistics',
            datasetName: 'Acme-ROE-Synthetic-v1',
            scenario: 'You are reviewing a draft assessment agreement for Acme Logistics Corp.',
            syntheticData: `ASSESSMENT CONTRACT: ACME LOGISTICS CORP (SYNTHETIC)
IN-SCOPE TARGETS:
- 198.51.100.0/28 (Acme Internal Staging Cluster)
- app-staging.acmelogistics.example.internal

EXCLUDED TARGETS (OUT OF SCOPE):
- 198.51.100.254 (Shared ISP Gateway Router)
- *.prod.acmelogistics.example.internal
- All third-party logistics SaaS portals (carrier-dispatch.vendor.example)

TESTING WINDOW: Monday - Thursday, 20:00 - 04:00 UTC
EMERGENCY CONTACT: Security Operations Lead: 555-0199 / soc@acmelogistics.example.internal`,
            analysisWalkthrough: [
              'Target 198.51.100.5 is in-scope because it falls within the authorized /28 staging subnet.',
              'Target 198.51.100.254 is explicitly prohibited by the exclusion list even though it resides in the same overall IP block.',
              'Attempting tests at 14:00 UTC violates the operational window clause and is considered unauthorized activity.',
              'Testing carrier-dispatch.vendor.example without written third-party vendor consent is illegal.'
            ],
            keyInsight: 'Never infer authorization from proximity. If an IP is adjacent to an in-scope system, it remains strictly off-limits unless explicitly listed in writing.'
          }
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-00-scope-check',
            title: 'Contained Lab: Scope & Rules of Engagement Verification',
            environmentName: 'Acme Logistics ROE Simulator',
            scopeNotice: 'ATTENTION: This lab is an isolated, synthetic exercise. You will evaluate 4 prospective assessment actions against the provided synthetic engagement contract.',
            allowedActions: ['Inspect synthetic targets', 'Categorize action permissions', 'Evaluate stop conditions'],
            prohibitedActions: ['Interacting with any external IP', 'Scanning unauthorized networks'],
            stopConditions: ['Target belongs to third-party vendor', 'Production database connection observed'],
            initialState: {
              contractLoaded: true,
              actionsReviewed: 0
            },
            instructions: [
              'Review Action 1: Sending test queries to app-staging.acmelogistics.example.internal at 22:00 UTC.',
              'Review Action 2: Running vulnerability scanner on carrier-dispatch.vendor.example.',
              'Review Action 3: Port scanning 198.51.100.254 during the permitted window.',
              'Review Action 4: Halting operations upon discovering an active unauthorized shell on 198.51.100.4.'
            ],
            expectedResult: 'All 4 operational decisions correctly mapped to: Allowed, Prohibited, Prohibited, and Mandated Stop Condition.',
            labType: 'scope_review'
          }
        }
      ],
      summaryTakeaways: [
        'Written authorization signed by authorized stakeholders is required before any technical assessment begins.',
        'Exclusions and testing windows must be honored as strictly as target boundaries.',
        'Stop conditions protect business continuity and preserve legal integrity.'
      ],
      references: [
        { title: 'SANS Penetration Testing Rules of Engagement Worksheet', publisher: 'SANS Institute', url: 'https://www.sans.org/white-papers/34720/', lastReviewed: '2026-02-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-00-03',
      slug: 'safe-lab-environments-synthetic-data',
      moduleId: 'mod-00',
      title: '0.3 Safe Lab Environments, Synthetic Data & Responsible Disclosure',
      orderIndex: 3,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Practicing on real systems or with real personal data exposes learners and organizations to severe risks. Utilizing synthetic datasets, mock environments, and standard disclosure workflows provides realistic learning with zero collateral risk.',
      objectives: [
        'Explain why synthetic data is mandated for all educational demonstrations.',
        'Understand how containerized and virtualized labs isolate network traffic.',
        'Summarize the core tenets of coordinated and responsible vulnerability disclosure.'
      ],
      prerequisites: ['lesson-00-02'],
      keyTerms: [
        { term: 'Synthetic Data', definition: 'Artificially generated data that mimics the statistical properties and schema of real-world datasets without containing any real personal or confidential information.' },
        { term: 'Air-Gapped / Isolated Sandbox', definition: 'A segmented network environment with no routing to the public internet, preventing any outbound requests or cross-system leakage.' },
        { term: 'Coordinated Vulnerability Disclosure (CVD)', definition: 'A structured process where a security researcher privately notifies an asset owner of a flaw, giving them reasonable time to patch prior to public disclosure.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Sanctity of Isolated Sandboxes',
          content: `In this portfolio course, **every single practice environment is isolated, synthetic, and resettable**.

### Principles of Contained Security Learning:
1. **Zero Real-Target Probing:** You will never be asked to test or scan a live Internet IP, website, or service.
2. **Deterministic Synthetic Scenarios:** Network logs, employee records, web endpoints, and telemetry events are artificially generated to demonstrate underlying security principles clearly.
3. **Resettability:** Contained labs maintain an ephemeral state. If an experiment crashes or produces unexpected behavior, a single click restores the pristine baseline.

### Responsible and Coordinated Disclosure
If you discover a legitimate security vulnerability in an open-source project or authorized program outside this course:
- Report the vulnerability privately through official security channels (e.g., \`security@organization.com\` or \`security.txt\`).
- Provide clear reproduction steps and minimize data extraction.
- Allow vendor engineers standard remediation time (typically 60–90 days).
- Never extort or demand payment in exchange for withholding information.`
        }
      ],
      summaryTakeaways: [
        'Isolated sandboxes eliminate accidental damage to real infrastructure.',
        'Synthetic data preserves privacy while providing realistic learning fidelity.',
        'Vulnerability reporting requires private, professional, coordinated disclosure.'
      ],
      references: [
        { title: 'ISO/IEC 29147: Information technology — Security techniques — Vulnerability disclosure', publisher: 'International Organization for Standardization', url: 'https://www.iso.org/standard/72311.html', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-00-04',
      slug: 'evidence-handling-privacy-professional-communication',
      moduleId: 'mod-00',
      title: '0.4 Evidence Handling, Privacy & Professional Communication',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Security findings are only as valuable as the evidence supporting them and the clarity with which they are communicated. Sloppy evidence handling compromises investigations and damages trust.',
      objectives: [
        'Apply the principle of data minimization when documenting security observations.',
        'Maintain cryptographic chain of custody for digital evidence.',
        'Communicate technical risk objectively without hyperbole or fear-mongering.'
      ],
      prerequisites: ['lesson-00-03'],
      keyTerms: [
        { term: 'Data Minimization', definition: 'The practice of collecting and retaining only the minimal amount of sensitive data strictly necessary to prove a security finding.' },
        { term: 'Chain of Custody', definition: 'A chronological, verifiable paper or cryptographic trail documenting the receipt, custody, transfer, analysis, and disposition of digital evidence.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Evidence Preservation and Professionalism',
          content: `When a red team validates a flaw or a blue team captures incident telemetry, the integrity of the data is paramount.

### Data Minimization in Practice
- **Proof of Concept:** If you demonstrate that a database endpoint allows unauthorized queries, query \`SELECT version()\` or count synthetic records. **Never** dump customer tables or personally identifiable information (PII).
- **Screenshots & Logs:** Redact API tokens, session cookies, and credentials from report screenshots before distributing to stakeholders.
- **Hash Integrity:** Calculate SHA-256 hashes of disk images, memory dumps, and captured packet traces upon acquisition to prove evidence has not been altered.`
        }
      ],
      summaryTakeaways: [
        'Collect only the minimal evidence required to demonstrate impact.',
        'Maintain integrity via cryptographic hashing and secure storage.',
        'State findings objectively with verified technical evidence.'
      ],
      references: [
        { title: 'RFC 3227: Guidelines for Evidence Collection and Archiving', publisher: 'Internet Engineering Task Force', url: 'https://www.rfc-editor.org/rfc/rfc3227', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-00-safety-check',
    title: 'Module 0: Mandatory Safety & Rules of Engagement Verification',
    passingScore: 100,
    requiresSafetyPass: true,
    questions: [
      {
        id: 'q0-1',
        isCriticalSafety: true,
        question: 'Under what condition is it legally and ethically permissible to perform security vulnerability testing against a web application?',
        choices: [
          'Whenever an application is publicly reachable on the open internet.',
          'Only when explicit, written authorization has been granted by the legal asset owner with a signed Scope of Work.',
          'Whenever you suspect an application has a known vulnerability that needs fixing.',
          'If you promise not to damage any files or alter databases during testing.'
        ],
        correctIndex: 1,
        explanation: 'Explicit, written authorization from the verified legal asset owner is the only legal basis for security testing. Public accessibility or good intentions do not grant permission.'
      },
      {
        id: 'q0-2',
        isCriticalSafety: true,
        question: 'While conducting an authorized penetration test on an assigned staging subnet, you discover that a sub-domain resolves to an external cloud vendor hosting production customer records. What is your immediate obligation?',
        choices: [
          'Quickly scan the vendor target to see if it shares the same staging passwords.',
          'Extract a small sample of production records to prove cross-environment linkage to the client.',
          'Immediately halt testing against that target, check the scope exclusions, and notify client leadership via emergency contacts.',
          'Ignore the vendor target and delete your scan logs so no one notices.'
        ],
        correctIndex: 2,
        explanation: 'Encountering third-party or production targets outside the agreed scope triggers an immediate stop condition. You must halt testing on that system and report the boundary ambiguity through official emergency channels.'
      },
      {
        id: 'q0-3',
        isCriticalSafety: true,
        question: 'What is the primary rationale for using synthetic datasets rather than production data copies in course exercises and test labs?',
        choices: [
          'Synthetic data is faster to download because it is always compressed.',
          'Synthetic data eliminates the risk of privacy violations, real credential leakage, and compliance breaches while preserving realistic structure.',
          'Production data cannot be parsed by standard command-line tools.',
          'Synthetic data is required only for junior analysts; senior practitioners always practice on real systems.'
        ],
        correctIndex: 1,
        explanation: 'Synthetic data guarantees that no real personal information, intellectual property, or production credentials can be exposed or misused during learning and testing.'
      },
      {
        id: 'q0-4',
        isCriticalSafety: true,
        question: 'When submitting a confirmed vulnerability finding to an engineering team, what does the principle of "Data Minimization" require?',
        choices: [
          'Writing the shortest possible report without any technical reproduction steps.',
          'Extracting and documenting only the minimum evidence necessary to prove the weakness exists, redacting extraneous sensitive data.',
          'Excluding all screenshots and network logs from the report.',
          'Waiting until the end of the year to submit findings.'
        ],
        correctIndex: 1,
        explanation: 'Data minimization mandates collecting and retaining only what is strictly necessary to demonstrate the finding, while masking or redacting any collateral sensitive data.'
      }
    ]
  }
};
