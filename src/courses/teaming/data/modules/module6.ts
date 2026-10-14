import { ModuleData } from '../../types/course.types';

export const MODULE_6: ModuleData = {
  id: 'mod-06',
  courseId: 'practical-cybersecurity-teaming',
  slug: 'red-team-reporting-professional-practice',
  title: 'Module 6 — Red Team Reporting and Professional Practice',
  track: 'red',
  summary: 'Translate raw technical observations into clear, defensible executive summaries and engineering reports, avoid risk inflation, conduct constructive client debriefs, and verify fixes.',
  orderIndex: 6,
  required: true,
  objectives: [
    'Structure comprehensive assessment reports for both C-suite executives and software engineers.',
    'Defend risk ratings objectively using environmental context without hyperbole.',
    'Facilitate constructive finding debriefs that foster collaboration rather than adversarial antagonism.',
    'Execute formal retesting workflows to verify developer remediations.'
  ],
  onePageCheatSheet: `### Module 6 Cheat Sheet: Professional Reporting & Debriefs
- **Audience Separation:**
  - Executive Summary: Business impact, overall security posture, strategic themes, top 3 priorities. No jargon.
  - Technical Findings: Exact URLs, payloads, reproduction steps, evidence hashes, root-cause fixes.
- **Tone:** Professional, objective, and constructive. Never mock developers or exaggerate theoretical risk.
- **Retest Verification:** Always retest the exact original reproduction steps plus adjacent boundary conditions to ensure the fix is thorough, not just a surface-level filter.`,
  lessons: [
    {
      id: 'lesson-06-01',
      moduleId: 'mod-06',
      slug: 'finding-quality-title-severity-evidence-reproduction',
      title: '6.1 Finding Quality: Title, Severity Rationale, Evidence, Impact & Fix',
      orderIndex: 1,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'A brilliant exploit is useless if the engineering team cannot reproduce the issue or understand how to fix it. High-quality documentation accelerates remediation and builds engineering trust.',
      objectives: [
        'Apply the standard 6-part finding structure to any confirmed security weakness.',
        'Write crisp, unambiguous titles that specify vulnerability class and affected component.',
        'Provide step-by-step reproduction instructions that work on the first attempt.'
      ],
      prerequisites: ['lesson-05-05'],
      keyTerms: [
        { term: 'Reproduction Steps (Repro Steps)', definition: 'A clear, numbered sequence of actions allowing an engineer to reliably duplicate the vulnerability and observe the same outcome.' },
        { term: 'Root Cause Remediation', definition: 'A fix that addresses the underlying architectural or logical defect (e.g., parameterized queries) rather than merely blocking specific test payloads.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'The Six Core Components of a Production Finding',
          content: `Every finding in a professional assessment report must contain:
1. **Title:** \`[Vulnerability Type] in [Component/Endpoint]\` (e.g., *Cross-Site Scripting (Reflected) in User Search Query Parameter*).
2. **Severity & CVSS:** Calculated CVSS 3.1 score with explicit vector string.
3. **Affected Asset:** Exact URL, host IP, version number, and code file if known.
4. **Technical Description & Evidence:** Plain-language explanation accompanied by timestamped HTTP logs or terminal captures.
5. **Business Impact:** Realistic explanation of what an attacker gains (data theft, account takeover, lateral movement).
6. **Remediation Guidance:** Specific code or configuration recommendations, referencing authoritative vendor documentation.`
        }
      ],
      summaryTakeaways: [
        'Developers should be able to reproduce the bug in 5 minutes using your steps.',
        'Avoid vague titles like "Security Bug in Website".',
        'Always provide a concrete code fix alongside the problem description.'
      ],
      references: [
        { title: 'Offensive Security: Pentest Report Writing Best Practices', publisher: 'OffSec', url: 'https://www.offsec.com/blog/penetration-testing-report-writing/', lastReviewed: '2026-01-20' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-06-02',
      moduleId: 'mod-06',
      slug: 'risk-ratings-uncertainty-avoiding-exaggeration',
      title: '6.2 Risk Ratings, Uncertainty & Avoiding Exaggerated Claims',
      orderIndex: 2,
      estimatedMinutes: { reading: 12, practice: 15, total: 27 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Inflating minor flaws into "Critical" emergencies destroys your credibility with engineering teams. Calibrated risk scoring reflects real operational context and builds long-term authority.',
      objectives: [
        'Distinguish between Base, Temporal, and Environmental CVSS metrics.',
        'Identify risk inflation and "Chicken Little" reporting fallacies.',
        'Document uncertainties and constraints transparently.'
      ],
      prerequisites: ['lesson-06-01'],
      keyTerms: [
        { term: 'Risk Inflation', definition: 'The unprofessional practice of artificially escalating vulnerability severities (e.g., labeling a missing HTTP header as "High") to appear more impactful.' },
        { term: 'Environmental Metric (CVSS)', definition: 'A CVSS modifier that adjusts the base severity score based on the target organization\'s specific mitigating controls and asset value.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Calibrating Risk with Context',
          content: `A missing \`X-Frame-Options\` header is an informational or low-severity observation; labeling it "Critical Remote Code Execution" is a severe professional breach.

### Integrity in Severity Assignment:
- **Critical (9.0–10.0):** Direct, unauthenticated remote code execution, mass database exfiltration, or complete domain compromise.
- **High (7.0–8.9):** Authentication bypass, direct access to sensitive financial/PII data, or elevation to administrator.
- **Medium (4.0–6.9):** Cross-site scripting requiring user interaction, CSRF on non-critical endpoints, information disclosure of internal IPs.
- **Low (0.1–3.9):** Verbose error messages, missing non-critical security headers, minor information leaks.`
        }
      ],
      summaryTakeaways: [
        'Calibrate ratings with environmental reality and mitigating controls.',
        'Inflating severities leads to alert fatigue and dismissive developers.',
        'Be transparent about what was verified versus what was theoretically possible.'
      ],
      references: [
        { title: 'NIST NVD: CVSS v3.1 Calculator Guide', publisher: 'NVD', url: 'https://nvd.nist.gov/vuln-metrics/cvss', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-06-03',
      moduleId: 'mod-06',
      slug: 'debrief-retest-remediation-verification',
      title: '6.3 Debrief, Retest, and Remediation Verification',
      orderIndex: 3,
      estimatedMinutes: { reading: 14, practice: 15, total: 29 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Finding bugs is only half the job; helping organizations remediate them is the real objective. Conducting respectful debriefs and rigorous retesting ensures fixes are resilient.',
      objectives: [
        'Lead an empathetic finding debrief meeting with software engineers.',
        'Execute formal retesting protocols against patched environments.',
        'Identify incomplete remediations (patch bypasses).'
      ],
      prerequisites: ['lesson-06-02'],
      keyTerms: [
        { term: 'Retest Verification', definition: 'Re-evaluating a previously reported vulnerability after developer notification of a patch to verify that the flaw is fully resolved and cannot be bypassed.' },
        { term: 'Debrief Meeting', definition: 'A collaborative post-assessment session where offensive testers present findings to technical and business stakeholders, answer questions, and discuss fixes.' }
      ],
      sections: [
        {
          type: 'explanation',
          title: 'Conducting a Collaborative Debrief',
          content: `In the debrief meeting:
- **Acknowledge Good Engineering:** Highlight positive defensive controls that worked and made attacks difficult.
- **Focus on the Systems, Not the Person:** Say *"The endpoint lacks tenancy validation"* rather than *"The developer forgot to check permissions."*
- **Verify Fixes Rigorously:** When retesting, don't just rerun the exact original payload. Test variations (case sensitivity, URL encoding, boundary conditions) to ensure the developer implemented root-cause validation rather than a superficial regex filter.`
        }
      ],
      summaryTakeaways: [
        'Security testing is a partnership to protect the organization, not a competition.',
        'Retesting must probe for patch bypasses, not just repeat the original payload.',
        'Celebrate defensive victories and hardened controls.'
      ],
      references: [
        { title: 'OWASP Guide to Vulnerability Remediation Management', publisher: 'OWASP', url: 'https://owasp.org/', lastReviewed: '2026-01-15' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    },
    {
      id: 'lesson-06-04',
      moduleId: 'mod-06',
      slug: 'responsible-disclosure-data-minimization',
      title: '6.4 Responsible Disclosure and Practice Report Improvement',
      orderIndex: 4,
      estimatedMinutes: { reading: 12, practice: 20, total: 32 },
      level: 'intermediate',
      required: true,
      whyThisMatters: 'Reviewing and improving weak reports develops critical editorial skills, ensuring that every finding delivered to clients meets the highest standards of evidence and professional ethics.',
      objectives: [
        'Identify missing evidence, vague reproduction steps, and exaggerated claims in flawed reports.',
        'Rewrite a poorly constructed vulnerability report into a production-grade finding.',
        'Summarize data sanitization and retention obligations post-engagement.'
      ],
      prerequisites: ['lesson-06-03'],
      keyTerms: [
        { term: 'Report Quality Assurance (QA)', definition: 'The internal peer-review process where another senior practitioner reviews report findings for clarity, accuracy, and evidence completeness prior to delivery.' }
      ],
      sections: [
        {
          type: 'lab',
          labData: {
            id: 'lab-06-report-qa',
            title: 'Contained Lab: Flawed Report Triage & Professional Refactoring',
            environmentName: 'Report Quality Assurance Sandbox',
            scopeNotice: 'ATTENTION: Contained editorial lab. Review a flawed sample penetration testing report and rewrite the deficient sections.',
            allowedActions: ['Identify report deficiencies', 'Refactor finding title', 'Add missing evidence criteria'],
            prohibitedActions: ['None - offline reporting workbench'],
            stopConditions: ['None'],
            initialState: { reportFixed: false },
            instructions: [
              'Review the sample report titled "Critical Flaw in Website".',
              'Identify 3 deficiencies: Vague title, missing reproduction steps, and unevidenced "Critical" claim.',
              'Submit the improved finding with specific CVSS score and parameterized query remediation.'
            ],
            expectedResult: 'Flawed report refactored into a clear, evidenced, and constructively remediated finding.',
            labType: 'report_review'
          }
        }
      ],
      summaryTakeaways: [
        'A report represents your professional reputation.',
        'Peer review (QA) catches omissions before the client reads the document.',
        'Purge client data and evidence copies securely following agreed retention schedules.'
      ],
      references: [
        { title: 'PTES: Penetration Testing Execution Standard - Reporting Phase', publisher: 'PTES Group', url: 'http://www.pentest-standard.org/index.php/Reporting', lastReviewed: '2026-02-01' }
      ],
      publishedAt: '2026-03-01',
      version: '1.0'
    }
  ],
  moduleQuiz: {
    id: 'quiz-mod-06',
    title: 'Module 6 Assessment: Red Team Reporting & Ethics',
    passingScore: 75,
    questions: [
      {
        id: 'q6-1',
        question: 'Which of the following finding titles adheres best to professional security reporting standards?',
        choices: [
          'HACKED! Website has massive security hole in search bar',
          'Cross-Site Scripting (Reflected) in User Search Endpoint (/api/v1/search?q=)',
          'High Risk Vulnerability found by analyst on Tuesday',
          'Developers need to learn how to write secure JavaScript'
        ],
        correctIndex: 1,
        explanation: 'Professional titles explicitly state the vulnerability classification and the specific affected endpoint without emotional hyperbole or personal accusations.'
      },
      {
        id: 'q6-2',
        question: 'What is the danger of "Risk Inflation" (e.g., classifying a missing HTTP security header as "Critical") in a formal assessment report?',
        choices: [
          'It forces the client to purchase more expensive software.',
          'It damages the security team’s credibility, distracts developers from fixing genuinely catastrophic flaws, and causes alert fatigue.',
          'It makes the report too long to print.',
          'There is no danger; higher severity ratings always ensure faster developer fixes.'
        ],
        correctIndex: 1,
        explanation: 'Overstating minor issues erodes engineering trust, creates unnecessary executive alarm, and diverts urgent focus away from true high-impact exposures.'
      },
      {
        id: 'q6-3',
        question: 'When retesting a previously reported SQL injection vulnerability after an engineering team announces a patch, what should the security analyst do?',
        choices: [
          'Simply ask the developer if they tested it, and mark it resolved.',
          'Re-execute the exact original proof-of-concept payload, AND test logical variations (encoding, alternative SQL keywords, boundary conditions) to ensure root-cause resolution rather than a superficial filter.',
          'Immediately issue a bill for the retest without running any tests.',
          'Change the finding to Informational.'
        ],
        correctIndex: 1,
        explanation: 'Thorough retesting verifies both the original payload and adjacent variations to confirm that true parameterization was implemented rather than an easily bypassed string filter.'
      },
      {
        id: 'q6-4',
        question: 'What is the primary objective of an assessment Debrief Meeting with client engineering leadership?',
        choices: [
          'To embarrass the developers in front of their managers.',
          'To walk through findings collaboratively, clarify technical reproduction steps, answer architectural questions, and ensure an achievable remediation path.',
          'To demand bonuses for finding critical vulnerabilities.',
          'To sell additional proprietary security hardware.'
        ],
        correctIndex: 1,
        explanation: 'The debrief is a collaborative technical session aimed at providing engineering clarity and ensuring teams understand how to remediate root causes.'
      }
    ]
  }
};
