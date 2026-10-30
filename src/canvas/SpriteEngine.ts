export type SpriteState = 
  | 'IDLE_FRONT' | 'IDLE_BACK' | 'TALK' | 'THINK' | 'WAVE' | 'THUMBS_UP' | 'JUMP'
  | 'RUN_RIGHT' | 'RUN_LEFT' | 'RUN_FRONT' | 'WALK_RIGHT' | 'WALK_LEFT' | 'WALK_FRONT'
  | 'LOOK_LEFT' | 'LOOK_RIGHT' | 'TELEPORT';

export interface FrameData {
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
  fps: number = 6;

  // Normalized frame metrics across all sheets (Pose, Actions, Runing)
  static readonly FRAME_WIDTH = 240;
  static readonly FRAME_HEIGHT = 360;
  static readonly BASELINE_Y = 345;
  static readonly CENTER_X = 120;

  renderWidth: number = 140;
  opacity: number = 1;
  totalTime: number = 0;

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
        if (loadedCount === sheets.length) {
          this.loaded = true;
        }
      };
      this.images[name] = img;
    });
  }

  getFrameData(): FrameData {
    switch (this.state) {
      case 'IDLE_FRONT':
        return { sheet: 'Pose', index: 0, flipX: false };
      case 'IDLE_BACK':
        return { sheet: 'Pose', index: 1, flipX: false };
      case 'LOOK_LEFT':
        return { sheet: 'Pose', index: 2, flipX: false };
      case 'LOOK_RIGHT':
        return { sheet: 'Pose', index: 3, flipX: false };
      case 'THINK':
        return { sheet: 'Pose', index: 2, flipX: false };

      case 'THUMBS_UP':
        return { sheet: 'Actions', index: 0, flipX: false };
      case 'WAVE':
        // Alternates waving hand (Actions frame 1) with conversational gesture (Actions frame 2)
        return { 
          sheet: 'Actions', 
          index: (this.currentFrameIndex % 2 === 0 ? 1 : 2), 
          flipX: false 
        };
      case 'TALK':
        // Alternates talking hand gestures (Actions frame 2) and idle attentiveness (Pose frame 0)
        return this.currentFrameIndex % 2 === 0
          ? { sheet: 'Actions', index: 2, flipX: false }
          : { sheet: 'Pose', index: 0, flipX: false };
      case 'JUMP':
        return { sheet: 'Actions', index: 3, flipX: false };
      case 'TELEPORT':
        return { sheet: 'Actions', index: 3, flipX: false };

      // Walk cycle
      case 'WALK_FRONT':
        return { sheet: 'Runing', index: this.currentFrameIndex % 2, flipX: false };
      case 'WALK_RIGHT':
        // Side-view stepping cycle (frames 2 and 3)
        return { sheet: 'Runing', index: 2 + (this.currentFrameIndex % 2), flipX: false };
      case 'WALK_LEFT':
        return { sheet: 'Runing', index: 2 + (this.currentFrameIndex % 2), flipX: true };

      // Run cycle
      case 'RUN_FRONT':
        return { sheet: 'Runing', index: this.currentFrameIndex % 2, flipX: false };
      case 'RUN_RIGHT':
        return { sheet: 'Runing', index: 2 + (this.currentFrameIndex % 2), flipX: false };
      case 'RUN_LEFT':
        return { sheet: 'Runing', index: 2 + (this.currentFrameIndex % 2), flipX: true };

      default:
        return { sheet: 'Pose', index: 0, flipX: false };
    }
  }

  setState(newState: SpriteState) {
    if (this.state !== newState) {
      this.state = newState;
      this.currentFrameIndex = 0;
      this.frameTimer = 0;

      // Adjust animation speed per state
      if (newState.startsWith('RUN_')) {
        this.fps = 8;
      } else if (newState.startsWith('WALK_')) {
        this.fps = 5;
      } else if (newState === 'TALK' || newState === 'WAVE') {
        this.fps = 3.5;
      } else {
        this.fps = 2;
      }
    }
  }

  update(dt: number) {
    if (!this.loaded) return;
    this.totalTime += dt;
    this.frameTimer += dt;

    if (this.frameTimer >= 1 / this.fps) {
      this.frameTimer = 0;
      this.currentFrameIndex++;
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number) {
    if (!this.loaded) return;

    const { sheet, index, flipX } = this.getFrameData();
    const img = this.images[sheet];
    if (!img) return;

    const fw = SpriteEngine.FRAME_WIDTH;
    const fh = SpriteEngine.FRAME_HEIGHT;
    const baseGround = SpriteEngine.BASELINE_Y;
    const baseCenter = SpriteEngine.CENTER_X;

    // Scaling
    const scale = this.renderWidth / fw;
    const rw = this.renderWidth;
    const rh = fh * scale;
    const rBaselineY = baseGround * scale;
    const rCenterX = baseCenter * scale;

    const isRunning = this.state.startsWith('RUN_');
    const isWalking = this.state.startsWith('WALK_');
    const isIdle = this.state.startsWith('IDLE_') || this.state === 'THINK';

    // Gentle, natural micro-bobs synchronized with motion
    let yOffset = 0;
    let tilt = 0;

    if (isRunning) {
      // Gentle running bounce synchronized with step frequency
      yOffset = Math.abs(Math.sin(this.totalTime * 10)) * 2.5;
      tilt = (flipX ? -1 : 1) * 0.04; // slight forward momentum lean
    } else if (isWalking) {
      // Very soft walking step
      yOffset = Math.abs(Math.sin(this.totalTime * 7)) * 1.5;
    } else if (isIdle) {
      // Calm, subtle breathing
      yOffset = Math.sin(this.totalTime * 2.5) * 1.0;
    }

    const drawX = Math.round(x);
    const drawY = Math.round(y - yOffset);

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

    // Move to ground anchor (feet contact point)
    ctx.translate(drawX, drawY);

    if (tilt !== 0) {
      ctx.rotate(tilt);
    }

    if (flipX) {
      ctx.scale(-1, 1);
    }

    // Draw frame anchored perfectly at (0, 0):
    // Character center is at x=0, feet touch ground at y=0.
    ctx.drawImage(
      img,
      index * fw, 0, fw, fh,
      Math.round(-rCenterX), Math.round(-rBaselineY), Math.round(rw), Math.round(rh)
    );

    ctx.restore();
  }
}
