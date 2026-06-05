import { Player } from './Player';
import { aiConfig, getDifficultyConfig } from '../config/aiConfig';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export interface AIData {
  dodgeAttempts: number;
  dodgeSuccesses: number;
  attackCount: number;
  dodgeRate: number;
  lastAction: string;
}

export class AdvancedAI {
  player: Player;
  opponent: Player;
  difficulty: number;
  decisionTimer: number;
  currentAction: 'idle' | 'move' | 'attack' | 'skill1' | 'skill2' | 'dodge' | 'backward' | 'escape_corner' | 'desperate_attack';
  private actionScores: Map<string, number>;
  private dodgeCooldown: number;
  private skillCooldown: number;
  private stats: AIData;
  private consecutiveDodges: number;
  private lastOpponentAttackFrame: number;
  private frameCount: number;

  constructor(player: Player, opponent: Player, difficulty: number = 2) {
    this.player = player;
    this.opponent = opponent;
    this.difficulty = difficulty;
    this.decisionTimer = 0;
    this.currentAction = 'idle';
    this.actionScores = new Map();
    this.dodgeCooldown = 0;
    this.skillCooldown = 0;
    this.frameCount = 0;
    this.lastOpponentAttackFrame = -100;
    
    this.stats = {
      dodgeAttempts: 0,
      dodgeSuccesses: 0,
      attackCount: 0,
      dodgeRate: 0,
      lastAction: 'idle'
    };
    
    this.consecutiveDodges = 0;
  }

  update() {
    this.frameCount++;
    
    if (this.dodgeCooldown > 0) this.dodgeCooldown--;
    if (this.skillCooldown > 0) this.skillCooldown--;

    try {
      const hpPercent = this.player.state.hp / this.player.state.character.stats.maxHp;
      if (hpPercent <= 0) {
        this.player.input.up = false;
        this.player.input.down = false;
        this.player.input.left = false;
        this.player.input.right = false;
        this.player.input.attack = false;
        this.player.input.skill1 = false;
        this.player.input.skill2 = false;
        this.player.input.dodge = false;
        return;
      }

      this.updateFacing();

      if (this.decisionTimer >= this.getDecisionInterval()) {
        this.makeDecision();
        this.decisionTimer = 0;
      }

      this.executeAction();
    } catch (error) {
      console.error('AI Update Error:', error);
      this.player.input.up = false;
      this.player.input.down = false;
      this.player.input.left = false;
      this.player.input.right = false;
      this.player.input.attack = false;
      this.player.input.skill1 = false;
      this.player.input.skill2 = false;
      this.player.input.dodge = false;
    }
    
    this.decisionTimer++;
  }

  getStats(): AIData {
    return {
      ...this.stats,
      dodgeRate: this.stats.dodgeAttempts > 0 
        ? Math.round((this.stats.dodgeSuccesses / this.stats.dodgeAttempts) * 100) 
        : 0
    };
  }

  private getDecisionInterval(): number {
    const config = getDifficultyConfig(this.difficulty);
    return config.decisionInterval;
  }

  private updateFacing() {
    try {
      const dx = this.opponent.state.position.x - this.player.state.position.x;
      if (dx > 0 && this.player.state.facing !== 'right') {
        this.player.state.facing = 'right';
      } else if (dx < 0 && this.player.state.facing !== 'left') {
        this.player.state.facing = 'left';
      }
    } catch {
      // ignore
    }
  }

  private isInCorner(): boolean {
    const margin = 60;
    const x = this.player.state.position.x;
    const y = this.player.state.position.y;
    
    const nearLeft = x < margin;
    const nearRight = x > CANVAS_WIDTH - margin;
    const nearTop = y < margin;
    const nearBottom = y > CANVAS_HEIGHT - margin;
    
    return (nearLeft || nearRight) && (nearTop || nearBottom);
  }

