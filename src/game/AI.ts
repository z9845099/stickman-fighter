import { Player } from './Player';

export class AI {
  player: Player;
  opponent: Player;
  decisionTimer: number;
  currentAction: 'idle' | 'move' | 'attack' | 'skill1' | 'skill2' | 'dodge' | 'jump';
  skillCooldown: number;
  dodgeCooldown: number;
  jumpCooldown: number;
  private attackTimeout: number | null = null;
  private skillTimeout: number | null = null;

  constructor(player: Player, opponent: Player) {
    this.player = player;
    this.opponent = opponent;
    this.decisionTimer = 0;
    this.currentAction = 'idle';
    this.skillCooldown = 0;
    this.dodgeCooldown = 0;
    this.jumpCooldown = 0;
  }

  update() {
    this.decisionTimer++;
    if (this.skillCooldown > 0) this.skillCooldown--;
    if (this.dodgeCooldown > 0) this.dodgeCooldown--;
    if (this.jumpCooldown > 0) this.jumpCooldown--;

    // 更新朝向：始终面向对手
    this.updateFacing();

    if (this.decisionTimer >= 10) {
      this.makeDecision();
      this.decisionTimer = 0;
    }

    this.executeAction();
  }

  private updateFacing() {
    const dx = this.opponent.state.position.x - this.player.state.position.x;
    if (dx > 0 && this.player.state.facing !== 'right') {
      this.player.state.facing = 'right';
    } else if (dx < 0 && this.player.state.facing !== 'left') {
      this.player.state.facing = 'left';
    }
  }

  private makeDecision() {
    const dx = this.opponent.state.position.x - this.player.state.position.x;
    const dy = this.opponent.state.position.y - this.player.state.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const attackDistance = this.player.attackRange || 80;

    // 检测对手的攻击状态
    const opponentIsAttacking = this.opponent.state.state === 'attacking';
    const opponentIsUsingSkill = this.opponent.state.state === 'skill';

    // 躲避逻辑：当对手攻击时，有概率躲避
    if ((opponentIsAttacking || opponentIsUsingSkill) && this.dodgeCooldown === 0) {
      if (Math.random() > 0.4) {
        this.currentAction = 'dodge';
        this.dodgeCooldown = 30;
        return;
      }
    }

    // 跳跃逻辑：随机跳跃或躲避高处攻击
    if (this.jumpCooldown === 0 && Math.random() > 0.85) {
      this.currentAction = 'jump';
      this.jumpCooldown = 60;
      return;
    }

    if (distance < attackDistance) {
      if (this.player.state.energy >= 30 && Math.random() > 0.6 && this.skillCooldown === 0) {
        this.currentAction = Math.random() > 0.5 ? 'skill1' : 'skill2';
        this.skillCooldown = 40;
      } else {
        this.currentAction = 'attack';
      }
    } else if (distance > attackDistance * 2) {
      this.currentAction = 'move';
    } else if (distance < 20) {
      this.currentAction = 'move';
    } else {
      this.currentAction = Math.random() > 0.5 ? 'attack' : 'move';
    }
  }

  private executeAction() {
    const dx = this.opponent.state.position.x - this.player.state.position.x;
    const dy = this.opponent.state.position.y - this.player.state.position.y;

    this.player.input.up = false;
    this.player.input.down = false;
    this.player.input.left = false;
    this.player.input.right = false;
    this.player.input.attack = false;
    this.player.input.skill1 = false;
    this.player.input.skill2 = false;
    this.player.input.dodge = false;

    switch (this.currentAction) {
      case 'move':
        if (dy < -15) this.player.input.up = true;
        else if (dy > 15) this.player.input.down = true;

        if (dx < 0) this.player.input.left = true;
        else if (dx > 0) this.player.input.right = true;
        break;

      case 'attack':
        if (this.player.state.state === 'attacking') return;

        this.player.input.attack = true;

        if (this.attackTimeout) {
          clearTimeout(this.attackTimeout);
        }

        this.attackTimeout = window.setTimeout(() => {
          if (this.player) {
            this.player.input.attack = false;
          }
        }, 50);
        break;

      case 'skill1':
        if (this.player.state.character.skills[0] &&
            this.player.canUseSkill(this.player.state.character.skills[0])) {
          this.player.input.skill1 = true;

          if (this.skillTimeout) {
            clearTimeout(this.skillTimeout);
          }

          this.skillTimeout = window.setTimeout(() => {
            if (this.player) {
              this.player.input.skill1 = false;
            }
          }, 50);
        } else {
          this.currentAction = 'attack';
        }
        break;

      case 'skill2':
        if (this.player.state.character.skills[1] &&
            this.player.canUseSkill(this.player.state.character.skills[1])) {
          this.player.input.skill2 = true;

          if (this.skillTimeout) {
            clearTimeout(this.skillTimeout);
          }

          this.skillTimeout = window.setTimeout(() => {
            if (this.player) {
              this.player.input.skill2 = false;
            }
          }, 50);
        } else {
          this.currentAction = 'attack';
        }
        break;

      case 'dodge':
        this.player.input.dodge = true;

        if (this.skillTimeout) {
          clearTimeout(this.skillTimeout);
        }

        this.skillTimeout = window.setTimeout(() => {
          if (this.player) {
            this.player.input.dodge = false;
          }
        }, 50);
        break;

      case 'jump':
        this.player.input.up = true;

        setTimeout(() => {
          if (this.player) {
            this.player.input.up = false;
          }
        }, 100);
        break;
    }
  }

  destroy() {
    if (this.attackTimeout) {
      clearTimeout(this.attackTimeout);
    }
    if (this.skillTimeout) {
      clearTimeout(this.skillTimeout);
    }
  }
}
