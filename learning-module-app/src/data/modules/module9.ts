import { ModuleData } from '../../types/course.types';

export const MODULE_9: ModuleData = {
  id: 'mod-09',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'blue-team-resilience-improvement',
  title: 'Module 9 — Blue Team Resilience and Improvement',
  track: 'blue',
  summary: 'Transform reactive firefighting into long-term organizational resilience through secure system hardening, continuous vulnerability prioritization, metric-driven learning, and purple team feedback loops.',
  orderIndex: 9,
  required: true,
  objectives: [
    'Implement defense-in-depth system hardening using CIS Benchmarks and container best practices.',
    'Enforce identity hygiene through conditional access, phishing-resistant MFA, and least-privilege RBAC.',
    'Prioritize vulnerability remediation backlogs using EPSS (Exploit Prediction Scoring System) and asset exposure.',
    'Track operational learning metrics: coverage, time-to-triage, and recurrence rates.',
    'Design automated purple-team continuous validation feedback loops.'
  ],
  onePageCheatSheet: `### Module 9 Cheat Sheet: Hardening & Resilience
- **Hardening Baselines:** Apply CIS Benchmarks (disable unused services, enforce SSH key-only auth, mount filesystems \`noexec\`).
- **Remediation Prioritization (EPSS + CVSS):**
  - High CVSS + High EPSS (Actively Exploited In The Wild) = Immediate Emergency Patch.
  - High CVSS + Low EPSS (Internal isolated target) = Scheduled sprint cycle.
- **Backups: 3-2-1 Rule:** 3 copies of data, 2 different media types, 1 stored offsite/immutable (air-gapped against ransomware).
- **Purple Loop:** Red Team emulates technique -> Blue verifies detection telemetry -> If gap found, tune rule -> Retest to confirm detection -> Document in shared matrix.`,
  lessons: [
    {
      id: 'lesson-09-01',
      moduleId: 'mod-09',
      slug: 'secure-configuration-patching-backups',
      title: '9.1 Secure Configuration, Patching, Asset Inventory & Backups',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Over 90% of breaches exploit known misconfigurations or missing patches with existing fixes. Proactive configuration hygiene closes doors before adversaries arrive.',
      objectives: [
        'Apply CIS Benchmarks to Linux servers and Docker container runtimes.',
        'Establish automated, risk-based patch management cycles.',
        'Implement immutable, tested backup strategies (3-2-1 rule).'
      ],
      prerequisites: ['lesson-01-01', 'lesson-08-02'],
      keyTerms: [
        { term: 'CIS Benchmarks', definition: 'Consensus-based best-practice configuration baselines published by the Center for Internet Security to harden operating systems, software, and cloud infrastructure.' },
        { term: 'Immutable Backup', definition: 'A backup copy that cannot be modified, deleted, or encrypted by any user or administrator for a predefined retention period, providing immunity against ransomware.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Bedrock of Resilience: Hardening and Backups',
          content: `Hardening reduces your attack surface:
- **Disable Default Accounts:** Remove guest accounts and enforce non-default administrative usernames.
- **SSH Hardening:** Set \`PermitRootLogin no\`, disable password authentication (\`PasswordAuthentication no\`), and mandate SSH hardware keys.
- **Principle of Least Functionality:** If a web server does not need a C compiler (\`gcc\`) or network scanners (\`nmap\`), uninstall them from production images.
- **The 3-2-1 Backup Strategy:** 3 copies of data, on 2 different media types, with 1 copy stored in an immutable offsite location.`
        }
      ],
      summaryTakeaways: [
        'Hardening removes the low-hanging fruit exploited by commodity threat actors.',
        'Backups are worthless unless regularly tested for restoration speed and integrity.',
        'Automated golden images (Infrastructure as Code) prevent configuration drift.'
      ],
      references: [
        { title: 'Center for Internet Security (CIS) Benchmarks Library', publisher: 'CIS', url: 'https://www.cisecurity.org/cis-benchmarks', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-09-02',
      moduleId: 'mod-09',
      slug: 'identity-hardening-mfa-least-privilege',
      title: '9.2 Identity Hardening, Phishing-Resistant MFA & Access Reviews',
      orderIndex: 2,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Identity is the modern perimeter. Attackers no longer "hack in"; they log in using stolen credentials or session tokens. Hardening identity controls blunts initial access.',
      objectives: [
        'Compare MFA factors: SMS OTP vs. Mobile Push vs. FIDO2/WebAuthn hardware tokens.',
        'Explain MFA fatigue (Push bombing) attacks and how number matching mitigates them.',
        'Implement Just-in-Time (JIT) access and periodic access reviews.'
      ],
      prerequisites: ['lesson-03-03'],
      keyTerms: [
        { term: 'Phishing-Resistant MFA', definition: 'Authentication protocols (FIDO2 / WebAuthn / Passkeys) that cryptographically bind the login challenge to the specific web origin, making credential harvesting impossible.' },
        { term: 'Just-in-Time (JIT) Access', definition: 'A privilege elevation model where administrative rights are granted ephemerally only when requested for an approved task and expire automatically.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Evolution of Multi-Factor Authentication',
          content: `Not all MFA is created equal:
1. **SMS & Voice OTP (Weakest):** Vulnerable to SIM swapping, SS7 interception, and phishing proxies.
2. **Push Notifications (Moderate):** Vulnerable to "MFA Fatigue" (adversaries spamming approval prompts until the victim clicks accept).
3. **FIDO2 / WebAuthn Hardware Keys (Gold Standard):** Cryptographically bound to the browser domain. Even if a user visits a fake phishing site, the hardware key refuses to release the token for the authentic domain.`
        }
      ],
      summaryTakeaways: [
        'Deploy phishing-resistant MFA (FIDO2 / Passkeys) on all administrative and developer accounts.',
        'Implement number matching on mobile push prompts to defeat MFA fatigue.',
        'Revoke dormant accounts and conduct quarterly permission audits.'
      ],
      references: [
        { title: 'CISA Fact Sheet: Implementing Phishing-Resistant MFA', publisher: 'CISA', url: 'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-09-03',
      moduleId: 'mod-09',
      slug: 'vulnerability-management-remediation-prioritization',
      title: '9.3 Vulnerability Management & Remediation Prioritization',
      orderIndex: 3,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Organizations have thousands of unpatched vulnerabilities. Blindly patching by CVSS score alone wastes effort on theoretical bugs; using exploit intelligence (EPSS, KEV) focuses effort on real threats.',
      objectives: [
        'Utilize CISA\'s Known Exploited Vulnerabilities (KEV) catalog.',
        'Evaluate the Exploit Prediction Scoring System (EPSS) to calculate real-world exploitation probability.',
        'Prioritize a software remediation backlog based on asset criticality, KEV status, and EPSS scores.'
      ],
      prerequisites: ['lesson-09-02'],
      keyTerms: [
        { term: 'CISA KEV (Known Exploited Vulnerabilities)', definition: 'An authoritative catalog maintained by CISA of vulnerabilities that have been confirmed to be actively exploited in the wild.' },
        { term: 'EPSS (Exploit Prediction Scoring System)', definition: 'A data-driven model that estimates the probability (0 to 1) that a software vulnerability will be exploited in the wild within 30 days.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Remediation Prioritization: Comparing CVSS vs. EPSS & KEV',
            datasetName: 'Synthetic-Vuln-Backlog-v1',
            scenario: 'You are triaging three unpatched CVEs on your logistics server cluster.',
            syntheticData: `VULNERABILITY A: CVE-2024-9981
- Component: Internal Reporting Utility
- CVSS: 9.8 (Critical) | EPSS: 0.001 (0.1% probability) | CISA KEV: No
- Exposure: Internal staging box only

VULNERABILITY B: CVE-2024-4040
- Component: Edge Gateway Web UI
- CVSS: 7.5 (High) | EPSS: 0.942 (94.2% probability) | CISA KEV: YES (Actively Exploited)
- Exposure: Public Internet facing

VULNERABILITY C: CVE-2023-38606
- Component: Local Kernel Driver
- CVSS: 7.0 (High) | EPSS: 0.020 (2.0% probability) | CISA KEV: No
- Exposure: Requires prior local access`,
            analysisWalkthrough: [
              'Analysis: Although Vulnerability A has the highest raw CVSS (9.8), its EPSS is nearly zero, it is not in KEV, and it is located on an isolated staging machine.',
              'Vulnerability B (CVSS 7.5) is actively exploited in the wild (KEV = Yes), has a 94% exploit probability (EPSS), and sits on the public internet.',
              'Decision: **Vulnerability B must be patched first immediately**, followed by Vulnerability A and C in scheduled maintenance windows.'
            ],
            keyInsight: 'Real-world exploitability (KEV + EPSS) combined with asset exposure trumps theoretical CVSS severity scores.'
          }
        }
      ],
      summaryTakeaways: [
        'Prioritize vulnerabilities listed on the CISA KEV catalog first.',
        'Use EPSS to identify high-probability emerging threats before mass exploitation.',
        'Factor in network exposure (internet-facing vs. internal isolated).'
      ],
      references: [
        { title: 'FIRST EPSS Data and Model Documentation', publisher: 'FIRST', url: 'https://www.first.org/epss/', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-09-04',
      moduleId: 'mod-09',
      slug: 'metrics-that-support-learning',
      title: '9.4 Metrics That Support Learning (Coverage, Triage & Recurrence)',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Vanity metrics (e.g., "number of blocked attacks") show activity, not effectiveness. Meaningful security metrics measure dwell time, coverage gaps, and whether the same mistakes recur.',
      objectives: [
        'Calculate actionable security operational metrics: MTTD, MTTR, False Positive Rate, and Flaw Recurrence.',
        'Design dashboards that track root-cause remediation rather than superficial bug counts.',
        'Use metrics to justify security engineering investments.'
      ],
      prerequisites: ['lesson-09-03'],
      keyTerms: [
        { term: 'Mean Time to Detect (MTTD)', definition: 'The average time elapsed between an adversary\'s initial compromise of a system and the security team\'s first detection of the intrusion.' },
        { term: 'Flaw Recurrence Rate', definition: 'The percentage of resolved vulnerabilities that reappear in new code or subsequent releases due to systemic engineering gaps.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Operational Metrics vs. Vanity Metrics',
          content: `### Vanity Metrics (Avoid):
- *"We blocked 1.4 million malicious firewall packets today!"* (Meaningless background noise on any public IP).
- *"We closed 500 tickets this month."* (Does not show whether the root causes were fixed).

### Actionable Learning Metrics (Embrace):
1. **Dwell Time (MTTD):** How long did it take between initial access and alarm? (Goal: Reduce from days to minutes).
2. **Mean Time to Remediate (MTTR):** How quickly are high-risk vulnerabilities patched across the fleet?
3. **Recurrence Rate:** Are new developers repeating the exact same SQL injection pattern? If so, training or framework-level ORM improvements are needed.`
        }
      ],
      summaryTakeaways: [
        'Measure speed of detection, speed of remediation, and defect recurrence.',
        'Avoid vanity statistics that measure internet noise rather than internal health.',
        'Use recurrence data to upgrade development libraries and frameworks.'
      ],
      references: [
        { title: 'SANS Institute: Security Metrics That Matter', publisher: 'SANS', url: 'https://www.sans.org/white-papers/36552/', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-09-05',
      moduleId: 'mod-09',
      slug: 'detection-tuning-purple-team-feedback-loops',
      title: '9.5 Detection Tuning & Purple-Team Continuous Feedback Loops',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Defenses degrade over time as infrastructure changes. Establishing regular purple-team feedback loops continuously verifies whether defensive rules fire as expected when techniques are tested.',
      objectives: [
        'Establish an iterative Purple Team cycle (Emulate -> Observe -> Tune -> Validate).',
        'Tune noisy detection rules to eliminate false positives while preserving detection sensitivity.',
        'Participate in a remediation backlog prioritization exercise.'
      ],
      prerequisites: ['lesson-09-04'],
      keyTerms: [
        { term: 'Purple Team Exercise', definition: 'A collaborative, open-book exercise where red operators execute specific techniques in coordination with blue defenders sitting side-by-side to verify and optimize detections in real time.' },
        { term: 'Continuous Security Validation', definition: 'The practice of regularly executing safe, scripted adversarial techniques to verify that security controls and alerts remain active over time.' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'The Continuous Purple Team Feedback Loop',
          diagramAscii: `
  +-------------------------------------------------------------+
  | 1. RED TEAM EMULATION                                       |
  |    - Safely executes specific ATT&CK technique in sandbox   |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  | 2. BLUE TEAM OBSERVATION                                    |
  |    - Did endpoint log the event? Did SIEM trigger an alert? |
  +-------------------------------------------------------------+
                                 |
               +-----------------+-----------------+
               | (If detected)                     | (If missed / gap)
               v                                   v
  +--------------------------+       +--------------------------+
  | Confirm Alert Quality    |       | Engineer New Detection   |
  | Measure response latency |       | Add Sigma rule & context |
  +--------------------------+       +--------------------------+
               \\                                   /
                +-----------------+---------------+
                                  |
                                  v
  +-------------------------------------------------------------+
  | 3. RETEST & VALIDATION                                      |
  |    - Red team re-executes technique to verify new rule fires|
  +-------------------------------------------------------------+`,
          diagramAltText: 'Cyclical flowchart showing the Purple Team loop: Red Team emulates technique, Blue Team verifies detection, tunes detection rules if missed, and validates on retest.'
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-09-backlog-priority',
            title: 'Contained Lab: Remediation Backlog Prioritization Matrix',
            environmentName: 'Vulnerability Prioritization Studio',
            scopeNotice: 'ATTENTION: Contained prioritization exercise. Review 5 synthetic vulnerabilities and rank them in order of remediation urgency.',
            allowedActions: ['Calculate priority score', 'Evaluate KEV / EPSS status', 'Submit ranked backlog'],
            prohibitedActions: ['None - offline analytical lab'],
            stopConditions: ['None'],
            initialState: { rankedCount: 0 },
            instructions: [
              'Review the 5 synthetic vulnerabilities in the Apex backlog.',
              'Identify the internet-facing vulnerability present on the CISA KEV catalog.',
              'Rank the vulnerabilities from 1 (Highest Urgency) to 5 (Lowest Urgency) based on risk factors.'
            ],
            expectedResult: 'Backlog correctly prioritized placing the actively exploited KEV internet gateway as Priority #1.',
            labType: 'remediation_prioritization'
          }
        }
      ],
      summaryTakeaways: [
        'Purple teaming replaces finger-pointing with shared technical collaboration.',
        'Continuous testing validates that security controls survive software updates.',
        'A tuned detection rule provides high fidelity, low noise, and rich investigation context.'
      ],
      references: [
        { title: 'SCYTHE: Purple Team Exercise Framework', publisher: 'SCYTHE', url: 'https://scythe.io/purple-team-exercise-framework', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-09',
    title: 'Module 9 Assessment: Resilience, Hardening & Purple Teaming',
    passingScore: 75,
    questions: [
      {
        id: 'q9-1',
        question: 'Under the Exploit Prediction Scoring System (EPSS) and CISA KEV framework, which vulnerability should receive top emergency remediation priority?',
        choices: [
          'A CVSS 9.8 flaw with an EPSS of 0.001 located on an isolated, non-networked staging computer.',
          'A CVSS 7.5 flaw that is listed on the CISA Known Exploited Vulnerabilities (KEV) catalog, has an EPSS of 0.94 (94% probability), and is exposed on an internet-facing perimeter gateway.',
          'An informational banner disclosure reporting the Nginx version.',
          'A missing security header on an internal intranet portal.'
        ],
        correctIndex: 1,
        explanation: 'Active real-world exploitation in the wild (KEV = Yes) combined with high exploit probability and public exposure makes the CVSS 7.5 flaw far more dangerous than theoretical flaws in staging.'
      },
      {
        id: 'q9-2',
        question: 'Why are FIDO2 / WebAuthn hardware security keys considered "phishing-resistant" compared to traditional SMS OTP or mobile push notifications?',
        choices: [
          'They are made of titanium and cannot be physically damaged.',
          'They cryptographically sign challenges using a private key bound specifically to the browser\'s verified domain origin; if a user enters their credentials on a fake phishing URL, the hardware key refuses to authenticate.',
          'They change passwords every 30 seconds.',
          'They do not require electricity.'
        ],
        correctIndex: 1,
        explanation: 'FIDO2 / WebAuthn cryptographic keys are bound to the exact origin URL in the browser, rendering adversary phishing reverse-proxies completely ineffective.'
      },
      {
        id: 'q9-3',
        question: 'What is the primary objective of a collaborative "Purple Team" exercise?',
        choices: [
          'To determine whether the red team or blue team gets a bigger budget.',
          'To test specific adversary techniques in real time with offensive operators and defensive engineers working together to measure detection latency and tune detection rules.',
          'To replace all human security analysts with artificial intelligence.',
          'To write compliance documentation for external auditors.'
        ],
        correctIndex: 1,
        explanation: 'Purple teaming fosters open-book collaboration where red teams execute techniques transparently so blue teams can verify telemetry and optimize detection logic immediately.'
      },
      {
        id: 'q9-4',
        question: 'What does the "3-2-1" backup rule mandate to ensure resilience against ransomware and site disasters?',
        choices: [
          'Backups must be completed in under 3 minutes, 2 times a day, on 1 machine.',
          'Maintain 3 copies of data, across 2 different media types, with 1 copy stored offsite or in an immutable/air-gapped state.',
          'Only back up 3 files, 2 databases, and 1 operating system.',
          'Backups must be kept for 3 years, 2 months, and 1 day.'
        ],
        correctIndex: 1,
        explanation: 'The 3-2-1 rule requires three total data copies across two different media formats, with at least one immutable or offsite copy protected against local network ransomware.'
      }
    ]
  }
};
