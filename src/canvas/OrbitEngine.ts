import { OrbitBody, OrbitBodyConfig } from './OrbitBody';
import { Vector2D } from '../lib/math';

export const ALL_TECH_ITEMS = [
  { id: 'linux-sec', label: 'Linux Security', icon: 'logos:linux-tux', color: '#FCC624' },
  { id: 'wazuh', label: 'Wazuh SIEM', icon: 'simple-icons:wazuh', color: '#00A3E0' },
  { id: 'wireshark', label: 'Wireshark', icon: 'simple-icons:wireshark', color: '#1679A7' },
  { id: 'kali', label: 'Kali Linux', icon: 'simple-icons:kalilinux', color: '#00D2FF' },
  { id: 'burp', label: 'Burp Suite', icon: 'simple-icons:burpsuite', color: '#FF6633' },
  { id: 'nmap', label: 'Nmap Scanner', icon: 'mdi:radar', color: '#38BDF8' },
  { id: 'nuclei', label: 'Nuclei Vuln Scanning', icon: 'mdi:atom', color: '#A855F7' },
  { id: 'mitre', label: 'MITRE ATT&CK', icon: 'mdi:shield-search', color: '#EF4444' },
  { id: 'docker', label: 'Docker Hardening', icon: 'logos:docker-icon', color: '#2496ED' },
  { id: 'aws', label: 'AWS Cloud Security', icon: 'logos:aws', color: '#FF9900' },
  { id: 'python', label: 'Python Systems', icon: 'logos:python', color: '#3776AB' },
  { id: 'react', label: 'React Frontend', icon: 'logos:react', color: '#61DAFB' },
  { id: 'ts', label: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' },
  { id: 'node', label: 'Node.js Backend', icon: 'logos:nodejs-icon', color: '#5FA04E' },
  { id: 'postgres', label: 'PostgreSQL DB', icon: 'logos:postgresql', color: '#4169E1' },
  { id: 'git', label: 'GitOps & CI/CD', icon: 'logos:git-icon', color: '#F05032' },
  { id: 'grafana', label: 'Grafana Telemetry', icon: 'logos:grafana', color: '#F47E20' },
  { id: 'ollama', label: 'Ollama Local LLMs', icon: 'simple-icons:ollama', color: '#F8FAFC' },
  { id: 'llms', label: 'Local LLM Reasoning', icon: 'mdi:brain', color: '#EC4899' },
  { id: 'agents', label: 'Autonomous Agents', icon: 'mdi:robot', color: '#10B981' },
];

export class OrbitEngine {
  bodies: OrbitBody[] = [];
  desktopBodies: OrbitBody[] = [];
  mobileBodies: OrbitBody[] = [];

  leftCenter: Vector2D = new Vector2D(0, 0);
  rightCenter: Vector2D = new Vector2D(0, 0);
  centerCenter: Vector2D = new Vector2D(0, 0);
  
  isMobile: boolean = false;
  currentScale: number = 1.0;
  mobileNextSlot: number = 0;
  
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

    // ── LEFT GALAXY (Desktop): Cybersecurity, Defense & Infrastructure ──
    const leftRing0 = createRing('left', 0, 0.18, 0.22, [
      { id: 'linux-sec', label: 'Linux Security', icon: 'logos:linux-tux', color: '#FCC624' },
      { id: 'wazuh', label: 'Wazuh SIEM', icon: 'simple-icons:wazuh', color: '#00A3E0' },
      { id: 'wireshark', label: 'Wireshark', icon: 'simple-icons:wireshark', color: '#1679A7' },
    ]);

    const leftRing1 = createRing('left', 1, -0.14, -0.16, [
      { id: 'kali', label: 'Kali Linux', icon: 'simple-icons:kalilinux', color: '#00D2FF' },
      { id: 'burp', label: 'Burp Suite', icon: 'simple-icons:burpsuite', color: '#FF6633' },
      { id: 'nmap', label: 'Nmap Scanner', icon: 'mdi:radar', color: '#38BDF8' },
      { id: 'nuclei', label: 'Nuclei Vuln Scanning', icon: 'mdi:atom', color: '#A855F7' },
    ]);

    const leftRing2 = createRing('left', 2, 0.10, 0.12, [
      { id: 'mitre', label: 'MITRE ATT&CK', icon: 'mdi:shield-search', color: '#EF4444' },
      { id: 'docker', label: 'Docker Hardening', icon: 'logos:docker-icon', color: '#2496ED' },
      { id: 'aws', label: 'AWS Cloud Security', icon: 'logos:aws', color: '#FF9900' },
    ]);

    // ── RIGHT GALAXY (Desktop): Software Systems, Data & AI ──
    const rightRing0 = createRing('right', 0, -0.18, -0.22, [
      { id: 'python', label: 'Python Systems', icon: 'logos:python', color: '#3776AB' },
      { id: 'react', label: 'React Frontend', icon: 'logos:react', color: '#61DAFB' },
      { id: 'ts', label: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' },
    ]);

    const rightRing1 = createRing('right', 1, 0.14, 0.16, [
      { id: 'node', label: 'Node.js Backend', icon: 'logos:nodejs-icon', color: '#5FA04E' },
      { id: 'postgres', label: 'PostgreSQL DB', icon: 'logos:postgresql', color: '#4169E1' },
      { id: 'git', label: 'GitOps & CI/CD', icon: 'logos:git-icon', color: '#F05032' },
      { id: 'grafana', label: 'Grafana Telemetry', icon: 'logos:grafana', color: '#F47E20' },
    ]);

    const rightRing2 = createRing('right', 2, -0.10, -0.12, [
      { id: 'ollama', label: 'Ollama Local LLMs', icon: 'simple-icons:ollama', color: '#F8FAFC' },
      { id: 'llms', label: 'Local LLM Reasoning', icon: 'mdi:brain', color: '#EC4899' },
      { id: 'agents', label: 'Autonomous Agents', icon: 'mdi:robot', color: '#10B981' },
    ]);

    this.desktopBodies = [
      ...leftRing0, ...leftRing1, ...leftRing2,
      ...rightRing0, ...rightRing1, ...rightRing2
    ].map(c => new OrbitBody(c));

    // ── MOBILE INVISIBLE ORBIT: 4 Active Representative Slots ──
    // Initially loaded with 4 distinct tools; dynamically and randomly cycles through all tools
    const initialMobile = [
      { id: 'm-linux', label: 'Linux Security', icon: 'logos:linux-tux', color: '#FCC624' },
      { id: 'm-react', label: 'React Systems', icon: 'logos:react', color: '#61DAFB' },
      { id: 'm-docker', label: 'Docker Hardening', icon: 'logos:docker-icon', color: '#2496ED' },
      { id: 'm-agents', label: 'AI Agents', icon: 'mdi:robot', color: '#10B981' },
    ];

    const mobileRadius = 66;
    this.mobileBodies = initialMobile.map((item, i) => new OrbitBody({
      ...item,
      semiMajor: mobileRadius,
      semiMinor: mobileRadius * 0.40,
      inclination: -0.05,
      angularVelocity: 0.36,
      phase: (Math.PI * 2 / initialMobile.length) * i,
      size: 28,
      galaxy: 'center',
      ringIndex: 0,
    }));

    // Default to desktop bodies
    this.bodies = this.desktopBodies;
  }

  // Cycles one of the 4 mobile logos to another random logo from the entire catalog
  cycleRandomMobileItem(): OrbitBodyConfig[] | null {
    if (!this.isMobile || this.mobileBodies.length === 0) return null;

    // Pick slot in round-robin sequence so all 4 orbs refresh evenly
    const slotIdx = this.mobileNextSlot % this.mobileBodies.length;
    this.mobileNextSlot++;

    // Collect currently visible icon identifiers
    const currentIcons = new Set(this.mobileBodies.map(b => b.config.icon));

    // Get all candidate icons not currently visible
    const availablePool = ALL_TECH_ITEMS.filter(item => !currentIcons.has(item.icon));
    if (availablePool.length === 0) return null;

    // Pick random item from pool
    const randomChoice = availablePool[Math.floor(Math.random() * availablePool.length)];

    // Morph the selected body's config smoothly
    const targetBody = this.mobileBodies[slotIdx];
    targetBody.config.id = `m-${randomChoice.id}`;
    targetBody.config.label = randomChoice.label;
    targetBody.config.icon = randomChoice.icon;
    targetBody.config.color = randomChoice.color;

    return this.mobileBodies.map(b => ({ ...b.config }));
  }

  resize(width: number, height: number, isMobile: boolean = false, mobileAnchorY?: number | null) {
    this.isMobile = isMobile;
    this.bodies = isMobile ? this.mobileBodies : this.desktopBodies;

    if (isMobile) {
      // Mobile (< 768px): Centered single halo positioned directly on top of AL AMEEN N R
      const anchorY = mobileAnchorY ?? Math.max(85, height * 0.16);
      this.centerCenter = new Vector2D(width * 0.5, anchorY);
      
      // Adaptively scale mobile halo slightly based on phone viewport width
      const scale = Math.min(1.1, Math.max(0.85, width / 390));
      this.scaleOrbits(scale);
    } else if (width >= 1280) {
      // Large screens: place clearly in left and right wings with generous margin
      this.leftCenter = new Vector2D(Math.max(210, width * 0.18), height * 0.52);
      this.rightCenter = new Vector2D(Math.min(width - 210, width * 0.82), height * 0.52);
      this.scaleOrbits(0.95);
    } else if (width >= 1024) {
      // Standard desktop: keep well inside margins
      this.leftCenter = new Vector2D(Math.max(190, width * 0.19), height * 0.52);
      this.rightCenter = new Vector2D(Math.min(width - 190, width * 0.81), height * 0.52);
      this.scaleOrbits(0.78);
    } else {
      // Tablet: tighter margins
      this.leftCenter = new Vector2D(width * 0.16, height * 0.52);
      this.rightCenter = new Vector2D(width * 0.84, height * 0.52);
      this.scaleOrbits(0.68);
    }

    // Immediately snap positions to centers on layout
    for (const body of this.bodies) {
      const center = body.config.galaxy === 'left'
        ? this.leftCenter
        : body.config.galaxy === 'right'
        ? this.rightCenter
        : this.centerCenter;
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
      const center = body.config.galaxy === 'left'
        ? this.leftCenter
        : body.config.galaxy === 'right'
        ? this.rightCenter
        : this.centerCenter;
      body.update(dt, center, mousePos, mouseActive);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // On mobile view, the orbit track is completely invisible (clean transparent orbit)
    if (this.isMobile) {
      return;
    }

    // Refined, glowing orbital tracks for each desktop ring
    ctx.lineWidth = 1;
    const drawnRings = new Set<string>();
    
    for (const body of this.bodies) {
      const center = body.config.galaxy === 'left'
        ? this.leftCenter
        : body.config.galaxy === 'right'
        ? this.rightCenter
        : this.centerCenter;
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
