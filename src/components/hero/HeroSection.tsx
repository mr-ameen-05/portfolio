import { motion } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import VisitorTerminal from './VisitorTerminal';
import { SITE } from '../../config/site.config';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden flex items-center bg-bg-primary py-12 md:py-20">
      
      {/* Canvas: orbits contained to frame the right side */}
      <HeroCanvas />

      {/* Main Container: Centered naturally between left and right orbits */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-6 sm:px-10 pointer-events-auto">
        <div className="text-center sm:text-left mx-auto">
          
          <motion.div 
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Domain Labels + Status Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
                Security × AI × Systems
              </span>
              <span className="text-border-subtle">•</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telemetry Active</span>
              </div>
            </div>

            {/* Main Headline: Defined left edge and strong contrast */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-text-primary leading-[1.08] font-bold">
              {SITE.hero.heading.map((s, i) => (
                <span key={i} className="block">{s}</span>
              ))}
            </h1>

            {/* Shortened, impactful summary */}
            <p className="font-sans text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              Testing defenses, hardening Linux & cloud infrastructure, and building resilient software that doesn't compromise on security.
            </p>

            {/* Domain Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SITE.hero.domains.map(d => (
                <span key={d} className="px-3 py-1 border border-border-subtle text-xs font-mono text-text-muted bg-bg-secondary/60">
                  {d}
                </span>
              ))}
            </div>

            {/* Clearest Next Step Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a 
                href="#projects" 
                className="px-7 py-3 bg-text-primary text-bg-primary font-mono text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-black transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {SITE.hero.cta.primary}
              </a>
              <a 
                href="#field-notes" 
                className="px-7 py-3 border border-border-subtle text-text-secondary font-mono text-xs uppercase tracking-widest hover:border-text-primary hover:text-text-primary transition-all hover:scale-[1.02]"
              >
                {SITE.hero.cta.secondary}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
