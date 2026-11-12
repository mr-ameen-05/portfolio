export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  category: 'cybersecurity' | 'vibe-coding' | 'engineering' | 'ai-sec';
  status: 'live' | 'in-development' | 'upcoming';
  progressPercent?: number;
  level: 'Foundational' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  modulesCount: number;
  tagline: string;
  description: string;
  highlights: string[];
  skillsGained: string[];
  primaryTrack: 'Cybersecurity Analyst' | 'SOC Analyst' | 'VAPT Analyst' | 'Vibe Coding' | 'FDE Engineering';
  externalUrl?: string; // e.g. https://learn.aiameen.online
  deliverables?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  role: string;
  status: 'Active Track' | 'In Development' | 'Curriculum Scoped';
  iconName: 'Shield' | 'Terminal' | 'Crosshair' | 'Sparkles' | 'Layers' | 'Cpu';
  accentColor: string; // Tailwind hex or class
  badge: string;
  summary: string;
  targetAudience: string;
  estimatedDuration: string;
  totalCourses: number;
  corePillars: string[];
  roadmapStages: {
    stage: number;
    title: string;
    description: string;
    skills: string[];
    courseRef?: string;
  }[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-cyber-analyst',
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    role: 'Cybersecurity Defense & Systems Analyst',
    status: 'Active Track',
    iconName: 'Shield',
    accentColor: '#00F0FF',
    badge: 'CORE PILLAR',
    summary: 'A complete foundational-to-practitioner path mastering threat reasoning, computing & network defenses, security architecture, and defensive engineering.',
    targetAudience: 'Aspiring security analysts, sysadmins, software engineers transitioning to security.',
    estimatedDuration: '12–16 Weeks',
    totalCourses: 3,
    corePillars: [
      'Linux Internals & Network Telemetry',
      'Threat Modeling & Trust Boundaries',
      'Defensive Security Controls & Hardening',
      'Identity & Access Governance',
    ],
    roadmapStages: [
      {
        stage: 1,
        title: 'Systems & Networking Baseline',
        description: 'Files, permissions, systemd services, packets, subnets, and command-line telemetric analysis.',
        skills: ['Linux CLI', 'TCP/IP', 'Wireshark', 'Bash Automation'],
        courseRef: 'practical-cybersecurity-teaming',
      },
      {
        stage: 2,
        title: 'Threat Thinking & CIA Assets',
        description: 'Asset identification, threat modeling (STRIDE), and vulnerability lifecycle.',
        skills: ['STRIDE', 'MITRE ATT&CK', 'Attack Surface Mapping'],
        courseRef: 'practical-cybersecurity-teaming',
      },
      {
        stage: 3,
        title: 'Enterprise Defense Architecture',
        description: 'Securing web applications, zero trust boundaries, and cloud configurations.',
        skills: ['Container Security', 'TLS/PKI', 'WAF & Reverse Proxies', 'Hardening'],
      },
      {
        stage: 4,
        title: 'Capstone Assessment',
        description: 'Hands-on enterprise system audit, finding documentation, and defensive remediation report.',
        skills: ['Executive Reporting', 'Remediation Plans', 'Risk Scoring'],
      },
    ],
  },
  {
    id: 'path-soc-analyst',
    title: 'SOC Analyst (L1/L2)',
    slug: 'soc-analyst',
    role: 'Security Operations & Incident Responder',
    status: 'In Development',
    iconName: 'Terminal',
    accentColor: '#3B82F6',
    badge: 'HIGH DEMAND',
    summary: 'Real-world security operations center telemetry, log analysis, alert triage, incident escalation, and SIEM/SOAR automation workflows.',
    targetAudience: 'Students and IT specialists aiming for tier-1/tier-2 SOC and detection engineering roles.',
    estimatedDuration: '10–14 Weeks',
    totalCourses: 2,
    corePillars: [
      'SIEM Telemetry Ingestion (Elastic, Splunk, Wazuh)',
      'Alert Triage & False Positive Reduction',
      'Process Tree Parentage & Living-off-the-Land Analysis',
      'Incident Response Containment Playbooks',
    ],
    roadmapStages: [
      {
        stage: 1,
        title: 'Telemetry & Log Normalization',
        description: 'Ingesting Sysmon, auth logs, Windows Event IDs, and network flow datasets into SIEM.',
        skills: ['Syslog', 'Sysmon', 'Windows Event Logs', 'SIEM Queries'],
      },
      {
        stage: 2,
        title: 'Alert Triage & Investigation',
        description: 'Deconstructing malicious executions, memory injections, and lateral movement artifacts.',
        skills: ['Parentage Tracing', 'Hashes & VirusTotal', 'Command-Line Forensic Analysis'],
      },
      {
        stage: 3,
        title: 'Incident Containment & Playbooks',
        description: 'Executing isolation actions, firewall blocklists, session revoking, and digital evidence handling.',
        skills: ['Containment Playbooks', 'Chain of Custody', 'SOAR Webhooks'],
      },
    ],
  },
  {
    id: 'path-vapt-analyst',
    title: 'VAPT Analyst',
    slug: 'vapt-analyst',
    role: 'Vulnerability Assessment & Penetration Tester',
    status: 'In Development',
    iconName: 'Crosshair',
    accentColor: '#F43F5E',
    badge: 'OFFENSIVE SECURITY',
    summary: 'Ethical offensive security assessment, contained web app penetration testing, network vulnerability discovery, and professional finding reporting.',
    targetAudience: 'Penetration testers, bug bounty hunters, application security engineers.',
    estimatedDuration: '14–18 Weeks',
    totalCourses: 3,
    corePillars: [
      'Rules of Engagement & Legal Scoping',
      'OWASP Top 10 Exploitation & Proof-of-Concepts',
      'API & Cloud Endpoint Reconnaissance',
      'Professional Defensible Reporting & CVSS Scoring',
    ],
    roadmapStages: [
      {
        stage: 1,
        title: 'Reconnaissance & Surface Mapping',
        description: 'Passive and active OSINT, DNS brute-forcing, port scanning, and tech-stack fingerprinting.',
        skills: ['Nmap', 'Subfinder', 'HTTPx', 'Amass', 'Scope Discipline'],
      },
      {
        stage: 2,
        title: 'Web & API Vulnerability Assessment',
        description: 'Deep testing for SQLi, SSRF, IDOR, Broken Authentication, and race conditions.',
        skills: ['Burp Suite Professional', 'Postman', 'OAuth2 Auditing', 'JWT Attacks'],
      },
      {
        stage: 3,
        title: 'Exploit Chaining & Remediation Reporting',
        description: 'Demonstrating impact ethically without service disruption and writing C-level remediation briefs.',
        skills: ['CVSS 3.1/4.0', 'PoC Scripting', 'Defensible Finding Cards', 'Executive Summaries'],
      },
    ],
  },
  {
    id: 'path-vibe-coding',
    title: 'Vibe Coding for Security Analysts',
    slug: 'vibe-coding-security',
    role: 'AI-Native Security Analyst & Toolsmith',
    status: 'Active Track',
    iconName: 'Sparkles',
    accentColor: '#C8FF00',
    badge: 'NEW ERA FRONTIER',
    summary: 'Leverage LLMs, AI agentic reasoning (Claude Code, Cursor, DeepMind CLI), and rapid prototyping to build security scanners, automate SOC triaging, and orchestrate custom tooling at the speed of thought.',
    targetAudience: 'Cybersecurity professionals and developers who want to 10x their tooling velocity using modern AI-assisted engineering.',
    estimatedDuration: '6–8 Weeks',
    totalCourses: 2,
    corePillars: [
      'Agentic Pair-Programming & Cursor Workflows',
      'Automated OSINT & Threat Intelligence Pipelines',
      'Building Custom Security Micro-tools in Python/Go/TypeScript',
      'Auditing AI-Generated Code for Hidden Vulnerabilities',
    ],
    roadmapStages: [
      {
        stage: 1,
        title: 'AI Toolsmithing Foundations',
        description: 'Master prompt engineering for security logic, AST manipulation, and CLI scaffolding.',
        skills: ['Cursor Rules', 'Claude Code / Aider CLI', 'Python Security Tooling', 'FastAPI'],
      },
      {
        stage: 2,
        title: 'Autonomous Threat Intel & Log Parsers',
        description: 'Building automated agents that parse abuse feeds, enrich IPs, and notify Slack/Discord.',
        skills: ['Agent Loops', 'API Integrations', 'Shodan/Censys SDK', 'Webhook Dispatchers'],
      },
      {
        stage: 3,
        title: 'Securing the Vibe (AI Code Safety)',
        description: 'Detecting hallucinated packages (slopsquatting), prompt injection vectors, and insecure defaults in AI code.',
        skills: ['Static Analysis (Semgrep)', 'Dependency Audits', 'Prompt Injection Defense'],
      },
    ],
  },
  {
    id: 'path-fde-engineering',
    title: 'Forward Deployed Engineering (FDE)',
    slug: 'fde-engineering',
    role: 'Production Systems & Client Integration Engineer',
    status: 'In Development',
    iconName: 'Layers',
    accentColor: '#A855F7',
    badge: 'SYSTEMS BUILDER',
    summary: 'Bridging high-stakes enterprise engineering, complex on-prem/cloud deployments, client technical integration, and mission-critical production reliability.',
    targetAudience: 'Full-stack engineers, solutions architects, and technical consultants deploying in enterprise client environments.',
    estimatedDuration: '10–12 Weeks',
    totalCourses: 2,
    corePillars: [
      'Client Architecture Scoping & Enterprise Integrations',
      'Docker, Kubernetes & Air-Gapped Deployments',
      'High-Availability Database & Nginx Reverse Proxy Architecture',
      'Production Incident Handling & On-Call Engineering',
    ],
    roadmapStages: [
      {
        stage: 1,
        title: 'Architecture Scoping & Environment Discovery',
        description: 'Analyzing legacy enterprise constraints, network policies, firewall hoops, and SSO requirements.',
        skills: ['System Design', 'SAML/OIDC', 'VPC Peering', 'Client Consulting'],
      },
      {
        stage: 2,
        title: 'Hardened Container & Production Deployments',
        description: 'Deploying immutable infrastructure, automated SSL/TLS termination, and database replication.',
        skills: ['Docker Compose', 'Kubernetes Helm', 'Nginx Hardening', 'PostgreSQL HA'],
      },
      {
        stage: 3,
        title: 'Observability & Rapid Emergency Bugfixes',
        description: 'Live production debugging, Prometheus/Grafana tracing, and zero-downtime hot patches.',
        skills: ['Prometheus/Grafana', 'Structured Logging', 'CI/CD Blue-Green Deployments'],
      },
    ],
  },
];

