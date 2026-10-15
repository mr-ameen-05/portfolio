import { motion } from 'framer-motion';
import { LEARNING_PLATFORMS } from '../../data/learningPlatforms';

export default function PracticePlatformsSection() {
  return (
    <section
      id="platforms"
      className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
          Practice Platforms / Hands-On Training
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight">
          <span className="text-text-primary block">Learn cybersecurity by practising it</span>
          <span className="text-text-muted block">on the platforms professionals use.</span>
        </h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed mt-6">
          Reading builds vocabulary; labs build judgment. These are the external platforms I use and
          recommend, each noted with the specific discipline it is best suited to train.
        </p>
      </motion.div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARNING_PLATFORMS.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col h-full p-8 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 hover:bg-bg-secondary/70 transition-all group"
            aria-label={`${p.name} — opens in a new tab`}
          >
            <div className="flex items-center justify-between mb-5">
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${p.badge}`}
              >
                {p.focus}
              </span>
              <span className="text-xs font-mono text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                ↗
              </span>
            </div>

            <h3 className="font-sans text-xl font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
              {p.name}
            </h3>
            <p className="text-[11px] font-mono text-text-muted mb-4">{p.level}</p>

            <p className="text-text-secondary text-sm leading-relaxed mb-5">{p.desc}</p>

            <div className="mt-auto pt-4 border-t border-border-subtle/50 group-hover:border-accent/30 transition-colors">
              <p className="text-[11px] font-mono text-text-muted leading-relaxed">
                <span className="text-accent font-bold uppercase tracking-wider">Best for:</span>{' '}
                {p.bestFor}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Ethics Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-2xl bg-bg-secondary border border-border-subtle flex items-start gap-3"
      >
        <span className="w-2 h-2 mt-1.5 rounded-full bg-accent animate-pulse shrink-0" />
        <p className="text-xs sm:text-sm font-mono text-text-secondary leading-relaxed">
          Every platform above provides its own isolated, authorized, deliberately vulnerable
          environment. Never test systems you do not own or have explicit written permission to
          assess.
        </p>
      </motion.div>
    </section>
  );
}
