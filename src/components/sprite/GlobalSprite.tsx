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
    mode: 'TOUR_GUIDE' as 'TOUR_GUIDE' | 'IDLE' | 'WANDER' | 'FLEE' | 'PORTAL_OUT' | 'SCROLLING' | 'PORTAL_IN',
    tourStep: 0,
    pauseTimer: 0,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    portalAnimTime: 0,
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

    const handleResize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
      stateRef.current.y = window.innerHeight - 20; 
      if (engineRef.current) {
        // Shrink on smaller devices (e.g. mobile ~375px wide -> 56px, desktop 1920 -> 140px)
        engineRef.current.renderWidth = Math.max(70, Math.min(140, window.innerWidth * 0.12));
      }
    };
    const handleMouseMove = (e: MouseEvent) => { stateRef.current.mouseX = e.clientX; stateRef.current.mouseY = e.clientY; };
    
    let scrollTimeout: number | undefined;
    const handleScroll = () => {
      const s = stateRef.current;
      if (s.mode === 'TOUR_GUIDE') {
         s.mode = 'PORTAL_OUT';
         setSpeech(null);
         setIsTyping(false);
      }
      if (s.mode !== 'SCROLLING' && s.mode !== 'PORTAL_OUT') {
        s.mode = 'PORTAL_OUT';
        s.portalAnimTime = 0;
        engineRef.current?.setState('TELEPORT');
        setSpeech(null); // Hide speech when teleporting
      }
      
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        if (stateRef.current.mode === 'SCROLLING' || stateRef.current.mode === 'PORTAL_OUT') {
          stateRef.current.mode = 'PORTAL_IN';
          stateRef.current.portalAnimTime = 0;
          // Set to RUN_FRONT to sprint towards camera
          engineRef.current?.setState('RUN_FRONT');
        }
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleResize();

    setTimeout(() => { 
      if (!prefersReducedMotion) {
        stateRef.current.mode = 'WALK_IN' as any;
        stateRef.current.targetX = window.innerWidth / 2;
        engineRef.current?.setState('WALK_RIGHT');
      } else {
        stateRef.current.x = window.innerWidth / 2;
        executeTourStep();
      }
    }, 1000);

    const renderPortal = (ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, isOut: boolean) => {
       ctx.save();
       // progress goes 0 to 1
       // if isOut, portal opens and swallows (0 to 1)
       // if !isOut, portal opens and spits out (0 to 1)
       const p = isOut ? progress : (1 - progress);
       
       // Draw an elliptical portal on the ground
       ctx.translate(x, y);
       ctx.scale(1, 0.3); // squash into ellipse
       
       const maxRadius = 120;
       // Portal grows, then shrinks
       const radius = isOut ? Math.sin(progress * Math.PI) * maxRadius : Math.sin(progress * Math.PI) * maxRadius;
       
       if (radius > 0) {
         const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
         gradient.addColorStop(0, 'rgba(100, 200, 255, 0.8)');
         gradient.addColorStop(0.5, 'rgba(50, 100, 255, 0.5)');
         gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
         
         ctx.fillStyle = gradient;
         ctx.beginPath();
         ctx.arc(0, 0, radius, 0, Math.PI * 2);
         ctx.fill();
       }
       ctx.restore();
    };

    const render = (time: number) => {
      const dt = prefersReducedMotion ? 0 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = stateRef.current;
      const w = window.innerWidth;

      if (!prefersReducedMotion && s.mode !== 'TOUR_GUIDE') {
        if (s.mode === 'PORTAL_OUT') {
          s.portalAnimTime += dt * 1.5; // speed up animation
          if (s.portalAnimTime >= 1) {
            s.mode = 'SCROLLING';
            s.portalAnimTime = 1;
          }
        } else if (s.mode === 'PORTAL_IN') {
          s.portalAnimTime += dt * 1.5;
          if (s.portalAnimTime >= 1) {
            s.mode = 'IDLE';
            s.pauseTimer = 1;
            sprite.setState('IDLE_FRONT');
          }
        }

        if (s.mode !== 'SCROLLING' && s.mode !== 'PORTAL_OUT' && s.mode !== 'PORTAL_IN') {
          s.pauseTimer -= dt;

          if (s.mode === ('WALK_IN' as any)) {
            const diff = s.targetX - s.x;
            if (Math.abs(diff) > 10) {
              s.x += 150 * dt; 
            } else {
              s.mode = 'TOUR_GUIDE';
              s.x = s.targetX;
              executeTourStep();
            }
          } else {
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
          } // end of WALK_IN else block
        }
      }

      s.x = Math.max(60, Math.min(w - 60, s.x));
      
      // Update animation frames
      sprite.update(dt);
      
      // Render logic
      if (s.mode === 'SCROLLING') {
         // draw nothing
      } else if (s.mode === 'PORTAL_OUT') {
         renderPortal(ctx, s.x, s.y, s.portalAnimTime, true);
         ctx.save();
         // Sprite sinks into the portal
         ctx.translate(0, s.portalAnimTime * 100); 
         // opacity fades out at the end
         sprite.opacity = 1 - Math.pow(s.portalAnimTime, 3);
         // scale down slightly
         ctx.translate(s.x, s.y);
         ctx.scale(1 - s.portalAnimTime * 0.5, 1 - s.portalAnimTime * 0.5);
         ctx.translate(-s.x, -s.y);
         sprite.render(ctx, s.x, s.y);
         ctx.restore();
      } else if (s.mode === 'PORTAL_IN') {
         renderPortal(ctx, s.x, s.y, s.portalAnimTime, false);
         ctx.save();
         
         // Sprint out from far behind
         const scale = 0.1 + s.portalAnimTime * 0.9; 
         // Start higher on the screen for 3D depth, move down to ground level
         const yOff = (1 - s.portalAnimTime) * -150; 
         
         ctx.translate(s.x, s.y + yOff);
         ctx.scale(scale, scale);
         ctx.translate(-s.x, -s.y);
         
         sprite.opacity = Math.min(1, s.portalAnimTime * 4); // Quick fade in
         
         sprite.render(ctx, s.x, s.y);
         ctx.restore();
      } else {
         sprite.opacity = 1;
         sprite.render(ctx, s.x, s.y);
      }

      setSpritePos({ x: s.x, y: s.y });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render(performance.now());
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => { 
      window.removeEventListener('resize', handleResize); 
      window.removeEventListener('mousemove', handleMouseMove); 
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      cancelAnimationFrame(animationFrameId); 
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {speech && stateRef.current.mode !== 'SCROLLING' && stateRef.current.mode !== 'PORTAL_OUT' && (
        <div className="absolute flex flex-col items-center" style={{ left: spritePos.x, top: spritePos.y, transform: 'translateX(-50%)' }}>
          <div className="absolute bottom-[280px] bg-bg-secondary border border-border-subtle p-4 shadow-2xl max-w-[280px] w-max pointer-events-auto">
            <p className="font-mono text-xs leading-relaxed text-text-primary">
              <TypewriterText text={speech} onComplete={onTypingComplete} />
              {!isTyping && <span className="animate-pulse ml-1 text-accent">_</span>}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-secondary border-b border-r border-border-subtle transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
