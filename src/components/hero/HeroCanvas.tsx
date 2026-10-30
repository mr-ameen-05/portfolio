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
      const isMobile = window.innerWidth < 768;
      // Cap DPR to 1.5 on mobile to avoid rendering gigantic framebuffers on high-density displays
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
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
            // 3D perspective elevation and scale based on orbital z-depth
            const depthScale = 0.88 + (body.z + 1) * 0.12;
            const depthOpacity = 0.72 + (body.z + 1) * 0.14;
            const zIndex = Math.round((body.z + 1) * 20);
            node.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, ${body.z * 35}px) translate(-50%, -50%) scale(${depthScale})`;
            node.style.opacity = `${depthOpacity}`;
            node.style.zIndex = `${zIndex}`;
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-10" style={{ touchAction: 'none' }} />
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-20 origin-top-left" style={{ transformStyle: 'preserve-3d' }}>
        {bodies.map(body => (
          <div key={body.id} className="absolute top-0 left-0 flex flex-col items-center will-change-transform group cursor-pointer pointer-events-none sm:pointer-events-auto">
            {/* 3D Effected Glass Orb Medallion */}
            <div 
              className="icon-3d-orbit w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 cursor-pointer flex items-center justify-center transition-all duration-300"
              style={{
                '--orbit-glow': `${body.color}88`,
                '--orbit-glow-diffuse': `${body.color}35`,
                color: body.color,
              } as React.CSSProperties}
            >
              {/* 3D Elevated Icon Glyph */}
              <div 
                className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 10px ${body.color}90)`,
                }}
              >
                <Icon icon={body.icon} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>

              {/* 3D Bottom ambient specular reflection */}
              <span 
                className="absolute -bottom-1 w-2.5 h-1 rounded-full blur-[1px] opacity-75 pointer-events-none"
                style={{ background: body.color, boxShadow: `0 0 8px ${body.color}` }}
              />
            </div>

            {/* 3D Floating Holographic Label */}
            <span 
              className="mt-2 text-[10px] font-mono font-medium text-text-primary bg-bg-secondary/95 backdrop-blur-md px-3 py-1 border rounded-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 shadow-2xl z-30"
              style={{
                borderColor: `${body.color}99`,
                boxShadow: `0 6px 20px ${body.color}35, 0 10px 25px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.25)`,
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