  private makeDecision() {
    const state = this.getState();

    // 角落逃脱优先级最高
    if (this.isInCorner() && state.distance < 100) {
      this.currentAction = 'escape_corner';
      return;
    }

    // 被逼到墙边时的绝望反击
    if (this.isTrapped(state)) {
      this.currentAction = 'desperate_attack';
      return;
    }

    if (this.needCounterAttack(state)) {
      this.currentAction = 'attack';
      return;
    }

    if (this.needEmergencyDodge(state)) {
      this.currentAction = 'dodge';
      this.stats.dodgeAttempts++;
      return;
    }

    if (this.needEmergencyRetreat(state)) {
      this.currentAction = 'backward';
      return;
    }

    if (this.shouldInitiateAttack(state)) {
      this.currentAction = 'attack';
      return;
    }

    if (this.shouldUseWeaponBasedDecision(state)) {
      return;
    }

    this.evaluateActions(state);
    this.currentAction = this.selectBestAction();
    
    this.stats.lastAction = this.currentAction;
  }

  private isTrapped(state: any): boolean {
    const margin = 50;
    const x = this.player.state.position.x;
    const y = this.player.state.position.y;
    
    const nearWall = x < margin || x > CANVAS_WIDTH - margin || y < margin || y > CANVAS_HEIGHT - margin;
    const lowHp = state.ownHp / state.maxHp < 0.4;
    const closeEnemy = state.distance < 80;
    
    return nearWall && lowHp && closeEnemy;
  }

  private shouldUseWeaponBasedDecision(state: any): boolean {
    const config = getDifficultyConfig(this.difficulty);
    const weapon = this.player.state.weapon;
    const weaponRange = weapon?.range || 70;
    const effectiveRange = weaponRange * config.attackRangeMultiplier;

    if (state.distance <= effectiveRange && state.distance > 20) {
      const hpPercent = state.ownHp / state.maxHp;
      const weights = this.getActionWeights(hpPercent);
      
      let attackPriority = this.calculateWeaponAttackPriority(state, weapon);
      const totalWeight = attackPriority + weights.block + weights.dodge;
      
      const random = Math.random() * totalWeight;
      let cumulative = 0;
      
      cumulative += attackPriority;
      if (random < cumulative && state.canAttack) {
        this.currentAction = 'attack';
        this.stats.lastAction = 'attack';
        return true;
      }
      
      cumulative += weights.block;
      if (random < cumulative) {
        this.currentAction = 'idle';
        this.stats.lastAction = 'block';
        return true;
      }
      
      cumulative += weights.dodge;
      if (random < cumulative && this.dodgeCooldown === 0 && this.consecutiveDodges < aiConfig.consecutiveDodgeLimit) {
        this.currentAction = 'dodge';
        this.stats.dodgeAttempts++;
        this.stats.lastAction = 'dodge';
        return true;
      }
    }
    
    return false;
  }

  private calculateWeaponAttackPriority(state: any, weapon: any): number {
    const basePriority = 30;
    let priority = basePriority;
    
    if (!weapon) return priority;
    
    const distanceBonus = Math.max(0, (weapon.range - state.distance) / weapon.range) * 20;
    priority += distanceBonus;
    
    if (weapon.type === 'bow') {
      if (state.distance > 50) {
        priority += 15;
      } else {
        priority -= 10;
      }
    } else if (weapon.type === 'sword') {
      if (state.distance < 50) {
        priority += 15;
      }
    } else if (weapon.type === 'axe') {
      if (state.distance < 45) {
        priority += 20;
      }
    } else if (weapon.type === 'spear') {
      if (state.distance > 40 && state.distance < 80) {
        priority += 18;
      }
    }
    
    if (weapon.damage > 25) {
      priority += 10;
    }
    
    if (state.opponentState === 'hurt') {
      priority += 20;
    }
    
    return priority;
  }

  private getActionWeights(hpPercent: number) {
    const config = getDifficultyConfig(this.difficulty);
    
    if (hpPercent > config.aggressiveHpThreshold) {
      return config.highHpActionWeights;
    } else if (hpPercent > config.cautiousHpThreshold) {
      return config.midHpActionWeights;
    } else {
      return config.lowHpActionWeights;
    }
  }

