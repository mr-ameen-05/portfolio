import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, BookOpen, Users2, ArrowUpRight } from 'lucide-react';
import Icon3D from '../ui/Icon3D';
import { SITE } from '../../config/site.config';

const pillars = [
  {
    title: 'Security Fundamentals',
    icon: ShieldAlert,
    desc: 'Exploring core security concepts, attack surfaces, threat modeling, and defensive thinking.',
  },
  {
    title: 'Practical Labs',
    icon: Terminal,
    desc: 'Using controlled, authorized environments to understand vulnerabilities, investigate system behavior, and test technical concepts.',
  },
  {
    title: 'Learning Resources',
    icon: BookOpen,
    desc: 'Developing structured notes, practical guides, and learning materials that make technical topics easier to explore.',
  },
  {
    title: 'Community Engagement',
    icon: Users2,
    desc: 'Participating in technical discussions, collaborative learning, and knowledge-sharing activities.',
  },
];

export default function CommunitySection() {
  return (
    <section id="community" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          13 — Community &amp; Knowledge Sharing
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Sharing Knowledge. Building Better Foundations.
        </h2>
        <div className="max-w-3xl mt-4 space-y-3 text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-sans">
          <p>
            I believe strong technical understanding comes from combining fundamentals with practical experimentation.
          </p>
          <p>
            My approach to cybersecurity education emphasizes understanding operating systems, networking, protocols, and threat behavior before relying on security tools.
          </p>
        </div>
      </motion.div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="mb-4">
                  <Icon3D icon={Icon} size="md" glowColor="#C8FF00" />
                </div>
                <h3 className="font-sans font-bold text-base text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Education Ethos Banner & Course link */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 p-6 sm:p-8 rounded-2xl bg-bg-secondary/70 border border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-1.5">
            Core Educational Motto
          </p>
          <p className="font-sans text-base sm:text-lg text-text-primary font-semibold">
            Understand the fundamentals. Practice responsibly. Share what you learn.
          </p>
          <p className="text-xs font-mono text-text-muted mt-2">
            Specific workshops, events, certifications, and community contributions are cataloged upon verified delivery.
          </p>
        </div>

        <a
          href={SITE.coursesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-3 rounded-lg bg-bg-primary border border-border-subtle hover:border-accent font-mono text-xs text-text-primary hover:text-accent font-semibold inline-flex items-center gap-2 transition-all"
        >
          <span>Explore Security Course Platform</span>
          <ArrowUpRight className="w-4 h-4 text-accent" />
        </a>
      </motion.div>
    </section>
  );
}
