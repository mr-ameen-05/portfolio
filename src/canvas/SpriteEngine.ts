export type SpriteState = 
  | 'IDLE_FRONT' | 'IDLE_BACK' | 'TALK' | 'THINK' | 'WAVE' | 'THUMBS_UP' | 'JUMP'
  | 'RUN_RIGHT' | 'RUN_LEFT' | 'WALK_RIGHT' | 'WALK_LEFT' | 'WALK_FRONT'
  | 'LOOK_LEFT' | 'LOOK_RIGHT' | 'TELEPORT';

interface FrameData {
  sheet: 'Pose' | 'Actions' | 'Runing';
  index: number;
  flipX: boolean;
}

export class SpriteEngine {
  state: SpriteState = 'IDLE_FRONT';
  
  images: Record<string, HTMLImageElement> = {};
  loaded: boolean = false;

  frameTimer: number = 0;
  currentFrameIndex: number = 0;
  fps: number = 8;

  renderWidth: number = 140;
  renderHeight: number = 0; 

  opacity: number = 1;

  // Accumulated time for continuous animation effects (bob, breathe)
  totalTime: number = 0;

  private sheetHeights: Record<string, number> = {};

  constructor() {
    this.loadImages();
  }

  loadImages() {
    const sheets = ['Pose', 'Actions', 'Runing'];
    let loadedCount = 0;

    sheets.forEach(name => {
      const img = new Image();
      img.src = `/sprites/${name}.png`;
      img.onload = () => {
        loadedCount++;
        const frameWidth = img.width / 4;
        const aspect = img.height / frameWidth;
        this.sheetHeights[name] = this.renderWidth * aspect;
        
        if (loadedCount === sheets.length) {
          this.loaded = true;
          this.renderHeight = this.sheetHeights['Pose'];
        }
      };
      this.images[name] = img;
    });
  }

  getFrameData(): FrameData {
    switch (this.state) {
      case 'IDLE_FRONT':  return { sheet: 'Pose', index: 0, flipX: false };
      case 'IDLE_BACK':   return { sheet: 'Pose', index: 1, flipX: false };
      case 'LOOK_LEFT':   return { sheet: 'Pose', index: 2, flipX: false };
      case 'LOOK_RIGHT':  return { sheet: 'Pose', index: 3, flipX: false };
      case 'THINK':       return { sheet: 'Pose', index: 2, flipX: false };

      case 'THUMBS_UP':   return { sheet: 'Actions', index: 0, flipX: false };
      case 'WAVE':        return { sheet: 'Actions', index: 1, flipX: false };
      case 'TALK':        return { sheet: 'Actions', index: 2, flipX: false };
      case 'JUMP':        return { sheet: 'Actions', index: 3, flipX: false };
      case 'TELEPORT':    return { sheet: 'Actions', index: 3, flipX: false };

      // Walk uses front-facing cycle (frames 0,1 alternating)
      case 'WALK_FRONT':  return { sheet: 'Runing', index: this.currentFrameIndex % 2, flipX: false };
      case 'WALK_RIGHT':  return { sheet: 'Runing', index: this.currentFrameIndex % 2, flipX: false };
      case 'WALK_LEFT':   return { sheet: 'Runing', index: this.currentFrameIndex % 2, flipX: true };

      // Run uses the side-profile frame (frame 3 = right-facing)
      // Flip for left direction. Animation is faked via bob + squash/stretch.
      case 'RUN_RIGHT':   return { sheet: 'Runing', index: 3, flipX: false };
      case 'RUN_LEFT':    return { sheet: 'Runing', index: 3, flipX: true };

      default: return { sheet: 'Pose', index: 0, flipX: false };
    }
  }

  setState(newState: SpriteState) {
    if (this.state !== newState) {
      this.state = newState;
      this.currentFrameIndex = 0;
      const fd = this.getFrameData();
      this.renderHeight = this.sheetHeights[fd.sheet] || this.renderHeight;
    }
  }

  update(dt: number) {
    if (!this.loaded) return;
    this.totalTime += dt;

    this.frameTimer += dt;
    if (this.frameTimer > 1 / this.fps) {
      this.frameTimer = 0;
      this.currentFrameIndex++;
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number) {
    if (!this.loaded) return;

    const { sheet, index, flipX } = this.getFrameData();
    const img = this.images[sheet];
    if (!img) return;

    const frameWidth = img.width / 4;
    const frameHeight = img.height;
    const rh = this.sheetHeights[sheet] || this.renderHeight;
    const rw = this.renderWidth;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    const isRunning = this.state === 'RUN_RIGHT' || this.state === 'RUN_LEFT';
    const isWalking = this.state === 'WALK_RIGHT' || this.state === 'WALK_LEFT' || this.state === 'WALK_FRONT';
    const isIdle = this.state === 'IDLE_FRONT' || this.state === 'IDLE_BACK';

    // --- Animation Effects ---
    let yOffset = 0;
    let scaleX = 1;
    let scaleY = 1;
    let tilt = 0; // rotation in radians

    if (isRunning) {
      // Fast vertical bob (simulates feet hitting ground)
      yOffset = Math.abs(Math.sin(this.totalTime * 14)) * 10;
      // Squash and stretch (compressed on landing, stretched in air)
      const cycle = Math.sin(this.totalTime * 14);
      scaleX = 1 + cycle * 0.04;  // slightly wider on landing
      scaleY = 1 - cycle * 0.04;  // slightly shorter on landing
      // Slight forward lean 
      tilt = (flipX ? 1 : -1) * 0.05;
    } else if (isWalking) {
      // Gentle bob
      yOffset = Math.abs(Math.sin(this.totalTime * 8)) * 4;
      // Subtle sway
      tilt = Math.sin(this.totalTime * 8) * 0.02;
    } else if (isIdle) {
      // Slow breathing bob
      yOffset = Math.sin(this.totalTime * 2) * 2;
    }

    // Calculate draw position (feet anchored at x, y)
    const drawX = x;
    const drawY = y - yOffset;

    // Apply transforms
    ctx.translate(drawX, drawY);
    if (tilt !== 0) ctx.rotate(tilt);
    if (flipX) ctx.scale(-scaleX, scaleY);
    else ctx.scale(scaleX, scaleY);

    // Draw the frame centered on origin, feet at bottom
    ctx.drawImage(
      img,
      index * frameWidth, 0, frameWidth, frameHeight,
      -rw / 2, -rh, rw, rh
    );

    ctx.restore();
  }
}
