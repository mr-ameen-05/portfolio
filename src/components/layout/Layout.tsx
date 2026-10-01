import { SITE } from '../../config/site.config';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent selection:text-black">
      
      {/* Navbar - Monochrome Minimal */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12">
        <a href="#hero" className="font-mono text-sm tracking-wider font-bold hover:text-accent transition-colors">
          {SITE.name.toUpperCase()}
        </a>
        <div className="hidden md:flex items-center gap-8">
          {SITE.nav.slice(1).map(n => (
            <a key={n.id} href={`#${n.id}`} className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-border-subtle py-12 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
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
