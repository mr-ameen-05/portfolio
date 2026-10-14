import { ModuleData } from '../../types/course.types';

export const MODULE_1: ModuleData = {
  id: 'mod-01',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'computing-networks-command-line',
  title: 'Module 1 — Computing, Networks, and the Command Line',
  track: 'core',
  summary: 'Master the operating system foundations, network protocol mechanics, HTTP transactions, and shell utilities that power modern security analysis.',
  orderIndex: 1,
  required: true,
  objectives: [
    'Explain Linux and POSIX process models, user privileges, file permissions, and system services.',
    'Trace how packets travel through IP routing, DNS resolution, and TCP/UDP transport layers.',
    'Deconstruct HTTP request/response headers, status codes, and TLS cryptographic guarantees.',
    'Use standard shell pipelines to inspect and filter synthetic network traffic logs.'
  ],
  onePageCheatSheet: `### Module 1 Cheat Sheet: Networking & CLI Fundamentals
- **Permissions:** \`rwx\` (Read=4, Write=2, Execute=1). \`chmod 750 file\` -> Owner: rwx, Group: r-x, Others: none.
- **TCP 3-Way Handshake:** Client SYN -> Server SYN-ACK -> Client ACK.
- **Common Ports:** 22 (SSH), 53 (DNS), 80 (HTTP), 443 (HTTPS), 3306 (MySQL), 5432 (PostgreSQL).
- **HTTP Methods:** GET (retrieve), POST (submit), PUT/PATCH (update), DELETE (remove).
- **Core Shell Tools:** \`grep -iE\` (search pattern), \`awk '{print $1}'\` (extract column), \`sort | uniq -c\` (frequency count).`,
  lessons: [
    {
      id: 'lesson-01-01',
      moduleId: 'mod-01',
      slug: 'files-processes-permissions-services',
      title: '1.1 Files, Processes, Users, Permissions, and Services',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Both security hardening and exploit containment rely on operating system privilege boundaries. Misconfigured permissions or unconstrained services create immediate lateral movement vectors.',
      objectives: [
        'Differentiate between user IDs (UIDs), group IDs (GIDs), and the superuser (root).',
        'Calculate octal and symbolic Linux file permissions (rwx).',
        'Identify background daemons and service managers (systemd/init).'
      ],
      prerequisites: ['lesson-00-01'],
      keyTerms: [
        { term: 'Process', definition: 'An executing instance of a computer program allocated memory space, an owner UID, and file descriptors.' },
        { term: 'Least Privilege', definition: 'The architectural rule requiring that every user, process, and system component possesses only the minimum permissions necessary to accomplish its function.' },
        { term: 'Daemon / Service', definition: 'A background process that runs continuously to handle system requests, such as an HTTP server or SSH listener.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Operating System Privilege Model',
          content: `In POSIX systems (Linux, macOS, BSD), every interaction is mediated by identity and permissions.

### Linux Permission Bits
Every file and directory has three permission scopes:
- **User (u):** The user who owns the resource.
- **Group (g):** Members of the group assigned to the resource.
- **Others (o):** Every other identity on the system.

Each scope evaluates three bits:
- **Read (r = 4):** View file contents or list directory entries.
- **Write (w = 2):** Modify file contents or create/delete files in a directory.
- **Execute (x = 1):** Execute a binary/script or traverse into a directory.

*Example:* \`-rw-r----- 1 admin web-team 4096 /etc/app.conf\`
- Owner (\`admin\`): Read & Write (6)
- Group (\`web-team\`): Read-only (4)
- Others: No access (0) -> \`chmod 640\``
        }
      ],
      summaryTakeaways: [
        'Processes inherit the permissions of the executing user.',
        'File permissions govern read, write, and directory traversal rights.',
        'Never run network-facing application servers as the root user.'
      ],
      references: [
        { title: 'The Linux Documentation Project: Linux Filesystem Hierarchy', publisher: 'TLDP', url: 'https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-01-02',
      moduleId: 'mod-01',
      slug: 'ip-addresses-ports-dns-routing-protocols',
      title: '1.2 IP Addresses, Ports, DNS, Routing, and Common Protocols',
      orderIndex: 2,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Network packets are the lifeblood of distributed systems. Understanding address routing, DNS lookups, and TCP/UDP communication is required to analyze firewall alerts, packet captures, and attack paths.',
      objectives: [
        'Distinguish between IPv4, IPv6, CIDR notation, and private subnet ranges (RFC 1918).',
        'Compare TCP connection state transitions (SYN, SYN-ACK, ACK, FIN, RST) with UDP datagrams.',
        'Trace the lifecycle of a Domain Name System (DNS) query from client cache to authoritative nameserver.'
      ],
      prerequisites: ['lesson-01-01'],
      keyTerms: [
        { term: 'RFC 1918 Private Address', definition: 'IP address blocks reserved for non-public internal networks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).' },
        { term: 'TCP 3-Way Handshake', definition: 'The sequence of SYN, SYN-ACK, and ACK packets used by Transmission Control Protocol to establish a reliable, stateful stream.' },
        { term: 'DNS (Domain Name System)', definition: 'The hierarchical distributed naming system that translates human-readable hostnames (example.com) into numerical IP addresses.' }
      ],
      sections: [
        {
          type: 'diagram',
          title: 'TCP Handshake and Network Traversal',
          diagramAscii: `
  CLIENT (192.168.1.100:54210)                 SERVER (198.51.100.20:443)
       |                                                 |
       |  1. SYN [Seq=0] (Initiate Connection)          |
       |------------------------------------------------>|
       |                                                 |
       |  2. SYN-ACK [Seq=0, Ack=1] (Acknowledge & Sync) |
       |<------------------------------------------------|
       |                                                 |
       |  3. ACK [Seq=1, Ack=1] (Connection Established)|
       |------------------------------------------------>|
       |                                                 |
       |========== ENCRYPTED TLS SESSION BEGINS ========|`,
          diagramAltText: 'ASCII diagram showing TCP three-way handshake: Client sends SYN, Server replies with SYN-ACK, Client completes with ACK.'
        }
      ],
      summaryTakeaways: [
        'Ports allow a single IP address to route traffic to thousands of distinct services.',
        'TCP guarantees order and delivery; UDP provides lightweight, connectionless transmission.',
        'DNS resolution precedes almost all modern network connections.'
      ],
      references: [
        { title: 'RFC 793: Transmission Control Protocol Specification', publisher: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc793', lastReviewed: '2026-01-05' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-01-03',
      moduleId: 'mod-01',
      slug: 'http-requests-tls-browser-devtools',
      title: '1.3 HTTP Request/Response Concepts, TLS, and Developer Tools',
      orderIndex: 3,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'The web is the primary attack and defense surface for software engineering. Comprehending raw HTTP message syntax and TLS encryption enables you to inspect security headers, cookies, and API payloads.',
      objectives: [
        'Read and construct raw HTTP/1.1 request and response headers.',
        'Explain how TLS ensures confidentiality, integrity, and server authentication.',
        'Use Browser Developer Tools (Network and Application tabs) to audit cookies, headers, and payloads.'
      ],
      prerequisites: ['lesson-01-02'],
      keyTerms: [
        { term: 'HTTP Header', definition: 'Key-value metadata sent before the message body conveying client capabilities, authentication tokens, caching rules, and security policies.' },
        { term: 'TLS (Transport Layer Security)', definition: 'A cryptographic protocol operating above TCP that provides end-to-end encryption and server certificate validation.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Anatomy of an HTTP Transaction',
          content: `Every web interaction is a plaintext exchange of messages (unless encrypted by TLS).

\`\`\`http
POST /api/v1/auth/login HTTP/1.1
Host: api.example.internal
User-Agent: Mozilla/5.0
Content-Type: application/json
Content-Length: 48

{"username": "analyst", "password": "SecurePassword1!"}
\`\`\`

Server Response:
\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session_id=abc123xyz; Secure; HttpOnly; SameSite=Strict
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"status": "authenticated", "role": "security_operator"}
\`\`\``
        }
      ],
      summaryTakeaways: [
        'HTTP is stateless; cookies and authorization headers manage session continuity.',
        'Security headers (HSTS, CSP, SameSite) guide browser defense behavior.',
        'TLS secures the pipe; application logic must secure the data inside.'
      ],
      references: [
        { title: 'MDN Web Docs: An Overview of HTTP', publisher: 'Mozilla Developer Network', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-01-04',
      moduleId: 'mod-01',
      slug: 'shell-navigation-text-processing-practice',
      title: '1.4 Shell Navigation & Text Processing in a Local Environment',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 20, total: 32 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Security analysts triage millions of log lines. Mastering command-line text pipelines (\`grep\`, \`awk\`, \`sed\`, \`sort\`, \`cut\`) allows rapid log aggregation and anomaly detection without heavy GUI tools.',
      objectives: [
        'Compose multi-stage Unix command pipelines using pipes (\`|\`) and redirection (\`>\`, \`>>\`).',
        'Extract specific fields from delimited log records using \`cut\` and \`awk\`.',
        'Sort, count, and isolate top anomalous IP addresses from synthetic access logs.'
      ],
      prerequisites: ['lesson-01-03'],
      keyTerms: [
        { term: 'Unix Pipeline', definition: 'A mechanism where the standard output (stdout) of one program is redirected as standard input (stdin) to the next.' },
        { term: 'awk', definition: 'A pattern scanning and processing language standard on POSIX systems, widely used for column extraction in log parsing.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Synthetic Log Analysis: Identifying Anomalous HTTP 404 Probes',
            datasetName: 'Synthetic-Web-Access-v1',
            scenario: 'You are analyzing 5 synthetic web server requests to detect path scanning.',
            syntheticData: `198.51.100.42 - - [14/Oct/2026:10:14:01 +0000] "GET /index.html HTTP/1.1" 200 4521
198.51.100.89 - - [14/Oct/2026:10:14:02 +0000] "GET /.env HTTP/1.1" 404 162
198.51.100.89 - - [14/Oct/2026:10:14:03 +0000] "GET /config.json HTTP/1.1" 404 162
198.51.100.89 - - [14/Oct/2026:10:14:04 +0000] "GET /wp-login.php HTTP/1.1" 404 162
203.0.113.15 - - [14/Oct/2026:10:14:05 +0000] "GET /styles.css HTTP/1.1" 200 1204`,
            analysisWalkthrough: [
              'Running: `grep " 404 " access.log | awk \'{print $1}\' | sort | uniq -c`',
              'Output: `3 198.51.100.89`',
              'Interpretation: IP `198.51.100.89` generated 3 consecutive 404 errors probing for sensitive files (`/.env`, `/config.json`, `/wp-login.php`).',
              'Conclusion: This behavior matches automated reconnaissance scanning.'
            ],
            keyInsight: 'Simple command-line pipelines can reduce thousands of noisy log records to actionable security indicators in seconds.'
          }
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-01-log-workbench',
            title: 'Contained Lab: Synthetic Web Log Investigation Workbench',
            environmentName: 'Offline Log Analysis Sandbox',
            scopeNotice: 'ATTENTION: You are inspecting a static, synthetic web server log. No live network connections are made.',
            allowedActions: ['Filter by status code', 'Aggregate top client IPs', 'Search sensitive paths'],
            prohibitedActions: ['Connecting to logged IPs', 'Running arbitrary shell commands outside sandbox'],
            stopConditions: ['None - offline synthetic data'],
            initialState: { logsLoaded: true, anomaliesIdentified: 0 },
            instructions: [
              'Filter the synthetic dataset for HTTP status codes equal to 401 or 403.',
              'Count the occurrences of client IP 198.51.100.89 requesting administrative endpoints.',
              'Submit the candidate scanner IP to complete the lab verification.'
            ],
            expectedResult: 'Candidate scanner IP 198.51.100.89 identified with 3 unauthorized probe attempts.',
            labType: 'log_analysis'
          }
        }
      ],
      summaryTakeaways: [
        'Shell pipelines are the universal baseline tool for security operations.',
        'Combining `grep`, `awk`, and `uniq -c` reveals volumetric and pattern anomalies.',
        'Analyzing status codes immediately isolates unauthorized discovery attempts.'
      ],
      references: [
        { title: 'The Open Group Base Specifications: Shell Command Language', publisher: 'The Open Group', url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-01',
    title: 'Module 1 Assessment: Computing, Networking, and Shell Concepts',
    passingScore: 75,
    questions: [
      {
        id: 'q1-1',
        question: 'Which sequence correctly represents the flags exchanged during a standard TCP connection handshake?',
        choices: [
          'Client ACK -> Server SYN -> Client FIN',
          'Client SYN -> Server SYN-ACK -> Client ACK',
          'Client SYN -> Server ACK -> Client RST',
          'Server SYN -> Client ACK -> Server SYN-ACK'
        ],
        correctIndex: 1,
        explanation: 'TCP establishes reliable connections using SYN from client, SYN-ACK from server, and ACK from client.'
      },
      {
        id: 'q1-2',
        question: 'What do the octal permission bits 750 represent on a Linux file?',
        choices: [
          'Owner: Read/Write/Execute (7), Group: Read/Execute (5), Others: None (0)',
          'Owner: Read/Write (6), Group: Write/Execute (3), Others: Read (4)',
          'Owner: Execute only, Group: All access, Others: Read/Write',
          'Full public access for all users'
        ],
        correctIndex: 0,
        explanation: '7 = 4+2+1 (rwx), 5 = 4+1 (r-x), 0 = no permissions (---).'
      },
      {
        id: 'q1-3',
        question: 'What is the security purpose of the `HttpOnly` flag on a session cookie in an HTTP response?',
        choices: [
          'It forces the cookie to be transmitted only across HTTPS connections.',
          'It prevents client-side JavaScript from accessing the cookie via `document.cookie`, mitigating credential theft via Cross-Site Scripting (XSS).',
          'It automatically encrypts the database storing the session.',
          'It expires the user session after 15 minutes of inactivity.'
        ],
        correctIndex: 1,
        explanation: '`HttpOnly` tells the browser that the cookie must not be accessible via client-side scripts, protecting session tokens from XSS-based theft.'
      },
      {
        id: 'q1-4',
        question: 'In an Apache or Nginx access log, what does an HTTP 404 status code indicate when observed in high volume from a single IP address requesting common administrative paths?',
        choices: [
          'The web server has crashed.',
          'The client is successfully downloading administrative backups.',
          'Automated reconnaissance searching for unlinked files, backups, or vulnerable panels.',
          'A distributed denial of service attack on DNS resolvers.'
        ],
        correctIndex: 2,
        explanation: 'Bursts of 404s targeting paths like `/.env`, `/wp-login.php`, or `/admin` indicate automated brute-force path discovery or vulnerability scanning.'
      }
    ]
  }
};
