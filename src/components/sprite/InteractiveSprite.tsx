import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedOSINT } from '../../hooks/useAdvancedOSINT';
import { useClientOSINT } from '../../hooks/useClientOSINT';

export type SpriteState = 'falling' | 'landing_impact' | 'idle' | 'walking' | 'talking' | 'disappearing';

interface DialogueItem {
  text: string;
  badge?: string;
}

export const InteractiveSprite: React.FC = () => {
  const location = useLocation();
  const advancedOsint = useAdvancedOSINT();
  const clientOsint = useClientOSINT();

  // Live network/geo telemetry state
  const [networkInfo, setNetworkInfo] = useState<{ ip?: string; location?: string; isp?: string } | null>(null);

  // Fetch real IP and geo location on load
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch('https://ipwho.is/', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        if (data && data.success) {
          const loc = [data.city, data.region, data.country].filter(Boolean).join(', ') + 
            (data.flag?.emoji ? ` ${data.flag.emoji}` : '');
          setNetworkInfo({
            ip: data.ip,
            location: loc,
            isp: data.connection?.isp || data.connection?.org,
          });
        }
      })
      .catch(() => {});

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // Screen coordinates (anchored across viewport, keeping within safe bottom bounds)
  const [posX, setPosX] = useState<number>(() => {
    return typeof window !== 'undefined' ? Math.max(window.innerWidth - 240, 60) : 400;
  });
  const [facingRight, setFacingRight] = useState(false);

  // States: falling -> landing_impact -> idle / walking / talking / disappearing
  const [currentState, setCurrentState] = useState<SpriteState>('falling');
  const [frameIndex, setFrameIndex] = useState(0);

  // Dialogue state
  const [currentDialogue, setCurrentDialogue] = useState<DialogueItem | null>(null);
  const [dialogueQueue, setDialogueQueue] = useState<DialogueItem[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  // Scroll disappear tracking
  const [isScrolledAway, setIsScrolledAway] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timeouts & refs
  const wanderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evadeCooldownRef = useRef<boolean>(false);

  const posXRef = useRef(posX);
  posXRef.current = posX;

  const currentStateRef = useRef(currentState);
  currentStateRef.current = currentState;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // 1. Preload sprite sheets
  useEffect(() => {
    const urls = ['/sprites/actions.png', '/sprites/pose.png', '/sprites/running.png'];
    urls.forEach(url => {
      if (!loadedImagesRef.current[url]) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedImagesRef.current[url] = img;
        };
      }
    });
  }, []);

  // 2. Frame Management for each state
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (currentState === 'walking') {
      // 4-frame run cycle from running.png at ~10 FPS
      timer = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % 4);
      }, 100);
    } else if (currentState === 'talking') {
      // Hand gestures from actions.png at ~5 FPS
      timer = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % 4);
      }, 200);
    } else if (currentState === 'idle') {
      // Always front-facing Pose.png Frame 0
      setFrameIndex(0);
    } else if (currentState === 'landing_impact') {
      // Actions.png Frame 2
      setFrameIndex(2);
    } else if (currentState === 'falling') {
      // Pose.png Frame 0
      setFrameIndex(0);
    } else if (currentState === 'disappearing') {
      // Duck pose Actions.png Frame 3
      setFrameIndex(3);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentState]);

  // 3. Pixel-perfect Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sheetUrl = '/sprites/pose.png';
    let sheetHeight = 381;

    if (currentState === 'walking') {
      sheetUrl = '/sprites/running.png';
      sheetHeight = 396;
    } else if (currentState === 'talking' || currentState === 'landing_impact' || currentState === 'disappearing') {
      sheetUrl = '/sprites/actions.png';
      sheetHeight = 381;
    }

    const frameWidth = 216;
    canvas.width = frameWidth;
    canvas.height = sheetHeight;

    ctx.clearRect(0, 0, frameWidth, sheetHeight);
    ctx.imageSmoothingEnabled = false;

    const img = loadedImagesRef.current[sheetUrl];
    if (img && img.complete) {
      ctx.drawImage(
        img,
        frameIndex * frameWidth,
        0,
        frameWidth,
        sheetHeight,
        0,
        0,
        frameWidth,
        sheetHeight
      );
    } else {
      const fallback = new Image();
      fallback.src = sheetUrl;
      fallback.onload = () => {
        loadedImagesRef.current[sheetUrl] = fallback;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          fallback,
          frameIndex * frameWidth,
          0,
          frameWidth,
          sheetHeight,
          0,
          0,
          frameWidth,
          sheetHeight
        );
      };
    }
  }, [currentState, frameIndex]);

  // Calculate safe X boundaries
  const getSafeBounds = useCallback(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const spriteW = width < 640 ? 80 : 110;
    return {
      minX: 60,
      maxX: Math.max(width - spriteW - 120, 100),
    };
  }, []);

  // 4. Smooth Walking between screen positions
  const walkTo = useCallback((targetX: number, onArrival?: () => void) => {
    const bounds = getSafeBounds();
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));
    const currentX = posXRef.current;
    const distance = Math.abs(clampedX - currentX);

    if (distance < 20) {
      if (onArrival) onArrival();
      return;
    }

    // Determine direction and speed
    const isMovingRight = clampedX > currentX;
    setFacingRight(isMovingRight);
    setCurrentState('walking');

    // Smooth walking speed: ~120px per second (feels calm and natural)
    const walkDuration = Math.min(Math.max(distance / 120, 0.8), 3.5);

    setPosX(clampedX);

    if (walkDurationTimerRef.current) clearTimeout(walkDurationTimerRef.current);
    walkDurationTimerRef.current = setTimeout(() => {
      // Arrived at destination: stop cleanly on front-facing idle
      setCurrentState('idle');
      if (onArrival) onArrival();
    }, walkDuration * 1000);
  }, [getSafeBounds]);

  // 5. Short, Focused Dialogue System
  const advanceDialogue = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    if (dialogueIndex + 1 < dialogueQueue.length) {
      const nextIdx = dialogueIndex + 1;
      setDialogueIndex(nextIdx);
      setCurrentDialogue(dialogueQueue[nextIdx]);
      setCurrentState('talking');

      // Talk for 2.2s, then return to front-facing idle
      setTimeout(() => {
        if (currentStateRef.current === 'talking') setCurrentState('idle');
      }, 2200);
    } else {
      // Finished queue: hide bubble, return to idle
      setIsBubbleVisible(false);
      setCurrentDialogue(null);
      setCurrentState('idle');
    }
  }, [dialogueIndex, dialogueQueue]);

  // Auto-advance dialogue step after readable pause (4.5s)
  useEffect(() => {
    if (isBubbleVisible && currentDialogue && dialogueIndex < dialogueQueue.length - 1) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceDialogue();
      }, 4500);

      return () => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      };
    } else if (isBubbleVisible && dialogueIndex >= dialogueQueue.length - 1) {
      // Final message lingers for 4.5s then hides
      autoAdvanceTimerRef.current = setTimeout(() => {
        setIsBubbleVisible(false);
      }, 4500);

      return () => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      };
    }
  }, [isBubbleVisible, currentDialogue, dialogueIndex, dialogueQueue, advanceDialogue]);

  // Queue and start a dialogue sequence
  const playDialogueSequence = useCallback((items: DialogueItem[]) => {
    if (items.length === 0) return;
    setDialogueQueue(items);
    setDialogueIndex(0);
    setCurrentDialogue(items[0]);
    setIsBubbleVisible(true);
    setCurrentState('talking');

    setTimeout(() => {
      if (currentStateRef.current === 'talking') setCurrentState('idle');
    }, 2200);
  }, []);

  // 6. Direct OSINT Dialogue Knowledge Base
  const getDirectOsintDialogues = useCallback((): DialogueItem[] => {
    const isCourse = location.pathname.startsWith('/courses');
    const gpu = advancedOsint?.gpu || clientOsint?.gpu;
    const cleanGpu = gpu ? gpu.replace(/ANGLE \(|Direct3D.*|\(TM\)|\(R\)/gi, '').trim() : 'Integrated Graphics';
    const os = advancedOsint?.os || clientOsint?.platform || 'Unknown OS';
    const browser = advancedOsint?.browser || 'Modern Browser';
    const loc = networkInfo?.location || advancedOsint?.locationGuess || 'your current timezone';
    const ip = networkInfo?.ip || '127.0.0.1';
    const isp = networkInfo?.isp ? ` via ${networkInfo.isp}` : '';

    if (isCourse) {
      return [
        { badge: 'SURVEILLANCE', text: `Target confirmed: IP ${ip} connecting from ${loc}.` },
        { badge: 'SYS_RECON', text: `You are running ${browser} on ${os} powered by ${cleanGpu}.` },
        { badge: 'SECURITY', text: "The internet is not safe with or without security. All course labs here are contained." },
      ];
    }

    return [
      { badge: 'I SEE YOU', text: `I see you, traveler. Connected from ${loc} (IP: ${ip}${isp}).` },
      { badge: 'TELEMETRY', text: `Your browser is ${browser} on ${os}. Your GPU leaked right to me: ${cleanGpu}.` },
      { badge: 'SECURITY DIRECTIVE', text: "The internet isn't safe by default—with or without perimeter tools. Explore Ameen's defenses below." },
    ];
  }, [location.pathname, advancedOsint, clientOsint, networkInfo]);

  const getRandomIdleSpeech = useCallback((): DialogueItem => {
    const gpu = advancedOsint?.gpu || clientOsint?.gpu;
    const cleanGpu = gpu ? gpu.replace(/ANGLE \(|Direct3D.*|\(TM\)|\(R\)/gi, '').trim() : 'Graphics Card';
    const os = advancedOsint?.os || clientOsint?.platform || 'OS';
    const browser = advancedOsint?.browser || 'Browser';
    const loc = networkInfo?.location || advancedOsint?.locationGuess || 'Planet Earth';
    const ip = networkInfo?.ip;

    const pool: DialogueItem[] = [
      { badge: 'LIVE_OSINT', text: `Still watching: ${browser} on ${os}. I track every socket.` },
      { badge: 'GPU_LEAK', text: `Running ${cleanGpu}? WebGL disclosed that in 4 milliseconds.` },
      { badge: 'SECURITY', text: "The internet is not safe by default. Defense-in-depth is mandatory." },
      { badge: 'INTEL', text: "Check out the 11-module Practical Cybersecurity Course in the top nav!" },
    ];

    if (ip) {
      pool.push({ badge: 'IP_PROBE', text: `Broadcasting from ${ip} (${loc}). Masking your IP is step 1.` });
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }, [advancedOsint, clientOsint, networkInfo]);

  // 7. Calm Autonomous Wandering Scheduler
  useEffect(() => {
    const scheduleNextWander = () => {
      // Wander pause between 8 to 16 seconds
      const delay = Math.floor(Math.random() * 8000) + 8000;

      wanderTimeoutRef.current = setTimeout(() => {
        // Only wander if strictly idle (not landing, not speaking, not fleeing, not scrolled away)
        if (
          currentStateRef.current === 'idle' &&
          !isBubbleVisible &&
          !isScrolledAway
        ) {
          const bounds = getSafeBounds();
          // Pick a random target between minX and maxX
          const nextTarget = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
          walkTo(nextTarget, () => {
            // Chance to say a single brief thought when resting
            if (Math.random() < 0.35 && !isBubbleVisible) {
              const tip = getRandomIdleSpeech();
              playDialogueSequence([tip]);
            }
          });
        }
        scheduleNextWander();
      }, delay);
    };

    scheduleNextWander();

    return () => {
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current);
    };
  }, [walkTo, getSafeBounds, isBubbleVisible, isScrolledAway, getRandomIdleSpeech, playDialogueSequence]);

  // 8. Mouse Pointer Avoidance (Mouse Hover Only, not touch)
  useEffect(() => {
    // Only register pointermove if device has a fine pointer (mouse), not touchscreen
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (
        evadeCooldownRef.current ||
        currentStateRef.current === 'falling' ||
        currentStateRef.current === 'landing_impact' ||
        currentStateRef.current === 'disappearing'
      ) {
        return;
      }

      const spriteEl = canvasRef.current;
      if (!spriteEl) return;

      const rect = spriteEl.getBoundingClientRect();
      const spriteCenterX = rect.left + rect.width / 2;
      const spriteCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - spriteCenterX, e.clientY - spriteCenterY);

      // If pointer comes within 70px of the sprite center, hop/evade away!
      if (dist < 70) {
        evadeCooldownRef.current = true;
        const bounds = getSafeBounds();
        const pointerIsOnRight = e.clientX > spriteCenterX;

        // Walk away from the pointer
        let escapeTarget = pointerIsOnRight
          ? posXRef.current - (120 + Math.random() * 80)
          : posXRef.current + (120 + Math.random() * 80);

        // Clamp or bounce if hitting edge
        if (escapeTarget < bounds.minX) {
          escapeTarget = bounds.minX + 80;
        } else if (escapeTarget > bounds.maxX) {
          escapeTarget = bounds.maxX - 80;
        }

        walkTo(escapeTarget, () => {
          setTimeout(() => {
            evadeCooldownRef.current = false;
          }, 1200);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [walkTo, getSafeBounds]);

  // 9. Initial Landing Sequence & Short Greeting
  useEffect(() => {
    // Start above viewport
    setCurrentState('falling');
    setIsBubbleVisible(false);

    // Initial landing position cleanly in the lower-right area (not squeezed into the corner)
    const bounds = getSafeBounds();
    setPosX(Math.max(bounds.maxX - 80, bounds.minX));
    setFacingRight(false);

    // Fall animation duration (~750ms)
    const impactTimer = setTimeout(() => {
      setCurrentState('landing_impact');

      // Settle into front-facing idle
      setTimeout(() => {
        setCurrentState('idle');

        // Trigger direct OSINT sequence revealing everything the sprite knows
        const dialogues = getDirectOsintDialogues();
        playDialogueSequence(dialogues);
      }, 350);
    }, 750);

    return () => {
      clearTimeout(impactTimer);
      if (walkDurationTimerRef.current) clearTimeout(walkDurationTimerRef.current);
    };
  }, [location.pathname, getSafeBounds, playDialogueSequence, getDirectOsintDialogues]);

  // 10. Rapid Scroll Exit and Re-entry
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const speed = Math.abs(currentY - lastScrollY.current);

      if (speed > 35 && currentStateRef.current !== 'disappearing') {
        setIsScrolledAway(true);
        setCurrentState('disappearing');
        setIsBubbleVisible(false);
      }

      lastScrollY.current = currentY;

      if (scrollDebounceTimer.current) clearTimeout(scrollDebounceTimer.current);
      scrollDebounceTimer.current = setTimeout(() => {
        // User stopped scrolling: return sprite with calm arrival
        setIsScrolledAway(false);
        setCurrentState('idle');
      }, 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollDebounceTimer.current) clearTimeout(scrollDebounceTimer.current);
    };
  }, []);

  return (
    // Fixed viewport container: moves along X coordinate, anchored to bottom
    <motion.div
      animate={{
        x: posX,
        y: currentState === 'falling'
          ? -window.innerHeight - 100
          : currentState === 'landing_impact'
          ? [ -25, 4, 0 ]
          : isScrolledAway
          ? 120 // Full duck below viewport
          : 0,
        opacity: currentState === 'disappearing' || isScrolledAway ? 0 : 1,
      }}
      transition={{
        x: {
          type: 'tween',
          ease: 'linear',
          duration: currentState === 'walking' ? 1.2 : 0.4,
        },
        y: currentState === 'landing_impact'
          ? { duration: 0.35, ease: 'easeOut' }
          : { duration: 0.6, type: 'spring', bounce: 0.2 },
        opacity: { duration: 0.25 },
      }}
      className="fixed bottom-3 sm:bottom-6 left-0 z-50 pointer-events-none select-none flex flex-col items-center"
      style={{ willChange: 'transform' }}
    >
      {/* Dialogue Speech Bubble: Clean, minimal, non-overdesigned rectangle */}
      <AnimatePresence>
        {isBubbleVisible && currentDialogue && !isScrolledAway && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={advanceDialogue}
            className="mb-2 max-w-[220px] sm:max-w-[260px] px-3 py-2 rounded bg-bg-secondary/95 border border-border-subtle shadow-lg pointer-events-auto cursor-pointer relative text-left"
            title="Click to advance"
          >
            {/* Header / Step indicator */}
            <div className="flex items-center justify-between text-[9px] font-mono text-text-muted mb-1 pb-1 border-b border-border-subtle/50">
              <span className="text-accent font-semibold tracking-wider">
                {currentDialogue.badge || 'COMPANION'}
              </span>
              <span>
                {dialogueIndex + 1}/{dialogueQueue.length}
              </span>
            </div>

            {/* Clear, readable line */}
            <p className="text-xs font-mono text-text-primary leading-snug">
              {currentDialogue.text}
            </p>

            {/* Subtle Pointer triangle */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-secondary border-r border-b border-border-subtle rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sprite Live Character (OSINT displayed directly via dialogue bubbles) */}
      <div className="relative pointer-events-none flex items-end">
        
        {/* Character */}
        <div className="relative flex flex-col items-center">
          {/* Contact Shadow on Ground */}
          <div
            className={`transition-all duration-300 rounded-full bg-black/60 blur-[3px] ${
              currentState === 'landing_impact'
                ? 'w-24 h-4 scale-125'
                : currentState === 'walking'
                ? 'w-16 h-2.5'
                : 'w-20 h-3'
            }`}
          />
          <div className="absolute -bottom-0.5 w-14 h-2 bg-accent/20 rounded-full blur-[4px]" />

          {/* Canvas: Flipped based on facing direction */}
          <div
            className={`transition-transform duration-150 transform ${
              facingRight ? 'scale-x-100' : '-scale-x-100'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-16 h-auto sm:w-24 drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)]"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
