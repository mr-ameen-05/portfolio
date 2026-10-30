import { motion } from 'framer-motion';
import { Terminal, Shield, Code, Radar, Bot, Wrench } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

interface JourneyStage {
  num: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const stages: JourneyStage[] = [
  {
    num: '01',
    title: 'Systems and Operating Environments',
    desc: 'Developing an understanding of operating systems, networking, Linux, and the underlying mechanisms that make software work.',
    icon: Terminal,
  },
  {
    num: '02',
    title: 'Cybersecurity',
    desc: 'Exploring security assessment, vulnerability research, defensive monitoring, and the relationship between system design and security risk.',
    icon: Shield,
  },
  {
    num: '03',
    title: 'Software Engineering',
    desc: 'Building applications, APIs, database-backed systems, and integrations to solve practical problems.',
    icon: Code,
  },
  {
    num: '04',
    title: 'Security Operations',
    desc: 'Developing practical knowledge of log analysis, security monitoring, investigation workflows, and detection engineering.',
    icon: Radar,
  },
  {
    num: '05',
    title: 'AI and Automation',
    desc: 'Exploring how AI models, agent workflows, and system integrations can support technical and operational processes.',
    icon: Bot,
  },
  {
    num: '06',
    title: 'Engineering in Practice',
    desc: 'Bringing these disciplines together through independent projects, implementation, experimentation, documentation, and continued technical development.',
    icon: Wrench,
  },
];

export default function JourneySection() {
  return (
    <section id="journey" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-12"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          05 — Professional Background
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Background &amp; Evolution
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-3xl mt-4 leading-relaxed font-sans">
          The progression of disciplines, systems engineering, and security practices that shape how I build and defend systems today.
        </p>
      </motion.div>

      {/* Narrative Bio Callout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 p-6 sm:p-8 rounded-2xl bg-bg-secondary/60 border border-border-subtle text-text-secondary text-sm sm:text-base leading-relaxed font-sans max-w-4xl"
      >
        <p className="text-text-primary font-medium mb-3">
          I'm <strong className="text-accent font-semibold">Al Ameen N R</strong>, a systems builder working at the intersection of cybersecurity, full-stack software development, and AI engineering.
        </p>
        <p className="mb-3">
          My focus spans offensive testing and defensive operations: identifying architecture vulnerabilities, configuring SIEM telemetry, and developing custom software platforms that solve operational bottlenecks.
        </p>
        <p className="text-text-muted text-xs font-mono">
          Location: Kerala, India · Open to Remote &amp; On-Site Engagements
        </p>
      </motion.div>

      {/* Structured Journey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-accent">
                    Stage {stage.num}
                  </span>
                  <Icon3D icon={Icon} size="sm" glowColor="#C8FF00" />
                </div>
                <h3 className="font-sans text-lg font-bold text-text-primary mb-2.5">
                  {stage.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* The common thread statement */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 p-6 rounded-2xl bg-bg-secondary/60 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <p className="font-sans text-sm sm:text-base text-text-primary font-medium">
          <span className="font-mono text-accent uppercase text-xs tracking-wider block sm:inline mr-2 font-bold">
            The Common Thread:
          </span>
          Understanding systems deeply enough to improve how they work.
        </p>
      </motion.div>
    </section>
  );
}
