import { GlossaryItem } from '../types/course.types';

/** Build-time authoring source / offline fallback for the glossary. */
export const LOCAL_GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'glossary-adversary-emulation',
    term: 'Adversary Emulation',
    definition: 'A specialized red team assessment where operators explicitly emulate the tactics, techniques, and procedures (TTPs) of known threat actor groups (e.g., APT29, FIN7) to test defensive coverage.',
    track: 'red',
    relatedLessonSlugs: ['red-team-pentest-vuln-assessment-simulation']
  },
  {
    id: 'glossary-air-gap',
    term: 'Air Gap / Network Isolation',
    acronym: 'Air-Gap',
    definition: 'A security measure where a computer or private network has no physical or logical interfaces connected to external networks or the public internet, preventing remote compromise or data egress.',
    track: 'core',
    relatedLessonSlugs: ['safe-lab-environments-synthetic-data']
  },
  {
    id: 'glossary-attack-surface',
    term: 'Attack Surface',
    definition: 'The total sum of all vulnerabilities, open ports, accessible web applications, user endpoints, and external trust boundaries through which an unauthorized user can attempt to enter or extract data.',
    track: 'core',
    relatedLessonSlugs: ['cia-assets-trust-boundaries']
  },
  {
    id: 'glossary-auditd',
    term: 'Auditd (Linux Audit Daemon)',
    definition: 'The userspace component to the Linux Auditing System that monitors system calls, file system modifications, and execution events for security logging and compliance.',
    track: 'blue',
    relatedLessonSlugs: ['endpoint-identity-network-app-telemetry']
  },
  {
    id: 'glossary-authentication',
    term: 'Authentication',
    acronym: 'AuthN',
    definition: 'The process of verifying the identity of a user, process, or device (e.g., checking credentials, password hashes, or biometric tokens) to answer "Who are you?".',
    track: 'core',
    relatedLessonSlugs: ['authentication-authorization-least-privilege']
  },
  {
    id: 'glossary-authorization',
    term: 'Authorization',
    acronym: 'AuthZ',
    definition: 'The security mechanism that determines what resources or operations an authenticated identity is permitted to access, answering "What are you allowed to do?".',
    track: 'core',
    relatedLessonSlugs: ['authentication-authorization-least-privilege']
  },
  {
    id: 'glossary-backporting',
    term: 'Backporting',
    definition: 'The practice in enterprise Linux distributions (such as Debian and Ubuntu) where a security patch is applied to an older software version without updating the main upstream version number.',
    track: 'blue',
    relatedLessonSlugs: ['analyze-supplied-scan-results']
  },
  {
    id: 'glossary-bola',
    term: 'Broken Object Level Authorization',
    acronym: 'BOLA / IDOR',
    definition: 'An access-control flaw where an API endpoint exposes an object identifier without verifying that the requesting authenticated user has authorization to access that specific object.',
    track: 'red',
    relatedLessonSlugs: ['validate-finding-safely-contained-target', 'authentication-authorization-least-privilege']
  },
  {
    id: 'glossary-chain-of-custody',
    term: 'Chain of Custody',
    definition: 'A chronological, verifiable paper or cryptographic record tracing the custody, transfer, analysis, and disposition of physical or digital forensic evidence.',
    track: 'blue',
    relatedLessonSlugs: ['evidence-handling-privacy-professional-communication', 'evidence-preservation-chain-of-custody']
  },
  {
    id: 'glossary-cia-triad',
    term: 'CIA Triad',
    acronym: 'CIA',
    definition: 'The core model of information security encompassing Confidentiality (preventing unauthorized viewing), Integrity (preventing unauthorized modification), and Availability (ensuring uptime and accessibility).',
    track: 'core',
    relatedLessonSlugs: ['cia-assets-trust-boundaries']
  },
  {
    id: 'glossary-cis-benchmarks',
    term: 'CIS Benchmarks',
    acronym: 'CIS',
    definition: 'Consensus-derived configuration baselines published by the Center for Internet Security prescribing prescriptive system hardening settings for OSs, containers, and cloud services.',
    track: 'blue',
    relatedLessonSlugs: ['secure-configuration-patching-backups']
  },
  {
    id: 'glossary-cisa-kev',
    term: 'CISA Known Exploited Vulnerabilities',
    acronym: 'KEV',
    definition: 'An authoritative catalog of software vulnerabilities published by CISA that have been confirmed to be actively exploited by real-world threat actors in the wild.',
    track: 'blue',
    relatedLessonSlugs: ['vulnerability-management-remediation-prioritization']
  },
  {
    id: 'glossary-cvss',
    term: 'Common Vulnerability Scoring System',
    acronym: 'CVSS',
    definition: 'An open framework for measuring the characteristics and severity of software vulnerabilities, producing a numerical score from 0.0 to 10.0.',
    track: 'red',
    relatedLessonSlugs: ['record-evidence-assess-impact-finding-card', 'risk-ratings-uncertainty-avoiding-exaggeration']
  },
  {
    id: 'glossary-cwe',
    term: 'Common Weakness Enumeration',
    acronym: 'CWE',
    definition: 'A community-developed taxonomy of software and hardware weakness categories (e.g., CWE-89 for SQL Injection, CWE-79 for XSS) maintained by MITRE.',
    track: 'core',
    relatedLessonSlugs: ['common-weakness-categories-owasp-top10']
  },
  {
    id: 'glossary-data-minimization',
    term: 'Data Minimization',
    definition: 'The privacy and security principle that restricts the collection and retention of personal or sensitive data to only what is strictly required to fulfill a specific operational purpose.',
    track: 'core',
    relatedLessonSlugs: ['evidence-handling-privacy-professional-communication']
  },
  {
    id: 'glossary-deconfliction',
    term: 'Deconfliction',
    definition: 'The operational process where assessment leadership and defense personnel determine whether a security alert stems from authorized red team activity or an actual malicious third-party attacker.',
    track: 'red',
    relatedLessonSlugs: ['define-objectives-scope-timing-stop-conditions']
  },
  {
    id: 'glossary-defense-in-depth',
    term: 'Defense in Depth',
    definition: 'A security strategy employing multiple layered defenses so that if an adversary circumvents one control (e.g., a firewall), secondary controls (e.g., EDR, RBAC) prevent total compromise.',
    track: 'core',
    relatedLessonSlugs: ['preventive-detective-corrective-controls']
  },
  {
    id: 'glossary-dwell-time',
    term: 'Dwell Time',
    definition: 'The duration of time an adversary remains undetected inside a victim\'s environment between initial compromise and detection or eviction.',
    track: 'blue',
    relatedLessonSlugs: ['alert-triage-prioritization-escalation']
  },
  {
    id: 'glossary-edr',
    term: 'Endpoint Detection and Response',
    acronym: 'EDR',
    definition: 'Software installed on workstations and servers that continuously monitors process creation, file modifications, and network sockets, providing automated response and forensic investigation.',
    track: 'blue',
    relatedLessonSlugs: ['endpoint-identity-network-app-telemetry']
  },
  {
    id: 'glossary-epss',
    term: 'Exploit Prediction Scoring System',
    acronym: 'EPSS',
    definition: 'A data-driven machine learning model developed by FIRST that estimates the probability (0 to 1) that a given software vulnerability will be exploited in the wild within 30 days.',
    track: 'blue',
    relatedLessonSlugs: ['vulnerability-management-remediation-prioritization']
  },
  {
    id: 'glossary-fido2',
    term: 'FIDO2 / WebAuthn',
    definition: 'An open authentication standard using public-key cryptography bound to the browser\'s origin domain, providing phishing-resistant multi-factor authentication.',
    track: 'core',
    relatedLessonSlugs: ['password-storage-mfa-session-safety', 'identity-hardening-mfa-least-privilege']
  },
  {
    id: 'glossary-httponly',
    term: 'HttpOnly Cookie Attribute',
    definition: 'A security flag directive in HTTP Set-Cookie headers prohibiting client-side scripts (JavaScript) from accessing the cookie, preventing session theft via Cross-Site Scripting.',
    track: 'core',
    relatedLessonSlugs: ['http-requests-tls-browser-devtools']
  },
  {
    id: 'glossary-least-privilege',
    term: 'Least Privilege',
    definition: 'The security practice of granting users, processes, and service accounts only the minimum privileges required to execute their job functions, preventing lateral movement upon compromise.',
    track: 'core',
    relatedLessonSlugs: ['files-processes-permissions-services', 'identity-hardening-mfa-least-privilege']
  },
  {
    id: 'glossary-mitre-attack',
    term: 'MITRE ATT&CK',
    acronym: 'ATT&CK',
    definition: 'A globally recognized knowledge base of real-world adversary tactics, techniques, and procedures (TTPs) organized into matrices used for detection planning and threat emulation.',
    track: 'purple',
    relatedLessonSlugs: ['mapping-behaviors-to-mitre-attack', 'attack-informed-detection-planning-timeline-practice']
  },
  {
    id: 'glossary-mttd',
    term: 'Mean Time to Detect',
    acronym: 'MTTD',
    definition: 'An operational security metric measuring the average time elapsed between an adversary\'s initial system compromise and the security team\'s first confirmed detection alert.',
    track: 'blue',
    relatedLessonSlugs: ['metrics-that-support-learning']
  },
  {
    id: 'glossary-mttr',
    term: 'Mean Time to Remediate',
    acronym: 'MTTR',
    definition: 'The average time taken to patch a confirmed vulnerability or contain and eradicate an active incident after its identification.',
    track: 'blue',
    relatedLessonSlugs: ['metrics-that-support-learning']
  },
  {
    id: 'glossary-order-of-volatility',
    term: 'Order of Volatility',
    definition: 'The sequence in which digital evidence must be collected in forensic investigations, prioritizing transient sources (CPU cache, RAM) before persistent storage (hard drives, backups).',
    track: 'blue',
    relatedLessonSlugs: ['evidence-preservation-chain-of-custody']
  },
  {
    id: 'glossary-owasp-top-10',
    term: 'OWASP Top 10',
    acronym: 'OWASP',
    definition: 'The Open Web Application Security Project\'s widely adopted consensus awareness ranking of the ten most critical web application security risks.',
    track: 'core',
    relatedLessonSlugs: ['common-weakness-categories-owasp-top10']
  },
  {
    id: 'glossary-parameterized-query',
    term: 'Parameterized Query (Prepared Statement)',
    definition: 'A coding pattern where database queries are pre-compiled and user input is passed strictly as data parameters, neutralizing SQL injection vulnerabilities.',
    track: 'core',
    relatedLessonSlugs: ['input-handling-output-encoding-secure-defaults']
  },
  {
    id: 'glossary-passive-recon',
    term: 'Passive Reconnaissance',
    definition: 'Gathering intelligence about target infrastructure, DNS, and personnel using public records, search engines, and third-party data without transmitting packets directly to target servers.',
    track: 'red',
    relatedLessonSlugs: ['reconnaissance-concepts-fictional-org']
  },
  {
    id: 'glossary-purple-teaming',
    term: 'Purple Teaming',
    definition: 'A collaborative methodology where offensive (red) and defensive (blue) practitioners work transparently together to test, measure, and optimize detection rules and controls in real time.',
    track: 'purple',
    relatedLessonSlugs: ['detection-tuning-purple-team-feedback-loops', 'capstone-reporting-reflection-part-e']
  },
  {
    id: 'glossary-rules-of-engagement',
    term: 'Rules of Engagement',
    acronym: 'ROE',
    definition: 'A formal legal agreement between testing teams and asset owners defining allowed target IPs, excluded systems, testing windows, emergency contacts, and stop conditions.',
    track: 'core',
    relatedLessonSlugs: ['authorization-scope-rules-of-engagement']
  },
  {
    id: 'glossary-sigma',
    term: 'Sigma Detection Format',
    definition: 'An open-source, vendor-agnostic signature format for writing log detection rules that can be converted into queries for Splunk, Elastic, Microsoft Sentinel, and other SIEMs.',
    track: 'blue',
    relatedLessonSlugs: ['detection-logic-signal-context-false-positives']
  },
  {
    id: 'glossary-stop-condition',
    term: 'Stop Condition',
    definition: 'An unambiguous, mandatory operational threshold (such as encountering third-party servers, production data corruption, or active malicious intruders) where testing halts immediately.',
    track: 'core',
    relatedLessonSlugs: ['authorization-scope-rules-of-engagement']
  },
  {
    id: 'glossary-stride',
    term: 'STRIDE Threat Model',
    acronym: 'STRIDE',
    definition: 'A threat modeling framework categorizing threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.',
    track: 'core',
    relatedLessonSlugs: ['threat-modeling-fictional-portfolio-webapp']
  },
  {
    id: 'glossary-synthetic-data',
    term: 'Synthetic Data',
    definition: 'Artificially generated data that mirrors real-world schemas, formats, and statistical distributions without containing actual personal identities, production secrets, or proprietary information.',
    track: 'core',
    relatedLessonSlugs: ['safe-lab-environments-synthetic-data']
  },
  {
    id: 'glossary-sysmon',
    term: 'Sysmon (System Monitor)',
    definition: 'A free Microsoft Sysinternals utility that monitors and logs deep process creation, network connection, and registry activity to the Windows event log.',
    track: 'blue',
    relatedLessonSlugs: ['endpoint-identity-network-app-telemetry']
  },
  {
    id: 'glossary-trust-boundary',
    term: 'Trust Boundary',
    definition: 'A logical or network perimeter across which data or program execution transitions between different levels of privilege, requiring explicit validation and authentication.',
    track: 'core',
    relatedLessonSlugs: ['cia-assets-trust-boundaries']
  },
  {
    id: 'glossary-white-cell',
    term: 'White Cell (Trusted Agent)',
    definition: 'Designated client leadership personnel who monitor assessment safety, deconflict real incidents from exercise simulations, and hold emergency stop authority.',
    track: 'red',
    relatedLessonSlugs: ['red-team-pentest-vuln-assessment-simulation', 'define-objectives-scope-timing-stop-conditions']
  },
  {
    id: 'glossary-xss',
    term: 'Cross-Site Scripting',
    acronym: 'XSS',
    definition: 'A security vulnerability where an application includes unvalidated user data in a web page, allowing attackers to execute arbitrary client-side scripts in victim browsers.',
    track: 'core',
    relatedLessonSlugs: ['input-handling-output-encoding-secure-defaults']
  }
];

let active: GlossaryItem[] = LOCAL_GLOSSARY_ITEMS;

/** Live binding: database-served glossary once hydrated, else the build copy. */
export let GLOSSARY_ITEMS: GlossaryItem[] = active;

export function setGlossaryItems(next: GlossaryItem[] | null | undefined): void {
  active = next && next.length > 0 ? next : LOCAL_GLOSSARY_ITEMS;
  GLOSSARY_ITEMS = active;
}
