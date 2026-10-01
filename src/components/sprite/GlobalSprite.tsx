import { useEffect, useRef, useState } from 'react';
import { SpriteEngine } from '../../canvas/SpriteEngine';
import TypewriterText from '../hero/TypewriterText';

export default function GlobalSprite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SpriteEngine | null>(null);
  
  const [spritePos, setSpritePos] = useState({ x: -200, y: 0 }); 
  const [speech, setSpeech] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const stateRef = useRef({
    x: -200,
    targetX: 300,
    y: window.innerHeight - 20,
    mode: 'TOUR_GUIDE' as 'TOUR_GUIDE' | 'IDLE' | 'WANDER' | 'FLEE',
    tourStep: 0,
    pauseTimer: 0,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
  });

  const tourLines = [
    { state: 'WAVE' as const, text: "Hey! Want to see what I've been building?" },
    { state: 'TALK' as const, text: "I'm the digital companion here. I investigate problems, build solutions, and occasionally run from mouse pointers." },
    { state: 'THINK' as const, text: "Scroll down to explore projects, research, and the journey so far. Or hover over the orbits to see what I'm currently exploring." },
    { state: 'THUMBS_UP' as const, text: "Enjoy exploring!" },
  ];

  const executeTourStep = () => {
    if (!engineRef.current) return;
    const s = stateRef.current;
    if (s.tourStep >= tourLines.length) {
      s.mode = 'IDLE';
      s.pauseTimer = 3;
      return;
    }
    const step = tourLines[s.tourStep];
    engineRef.current.setState(step.state);
    setSpeech(step.text);
    setIsTyping(true);
    s.tourStep++;
  };

  const onTypingComplete = () => {
    setIsTyping(false);
    setTimeout(() => {
      if (stateRef.current.mode === 'TOUR_GUIDE') {
        executeTourStep();
      } else {
        setSpeech(null);
        engineRef.current?.setState('IDLE_FRONT');
      }
    }, 2500);
  };

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

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; stateRef.current.y = window.innerHeight - 20; };
    const handleMouseMove = (e: MouseEvent) => { stateRef.current.mouseX = e.clientX; stateRef.current.mouseY = e.clientY; };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    setTimeout(() => { 
      stateRef.current.x = window.innerWidth / 2; 
      if (!prefersReducedMotion) executeTourStep(); 
    }, 2000);

    const render = (time: number) => {
      const dt = prefersReducedMotion ? 0 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = stateRef.current;
      const w = window.innerWidth;

      if (!prefersReducedMotion && s.mode !== 'TOUR_GUIDE') {
        s.pauseTimer -= dt;
        const distToMouse = Math.abs(s.mouseX - s.x);
        const mouseNearBottom = s.mouseY > window.innerHeight - 200;

        if (mouseNearBottom && distToMouse < 120 && s.mode !== 'FLEE' && !isTyping) {
          s.mode = 'FLEE';
          s.targetX = s.x + (s.x > s.mouseX ? 350 : -350);
          s.targetX = Math.max(80, Math.min(w - 80, s.targetX));
        }

        if (s.mode === 'FLEE') {
          const diff = s.targetX - s.x;
          if (Math.abs(diff) < 15) { s.mode = 'IDLE'; s.pauseTimer = 2.5; sprite.setState('IDLE_FRONT'); }
          else { s.x += Math.sign(diff) * 450 * dt; sprite.setState(diff > 0 ? 'RUN_RIGHT' : 'RUN_LEFT'); }
        } else if (s.pauseTimer <= 0 && !isTyping) {
          const r = Math.random();
          // Waypoint based wandering instead of random
          if (r < 0.3) { s.mode = 'WANDER'; s.targetX = w * 0.2; } // Left
          else if (r < 0.6) { s.mode = 'WANDER'; s.targetX = w * 0.8; } // Right
          else if (r < 0.8) { s.mode = 'WANDER'; s.targetX = w * 0.5; } // Center
          else { s.mode = 'IDLE'; s.pauseTimer = Math.random() * 4 + 2; sprite.setState('IDLE_FRONT'); }
        }

        if (s.mode === 'WANDER') {
          const diff = s.targetX - s.x;
          if (Math.abs(diff) > 10) { s.x += Math.sign(diff) * 120 * dt; if (!isTyping) sprite.setState(diff > 0 ? 'WALK_RIGHT' : 'WALK_LEFT'); }
          else { s.mode = 'IDLE'; s.pauseTimer = Math.random() * 3 + 1.5; if (!isTyping) sprite.setState('IDLE_FRONT'); }
        }
      }

      s.x = Math.max(60, Math.min(w - 60, s.x));
      
      // Update animation frames
      sprite.update(dt);
      
      // Draw sprite
      sprite.render(ctx, s.x, s.y);
      setSpritePos({ x: s.x, y: s.y });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render(performance.now());
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute flex flex-col items-center" style={{ left: spritePos.x, top: spritePos.y, transform: 'translateX(-50%)' }}>
        {speech && (
          <div className="absolute bottom-[280px] bg-bg-secondary border border-border-subtle p-4 shadow-2xl max-w-[280px] w-max pointer-events-auto">
            <p className="font-mono text-xs leading-relaxed text-text-primary">
              <TypewriterText text={speech} onComplete={onTypingComplete} />
              {!isTyping && <span className="animate-pulse ml-1 text-accent">_</span>}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-secondary border-b border-r border-border-subtle transform rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}
