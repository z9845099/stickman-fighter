import { Player } from './Player';
import { AdvancedAI } from './AdvancedAI';
import { Character, Weapon } from '../types';
import { getDifficultyConfig } from '../config/aiConfig';

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

const testWeapons: Weapon[] = [
  { id: 'katana', name: '武士刀', type: 'melee', damageMultiplier: 1.5, range: 70, cooldown: 0.5 },
  { id: 'battleaxe', name: '战斧', type: 'melee', damageMultiplier: 1.8, range: 60, cooldown: 0.7 },
  { id: 'bow', name: '弓箭', type: 'ranged', damageMultiplier: 1.2, range: 200, cooldown: 0.4 },
];

const hpLevels = [
  { name: '高血量(80%)', hp: 80 },
  { name: '中血量(50%)', hp: 50 },
  { name: '低血量(30%)', hp: 30 },
];

interface WeaponTestResult {
  weaponName: string;
  weaponType: string;
  weaponRange: number;
  hpLevel: string;
  hpPercent: number;
  attackCount: number;
  blockCount: number;
  dodgeCount: number;
  totalDecisions: number;
  attackRate: number;
  blockRate: number;
  dodgeRate: number;
}

export async function runWeaponTest(difficulty: number = 4, iterations: number = 1000): Promise<WeaponTestResult[]> {
  const results: WeaponTestResult[] = [];
  const config = getDifficultyConfig(difficulty);

  console.log(`\n=== 武器AI决策测试 ===`);
  console.log(`难度等级: ${difficulty}`);
  console.log(`测试次数: ${iterations}`);
  console.log(`激进阈值: ${(config.aggressiveHpThreshold * 100).toFixed(0)}%`);
  console.log(`谨慎阈值: ${(config.cautiousHpThreshold * 100).toFixed(0)}%`);
  console.log('='.repeat(80));

  for (const weapon of testWeapons) {
    console.log(`\n🔫 测试武器: ${weapon.name} (${weapon.type}, 攻击范围: ${weapon.range})`);

    for (const hpLevel of hpLevels) {
      let attackCount = 0;
      let blockCount = 0;
      let dodgeCount = 0;

      for (let i = 0; i < iterations; i++) {
        const player1 = new Player(mockCharacter, { ...weapon }, 350, 300);
        const player2 = new Player(mockCharacter, null, 350 + weapon.range - 10, 300);
        const ai = new AdvancedAI(player1, player2, difficulty);

        player1.state.hp = hpLevel.hp;

        const effectiveRange = weapon.range * config.attackRangeMultiplier;
        const distance = Math.abs(player2.state.position.x - player1.state.position.x);

        if (distance <= effectiveRange && distance > 30) {
          ai.update();
          const lastAction = ai.getStats().lastAction;

          if (lastAction === 'attack') attackCount++;
          else if (lastAction === 'block') blockCount++;
          else if (lastAction === 'dodge') dodgeCount++;
        }
      }

      const totalDecisions = attackCount + blockCount + dodgeCount;
      const attackRate = totalDecisions > 0 ? (attackCount / totalDecisions) * 100 : 0;
      const blockRate = totalDecisions > 0 ? (blockCount / totalDecisions) * 100 : 0;
      const dodgeRate = totalDecisions > 0 ? (dodgeCount / totalDecisions) * 100 : 0;

      results.push({
        weaponName: weapon.name,
        weaponType: weapon.type,
        weaponRange: weapon.range,
        hpLevel: hpLevel.name,
        hpPercent: hpLevel.hp / 100,
        attackCount,
        blockCount,
        dodgeCount,
        totalDecisions,
        attackRate,
        blockRate,
        dodgeRate,
      });

      console.log(`  ${hpLevel.name}:`);
      console.log(`    攻击: ${attackCount}次 (${attackRate.toFixed(1)}%)`);
      console.log(`    防御: ${blockCount}次 (${blockRate.toFixed(1)}%)`);
      console.log(`    闪避: ${dodgeCount}次 (${dodgeRate.toFixed(1)}%)`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 测试完成！');

  return results;
}

export function generateTestReport(results: WeaponTestResult[]): string {
  let report = '武器AI决策测试报告\n';
  report += '='.repeat(80) + '\n\n';

  const weapons = [...new Set(results.map(r => r.weaponName))];
  const hpLevels = [...new Set(results.map(r => r.hpLevel))];

  for (const weapon of weapons) {
    report += `## 🔫 ${weapon}\n\n`;
    report += `| 血量状态 | 攻击率 | 防御率 | 闪避率 |\n`;
    report += `|---------|-------|-------|-------|\n`;

    const weaponResults = results.filter(r => r.weaponName === weapon);
    for (const hp of hpLevels) {
      const result = weaponResults.find(r => r.hpLevel === hp);
      if (result) {
        report += `| ${hp} | ${result.attackRate.toFixed(1)}% | ${result.blockRate.toFixed(1)}% | ${result.dodgeRate.toFixed(1)}% |\n`;
      }
    }
    report += '\n';
  }

  report += '## 📈 分析\n\n';
  report += '1. **武器范围影响**: 远程武器(弓箭)由于攻击范围大，更容易在更远距离发起攻击\n';
  report += '2. **血量影响**: 高血量时AI更激进，低血量时更保守\n';
  report += '3. **难度影响**: 难度越高，攻击范围越大，决策越精准\n';

  return report;
}

export async function main() {
  const results = await runWeaponTest(4, 1000);
  console.log('\n' + generateTestReport(results));
}