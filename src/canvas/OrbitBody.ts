import { Vector2D } from '../lib/math';

export interface OrbitBodyConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  semiMajor: number;
  semiMinor: number;
  inclination: number;
  angularVelocity: number;
  phase: number;
  size: number;
  galaxy: 'left' | 'right';
  ringIndex: number;
}

export class OrbitBody {
  config: OrbitBodyConfig;
  position: Vector2D;
  offset: Vector2D;
  theta: number;
  z: number = 0;
  tiltX: number = 0;
  tiltY: number = 0;
  
  origSemiMajor: number;
  origSemiMinor: number;
  baseSemiMajor: number;
  baseSemiMinor: number;
  baseInclination: number;

  constructor(config: OrbitBodyConfig) {
    this.config = config;
    this.position = new Vector2D(0, 0);
    this.offset = new Vector2D(0, 0);
    this.theta = config.phase;
    
    this.origSemiMajor = config.semiMajor;
    this.origSemiMinor = config.semiMinor;
    this.baseSemiMajor = config.semiMajor;
    this.baseSemiMinor = config.semiMinor;
    this.baseInclination = config.inclination;
  }

  setScale(scale: number) {
    this.baseSemiMajor = this.origSemiMajor * scale;
    this.baseSemiMinor = this.origSemiMinor * scale;
    this.config.semiMajor = this.baseSemiMajor;
    this.config.semiMinor = this.baseSemiMinor;
  }

  initPosition(center: Vector2D) {
    const a = this.config.semiMajor;
    const b = this.config.semiMinor;
    const phi = this.config.inclination;
    
    const xBase = a * Math.cos(this.theta);
    const yBase = b * Math.sin(this.theta);
    
    const xRot = xBase * Math.cos(phi) - yBase * Math.sin(phi);
    const yRot = xBase * Math.sin(phi) + yBase * Math.cos(phi);

    this.position = new Vector2D(center.x + xRot, center.y + yRot);
    this.offset = new Vector2D(0, 0);
  }

  update(dt: number, center: Vector2D, mousePos: Vector2D | null, mouseActive: boolean) {
    // 1. Advance along orbital path with constant, silky smooth angular velocity
    this.theta += this.config.angularVelocity * dt;

    // 2. Exact parametric Keplerian ellipse coordinate
    const a = this.config.semiMajor;
    const b = this.config.semiMinor;
    const phi = this.config.inclination;
    
    const xBase = a * Math.cos(this.theta);
    const yBase = b * Math.sin(this.theta);
    
    const xRot = xBase * Math.cos(phi) - yBase * Math.sin(phi);
    const yRot = xBase * Math.sin(phi) + yBase * Math.cos(phi);

    const orbitPos = new Vector2D(center.x + xRot, center.y + yRot);

    // 3. Smooth magnetic repulsion from mouse cursor
    let targetOffset = new Vector2D(0, 0);
    const repulsionRadius = 180;

    if (mouseActive && mousePos) {
      const dist = orbitPos.distanceTo(mousePos);
      if (dist < repulsionRadius && dist > 1) {
        const factor = 1 - (dist / repulsionRadius);
        // Quadratic gentle falloff
        const pushDistance = factor * factor * 50;
        const dir = orbitPos.sub(mousePos).normalize();
        targetOffset = dir.scale(pushDistance);
      }
    }

    // Exponential smoothing for frame-rate-independent fluid damping
    const smoothFactor = 1 - Math.exp(-9 * dt);
    this.offset = this.offset.lerp(targetOffset, smoothFactor);

    // 4. Combined final position & 3D orbital depth
    this.position = orbitPos.add(this.offset);
    this.z = Math.sin(this.theta);
    this.tiltX = -Math.cos(this.theta) * 14;
    this.tiltY = Math.sin(this.theta) * 14;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Overlay handled by React with GPU acceleration
  }
}
