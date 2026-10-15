/**
 * External, hands-on platforms recommended for learning cybersecurity.
 * Shared by the portfolio "Practice Platforms" section and the course
 * Resource Library so the two never drift apart.
 */
export interface LearningPlatform {
  id: string;
  name: string;
  url: string;
  /** The discipline / mode of learning the platform delivers. */
  focus: string;
  /** Rough difficulty span a learner should expect. */
  level: string;
  /** What the platform is, and how it is used to learn. */
  desc: string;
  /** The single skill it is best suited to train. */
  bestFor: string;
  /** Tailwind classes for the focus badge. */
  badge: string;
}

export const LEARNING_PLATFORMS: LearningPlatform[] = [
  {
    id: 'tryhackme',
    name: 'TryHackMe',
    url: 'https://tryhackme.com',
    focus: 'Guided Learning Paths',
    level: 'Beginner \u2192 Intermediate',
    desc: 'Browser-based rooms with structured, guided learning paths (Pre Security, Jr Penetration Tester, SOC Level 1). Theory is broken into short rooms with hints and walkthroughs.',
    bestFor: 'Building cybersecurity fundamentals step by step, with guidance.',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    url: 'https://www.hackthebox.com',
    focus: 'Machines, Academy & CTF',
    level: 'Intermediate \u2192 Advanced',
    desc: 'Realistic vulnerable machines, challenges, Academy modules, and enterprise Pro Labs. Largely unguided, so it rewards a methodical enumeration and exploitation workflow.',
    bestFor: 'Sharpening offensive skills \u2014 enumeration, exploitation, and privilege escalation.',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 'overthewire',
    name: 'OverTheWire',
    url: 'https://overthewire.org/wargames/',
    focus: 'Linux & CLI Wargames',
    level: 'Beginner \u2192 Intermediate',
    desc: 'Free command-line wargames (Bandit, Natas, Leviathan, and more) delivered over SSH. No account required \u2014 you learn by solving puzzles directly in a real shell.',
    bestFor: 'Mastering Linux, SSH, and text-processing \u2014 the base layer beneath every security tool.',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 'portswigger',
    name: 'PortSwigger Web Security Academy',
    url: 'https://portswigger.net/web-security',
    focus: 'Web Application Security',
    level: 'Beginner \u2192 Advanced',
    desc: 'Free, in-browser security labs from the makers of Burp Suite, mapped to the OWASP Top 10 (SQLi, XSS, SSRF, access control, and more), each with clear theory and a live vulnerable target.',
    bestFor: 'Understanding and exploiting web vulnerabilities against deliberately vulnerable apps.',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    id: 'letsdefend',
    name: 'LetsDefend',
    url: 'https://letsdefend.io',
    focus: 'Blue Team & SOC',
    level: 'Beginner \u2192 Intermediate',
    desc: 'Defender-side training with simulated SOC alerts, log analysis, and incident timelines. You work alerts the way a Tier-1/Tier-2 analyst would, then investigate and report.',
    bestFor: 'Practising detection, triage, and incident response from the defender\u2019s side.',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
];