export const COURSES_CATALOG: CourseItem[] = [
  {
    id: 'course-teaming',
    title: 'Practical Cybersecurity: Red, Blue & Purple Teaming',
    slug: 'teaming',
    category: 'cybersecurity',
    status: 'live',
    progressPercent: 100,
    level: 'Foundational',
    duration: '10–12 Weeks (Self-Paced)',
    modulesCount: 11,
    tagline: 'Dual-perspective cybersecurity mastery with zero-fluff interactive sandboxes and defensive reasoning.',
    description: 'A 11-module master course engineered from real-world operations. Learn to reason about security like an attacker, defend infrastructure like an enterprise SOC lead, and bridge both teams in purple collaborative validation.',
    highlights: [
      '11 Interactive Learning Modules with Browser Labs',
      '100% Contained, Ethical Synthetic Datasets',
      'MITRE ATT&CK Mapping & Finding Documentation',
      'Interactive Quizzes with Instant Telemetry Feedback',
      'Comprehensive Capstone Project Scenario',
    ],
    skillsGained: [
      'Linux Security Internals',
      'Network Packet Triage',
      'Web Application Vulnerability Analysis',
      'SOC Telemetry & Incident Lifecycle',
      'Purple Team Collaboration',
    ],
    primaryTrack: 'Cybersecurity Analyst',
    externalUrl: 'https://learn.aiameen.online',
    deliverables: ['11 Practice Modules', 'Contained Browser Sandboxes', 'Course Completion Certificate', 'Executive Finding Cards'],
  },
  {
    id: 'course-vibe-sec',
    title: 'Vibe Coding: Building AI-Augmented Security Scanners',
    slug: 'vibe-coding-security-scanners',
    category: 'vibe-coding',
    status: 'in-development',
    progressPercent: 70,
    level: 'All Levels',
    duration: '5 Weeks',
    modulesCount: 6,
    tagline: 'Build custom recon tools, automated OSINT pipelines, and triage assistants using Cursor & Claude Code.',
    description: 'Stop writing boilerplate scripts by hand. Learn how elite security analysts build production-grade CLI tools, automated Shodan scanners, and Discord alert bots in hours using agentic AI pairing while maintaining secure code hygiene.',
    highlights: [
      'Rapid Tool Prototyping with Cursor & LLM CLI agents',
      'Integrating VirusTotal, Shodan, and AlienVault APIs',
      'Automated Vulnerability Digest Generators',
      'Auditing AI Code for Hallucinated Supply-Chain Exploits',
    ],
    skillsGained: [
      'Agentic Pair-Programming',
      'Python Security Scripting',
      'API Security Aggregation',
      'Automated Telemetry Pipelines',
    ],
    primaryTrack: 'Vibe Coding',
    deliverables: ['4 Production-Ready Security CLI Tools', 'Custom Cursor Rulesets for AppSec', 'GitHub Project Templates'],
  },
  {
    id: 'course-soc-telemetry',
    title: 'Hands-On SOC Telemetry: Log Ingestion, Alert Triage & Incident Playbooks',
    slug: 'hands-on-soc-telemetry',
    category: 'cybersecurity',
    status: 'in-development',
    progressPercent: 60,
    level: 'Intermediate',
    duration: '8 Weeks',
    modulesCount: 8,
    tagline: 'Master SIEM query syntax, parent-child process anomalies, and containment execution.',
    description: 'Dive deep into real enterprise incident logs. Learn how to reconstruct attacker kill chains from Sysmon telemetry, differentiate harmless admin scripts from stealthy malware, and execute step-by-step incident containment.',
    highlights: [
      'Simulated Enterprise Sysmon and Linux Audit Datasets',
      'False Positive Filtering & Sigma Rule Crafting',
      'Living-off-the-Land (LOLBAS/GTFOBins) Detection',
      'Live Tabletop Containment Decision Trees',
    ],
    skillsGained: [
      'SIEM / Elastic / Splunk Querying',
      'Memory & Process Forensic Triage',
      'Sigma Detection Rules',
      'Incident Response Containment',
    ],
    primaryTrack: 'SOC Analyst',
    deliverables: ['Real Attack Scenario Workbooks', 'Sigma Rule Repository', 'Incident Response Playbook Templates'],
  },
  {
    id: 'course-vapt-web',
    title: 'Modern Web & API Penetration Testing (VAPT)',
    slug: 'modern-vapt-web-api',
    category: 'cybersecurity',
    status: 'in-development',
    progressPercent: 45,
    level: 'Intermediate',
    duration: '9 Weeks',
    modulesCount: 9,
    tagline: 'Authorized testing methodology for modern SPAs, GraphQL endpoints, and OAuth flows.',
    description: 'Move beyond outdated automated scanners. Learn manual methodology to uncover business logic bugs, authorization bypasses (IDOR), JWT token tampering, and SSRF flaws in modern cloud architectures.',
    highlights: [
      'Burp Suite Professional Power-User Workflows',
      'Testing Microservices, REST & GraphQL Endpoints',
      'Business Logic Bypass Techniques',
      'Writing Clear, C-Level Defensible Finding Reports',
    ],
    skillsGained: [
      'Manual Web Pentesting',
      'API Security Testing',
      'OWASP Top 10 Exploitation',
      'Vulnerability Documentation',
    ],
    primaryTrack: 'VAPT Analyst',
    deliverables: ['Target Practice Lab Walkthroughs', 'Professional Pentest Report Template', 'API Testing Postman Collections'],
  },
  {
    id: 'course-fde-production',
    title: 'Forward Deployed Engineering: Shipping Secure Enterprise Systems',
    slug: 'fde-shipping-secure-systems',
    category: 'engineering',
    status: 'in-development',
    progressPercent: 40,
    level: 'Advanced',
    duration: '6 Weeks',
    modulesCount: 6,
    tagline: 'From contract scope to air-gapped production: how FDEs build and deploy bulletproof software.',
    description: 'Learn the exact operational playbook of Forward Deployed Engineers: navigating enterprise security reviews, architecting zero-trust networks, orchestrating resilient container deployments, and debugging client edge cases live in production.',
    highlights: [
      'Enterprise Client Scoping & Security Questionnaires',
      'Hardened Docker & Reverse-Proxy Nginx Setups',
      'Automated Healthcheck & Failover Architecture',
      'Production War Stories & Rapid Debugging Strategies',
    ],
    skillsGained: [
      'Enterprise Systems Integration',
      'Container Hardening',
      'TLS / SSL Automation',
      'Production Reliability Engineering',
    ],
    primaryTrack: 'FDE Engineering',
    deliverables: ['Enterprise Deployment Blueprint', 'Nginx Security Config Suite', 'Docker Production Template'],
  },
];
