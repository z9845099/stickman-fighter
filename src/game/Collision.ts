import { Obstacle } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export class CollisionSystem {
  static checkMovementCollision(
    nextPos: { x: number; y: number },
    radius: number,
    obstacles: Obstacle[]
  ): { x: number; y: number } {
    const newPos = { ...nextPos };

    for (const obstacle of obstacles) {
      if (!obstacle.blocksMovement || !obstacle.hitbox) continue;

      const closestX = Math.max(obstacle.hitbox.x, Math.min(newPos.x, obstacle.hitbox.x + obstacle.hitbox.width));
      const closestY = Math.max(obstacle.hitbox.y, Math.min(newPos.y, obstacle.hitbox.y + obstacle.hitbox.height));

      const dx = newPos.x - closestX;
      const dy = newPos.y - closestY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        if (distance > 0) {
          const overlap = radius - distance;
          newPos.x += (dx / distance) * overlap;
          newPos.y += (dy / distance) * overlap;
        }
      }
    }

    newPos.x = Math.max(radius, Math.min(CANVAS_WIDTH - radius, newPos.x));
    newPos.y = Math.max(radius, Math.min(CANVAS_HEIGHT - radius, newPos.y));

    return newPos;
  }

  static hasLineOfSight(
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
    obstacles: Obstacle[]
  ): boolean {
    for (const obstacle of obstacles) {
      if (!obstacle.blocksLineOfSight || !obstacle.hitbox) continue;

      if (this.lineRectIntersection(pos1, pos2, obstacle.hitbox)) {
        return false;
      }
    }
    return true;
  }

  private static lineRectIntersection(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    rect: { x: number; y: number; width: number; height: number }
  ): boolean {
    const lineLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    const step = 10;

    for (let i = 0; i <= lineLength; i += step) {
      const t = i / lineLength;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      if (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      ) {
        return true;
      }
    }
    return false;
  }

  static checkCircleRectCollision(
    circle: { x: number; y: number; radius: number },
    rect: { x: number; y: number; width: number; height: number }
  ): boolean {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;

    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  }
}
