import { Character, CharacterState, InputState, AttackHitbox, Weapon, Skill, Projectile } from '../types';
import { getGameConfig, getSkillById, generateId } from '../utils/dataLoader';
import { MOVEMENT_CONFIG, KNOCKBACK_CONFIG, CHARACTER_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

const CONFIG = getGameConfig();

interface FrameData {
  timestamp: number;
  position: { x: number; y: number };
  armAngle: number;
  legAngle: number;
}

export class Player {
  state: CharacterState;
  input: InputState;
  attackHitbox: AttackHitbox | null = null;
  projectiles: Projectile[] = [];
  lastAttackTime: number = 0;
  attackBaseDamage: number = 0;
  attackRange: number = 60;
  screenShake: number = 0;
  
  trailFrames: FrameData[] = [];
  maxTrailFrames = 8;
  
  stretchFactor: number = 1;
  stretchDirection: { x: number; y: number } = { x: 0, y: 0 };

  constructor(character: Character, weapon: Weapon | null, startX: number, startY: number) {
    this.state = {
      character,
      weapon,
      hp: character.stats.maxHp,
      energy: character.stats.maxEnergy,
      position: { x: startX, y: startY },
      velocity: { x: 0, y: 0 },
      facing: startX < CANVAS_WIDTH / 2 ? 'right' : 'left',
      state: 'idle',
      attackFrame: 0,
      hurtFrame: 0,
      skillFrame: 0,
      blockFrame: 0,
      dodgeFrame: 0,
      jumpFrame: 0,
      rollFrame: 0,
      comboCount: 0,
      lastComboTime: 0,
      currentSkill: null,
      cooldowns: new Map<string, number>(),
      isInvincible: false,
      knockback: {
        velocity: { x: 0, y: 0 },
        duration: 0,
        remaining: 0,
        isActive: false,
      },
    };

    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      attack: false,
      skill1: false,
      skill2: false,
      block: false,
      dodge: false,
    };
  }

  isAttackActive(): boolean {
    return this.state.state === 'attacking' && this.state.attackFrame >= 4 && this.state.attackFrame <= 14;
  }

  isSkillActive(): boolean {
    return this.state.state === 'skill' && this.state.skillFrame >= 5;
  }

  canUseSkill(skillId: string): boolean {
    const skill = getSkillById(skillId);
    if (!skill) {
      console.log(`[DEBUG] Skill not found: ${skillId}`);
      return false;
    }

    if (this.state.energy < skill.energyCost) {
      console.log(`[DEBUG] Not enough energy for ${skill.name}: ${this.state.energy}/${skill.energyCost}`);
      return false;
    }

    const cooldownRemaining = this.state.cooldowns.get(skillId) || 0;
    if (cooldownRemaining > 0) {
      console.log(`[DEBUG] ${skill.name} on cooldown: ${cooldownRemaining.toFixed(1)}s`);
      return false;
    }

    if (this.state.state === 'attacking' || this.state.state === 'skill' || this.state.state === 'hurt' || this.state.state === 'dead') {
      console.log(`[DEBUG] Cannot use skill, current state: ${this.state.state}`);
      return false;
    }

    return true;
  }

  update(deltaTime: number) {
    if (this.state.state === 'dead') return;

    this.updateCooldowns(deltaTime);
    
    this.handleMovement();
    this.handleActions();
    this.applyKnockback(deltaTime);
    this.applyBoundary();
    this.updateEnergy();
    this.updateProjectiles();
    this.updateStretch();
  }

  private updateCooldowns(deltaTime: number) {
    this.state.cooldowns.forEach((remaining, skillId) => {
      const newRemaining = Math.max(0, remaining - deltaTime);
      if (newRemaining <= 0) {
        this.state.cooldowns.delete(skillId);
      } else {
        this.state.cooldowns.set(skillId, newRemaining);
      }
    });
  }

  private updateStretch() {
    const speed = Math.sqrt(this.state.velocity.x ** 2 + this.state.velocity.y ** 2);
    const baseStretch = 1 + speed * 0.05;
    this.stretchFactor = this.stretchFactor * 0.8 + baseStretch * 0.2;
    
    if (speed > 0.1) {
      this.stretchDirection = {
        x: this.state.velocity.x / speed,
        y: this.state.velocity.y / speed,
      };
    }
  }

  private handleMovement() {
    if (this.state.state === 'attacking' || this.state.state === 'skill' || this.state.state === 'hurt') {
      return;
    }

    const moveSpeed = this.state.character.stats.speed * 0.8;

    let dx = 0;
    let dy = 0;

    if (this.input.left) dx -= 1;
    if (this.input.right) dx += 1;
    if (this.input.up) dy -= 1;
    if (this.input.down) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;

      this.state.velocity.x += dx * moveSpeed * MOVEMENT_CONFIG.acceleration;
      this.state.velocity.y += dy * moveSpeed * MOVEMENT_CONFIG.acceleration;

      const currentSpeed = Math.sqrt(
        this.state.velocity.x ** 2 + this.state.velocity.y ** 2
      );
      if (currentSpeed > moveSpeed) {
        this.state.velocity.x = (this.state.velocity.x / currentSpeed) * moveSpeed;
        this.state.velocity.y = (this.state.velocity.y / currentSpeed) * moveSpeed;
      }

      if (this.state.state === 'idle' || this.state.state === 'running') {
        this.state.state = 'running';
      }
    } else {
      this.state.velocity.x *= MOVEMENT_CONFIG.deceleration;
      this.state.velocity.y *= MOVEMENT_CONFIG.deceleration;

      if (Math.abs(this.state.velocity.x) < MOVEMENT_CONFIG.minVelocity &&
          Math.abs(this.state.velocity.y) < MOVEMENT_CONFIG.minVelocity) {
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      if (this.state.state === 'running') {
        this.state.state = 'idle';
      }
    }
  }

  private handleActions() {
    if (this.state.state === 'hurt') {
      this.state.hurtFrame++;
      if (this.state.hurtFrame >= 15) {
        this.state.state = 'idle';
        this.state.hurtFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.state.state === 'attacking') {
      this.state.attackFrame++;
      if (this.state.attackFrame >= 25) {
        this.state.state = 'idle';
        this.state.attackFrame = 0;
        this.attackHitbox = null;
      }
      return;
    }

    if (this.state.state === 'skill') {
      this.state.skillFrame++;
      if (this.state.skillFrame >= (this.state.currentSkill?.duration ?? 1000) / 16.67) {
        this.state.state = 'idle';
        this.state.skillFrame = 0;
        this.state.currentSkill = null;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.state.state === 'blocking') {
      this.state.blockFrame++;
      if (this.state.blockFrame >= 15 || !this.input.block) {
        this.state.state = 'idle';
        this.state.blockFrame = 0;
      }
      return;
    }

    if (this.state.state === 'dodging') {
      this.state.dodgeFrame++;
      if (this.state.dodgeFrame >= 15) {
        this.state.state = 'idle';
        this.state.dodgeFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.state.state === 'rolling') {
      this.state.rollFrame++;
      if (this.state.rollFrame >= 25) {
        this.state.state = 'idle';
        this.state.rollFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.state.state === 'jumping') {
      this.state.jumpFrame++;
      if (this.state.jumpFrame >= 40) {
        this.state.state = 'idle';
        this.state.jumpFrame = 0;
      }
      return;
    }

    if (this.input.block) {
      this.performBlock();
      return;
    }

    if (this.input.dodge) {
      const actionNow = Date.now();
      if (actionNow - this.lastAttackTime < 350) {
        this.performRoll();
        this.lastAttackTime = actionNow;
        return;
      }
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = actionNow;
      }
      return;
    }

    if (this.input.up) {
      this.performJump();
      return;
    }

    if (this.input.attack) {
      const actionNow = Date.now();
      const cooldown = this.state.weapon?.cooldown ?? 0.3;
      
      const comboWindow = 1500;
      if (actionNow - this.state.lastComboTime < comboWindow) {
        this.state.comboCount = Math.min(this.state.comboCount + 1, 4);
      } else {
        this.state.comboCount = 1;
      }
      this.state.lastComboTime = actionNow;
      
      if (actionNow - this.lastAttackTime >= cooldown * 1000) {
        this.performAttack();
        this.lastAttackTime = actionNow;
      }
    }
  }

  private performBlock() {
    this.state.state = 'blocking';
    this.state.blockFrame = 0;
    this.stretchFactor = 0.4;  
    this.state.isInvincible = true;
  }

  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.5;  
    const speed = this.state.character.stats.speed;
    const direction = this.state.facing === 'left' ? -1 : 1;
    this.state.velocity.x = speed * 3 * direction;
    this.state.velocity.y = -speed * 0.5;
    this.state.isInvincible = true;
  }

  private performRoll() {
    this.state.state = 'rolling';
    this.state.rollFrame = 0;
    this.stretchFactor = 2.8;
    const speed = this.state.character.stats.speed;
    const direction = this.state.facing === 'left' ? -1 : 1;
    this.state.velocity.x = speed * 4 * direction;
    this.state.velocity.y = (Math.random() - 0.5) * speed * 0.8;
    this.state.isInvincible = true;
  }

  private performJump() {
    this.state.state = 'jumping';
    this.state.jumpFrame = 0;
    this.stretchFactor = 1.3;
    this.state.velocity.y = -15;
  }

  private performAttack() {
    this.state.state = 'attacking';
    this.state.attackFrame = 0;
    this.stretchFactor = 2.2;

    const baseDamage = this.state.character.stats.attack;
    const weaponMultiplier = this.state.weapon?.damageMultiplier ?? 1.0;
    const comboMultiplier = 1 + (this.state.comboCount - 1) * 0.2;
    this.attackBaseDamage = Math.round(baseDamage * weaponMultiplier * comboMultiplier);
    this.attackRange = this.state.weapon?.range ?? 70;

    const attackDirection = this.state.facing === 'left' ? -1 : 1;
    this.attackHitbox = {
      x: attackDirection * 20,
      y: 0,
      width: this.attackRange * attackDirection,
      height: 45,
      damage: this.attackBaseDamage,
      isActive: true,
    };
  }

  getAttackHitbox(): AttackHitbox | null {
    if (!this.attackHitbox) return null;

    const direction = this.state.facing === 'left' ? -1 : 1;
    return {
      x: this.state.position.x + 25 * direction,
      y: this.state.position.y - 22,
      width: this.attackRange * direction,
      height: 45,
      damage: this.attackBaseDamage,
      isActive: this.attackHitbox.isActive,
    };
  }

  public performSkill(skillId: string) {
    const skill = getSkillById(skillId);
    if (!skill) return;

    this.state.state = 'skill';
    this.state.skillFrame = 0;
    this.state.currentSkill = skill;
    this.state.energy -= skill.energyCost;
    this.state.cooldowns.set(skillId, skill.cooldown);

    if (skill.effects.includes('无敌')) {
      this.state.isInvincible = true;
    }

    if (skill.effects.includes('位移')) {
      const direction = this.state.facing === 'left' ? -1 : 1;
      this.state.velocity.x = direction * 25;
      this.state.velocity.y = -5;
    }

    if (skill.type === 'ultimate') {
      this.state.isInvincible = true;
      this.screenShake = 20;
    }

    if (skill.effects.includes('射击')) {
      this.createProjectile(skill);
    }
  }

  private createProjectile(skill: Skill) {
    const direction = this.state.facing === 'left' ? -1 : 1;
    const projectile: Projectile = {
      id: generateId(),
      ownerId: this.state.character.id,
      position: {
        x: this.state.position.x + 50 * direction,
        y: this.state.position.y,
      },
      prevPosition: { x: this.state.position.x, y: this.state.position.y },
      velocity: {
        x: 22 * direction,
        y: 0,
      },
      damage: skill.damage,
      range: skill.range,
      maxDistance: skill.range,
      traveledDistance: 0,
      isActive: true,
      weapon: this.state.weapon!,
      radius: 10,
    };

    this.projectiles.push(projectile);
  }

  private applyKnockback(deltaTime: number) {
    if (!this.state.knockback.isActive) return;

    this.state.position.x += this.state.knockback.velocity.x;
    this.state.position.y += this.state.knockback.velocity.y;

    this.state.knockback.remaining -= deltaTime;
    if (this.state.knockback.remaining <= 0) {
      this.state.knockback.isActive = false;
      this.state.knockback.velocity = { x: 0, y: 0 };
    }
  }

  private applyBoundary() {
    const padding = CHARACTER_RADIUS + 10;
    this.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, this.state.position.x));
    this.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, this.state.position.y));
  }

  private updateEnergy() {
    if (this.state.state !== 'attacking' && this.state.state !== 'skill') {
      this.state.energy = Math.min(this.state.character.stats.maxEnergy, this.state.energy + CONFIG.energyPassiveRecovery * 0.01667);
    }
  }

  private updateProjectiles() {
    this.projectiles.forEach(projectile => {
      if (!projectile.isActive) return;

      projectile.prevPosition = { ...projectile.position };
      projectile.position.x += projectile.velocity.x;
      projectile.position.y += projectile.velocity.y;
      projectile.traveledDistance += Math.abs(projectile.velocity.x);

      if (projectile.traveledDistance >= projectile.maxDistance) {
        projectile.isActive = false;
      }
    });

    this.projectiles = this.projectiles.filter(p => p.isActive);
  }

  takeDamage(damage: number, attackerPosition: { x: number; y: number }) {
    if (this.state.state === 'dead' || this.state.isInvincible) return;

    let finalDamage = damage;

    const defense = this.state.character.stats.defense;
    finalDamage = Math.max(1, Math.round(finalDamage * (1 - defense * 0.02)));

    this.state.hp = Math.max(0, this.state.hp - finalDamage);
    this.state.state = 'hurt';
    this.state.hurtFrame = 0;
    this.stretchFactor = 1.5;

    this.applyKnockbackForce(attackerPosition, damage);

    if (this.state.hp <= 0) {
      this.state.state = 'dead';
    }
  }

  private applyKnockbackForce(attackerPosition: { x: number; y: number }, damage: number) {
    const baseKnockback = KNOCKBACK_CONFIG.baseKnockback;
    const scaling = 1 + (damage / 50);
    const knockbackDistance = Math.min(baseKnockback * scaling, KNOCKBACK_CONFIG.maxKnockbackDistance);

    const dx = this.state.position.x - attackerPosition.x;
    const dy = this.state.position.y - attackerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.state.knockback = {
        velocity: {
          x: (dx / distance) * (knockbackDistance / 8),
          y: (dy / distance) * (knockbackDistance / 8),
        },
        duration: KNOCKBACK_CONFIG.knockbackDuration,
        remaining: KNOCKBACK_CONFIG.knockbackDuration,
        isActive: true,
      };
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.state.position;
    const color = this.state.character.color;
    const isHurt = this.state.state === 'hurt' && Math.floor(this.state.hurtFrame / 2) % 2 === 0;

    if (this.isAttackActive()) {
      const attackBox = this.getAttackHitbox();
      if (attackBox) {
        ctx.save();
        ctx.fillStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.fillRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
        ctx.restore();
      }
    }

    ctx.save();
    
    ctx.translate(x, y);
    
    const flipX = this.state.facing === 'left' ? -1 : 1;
    
    // 攻击动画的拉伸效果
    if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 25;
      const stretchFactor = 2.0 + Math.sin(attackProgress * Math.PI) * 0.8;
      const squishFactor = 0.4 + Math.sin(attackProgress * Math.PI) * 0.2;
      ctx.scale(stretchFactor * flipX, squishFactor);
    } else if (this.state.state === 'dodging') {
      const dodgeProgress = this.state.dodgeFrame / 15;
      const stretchFactor = 2.2 + Math.sin(dodgeProgress * Math.PI) * 0.5;
      const rotation = dodgeProgress * Math.PI * 0.4;
      ctx.rotate(rotation);
      ctx.scale(stretchFactor * flipX, 0.4);
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 25;
      const rotation = rollProgress * Math.PI * 6;
      const stretchFactor = 2.5 - rollProgress * 0.5;
      ctx.rotate(rotation);
      ctx.scale(stretchFactor * flipX, 0.35);
    } else if (this.state.state === 'jumping') {
      const jumpProgress = this.state.jumpFrame / 40;
      const jumpHeight = Math.sin(jumpProgress * Math.PI);
      ctx.scale(1.1 + jumpHeight * 0.3, 1.3 - jumpHeight * 0.4);
    } else if (this.state.state === 'blocking') {
      ctx.scale(0.45 * flipX, 1.45);
    } else {
      ctx.scale(flipX, 1);
    }

    this.drawShadow(ctx);
    this.drawAnimatedStickFigure(ctx, color, isHurt);

    ctx.restore();

    this.drawProjectiles(ctx);
    
    if (this.screenShake > 0) {
      this.screenShake -= 1;
    }
  }

  private drawShadow(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 25, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawAnimatedStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff3333' : color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // 头部
    const headBob = this.state.state === 'running' ? Math.sin(Date.now() / 100) * 2 : 0;
    ctx.beginPath();
    ctx.arc(0, -55 + headBob, 16, 0, Math.PI * 2);
    ctx.stroke();

    // 身体
    let bodyRotation = 0;
    let bodyStretch = 1;
    if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 25;
      const comboStyle = (this.state.comboCount - 1) % 4;
      
      if (comboStyle === 0) {
        bodyRotation = Math.sin(attackProgress * Math.PI) * 0.3;
      } else if (comboStyle === 1) {
        bodyRotation = -Math.sin(attackProgress * Math.PI) * 0.4;
      } else if (comboStyle === 2) {
        bodyRotation = Math.sin(attackProgress * Math.PI * 2) * 0.5;
      } else {
        bodyRotation = attackProgress * Math.PI * 4;
        bodyStretch = 1.3;
      }
    } else if (this.state.state === 'running') {
      bodyRotation = Math.sin(Date.now() / 80) * 0.15;
    }

    ctx.save();
    ctx.rotate(bodyRotation);
    ctx.scale(bodyStretch, 1);

    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 腿部动画
    this.drawAnimatedLegs(ctx);

    // 手臂动画
    const armData = this.drawAnimatedArms(ctx);

    // 根据武器类型选择绘制在哪只手上
    const weapon = this.state.weapon;
    if (weapon && weapon.id !== 'fists') {
      if (weapon.type === 'ranged') {
        this.drawWeapon(ctx, armData.leftHandPos);
        this.drawWeapon(ctx, armData.rightHandPos);
      } else {
        const mainHand = this.state.facing === 'left' ? 'left' : 'right';
        this.drawWeapon(ctx, mainHand === 'left' ? armData.leftHandPos : armData.rightHandPos);
      }
    }

    ctx.restore();
  }

  private drawAnimatedLegs(ctx: CanvasRenderingContext2D) {
    const legLength = 38;
    let leftLegAngle = 0;
    let rightLegAngle = 0;

    if (this.state.state === 'running') {
      const legSpeed = 8;
      leftLegAngle = Math.sin(Date.now() / legSpeed) * 0.8;
      rightLegAngle = Math.sin(Date.now() / legSpeed + Math.PI) * 0.8;
    } else if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 25;
      const comboStyle = (this.state.comboCount - 1) % 4;
      
      if (comboStyle === 0) {
        leftLegAngle = 0.3;
        rightLegAngle = Math.sin(attackProgress * Math.PI) * 0.6 - 0.3;
      } else if (comboStyle === 1) {
        rightLegAngle = -0.5;
        leftLegAngle = Math.sin(attackProgress * Math.PI) * 0.8 + 0.3;
      } else if (comboStyle === 2) {
        leftLegAngle = Math.sin(attackProgress * Math.PI * 2) * 1.2;
        rightLegAngle = Math.sin(attackProgress * Math.PI * 2 + Math.PI) * 1.2;
      } else {
        leftLegAngle = Math.sin(attackProgress * Math.PI * 4 + Math.PI) * 1.8;
        rightLegAngle = Math.sin(attackProgress * Math.PI * 4) * 1.8;
      }
    } else if (this.state.state === 'jumping') {
      const jumpProgress = this.state.jumpFrame / 40;
      const legSpread = Math.sin(jumpProgress * Math.PI) * 0.6;
      leftLegAngle = legSpread;
      rightLegAngle = -legSpread;
    } else if (this.state.state === 'dodging') {
      leftLegAngle = 0.5;
      rightLegAngle = 0.5;
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 25;
      leftLegAngle = Math.sin(rollProgress * Math.PI * 6) * 1.5;
      rightLegAngle = Math.sin(rollProgress * Math.PI * 6 + Math.PI) * 1.5;
    } else {
      leftLegAngle = 0.3;
      rightLegAngle = -0.3;
    }

    ctx.save();
    
    // 左腿
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12 + Math.sin(leftLegAngle) * 8, legLength * Math.cos(leftLegAngle));
    ctx.stroke();
    
    // 右腿
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12 + Math.sin(rightLegAngle) * 8, legLength * Math.cos(rightLegAngle));
    ctx.stroke();

    ctx.restore();
  }

  private drawAnimatedArms(ctx: CanvasRenderingContext2D): { leftHandPos: { x: number; y: number }; rightHandPos: { x: number; y: number }; leftArmAngle: number; rightArmAngle: number } {
    const armLength = 28;
    let leftArmAngle = 0.5;
    let rightArmAngle = -0.5;

    if (this.state.state === 'running') {
      const armSpeed = 60;
      leftArmAngle = Math.sin(Date.now() / armSpeed) * 0.9 + 0.3;
      rightArmAngle = Math.sin(Date.now() / armSpeed + Math.PI) * 0.9 - 0.3;
    } else if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 25;
      const comboStyle = (this.state.comboCount - 1) % 4;
      
      if (comboStyle === 0) {
        rightArmAngle = -Math.PI / 2 + attackProgress * Math.PI * 1.2;
        leftArmAngle = Math.sin(attackProgress * Math.PI) * 0.5 + 0.3;
      } else if (comboStyle === 1) {
        leftArmAngle = Math.PI / 2 - attackProgress * Math.PI * 1.2;
        rightArmAngle = -Math.sin(attackProgress * Math.PI) * 0.5 - 0.3;
      } else if (comboStyle === 2) {
        leftArmAngle = Math.PI / 2 + attackProgress * Math.PI;
        rightArmAngle = -Math.PI / 2 - attackProgress * Math.PI;
      } else {
        leftArmAngle = attackProgress * Math.PI * 4 - Math.PI / 2;
        rightArmAngle = attackProgress * Math.PI * 4 + Math.PI / 2;
      }
    } else if (this.state.state === 'jumping') {
      leftArmAngle = 0.8;
      rightArmAngle = -0.8;
    } else if (this.state.state === 'blocking') {
      leftArmAngle = -0.3;
      rightArmAngle = 0.3;
    }

    ctx.save();
    
    // 左臂
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(-armLength * Math.sin(leftArmAngle), -32 + armLength * Math.cos(leftArmAngle));
    ctx.stroke();
    
    // 右臂
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(armLength * Math.sin(rightArmAngle), -32 + armLength * Math.cos(rightArmAngle));
    ctx.stroke();

    ctx.restore();

    return {
      leftHandPos: { x: -armLength * Math.sin(leftArmAngle), y: -32 + armLength * Math.cos(leftArmAngle) },
      rightHandPos: { x: armLength * Math.sin(rightArmAngle), y: -32 + armLength * Math.cos(rightArmAngle) },
      leftArmAngle,
      rightArmAngle
    };
  }

  private drawWeapon(ctx: CanvasRenderingContext2D, handPos: { x: number; y: number }) {
    const weapon = this.state.weapon;
    if (!weapon || weapon.id === 'fists') return;

    ctx.save();
    ctx.translate(handPos.x, handPos.y);
    
    const direction = this.state.facing === 'left' ? -1 : 1;
    const isAttacking = this.state.state === 'attacking';

    switch (weapon.id) {
      case 'katana':
        this.drawKatana(ctx, direction, isAttacking);
        break;
      case 'battleaxe':
        this.drawBattleAxe(ctx, direction, isAttacking);
        break;
      case 'bow':
        this.drawBow(ctx, direction);
        break;
      case 'shuriken':
        this.drawShuriken(ctx, direction);
        break;
    }

    ctx.restore();
  }

  private drawKatana(ctx: CanvasRenderingContext2D, direction: number, isAttacking: boolean) {
    ctx.lineCap = 'round';
    
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(direction * 45, -8);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(direction * 5, -2);
    ctx.lineTo(direction * 40, -6);
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-6, -4, 12, 8);

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(direction * -10, -2, direction * 8, 4);

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(direction * -8, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    if (isAttacking) {
      const attackProgress = this.state.attackFrame / 25;
      const glowIntensity = 0.3 + Math.sin(attackProgress * Math.PI) * 0.3;
      
      ctx.fillStyle = `rgba(100, 200, 255, ${glowIntensity})`;
      ctx.beginPath();
      ctx.moveTo(direction * 20, -15);
      ctx.quadraticCurveTo(direction * 45, -20, direction * 55, -8);
      ctx.quadraticCurveTo(direction * 45, 5, direction * 20, 0);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawBattleAxe(ctx: CanvasRenderingContext2D, direction: number, isAttacking: boolean) {
    ctx.fillStyle = '#8b7355';
    ctx.beginPath();
    ctx.moveTo(direction * 28, -16);
    ctx.lineTo(direction * 38, -4);
    ctx.lineTo(direction * 28, 16);
    ctx.lineTo(direction * 12, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(direction * -18, -2, direction * 30, 4);

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(direction * -22, -3, direction * 4, 6);

    if (isAttacking) {
      const attackProgress = this.state.attackFrame / 25;
      const waveRadius = 15 + attackProgress * 30;
      const waveAlpha = 0.6 * (1 - attackProgress);
      
      ctx.strokeStyle = `rgba(255, 150, 50, ${waveAlpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(direction * 25, 0, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawBow(ctx: CanvasRenderingContext2D, direction: number) {
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(direction * 18, 0, 22, Math.PI / 6, Math.PI * 5 / 6);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const startY = -22 * Math.sin(Math.PI / 6);
    const endY = -22 * Math.sin(Math.PI * 5 / 6);
    ctx.beginPath();
    ctx.moveTo(direction * 18 - 22 * Math.cos(Math.PI / 6), startY);
    ctx.lineTo(direction * 18 - 22 * Math.cos(Math.PI * 5 / 6), endY);
    ctx.stroke();

    if (this.state.state === 'attacking') {
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(direction * 35, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(direction * 20, 0);
      ctx.lineTo(direction * 60, 0);
      ctx.stroke();
    }
  }

  private drawShuriken(ctx: CanvasRenderingContext2D, direction: number) {
    ctx.fillStyle = '#c0c0c0';
    ctx.translate(direction * 15, 0);
    ctx.rotate(Date.now() / 50);
    
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(0, -10);
      ctx.lineTo(3, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-3, 0);
      ctx.closePath();
    }
    ctx.fill();
  }

  private drawProjectiles(ctx: CanvasRenderingContext2D) {
    this.projectiles.forEach(projectile => {
      ctx.save();
      ctx.fillStyle = '#ff6600';

      if (projectile.weapon.id === 'shuriken') {
        ctx.translate(projectile.position.x, projectile.position.y);
        ctx.rotate(Date.now() / 30);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -12);
          ctx.lineTo(3, 0);
          ctx.lineTo(0, 12);
          ctx.lineTo(-3, 0);
          ctx.closePath();
        }
        ctx.fill();
      } else if (projectile.weapon.id === 'bow') {
        ctx.translate(projectile.position.x, projectile.position.y);
        ctx.rotate(Math.atan2(projectile.velocity.y, projectile.velocity.x));
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(projectile.position.x, projectile.position.y, projectile.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  getHitbox() {
    return {
      x: this.state.position.x - CHARACTER_RADIUS,
      y: this.state.position.y - CHARACTER_RADIUS,
      width: CHARACTER_RADIUS * 2,
      height: CHARACTER_RADIUS * 2,
    };
  }

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  removeProjectile(projectileId: string) {
    this.projectiles = this.projectiles.filter(p => p.id !== projectileId);
  }

  getScreenShake(): number {
    return this.screenShake;
  }
}
