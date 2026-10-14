import { ModuleData } from '../../types/course.types';

export const MODULE_2: ModuleData = {
  id: 'mod-02',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'security-foundations-threat-thinking',
  title: 'Module 2 — Security Foundations and Threat Thinking',
  track: 'core',
  summary: 'Deconstruct the CIA triad, analyze risk models, differentiate authentication from authorization, and construct actionable threat models for web architectures.',
  orderIndex: 2,
  required: true,
  objectives: [
    'Define Confidentiality, Integrity, and Availability with concrete technical tradeoffs.',
    'Calculate risk as a function of threat actor capability, system vulnerability, likelihood, and business impact.',
    'Distinguish between authentication (AuthN) and authorization (AuthZ).',
    'Classify security controls into preventive, detective, and corrective categories.',
    'Build a structured threat model for a web application using STRIDE methodology.'
  ],
  onePageCheatSheet: `### Module 2 Cheat Sheet: Threat Modeling & Controls
- **CIA Triad:**
  - Confidentiality: Only authorized entities read data (encryption, access controls).
  - Integrity: Data cannot be altered without detection (hashing, digital signatures).
  - Availability: Systems and data remain accessible when needed (redundancy, DDoS mitigation).
- **Risk Equation:** Risk = (Threat x Vulnerability x Likelihood) x Impact.
- **Control Types:**
  - Preventive: Stops attack before occurrence (input validation, firewalls).
  - Detective: Identifies attack in progress or after fact (SIEM, audit logs).
  - Corrective: Restores safe state post-incident (backups, automated isolation).
- **STRIDE:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.`,
  lessons: [
    {
      id: 'lesson-02-01',
      moduleId: 'mod-02',
      slug: 'cia-assets-trust-boundaries',
      title: '2.1 Confidentiality, Integrity, Availability: Assets & Trust Boundaries',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Every security control exists to protect one or more facets of the CIA triad across defined trust boundaries. Without clear boundaries, security investments are unfocused.',
      objectives: [
        'Map real-world security failure modes to Confidentiality, Integrity, or Availability breaches.',
        'Identify assets and classify them by business criticality.',
        'Draw and defend trust boundaries between untrusted users, application tiers, and internal databases.'
      ],
      prerequisites: ['lesson-01-03'],
      keyTerms: [
        { term: 'Trust Boundary', definition: 'A perimeter across which data or execution transitions from a less-trusted level of control to a more-trusted level (e.g., public internet to private VPC).' },
        { term: 'Attack Surface', definition: 'The total sum of all network endpoints, open ports, APIs, and interfaces exposed to potential adversaries.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Core Pillars of Information Security',
          content: `Security engineering begins with three fundamental goals:
1. **Confidentiality:** Preventing unauthorized disclosure of data.
2. **Integrity:** Ensuring data and computation are authentic, accurate, and protected against unauthorized modification.
3. **Availability:** Ensuring timely, reliable access to resources for authorized users.

### Trust Boundaries
A trust boundary marks where two systems with different privilege levels communicate. When an untrusted browser sends JSON to an API server, data crosses a trust boundary. All data crossing a trust boundary must be validated, sanitized, and authenticated.`
        }
      ],
      summaryTakeaways: [
        'Security decisions trace back to protecting Confidentiality, Integrity, or Availability.',
        'Trust boundaries dictate where verification and sanitization must occur.',
        'Never trust client-side claims without server-side validation.'
      ],
      references: [
        { title: 'NIST Computer Security Resource Center: CIA Triad', publisher: 'NIST', url: 'https://csrc.nist.gov/glossary/term/cia_triad', lastReviewed: '2026-01-12' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-02-02',
      moduleId: 'mod-02',
      slug: 'threat-vulnerability-likelihood-impact-risk',
      title: '2.2 Threat, Vulnerability, Likelihood, Impact, and Risk',
      orderIndex: 2,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Vulnerabilities alone do not determine priority. Understanding business likelihood and real impact prevents panic over theoretical flaws and focuses engineering on high-risk exposures.',
      objectives: [
        'Differentiate between threats (actors/events), vulnerabilities (flaws), and risks (probable loss).',
        'Quantify risk using standard matrices: Risk = Likelihood × Impact.',
        'Avoid common risk inflation pitfalls during security assessments.'
      ],
      prerequisites: ['lesson-02-01'],
      keyTerms: [
        { term: 'Threat', definition: 'Any circumstance or event with the potential to adversely impact an asset through unauthorized access, destruction, or disruption.' },
        { term: 'Vulnerability', definition: 'A weakness in an information system, security procedure, internal control, or implementation that can be exploited by a threat source.' },
        { term: 'Risk', definition: 'The potential loss or harm resulting from a threat exploiting a vulnerability given its likelihood and business impact.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Calculus of Risk Management',
          content: `A vulnerability in an isolated, non-networked staging system has low risk because likelihood is near zero. The identical flaw exposed on an internet-facing payment portal has critical risk because both likelihood and impact are severe.

$$Risk = Likelihood \\times Impact$$

- **Likelihood:** Considers discoverability, exploit complexity, required privileges, and adversary motivation.
- **Impact:** Considers financial loss, operational downtime, reputational damage, and regulatory penalties.`
        }
      ],
      summaryTakeaways: [
        'A bug is not automatically a critical risk without verified likelihood and impact.',
        'Threat actors exploit vulnerabilities to create risk.',
        'Security resources must be allocated to where risk is highest.'
      ],
      references: [
        { title: 'NIST SP 800-30 Rev. 1: Guide for Conducting Risk Assessments', publisher: 'NIST', url: 'https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-02-03',
      moduleId: 'mod-02',
      slug: 'authentication-authorization-least-privilege',
      title: '2.3 Authentication, Authorization, Sessions & Least Privilege',
      orderIndex: 3,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Confusing who a user is (AuthN) with what they are allowed to do (AuthZ) is among the most prolific sources of critical web vulnerabilities, leading directly to Broken Object Level Authorization (BOLA).',
      objectives: [
        'Distinguish Authentication (identity verification) from Authorization (permission enforcement).',
        'Analyze session tokens, JWTs, and secure cookie storage.',
        'Explain role-based access control (RBAC) and attribute-based access control (ABAC).'
      ],
      prerequisites: ['lesson-02-02'],
      keyTerms: [
        { term: 'Authentication (AuthN)', definition: 'The process of verifying that an entity is who they claim to be (e.g., verifying a password or biometric signature).' },
        { term: 'Authorization (AuthZ)', definition: 'The process of verifying whether an authenticated entity has permission to perform a specific action on a requested resource.' },
        { term: 'BOLA / IDOR', definition: 'Broken Object Level Authorization (formerly Insecure Direct Object Reference) where an endpoint fails to check if the caller owns the requested object identifier.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'AuthN vs. AuthZ in Modern Systems',
          content: `Consider an API request:
\`GET /api/v1/invoices/1042\`
Header: \`Authorization: Bearer <valid_jwt_for_user_bob>\`

- **Authentication succeeds:** The token signature is valid, confirming the user is Bob.
- **Authorization check:** Does Bob have permission to read invoice \`1042\` (which belongs to Alice)?
If the application returns the invoice without verifying tenancy ownership, it has a critical **Broken Object Level Authorization (BOLA)** vulnerability.`
        }
      ],
      summaryTakeaways: [
        'Authentication answers "Who are you?"; Authorization answers "What can you access?".',
        'Valid credentials do not grant universal access.',
        'Every object access requires an explicit ownership or role check.'
      ],
      references: [
        { title: 'OWASP API Security Top 10: API1:2023 Broken Object Level Authorization', publisher: 'OWASP Foundation', url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/', lastReviewed: '2026-01-25' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-02-04',
      moduleId: 'mod-02',
      slug: 'preventive-detective-corrective-controls',
      title: '2.4 Security Controls: Preventive, Detective, and Corrective',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'No single control prevents every attack. Defense-in-depth requires layered controls across preventive barriers, detective telemetry, and corrective recovery procedures.',
      objectives: [
        'Classify security measures into preventive, detective, and corrective categories.',
        'Design defense-in-depth architectures where the failure of one control does not cause system compromise.',
        'Analyze how compensating controls reduce residual risk.'
      ],
      prerequisites: ['lesson-02-03'],
      keyTerms: [
        { term: 'Defense in Depth', definition: 'A security strategy employing multiple redundant defensive layers so that the failure of any single mechanism is compensated by others.' },
        { term: 'Compensating Control', definition: 'An alternative security measure deployed to meet the intent of a requirement when a primary control is technically unfeasible.' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'Defense in Depth Layered Security Hierarchy',
          diagramAscii: `
  [ ATTACKER ]
       |
       v
  +----------------------------------------------------+
  | 1. PREVENTIVE CONTROLS                             |
  |    - Web Application Firewall (WAF)                |
  |    - Multi-Factor Authentication (MFA)             |
  |    - Parameterized SQL Queries & Input Validation  |
  +----------------------------------------------------+
       |  (If preventive control fails or is bypassed)
       v
  +----------------------------------------------------+
  | 2. DETECTIVE CONTROLS                              |
  |    - Host-based Audit Logs (Auditd, Sysmon)        |
  |    - SIEM Rule: >5 failed logins from single IP    |
  |    - Network Flow & Anomaly Alarms                 |
  +----------------------------------------------------+
       |  (Alert triggers incident response)
       v
  +----------------------------------------------------+
  | 3. CORRECTIVE CONTROLS                             |
  |    - Automated Token Revocation & Account Lockout  |
  |    - Container Isolation / Network Quarantine      |
  |    - Clean Database Backup Restoration             |
  +----------------------------------------------------+`,
          diagramAltText: 'ASCII diagram showing layered security: Preventive controls block attacks, Detective controls alert when bypassed, and Corrective controls remediate impact.'
        }
      ],
      summaryTakeaways: [
        'Preventive controls reduce likelihood.',
        'Detective controls reduce dwell time and enable rapid triage.',
        'Corrective controls restore normal operations and limit impact.'
      ],
      references: [
        { title: 'Center for Internet Security (CIS) Critical Security Controls v8', publisher: 'CIS', url: 'https://www.cisecurity.org/controls', lastReviewed: '2026-02-05' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-02-05',
      moduleId: 'mod-02',
      slug: 'threat-modeling-fictional-portfolio-webapp',
      title: '2.5 Threat Modeling a Fictional Portfolio Web Application',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Threat modeling allows engineers to identify security design flaws during design before writing code, systematically testing assumptions using frameworks like STRIDE.',
      objectives: [
        'Apply the STRIDE threat mnemonic (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).',
        'Create a Data Flow Diagram (DFD) indicating processes, data stores, external entities, and trust boundaries.',
        'Draft threat mitigation proposals for each identified threat.'
      ],
      prerequisites: ['lesson-02-04'],
      keyTerms: [
        { term: 'STRIDE', definition: 'A threat modeling methodology developed at Microsoft categorizing threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.' },
        { term: 'Data Flow Diagram (DFD)', definition: 'A graphical representation tracing the flow of data through an information system across processes, data stores, and boundaries.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'STRIDE Threat Model for Portfolio Contact Form & Admin API',
            datasetName: 'Portfolio-App-DFD-v1',
            scenario: 'You are analyzing the threat model of a portfolio web application containing a contact API and authenticated admin project editor.',
            syntheticData: `COMPONENTS & TRUST BOUNDARIES:
[External Visitor Browser] ---> (Public Internet) ---> [Vite/PHP Web Server]
[Vite/PHP Web Server]      ---> (Internal IPC)     ---> [Local Mail Log / SQLite DB]

IDENTIFIED THREATS:
1. S (Spoofing): Attacker crafts fake contact submissions impersonating a VIP client.
2. T (Tampering): Attacker sends malformed payloads to corrupt the local contact log file.
3. R (Repudiation): Admin modifies a project post but system lacks audit logs to prove who edited it.
4. I (Info Disclosure): Web server serves raw .git folder or .env secrets to public HTTP requests.
5. D (Denial of Service): Attacker floods contact.php with 1,000 requests/second, exhausting disk space.
6. E (Elevation of Privilege): Normal visitor crafts payload to access admin project deletion API.`,
            analysisWalkthrough: [
              'Mitigate Spoofing with email validation and CAPTCHA rate-limiting.',
              'Mitigate Tampering with parameterized inputs and sanitized strings.',
              'Mitigate Repudiation with append-only tamper-evident audit logging.',
              'Mitigate Information Disclosure by configuring web server to forbid dotfiles (`.env`, `.git`).',
              'Mitigate DoS using IP rate limits and request size boundaries.',
              'Mitigate Elevation of Privilege with server-side role authorization on all mutation endpoints.'
            ],
            keyInsight: 'Threat modeling asks: What are we building? What can go wrong? What are we going to do about it? Did we do a good job?'
          }
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-02-threat-model',
            title: 'Contained Lab: Threat Model Worksheet & Control Selection',
            environmentName: 'Threat Modeling Studio Sandbox',
            scopeNotice: 'ATTENTION: Contained scenario analysis. Review the synthetic data flow diagram and map the correct STRIDE categories to recommended controls.',
            allowedActions: ['Inspect DFD entities', 'Assign STRIDE categories', 'Map preventive/detective controls'],
            prohibitedActions: ['None - offline analytical lab'],
            stopConditions: ['None'],
            initialState: { componentsMapped: 0 },
            instructions: [
              'Identify the threat category for: An unauthorized user reading private draft journal articles.',
              'Identify the threat category for: An attacker forging the sender address on contact notifications.',
              'Select the appropriate preventive and detective controls for both scenarios.'
            ],
            expectedResult: 'Information Disclosure and Spoofing accurately classified with TLS, RBAC, and rate-limiting controls applied.',
            labType: 'threat_model'
          }
        }
      ],
      summaryTakeaways: [
        'Threat modeling proactively identifies flaws before deployment.',
        'STRIDE provides comprehensive coverage across six major failure categories.',
        'Every identified threat requires an associated, testable control.'
      ],
      references: [
        { title: 'OWASP Threat Modeling Cheat Sheet', publisher: 'OWASP Foundation', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-02',
    title: 'Module 2 Assessment: Security Foundations & Threat Modeling',
    passingScore: 75,
    questions: [
      {
        id: 'q2-1',
        question: 'An attacker uses automated software to send 50,000 requests per second to a web application, causing CPU exhaustion and preventing legitimate users from loading pages. Which pillar of the CIA triad has been primarily breached?',
        choices: [
          'Confidentiality',
          'Integrity',
          'Availability',
          'Non-repudiation'
        ],
        correctIndex: 2,
        explanation: 'Denial of Service attacks target Availability by exhausting system resources so legitimate users cannot access the service.'
      },
      {
        id: 'q2-2',
        question: 'Which of the following represents an Authorization (AuthZ) failure rather than an Authentication (AuthN) failure?',
        choices: [
          'A user logs in using a compromised password without two-factor authentication.',
          'An authenticated regular user with ID 42 modifies the URL parameter to `?user_id=1` and successfully downloads the Administrator\'s private tax documents.',
          'A user mistypes their password three times and is temporarily locked out.',
          'An expired session token is accepted by the login portal.'
        ],
        correctIndex: 1,
        explanation: 'The user was already authenticated as user 42; the failure occurred when the server failed to verify whether user 42 had permission to access object ID 1 (Broken Object Level Authorization).'
      },
      {
        id: 'q2-3',
        question: 'Under the STRIDE threat modeling framework, which threat category corresponds to an attacker modifying records in a database without authorization?',
        choices: [
          'Spoofing',
          'Tampering',
          'Repudiation',
          'Denial of Service'
        ],
        correctIndex: 1,
        explanation: 'Tampering involves unauthorized alteration of data in transit or at rest, violating Integrity.'
      },
      {
        id: 'q2-4',
        question: 'What type of security control is a Security Information and Event Management (SIEM) system that generates an alert when ten failed root logins occur within 60 seconds?',
        choices: [
          'Preventive control',
          'Detective control',
          'Corrective control',
          'Deterrent control'
        ],
        correctIndex: 1,
        explanation: 'A SIEM identifies and flags suspicious activity as it occurs or after the fact, making it a classic Detective control.'
      }
    ]
  }
};
