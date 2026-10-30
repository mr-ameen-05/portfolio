import { ModuleData } from '../../types/course.types';

export const MODULE_4: ModuleData = {
  id: 'mod-04',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'red-team-foundations-plan-observe',
  title: 'Module 4 — Red Team Foundations: Plan and Observe',
  track: 'red',
  summary: 'Explore adversarial mindset fundamentals, differentiate red teaming from vulnerability assessments, define strict engagement objectives, and practice passive reconnaissance with synthetic datasets.',
  orderIndex: 4,
  required: true,
  objectives: [
    'Articulate the distinct goals and methodologies of vulnerability assessments, penetration tests, and red team adversary simulations.',
    'Formulate objective-driven test plans with explicit exclusions, communication schedules, and stop conditions.',
    'Perform passive reconnaissance concepts using synthetic corporate personas and public records datasets.',
    'Map simulated threat actor techniques to the MITRE ATT&CK Enterprise matrix as a communication aid.'
  ],
  onePageCheatSheet: `### Module 4 Cheat Sheet: Red Team Methodology
- **Vulnerability Assessment vs. Pentest vs. Red Team:**
  - Vulnerability Assessment: Breadth-first inventory of known flaws (automated scanners).
  - Penetration Test: Depth-first proof of exploitability against specific scoped targets.
  - Red Team Simulation: Adversary-emulation testing people, processes, and tech to achieve a specific objective (e.g., access customer DB) while evaluating Blue Team detection.
- **Hypothesis-Driven Testing:** State: "Given [observed asset/state], if we [safe test action], then we expect [specific indicator] to occur."
- **MITRE ATT&CK:** Use ATT&CK as a common taxonomy (Tactic = Goal, Technique = How), never as a checkbox compliance tool.`,
  lessons: [
    {
      id: 'lesson-04-01',
      moduleId: 'mod-04',
      slug: 'red-team-pentest-vuln-assessment-simulation',
      title: '4.1 Red Team, Penetration Test, Vulnerability Assessment & Simulation: Differences',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Using the wrong assessment type wastes organizational resources. Knowing whether a client needs a wide vulnerability scan, an application penetration test, or a multi-week adversary simulation ensures expectations and outcomes match.',
      objectives: [
        'Compare the scope, duration, and deliverables of Vulnerability Scanning, Pentesting, and Red Teaming.',
        'Identify when an organization is mature enough for an adversary emulation engagement.',
        'Explain the role of the White Cell / Trusted Agent in managing exercise safety.'
      ],
      prerequisites: ['lesson-00-02', 'lesson-02-02'],
      keyTerms: [
        { term: 'Adversary Emulation', definition: 'A specialized red team assessment where testers model their tactics, techniques, and procedures (TTPs) after a specific real-world threat actor group (e.g., APT29).' },
        { term: 'White Cell (Trusted Agent)', definition: 'Designated client leadership personnel who know the red team exercise is underway, coordinate safety, deconflict alarms, and monitor boundaries.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Spectrum of Offensive Security Assessments',
          content: `Offensive security assessments serve distinct maturity levels:

| Assessment Type | Core Focus | Breadth vs. Depth | Primary Deliverable |
| :--- | :--- | :--- | :--- |
| **Vulnerability Assessment** | Identifying all known missing patches and flaws | High breadth, low depth | Prioritized list of unpatched CVEs |
| **Penetration Testing** | Exploiting weaknesses to prove real impact | Targeted depth | Technical findings report with reproduction steps |
| **Red Team Simulation** | Emulating realistic threat actors against blue team detection | Holistic (People, Process, Tech) | Detection gap analysis, timeline debrief, and exercise logs |

An organization without basic vulnerability management or logging should **not** conduct a red team engagement; they must master baseline security hygiene first.`
        }
      ],
      summaryTakeaways: [
        'Vulnerability assessments find known bugs; penetration tests exploit them; red teams test operational defense.',
        'Red teaming evaluates detection and response times, not just technical exploits.',
        'A trusted agent (White Cell) maintains exercise safety and prevents blue team escalations from panicking leadership.'
      ],
      references: [
        { title: 'The Red Team Field Manual (RTFM) Overview', publisher: 'SANS', url: 'https://www.sans.org/blog/what-is-red-teaming/', lastReviewed: '2026-01-18' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-04-02',
      moduleId: 'mod-04',
      slug: 'define-objectives-scope-timing-stop-conditions',
      title: '4.2 Define Objectives, Scope, Exclusions, Timing, and Stop Conditions',
      orderIndex: 2,
      estimatedMinutes: { reading: 14, practice: 20, total: 34 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Vague red team objectives result in chaotic engagements that fail to produce defensive value. Clear objectives ensure both red and blue teams learn concrete lessons about system resilience.',
      objectives: [
        'Draft a "Crown Jewels" objective statement for a simulated engagement.',
        'Establish deconfliction communication channels between offensive operators and the White Cell.',
        'Define explicit technical stop conditions for operational assessments.'
      ],
      prerequisites: ['lesson-04-01'],
      keyTerms: [
        { term: 'Deconfliction', definition: 'The operational process where the White Cell verifies whether an active incident alert is caused by the authorized red team or an actual malicious external threat actor.' },
        { term: 'Crown Jewels', definition: 'The core business data, intellectual property, or critical systems whose compromise would cause catastrophic organizational impact.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Designing an Actionable Red Team Objective',
          content: `Weak objective: *"Hack as many servers as possible."*
Strong objective: *"Determine if an adversary with external access can pivot from the internet-facing marketing website to read synthetic customer order records in the core logistics database without triggering an alert within 48 hours."*

### Key Components of the Plan:
1. **Primary Goal:** Access specific, pre-planted synthetic evidence flags in the target zone.
2. **Deconfliction Code-Word:** A shared phrase (e.g., "Exercise BLUE OMEGA") used if security operations detects an anomaly and needs to confirm red team involvement.
3. **Emergency Stop Matrix:** Direct line to CISO/VP with authority to halt operations immediately if critical business systems stutter.`
        }
      ],
      summaryTakeaways: [
        'Objectives must tie directly to realistic business risk.',
        'Deconfliction protocols prevent wasted emergency incident response cycles.',
        'Always establish a code-word and immediate phone communication path.'
      ],
      references: [
        { title: 'CREST Certified Simulated Attack Specialist Guidelines', publisher: 'CREST', url: 'https://www.crest-approved.org/', lastReviewed: '2026-01-22' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-04-03',
      moduleId: 'mod-04',
      slug: 'reconnaissance-concepts-fictional-org',
      title: '4.3 Reconnaissance Concepts Using a Fictional Organization',
      orderIndex: 3,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Reconnaissance gathers intelligence about target infrastructure, technologies, and email naming conventions without making intrusive direct network connections that alert defenders.',
      objectives: [
        'Distinguish Passive Reconnaissance (third-party sources) from Active Reconnaissance (direct network probes).',
        'Analyze synthetic DNS records (A, MX, TXT, SPF, DKIM) and WHOIS registrations.',
        'Identify public repository secrets and cloud asset naming conventions using synthetic datasets.'
      ],
      prerequisites: ['lesson-04-02'],
      keyTerms: [
        { term: 'Passive Reconnaissance', definition: 'Gathering intelligence about a target using public records, search engines, and third-party databases without directly interacting with the target systems.' },
        { term: 'Active Reconnaissance', definition: 'Directly probing or interacting with target networks, host systems, or applications (e.g., port scanning, web application crawling).' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Passive Reconnaissance on Fictional "Apex FinCorp"',
            datasetName: 'Synthetic-Apex-OSINT-v1',
            scenario: 'You are analyzing synthetic public records for fictional company Apex FinCorp (domain: apex-fincorp.example.internal).',
            syntheticData: `DNS RECORD SUMMARY:
apex-fincorp.example.internal.     IN  A    198.51.100.10 (Production Portal)
vpn.apex-fincorp.example.internal. IN  A    198.51.100.11 (Gateway)
dev-api.apex-fincorp.example.internal. IN A 198.51.100.15 (Swagger API UI)

TXT SPF RECORD:
v=spf1 include:_spf.google.com ip4:198.51.100.0/28 include:vendor-dispatch.example ~all

PUBLIC CODE COMMIT SEARCH (SYNTHETIC):
Repo: github-mock/apex-frontend
Commit: "initial release" - File: .env.example contains:
API_BASE_URL="http://dev-api.apex-fincorp.example.internal:8080"`,
            analysisWalkthrough: [
              'Finding 1: An exposed sub-domain `dev-api.apex-fincorp.example.internal` is registered in public DNS on port 8080.',
              'Finding 2: The SPF record exposes an authorized third-party vendor domain `vendor-dispatch.example`.',
              'Finding 3: A public repository leak reveals the internal API base URL port convention.',
              'Action Plan: Formulate hypothesis: Does `dev-api` have authorization controls or is it an unprotected staging endpoint?'
            ],
            keyInsight: 'Passive reconnaissance reveals technical attack surfaces, naming patterns, and staging environments without sending a single packet to the target.'
          }
        }
      ],
      summaryTakeaways: [
        'Passive reconnaissance leaves zero footprint in the target\'s perimeter logs.',
        'DNS records, certificate transparency logs, and code repos frequently reveal staging systems.',
        'Intelligence gathered during recon informs structured test hypotheses.'
      ],
      references: [
        { title: 'OWASP Information Gathering Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Information_Gathering_Cheat_Sheet.html', lastReviewed: '2026-01-30' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-04-04',
      moduleId: 'mod-04',
      slug: 'hypothesis-driven-testing-evidence-minimization',
      title: '4.4 Hypothesis-Driven Testing and Evidence Minimization',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Aimless probing creates noise, crashes servers, and frustrates engineering teams. Formulating structured hypotheses ensures every technical action has a clear rationale and predictable outcome.',
      objectives: [
        'Structure technical tests as testable hypotheses with explicit preconditions and expected observables.',
        'Apply evidence minimization during validation phases.',
        'Document timestamped activity logs to facilitate blue team deconfliction.'
      ],
      prerequisites: ['lesson-04-03'],
      keyTerms: [
        { term: 'Hypothesis-Driven Testing', definition: 'A methodical testing approach where the analyst articulates: Preconditions + Action + Expected Reaction before executing any technique.' },
        { term: 'Operator Log', definition: 'A synchronized, timestamped record kept by offensive testers documenting exact source IP, target IP, command executed, and result for later audit.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Scientific Method in Offensive Security',
          content: `Professional operators do not run random exploit scripts hoping for a shell. They form rigorous hypotheses:

### Hypothesis Template:
- **Observation:** Endpoint \`/api/v1/users/profile?id=50\` returns user data.
- **Hypothesis:** The application does not check if the requesting session token owns ID 50 (BOLA/IDOR).
- **Test:** Request \`/api/v1/users/profile?id=51\` using session token for user 50.
- **Expected Proof:** If vulnerable, returns user 51's name and email.
- **Minimization Limit:** Request only one record; do not write a script to scrape all 10,000 IDs.`
        }
      ],
      summaryTakeaways: [
        'Formulate hypotheses before sending test traffic.',
        'Minimize data collection to only what proves the vulnerability.',
        'Keep precise operator logs with UTC timestamps.'
      ],
      references: [
        { title: 'The Art of Software Security Assessment', publisher: 'Addison-Wesley', url: 'https://www.pearson.com/', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-04-05',
      moduleId: 'mod-04',
      slug: 'mapping-behaviors-to-mitre-attack',
      title: '4.5 Mapping Behaviors to MITRE ATT&CK as a Communication Aid',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Describing an attack using proprietary or vendor-specific jargon makes it difficult for defenders to respond. MITRE ATT&CK provides a universal language linking offensive behaviors to defensive detections.',
      objectives: [
        'Navigate the MITRE ATT&CK Enterprise Matrix across Tactics (goals) and Techniques (actions).',
        'Map observed reconnaissance and initial access actions to specific ATT&CK Technique IDs (e.g., T1595, T1190).',
        'Avoid common misuses of ATT&CK (treating techniques as a checkbox compliance checklist).'
      ],
      prerequisites: ['lesson-04-04'],
      keyTerms: [
        { term: 'MITRE ATT&CK', definition: 'A globally accessible knowledge base of adversary tactics and techniques based on real-world observations, organized into a hierarchical matrix.' },
        { term: 'Tactic vs. Technique', definition: 'A Tactic is the adversary\'s operational objective (e.g., Initial Access, Persistence); a Technique is the specific technical method used to achieve that goal (e.g., Exploit Public-Facing Application).' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'Mapping Sample Behaviors to MITRE ATT&CK',
          diagramAscii: `
  TACTIC: Reconnaissance (TA0043)
    └── TECHNIQUE: Active Scanning (T1595)
          └── SUB-TECHNIQUE: Vulnerability Scanning (T1595.002)
  
  TACTIC: Initial Access (TA0001)
    └── TECHNIQUE: Exploit Public-Facing Application (T1190)
  
  TACTIC: Discovery (TA0007)
    └── TECHNIQUE: Network Service Discovery (T1046)
  
  TACTIC: Exfiltration (TA0010)
    └── TECHNIQUE: Exfiltration Over C2 Channel (T1041)`,
          diagramAltText: 'Hierarchy diagram showing MITRE ATT&CK Tactics mapped to specific Technique IDs.'
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-04-test-plan',
            title: 'Contained Lab: Red Team Test Plan & ATT&CK Mapping Workbench',
            environmentName: 'Assessment Planning Studio',
            scopeNotice: 'ATTENTION: Contained planning lab. Build a structured test plan for a fictional financial organization using the provided synthetic brief.',
            allowedActions: ['Draft objectives', 'Assign ATT&CK IDs', 'Define stop conditions'],
            prohibitedActions: ['None - offline planning sandbox'],
            stopConditions: ['None'],
            initialState: { planComplete: false },
            instructions: [
              'Review the fictional client engagement brief for Apex FinCorp.',
              'Map the proposed passive DNS review to ATT&CK Technique T1596 (Search Open Technical Databases).',
              'Draft two non-negotiable stop conditions protecting their payment processing gateway.'
            ],
            expectedResult: 'Test plan drafted with clear objectives, validated ATT&CK mappings, and verified stop conditions.',
            labType: 'test_plan'
          }
        }
      ],
      summaryTakeaways: [
        'ATT&CK provides a common taxonomy for cross-team collaboration.',
        'Tactics describe "Why" an attacker acts; Techniques describe "How".',
        'Do not treat ATT&CK as a linear checklist; adversaries combine techniques fluidly.'
      ],
      references: [
        { title: 'MITRE ATT&CK Enterprise Matrix Documentation', publisher: 'The MITRE Corporation', url: 'https://attack.mitre.org/', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-04',
    title: 'Module 4 Assessment: Red Team Foundations & Planning',
    passingScore: 75,
    questions: [
      {
        id: 'q4-1',
        question: 'What is the primary difference in purpose between an application penetration test and a red team adversary simulation?',
        choices: [
          'Penetration tests only use automated scanners, while red teams only use manual tools.',
          'Penetration tests focus on discovering and demonstrating exploitability of vulnerabilities in scoped applications, while red team simulations test the organization’s overall detection, response, and defensive processes against realistic attack scenarios.',
          'Penetration tests are conducted without client permission, while red teams always have permission.',
          'Red team simulations are only conducted against government organizations.'
        ],
        correctIndex: 1,
        explanation: 'Penetration testing identifies and exploits vulnerabilities in specific scoped targets. Red teaming evaluates people, process, and technology defenses against adversary goals.'
      },
      {
        id: 'q4-2',
        question: 'What is the operational role of a "White Cell" or "Trusted Agent" during an active red team engagement?',
        choices: [
          'They assist the red team by writing custom exploit payloads.',
          'They are client leadership members who know the assessment is active, monitor safety, coordinate emergency stops, and handle deconfliction when the blue team detects anomalies.',
          'They lead the blue team’s incident response containment efforts.',
          'They handle public relations communications during a live cyber incident.'
        ],
        correctIndex: 1,
        explanation: 'The White Cell provides safety governance, deconflicts real alerts from exercise alerts, and ensures testing does not disrupt business operations.'
      },
      {
        id: 'q4-3',
        question: 'Which of the following activities is categorized as Passive Reconnaissance?',
        choices: [
          'Sending TCP SYN packets across an IP range to identify open ports.',
          'Querying public DNS records and reviewing publicly committed code repositories for disclosed hostnames.',
          'Injecting test strings into an authentication login form.',
          'Running a web vulnerability scanner against an API gateway.'
        ],
        correctIndex: 1,
        explanation: 'Passive reconnaissance gathers intelligence from public third-party sources without directly sending traffic to the target\'s servers.'
      },
      {
        id: 'q4-4',
        question: 'In the MITRE ATT&CK framework, what is the conceptual difference between a Tactic and a Technique?',
        choices: [
          'Tactics represent defensive tools, while Techniques represent offensive software.',
          'A Tactic is the adversary\'s operational objective (e.g., Initial Access), while a Technique is the specific technical method used to accomplish that objective (e.g., Exploit Public-Facing Application).',
          'Tactics are for network engineers, while Techniques are for software developers.',
          'There is no difference; the terms are completely interchangeable in ATT&CK.'
        ],
        correctIndex: 1,
        explanation: 'Tactics denote the adversary\'s tactical goal ("Why"), whereas Techniques represent the specific mechanism ("How").'
      }
    ]
  }
};
