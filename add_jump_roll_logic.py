# 添加跳跃和翻滚状态处理以及连招系统

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 在handleActions中添加跳跃状态处理
old_dodging_handler = '''    if (this.state.state === 'dodging') {
      this.state.dodgeFrame++;
      if (this.state.dodgeFrame >= 12) {
        this.state.state = 'idle';
        this.state.dodgeFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.input.skill1) {'''
new_dodging_handler = '''    if (this.state.state === 'dodging') {
      this.state.dodgeFrame++;
      if (this.state.dodgeFrame >= 12) {
        this.state.state = 'idle';
        this.state.dodgeFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.state.state === 'jumping') {
      this.state.jumpFrame++;
      if (this.state.jumpFrame >= 30) {
        this.state.state = 'idle';
        this.state.jumpFrame = 0;
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

    if (this.input.skill1) {'''
content = content.replace(old_dodging_handler, new_dodging_handler)

# 添加跳跃和翻滚按键处理
old_skill1_handler = '''    if (this.input.skill1) {
      const now = Date.now();
      if (now - this.lastAttackTime >= 0.8 * 1000) {
        this.performSkill1();
        this.lastAttackTime = now;
      }
      return;
    }'''
new_skill1_handler = '''    if (this.input.skill1) {
      const now = Date.now();
      if (now - this.lastAttackTime >= 0.8 * 1000) {
        this.performSkill1();
        this.lastAttackTime = now;
      }
      return;
    }

    if (this.input.skill2) {
      const now = Date.now();
      if (now - this.lastAttackTime >= 0.6 * 1000) {
        this.performJump();
        this.lastAttackTime = now;
      }
      return;
    }

    if (this.input.dodge && this.state.state === 'dodging') {
      const now = Date.now();
      if (now - this.lastAttackTime < 300) {
        this.performRoll();
        this.lastAttackTime = now;
      }
      return;
    }'''
content = content.replace(old_skill1_handler, new_skill1_handler)

# 添加攻击连招逻辑
old_attack_handler = '''    if (this.input.attack) {
      const actionNow = Date.now();
      const cooldown = this.state.weapon?.cooldown ?? 0.3;
      if (actionNow - this.lastAttackTime >= cooldown * 1000) {
        this.performAttack();
        this.lastAttackTime = actionNow;
      }
    }'''
new_attack_handler = '''    if (this.input.attack) {
      const actionNow = Date.now();
      const cooldown = this.state.weapon?.cooldown ?? 0.3;
      
      // 连招系统
      const comboWindow = 1500; // 1.5秒连招窗口
      if (actionNow - this.state.lastComboTime < comboWindow) {
        this.state.comboCount = Math.min(this.state.comboCount + 1, 3);
      } else {
        this.state.comboCount = 1;
      }
      this.state.lastComboTime = actionNow;
      
      if (actionNow - this.lastAttackTime >= cooldown * 1000) {
        this.performAttack();
        this.lastAttackTime = actionNow;
      }
    }'''
content = content.replace(old_attack_handler, new_attack_handler)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已添加跳跃和翻滚状态处理")
print("✓ 已添加连招系统（最多3连击）")
print("✓ 连续闪避可触发翻滚")
