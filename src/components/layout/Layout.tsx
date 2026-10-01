import { useState } from 'react';
import { SITE } from '../../config/site.config';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent selection:text-black">
      
      {/* Navbar - Monochrome Minimal */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12">
        <a href="#hero" className="font-mono text-sm tracking-wider font-bold hover:text-accent transition-colors">
          {SITE.name.toUpperCase()}
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {SITE.nav.slice(1).map(n => (
            <a key={n.id} href={`#${n.id}`} className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">
              {n.label}
            </a>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden flex flex-col justify-center gap-1.5 w-6 h-6 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-primary/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {SITE.nav.slice(1).map(n => (
            <a 
              key={n.id} 
              href={`#${n.id}`} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-mono text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              {n.label}
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16 w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-border-subtle py-12 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-[100vw] overflow-hidden">
        <div>
          <p className="font-sans font-bold text-lg text-text-primary mb-1">{SITE.name.toUpperCase()}</p>
          <p className="font-mono text-xs text-text-muted">Cybersecurity · Software · AI</p>
          <p className="font-serif text-sm text-text-secondary mt-3 max-w-sm">"{SITE.tagline}"</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {SITE.nav.slice(1).map(n => (
            <a key={n.id} href={`#${n.id}`} className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">
              {n.label}
            </a>
          ))}
        </div>
        <p className="text-xs font-mono text-text-muted">© {new Date().getFullYear()} {SITE.name}</p>
      </footer>
    </div>
  );
}
