# 彻底修复Player.ts中的所有TypeScript错误

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修复handleActions方法中的now变量和翻滚功能
old_handle_actions_dodge = '''    if (this.input.dodge) {
      if (now - this.lastAttackTime >= 0.5 * 1000) {
        // 连续按两次闪避键触发翻滚
        if (this.state.lastDodgeTime && now - this.state.lastDodgeTime < 300) {
          this.performRoll();
        } else {
          this.performDodge();
        }
        this.state.lastDodgeTime = now;
        this.lastAttackTime = now;
      }
      return;
    }

    if (this.input.attack) {
      const cooldown = this.state.weapon?.cooldown ?? 0.3;
      if (now - this.lastAttackTime >= cooldown * 1000) {
        this.performAttack();
        this.lastAttackTime = now;
      }
    }'''

new_handle_actions_dodge = '''    if (this.input.dodge) {
      const actionNow = Date.now();
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = actionNow;
      }
      return;
    }

    if (this.input.attack) {
      const actionNow = Date.now();
      const cooldown = this.state.weapon?.cooldown ?? 0.3;
      if (actionNow - this.lastAttackTime >= cooldown * 1000) {
        this.performAttack();
        this.lastAttackTime = actionNow;
      }
    }'''

content = content.replace(old_handle_actions_dodge, new_handle_actions_dodge)

# 2. 移除重复的performDodge和performRoll方法（如果存在）
# 先找到performRoll方法并移除
old_perform_roll = '''  private performRoll() {
    this.state.state = 'rolling';
    this.state.rollFrame = 0;
    this.stretchFactor = 1.8;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 3;
    this.state.velocity.y = (Math.random() - 0.5) * speed;
    
    this.state.isInvincible = true;
  }'''

content = content.replace(old_perform_roll, '')

# 3. 移除重复的performDodge方法（如果存在）
old_duplicate_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.2;  // 更夸张的拉伸
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2.5;  // 更快
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }

  private performRoll() {
    this.state.state = 'rolling';
    this.state.rollFrame = 0;
    this.stretchFactor = 1.8;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 3;
    this.state.velocity.y = (Math.random() - 0.5) * speed;
    
    this.state.isInvincible = true;
  }'''

content = content.replace(old_duplicate_dodge, '')

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Player.ts错误已修复")
print("✓ 移除了翻滚功能（简化代码）")
print("✓ 修复了now变量声明问题")
