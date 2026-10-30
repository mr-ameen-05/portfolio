import { ModuleData } from '../../types/course.types';

export const MODULE_8: ModuleData = {
  id: 'mod-08',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'blue-team-operations-triage-response',
  title: 'Module 8 — Blue Team Operations: Triage and Response',
  track: 'blue',
  summary: 'Navigate the complete Incident Response lifecycle, evaluate containment trade-offs under operational pressure, preserve forensic evidence, and execute interactive branching tabletop scenarios.',
  orderIndex: 8,
  required: true,
  objectives: [
    'Execute the standard 6-phase NIST/SANS Incident Response lifecycle (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned).',
    'Triage and prioritize incoming alerts using scope, asset criticality, and threat actor dwell time.',
    'Evaluate high-stakes containment decisions balancing business operational impact against adversary lateral movement.',
    'Participate in a branching tabletop scenario based on synthetic breach logs.'
  ],
  onePageCheatSheet: `### Module 8 Cheat Sheet: Incident Response & Containment
- **NIST SP 800-61 IR Phases:**
  1. Preparation: Tools, backups, playbooks, communication channels.
  2. Detection & Analysis: Validating indicators, scoping full blast radius.
  3. Containment: Isolating systems (network quarantine, credential revocation) before attacker spreads.
  4. Eradication: Removing root causes, wiping compromised binaries, closing vulnerability.
  5. Recovery: Restoring from clean verified backups, monitoring for persistence.
  6. Post-Incident Activity: Lessons learned meeting, root-cause report, detection tuning.
- **Containment Trade-off:** Do not immediately reboot or wipe a system upon detecting an intrusion! Rebooting destroys volatile RAM evidence, unlinks running memory malware, and tips off the adversary. Coordinate network isolation first.`,
  lessons: [
    {
      id: 'lesson-08-01',
      moduleId: 'mod-08',
      slug: 'alert-triage-prioritization-escalation',
      title: '8.1 Alert Triage, Prioritization, and Escalation',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'A SOC receives thousands of alerts daily. Understanding how to triage and prioritize based on asset criticality and confirmed indicators prevents critical incidents from languishing in ticket queues.',
      objectives: [
        'Classify incoming alerts into True Positive (Actionable), True Positive (Benign), and False Positive.',
        'Apply asset criticality weighting to triage queues.',
        'Define clear escalation thresholds from Tier 1 to Tier 2 and management.'
      ],
      prerequisites: ['lesson-07-01'],
      keyTerms: [
        { term: 'Blast Radius', definition: 'The total potential scope of systems, accounts, and data impacted or accessible if an attack successfully achieves its objectives.' },
        { term: 'Dwell Time', definition: 'The duration of time an adversary remains undetected inside a victim\'s network from initial access until detection.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Triage Decision Matrix',
          content: `When evaluating an alert:
1. **Verification:** Is the alert technically valid or a sensor anomaly?
2. **Context Enrichment:** What user, host, and IP are involved? Is this a developer staging box or the primary ERP database?
3. **Intent & Capability:** Did the command succeed or fail with an access denied error?
4. **Action:**
   - Benign True Positive: Close ticket, document context.
   - Ambiguous Anomaly: Gather endpoint process memory and escalate to Tier 2.
   - Confirmed Active Breach: Trigger Incident Response Plan immediately.`
        }
      ],
      summaryTakeaways: [
        'Triage quickly filters noise so responders focus on genuine threats.',
        'Asset context dictates urgency: a low alert on a domain controller outranks a medium alert on a guest workstation.',
        'Document every triage decision with verifiable technical rationale.'
      ],
      references: [
        { title: 'SANS Institute: Incident Handler\'s Handbook', publisher: 'SANS', url: 'https://www.sans.org/white-papers/33393/', lastReviewed: '2026-01-18' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-08-02',
      moduleId: 'mod-08',
      slug: 'incident-response-lifecycle-phases',
      title: '8.2 Incident Response Lifecycle: Prepare, Detect, Contain & Recover',
      orderIndex: 2,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Responding to a live breach without a disciplined framework leads to panicked, chaotic decisions that destroy evidence and fail to eradicate adversary persistence.',
      objectives: [
        'Map out the six phases of the NIST SP 800-61 Incident Handling Guide.',
        'Identify common mistakes during initial response (premature reboots, uncoordinated password resets).',
        'Differentiate short-term tactical containment from long-term remediation.'
      ],
      prerequisites: ['lesson-08-01'],
      keyTerms: [
        { term: 'Incident Response Plan (IRP)', definition: 'A documented, structured set of procedures outlining how an organization detects, responds to, and recovers from cybersecurity incidents.' },
        { term: 'Eradication', definition: 'The incident response phase focused on completely removing all traces of malware, backdoors, stolen credentials, and root causes from the environment.' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'NIST SP 800-61 Rev. 2 Incident Response Cycle',
          diagramAscii: `
  +--------------------------------------------------------------+
  |                   1. PREPARATION                             |
  |  - Logging, Backups, IR Playbooks, Out-of-Band Comms         |
  +--------------------------------------------------------------+
               |
               v
  +--------------------------------------------------------------+
  |              2. DETECTION & ANALYSIS                         |
  |  - Validate alerts, scope blast radius, timeline correlation |
  +--------------------------------------------------------------+
               |
               +-----------------------------------+
               |                                   |
               v                                   v
  +--------------------------------+   +-------------------------+
  | 3. CONTAINMENT                 |   | 4. ERADICATION          |
  | - Network isolate hosts        |-->| - Revoke credentials    |
  | - Block external C2 IPs        |   | - Patch root-cause bug  |
  +--------------------------------+   +-------------------------+
               |                                   |
               v                                   v
  +--------------------------------------------------------------+
  |                   5. RECOVERY & MONITORING                   |
  |  - Restore clean backups, verify service, watch for re-entry |
  +--------------------------------------------------------------+
               |
               v
  +--------------------------------------------------------------+
  |              6. POST-INCIDENT ACTIVITY (LESSONS)             |
  |  - Root-cause report, timeline debrief, tune detection rules |
  +--------------------------------------------------------------+`,
          diagramAltText: 'Flowchart diagram illustrating the six phases of the NIST Incident Response lifecycle.'
        }
      ],
      summaryTakeaways: [
        'Never pull the power cord or reboot a live compromised machine (preserves RAM).',
        'Containment must isolate the adversary before eradication begins.',
        'Lessons Learned feeds directly back into Preparation for future resilience.'
      ],
      references: [
        { title: 'NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide', publisher: 'NIST', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-08-03',
      moduleId: 'mod-08',
      slug: 'evidence-preservation-chain-of-custody',
      title: '8.3 Evidence Preservation, Chain of Custody & Legal Privacy',
      orderIndex: 3,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'If an incident leads to law enforcement action, regulatory reporting, or insurance claims, digital evidence must be legally defensible. Mishandled evidence is inadmissible in court.',
      objectives: [
        'Apply the Order of Volatility during live digital forensics.',
        'Calculate cryptographic hashes (SHA-256) upon evidence acquisition.',
        'Maintain a formal Chain of Custody log sheet.'
      ],
      prerequisites: ['lesson-08-02'],
      keyTerms: [
        { term: 'Order of Volatility', definition: 'The sequence in which digital evidence should be preserved, from most transient (CPU registers and cache) to least transient (disk storage, archive tapes).' },
        { term: 'Forensic Image (Bit-Stream Image)', definition: 'An exact, bit-by-bit physical copy of a storage medium or memory space verified by matching cryptographic checksums.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Order of Volatility (RFC 3227)',
          content: `Digital evidence disappears rapidly:
1. **CPU Registers & Cache:** Disappears in nanoseconds.
2. **Volatile System Memory (RAM):** Running processes, unencrypted keys, open network sockets. Disappears on shutdown.
3. **Network State:** Routing tables, ARP cache, active TCP connections.
4. **File System (Disk):** Persistent storage, temporary files, logs.
5. **Backups & Optical Media:** Long-term archives.

**Key Rule:** Capture RAM **first** before touching the disk or rebooting the operating system.`
        }
      ],
      summaryTakeaways: [
        'Follow the Order of Volatility: capture RAM before rebooting or powering down.',
        'Hash all evidence immediately upon acquisition (SHA-256).',
        'Record every person who handled or analyzed the evidence.'
      ],
      references: [
        { title: 'RFC 3227: Guidelines for Evidence Collection and Archiving', publisher: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc3227', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-08-04',
      moduleId: 'mod-08',
      slug: 'containment-tradeoffs-business-communication',
      title: '8.4 Containment Trade-offs & Business Communication',
      orderIndex: 4,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Shutting down an entire e-commerce infrastructure during an alert costs millions of dollars per hour. Responders must balance risk containment against operational business impact.',
      objectives: [
        'Evaluate tactical containment strategies: Host Isolation, Network Segmentation, Account Disabling, and Null-Routing.',
        'Craft non-technical executive briefing updates during active incidents.',
        'Establish out-of-band communication channels (avoiding compromised company email/Slack).'
      ],
      prerequisites: ['lesson-08-03'],
      keyTerms: [
        { term: 'Host Isolation', definition: 'A network control (often applied via EDR) that blocks all inbound and outbound traffic to a host except for the security agent\'s management channel.' },
        { term: 'Out-of-Band (OOB) Communication', definition: 'An independent communication channel (e.g., dedicated secure messaging, external phones) used when internal systems may be monitored by the adversary.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Communicating During a Crisis',
          content: `When communicating with business executives:
- **Do not use technical jargon:** Avoid *"We are analyzing C2 beaconing on port 8080."*
- **State clear operational status:** *"We have isolated one dispatch server to prevent further unauthorized access. Our core customer booking database remains unaffected. We are analyzing the entry point and will provide our next update in 60 minutes."*
- **Out-of-Band Warning:** Never discuss incident response plans or containment strategies on corporate email or internal messaging channels if domain controllers or administrator accounts are suspected of compromise.`
        }
      ],
      summaryTakeaways: [
        'Containment requires weighing business disruption against security exposure.',
        'EDR host isolation is preferred over physical disconnects because management channels stay active.',
        'Always communicate via out-of-band channels during suspected enterprise compromise.'
      ],
      references: [
        { title: 'CISA Incident Response Guide and Executive Communications Template', publisher: 'CISA', url: 'https://www.cisa.gov/incident-response', lastReviewed: '2026-01-25' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-08-05',
      moduleId: 'mod-08',
      slug: 'tabletop-scenario-branching-decisions',
      title: '8.5 Tabletop Exercise: Branching Decision Incident Response',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Tabletop simulations allow teams to test playbooks and decision-making in a safe, low-stress environment before facing a real adversary at 2:00 AM on a holiday weekend.',
      objectives: [
        'Evaluate operational decisions in an interactive branching tabletop scenario.',
        'Analyze consequences of premature eradication versus patient scoping.',
        'Conduct a structured post-incident Lessons Learned debrief.'
      ],
      prerequisites: ['lesson-08-04'],
      keyTerms: [
        { term: 'Tabletop Exercise (TTX)', definition: 'A discussion-based exercise where team members walk through realistic hypothetical incident scenarios to evaluate plans, policies, and readiness.' }
      ],
      sections: [
        {
          type: 'lab',
          labData: {
            id: 'lab-08-tabletop',
            title: 'Contained Lab: Branching Decision Incident Tabletop Simulation',
            environmentName: 'Incident Commander Tabletop Simulator',
            scopeNotice: 'ATTENTION: Contained tabletop simulation. You are the Incident Commander for Apex Logistics responding to an active intrusion.',
            allowedActions: ['Evaluate scenario injects', 'Select containment decisions', 'Assess business impact'],
            prohibitedActions: ['None - offline decision simulator'],
            stopConditions: ['None'],
            initialState: { scenarioProgress: 0 },
            instructions: [
              'Scenario Inject 1: Alert detects outbound connection to 198.51.100.99 from dispatch server.',
              'Decision 1: Choose between: [A] Immediately power off server, or [B] Apply EDR host isolation and capture volatile RAM.',
              'Scenario Inject 2: Attacker attempts lateral movement to internal DB.',
              'Decision 2: Choose between: [A] Reset all company passwords immediately, or [B] Revoke the compromised service account token and block the C2 IP on perimeter.'
            ],
            expectedResult: 'Optimal incident commander decisions selected (EDR host isolation and targeted token revocation) without business downtime.',
            labType: 'tabletop_decision'
          }
        }
      ],
      summaryTakeaways: [
        'Tabletops expose operational friction before real emergencies.',
        'Patience during scoping prevents adversaries from shifting to unmonitored backdoors.',
        'Document all lessons learned to harden baseline defenses.'
      ],
      references: [
        { title: 'CISA Tabletop Exercise Packages (CTEP)', publisher: 'Cybersecurity and Infrastructure Security Agency', url: 'https://www.cisa.gov/tabletop-exercises', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-08',
    title: 'Module 8 Assessment: Incident Triage & Response',
    passingScore: 75,
    questions: [
      {
        id: 'q8-1',
        question: 'An analyst discovers an active command shell on a sensitive production Linux server. Why is immediately powering off or rebooting the server considered a serious operational mistake?',
        choices: [
          'It voids the hardware warranty on the server.',
          'Rebooting clears volatile RAM, destroying running processes, memory-only malware, active socket connections, and encryption keys needed for forensic investigation.',
          'The server cannot be turned on again.',
          'Rebooting automatically emails the attacker a notification.'
        ],
        correctIndex: 1,
        explanation: 'Volatile memory (RAM) holds irreplaceable forensic evidence (injected code, decrypted keys, network connections) that is permanently lost if the machine is rebooted.'
      },
      {
        id: 'q8-2',
        question: 'According to RFC 3227 (Order of Volatility), which of the following evidence sources should be acquired FIRST during a digital forensics investigation?',
        choices: [
          'Hard drive swap space.',
          'Volatile system memory (RAM) and CPU state.',
          'Archived backup tapes stored in the vault.',
          'Printouts of server error logs.'
        ],
        correctIndex: 1,
        explanation: 'RAM and CPU registers are the most volatile data sources and degrade or vanish rapidly, so they must be acquired before persistent disk storage.'
      },
      {
        id: 'q8-3',
        question: 'What is the purpose of using Out-of-Band (OOB) communication channels during a suspected enterprise domain compromise?',
        choices: [
          'To ensure conversations are recorded for television.',
          'If the adversary possesses administrator access, they may be actively reading internal emails or Slack messages; out-of-band channels prevent tipping off the attacker to containment plans.',
          'Out-of-band communications are free of charge.',
          'To bypass corporate firewalls.'
        ],
        correctIndex: 1,
        explanation: 'Adversaries with elevated network access frequently monitor internal IT communication channels to anticipate containment maneuvers.'
      },
      {
        id: 'q8-4',
        question: 'In the NIST Incident Response lifecycle, what occurs during the Eradication phase?',
        choices: [
          'Buying new computers for the entire company.',
          'Completely removing malware, backdoors, and compromised credentials, and resolving the underlying vulnerability that permitted initial access.',
          'Deleting all log files to start with a fresh baseline.',
          'Filing an insurance claim.'
        ],
        correctIndex: 1,
        explanation: 'Eradication focuses on eliminating all remnants of the intrusion, revoking compromised access, and patching the root-cause entry point.'
      }
    ]
  }
};
