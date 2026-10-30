import { OrbitBody, OrbitBodyConfig } from './OrbitBody';
import { Vector2D } from '../lib/math';

export class OrbitEngine {
  bodies: OrbitBody[] = [];
  leftCenter: Vector2D = new Vector2D(0, 0);
  rightCenter: Vector2D = new Vector2D(0, 0);
  currentScale: number = 1.0;
  
  constructor() {
    this.initBodies();
  }

  initBodies() {
    const createRing = (
      galaxy: 'left' | 'right',
      ringIndex: number,
      tilt: number,
      speed: number,
      items: { id: string; label: string; icon: string; color: string }[]
    ): OrbitBodyConfig[] => {
      // Radius progression for each galaxy cluster (fitted safely within margins)
      const baseRadius = 105 + ringIndex * 46;
      return items.map((item, i) => ({
        ...item,
        semiMajor: baseRadius,
        semiMinor: baseRadius * 0.62,
        inclination: tilt,
        angularVelocity: speed,
        phase: (Math.PI * 2 / items.length) * i,
        size: 32,
        galaxy,
        ringIndex,
      }));
    };

    // ── LEFT GALAXY: Cybersecurity, Defense & Infrastructure ──
    // Ring 0: Core Foundation (3 items)
    const leftRing0 = createRing('left', 0, 0.18, 0.22, [
      { id: 'linux-sec', label: 'Linux Security', icon: 'logos:linux-tux', color: '#FCC624' },
      { id: 'wazuh', label: 'Wazuh SIEM', icon: 'simple-icons:wazuh', color: '#00A3E0' },
      { id: 'wireshark', label: 'Wireshark', icon: 'simple-icons:wireshark', color: '#1679A7' },
    ]);

    // Ring 1: Offensive & Assessment (4 items)
    const leftRing1 = createRing('left', 1, -0.14, -0.16, [
      { id: 'kali', label: 'Kali Linux', icon: 'simple-icons:kalilinux', color: '#00D2FF' },
      { id: 'burp', label: 'Burp Suite', icon: 'simple-icons:burpsuite', color: '#FF6633' },
      { id: 'nmap', label: 'Nmap Scanner', icon: 'mdi:radar', color: '#38BDF8' },
      { id: 'nuclei', label: 'Nuclei Vuln Scanning', icon: 'mdi:atom', color: '#A855F7' },
    ]);

    // Ring 2: Hardening & Cloud Infrastructure (3 items)
    const leftRing2 = createRing('left', 2, 0.10, 0.12, [
      { id: 'mitre', label: 'MITRE ATT&CK', icon: 'mdi:shield-search', color: '#EF4444' },
      { id: 'docker', label: 'Docker Hardening', icon: 'logos:docker-icon', color: '#2496ED' },
      { id: 'aws', label: 'AWS Cloud Security', icon: 'logos:aws', color: '#FF9900' },
    ]);

    // ── RIGHT GALAXY: Software Systems, Data & AI ──
    // Ring 0: Modern Web & Systems (3 items)
    const rightRing0 = createRing('right', 0, -0.18, -0.22, [
      { id: 'python', label: 'Python Systems', icon: 'logos:python', color: '#3776AB' },
      { id: 'react', label: 'React Frontend', icon: 'logos:react', color: '#61DAFB' },
      { id: 'ts', label: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' },
    ]);

    // Ring 1: Backend, DB & Observability (4 items)
    const rightRing1 = createRing('right', 1, 0.14, 0.16, [
      { id: 'node', label: 'Node.js Backend', icon: 'logos:nodejs-icon', color: '#5FA04E' },
      { id: 'postgres', label: 'PostgreSQL DB', icon: 'logos:postgresql', color: '#4169E1' },
      { id: 'git', label: 'GitOps & CI/CD', icon: 'logos:git-icon', color: '#F05032' },
      { id: 'grafana', label: 'Grafana Telemetry', icon: 'logos:grafana', color: '#F47E20' },
    ]);

    // Ring 2: Artificial Intelligence & Automation (3 items)
    const rightRing2 = createRing('right', 2, -0.10, -0.12, [
      { id: 'ollama', label: 'Ollama Local LLMs', icon: 'simple-icons:ollama', color: '#F8FAFC' },
      { id: 'llms', label: 'Local LLM Reasoning', icon: 'mdi:brain', color: '#EC4899' },
      { id: 'agents', label: 'Autonomous Agents', icon: 'mdi:robot', color: '#10B981' },
    ]);

    this.bodies = [
      ...leftRing0, ...leftRing1, ...leftRing2,
      ...rightRing0, ...rightRing1, ...rightRing2
    ].map(c => new OrbitBody(c));
  }

  resize(width: number, height: number) {
    if (width >= 1280) {
      // Large screens: place clearly in left and right wings with generous margin
      this.leftCenter = new Vector2D(Math.max(210, width * 0.18), height * 0.52);
      this.rightCenter = new Vector2D(Math.min(width - 210, width * 0.82), height * 0.52);
      this.scaleOrbits(0.95);
    } else if (width >= 1024) {
      // Standard desktop: keep well inside margins
      this.leftCenter = new Vector2D(Math.max(190, width * 0.19), height * 0.52);
      this.rightCenter = new Vector2D(Math.min(width - 190, width * 0.81), height * 0.52);
      this.scaleOrbits(0.78);
    } else if (width >= 768) {
      // Tablet: tighter margins
      this.leftCenter = new Vector2D(width * 0.16, height * 0.52);
      this.rightCenter = new Vector2D(width * 0.84, height * 0.52);
      this.scaleOrbits(0.68);
    } else {
      // Mobile (< 768px): position above and below the central text reading zone
      this.leftCenter = new Vector2D(width * 0.18, height * 0.18);
      this.rightCenter = new Vector2D(width * 0.82, height * 0.82);
      this.scaleOrbits(0.40);
    }

    // Immediately snap positions to centers on initial layout
    for (const body of this.bodies) {
      const center = body.config.galaxy === 'left' ? this.leftCenter : this.rightCenter;
      body.initPosition(center);
    }
  }

  scaleOrbits(scale: number) {
    this.currentScale = scale;
    for (const body of this.bodies) {
      body.setScale(scale);
    }
  }

  update(dt: number, mousePos: Vector2D | null, mouseActive: boolean) {
    for (const body of this.bodies) {
      const center = body.config.galaxy === 'left' ? this.leftCenter : this.rightCenter;
      body.update(dt, center, mousePos, mouseActive);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Refined, glowing orbital tracks for each ring (clean vector lines without gradient artifacts)
    ctx.lineWidth = 1;
    const drawnRings = new Set<string>();
    
    for (const body of this.bodies) {
      const center = body.config.galaxy === 'left' ? this.leftCenter : this.rightCenter;
      const key = `${body.config.galaxy}-${body.config.ringIndex}`;
      if (drawnRings.has(key)) continue;
      drawnRings.add(key);

      const isLeft = body.config.galaxy === 'left';
      ctx.strokeStyle = isLeft ? 'rgba(0, 210, 255, 0.07)' : 'rgba(168, 85, 247, 0.07)';
      ctx.setLineDash([3, 6]);
      
      ctx.beginPath();
      for (let i = 0; i <= Math.PI * 2; i += 0.05) {
        const xBase = body.config.semiMajor * Math.cos(i);
        const yBase = body.config.semiMinor * Math.sin(i);
        const phi = body.config.inclination;
        const xRot = xBase * Math.cos(phi) - yBase * Math.sin(phi);
        const yRot = xBase * Math.sin(phi) + yBase * Math.cos(phi);
        if (i === 0) ctx.moveTo(center.x + xRot, center.y + yRot);
        else ctx.lineTo(center.x + xRot, center.y + yRot);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
}