  private shouldInitiateAttack(state: any): boolean {
    const config = getDifficultyConfig(this.difficulty);
    const weaponRange = this.player.state.weapon?.range || 70;
    const ATTACK_RANGE = weaponRange * config.attackRangeMultiplier;
    
    if (state.distance < ATTACK_RANGE && state.distance > 30 && state.canAttack) {
      if (state.opponentState === 'attacking') return false;
      
      const hpPercent = state.ownHp / state.maxHp;
      let baseProbability = 0.3;
      
      if (hpPercent > config.aggressiveHpThreshold) {
        baseProbability = 0.5;
      } else if (hpPercent > config.cautiousHpThreshold) {
        baseProbability = 0.35;
      } else {
        baseProbability = 0.2;
      }
      
      const attackProbability = baseProbability + ((ATTACK_RANGE - state.distance) / ATTACK_RANGE) * 0.5;
      return Math.random() < attackProbability;
    }
    
    return false;
  }

  private getState() {
    try {
      const dx = this.opponent.state.position.x - this.player.state.position.x;
      const dy = this.opponent.state.position.y - this.player.state.position.y;

      return {
        distance: Math.sqrt(dx * dx + dy * dy),
        distanceY: Math.abs(dy),
        opponentState: this.opponent.state.state,
        opponentDirection: this.opponent.state.facing,
        ownHp: this.player.state.hp,
        maxHp: this.player.state.character.stats.maxHp,
        ownEnergy: this.player.state.energy,
        ownCooldowns: this.player.state.cooldowns,
        canAttack: this.player.state.state !== 'attacking' && this.player.state.state !== 'skill',
        canUseSkill1: this.player.state.character.skills[0] && this.player.canUseSkill(this.player.state.character.skills[0]),
        canUseSkill2: this.player.state.character.skills[1] && this.player.canUseSkill(this.player.state.character.skills[1]),
        isAttacking: this.player.state.state === 'attacking',
      };
    } catch (error) {
      return {
        distance: 100,
        distanceY: 0,
        opponentState: 'idle',
        opponentDirection: 'right',
        ownHp: this.player.state.character.stats.maxHp,
        maxHp: this.player.state.character.stats.maxHp,
        ownEnergy: 100,
        ownCooldowns: {},
        canAttack: true,
        canUseSkill1: false,
        canUseSkill2: false,
        isAttacking: false,
      };
    }
  }

  private needCounterAttack(state: any): boolean {
    if (!state.canAttack) return false;
    
    const framesSinceOpponentAttack = this.frameCount - this.lastOpponentAttackFrame;
    
    if (state.opponentState === 'attacking' || state.opponentState === 'skill') {
      if (this.lastOpponentAttackFrame !== this.frameCount) {
        this.lastOpponentAttackFrame = this.frameCount;
      }
    }
    
    if (framesSinceOpponentAttack > 5 && framesSinceOpponentAttack < 20) {
      if (state.distance < 85 && state.distance > 40) {
        const counterChance = 0.5 + (this.difficulty * 0.1);
        return Math.random() < counterChance;
      }
    }
    
    return false;
  }

  private needEmergencyDodge(state: any): boolean {
    if (state.opponentState !== 'attacking' && state.opponentState !== 'skill') return false;
    if (state.distance > 100) return false;
    if (this.dodgeCooldown > 0) return false;
    
    if (this.consecutiveDodges >= 3) {
      this.consecutiveDodges = 0;
      return false;
    }

    const dodgeChance = this.getDodgeChance();
    const dangerMultiplier = state.distance < 60 ? 1.3 : 1;
    return Math.random() < dodgeChance * dangerMultiplier;
  }

  private needEmergencyRetreat(state: any): boolean {
    const hpPercent = state.ownHp / state.maxHp;
    
    if (state.distance >= aiConfig.safeDistance) return false;
    if (hpPercent > aiConfig.emergencyRetreatHpThreshold) return false;
    if (this.isInCorner()) return false; // 在角落时不后退
    
    const retreatChance = 0.6 + (0.4 * (1 - hpPercent));
    return Math.random() < retreatChance;
  }

  private getDodgeChance(): number {
    const config = getDifficultyConfig(this.difficulty);
    return config.dodgeChance;
  }

