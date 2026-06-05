import { describe, it, expect } from 'vitest';
import { getDifficultyConfig } from '../config/aiConfig';

interface TestWeapon {
  id: string;
  name: string;
  type: string;
  range: number;
}

const testWeapons: TestWeapon[] = [
  { id: 'katana', name: '武士刀', type: 'melee', range: 70 },
  { id: 'battleaxe', name: '战斧', type: 'melee', range: 60 },
  { id: 'bow', name: '弓箭', type: 'ranged', range: 200 },
];

const hpLevels = [
  { name: '高血量(80%)', hp: 80, hpPercent: 0.8 },
  { name: '中血量(50%)', hp: 50, hpPercent: 0.5 },
  { name: '低血量(30%)', hp: 30, hpPercent: 0.3 },
];

describe('武器AI决策测试', () => {
  const difficulty = 4;
  const config = getDifficultyConfig(difficulty);

  it('测试配置参数是否正确', () => {
    console.log(`\n=== 配置参数验证 ===`);
    console.log(`难度等级: ${difficulty}`);
    console.log(`激进阈值: ${(config.aggressiveHpThreshold * 100).toFixed(0)}%`);
    console.log(`谨慎阈值: ${(config.cautiousHpThreshold * 100).toFixed(0)}%`);
    console.log('='.repeat(80));

    console.log('\n📊 动作权重配置:');
    console.log(`高血量(>70%): 攻击=${config.highHpActionWeights.attack}%, 防御=${config.highHpActionWeights.block}%, 闪避=${config.highHpActionWeights.dodge}%`);
    console.log(`中血量(35%-70%): 攻击=${config.midHpActionWeights.attack}%, 防御=${config.midHpActionWeights.block}%, 闪避=${config.midHpActionWeights.dodge}%`);
    console.log(`低血量(<35%): 攻击=${config.lowHpActionWeights.attack}%, 防御=${config.lowHpActionWeights.block}%, 闪避=${config.lowHpActionWeights.dodge}%`);

    expect(config.aggressiveHpThreshold).toBe(0.7);
    expect(config.cautiousHpThreshold).toBe(0.35);
    expect(config.midHpActionWeights.attack).toBe(65);
  });

  it('测试不同血量下的动作权重', () => {
    console.log(`\n=== 血量状态测试 ===`);

    const hpTests = [
      { hp: 80, expectedWeights: 'highHpActionWeights', expectedAttack: 75 },
      { hp: 50, expectedWeights: 'midHpActionWeights', expectedAttack: 65 },
      { hp: 30, expectedWeights: 'lowHpActionWeights', expectedAttack: 35 },
    ];

    for (const test of hpTests) {
      const hpPercent = test.hp / 100;
      const weights = hpPercent > config.aggressiveHpThreshold 
        ? config.highHpActionWeights 
        : hpPercent > config.cautiousHpThreshold 
          ? config.midHpActionWeights 
          : config.lowHpActionWeights;

      console.log(`\n血量 ${test.hp}% (${test.expectedWeights}):`);
      console.log(`  攻击权重: ${weights.attack} (期望: ${test.expectedAttack})`);
      console.log(`  防御权重: ${weights.block}`);
      console.log(`  闪避权重: ${weights.dodge}`);

      expect(weights.attack).toBe(test.expectedAttack);
    }
  });

  it('验证中血量攻击概率提升', () => {
    const hpLevel = 50;
    const hpPercent = hpLevel / 100;
    
    expect(hpPercent).toBe(0.5);
    expect(hpPercent).toBeLessThan(config.aggressiveHpThreshold);
    expect(hpPercent).toBeGreaterThan(config.cautiousHpThreshold);

    const weights = config.midHpActionWeights;
    const attackProbability = weights.attack / (weights.attack + weights.block + weights.dodge);
    
    console.log(`\n🎯 中血量(50%)攻击概率: ${(attackProbability * 100).toFixed(1)}%`);
    
    expect(attackProbability * 100).toBeGreaterThan(60);
  });

  it('测试武器攻击范围影响', () => {
    console.log(`\n=== 武器范围测试 ===`);

    for (const weapon of testWeapons) {
      const effectiveRange = weapon.range * config.attackRangeMultiplier;
      console.log(`\n${weapon.name}: 基础范围=${weapon.range}, 有效范围=${effectiveRange.toFixed(1)}`);
      
      expect(effectiveRange).toBeGreaterThan(weapon.range);
    }

    const meleeWeapon = testWeapons.find(w => w.id === 'katana')!;
    const rangedWeapon = testWeapons.find(w => w.id === 'bow')!;
    
    expect(rangedWeapon.range).toBeGreaterThan(meleeWeapon.range);
    
    const meleeEffective = meleeWeapon.range * config.attackRangeMultiplier;
    const rangedEffective = rangedWeapon.range * config.attackRangeMultiplier;
    
    console.log(`\n武士刀有效范围: ${meleeEffective.toFixed(1)}`);
    console.log(`弓箭有效范围: ${rangedEffective.toFixed(1)}`);
    
    expect(rangedEffective).toBeGreaterThan(meleeEffective);
  });

  it('模拟AI决策概率分布', () => {
    console.log(`\n=== 决策概率模拟 ===`);
    const iterations = 10000;

    for (const hpLevel of hpLevels) {
      let attackCount = 0;
      let blockCount = 0;
      let dodgeCount = 0;

      const hpPercent = hpLevel.hpPercent;
      const weights = hpPercent > config.aggressiveHpThreshold 
        ? config.highHpActionWeights 
        : hpPercent > config.cautiousHpThreshold 
          ? config.midHpActionWeights 
          : config.lowHpActionWeights;

      const totalWeight = weights.attack + weights.block + weights.dodge;

      for (let i = 0; i < iterations; i++) {
        const random = Math.random() * totalWeight;
        let cumulative = 0;

        cumulative += weights.attack;
        if (random < cumulative) {
          attackCount++;
          continue;
        }

        cumulative += weights.block;
        if (random < cumulative) {
          blockCount++;
          continue;
        }

        dodgeCount++;
      }

      const attackRate = (attackCount / iterations) * 100;
      const blockRate = (blockCount / iterations) * 100;
      const dodgeRate = (dodgeCount / iterations) * 100;

      console.log(`\n${hpLevel.name}:`);
      console.log(`  攻击: ${attackRate.toFixed(1)}% (期望: ${((weights.attack / totalWeight) * 100).toFixed(1)}%)`);
      console.log(`  防御: ${blockRate.toFixed(1)}% (期望: ${((weights.block / totalWeight) * 100).toFixed(1)}%)`);
      console.log(`  闪避: ${dodgeRate.toFixed(1)}% (期望: ${((weights.dodge / totalWeight) * 100).toFixed(1)}%)`);

      const expectedAttack = (weights.attack / totalWeight) * 100;
      const expectedBlock = (weights.block / totalWeight) * 100;
      const expectedDodge = (weights.dodge / totalWeight) * 100;
      
      expect(attackRate).toBeGreaterThanOrEqual(expectedAttack - 2);
      expect(attackRate).toBeLessThanOrEqual(expectedAttack + 2);
      expect(blockRate).toBeGreaterThanOrEqual(expectedBlock - 2);
      expect(blockRate).toBeLessThanOrEqual(expectedBlock + 2);
      expect(dodgeRate).toBeGreaterThanOrEqual(expectedDodge - 2);
      expect(dodgeRate).toBeLessThanOrEqual(expectedDodge + 2);
    }
  });
});