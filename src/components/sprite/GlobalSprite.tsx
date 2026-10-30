import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { SpriteEngine, SpriteState } from '../../canvas/SpriteEngine';
import TypewriterText from '../hero/TypewriterText';
import { useVisitorTelemetry } from '../../hooks/useVisitorTelemetry';

interface DialogueStep {
  state: SpriteState;
  text: string;
}

export default function GlobalSprite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleWrapperRef = useRef<HTMLDivElement>(null);
  const beakRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SpriteEngine | null>(null);

  const telemetry = useVisitorTelemetry();

  const [speech, setSpeech] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const stateRef = useRef({
    x: -120,
    targetX: 180,
    y: typeof window !== 'undefined' ? window.innerHeight - 25 : 500,
    mode: 'WALK_IN' as 'WALK_IN' | 'TOUR_GUIDE' | 'IDLE' | 'WANDER' | 'FLEE',
    tourStep: 0,
    pauseTimer: 0,
    mouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    mouseY: 0,
    isTyping: false,
    isMobile: false,
    autoTimer: null as ReturnType<typeof setTimeout> | null,
  });

  // Dynamically generated educational dialogue based on live OSINT signals (compact & easy to read)
  const dialogueSteps: DialogueStep[] = useMemo(() => {
    const locationStr = telemetry.city && telemetry.city !== 'Earth'
      ? `${telemetry.city}${telemetry.country ? `, ${telemetry.country}` : ''}`
      : telemetry.location;

    return [
      {
        state: 'WAVE',
        text: `Hey! Welcome to the portfolio. 👋 Tracing incoming connection packets...`,
      },
      {
        state: 'THINK',
        text: `Detected ${telemetry.os} on ${telemetry.browser} with a ${telemetry.screen} display.`,
      },
      {
        state: 'TALK',
        text: `Packets routed from ${locationStr} via ${telemetry.isp}.`,
      },
      {
        state: 'THUMBS_UP',
        text: `This is client-side OSINT. Browsers openly broadcast this data on every visit!`,
      },
      {
        state: 'WAVE',
        text: `Explore the projects, services, and field notes below. Click me anytime!`,
      },
    ];
  }, [telemetry]);

  const advanceStep = useCallback(() => {
    const s = stateRef.current;
    if (s.tourStep >= dialogueSteps.length) {
      s.mode = 'IDLE';
      s.pauseTimer = 5;
      setSpeech(null);
      engineRef.current?.setState('IDLE_FRONT');
      return;
    }

    const step = dialogueSteps[s.tourStep];
    s.tourStep++;
    engineRef.current?.setState(step.state);
    setSpeech(step.text);
    setIsTyping(true);
    s.isTyping = true;
  }, [dialogueSteps]);

  const onTypingComplete = useCallback(() => {
    setIsTyping(false);
    stateRef.current.isTyping = false;

    if (stateRef.current.autoTimer) {
      clearTimeout(stateRef.current.autoTimer);
    }

    stateRef.current.autoTimer = setTimeout(() => {
      if (stateRef.current.mode === 'TOUR_GUIDE') {
        advanceStep();
      } else {
        setSpeech(null);
        engineRef.current?.setState('IDLE_FRONT');
      }
    }, 3200);
  }, [advanceStep]);

  const handleSpriteClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const s = stateRef.current;
    if (s.autoTimer) clearTimeout(s.autoTimer);

    if (s.mode === 'TOUR_GUIDE') {
      advanceStep();
    } else {
      const quips = [
        {
          state: 'TALK' as const,
          text: `Packets from ${telemetry.city || telemetry.location} are steady. ⚡`,
        },
        {
          state: 'THUMBS_UP' as const,
          text: telemetry.battery
            ? `Battery is at ${telemetry.battery}—looking healthy!`
            : `System running stable on ${telemetry.os}!`,
        },
        {
          state: 'THINK' as const,
          text: `Did you know canvas hashes can fingerprint browsers even in private windows?`,
        },
        {
          state: 'WAVE' as const,
          text: `Security tip: Always enforce multi-factor authentication! 🛡️`,
        },
        {
          state: 'THUMBS_UP' as const,
          text: `Scroll down to inspect recent case studies, services, and field notes.`,
        },
      ];

      const chosen = quips[Math.floor(Math.random() * quips.length)];
      engineRef.current?.setState(chosen.state);
      setSpeech(chosen.text);
      setIsTyping(true);
      s.isTyping = true;
    }
  }, [advanceStep, telemetry]);

  // Main animation canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const sprite = new SpriteEngine();
    engineRef.current = sprite;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 640;
      stateRef.current.isMobile = isMobile;

      // Responsive sprite scale: compact on mobile, majestic on desktop
      sprite.renderWidth = isMobile ? 86 : 130;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Floor positioning
      stateRef.current.y = isMobile ? h - 14 : h - 22;
    };

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // Start sequence
    const startDelay = setTimeout(() => {
      const s = stateRef.current;
      const w = window.innerWidth;
      const isMobile = w < 640;
      const targetX = isMobile ? Math.min(w * 0.28, 120) : Math.min(Math.max(w * 0.22, 140), 280);
      s.targetX = targetX;

      if (!prefersReducedMotion) {
        s.mode = 'WALK_IN';
        sprite.setState('WALK_RIGHT');
      } else {
        s.x = targetX;
        s.mode = 'TOUR_GUIDE';
        advanceStep();
      }
    }, 600);

    let isRunning = true;

    const render = (time: number) => {
      if (!isRunning) return;

      const dt = prefersReducedMotion ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const s = stateRef.current;
      const isMobile = s.isMobile;

      if (!prefersReducedMotion) {
        if (s.mode === 'WALK_IN') {
          const diff = s.targetX - s.x;
          if (diff > 5) {
            s.x += 160 * dt;
            sprite.setState('WALK_RIGHT');
          } else {
            s.x = s.targetX;
            s.mode = 'TOUR_GUIDE';
            advanceStep();
          }
        } else if (s.mode !== 'TOUR_GUIDE') {
          s.pauseTimer -= dt;

          // Only mouse flee on desktop
          if (!isMobile) {
            const distToMouse = Math.abs(s.mouseX - s.x);
            const mouseNearBottom = s.mouseY > h - 180;

            if (mouseNearBottom && distToMouse < 90 && s.mode !== 'FLEE' && !s.isTyping) {
              s.mode = 'FLEE';
              const fleeRight = s.x <= s.mouseX;
              const fleeDist = 220 + Math.random() * 80;
              s.targetX = fleeRight ? s.x - fleeDist : s.x + fleeDist;
              s.targetX = Math.max(70, Math.min(w - 70, s.targetX));
            }
          }

          if (s.mode === 'FLEE') {
            const diff = s.targetX - s.x;
            if (Math.abs(diff) < 12) {
              s.mode = 'IDLE';
              s.pauseTimer = 3;
              sprite.setState('IDLE_FRONT');
            } else {
              s.x += Math.sign(diff) * 380 * dt;
              sprite.setState(diff > 0 ? 'RUN_RIGHT' : 'RUN_LEFT');
            }
          } else if (s.mode === 'WANDER') {
            const diff = s.targetX - s.x;
            if (Math.abs(diff) > 10) {
              s.x += Math.sign(diff) * (isMobile ? 70 : 110) * dt;
              if (!s.isTyping) {
                sprite.setState(diff > 0 ? 'WALK_RIGHT' : 'WALK_LEFT');
              }
            } else {
              s.mode = 'IDLE';
              s.pauseTimer = Math.random() * 4 + 2;
              if (!s.isTyping) {
                sprite.setState('IDLE_FRONT');
              }
            }
          } else if (s.pauseTimer <= 0 && !s.isTyping) {
            const r = Math.random();
            if (r < 0.25) {
              s.mode = 'WANDER';
              s.targetX = Math.max(isMobile ? 50 : 80, s.x - (80 + Math.random() * 100));
            } else if (r < 0.5) {
              s.mode = 'WANDER';
              s.targetX = Math.min(w - (isMobile ? 50 : 80), s.x + (80 + Math.random() * 100));
            } else if (r < 0.7) {
              s.mode = 'IDLE';
              s.pauseTimer = 2.5;
              sprite.setState('LOOK_LEFT');
            } else if (r < 0.85) {
              s.mode = 'IDLE';
              s.pauseTimer = 2.5;
              sprite.setState('LOOK_RIGHT');
            } else {
              s.mode = 'IDLE';
              s.pauseTimer = 3.5;
              sprite.setState('IDLE_FRONT');
            }
          }
        }
      }

      // Constrain within screen boundaries
      const edgeMargin = isMobile ? 45 : 70;
      s.x = Math.max(edgeMargin, Math.min(w - edgeMargin, s.x));

      sprite.update(dt);
      sprite.render(ctx, s.x, s.y);

      // Direct DOM update of speech bubble position with EDGE CLAMPING
      // Prevents the bubble from ever clipping off the left or right edge of mobile screens!
      if (bubbleWrapperRef.current) {
        const bubbleWidth = isMobile ? Math.min(w - 24, 240) : 260;
        const halfWidth = bubbleWidth / 2;
        const minX = halfWidth + 12;
        const maxX = w - halfWidth - 12;
        const clampedX = Math.max(minX, Math.min(maxX, s.x));

        bubbleWrapperRef.current.style.transform = `translate3d(${Math.round(clampedX)}px, ${Math.round(s.y)}px, 0)`;

        // Adjust beak to point accurately at s.x
        if (beakRef.current) {
          const rawOffset = s.x - clampedX;
          const maxBeakOffset = halfWidth - 24;
          const clampedBeakOffset = Math.max(-maxBeakOffset, Math.min(maxBeakOffset, rawOffset));
          beakRef.current.style.transform = `translateX(calc(-50% + ${Math.round(clampedBeakOffset)}px)) rotate(45deg)`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      clearTimeout(startDelay);
      if (stateRef.current.autoTimer) clearTimeout(stateRef.current.autoTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [advanceStep]);

  return (
    <aside 
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none" 
      aria-label="Digital companion and OSINT guide"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Clamped Speech Bubble (Compact, Clean & Highly Readable) */}
      <div 
        ref={bubbleWrapperRef} 
        className="absolute top-0 left-0 will-change-transform"
        style={{ transform: `translate3d(${stateRef.current.x}px, ${stateRef.current.y}px, 0)` }}
      >
        {speech && (
          <div 
            className="absolute -translate-x-1/2 bottom-[115px] sm:bottom-[175px] pointer-events-auto cursor-default animate-fade-in w-[230px] sm:w-[260px] max-w-[calc(100vw-28px)] touch-pan-y"
            role="region"
            aria-live="polite"
            aria-label="Companion dialogue"
          >
            <div className="relative bg-[#121212]/95 border border-border-hover/80 px-3 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-left">
              {/* Minimal header */}
              <div className="flex items-center justify-between gap-1.5 mb-1 pb-1 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_#C8FF00]" />
                  <span className="text-[9px] font-mono uppercase font-bold text-accent tracking-wider">
                    BYTE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-text-muted">OSINT GUIDE</span>
                  <button
                    type="button"
                    onClick={() => setSpeech(null)}
                    aria-label="Dismiss speech bubble"
                    className="text-text-muted hover:text-text-primary text-[11px] leading-none px-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Highly Readable Dialogue Body: Clean sans font with optimal line-height */}
              <div className="font-sans text-[11px] sm:text-xs leading-snug text-text-primary tracking-normal font-normal">
                <TypewriterText text={speech} onComplete={onTypingComplete} speed={12} />
                {!isTyping && <span className="animate-pulse ml-0.5 text-accent font-bold">_</span>}
              </div>

              {/* Speech bubble pointer beak */}
              <div 
                ref={beakRef}
                className="absolute -bottom-1 left-1/2 w-2.5 h-2.5 bg-[#121212] border-b border-r border-border-hover/80 rotate-45 transition-transform duration-75" 
              />
            </div>
          </div>
        )}

        {/* Clickable interactive hotspot around the companion */}
        <button
          type="button"
          onClick={handleSpriteClick}
          className="absolute -translate-x-1/2 bottom-0 w-[80px] sm:w-[110px] h-[130px] sm:h-[190px] pointer-events-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus:outline-none touch-pan-y"
          title="Click to interact with companion"
          aria-label="Interactive digital companion"
        />
      </div>
    </aside>
  );
}
