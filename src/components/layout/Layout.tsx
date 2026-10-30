import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../config/site.config';
import { ArrowUpRight } from 'lucide-react';
import { useSmoothScroll } from '../scroll/SmoothScrollContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#projects', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#stack', label: 'Stack' },
    { href: '#journey', label: 'Evolution' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    scrollTo(href, { offset: -30, duration: 1.0 });
  };

  const handleDesktopNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, { offset: -30, duration: 1.0 });
  };

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent selection:text-black">
      {/* Skip Navigation Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a href="#hero" className="skip-link">
        Skip to main content
      </a>
      
      {/* Impeccable Floating Navigation Bar — Zero opaque background at top, frosted glass capsule on scroll */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 md:px-8 ${
          scrolled ? 'py-2.5 sm:py-3.5' : 'py-4 sm:py-6'
        }`}
      >
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-full px-5 sm:px-7 py-2.5'
              : 'bg-transparent border-transparent px-2 sm:px-4 py-1'
          }`}
        >
          {/* Identity / Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-full py-1"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#C8FF00]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] font-bold text-text-primary group-hover:text-accent transition-colors">
              {SITE.name.toUpperCase()}
            </span>
          </Link>
          
          {/* Desktop Nav with Spring Magnetic Hover Pill */}
          <nav
            onMouseLeave={() => setHoveredIdx(null)}
            className="hidden md:flex items-center gap-1 relative"
            aria-label="Main navigation"
          >
            {navLinks.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={(e) => handleDesktopNavClick(e, item.href)}
                  className="relative px-3.5 py-1.5 text-[13px] font-sans font-medium tracking-normal text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {isHovered && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 bg-white/10 border border-white/5 rounded-full -z-10"
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              onClick={(e) => handleDesktopNavClick(e, '#contact')}
              className="group relative px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 hover:bg-accent text-accent hover:text-black font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_18px_rgba(200,255,0,0.35)] active:scale-95 cursor-pointer inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span>Discuss a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Nav Toggle with Generous 48px Tap Target */}
          <button 
            type="button"
            className="md:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 -mr-2 z-50 active:scale-90 transition-transform cursor-pointer rounded-full hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay with Staggered Animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-6 px-6 py-12 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col items-center gap-4 w-full max-w-xs">
              {navLinks.map((item, idx) => (
                <motion.button 
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  onClick={() => handleMobileNavClick(item.href)}
                  className="text-xl font-sans font-bold text-text-secondary hover:text-accent active:text-accent transition-colors tracking-tight py-2.5 px-6 text-center w-full rounded-xl hover:bg-white/5 cursor-pointer touch-manipulation"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              onClick={() => handleMobileNavClick('#contact')}
              className="text-xs font-mono text-black bg-accent hover:bg-white active:bg-white uppercase tracking-wider font-bold py-3.5 px-8 rounded-full transition-all mt-4 w-full max-w-xs shadow-lg shadow-accent/20 cursor-pointer touch-manipulation"
            >
              Discuss a Project
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full max-w-[100vw] overflow-x-hidden pt-16 sm:pt-20">
        {children}
      </div>

      {/* Footer (Section 17) */}
      <footer className="border-t border-border-subtle py-14 px-6 md:px-12 bg-bg-secondary/40 w-full max-w-[100vw] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="font-sans font-bold text-lg text-text-primary mb-1 tracking-tight">
              {SITE.name.toUpperCase()}
            </p>
            <p className="font-mono text-xs text-text-muted">
              Security Engineer · Forward Deployed Engineer · Systems Builder
            </p>
            <p className="font-sans text-sm text-text-secondary mt-2 max-w-md leading-relaxed">
              Securing systems. Engineering solutions. Building for the real world.
            </p>
            <p className="font-mono text-xs text-text-muted mt-2">
              Kerala, India
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full md:w-auto">
            {/* Navigation links */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
                Navigation
              </p>
              <div className="flex flex-col space-y-2">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleDesktopNavClick(e, item.href)}
                    className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Connect links */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
                Connect
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href="https://www.linkedin.com/in/al-ameen05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://github.com/mr-ameen-05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="mailto:26alameen2005@gmail.com"
                  className="text-xs font-mono text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  Email <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-text-muted">
          <p>© 2026 {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/privacy.html" className="hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="/terms.html" className="hover:text-text-primary transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
