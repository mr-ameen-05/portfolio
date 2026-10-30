import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface SectionTransitionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  enableDepth?: boolean;
}

export default function SectionTransitionWrapper({
  id,
  children,
  className = '',
  enableDepth = true,
}: SectionTransitionWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkEnvironment = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    checkEnvironment();
    window.addEventListener('resize', checkEnvironment, { passive: true });
    return () => window.removeEventListener('resize', checkEnvironment);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Desktop subtle parallax scroll spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // Very gentle vertical drift on desktop only (15px) — completely flat on mobile
  const desktopYParallax = useTransform(smoothProgress, [0, 1], [15, -15]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative scroll-mt-24 ${className}`}
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : {
                opacity: 0,
                y: isMobile ? 18 : 28,
                scale: isMobile ? 0.99 : 0.98,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: isMobile ? 0.08 : 0.12,
        }}
        transition={{
          duration: isMobile ? 0.45 : 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={
          enableDepth && !isMobile && !prefersReducedMotion
            ? { y: desktopYParallax, transformPerspective: 1200 }
            : undefined
        }
        className="w-full will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    </div>
  );
}
