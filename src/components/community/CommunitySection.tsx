import { motion } from 'framer-motion';

interface CommunityCard {
  icon: string;
  title: string;
  desc: string;
}

const communityCards: CommunityCard[] = [
  {
    icon: '🔐',
    title: 'Security Fundamentals',
    desc: 'Hands-on sessions covering foundational security concepts, threat modeling, attack surfaces, and defensive thinking before turning to automation.',
  },
  {
    icon: '📚',
    title: 'Learning Resources',
    desc: 'Curated workshop notes, lab guides, structured references, and study material designed for reproducible self-paced learning.',
  },
  {
    icon: '🖥️',
    title: 'Practical Labs',
    desc: 'Live demonstrations and scenario-driven exercises conducted exclusively in isolated, authorized environments.',
  },
  {
    icon: '🤝',
    title: 'Community Work',
    desc: 'Volunteering with student organizations and tech communities to facilitate workshops, open discussions, and collaborative learning.',
  },
  {
    icon: '💡',
    title: 'Teaching Reflections',
    desc: 'Lessons from teaching — analyzing questions that challenged assumptions and deepened my understanding of core systems.',
  },
  {
    icon: '🗺️',
    title: 'Learning Pathways',
    desc: 'Step-by-step curricula breaking complex security tracks into clear milestones: Linux internals → Networking → Log Analysis → Incident Investigation.',
  },
];

export default function CommunitySection() {
  return (
    <section id="community" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
          Community / Knowledge Sharing
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-text-primary mb-2">
          Making cybersecurity more practical,
        </h2>
        <h2 className="font-display text-5xl md:text-6xl text-text-muted mb-8">
          one session at a time.
        </h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
          I enjoy helping learners understand fundamentals before tools. By grasping core operating system mechanisms, network protocols, and threat behavior first, learners build the intuition needed to understand what security tools actually do and why they matter.
        </p>
      </motion.div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityCards.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="p-8 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-border-hover transition-all group"
          >
            <div className="text-3xl mb-4" aria-hidden="true">
              {item.icon}
            </div>
            <h3 className="font-sans text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
              {item.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Verification Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-2xl bg-bg-secondary border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono text-text-secondary">
            Specific events, dates, and details will be added after verification.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border border-border-subtle px-2.5 py-1 rounded w-fit">
          [TO VERIFY]
        </span>
      </motion.div>
    </section>
  );
}
