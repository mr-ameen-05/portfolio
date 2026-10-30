import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { SITE } from '../../config/site.config';
import Icon3D from '../ui/Icon3D';

export default function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle bg-bg-primary text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          16 — Action
        </p>

        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
          Let's Build Something That Works.
        </h2>

        <div className="space-y-3 text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
          <p className="text-text-primary font-medium">
            Good engineering starts with understanding the problem.
          </p>
          <p>
            If you have a security challenge, a complex technical requirement, or an idea that needs to become a working system, let's discuss the possibilities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 mb-12">
          <a
            href="#contact"
            className="px-8 py-3.5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded inline-flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
          >
            <span>Discuss a Project</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#projects"
            className="px-8 py-3.5 border border-border-hover bg-bg-secondary/60 text-text-primary font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all rounded"
          >
            Explore My Work
          </a>
        </div>

        {/* Identity Signature */}
        <div className="inline-flex flex-col items-center p-5 rounded-2xl bg-bg-secondary/50 border border-border-subtle">
          <div className="flex items-center gap-3 text-text-primary font-bold font-mono text-xs uppercase tracking-widest">
            <Icon3D icon={Terminal} size="sm" glowColor="#C8FF00" />
            <span>{SITE.name.toUpperCase()}</span>
          </div>
          <span className="text-[11px] font-mono text-text-muted mt-2">
            Security Engineer · Forward Deployed Engineer · Systems Builder
          </span>
        </div>
      </motion.div>
    </section>
  );
}
