import { motion } from 'framer-motion';

interface InfoCard {
  label: string;
  value: string;
}

const infoCards: InfoCard[] = [
  {
    label: 'CURRENT FOCUS',
    value: 'Linux & container hardening, vulnerability assessment, incident response',
  },
  {
    label: 'ROLE',
    value: 'Cybersecurity Analyst & Systems Builder',
  },
  {
    label: 'LOCATION',
    value: 'Kerala, India',
  },
  {
    label: 'WORKING STYLE',
    value: 'Understand the architecture. Secure the layers. Build reliably.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">About</p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight">
          <span className="text-text-primary block">I care about what happens</span>
          <span className="text-text-muted block">beneath the surface.</span>
        </h2>
      </motion.div>

      {/* Body Copy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl space-y-6 text-text-secondary text-base md:text-lg leading-relaxed font-sans mb-16"
      >
        <p>
I work across both sides of security—testing defenses, hardening infrastructure, and building software that doesn't cut corners on security. Most of my day is spent digging into Linux systems, configuring reliable container setups, auditing networks, and shipping clean code for practical business platforms.
</p>
<p>
My daily work balances offensive and defensive operations: running vulnerability assessments, locking down infrastructure, and setting up monitoring that actually alerts on real threats instead of noise. On the engineering side, I build and maintain self-hosted systems, containerized workflows, and web services designed to run reliably under real-world conditions.
</p>
<div className="pt-2">
  <p className="text-text-primary font-mono text-xs uppercase tracking-widest mb-4">
    My approach is simple:
  </p>
  <div className="space-y-2 border-l border-border-subtle pl-4 font-mono text-sm md:text-base text-text-primary">
    <p>Understand the problem.</p>
    <p>Secure the layers.</p>
    <p>Build reliable systems.</p>
    <p>Audit and monitor.</p>
    <p>Improve the result.</p>
  </div>
</div>
      </motion.div>

      {/* 2x2 Grid of Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + index * 0.08 }}
            className="bg-bg-secondary border border-border-subtle p-6 rounded-xl hover:border-border-hover transition-colors"
          >
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
              {card.label}
            </p>
            <p className="font-sans text-base md:text-lg text-text-primary font-medium">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
