import { useEffect, useRef, useState } from 'react';
import { OrbitEngine } from '../../canvas/OrbitEngine';
import { Vector2D } from '../../lib/math';
import { Icon } from '@iconify/react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<OrbitEngine | null>(null);
  const [bodies, setBodies] = useState<any[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const orbit = new OrbitEngine();
    engineRef.current = orbit;
    setBodies(orbit.bodies.map(b => b.config));

    let mousePos: Vector2D | null = null;
    let mouseActive = false;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      orbit.resize(window.innerWidth, window.innerHeight);
    };

    const onMove = (e: MouseEvent) => { mousePos = new Vector2D(e.clientX, e.clientY); mouseActive = true; };
    const onLeave = () => { mouseActive = false; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    handleResize();

    const render = (time: number) => {
      // If reduced motion, stop the clock
      const dt = prefersReducedMotion ? 0 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbit.update(dt, mousePos, mouseActive);
      orbit.render(ctx);

      if (overlayRef.current) {
        const nodes = overlayRef.current.children;
        for (let i = 0; i < orbit.bodies.length; i++) {
          const body = orbit.bodies[i];
          const node = nodes[i] as HTMLElement;
          if (node) {
            node.style.transform = `translate(calc(${body.position.x}px - 50%), calc(${body.position.y}px - 50%))`;
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    
    // Initial render even if paused
    render(performance.now());
    
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-10" style={{ touchAction: 'none' }} />
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-20 origin-top-left">
        {bodies.map(body => (
          <div key={body.id} className="absolute top-0 left-0 flex flex-col items-center will-change-transform group cursor-default">
            {/* Monochrome icons default, accent on hover */}
            <div className="flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-[1.3] text-text-secondary hover:text-accent drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_15px_rgba(200,255,0,0.4)]">
              <Icon icon={body.icon} className="w-8 h-8" />
            </div>
            <span className="mt-2 text-[10px] font-mono text-text-muted bg-bg-primary/95 backdrop-blur px-2 py-0.5 border border-border-subtle pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {body.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
