import { motion } from 'framer-motion';

interface LaserInterlockDividerProps {
  sectionCode?: string;
  label?: string;
  className?: string;
}

export default function LaserInterlockDivider({
  sectionCode = 'SEC_SYS',
  label = 'INTERLOCK_SYNCHRONIZED',
  className = '',
}: LaserInterlockDividerProps) {
  return (
    <div className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 my-6 sm:my-10 select-none overflow-hidden ${className}`}>
      {/* Background Subtle Track */}
      <div className="relative h-[2px] w-full bg-border-subtle/50 flex items-center justify-center">
        
        {/* Animated Phosphor Laser Pulse */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            boxShadow: '0 0 16px 2px rgba(200, 255, 0, 0.45), 0 0 4px 1px rgba(255, 255, 255, 0.7)',
          }}
        />

        {/* Ambient Moving Laser Glow Glider */}
        <motion.div
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.5,
          }}
          className="absolute h-[3px] w-32 bg-gradient-to-r from-transparent via-accent to-transparent blur-sm"
        />

        {/* Left & Right Aperture Corner Reticles */}
        <div className="absolute left-0 -top-1.5 flex items-center gap-1 font-mono text-[9px] text-text-muted/60 tracking-tighter">
          <span className="text-accent/80 font-bold">+</span>
          <span className="hidden sm:inline">0x7F</span>
        </div>
        <div className="absolute right-0 -top-1.5 flex items-center gap-1 font-mono text-[9px] text-text-muted/60 tracking-tighter">
          <span className="hidden sm:inline">SYS_OK</span>
          <span className="text-accent/80 font-bold">+</span>
        </div>

        {/* Central Cyber Decrypt Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 4 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative z-10 px-3 py-0.5 rounded-full bg-bg-primary border border-border-subtle hover:border-accent/60 transition-colors flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-text-muted backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#C8FF00]" />
          <span className="text-text-primary font-bold">{sectionCode}</span>
          <span className="text-border-hover">::</span>
          <span className="text-text-muted hidden sm:inline">{label}</span>
        </motion.div>
      </div>
    </div>
  );
}
