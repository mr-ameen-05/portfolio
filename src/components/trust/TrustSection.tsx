import { motion } from 'framer-motion';
import { ShieldAlert, FileCheck, KeyRound, CheckSquare, MessageSquare, Award, LockKeyhole } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

const trustPillars = [
  {
    title: 'Defined Scope',
    icon: FileCheck,
    desc: 'Project objectives, deliverables, exclusions, and responsibilities are established before work begins.',
  },
  {
    title: 'Authorized Security Testing',
    icon: ShieldAlert,
    desc: 'Security assessments are conducted only with appropriate authorization and within agreed testing boundaries.',
  },
  {
    title: 'Responsible Access',
    icon: KeyRound,
    desc: 'System access should be limited to what the engagement requires, with credentials and sensitive information handled using appropriate security practices.',
  },
  {
    title: 'Evidence-Based Findings',
    icon: CheckSquare,
    desc: 'Security findings and engineering recommendations are grounded in available evidence, documented assumptions, and appropriate validation.',
  },
  {
    title: 'Transparent Communication',
    icon: MessageSquare,
    desc: 'Progress, limitations, technical risks, and material issues are communicated clearly throughout the engagement.',
  },
  {
    title: 'Verifiable Delivery',
    icon: Award,
    desc: 'Work is evaluated against agreed acceptance criteria, with documentation and validation appropriate to the project.',
  },
  {
    title: 'Confidentiality',
    icon: LockKeyhole,
    desc: 'Client information and assessment evidence are handled according to agreed confidentiality, storage, access, and retention requirements.',
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          08 — Trust &amp; Assurance
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Trust Is Part of the Engineering Process.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-3xl mt-4 leading-relaxed font-sans">
          Security and engineering engagements often involve sensitive information, important infrastructure, and critical business workflows. Responsible execution requires more than technical competence.
        </p>
      </motion.div>

      {/* Grid of Trust Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trustPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className={`p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/30 transition-all ${
                idx === 6 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="mb-4">
                <Icon3D icon={Icon} size="md" glowColor="#C8FF00" />
              </div>
              <h3 className="text-base font-bold font-sans text-text-primary mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                {pillar.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Anchor Quote */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 p-6 sm:p-8 rounded-2xl bg-bg-secondary/70 border border-border-subtle text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-1.5">
            Operating Ethos
          </p>
          <p className="font-sans text-base sm:text-lg text-text-primary font-medium leading-relaxed">
            "My approach is straightforward: define the boundaries, do the work responsibly, validate the result, and communicate honestly."
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>Strict NDA &amp; Scope Compliance</span>
        </div>
      </motion.div>
    </section>
  );
}
