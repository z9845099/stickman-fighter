import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from './Player';
import { Character, Weapon } from '../types';

const mockCharacter: Character = {
  id: 'warrior',
  name: '战士',
  color: '#4a90d9',
  stats: {
    maxHp: 120,
    maxEnergy: 100,
    attack: 25,
    defense: 15,
    speed: 4,
  },
  skills: ['whirlwind_kick', 'ground_smash'],
};

const mockWeapon: Weapon = {
  id: 'fists',
  name: '拳头',
  type: 'melee',
  damageMultiplier: 1.0,
  range: 50,
  cooldown: 0.3,
};

describe('技能释放测试', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player(mockCharacter, mockWeapon, 400, 300);
  });

  describe('技能输入处理', () => {
    it('应该正确设置 skill1 输入', () => {
      expect(player.input.skill1).toBe(false);
      player.input.skill1 = true;
      expect(player.input.skill1).toBe(true);
    });

    it('应该正确设置 skill2 输入', () => {
      expect(player.input.skill2).toBe(false);
      player.input.skill2 = true;
      expect(player.input.skill2).toBe(true);
    });

    it('应该在释放技能后重置输入', () => {
      player.input.skill1 = true;
      player.update(16.67);
      expect(player.input.skill1).toBe(true);
    });
  });

  describe('技能释放条件', () => {
    it('应该在能量充足时允许释放技能', () => {
      player.state.energy = 100;
      expect(player.canUseSkill('whirlwind_kick')).toBe(true);
    });

    it('应该在能量不足时拒绝释放技能', () => {
      player.state.energy = 10;
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });

    it('应该在技能冷却时拒绝释放技能', () => {
      player.state.energy = 100;
      player.state.cooldowns.set('whirlwind_kick', 2);
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });

    it('应该在攻击状态时拒绝释放技能', () => {
      player.state.energy = 100;
      player.state.state = 'attacking';
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });

    it('应该在技能状态时拒绝释放技能', () => {
      player.state.energy = 100;
      player.state.state = 'skill';
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });

    it('应该在受伤状态时拒绝释放技能', () => {
      player.state.energy = 100;
      player.state.state = 'hurt';
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });

    it('应该在死亡状态时拒绝释放技能', () => {
      player.state.energy = 100;
      player.state.state = 'dead';
      expect(player.canUseSkill('whirlwind_kick')).toBe(false);
    });
  });

  describe('技能释放效果', () => {
    it('应该正确扣除技能能量消耗', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      
      expect(player.state.energy).toBeLessThan(100);
      expect(player.state.state).toBe('skill');
    });

    it('应该设置技能冷却', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      
      expect(player.state.cooldowns.has('whirlwind_kick')).toBe(true);
    });

    it('应该在技能结束后恢复到空闲状态', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      player.input.skill1 = false;
      
      expect(player.state.state).toBe('skill');
      
      for (let i = 0; i < 100; i++) {
        player.update(16.67);
      }
      
      expect(player.state.state).toBe('idle');
    });
  });

  describe('技能快捷键模拟', () => {
    it('应该响应 Q 键模拟的技能1输入', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      
      expect(player.state.state).toBe('skill');
      expect(player.state.currentSkill?.id).toBe('whirlwind_kick');
    });

    it('应该响应 E 键模拟的技能2输入', () => {
      player.state.energy = 100;
      player.input.skill2 = true;
      player.update(16.67);
      
      expect(player.state.state).toBe('skill');
      expect(player.state.currentSkill?.id).toBe('ground_smash');
    });

    it('应该在没有技能时不释放', () => {
      const noSkillCharacter: Character = {
        ...mockCharacter,
        id: 'no-skill',
        skills: [],
      };
      
      const noSkillPlayer = new Player(noSkillCharacter, mockWeapon, 400, 300);
      noSkillPlayer.state.energy = 100;
      noSkillPlayer.input.skill1 = true;
      noSkillPlayer.update(16.67);
      
      expect(noSkillPlayer.state.state).toBe('idle');
    });

    it('应该正确处理连续技能释放', () => {
      player.state.energy = 100;
      
      player.input.skill1 = true;
      player.update(16.67);
      player.input.skill1 = false;
      expect(player.state.state).toBe('skill');
      
      for (let i = 0; i < 100; i++) {
        player.update(16.67);
      }
      
      expect(player.state.state).toBe('idle');
      
      player.input.skill2 = true;
      player.update(16.67);
      player.input.skill2 = false;
      expect(player.state.state).toBe('skill');
      expect(player.state.currentSkill?.id).toBe('ground_smash');
    });
  });

  describe('技能伤害测试', () => {
    it('应该正确计算技能伤害', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      
      expect(player.state.currentSkill?.damage).toBe(35);
    });

    it('应该在技能释放时创建攻击判定框', () => {
      player.state.energy = 100;
      player.input.skill1 = true;
      player.update(16.67);
      
      expect(player.state.state).toBe('skill');
    });
  });
});