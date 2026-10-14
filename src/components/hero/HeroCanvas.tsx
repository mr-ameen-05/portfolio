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
    let lastTime = 0;
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      orbit.resize(window.innerWidth, window.innerHeight);
    };

    const onMove = (e: MouseEvent) => { mousePos = new Vector2D(e.clientX, e.clientY); mouseActive = true; };
    const onLeave = () => { mouseActive = false; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    handleResize();

    const render = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = prefersReducedMotion ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      
      // Cleanly clear full device pixel canvas
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      orbit.update(dt, mousePos, mouseActive);
      orbit.render(ctx);

      if (overlayRef.current) {
        const nodes = overlayRef.current.children;
        for (let i = 0; i < orbit.bodies.length; i++) {
          const body = orbit.bodies[i];
          const node = nodes[i] as HTMLElement;
          if (node) {
            node.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`;
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    // Exactly one single rendering loop
    animationFrameId = requestAnimationFrame(render);

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
          <div key={body.id} className="absolute top-0 left-0 flex flex-col items-center will-change-transform group cursor-pointer pointer-events-auto">
            {/* Natural icon shape with silhouette drop-shadow - NO square box */}
            <div 
              className="flex items-center justify-center transition-transform duration-200 hover:scale-[1.35] cursor-pointer"
              style={{
                color: body.color,
                filter: `drop-shadow(0 0 8px ${body.color}80) drop-shadow(0 0 16px ${body.color}40)`,
              }}
            >
              <Icon icon={body.icon} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
            </div>
            <span 
              className="mt-2 text-[10px] font-mono font-medium text-text-primary bg-bg-secondary/95 backdrop-blur-md px-2.5 py-0.5 border rounded pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 shadow-2xl z-30"
              style={{
                borderColor: `${body.color}88`,
                boxShadow: `0 4px 16px ${body.color}25`,
              }}
            >
              {body.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
