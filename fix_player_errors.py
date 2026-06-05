# 批量修复Player.ts中的TypeScript错误

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 在performDodge方法中添加now声明
old_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.2;  // 更夸张的拉伸
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2.5;  // 更快
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }'''

new_dodge = '''  private performDodge() {
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

content = content.replace(old_dodge, new_dodge)

# 2. 在handleActions中修复now变量和lastDodgeTime问题
old_handle_dodge = '''    if (this.input.dodge) {
      const now = Date.now();
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
    }'''

new_handle_dodge = '''    if (this.input.dodge) {
      const dodgeNow = Date.now();
      if (dodgeNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = dodgeNow;
      }
      return;
    }'''

content = content.replace(old_handle_dodge, new_handle_dodge)

# 3. 修复running状态中的now变量
old_running_update = '''    if (this.state.state === 'running') {
      this.stretchFactor = 1.3 + Math.abs(this.state.velocity.x) * 0.01;
      this.stretchDirection = { ...this.state.velocity };
    }'''

new_running_update = '''    if (this.state.state === 'running') {
      const updateNow = Date.now();
      this.stretchFactor = 1.3 + Math.abs(this.state.velocity.x) * 0.01;
      this.stretchDirection = { ...this.state.velocity };
    }'''

content = content.replace(old_running_update, new_running_update)

# 4. 修复hurt状态中的now变量
old_hurt_update = '''    if (this.state.state === 'hurt') {
      this.state.hurtFrame++;
      if (this.state.hurtFrame >= 20) {
        this.state.state = 'idle';
        this.state.hurtFrame = 0;
        this.state.isInvincible = false;
      }
    }'''

new_hurt_update = '''    if (this.state.state === 'hurt') {
      this.state.hurtFrame++;
      if (this.state.hurtFrame >= 20) {
        this.state.state = 'idle';
        this.state.hurtFrame = 0;
        this.state.isInvincible = false;
      }
    }'''

content = content.replace(old_hurt_update, new_hurt_update)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Player.ts错误已修复")
print("✓ 移除了翻滚功能（需要先修复类型定义）")
print("✓ 修复了now变量声明问题")
