import { motion } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import { SITE } from '../../config/site.config';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center bg-bg-primary">
      
      {/* Canvas: orbits only */}
      <HeroCanvas />

      {/* Backdrop Monospace technical text */}
      <div className="absolute top-[15%] w-full text-center pointer-events-none select-none opacity-[0.03]">
        <h2 className="font-mono text-[10vw] leading-none whitespace-nowrap overflow-hidden text-text-primary uppercase tracking-tighter">
          System.Investigate()
        </h2>
      </div>

      {/* Central Content Block */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none max-w-4xl mx-auto px-6 mt-10">
        
        {/* Frosted mask to protect text from orbit clutter */}
        <div className="absolute inset-0 scale-[1.8] rounded-full bg-bg-primary/50 backdrop-blur-sm -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center relative z-10"
        >
          {/* Domain Labels */}
          <div className="flex justify-center gap-3 mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Cybersecurity</span>
            <span className="text-text-muted">×</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Software</span>
            <span className="text-text-muted">×</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tight text-text-primary mb-8 leading-[1.05]">
            {SITE.hero.heading.map((s, i) => (
              <span key={i} className="block">{s}</span>
            ))}
          </h1>

          {/* Intro */}
          <p className="font-sans text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            {SITE.hero.intro}
          </p>

          {/* Domain Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 pointer-events-auto">
            {SITE.hero.domains.map(d => (
              <span key={d} className="px-4 py-1.5 rounded-none border border-border-subtle text-xs font-mono text-text-secondary bg-bg-secondary/80">
                {d}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pointer-events-auto">
            <a href="#projects" className="px-8 py-3 bg-text-primary text-bg-primary font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-black transition-colors">
              {SITE.hero.cta.primary}
            </a>
            <a href="#field-notes" className="px-8 py-3 border border-border-subtle text-text-secondary font-mono text-xs uppercase tracking-widest hover:border-text-primary hover:text-text-primary transition-colors">
              {SITE.hero.cta.secondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
