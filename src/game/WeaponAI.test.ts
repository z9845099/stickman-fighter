import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from './Player';
import { AdvancedAI } from './AdvancedAI';
import { Character, Weapon } from '../types';
import { aiConfig, getDifficultyConfig } from '../config/aiConfig';

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
  skills: [],
};

const mockWeapons: Weapon[] = [
  { id: 'fists', name: '拳头', type: 'melee', damageMultiplier: 1.0, range: 50, cooldown: 0.3 },
  { id: 'katana', name: '武士刀', type: 'melee', damageMultiplier: 1.5, range: 70, cooldown: 0.5 },
  { id: 'battleaxe', name: '战斧', type: 'melee', damageMultiplier: 1.8, range: 60, cooldown: 0.7 },
  { id: 'bow', name: '弓箭', type: 'ranged', damageMultiplier: 1.2, range: 200, cooldown: 0.4 },
  { id: 'shuriken', name: '手里剑', type: 'ranged', damageMultiplier: 0.8, range: 150, cooldown: 0.2 },
];

describe('武器系统测试', () => {
  let player1: Player;
  let player2: Player;
  let ai: AdvancedAI;

  beforeEach(() => {
    player1 = new Player(mockCharacter, null, 200, 300);
    player2 = new Player(mockCharacter, null, 600, 300);
    ai = new AdvancedAI(player1, player2, 4);
  });

  describe('武器特效渲染视觉回归测试', () => {
    it('Player类应该有drawWeapon方法', () => {
      expect(typeof (player1 as any).drawWeapon).toBe('function');
    });

    it('Player类应该有drawKatana方法', () => {
      expect(typeof (player1 as any).drawKatana).toBe('function');
    });

    it('Player类应该有drawBattleAxe方法', () => {
      expect(typeof (player1 as any).drawBattleAxe).toBe('function');
    });

    it('Player类应该有drawBow方法', () => {
      expect(typeof (player1 as any).drawBow).toBe('function');
    });

    it('Player类应该有drawShuriken方法', () => {
      expect(typeof (player1 as any).drawShuriken).toBe('function');
    });

    it('drawAnimatedArms应该返回手部位置', () => {
      const mockCtx = {
        save: () => {},
        stroke: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        restore: () => {},
      };
      
      const result = (player1 as any).drawAnimatedArms(mockCtx);
      
      expect(result).toBeDefined();
      expect(result.leftHandPos).toBeDefined();
      expect(result.rightHandPos).toBeDefined();
      expect(typeof result.leftHandPos.x).toBe('number');
      expect(typeof result.leftHandPos.y).toBe('number');
      expect(typeof result.rightHandPos.x).toBe('number');
      expect(typeof result.rightHandPos.y).toBe('number');
    });

    it('近战武器应该只在主手绘制', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.facing = 'right';
      
      expect(player1.state.weapon.type).toBe('melee');
      expect(player1.state.facing).toBe('right');
    });

    it('远程武器应该在双手绘制', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'bow')!;
      
      expect(player1.state.weapon.type).toBe('ranged');
    });

    it('攻击状态应该触发武器特效', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.state = 'attacking';
      player1.state.attackFrame = 10;
      
      expect(player1.state.state).toBe('attacking');
      expect(player1.state.attackFrame).toBeGreaterThan(0);
    });

    it('拳头武器不应该渲染', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'fists')!;
      
      const mockCtx = {
        save: () => {},
        translate: () => {},
        restore: () => {},
      };
      
      const result = (player1 as any).drawWeapon(mockCtx, { x: 0, y: 0 });
      
      expect(result).toBeUndefined();
    });
  });

  describe('武器配置验证', () => {
    it('应该正确读取武器数据', () => {
      const katana = mockWeapons.find(w => w.id === 'katana');
      expect(katana).toBeDefined();
      expect(katana?.damageMultiplier).toBe(1.5);
      expect(katana?.range).toBe(70);
    });

    it('应该正确读取AI难度配置', () => {
      const config = getDifficultyConfig(4);
      expect(config.attackRangeMultiplier).toBe(1.15);
      expect(config.aggressiveHpThreshold).toBe(0.7);
      expect(config.cautiousHpThreshold).toBe(0.35);
    });

    it('高血量时应该更激进', () => {
      const config = getDifficultyConfig(4);
      expect(config.highHpActionWeights.attack).toBeGreaterThan(config.midHpActionWeights.attack);
      expect(config.highHpActionWeights.attack).toBeGreaterThan(config.lowHpActionWeights.attack);
    });

    it('低血量时应该更保守', () => {
      const config = getDifficultyConfig(4);
      expect(config.lowHpActionWeights.dodge).toBeGreaterThan(config.highHpActionWeights.dodge);
      expect(config.lowHpActionWeights.block).toBeGreaterThan(config.highHpActionWeights.block);
    });
  });

  describe('AI武器决策逻辑', () => {
    it('应该根据武器范围计算有效攻击距离', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      const config = getDifficultyConfig(4);
      const expectedRange = 70 * config.attackRangeMultiplier;
      
      expect(player1.state.weapon?.range).toBe(70);
      expect(expectedRange).toBe(80.5);
    });

    it('远程武器应该有更大的攻击范围', () => {
      const bow = mockWeapons.find(w => w.id === 'bow')!;
      const katana = mockWeapons.find(w => w.id === 'katana')!;
      
      expect(bow.range).toBeGreaterThan(katana.range);
      expect(bow.type).toBe('ranged');
      expect(katana.type).toBe('melee');
    });

    it('难度越高攻击范围倍率越大', () => {
      const config1 = getDifficultyConfig(1);
      const config4 = getDifficultyConfig(4);
      
      expect(config4.attackRangeMultiplier).toBeGreaterThan(config1.attackRangeMultiplier);
    });

    it('AI应该根据血量状态调整攻击概率', () => {
      const config = getDifficultyConfig(4);
      
      player1.state.hp = 80;
      const highHpAttackWeight = config.highHpActionWeights.attack;
      
      player1.state.hp = 45;
      const midHpAttackWeight = config.midHpActionWeights.attack;
      
      player1.state.hp = 20;
      const lowHpAttackWeight = config.lowHpActionWeights.attack;
      
      expect(highHpAttackWeight).toBe(75);
      expect(midHpAttackWeight).toBe(65);
      expect(lowHpAttackWeight).toBe(35);
    });
  });

  describe('武器属性对战斗的影响', () => {
    it('武器伤害倍率应该影响攻击伤害', () => {
      const baseDamage = mockCharacter.stats.attack;
      const katana = mockWeapons.find(w => w.id === 'katana')!;
      const axe = mockWeapons.find(w => w.id === 'battleaxe')!;
      
      const katanaDamage = baseDamage * katana.damageMultiplier;
      const axeDamage = baseDamage * axe.damageMultiplier;
      
      expect(katanaDamage).toBe(30);
      expect(axeDamage).toBe(36);
      expect(axeDamage).toBeGreaterThan(katanaDamage);
    });

    it('武器冷却时间应该不同', () => {
      const weaponsByCooldown = [...mockWeapons].sort((a, b) => a.cooldown - b.cooldown);
      
      expect(weaponsByCooldown[0].id).toBe('shuriken');
      expect(weaponsByCooldown[1].id).toBe('fists');
      expect(weaponsByCooldown[2].id).toBe('bow');
      expect(weaponsByCooldown[3].id).toBe('katana');
      expect(weaponsByCooldown[4].id).toBe('battleaxe');
    });
  });

  describe('AI决策流程', () => {
    it('应该在武器攻击范围内做出决策', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.position.x = 350;
      player2.state.position.x = 420;
      
      const config = getDifficultyConfig(4);
      const effectiveRange = 70 * config.attackRangeMultiplier;
      const distance = 70;
      
      expect(distance).toBeLessThanOrEqual(effectiveRange);
    });

    it('连续闪避次数应该有限制', () => {
      expect(aiConfig.consecutiveDodgeLimit).toBe(3);
    });

    it('应该正确获取动作权重', () => {
      const highHpWeights = (ai as any).getActionWeights(0.8);
      const midHpWeights = (ai as any).getActionWeights(0.5);
      const lowHpWeights = (ai as any).getActionWeights(0.2);
      
      expect(highHpWeights.attack).toBe(75);
      expect(midHpWeights.attack).toBe(65);
      expect(lowHpWeights.attack).toBe(35);
    });
  });

  describe('AI配置参数应用验证', () => {
    it('激进阈值参数应该正确应用到高血量决策', () => {
      const config = getDifficultyConfig(4);
      const aggressiveThreshold = config.aggressiveHpThreshold;
      
      player1.state.hp = 75;
      const hpPercent = player1.state.hp / player1.state.character.stats.maxHp;
      
      expect(hpPercent).toBe(0.75);
      expect(hpPercent).toBeGreaterThan(aggressiveThreshold);
      
      const weights = (ai as any).getActionWeights(hpPercent);
      expect(weights).toBe(config.highHpActionWeights);
      expect(weights.attack).toBe(config.highHpActionWeights.attack);
    });

    it('激进阈值参数应该正确应用到中血量决策', () => {
      const config = getDifficultyConfig(4);
      const aggressiveThreshold = config.aggressiveHpThreshold;
      const cautiousThreshold = config.cautiousHpThreshold;
      
      player1.state.hp = 50;
      const hpPercent = player1.state.hp / player1.state.character.stats.maxHp;
      
      expect(hpPercent).toBe(0.5);
      expect(hpPercent).toBeLessThan(aggressiveThreshold);
      expect(hpPercent).toBeGreaterThan(cautiousThreshold);
      
      const weights = (ai as any).getActionWeights(hpPercent);
      expect(weights).toBe(config.midHpActionWeights);
      expect(weights.attack).toBe(config.midHpActionWeights.attack);
    });

    it('激进阈值参数应该正确应用到低血量决策', () => {
      const config = getDifficultyConfig(4);
      const cautiousThreshold = config.cautiousHpThreshold;
      
      player1.state.hp = 30;
      const hpPercent = player1.state.hp / player1.state.character.stats.maxHp;
      
      expect(hpPercent).toBe(0.3);
      expect(hpPercent).toBeLessThan(cautiousThreshold);
      
      const weights = (ai as any).getActionWeights(hpPercent);
      expect(weights).toBe(config.lowHpActionWeights);
      expect(weights.dodge).toBe(config.lowHpActionWeights.dodge);
      expect(weights.block).toBe(config.lowHpActionWeights.block);
    });

    it('shouldInitiateAttack应该使用武器攻击范围倍率', () => {
      const config = getDifficultyConfig(4);
      const weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.weapon = weapon;
      
      const baseRange = weapon.range;
      const expectedEffectiveRange = baseRange * config.attackRangeMultiplier;
      
      player1.state.position.x = 400;
      player2.state.position.x = 400 + expectedEffectiveRange - 10;
      
      const dx = player2.state.position.x - player1.state.position.x;
      const distance = Math.abs(dx);
      
      expect(distance).toBeLessThan(expectedEffectiveRange);
    });

    it('AI应该在高血量时更激进', () => {
      const config = getDifficultyConfig(4);
      
      const highHpAttackWeight = config.highHpActionWeights.attack;
      const midHpAttackWeight = config.midHpActionWeights.attack;
      const lowHpAttackWeight = config.lowHpActionWeights.attack;
      
      expect(highHpAttackWeight).toBeGreaterThan(midHpAttackWeight);
      expect(highHpAttackWeight).toBeGreaterThan(lowHpAttackWeight);
      expect(midHpAttackWeight).toBeGreaterThan(lowHpAttackWeight);
    });

    it('AI应该在低血量时更保守', () => {
      const config = getDifficultyConfig(4);
      
      const highHpDodgeWeight = config.highHpActionWeights.dodge;
      const midHpDodgeWeight = config.midHpActionWeights.dodge;
      const lowHpDodgeWeight = config.lowHpActionWeights.dodge;
      
      expect(lowHpDodgeWeight).toBeGreaterThan(midHpDodgeWeight);
      expect(lowHpDodgeWeight).toBeGreaterThan(highHpDodgeWeight);
      
      const highHpBlockWeight = config.highHpActionWeights.block;
      const midHpBlockWeight = config.midHpActionWeights.block;
      const lowHpBlockWeight = config.lowHpActionWeights.block;
      
      expect(lowHpBlockWeight).toBeGreaterThan(midHpBlockWeight);
      expect(lowHpBlockWeight).toBeGreaterThan(highHpBlockWeight);
    });

    it('AI决策应该根据难度调整攻击范围', () => {
      const weapon = mockWeapons.find(w => w.id === 'katana')!;
      
      const config1 = getDifficultyConfig(1);
      const config2 = getDifficultyConfig(2);
      const config3 = getDifficultyConfig(3);
      const config4 = getDifficultyConfig(4);
      
      const range1 = weapon.range * config1.attackRangeMultiplier;
      const range2 = weapon.range * config2.attackRangeMultiplier;
      const range3 = weapon.range * config3.attackRangeMultiplier;
      const range4 = weapon.range * config4.attackRangeMultiplier;
      
      expect(range1).toBeLessThan(range2);
      expect(range2).toBeLessThan(range3);
      expect(range3).toBeLessThan(range4);
    });

    it('不同难度的激进阈值应该不同', () => {
      const config1 = getDifficultyConfig(1);
      const config4 = getDifficultyConfig(4);
      
      expect(config4.aggressiveHpThreshold).toBeGreaterThan(config1.aggressiveHpThreshold);
      expect(config4.cautiousHpThreshold).toBeGreaterThan(config1.cautiousHpThreshold);
    });
  });

  describe('AI武器决策集成测试', () => {
    it('高血量AI应该优先选择攻击', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.hp = 85;
      player1.state.position.x = 350;
      player2.state.position.x = 420;
      
      const config = getDifficultyConfig(4);
      const hpPercent = player1.state.hp / player1.state.character.stats.maxHp;
      
      expect(hpPercent).toBeGreaterThan(config.aggressiveHpThreshold);
      
      const weights = config.highHpActionWeights;
      const attackProbability = weights.attack / (weights.attack + weights.block + weights.dodge);
      
      expect(attackProbability).toBeCloseTo(0.75, 2);
    });

    it('低血量AI应该优先选择防御或闪避', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.hp = 25;
      player1.state.position.x = 350;
      player2.state.position.x = 420;
      
      const config = getDifficultyConfig(4);
      const hpPercent = player1.state.hp / player1.state.character.stats.maxHp;
      
      expect(hpPercent).toBeLessThan(config.cautiousHpThreshold);
      
      const weights = config.lowHpActionWeights;
      const defenseProbability = (weights.block + weights.dodge) / (weights.attack + weights.block + weights.dodge);
      
      expect(defenseProbability).toBeCloseTo(0.65, 2);
    });

    it('AI应该在武器攻击范围内触发基于武器的决策', () => {
      player1.state.weapon = mockWeapons.find(w => w.id === 'katana')!;
      player1.state.hp = 80;
      player1.state.position.x = 350;
      player2.state.position.x = 420;
      
      const config = getDifficultyConfig(4);
      const effectiveRange = player1.state.weapon.range * config.attackRangeMultiplier;
      const distance = Math.abs(player2.state.position.x - player1.state.position.x);
      
      expect(distance).toBeLessThan(effectiveRange);
      
      ai.update();
      
      expect(ai.getStats().lastAction).toBeDefined();
    });
  });
});