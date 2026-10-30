import { motion } from 'framer-motion';
import { Search, Compass, Wrench, ShieldCheck, CheckCircle } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

const steps = [
  {
    num: '01',
    name: 'Discover',
    icon: Compass,
    desc: 'Understand the business objective, existing environment, constraints, and desired outcome.',
  },
  {
    num: '02',
    name: 'Assess',
    icon: Search,
    desc: 'Analyze the architecture, investigate the problem, gather evidence, and identify potential risks or implementation requirements.',
  },
  {
    num: '03',
    name: 'Engineer',
    icon: Wrench,
    desc: 'Develop the solution, perform the agreed assessment, or implement the required technical improvements.',
  },
  {
    num: '04',
    name: 'Validate',
    icon: ShieldCheck,
    desc: 'Verify the result against agreed acceptance criteria through appropriate testing, security validation, or operational checks.',
  },
  {
    num: '05',
    name: 'Deliver',
    icon: CheckCircle,
    desc: 'Provide the agreed deliverables, documentation, findings, and recommendations for the next steps.',
  },
];

export default function HowIWorkSection() {
  return (
    <section id="process" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          07 — How I Work
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          A Clear Process. Defined Scope. Verifiable Results.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-sans">
          Every engagement begins with understanding the problem and defining what success looks like.
        </p>
      </motion.div>

      {/* 5-Step Process Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-accent">
                    {step.num}
                  </span>
                  <Icon3D icon={Icon} size="sm" glowColor="#C8FF00" />
                </div>
                <h3 className="font-sans text-xl font-bold text-text-primary mb-2">
                  {step.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Callout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 p-6 rounded-2xl bg-bg-secondary/60 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p className="font-sans text-sm sm:text-base text-text-primary font-medium">
          The objective is not simply to complete a task. It is to deliver a result that can be understood, evaluated, and maintained.
        </p>
        <a
          href="#contact"
          className="shrink-0 px-5 py-2.5 rounded bg-bg-primary border border-border-subtle hover:border-accent font-mono text-xs text-text-primary hover:text-accent uppercase tracking-wider transition-colors"
        >
          Start with Discovery →
        </a>
      </motion.div>
    </section>
  );
}
