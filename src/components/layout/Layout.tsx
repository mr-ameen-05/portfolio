import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../config/site.config';
import { ArrowUpRight } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { href: '#field-notes', label: 'Field Notes' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent selection:text-black">
      
      {/* Navbar - Monochrome Minimal */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border-subtle bg-bg-primary/85 backdrop-blur-md z-50 flex items-center justify-between px-4 sm:px-6 md:px-12">
        <Link to="/" className="font-mono text-sm tracking-wider font-bold hover:text-accent transition-colors">
          {SITE.name.toUpperCase()}
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              {item.label}
            </a>
          ))}
          
          <a
            href="#contact"
            className="text-xs font-mono px-3.5 py-1.5 rounded border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-wider font-semibold inline-flex items-center gap-1"
          >
            Discuss a Project
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 -mr-2 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-primary/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-6 px-6 py-12 md:hidden overflow-y-auto">
          {navLinks.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base sm:text-lg font-mono text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest py-2"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-black bg-accent hover:bg-accent/90 uppercase tracking-wider font-bold py-2.5 px-6 rounded transition-all mt-4"
          >
            Discuss a Project
          </a>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16 w-full max-w-[100vw] overflow-x-hidden">
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
                    className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
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
