import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import Icon3D from '../ui/Icon3D';
import { ArrowDown, Shield, Terminal, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

const coreDisciplines = [
  {
    title: 'Security Engineering',
    tag: 'Offensive & Defensive',
    icon: Shield,
    desc: 'Identifying security weaknesses, assessing attack surfaces, validating vulnerabilities, and helping organizations improve their security posture.',
  },
  {
    title: 'Security Operations',
    tag: 'Detection & Response',
    icon: Terminal,
    desc: 'Building practical security monitoring and investigation workflows through log analysis, SIEM engineering, detection development, and incident investigation.',
  },
  {
    title: 'Forward Deployed Engineering',
    tag: 'Integration & Delivery',
    icon: Cpu,
    desc: 'Working close to real operational problems to design, integrate, and deploy software solutions that fit existing business environments.',
  },
  {
    title: 'Full-Stack Engineering',
    tag: 'Web & Systems',
    icon: Layers,
    desc: 'Building web applications, APIs, internal platforms, and database-backed systems with an emphasis on maintainability, reliability, and usability.',
  },
  {
    title: 'AI Engineering',
    tag: 'Automation & Safeguards',
    icon: Sparkles,
    desc: 'Developing AI-powered applications and automation workflows with attention to system integration, evaluation, permissions, and operational reliability.',
  },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll Zoom Hero: Track progress through the hero section as the user scrolls
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Background Scroll Zoom transforms:
  // 1. Scales up (zooms in) from 1 to 1.5
  // 2. Blurs progressively up to 20px
  // 3. Fades out as the user reaches the end of the hero
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const blurPx = useTransform(scrollYProgress, [0, 0.7, 1], [0, 8, 20]);
  const bgFilter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [0.85, 0.4, 0]);

  // Content parallax elevation & fade:
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.94]);

  return (
    <>
      {/* 02. Hero Section with Scroll Zoom */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-[92vh] sm:min-h-screen w-full overflow-hidden flex items-center justify-center bg-bg-primary py-16 sm:py-24"
      >
        {/* Scroll Zoom Background: scales up, blurs, and fades out */}
        <motion.div
          style={{
            scale: bgScale,
            filter: bgFilter,
            opacity: bgOpacity,
          }}
          className="absolute inset-0 z-0 pointer-events-auto origin-center will-change-transform"
        >
          <HeroCanvas />
        </motion.div>

        {/* Ambient subtle glow reacting to zoom */}
        <motion.div
          style={{
            scale: bgScale,
            opacity: bgOpacity,
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"
        />

        {/* Central Content Block with Scroll Parallax */}
        <motion.div
          style={{
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
          }}
          className="relative z-30 flex flex-col items-center justify-center pointer-events-none max-w-4xl mx-auto px-4 sm:px-6 text-center will-change-transform"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full flex flex-col items-center"
          >
            {/* Top Identity & Status Pill */}
            <div 
              id="hero-name-badge"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border-subtle bg-bg-secondary/90 text-xs font-mono text-text-secondary mt-14 sm:mt-0 mb-6 backdrop-blur-md pointer-events-auto"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-text-primary font-bold tracking-wider">AL AMEEN N R</span>
              <span className="text-border-hover">|</span>
              <span className="text-text-muted hidden sm:inline">Kerala, India · Open to Selected Projects</span>
              <span className="text-text-muted sm:hidden">Open to Projects</span>
            </div>

            {/* Subtitle / Role Tag */}
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-accent font-semibold mb-4">
              Security Engineer · Forward Deployed Engineer · Systems Builder
            </p>

            {/* Headline */}
            <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary mb-6 leading-[1.12]">
              I secure systems. <br />
              I engineer solutions. <br />
              <span className="text-text-muted">I build for the real world.</span>
            </h1>

            {/* Core Paragraph */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-4">
              I work at the intersection of cybersecurity, software engineering, and artificial intelligence—helping businesses identify vulnerabilities, strengthen their infrastructure, and turn complex technical requirements into reliable software systems.
            </p>

            {/* Sub-intro */}
            <p className="font-sans text-xs sm:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
              From penetration testing and security operations to full-stack applications, infrastructure engineering, and AI-powered workflows, I focus on building solutions that solve real problems and deliver practical value.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto pointer-events-auto">
              <a
                href="#contact"
                className="px-7 py-3.5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded text-center shadow-lg shadow-accent/10"
              >
                Discuss a Project
              </a>
              <a
                href="#projects"
                className="px-7 py-3.5 border border-border-hover bg-bg-secondary/60 text-text-primary font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all rounded text-center"
              >
                Explore My Work
              </a>
            </div>

            {/* Micro Location Footer */}
            <div className="mt-10 sm:mt-12 flex items-center gap-2 text-xs font-mono text-text-muted pointer-events-auto">
              <span>Kerala, India · Open to Selected Projects</span>
              <a href="#intro" aria-label="Scroll down" className="text-text-muted hover:text-accent transition-colors ml-2">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 03. Professional Introduction */}
      <section id="intro" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
            03 — Professional Introduction
          </p>
          <h2 className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
            Engineering beyond the surface.
          </h2>

          <div className="space-y-4 sm:space-y-5 text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-sans mb-8">
            <p>
              Modern systems need more than working code. They need security, reliability, observability, and thoughtful engineering.
            </p>
            <p>
              My work spans offensive security, defensive security operations, infrastructure, application development, and AI engineering. This combination allows me to approach technical problems from multiple perspectives: understanding how systems behave, identifying where they fail, and engineering practical improvements.
            </p>
            <p className="text-text-primary font-medium">
              I focus on understanding the underlying problem before selecting the tools or designing the solution.
            </p>
          </div>

          {/* Core Philosophy Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            {[
              'Understand the problem.',
              'Secure the layers.',
              'Engineer the solution.',
              'Validate the result.',
            ].map((step, idx) => (
              <div
                key={step}
                className="p-3.5 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col justify-between"
              >
                <span className="font-mono text-xs text-accent font-semibold mb-1">
                  0{idx + 1}
                </span>
                <span className="font-mono text-xs text-text-primary font-medium leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 04. Core Expertise */}
      <section id="expertise" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14"
        >
          <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
            04 — Core Expertise
          </p>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
            What I Work On
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mt-3">
            A cross-disciplinary capability spanning security assessments, continuous detection, custom internal platforms, and dependable AI automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreDisciplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-6 sm:p-7 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Icon3D icon={Icon} size="md" glowColor="#C8FF00" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2 py-0.5 rounded border border-border-subtle">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-sans text-text-primary mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border-subtle/60 flex items-center gap-1.5 text-xs font-mono text-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Production &amp; client ready</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
