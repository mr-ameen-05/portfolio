import { motion } from 'framer-motion';

interface InfoCard {
  label: string;
  value: string;
}

const infoCards: InfoCard[] = [
  {
    label: 'CURRENT FOCUS',
    value: 'SOC Analyst',
  },
  {
    label: 'EDUCATION',
    value: 'BCA — Currently Studying',
  },
  {
    label: 'INTERESTS',
    value: 'AI security, secure software, penetration testing',
  },
  {
    label: 'WORKING STYLE',
    value: 'Build · Investigate · Secure · Improve',
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
          I'm Al Ameen N R, a cybersecurity, software and AI engineer currently pursuing a BCA.
        </p>
        <p>
          My interests sit at the intersection of secure systems, software engineering, intelligent automation, and practical security research.
        </p>
        <p>
          I enjoy understanding how systems work beneath the surface, building useful solutions, testing how they behave under unexpected conditions, and investigating where security or reliability can be improved.
        </p>
        <div className="pt-2">
          <p className="text-text-primary font-mono text-xs uppercase tracking-widest mb-4">
            My approach is simple:
          </p>
          <div className="space-y-2 border-l border-border-subtle pl-4 font-mono text-sm md:text-base text-text-primary">
            <p>Understand the problem.</p>
            <p>Build the system.</p>
            <p>Test the assumptions.</p>
            <p>Investigate the failures.</p>
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