  private evaluateActions(state: any) {
    this.actionScores.clear();

    let attackScore = 0;
    const hpPercent = state.ownHp / state.maxHp;
    const config = getDifficultyConfig(this.difficulty);
    
    if (state.distance < 90 && state.canAttack) {
      attackScore += 40;
      if (state.opponentState === 'hurt') attackScore += 30;
      if (state.opponentState === 'blocking') attackScore -= 15;
      if (state.distance < 50) attackScore -= 5;
      if (state.distance > 40 && state.distance < 75) attackScore += 15;
      
      if (hpPercent > 0.8) {
        attackScore += 25 * config.aggressionMultiplier;
      } else if (hpPercent > 0.6) {
        attackScore += 15 * config.aggressionMultiplier;
      }
    }
    this.actionScores.set('attack', attackScore);

    let skill1Score = 0;
    if (state.canUseSkill1 && this.skillCooldown === 0) {
      skill1Score += 45; // 提高技能评分
      if (state.ownEnergy > 40) skill1Score += 20;
      if (state.opponentState === 'hurt') skill1Score += 30;
      if (state.distance < 80 && state.distance > 40) skill1Score += 25;
    }
    this.actionScores.set('skill1', skill1Score);

    let skill2Score = 0;
    if (state.canUseSkill2 && this.skillCooldown === 0) {
      skill2Score += 50; // 提高技能评分
      if (state.ownEnergy > 60) skill2Score += 25;
      if (state.distance < 80 && state.distance > 40) skill2Score += 30;
    }
    this.actionScores.set('skill2', skill2Score);

    let moveScore = 0;
    if (state.distance > 120) {
      moveScore += 30;
    } else if (state.distance > 70 && state.distance < 120) {
      moveScore += 20;
    } else if (state.distance < 50) {
      moveScore += 15;
    }
    this.actionScores.set('move', moveScore);

    let backScore = 0;
    if (state.distance < 55 && !this.isInCorner()) {
      backScore += 15;
      if (hpPercent < 0.5) backScore += 20;
      if (hpPercent < 0.3) backScore += 10;
    }
    this.actionScores.set('backward', backScore);

    let dodgeScore = 0;
    if (state.opponentState === 'attacking' || state.opponentState === 'skill') {
      dodgeScore += 35;
      if (state.distance < 60) dodgeScore += 20;
      if (this.dodgeCooldown > 0) dodgeScore -= 100;
    }
    this.actionScores.set('dodge', dodgeScore);
  }

  private selectBestAction(): 'idle' | 'move' | 'attack' | 'skill1' | 'skill2' | 'dodge' | 'backward' | 'escape_corner' | 'desperate_attack' {
    let bestAction: 'idle' | 'move' | 'attack' | 'skill1' | 'skill2' | 'dodge' | 'backward' | 'escape_corner' | 'desperate_attack' = 'idle';
    let bestScore = -Infinity;

    const noiseFactor = (5 - this.difficulty) * 0.12;

    this.actionScores.forEach((score, action) => {
      const noisyScore = score + (Math.random() - 0.5) * noiseFactor * score;
      if (noisyScore > bestScore) {
        bestScore = noisyScore;
        bestAction = action as any;
      }
    });

    return bestAction;
  }

  private executeAction() {
    this.player.input.up = false;
    this.player.input.down = false;
    this.player.input.left = false;
    this.player.input.right = false;
    this.player.input.attack = false;
    this.player.input.skill1 = false;
    this.player.input.skill2 = false;
    this.player.input.dodge = false;

    try {
      const dx = this.opponent.state.position.x - this.player.state.position.x;
      const dy = this.opponent.state.position.y - this.player.state.position.y;

      switch (this.currentAction) {
        case 'move':
          this.executeSmartMove(dx, dy);
          break;

        case 'attack':
          this.executeAttack();
          break;

        case 'skill1':
          this.executeSkill(1);
          break;

        case 'skill2':
          this.executeSkill(2);
          break;

        case 'dodge':
          this.executeSmartDodge(dx, dy);
          break;

        case 'backward':
          this.executeBackward(dx, dy);
          break;

        case 'escape_corner':
          this.executeEscapeCorner();
          break;

        case 'desperate_attack':
          this.executeDesperateAttack(dx, dy);
          break;
      }
    } catch {
      // ignore
    }
  }

