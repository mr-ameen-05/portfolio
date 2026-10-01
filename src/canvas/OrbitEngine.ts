import { OrbitBody, OrbitBodyConfig } from './OrbitBody';
import { Vector2D } from '../lib/math';

export class OrbitEngine {
  bodies: OrbitBody[] = [];
  centerPos: Vector2D = new Vector2D(0, 0);
  
  constructor() {
    this.initBodies();
  }

  initBodies() {
    const createRing = (
      ringIndex: number,
      tilt: number,
      speed: number,
      items: { id: string, label: string, icon: string }[]
    ): OrbitBodyConfig[] => {
      const baseRadius = 180 + ringIndex * 70;
      return items.map((item, i) => ({
        ...item,
        semiMajor: baseRadius,
        semiMinor: baseRadius * 0.4,
        inclination: tilt,
        angularVelocity: speed,
        phase: (Math.PI * 2 / items.length) * i,
        size: 20, // slightly smaller icons for monochrome
        galaxy: 'left' as const, // Legacy prop
        color: '#000',
        ringIndex,
      }));
    };

    // 5 Domains from blueprint
    const cyber = createRing(0, 0.1, 0.2, [
      { id: 'wazuh', label: 'Wazuh', icon: 'simple-icons:wazuh' },
      { id: 'linux-sec', label: 'Linux Security', icon: 'logos:linux-tux' },
      { id: 'wireshark', label: 'Wireshark', icon: 'simple-icons:wireshark' },
      { id: 'mitre', label: 'MITRE ATT&CK', icon: 'mdi:shield-search' },
    ]);

    const pentest = createRing(1, -0.05, -0.15, [
      { id: 'kali', label: 'Kali Linux', icon: 'simple-icons:kalilinux' },
      { id: 'burp', label: 'Burp Suite', icon: 'mdi:shield-bug' },
      { id: 'nmap', label: 'Nmap', icon: 'mdi:radar' },
      { id: 'nuclei', label: 'Nuclei', icon: 'mdi:atom' },
    ]);

    const software = createRing(2, 0.08, 0.12, [
      { id: 'python', label: 'Python', icon: 'simple-icons:python' },
      { id: 'ts', label: 'TypeScript', icon: 'simple-icons:typescript' },
      { id: 'react', label: 'React', icon: 'simple-icons:react' },
      { id: 'node', label: 'Node.js', icon: 'simple-icons:nodedotjs' },
    ]);

    const ai = createRing(3, -0.12, -0.1, [
      { id: 'ollama', label: 'Ollama', icon: 'mdi:robot-outline' },
      { id: 'llms', label: 'Local LLMs', icon: 'mdi:brain' },
      { id: 'agents', label: 'AI Agents', icon: 'mdi:cog-transfer' },
      { id: 'eval', label: 'Model Eval', icon: 'mdi:chart-bell-curve-cumulative' },
    ]);

    const infra = createRing(4, 0.05, 0.08, [
      { id: 'docker', label: 'Docker', icon: 'simple-icons:docker' },
      { id: 'postgres', label: 'PostgreSQL', icon: 'simple-icons:postgresql' },
      { id: 'git', label: 'GitOps', icon: 'simple-icons:git' },
      { id: 'aws', label: 'AWS', icon: 'simple-icons:amazonaws' },
    ]);

    this.bodies = [
      ...cyber, ...pentest, ...software, ...ai, ...infra
    ].map(c => new OrbitBody(c));
  }

  resize(width: number, height: number) {
    this.centerPos = new Vector2D(width / 2, height / 2);
  }

  update(dt: number, mousePos: Vector2D | null, mouseActive: boolean) {
    for (const body of this.bodies) {
      body.update(dt, this.centerPos, mousePos, mouseActive);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw thin, subtle orbital tracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    const drawnRings = new Set<number>();
    
    for (const body of this.bodies) {
      const ri = (body.config as any).ringIndex as number;
      if (drawnRings.has(ri)) continue;
      drawnRings.add(ri);
      
      ctx.beginPath();
      for (let i = 0; i <= Math.PI * 2; i += 0.05) {
        const xBase = body.config.semiMajor * Math.cos(i);
        const yBase = body.config.semiMinor * Math.sin(i);
        const phi = body.config.inclination;
        const xRot = xBase * Math.cos(phi) - yBase * Math.sin(phi);
        const yRot = xBase * Math.sin(phi) + yBase * Math.cos(phi);
        if (i === 0) ctx.moveTo(this.centerPos.x + xRot, this.centerPos.y + yRot);
        else ctx.lineTo(this.centerPos.x + xRot, this.centerPos.y + yRot);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}
