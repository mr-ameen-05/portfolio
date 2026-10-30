import { CourseMetadata } from '../types/course.types';

export const COURSE_METADATA: CourseMetadata = {
  id: 'practical-cybersecurity-teaming',
  slug: 'teaming',
  title: 'Practical Cybersecurity: Red Teaming, Blue Teaming, and Purple Teaming',
  summary: 'Learn how to reason about security from both attacker and defender perspectives, practice in strictly authorized sandboxes, and collaborate across red and blue roles.',
  description: 'A comprehensive, self-paced, browser-based course designed to take learners from foundational computing and security concepts through offensive methodology, security operations telemetry, incident response triage, and collaborative purple team validation using synthetic datasets and isolated labs.',
  version: '2.4.0',
  status: 'published',
  audience: 'Beginners progressing toward intermediate cybersecurity practice; software developers, system administrators, and security analysts seeking practical dual-perspective methodology.',
  prerequisites: [
    'Basic computer operation (navigating folders, web browsers, command prompts)',
    'Curiosity about systems, networks, and adversarial thinking',
    'Commitment to ethical conduct, safe practice, and strict adherence to rules of engagement (no prior cybersecurity experience required)'
  ],
  estimatedWeeks: '10–12 weeks',
  estimatedHoursPerWeek: '4–6 hours/week',
  totalEstimatedMinutes: 1840,
  outcomes: [
    'Explain core networking, operating-system, web, identity, and security concepts.',
    'Scope an authorized security assessment and strictly adhere to rules of engagement and stop conditions.',
    'Recognize common weaknesses and misconfigurations in deliberately vulnerable, isolated practice targets.',
    'Describe detection, triage, containment, recovery, and digital evidence-handling workflows.',
    'Map observed behaviors to the MITRE ATT&CK framework as a structured communication aid without treating mappings as proof.',
    'Write concise, reproducible security findings with defensible impact, evidence, and practical remediations.',
    'Collaborate across red and blue team roles to design, test, and tune defensive controls and telemetry coverage.'
  ],
  author: {
    name: 'Al Ameen N R',
    role: 'Cybersecurity Analyst & Systems Builder',
    credentials: 'Linux & Container Security Specialist · Blue Team Operations · Full-Stack Builder'
  },
  safetyStatement: 'CRITICAL ETHICAL COMMITMENT: This course teaches security concepts strictly for defensive understanding, authorized evaluation, and systems hardening. All practice exercises utilize synthetic data, isolated course-provided sandboxes, and offline scenarios. Attacking public systems, unauthorized networks, or third-party devices is strictly illegal and violates the core ethics of cybersecurity engineering.',
  publishedAt: '2026-03-01',
  lastUpdated: '2026-10-14'
};