  private executeEscapeCorner() {
    const margin = 50;
    const x = this.player.state.position.x;
    const y = this.player.state.position.y;
    
    let escapeX = 0;
    let escapeY = 0;
    
    const distToLeft = x;
    const distToRight = CANVAS_WIDTH - x;
    const distToTop = y;
    const distToBottom = CANVAS_HEIGHT - y;
    
    const minDistX = Math.min(distToLeft, distToRight);
    const minDistY = Math.min(distToTop, distToBottom);
    
    if (minDistX < minDistY) {
      escapeX = distToLeft < distToRight ? 1 : -1;
      escapeY = (Math.random() > 0.5 ? 1 : -1) * 0.5;
    } else {
      escapeY = distToTop < distToBottom ? 1 : -1;
      escapeX = (Math.random() > 0.5 ? 1 : -1) * 0.5;
    }
    
    if (escapeY > 0) this.player.input.down = true;
    else if (escapeY < 0) this.player.input.up = true;
    
    if (escapeX > 0) this.player.input.right = true;
    else if (escapeX < 0) this.player.input.left = true;
    
    const escapeForce = 2 + (1 - Math.min(minDistX, minDistY) / margin);
    this.player.state.velocity.x += escapeX * escapeForce;
    this.player.state.velocity.y += escapeY * escapeForce;
  }

