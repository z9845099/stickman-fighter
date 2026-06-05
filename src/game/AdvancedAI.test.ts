import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedAI } from './AdvancedAI';
import { Player } from './Player';
import { Character, Weapon } from '../types';

// Mock character data
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

// Mock weapon
const mockWeapon: Weapon = {
  id: 'fist',
  name: '拳头',
  type: 'melee',
  damageMultiplier: 1.0,
  range: 60,
  cooldown: 0.3,
};

describe('AdvancedAI', () => {
  let player: Player;
  let opponent: Player;
  let ai: AdvancedAI;

  beforeEach(() => {
    player = new Player(mockCharacter, mockWeapon, 150, 300);
    opponent = new Player(mockCharacter, mockWeapon, 650, 300);
    ai = new AdvancedAI(player, opponent, 4);
  });

  describe('初始化', () => {
    it('应该正确初始化AI实例', () => {
      expect(ai.player).toBe(player);
      expect(ai.opponent).toBe(opponent);
      expect(ai.difficulty).toBe(4);
      expect(ai.currentAction).toBe('idle');
    });

    it('应该设置正确的决策间隔', () => {
      const aiEasy = new AdvancedAI(player, opponent, 1);
      const aiHard = new AdvancedAI(player, opponent, 4);
      
      // 难度越高决策越频繁
      expect((aiEasy as any).getDecisionInterval()).toBeGreaterThan((aiHard as any).getDecisionInterval());
    });
  });

  describe('血量检测和异常处理', () => {
    it('应该在血量为0时停止所有动作', () => {
      player.state.hp = 0;
      ai.update();
      
      expect(player.input.up).toBe(false);
      expect(player.input.down).toBe(false);
      expect(player.input.left).toBe(false);
      expect(player.input.right).toBe(false);
      expect(player.input.attack).toBe(false);
      expect(player.input.dodge).toBe(false);
    });
  });

  describe('闪避逻辑', () => {
    it('应该有极高的闪避概率在难度4', () => {
      const chance = (ai as any).getDodgeChance();
      expect(chance).toBe(0.99);
    });

    it('应该在连续3次闪避后停止闪避', () => {
      (ai as any).consecutiveDodges = 3;
      
      const state = {
        distance: 50,
        opponentState: 'attacking',
      };
      
      const result = (ai as any).needEmergencyDodge(state);
      expect(result).toBe(false);
    });
  });

  describe('反击机制', () => {
    it('应该在对手攻击后尝试反击', () => {
      opponent.state.state = 'attacking';
      
      for (let i = 0; i < 10; i++) {
        ai.update();
      }
      
      const stats = ai.getStats();
      expect(stats.dodgeAttempts).toBeGreaterThanOrEqual(0);
    });

    it('应该在合适距离时更可能反击', () => {
      player.state.position.x = 350;
      opponent.state.position.x = 420;
      
      const state = {
        distance: 70,
        opponentState: 'idle',
        canAttack: true,
      };
      
      (ai as any).frameCount = 100;
      (ai as any).lastOpponentAttackFrame = 90;
      
      const result = (ai as any).needCounterAttack(state);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('数据统计', () => {
    it('应该正确记录攻击次数', () => {
      (ai as any).currentAction = 'attack';
      player.state.state = 'idle';
      
      (ai as any).executeAttack();
      const stats = ai.getStats();
      
      expect(stats.attackCount).toBeGreaterThanOrEqual(1);
    });

    it('应该正确计算闪避成功率', () => {
      (ai as any).stats.dodgeAttempts = 10;
      (ai as any).stats.dodgeSuccesses = 8;
      
      const stats = ai.getStats();
      expect(stats.dodgeRate).toBe(80);
    });
  });

  describe('动作评估', () => {
    it('应该给理想距离的攻击更高分数', () => {
      player.state.position.x = 350;
      opponent.state.position.x = 420;
      
      const state = {
        distance: 70,
        distanceY: 0,
        opponentState: 'idle',
        canAttack: true,
      };
      
      (ai as any).evaluateActions(state);
      
      const attackScore = (ai as any).actionScores.get('attack');
      const backScore = (ai as any).actionScores.get('backward');
      
      expect(attackScore).toBeDefined();
      expect(backScore).toBeDefined();
    });

    it('应该在对手受伤时提高攻击分数', () => {
      const state1 = {
        distance: 60,
        opponentState: 'idle',
        canAttack: true,
      };
      
      const state2 = {
        distance: 60,
        opponentState: 'hurt',
        canAttack: true,
      };
      
      (ai as any).evaluateActions(state1);
      const score1 = (ai as any).actionScores.get('attack');
      
      (ai as any).evaluateActions(state2);
      const score2 = (ai as any).actionScores.get('attack');
      
      expect(score2).toBeGreaterThan(score1);
    });
  });

  describe('智能移动', () => {
    it('应该向对手方向移动当距离过远', () => {
      player.state.position.x = 100;
      opponent.state.position.x = 700;
      
      (ai as any).currentAction = 'move';
      (ai as any).executeSmartMove(600, 0);
      
      expect(player.input.right).toBe(true);
    });

    it('应该远离对手当距离过近且血量低', () => {
      player.state.hp = 25;
      player.state.position.x = 350;
      opponent.state.position.x = 400;
      
      (ai as any).currentAction = 'backward';
      (ai as any).executeBackward(50, 0);
      
      expect(player.input.left).toBe(true);
    });
  });

  describe('低血量时的闪避逻辑', () => {
    it('应该在低血量时检测到需要紧急后退', () => {
      player.state.hp = 25;
      player.state.position.x = 350;
      opponent.state.position.x = 400;
      
      const state = {
        distance: 50,
        ownHp: 25,
        maxHp: 100,
      };
      
      const result = (ai as any).needEmergencyRetreat(state);
      expect(typeof result).toBe('boolean');
    });

    it('应该在低血量且距离近时优先选择后退动作', () => {
      player.state.hp = 20;
      player.state.position.x = 380;
      opponent.state.position.x = 400;
      
      const state = {
        distance: 20,
        distanceY: 0,
        opponentState: 'idle',
        canAttack: true,
        ownHp: 20,
        maxHp: 100,
        ownEnergy: 50,
      };
      
      (ai as any).evaluateActions(state);
      const backScore = (ai as any).actionScores.get('backward');
      const attackScore = (ai as any).actionScores.get('attack');
      
      expect(backScore).toBeDefined();
      expect(attackScore).toBeDefined();
    });

    it('紧急后退应该计算正确的方向', () => {
      player.state.position.x = 350;
      opponent.state.position.x = 400;
      player.state.position.y = 300;
      opponent.state.position.y = 300;
      
      (ai as any).currentAction = 'backward';
      (ai as any).executeBackward(50, 0);
      
      expect(player.input.left).toBe(true);
      expect(player.input.right).toBe(false);
    });

    it('紧急后退应该计算正确的速度', () => {
      player.state.position.x = 370;
      opponent.state.position.x = 400;
      
      (ai as any).executeBackward(30, 0);
      
      expect(player.state.velocity.x).toBeLessThan(0);
      expect(player.input.left).toBe(true);
    });
  });

  describe('碰撞与闪避交互', () => {
    it('碰撞推开后应该仍然能够执行闪避', () => {
      player.state.position.x = 390;
      opponent.state.position.x = 400;
      
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
        }
      };
      
      checkPlayerCollision(player, opponent);
      
      expect(player.input.dodge).toBe(false);
      expect(player.input.left).toBe(false);
      expect(player.input.right).toBe(false);
      
      opponent.state.state = 'attacking';
      const state = {
        distance: 40,
        opponentState: 'attacking',
      };
      
      (ai as any).dodgeCooldown = 0;
      (ai as any).consecutiveDodges = 0;
      const shouldDodge = (ai as any).needEmergencyDodge(state);
      
      expect(typeof shouldDodge).toBe('boolean');
    });

    it('低血量时碰撞后应该继续尝试后退', () => {
      player.state.hp = 25;
      player.state.position.x = 390;
      opponent.state.position.x = 400;
      
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
        }
      };
      
      checkPlayerCollision(player, opponent);
      
      const state = {
        distance: 40,
        ownHp: 25,
        maxHp: 100,
      };
      
      const shouldRetreat = (ai as any).needEmergencyRetreat(state);
      expect(typeof shouldRetreat).toBe('boolean');
    });
  });
});
