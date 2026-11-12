import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, MapPin, Terminal, BookOpen, Youtube, Instagram } from 'lucide-react';
import { SITE } from '../../config/site.config';

interface NavProfileProps {
  className?: string;
  size?: 'auto' | 'sm' | 'md' | 'lg';
}

export const NavProfile: React.FC<NavProfileProps> = ({ className = '', size = 'auto' }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Dynamic fluid sizing:
  // Mobile (<640px): 40px (w-10 h-10)
  // Tablet (sm): 44px (sm:w-11 sm:h-11)
  // Desktop (md/lg): 48px to 52px (md:w-12 md:h-12 lg:w-13 lg:h-13)
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'w-9 h-9 sm:w-10 sm:h-10';
      case 'md':
        return 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12';
      case 'lg':
        return 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16';
      case 'auto':
      default:
        return 'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12';
    }
  })();

  return (
    <>
      <div
        className={`relative select-none ${className}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Profile Placeholder Avatar Trigger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open operative profile preview"
          aria-expanded={open}
          className={`group relative ${sizeClasses} rounded-full p-[2px] bg-gradient-to-tr from-accent/60 via-white/25 to-accent/90 hover:from-accent hover:to-white transition-all duration-300 shadow-[0_0_14px_rgba(200,255,0,0.3)] hover:shadow-[0_0_24px_rgba(200,255,0,0.65)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer shrink-0`}
        >
          {/* Ambient pulse aura */}
          <span className="absolute -inset-1 rounded-full bg-accent/25 animate-pulse pointer-events-none -z-10 blur-[3px]" />

          {/* Inner Avatar Capsule */}
          <div className="w-full h-full rounded-full overflow-hidden bg-[#0D0D10] border border-black/90 flex items-center justify-center relative">
            {/* Auto-Scaled Profile Picture */}
            <img
              src="/ProfilePic.png"
              alt="Al Ameen Profile"
              className="w-full h-full object-cover object-top scale-[1.05] transition-transform duration-300 group-hover:scale-[1.14]"
              loading="eager"
            />

            {/* Subtle Cyber Vignette */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15 pointer-events-none" />
          </div>

          {/* Live Status Pip */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-accent border-2 border-[#0A0A0A] shadow-[0_0_8px_#C8FF00]"
            title="Status: Operational / Ready"
          />
        </button>

        {/* Cyberpunk Popover Profile Card */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-3 w-72 sm:w-80 p-4 rounded-2xl bg-[#0D0D12]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_25px_rgba(200,255,0,0.18)] z-50 pointer-events-auto"
            >
              {/* Top pointer notch */}
              <div className="absolute -top-1.5 right-5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-[#0D0D12] border-l border-t border-white/10 rotate-45" />

              <div className="flex items-center gap-3.5 border-b border-white/10 pb-3.5">
                {/* Large Profile Avatar Preview with Zoom trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setModalOpen(true);
                  }}
                  title="Click to view full image"
                  className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-black/70 border-2 border-accent/50 shadow-[0_0_16px_rgba(200,255,0,0.3)] flex items-center justify-center shrink-0 group/zoom cursor-zoom-in"
                >
                  <img
                    src="/ProfilePic.png"
                    alt="Al Ameen Profile Preview"
                    className="w-full h-full object-cover object-top scale-105 group-hover/zoom:scale-115 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/zoom:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-mono text-accent font-bold bg-black/80 px-1.5 py-0.5 rounded border border-accent/40">
                      Zoom
                    </span>
                  </div>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sans font-bold text-sm sm:text-base text-text-primary truncate">
                      {SITE.name}
                    </h4>
                    <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                  </div>
                  <p className="font-mono text-[11px] text-accent tracking-wide uppercase truncate mt-0.5 font-semibold">
                    Cyber Operative · Systems Builder
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                    <span>Operational &amp; Available</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 py-3 text-[11px] font-mono">
                <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">FOCUS</span>
                  <span className="text-text-primary font-medium flex items-center gap-1.5 truncate mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> AppSec / Red Team
                  </span>
                </div>
                <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">LOCATION</span>
                  <span className="text-text-primary font-medium flex items-center gap-1.5 truncate mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" /> India (IST)
                  </span>
                </div>
              </div>

              {/* CTAs & Socials */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <Link
                    to="/learn"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-accent text-black font-mono text-[11px] font-bold uppercase tracking-wider text-center hover:bg-white transition-all shadow-[0_0_12px_rgba(200,255,0,0.3)] flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Learn &amp; Grow</span>
                  </Link>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary font-mono text-[11px] text-center transition-colors flex items-center gap-1 active:scale-95"
                    title="Connect / Enquiry"
                  >
                    <span>Connect</span>
                  </a>
                </div>

                {/* Social Channels Uplink (UI/UX Placeholders for Future) */}
                <div className="flex items-center justify-center gap-4 pt-1.5 border-t border-white/5 text-[11px] font-mono text-text-muted">
                  <span
                    className="flex items-center gap-1.5 cursor-default opacity-80"
                    title="YouTube Channel (Coming Soon)"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>YouTube</span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-text-muted uppercase">Soon</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span
                    className="flex items-center gap-1.5 cursor-default opacity-80"
                    title="Instagram Profile (Coming Soon)"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-500" />
                    <span>Instagram</span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-text-muted uppercase">Soon</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-Resolution Profile Zoom Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-[#0D0D12] border-2 border-accent/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(200,255,0,0.35)] text-center space-y-4"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-text-muted hover:text-white flex items-center justify-center transition-colors font-mono text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl overflow-hidden border-2 border-accent shadow-[0_0_30px_rgba(200,255,0,0.4)] bg-black/80">
                <img
                  src="/ProfilePic.png"
                  alt="Al Ameen High-Res Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <h3 className="font-sans font-bold text-lg sm:text-xl text-white">
                  {SITE.name}
                </h3>
                <p className="font-mono text-xs text-accent uppercase tracking-widest mt-0.5">
                  Security Engineer · Systems Builder
                </p>
                <p className="font-sans text-xs text-text-muted mt-2">
                  Operating at the intersection of cybersecurity, full-stack systems, and AI workflows.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-accent hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