  private executeDesperateAttack(dx: number, dy: number) {
    const hpPercent = this.player.state.hp / this.player.state.character.stats.maxHp;
    
    if (this.player.canUseSkill(this.player.state.character.skills[0]) && hpPercent < 0.3) {
      this.player.input.skill1 = true;
      setTimeout(() => { if (this.player) this.player.input.skill1 = false; }, 50);
      return;
    }
    
    if (this.player.state.state !== 'attacking' && this.player.state.state !== 'skill') {
      this.player.input.attack = true;
      this.stats.attackCount++;
      setTimeout(() => {
        if (this.player) this.player.input.attack = false;
      }, 50);
    }
    
    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      const normX = dx / length;
      const normY = dy / length;
      
      this.player.state.velocity.x += normX * 1.2;
      this.player.state.velocity.y += normY * 1.2;
    }
  }

  private executeSmartMove(dx: number, dy: number) {
    const idealDistance = 70;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const margin = 50;
    
    if (currentDistance < 8) {
      return;
    }

    const x = this.player.state.position.x;
    const y = this.player.state.position.y;
    
    let canMoveLeft = x > margin;
    let canMoveRight = x < CANVAS_WIDTH - margin;
    let canMoveUp = y > margin;
    let canMoveDown = y < CANVAS_HEIGHT - margin;

    if (currentDistance > idealDistance) {
      if (dy < -12 && canMoveUp) this.player.input.up = true;
      else if (dy > 12 && canMoveDown) this.player.input.down = true;
      else if (dy < -12 && !canMoveUp && canMoveDown) this.player.input.down = true;
      else if (dy > 12 && !canMoveDown && canMoveUp) this.player.input.up = true;

      if (dx < 0 && canMoveLeft) this.player.input.left = true;
      else if (dx > 0 && canMoveRight) this.player.input.right = true;
      else if (dx < 0 && !canMoveLeft && canMoveRight) this.player.input.right = true;
      else if (dx > 0 && !canMoveRight && canMoveLeft) this.player.input.left = true;
    } else if (currentDistance < 40) {
      const retreatDirX = dx > 0 ? -1 : 1;
      const retreatDirY = dy > 0 ? -1 : 1;
      
      if (retreatDirX < 0 && canMoveLeft) this.player.input.left = true;
      else if (retreatDirX > 0 && canMoveRight) this.player.input.right = true;
      else if (retreatDirY < 0 && canMoveUp) this.player.input.up = true;
      else if (retreatDirY > 0 && canMoveDown) this.player.input.down = true;
    }
  }

  private executeAttack() {
    try {
      if (this.player.state.state !== 'attacking' && this.player.state.state !== 'skill') {
        this.player.input.attack = true;
        this.stats.attackCount++;
        setTimeout(() => {
          if (this.player) this.player.input.attack = false;
        }, 50);
      }
    } catch {
      // ignore
    }
  }

  private executeSkill(skillNum: number) {
    try {
      const skillId = this.player.state.character.skills[skillNum - 1];
      if (skillId && this.player.canUseSkill(skillId)) {
        if (skillNum === 1) {
          this.player.input.skill1 = true;
          setTimeout(() => { if (this.player) this.player.input.skill1 = false; }, 50);
        } else {
          this.player.input.skill2 = true;
          setTimeout(() => { if (this.player) this.player.input.skill2 = false; }, 50);
        }
        this.skillCooldown = 30;
      }
    } catch {
      // ignore
    }
  }

  private executeSmartDodge(dx: number, dy: number) {
    try {
      this.player.input.dodge = true;
      this.dodgeCooldown = 25;
      this.consecutiveDodges++;

      const dodgeAngle = Math.atan2(dy, dx);
      const perpendicularAngle = dodgeAngle + (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2;

      if (Math.sin(perpendicularAngle) < -0.3) this.player.input.up = true;
      else if (Math.sin(perpendicularAngle) > 0.3) this.player.input.down = true;

      if (Math.cos(perpendicularAngle) < -0.3) this.player.input.left = true;
      else if (Math.cos(perpendicularAngle) > 0.3) this.player.input.right = true;

      setTimeout(() => {
        if (this.player) {
          this.player.input.dodge = false;
          this.player.input.left = false;
          this.player.input.right = false;
          this.player.input.up = false;
          this.player.input.down = false;
          this.stats.dodgeSuccesses++;
        }
      }, 50);
    } catch {
      // ignore
    }
  }

  private executeBackward(dx: number, dy: number) {
    try {
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const distanceNeeded = aiConfig.emergencyRetreatDistance - currentDistance;
      const margin = 50;
      
      const x = this.player.state.position.x;
      const y = this.player.state.position.y;
      
      let canMoveLeft = x > margin;
      let canMoveRight = x < CANVAS_WIDTH - margin;
      let canMoveUp = y > margin;
      let canMoveDown = y < CANVAS_HEIGHT - margin;
      
      if (distanceNeeded > 0) {
        let direction = {
          x: -dx / currentDistance,
          y: -dy / currentDistance
        };
        
        const blockedX = (direction.x < 0 && !canMoveLeft) || (direction.x > 0 && !canMoveRight);
        const blockedY = (direction.y < 0 && !canMoveUp) || (direction.y > 0 && !canMoveDown);
        
        if (blockedX && blockedY) {
          if (canMoveLeft) direction.x = -1;
          else if (canMoveRight) direction.x = 1;
          if (canMoveUp) direction.y = -1;
          else if (canMoveDown) direction.y = 1;
        } else if (blockedX) {
          direction.x = 0;
          direction.y *= 1.5;
        } else if (blockedY) {
          direction.y = 0;
          direction.x *= 1.5;
        }
        
        const hpPercent = this.player.state.hp / this.player.state.character.stats.maxHp;
        const baseForce = aiConfig.emergencyRetreatSpeed;
        const hpMultiplier = hpPercent < 0.2 ? 2.5 : hpPercent < 0.35 ? 1.8 : 1.2;
        const distanceMultiplier = 1 + (distanceNeeded / aiConfig.emergencyRetreatDistance);
        const force = baseForce * hpMultiplier * distanceMultiplier;
        
        if (direction.y < -0.2 && canMoveUp) this.player.input.up = true;
        else if (direction.y > 0.2 && canMoveDown) this.player.input.down = true;
        
        if (direction.x < -0.2 && canMoveLeft) this.player.input.left = true;
        else if (direction.x > 0.2 && canMoveRight) this.player.input.right = true;
        
        this.player.state.velocity.x += direction.x * force;
        this.player.state.velocity.y += direction.y * force;
      }
    } catch {
      // ignore
    }
  }

  destroy() {
  }
}
