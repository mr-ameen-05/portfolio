import React, { useRef } from 'react';
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth out progress values with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Scale: enters at 0.97, peaks at 1.0 in the center 60% of viewport, gently recedes to 0.97
  const scale = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.97, 1, 1, 0.97]);

  // Opacity: soft fade-in on arrival, solid in the focal zone, soft fade on departure
  const opacity = useTransform(smoothProgress, [0, 0.12, 0.88, 1], [0.55, 1, 1, 0.55]);

  // Subtle vertical parallax drift
  const y = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [25, 0, 0, -25]);

  return (
    <div ref={containerRef} id={id} className={`relative scroll-mt-20 ${className}`}>
      {enableDepth ? (
        <motion.div
          style={{
            scale,
            opacity,
            y,
            transformPerspective: 1200,
          }}
          className="w-full will-change-transform"
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </div>
  );
}
