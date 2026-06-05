import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from './Player';
import { Character, Weapon } from '../types';

const mockCharacter: Character = {
  id: 'test',
  name: 'Test',
  color: '#ff0000',
  stats: {
    maxHp: 100,
    attack: 20,
    defense: 10,
    speed: 5,
    maxEnergy: 100,
  },
  skills: ['skill1', 'skill2'],
};

const mockWeapon: Weapon = {
  id: 'fist',
  name: '拳头',
  type: 'melee',
  damageMultiplier: 1.0,
  range: 60,
  cooldown: 0.3,
};

describe('玩家碰撞检测', () => {
  let player1: Player;
  let player2: Player;

  const checkPlayerCollision = (p1: Player, p2: Player) => {
    const dx = p2.state.position.x - p1.state.position.x;
    const dy = p2.state.position.y - p1.state.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = 40;

    if (distance < minDistance && distance > 0) {
      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;

      p1.state.position.x -= nx * overlap * 0.5;
      p1.state.position.y -= ny * overlap * 0.5;
      p2.state.position.x += nx * overlap * 0.5;
      p2.state.position.y += ny * overlap * 0.5;

      p1.state.velocity.x -= nx * 2;
      p1.state.velocity.y -= ny * 2;
      p2.state.velocity.x += nx * 2;
      p2.state.velocity.y += ny * 2;
    }
  };

  beforeEach(() => {
    player1 = new Player(mockCharacter, mockWeapon, 400, 300);
    player2 = new Player(mockCharacter, mockWeapon, 400, 300);
  });

  describe('碰撞检测基本功能', () => {
    it('应该检测到玩家重叠', () => {
      player1.state.position.x = 400;
      player2.state.position.x = 400;
      
      const dx = player2.state.position.x - player1.state.position.x;
      const dy = player2.state.position.y - player1.state.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      expect(distance).toBe(0);
    });

    it('应该在重叠时互相推开', () => {
      player1.state.position.x = 390;
      player2.state.position.x = 400;
      
      checkPlayerCollision(player1, player2);
      
      const dx = player2.state.position.x - player1.state.position.x;
      const dy = player2.state.position.y - player1.state.position.y;
      const finalDistance = Math.sqrt(dx * dx + dy * dy);
      
      expect(finalDistance).toBeGreaterThan(39);
      expect(finalDistance).toBeLessThan(41);
    });
  });

  describe('碰撞推开方向', () => {
    it('应该沿碰撞轴方向推开', () => {
      player1.state.position.x = 380;
      player2.state.position.x = 400;
      player1.state.position.y = 300;
      player2.state.position.y = 300;
      
      const initialDx = player2.state.position.x - player1.state.position.x;
      checkPlayerCollision(player1, player2);
      
      const finalDx = player2.state.position.x - player1.state.position.x;
      
      expect(finalDx).toBeGreaterThan(initialDx);
      expect(player1.state.position.x).toBeLessThan(380);
      expect(player2.state.position.x).toBeGreaterThan(400);
    });

    it('应该正确处理垂直碰撞', () => {
      player1.state.position.x = 400;
      player2.state.position.x = 400;
      player1.state.position.y = 290;
      player2.state.position.y = 300;
      
      checkPlayerCollision(player1, player2);
      
      const dy = player2.state.position.y - player1.state.position.y;
      expect(dy).toBeGreaterThan(39);
      expect(player1.state.position.y).toBeLessThan(290);
      expect(player2.state.position.y).toBeGreaterThan(300);
    });

    it('应该正确处理斜向碰撞', () => {
      player1.state.position.x = 390;
      player2.state.position.x = 400;
      player1.state.position.y = 290;
      player2.state.position.y = 300;
      
      checkPlayerCollision(player1, player2);
      
      const dx = player2.state.position.x - player1.state.position.x;
      const dy = player2.state.position.y - player1.state.position.y;
      
      expect(dx).toBeGreaterThan(20);
      expect(dy).toBeGreaterThan(20);
      expect(player1.state.position.x).toBeLessThan(390);
      expect(player1.state.position.y).toBeLessThan(290);
      expect(player2.state.position.x).toBeGreaterThan(400);
      expect(player2.state.position.y).toBeGreaterThan(300);
    });
  });

  describe('碰撞后的速度变化', () => {
    it('应该给碰撞的玩家添加反向速度', () => {
      player1.state.position.x = 380;
      player2.state.position.x = 400;
      player1.state.velocity.x = 0;
      player2.state.velocity.x = 0;
      
      checkPlayerCollision(player1, player2);
      
      expect(player1.state.velocity.x).toBeLessThan(0);
      expect(player2.state.velocity.x).toBeGreaterThan(0);
    });

    it('应该正确计算速度方向', () => {
      player1.state.position.x = 420;
      player2.state.position.x = 400;
      player1.state.velocity.x = 0;
      player2.state.velocity.x = 0;
      
      checkPlayerCollision(player1, player2);
      
      expect(player1.state.velocity.x).toBeGreaterThan(0);
      expect(player2.state.velocity.x).toBeLessThan(0);
    });
  });

  describe('边界条件', () => {
    it('应该正确处理距离为0的情况', () => {
      player1.state.position.x = 400;
      player2.state.position.x = 400;
      player1.state.position.y = 300;
      player2.state.position.y = 300;
      
      const initialPos1 = { ...player1.state.position };
      const initialPos2 = { ...player2.state.position };
      
      checkPlayerCollision(player1, player2);
      
      expect(player1.state.position).toEqual(initialPos1);
      expect(player2.state.position).toEqual(initialPos2);
    });

    it('应该在距离大于最小距离时不做处理', () => {
      player1.state.position.x = 300;
      player2.state.position.x = 400;
      
      const initialPos1 = { ...player1.state.position };
      const initialPos2 = { ...player2.state.position };
      const initialVel1 = { ...player1.state.velocity };
      const initialVel2 = { ...player2.state.velocity };
      
      checkPlayerCollision(player1, player2);
      
      expect(player1.state.position).toEqual(initialPos1);
      expect(player2.state.position).toEqual(initialPos2);
      expect(player1.state.velocity).toEqual(initialVel1);
      expect(player2.state.velocity).toEqual(initialVel2);
    });

    it('应该处理刚好接触的情况', () => {
      player1.state.position.x = 360;
      player2.state.position.x = 400;
      
      const initialPos1 = { ...player1.state.position };
      const initialPos2 = { ...player2.state.position };
      
      checkPlayerCollision(player1, player2);
      
      expect(player1.state.position).toEqual(initialPos1);
      expect(player2.state.position).toEqual(initialPos2);
    });
  });

  describe('双人对战场景模拟', () => {
    it('应该防止两个玩家互相卡住', () => {
      player1.state.position.x = 390;
      player2.state.position.x = 400;
      player1.state.position.y = 300;
      player2.state.position.y = 300;
      
      for (let i = 0; i < 5; i++) {
        checkPlayerCollision(player1, player2);
        
        const dx = player2.state.position.x - player1.state.position.x;
        const dy = player2.state.position.y - player1.state.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        expect(distance).toBeGreaterThanOrEqual(40);
      }
    });

    it('应该在互相推进时保持稳定', () => {
      player1.state.position.x = 380;
      player2.state.position.x = 400;
      player1.state.velocity.x = 5;
      player2.state.velocity.x = -5;
      
      for (let i = 0; i < 10; i++) {
        player1.state.position.x += player1.state.velocity.x;
        player2.state.position.x += player2.state.velocity.x;
        
        checkPlayerCollision(player1, player2);
        
        const dx = player2.state.position.x - player1.state.position.x;
        const distance = Math.abs(dx);
        
        expect(distance).toBeGreaterThanOrEqual(40);
        
        player1.state.velocity.x *= 0.92;
        player2.state.velocity.x *= 0.92;
      }
    });

    it('应该正确处理高速碰撞', () => {
      player1.state.position.x = 395;
      player2.state.position.x = 400;
      player1.state.velocity.x = 10;
      player2.state.velocity.x = -10;
      
      player1.state.position.x += player1.state.velocity.x;
      player2.state.position.x += player2.state.velocity.x;
      
      checkPlayerCollision(player1, player2);
      
      const dx = player2.state.position.x - player1.state.position.x;
      expect(Math.abs(dx)).toBeGreaterThanOrEqual(40);
      
      expect(player1.state.velocity.x).toBeGreaterThan(0);
      expect(player2.state.velocity.x).toBeLessThan(0);
    });
  });
});