import { Vector2D } from '../lib/math';

export interface OrbitBodyConfig {
  id: string;
  label: string;
  icon: string;
  iconColor?: string;
  semiMajor: number;
  semiMinor: number;
  inclination: number;
  angularVelocity: number;
  phase: number;
  size: number;
  galaxy: 'left' | 'right';
  color: string;
}

export class OrbitBody {
  config: OrbitBodyConfig;
  position: Vector2D;
  velocity: Vector2D;
  targetPosition: Vector2D;
  theta: number;
  
  // Base properties for warping effect
  baseSemiMajor: number;
  baseSemiMinor: number;
  baseInclination: number;
  
  warpTimer: number = 0;

  constructor(config: OrbitBodyConfig) {
    this.config = config;
    this.position = new Vector2D(0, 0);
    this.velocity = new Vector2D(0, 0);
    this.targetPosition = new Vector2D(0, 0);
    this.theta = config.phase;
    
    this.baseSemiMajor = config.semiMajor;
    this.baseSemiMinor = config.semiMinor;
    this.baseInclination = config.inclination;
  }

  update(dt: number, center: Vector2D, mousePos: Vector2D | null, mouseActive: boolean) {
    this.theta += this.config.angularVelocity * dt;

    let targetSemiMajor = this.baseSemiMajor;
    let targetSemiMinor = this.baseSemiMinor;
    let targetInclination = this.baseInclination;

    // Interactive Orbital Wave Effect
    let force = new Vector2D(0, 0);
    const repulsionRadius = 250;

    if (mouseActive && mousePos) {
      const dist = this.position.distanceTo(mousePos);
      if (dist < repulsionRadius) {
        this.warpTimer += dt * 15; // Fast oscillation
        
        // Randomly perturb the orbital parameters based on sine waves and distance
        const intensity = (1 - (dist / repulsionRadius));
        targetSemiMajor += Math.sin(this.warpTimer) * 40 * intensity;
        targetSemiMinor += Math.cos(this.warpTimer * 1.3) * 40 * intensity;
        targetInclination += Math.sin(this.warpTimer * 0.7) * 0.3 * intensity;
        
        // Add a slight outward push as well
        if (dist > 1) {
          const repulsionStrength = intensity * 1000;
          const dir = this.position.sub(mousePos).normalize();
          force = dir.scale(repulsionStrength);
        }
      } else {
        this.warpTimer = 0;
      }
    } else {
      this.warpTimer = 0;
    }

    // Smoothly interpolate current config to target warped config
    this.config.semiMajor += (targetSemiMajor - this.config.semiMajor) * 10 * dt;
    this.config.semiMinor += (targetSemiMinor - this.config.semiMinor) * 10 * dt;
    this.config.inclination += (targetInclination - this.config.inclination) * 10 * dt;

    // Calculate parametric target position
    const a = this.config.semiMajor;
    const b = this.config.semiMinor;
    const phi = this.config.inclination;
    
    const xBase = a * Math.cos(this.theta);
    const yBase = b * Math.sin(this.theta);
    
    const xRot = xBase * Math.cos(phi) - yBase * Math.sin(phi);
    const yRot = xBase * Math.sin(phi) + yBase * Math.cos(phi);

    this.targetPosition = new Vector2D(center.x + xRot, center.y + yRot);

    // Spring mechanics
    const springStiffness = 0.08; 
    const damping = 0.82; 
    
    const springForce = this.targetPosition.sub(this.position).scale(springStiffness);
    force = force.add(springForce);

    this.velocity = this.velocity.scale(damping).add(force.scale(dt));
    this.position = this.position.add(this.velocity);

    // Initial snap protection
    if (this.velocity.magnitude() < 0.1 && !mouseActive && this.position.distanceTo(this.targetPosition) > 300) {
       this.position = new Vector2D(this.targetPosition.x, this.targetPosition.y);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Empty, overlay handled by React
  }
}
