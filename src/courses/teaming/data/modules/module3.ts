import { ModuleData } from '../../types/course.types';

export const MODULE_3: ModuleData = {
  id: 'mod-03',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'web-identity-application-security',
  title: 'Module 3 — Web, Identity, and Application Security Basics',
  track: 'core',
  summary: 'Understand modern multi-tier web architectures, secure input/output boundaries, password hashing algorithms, authentication mechanisms, and software supply chain secrets hygiene.',
  orderIndex: 3,
  required: true,
  objectives: [
    'Trace data flow through client browsers, web gateways, backend API services, and relational/NoSQL datastores.',
    'Apply input validation, parameterized queries, and contextual output encoding to neutralize injection and cross-site scripting flaws.',
    'Evaluate cryptographic password hashing functions (Argon2id, bcrypt) versus obsolete algorithms (MD5, SHA1).',
    'Review code snippets to identify hardcoded secrets, insecure direct object references, and vulnerable dependencies.'
  ],
  onePageCheatSheet: `### Module 3 Cheat Sheet: Application Security Best Practices
- **Password Hashing:** Always use slow, salted cryptographic functions: **Argon2id** (modern gold standard) or **bcrypt** (work factor >= 12). Never use fast general hashes (MD5, SHA-256).
- **SQL Injection Defense:** Use **Parameterized Queries / Prepared Statements** exclusively. Never concatenate strings into SQL queries.
- **XSS Defense:** Apply **context-aware output encoding** (HTML entity encoding, attribute encoding) and modern framework auto-escaping (React JSX). Deploy Content Security Policy (CSP).
- **Secrets Management:** Never commit API keys, database passwords, or JWT signing secrets into source control. Inject via environment variables or secret vaults at runtime.`,
  lessons: [
    {
      id: 'lesson-03-01',
      moduleId: 'mod-03',
      slug: 'browsers-servers-apis-databases',
      title: '3.1 How Browsers, Servers, APIs, and Databases Fit Together',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Web applications are distributed systems. Flaws rarely exist in isolation; they manifest when one tier makes unsafe assumptions about the data formatting or authorization validation done by another tier.',
      objectives: [
        'Diagram multi-tier web architectures including Reverse Proxies, API Gateways, App Servers, and Databases.',
        'Identify common single points of failure and trust boundaries between tiers.',
        'Explain CORS (Cross-Origin Resource Sharing) and Same-Origin Policy (SOP).'
      ],
      prerequisites: ['lesson-01-03', 'lesson-02-01'],
      keyTerms: [
        { term: 'Same-Origin Policy (SOP)', definition: 'A critical browser security mechanism that restricts how a document or script loaded by one origin can interact with a resource from another origin.' },
        { term: 'Reverse Proxy', definition: 'An intermediate server deployed in front of web servers to handle TLS termination, load balancing, compression, and request routing.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Multi-Tier Web Architecture',
          content: `In a modern application (such as this portfolio):
1. **Client Tier (Browser):** Renders UI via HTML, CSS, JavaScript (React). The client is **completely under user control**; client-side checks provide user convenience, not security.
2. **Gateway Tier (Reverse Proxy / Web Server):** Nginx, Apache, or PHP built-in server terminates TLS, enforces rate limits, and routes requests.
3. **Application Tier (Backend API):** Executes business logic, enforces role authorization, and validates schema constraints.
4. **Data Tier (Databases / Cache):** Stores persistent state. Must communicate with the app tier over secure, internal network channels.`
        }
      ],
      summaryTakeaways: [
        'Client-side code can always be inspected, modified, or bypassed by a user.',
        'Every backend API endpoint must authenticate and authorize requests independently.',
        'Databases should never be exposed directly to the public internet.'
      ],
      references: [
        { title: 'Mozilla Developer Network: Same-origin policy', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-03-02',
      moduleId: 'mod-03',
      slug: 'input-handling-output-encoding-secure-defaults',
      title: '3.2 Input Handling, Output Encoding & Secure Defaults',
      orderIndex: 2,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Injection flaws (SQLi, Command Injection, XSS) occur when untrusted data is inadvertently interpreted as executable code or commands by an interpreter. Strict separation of code and data prevents these vulnerabilities.',
      objectives: [
        'Distinguish allowlist input validation from blocklist filtering.',
        'Explain how parameterized queries separate SQL code from user-supplied data.',
        'Apply contextual output encoding to neutralize Cross-Site Scripting (XSS).'
      ],
      prerequisites: ['lesson-03-01'],
      keyTerms: [
        { term: 'Parameterized Query (Prepared Statement)', definition: 'A database programming technique where the database engine compiles the SQL query structure before inserting parameters, rendering SQL injection impossible.' },
        { term: 'Cross-Site Scripting (XSS)', definition: 'A vulnerability enabling an attacker to inject malicious client-side scripts into web pages viewed by other users.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Code vs. Data: The Core Antidote to Injection',
          content: `### Vulnerable SQL Pattern (String Concatenation):
\`\`\`php
// DANGEROUS: User input is concatenated directly into SQL command
$query = "SELECT * FROM users WHERE email = '" . $userInput . "'";
\`\`\`
If \`$userInput\` is \`admin@example.com' OR '1'='1\`, the database parses the input as SQL syntax.

### Secure SQL Pattern (Prepared Statement):
\`\`\`php
// SECURE: SQL statement is pre-compiled; parameters are treated purely as literal data
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $userInput]);
$user = $stmt->fetch();
\`\`\`
Even if the parameter contains single quotes or SQL keywords, the database engine treats it exclusively as string data, never executable syntax.`
        }
      ],
      summaryTakeaways: [
        'Use parameterized queries for all database queries without exception.',
        'Validate inputs against strict allowlists (types, lengths, character sets).',
        'Encode outputs according to destination context (HTML body, attributes, JSON).'
      ],
      references: [
        { title: 'OWASP SQL Injection Prevention Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-03-03',
      moduleId: 'mod-03',
      slug: 'password-storage-mfa-session-safety',
      title: '3.3 Password Storage, MFA, Session Safety & Recovery',
      orderIndex: 3,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Breached password hashes can be cracked in minutes if outdated algorithms are used. Understanding adaptive, salted hash functions and modern session tokens protects user identities even if databases leak.',
      objectives: [
        'Explain why cryptographic salts and slow adaptive hashing functions (Argon2id, bcrypt) resist GPU cracking.',
        'Describe multi-factor authentication (MFA) mechanisms: TOTP, WebAuthn/FIDO2, and SMS vulnerabilities.',
        'Configure secure session tokens with appropriate cookie attributes (Secure, HttpOnly, SameSite).'
      ],
      prerequisites: ['lesson-03-02'],
      keyTerms: [
        { term: 'Cryptographic Salt', definition: 'A unique, cryptographically random string appended to a password before hashing to ensure identical passwords produce distinct hash values and defeat precomputed rainbow tables.' },
        { term: 'Argon2id', definition: 'The winner of the Password Hashing Competition, optimized to resist both GPU and custom ASIC hardware cracking attacks.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Modern Cryptographic Password Storage',
          content: `General-purpose hashing algorithms like SHA-256 or MD5 are designed for high speed (verifying file integrity). Modern GPUs can compute **billions of SHA-256 hashes per second**, making brute-force cracking trivial.

### Password Hashing Standards
Password hashing functions must be **intentionally computationally expensive** and memory-hard:
1. **Argon2id:** Gold standard recommended by OWASP; combines memory-hardness (defeating ASICs) and time-hardness.
2. **bcrypt:** Battle-tested standard; uses configurable work factors (recommended work factor $\\ge 12$).
3. **PBKDF2:** Legacy standard; acceptable when mandated by FIPS compliance with high iteration counts ($>600,000$).`
        }
      ],
      summaryTakeaways: [
        'Never store plaintext passwords or use fast hashes (MD5, SHA-1, bare SHA-256).',
        'Use unique per-user salts and adaptive functions (Argon2id or bcrypt).',
        'MFA adds essential resilience against credential stuffing and credential theft.'
      ],
      references: [
        { title: 'OWASP Password Storage Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', lastReviewed: '2026-01-25' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-03-04',
      moduleId: 'mod-03',
      slug: 'common-weakness-categories-owasp-top10',
      title: '3.4 Common Weakness Categories & Prevention Overview',
      orderIndex: 4,
      estimatedMinutes: { reading: 15, practice: 20, total: 35 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Familiarity with the OWASP Top 10 weakness taxonomy provides a common language for identifying, classifying, and mitigating security defects across modern web applications.',
      objectives: [
        'Summarize the core categories of the OWASP Top 10 (Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration).',
        'Identify root causes and defensive patterns for each category.',
        'Use CWE (Common Weakness Enumeration) identifiers to research vulnerability root causes.'
      ],
      prerequisites: ['lesson-03-03'],
      keyTerms: [
        { term: 'OWASP Top 10', definition: 'A regularly updated standard awareness document for developers and web application security, representing the broad consensus on the most critical security risks.' },
        { term: 'CWE (Common Weakness Enumeration)', definition: 'A community-developed formal list of software and hardware weakness types maintained by MITRE.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Survey of Major Vulnerability Classes',
          content: `1. **Broken Access Control (OWASP #1):** Users acting outside intended permissions (viewing other users' accounts, administrative actions without role checks).
2. **Cryptographic Failures (OWASP #2):** Transmitting data in plaintext (HTTP), outdated ciphers, weak hashing algorithms, hardcoded keys.
3. **Injection (OWASP #3):** SQL, NoSQL, OS Command, and LDAP injection caused by mixing untrusted input into interpreter syntax.
4. **Security Misconfiguration (OWASP #5):** Default credentials, verbose debug error pages showing stack traces, open cloud storage buckets, unnecessary enabled features.`
        }
      ],
      summaryTakeaways: [
        'Broken access control has overtaken injection as the #1 web security vulnerability.',
        'Security misconfigurations often stem from default installation settings and debug modes.',
        'Standard taxonomies (OWASP, CWE) align development and security teams.'
      ],
      references: [
        { title: 'OWASP Top 10 Web Application Security Risks (2021/2025 Edition)', publisher: 'OWASP Foundation', url: 'https://owasp.org/www-project-top-ten/', lastReviewed: '2026-01-10' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-03-05',
      moduleId: 'mod-03',
      slug: 'dependencies-configuration-secrets-management',
      title: '3.5 Dependency, Configuration & Secrets Management Fundamentals',
      orderIndex: 5,
      estimatedMinutes: { reading: 12, practice: 20, total: 32 },
      level: 'beginner',
      required: true,
      whyThisMatters: 'Over 80% of modern application code comes from open-source third-party dependencies. Vulnerabilities in dependencies (like Log4Shell) or leaked cloud credentials in git repositories can instantly compromise otherwise secure applications.',
      objectives: [
        'Audit third-party dependencies for known Common Vulnerabilities and Exposures (CVEs) using automated scanning tools.',
        'Implement 12-factor application secrets management using environment variables and secret stores.',
        'Configure Git hooks to prevent accidental credential commits.'
      ],
      prerequisites: ['lesson-03-04'],
      keyTerms: [
        { term: 'Software Supply Chain Security', definition: 'The practices and controls used to verify the integrity, origin, and security of third-party software libraries, build pipelines, and dependencies.' },
        { term: 'Software Bill of Materials (SBOM)', definition: 'A formal inventory listing all components, libraries, and modules included in a software product.' }
      ],
      sections: [
        {
          type: 'example',
          exampleData: {
            title: 'Code Audit: Identifying Insecure Patterns in a Simplified PHP Endpoint',
            datasetName: 'Synthetic-Endpoint-Audit-v1',
            scenario: 'Inspect this simplified contact management endpoint and identify four critical defensive deficiencies.',
            syntheticData: `<?php
// DELIBERATELY FLAWED CODE SNIPPET FOR EDUCATION
$db_pass = "ProductionSecretKey123!"; // FLAW 1: Hardcoded secret

$conn = new mysqli("localhost", "app_user", $db_pass, "crm");

$id = $_GET['user_id']; // FLAW 2: Unsanitized parameter
$query = "SELECT name, email, ssn FROM clients WHERE id = " . $id; // FLAW 3: SQL Concatenation
$result = $conn->query($query);

// FLAW 4: Direct output without HTML encoding (Reflected XSS risk)
echo "<h1>Welcome, " . $_GET['name'] . "!</h1>";
?>`,
            analysisWalkthrough: [
              'Deficiency 1: Database password hardcoded in source code instead of injected via environment variables (`getenv(\'DB_PASS\')`).',
              'Deficiency 2 & 3: `user_id` is concatenated directly into SQL string, allowing SQL injection and unauthorized data exfiltration.',
              'Deficiency 4: `name` parameter echoed directly into HTML response without `htmlspecialchars()`, creating a Cross-Site Scripting (XSS) vulnerability.'
            ],
            keyInsight: 'Security auditing requires examining secrets management, database interaction, and output encoding systematically.'
          }
        },
        {
          type: 'lab',
          labData: {
            id: 'lab-03-code-hardening',
            title: 'Contained Lab: Vulnerable Code Inspection & Defensive Remediation',
            environmentName: 'Code Security Sandbox',
            scopeNotice: 'ATTENTION: Contained synthetic code inspection. You are analyzing static code in an offline sandbox. Do not run arbitrary scripts.',
            allowedActions: ['Identify flaws', 'Select remediations', 'Validate secure refactoring'],
            prohibitedActions: ['Executing unverified code'],
            stopConditions: ['None'],
            initialState: { flawsCorrected: 0 },
            instructions: [
              'Review the flawed PHP contact endpoint code.',
              'Select the appropriate prepared statement replacement for the SQL query.',
              'Replace the hardcoded secret with an environment variable configuration.',
              'Apply contextual HTML encoding to the echoed output.'
            ],
            expectedResult: 'All 3 security flaws refactored into secure prepared statements, environment secrets, and encoded output.',
            labType: 'code_review'
          }
        }
      ],
      summaryTakeaways: [
        'Never commit secrets or credentials into version control.',
        'Maintain an active dependency audit process (`npm audit`, `cargo audit`, Snyk).',
        'Defense in depth requires safe code, safe dependencies, and hardened configurations.'
      ],
      references: [
        { title: 'The Twelve-Factor App: III. Config - Store config in the environment', publisher: '12factor.net', url: 'https://12factor.net/config', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-03',
    title: 'Module 3 Assessment: Application Security & Identity',
    passingScore: 75,
    questions: [
      {
        id: 'q3-1',
        question: 'Which of the following is the most effective defense against SQL Injection in web applications?',
        choices: [
          'Filtering out all single quote characters from user input with a regex blocklist.',
          'Using parameterized queries (prepared statements) for all database operations.',
          'Encoding all database responses into base64 before displaying them.',
          'Storing the database on a separate physical machine.'
        ],
        correctIndex: 1,
        explanation: 'Parameterized queries compile SQL structure separately from data parameters, ensuring user input is never executed as query commands.'
      },
      {
        id: 'q3-2',
        question: 'Why is MD5 or SHA-256 considered unsuitable for storing user passwords in modern databases?',
        choices: [
          'They only support 8-character passwords.',
          'They are general-purpose fast hashes, allowing attackers to calculate billions of guesses per second on modern GPUs.',
          'They are proprietary and require commercial licensing.',
          'They cannot be verified by backend servers.'
        ],
        correctIndex: 1,
        explanation: 'Fast general-purpose hashes enable rapid brute-force cracking on GPUs. Password hashing requires intentionally slow, memory-hard adaptive algorithms like Argon2id or bcrypt.'
      },
      {
        id: 'q3-3',
        question: 'What is the primary risk of committing a `.env` file containing database passwords and third-party API keys to a public GitHub repository?',
        choices: [
          'The repository size will become too large to clone.',
          'Automated scanner bots continuously scrape public commits and will immediately harvest and abuse the credentials.',
          'Git will refuse to push commits with `.env` files by default.',
          'The application will fail to run on local developer machines.'
        ],
        correctIndex: 1,
        explanation: 'Automated adversary bots actively monitor public git repositories for leaked credentials, frequently exploiting exposed keys within seconds of publication.'
      },
      {
        id: 'q3-4',
        question: 'How does contextual output encoding prevent Cross-Site Scripting (XSS)?',
        choices: [
          'It deletes the user account that submitted the data.',
          'It converts potentially dangerous characters (such as `<` and `>`) into safe display representations (`&lt;` and `&gt;`), preventing browser interpretation as executable HTML or script tags.',
          'It encrypts the entire webpage with AES-256.',
          'It blocks all HTTP traffic from mobile devices.'
        ],
        correctIndex: 1,
        explanation: 'Contextual output encoding turns executable characters into harmless literal text representations, ensuring the browser renders text without executing script tags.'
      }
    ]
  }
};
