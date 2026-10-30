import { motion } from 'framer-motion';
import { Compass, ShieldCheck, Scale, CheckCircle2, BookOpen, MapPin } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

const workingPrinciples = [
  {
    title: 'Understand before implementing.',
    desc: 'Start with the problem, constraints, and existing environment.',
    icon: Compass,
  },
  {
    title: 'Security is part of engineering.',
    desc: 'Consider access control, failure modes, data handling, and operational risks throughout development.',
    icon: ShieldCheck,
  },
  {
    title: 'Evidence matters.',
    desc: 'Distinguish between assumptions, observations, verified findings, and measured results.',
    icon: Scale,
  },
  {
    title: 'Build for real use.',
    desc: 'Prioritize maintainability, usability, reliability, and clearly defined outcomes.',
    icon: CheckCircle2,
  },
  {
    title: 'Keep learning.',
    desc: 'Document lessons, challenge assumptions, and improve the solution when new evidence emerges.',
    icon: BookOpen,
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          11 — About Me
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Curious About Systems. Focused on Engineering.
        </h2>
      </motion.div>

      {/* Main Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl space-y-6 text-text-secondary text-base md:text-lg leading-relaxed font-sans mb-14"
      >
        <p>
          I'm <strong className="text-text-primary font-semibold">Al Ameen N R</strong>, a technology professional working across cybersecurity, systems engineering, software development, and AI.
        </p>
        <p>
          My interests span both offensive and defensive security: understanding how systems can fail, identifying weaknesses, improving visibility, and developing practical ways to make infrastructure and applications more reliable.
        </p>
        <p>
          Alongside security work, I build software and explore how applications, databases, infrastructure, and AI-powered workflows can be integrated into useful systems.
        </p>
        <p className="text-text-primary font-medium">
          I value practical experimentation, evidence-based problem-solving, and the ability to explain technical decisions clearly.
        </p>
      </motion.div>

      {/* Working Principles */}
      <div className="mb-14">
        <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-6">
          My Working Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workingPrinciples.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className={`p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 transition-all ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
              <div className="mb-4">
                <Icon3D icon={Icon} size="md" glowColor="#C8FF00" />
              </div>
                <h4 className="font-sans font-bold text-base text-text-primary mb-2">
                  {principle.title}
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {principle.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Focus & Location Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 rounded-2xl bg-bg-secondary border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-2">
            Current Focus
          </p>
          <p className="font-sans text-base sm:text-lg text-text-primary font-semibold">
            Security engineering · Infrastructure reliability · Full-stack systems · AI engineering
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle font-mono text-xs text-text-secondary shrink-0">
          <MapPin className="w-4 h-4 text-accent" />
          <span>Location: Kerala, India</span>
        </div>
      </motion.div>
    </section>
  );
}
