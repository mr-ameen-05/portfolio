/**
 * Cybersecurity Journey & Mind Map data.
 * Structured as an interactive drill-down tree from bedrock fundamentals
 * to modern frontiers. Color Team nodes (RED/BLUE/PURPLE/YELLOW/WHITE)
 * are parent items that expand into specialized sub-topics.
 * Personal focus nodes are flagged for integration with the "My Expertise" badges.
 */

export type FocusArea = 'offense' | 'defense' | 'purple' | 'devsecops' | 'white' | 'frontier';

// A node in the cybersecurity knowledge tree.
// Children represent sub-topics under a parent category.
export interface MindMapNode {
  id: string;
  label: string;
  level: number; // 0 = bedrock, 1 = principles, 2 = color teams, 3 = sub-topics
  category: FocusArea;
  description: string;
  tools: string[];
  // When true, shows a "My Expertise" badge on the visualization
  isMyFocus: boolean;
  // Link destination ID in the portfolio (e.g., a project or section ID)
  focusLink?: string;
  // Child nodes for drill-down tree view
  children?: MindMapNode[];
  // Expanded state for tree view (managed by component UI state)
  expanded?: boolean;
}

// Structured data with nested children for the interactive tree.
// The Color Team nodes at level 2 have children at level 3 representing
 // specific topics within each team's domain.
