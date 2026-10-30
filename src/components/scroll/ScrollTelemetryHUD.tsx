import { useState, useEffect } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { useSmoothScroll } from './SmoothScrollContext';
import { Compass, ChevronsUpDown } from 'lucide-react';

interface SectionMarker {
  id: string;
  code: string;
  label: string;
}

const SECTION_MARKERS: SectionMarker[] = [
  { id: 'hero', code: '01', label: 'Overview' },
  { id: 'projects', code: '02', label: 'Selected Work' },
  { id: 'services', code: '03', label: 'Services' },
  { id: 'stack', code: '04', label: 'Technical Stack' },
  { id: 'journey', code: '05', label: 'Background' },
  { id: 'contact', code: '06', label: 'Project Enquiry' },
];

export default function ScrollTelemetryHUD() {
  const { scrollTo } = useSmoothScroll();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 30,
    stiffness: 200,
  });

  const velocityAbs = useTransform(smoothVelocity, (val) => Math.min(Math.abs(val) / 500, 3));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = SECTION_MARKERS.length - 1; i >= 0; i--) {
        const marker = SECTION_MARKERS[i];
        const el = document.getElementById(marker.id);
        if (el) {
          const rectTop = el.offsetTop;
          if (scrollPos >= rectTop) {
            setActiveSection(marker.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeMarker = SECTION_MARKERS.find((m) => m.id === activeSection) || SECTION_MARKERS[0];

  return (
    <aside
      aria-label="Scroll Telemetry Navigator"
      className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 select-none"
    >
      {/* HUD Telemetry Capsule */}
      <motion.div
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        className="p-3 rounded-2xl bg-bg-secondary/85 backdrop-blur-md border border-border-subtle hover:border-accent/50 shadow-2xl transition-colors flex flex-col items-center gap-4"
        style={{
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Top Status Glyph */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
          <Compass className="w-3.5 h-3.5 text-accent animate-spin-slow" />
          <span className="font-bold text-accent">{activeMarker.code}</span>
        </div>

        {/* Vertical Radar Node Track */}
        <div className="flex flex-col items-center gap-2 relative py-1">
          {/* Active Guide Track */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-border-subtle" />

          {SECTION_MARKERS.map((marker) => {
            const isActive = activeSection === marker.id;
            return (
              <button
                key={marker.id}
                onClick={() => scrollTo(`#${marker.id}`, { offset: -30, duration: 1.4 })}
                aria-label={`Jump to section ${marker.label}`}
                className="group relative flex items-center justify-center p-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus:outline-none rounded-full cursor-pointer"
              >
                {/* Node Pill */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    backgroundColor: isActive ? '#C8FF00' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isActive ? '0 0 10px #C8FF00' : 'none',
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full group-hover:bg-accent transition-colors"
                />

                {/* Floating Flyout Tooltip */}
                <div
                  className={`absolute right-6 px-2.5 py-1 rounded bg-bg-primary/95 border border-border-subtle text-[10px] font-mono whitespace-nowrap text-text-primary shadow-lg transition-all duration-200 pointer-events-none flex items-center gap-2 ${
                    isExpanded
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                >
                  <span className="text-accent font-bold">[{marker.code}]</span>
                  <span>{marker.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Velocity Pulse Gauge */}
        <motion.div
          style={{ opacity: velocityAbs }}
          className="flex flex-col items-center gap-1 pt-1 border-t border-border-subtle/40"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-accent motion-reduce:transform-none" />
        </motion.div>
      </motion.div>
    </aside>
  );
}
