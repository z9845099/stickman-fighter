
export type ObstacleType = 'wall' | 'crate' | 'pillar';

export interface ObstacleData {
  id: string;
  type: ObstacleType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  borderColor: string;
  blocksMovement: boolean;
  blocksLineOfSight: boolean;
  coverBonus: number;
}

export class Obstacle {
  id: string;
  type: ObstacleType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  borderColor: string;
  blocksMovement: boolean;
  blocksLineOfSight: boolean;
  coverBonus: number;

  constructor(data: ObstacleData) {
    this.id = data.id;
    this.type = data.type;
    this.position = data.position;
    this.size = data.size;
    this.color = data.color;
    this.borderColor = data.borderColor;
    this.blocksMovement = data.blocksMovement;
    this.blocksLineOfSight = data.blocksLineOfSight;
    this.coverBonus = data.coverBonus;
  }

  getHitbox() {
    return {
      x: this.position.x - this.size.width / 2,
      y: this.position.y - this.size.height / 2,
      width: this.size.width,
      height: this.size.height,
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const hitbox = this.getHitbox();

    if (this.type === 'pillar') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.size.width / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(this.position.x + 3, this.position.y + 3, this.size.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

      if (this.type === 'crate') {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hitbox.x, hitbox.y + hitbox.height / 2);
        ctx.lineTo(hitbox.x + hitbox.width, hitbox.y + hitbox.height / 2);
        ctx.moveTo(hitbox.x + hitbox.width / 2, hitbox.y);
        ctx.lineTo(hitbox.x + hitbox.width / 2, hitbox.y + hitbox.height);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

export const OBSTACLES_CONFIG = [
  {
    id: 'wall1',
    type: 'wall' as const,
    position: { x: 200, y: 300 },
    size: { width: 150, height: 25 },
    color: '#4a4a4a',
    borderColor: '#6a6a6a',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.4,
  },
  {
    id: 'wall2',
    type: 'wall' as const,
    position: { x: 600, y: 300 },
    size: { width: 150, height: 25 },
    color: '#4a4a4a',
    borderColor: '#6a6a6a',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.4,
  },
  {
    id: 'crate1',
    type: 'crate' as const,
    position: { x: 400, y: 200 },
    size: { width: 50, height: 50 },
    color: '#8B4513',
    borderColor: '#5D3A1A',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.3,
  },
  {
    id: 'crate2',
    type: 'crate' as const,
    position: { x: 400, y: 400 },
    size: { width: 50, height: 50 },
    color: '#8B4513',
    borderColor: '#5D3A1A',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.3,
  },
  {
    id: 'pillar1',
    type: 'pillar' as const,
    position: { x: 250, y: 450 },
    size: { width: 40, height: 40 },
    color: '#666688',
    borderColor: '#8888aa',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.5,
  },
  {
    id: 'pillar2',
    type: 'pillar' as const,
    position: { x: 550, y: 450 },
    size: { width: 40, height: 40 },
    color: '#666688',
    borderColor: '#8888aa',
    blocksMovement: true,
    blocksLineOfSight: true,
    coverBonus: 0.5,
  },
];