export const CYBER_ROADMAP_NODES: MindMapNode[] = [
  // ── Level 0: Core Bedrock (Foundational) ──
  {
    id: 'bedrock-arch',
    label: 'Computer Architecture & OS',
    level: 0,
    category: 'offense',
    description:
      'Understanding how computers, networks, and operating systems work beneath the interface—memory layout, process scheduling, kernel internals on Linux and Windows.',
    tools: ['GDB', 'WinDbg', 'vmmap', 'cat /proc/meminfo'],
    isMyFocus: true,
    focusLink: 'linux-container-hardening',
  },
  {
    id: 'bedrock-network',
    label: 'Networking Fundamentals',
    level: 0,
    category: 'offense',
    description:
      'OSI model, TCP/IP stack, DNS resolution, ARP, TLS handshakes, and packet analysis fundamentals with Wireshark.',
    tools: ['Wireshark', 'tcpdump', 'nmap', 'dig', 'nslookup'],
    isMyFocus: true,
    focusLink: 'banihal-orb',
  },
  {
    id: 'bedrock-scripting',
    label: 'Automation & Scripting',
    level: 0,
    category: 'offense',
    description:
      'CLI mastery for Bash and Python—building tooling, automating reconnaissance, and orchestrating security operations at speed.',
    tools: ['Bash', 'Python', 'jq', 'curl', 'httpx'],
    isMyFocus: true,
    focusLink: 'observability-pipeline',
  },

  // ── Level 1: Foundational Security Principles ──
  {
    id: 'principles-cia',
    label: 'CIA Triad',
    level: 1,
    category: 'defense',
    description:
      'The cornerstone of security policy: Confidentiality, Integrity, and Availability. How to design systems that balance all three under real-world constraints.',
    tools: ['Policy documents', 'Risk registers', 'threat modeling'],
    isMyFocus: false,
    focusLink: undefined,
  },
  {
    id: 'principles-ident-access',
    label: 'Identity & Access Management',
    level: 1,
    category: 'defense',
    description:
      'RBAC design, authentication vs. authorization, least-privilege principle, SSH key-only policies, and federated identity flows.',
    tools: ['OpenSSH', 'TOTP', 'Kerberos', 'Active Directory', 'sudos'],
    isMyFocus: true,
    focusLink: 'doctorsloom',
  },
  {
    id: 'principles-threat',
    label: 'Threat Landscapes',
    level: 1,
    category: 'defense',
    description:
      'Identifying attack surfaces, tracking CVE lifecycles, understanding common misconfigurations, and modeling threat actors.',
    tools: ['MITRE ATT&CK', 'CVE databases', 'Vulnerability scanners'],
    isMyFocus: false,
    focusLink: undefined,
  },

  // ── Level 2: The Cyber Color Team Leaders (Parent Nodes) ──
  // These are the main interactive items. Clicking them reveals sub-topics.
  {
    id: 'red-team',
    label: 'RED TEAM (Offensive Security)',
    level: 2,
    category: 'offense',
    description:
      'Offensive security operations: finding vulnerabilities, exploiting weaknesses, and assessing real-world attack paths.',
    tools: ['Nmap', 'Metasploit', 'Burp Suite', 'Wireshark'],
    isMyFocus: false,
    focusLink: undefined,
    // Children represent specific sub-topics under Red Team
    children: [
      {
        id: 'red-recon',
        label: 'Reconnaissance & OSINT',
        level: 3,
        category: 'offense',
        description:
          'Subdomain enumeration, passive OSINT, port scanning, service version detection, and building attacker reconnaissance playbooks.',
        tools: ['Nmap', 'Amass', 'Subfinder', 'Wireshark', 'curl'],
        isMyFocus: false,
        focusLink: undefined,
      },
      {
        id: 'red-web',
        label: 'Web App Security',
        level: 3,
        category: 'offense',
        description:
          'OWASP Top 10 exploitation: SQL injection, XSS, SSRF, IDOR/BOLA, and API security flaws.',
        tools: ['Burp Suite', 'SQLMap', 'XSStrike', 'Nuclei', 'ffuf'],
        isMyFocus: false,
        focusLink: undefined,
      },
      {
        id: 'red-exploit',
        label: 'Exploitation & PrivEsc',
        level: 3,
        category: 'offense',
        description:
          'Linux SUID/bin capabilities, Windows token impersonation, kernel exploits, and post-exploitation frameworks (Metasploit, Cobalt Strike).',
        tools: ['Metasploit', 'Cobalt Strike', 'LinPEAS', 'WinPEAS', 'privilege-escalation scripts'],
        isMyFocus: false,
        focusLink: undefined,
      },
    ],
  },
  {
    id: 'blue-team',
    label: 'BLUE TEAM (Defensive Security)',
    level: 2,
    category: 'defense',
    description:
      'Defensive security operations: hardening infrastructure, monitoring telemetry, and responding to incidents.',
    tools: ['UFW', 'iptables', 'Prometheus', 'Loki', 'Wazuh'],
    isMyFocus: true,
    focusLink: 'linux-container-hardening',
    // Children represent specific sub-topics under Blue Team
    children: [
      {
        id: 'blue-hardening',
        label: 'Infrastructure Hardening',
        level: 3,
        category: 'defense',
        description:
        'Host hardening with UFW/iptables, SSH key-only policies, disabling unnecessary daemons, rootless container setups (Podman), and systemd security hardening.',
        tools: ['UFW', 'iptables', 'SSH', 'Podman', 'systemd', 'AppArmor', 'SELinux'],
        isMyFocus: true,
        focusLink: 'linux-container-hardening',
      },
      {
        id: 'blue-telemetry',
        label: 'Telemetry & Log Aggregation',
        level: 3,
        category: 'defense',
        description:
          'Centralizing logs with Loki, Promtail, systemd journals, and Elastic Stack. Correlating events, building detection pipelines, and eliminating alert noise.',
        tools: ['Promtail', 'Loki', 'systemd-journald', 'Elasticsearch', 'Grafana'],
        isMyFocus: true,
        focusLink: 'observability-pipeline',
      },
      {
        id: 'blue-soc',
        label: 'SOC Monitoring & SIEM',
        level: 3,
        category: 'defense',
        description:
          'Prometheus metrics scraping, alert rulewriting (Alertmanager), Wazuh rule sets, and incident triage playbooks for confirmed vs. false-positive differentiation.',
        tools: ['Prometheus', 'Grafana', 'Alertmanager', 'Wazuh', 'Splunk'],
        isMyFocus: false,
        focusLink: undefined,
      },
    ],
  },
  {
    id: 'purple-team',
    label: 'PURPLE TEAM (Adversary Emulation)',
    level: 2,
    category: 'purple',
    description:
      'Bridging offense and defense: validating detections against known attack techniques and closing the feedback loop.',
    tools: ['Caldera', 'Metasploit', 'Sigma', 'YARA'],
    isMyFocus: false,
    focusLink: undefined,
    children: [
      {
        id: 'purple-validation',
        label: 'Continuous Validation',
        level: 3,
        category: 'purple',
        description:
          'Running Red-team techniques against Blue-team detections, measuring alert fidelity, and closing the feedback loop between offense and defense.',
        tools: ['Caldera', 'Metasploit Framework', 'Red Team Infrastructure', 'Sigma'],
        isMyFocus: false,
        focusLink: undefined,
      },
      {
        id: 'purple-detection',
        label: 'Detection Engineering',
        level: 3,
        category: 'purple',
        description:
          'Writing Sigma rules, YARA rules, and auditd filters to codify detected behaviors. Validating rules against known and novel attack techniques.',
        tools: ['Sigma', 'YARA', 'auditd', 'Loki queries', 'Grafana alert rules'],
        isMyFocus: false,
        focusLink: undefined,
      },
    ],
  },
  {
    id: 'yellow-team',
    label: 'YELLOW TEAM (DevSecOps)',
    level: 2,
    category: 'devsecops',
    description:
      'Integrating security into the development lifecycle: CI/CD pipeline security, container hardening, and automated testing.',
    tools: ['GitHub Actions', 'Bandit', 'Semgrep', 'Trivy', 'TruffleHog'],
    isMyFocus: true,
    focusLink: 'banihal-orb',
    children: [
      {
        id: 'yellow-sdlc',
        label: 'Secure SDLC',
        level: 3,
        category: 'devsecops',
        description:
          'Integrating security into CI/CD pipelines: SAST (bandit, semgrep), DAST (OWASP ZAP), secret scanning (truffleHog), and automated dependency checks.',
        tools: ['GitHub Actions', 'Bandit', 'Semgrep', 'TruffleHog', 'Trivy'],
        isMyFocus: false,
        focusLink: undefined,
      },
      {
        id: 'yellow-container',
        label: 'Container Security',
        level: 3,
        category: 'devsecops',
        description:
          'Podman rootless pods, daemonless runtimes, Kubernetes RBAC least-privilege, image signing (Notary), and runtime security for containerized workloads.',
        tools: ['Podman', 'Buildah', 'Crane', 'Kubectl', 'OpenSCADA'],
        isMyFocus: true,
        focusLink: 'banihal-orb',
      },
    ],
  },
  {
    id: 'white-team',
    label: 'WHITE TEAM (Governance, Risk & Compliance)',
    level: 2,
    category: 'white',
    description:
      'Security auditing, risk assessments, and compliance mapping to frameworks like ISO 27001, SOC 2, HIPAA, and GDPR.',
    tools: ['Drata', 'Vanta', 'Microsoft Purview', 'Compliance checklists', 'AWS Config'],
    isMyFocus: false,
    focusLink: undefined,
    children: [
      {
        id: 'white-govance',
        label: 'Risk Assessments & Auditing',
        level: 3,
        category: 'white',
        description:
          'Risk assessments, security auditing, ISO 27001 / SOC 2 control mapping, HIPAA/GDPR data handling, and policy documentation for organizational compliance.',
        tools: ['Drata', 'Vanta', 'Microsoft Purview', 'Compliance checklists', 'AWS Config'],
        isMyFocus: false,
        focusLink: undefined,
      },
    ],
  },

  // ── Level 3: Modern Frontiers (Specialized Depth) ──
  // Standalone frontier topics that don't fall under color teams
  {
    id: 'frontier-cloud',
    label: 'Cloud Infrastructure Security',
    level: 3,
    category: 'frontier',
    description:
      'AWS IAM permission boundaries, Azure AD Conditional Access, S3 bucket leakage hunts, split-horizon DNS, and cloud-native CSPM.',
    tools: ['AWS Console', 'Azure Portal', 'Prowler', 'Spectral'],
    isMyFocus: false,
    focusLink: undefined,
  },
  {
    id: 'frontier-containers',
    label: 'Container & Microservice Hardening',
    level: 3,
    category: 'frontier',
    description:
      'Rootless Podman/orchestration without daemon, Kubernetes admission controllers, service mesh mTLS, zero-trust network segmentation, and ephemeral workload identities.',
    tools: ['Podman', 'Crictl', 'Kustomize', 'OPA Gatekeeper', 'Linkerd'],
    isMyFocus: true,
    focusLink: 'banihal-orb',
  },
  {
    id: 'frontier-ai-security',
    label: 'Applied AI Security',
    level: 3,
    category: 'frontier',
    description:
      'Defending LLM-powered systems: prompt injection mitigation, API guardrails, tool-use permission boundaries, and adversarial input classification for generative AI deployments.',
    tools: ['llama.cpp', 'Ollama', 'PromptGuard', 'Audited tool schemas'],
    isMyFocus: false,
    focusLink: undefined,
  },
];