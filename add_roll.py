# 添加翻滚动作

# 1. 修改types/index.ts添加rolling状态
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 添加rolling到状态类型
old_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging';'''
new_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'rolling';'''
types_content = types_content.replace(old_state_type, new_state_type)

# 添加rollFrame字段
old_frame_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;'''
new_frame_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  rollFrame: number;'''
types_content = types_content.replace(old_frame_fields, new_frame_fields)

# 写回types文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")
print("✓ 添加了rolling状态和rollFrame字段")

# 2. 修改Player.ts添加翻滚逻辑
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 在state初始化中添加rollFrame
old_state_init = '''      state: 'idle',
      attackFrame: 0,
      hurtFrame: 0,
      skillFrame: 0,
      blockFrame: 0,
      dodgeFrame: 0,'''
new_state_init = '''      state: 'idle',
      attackFrame: 0,
      hurtFrame: 0,
      skillFrame: 0,
      blockFrame: 0,
      dodgeFrame: 0,
      rollFrame: 0,'''
player_content = player_content.replace(old_state_init, new_state_init)

# 添加performRoll方法
old_perform_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 1.5;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2;
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }'''
new_perform_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 1.5;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2;
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
player_content = player_content.replace(old_perform_dodge, new_perform_dodge)

# 在handleActions中添加rolling状态处理
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

    if (this.state.state === 'rolling') {
      this.state.rollFrame++;
      if (this.state.rollFrame >= 20) {
        this.state.state = 'idle';
        this.state.rollFrame = 0;
        this.state.isInvincible = false;
      }
      return;
    }

    if (this.input.skill1) {'''
player_content = player_content.replace(old_dodging_handler, new_dodging_handler)

# 在handleActions中添加翻滚按键处理
old_dodge_input = '''    if (this.input.dodge) {
      const now = Date.now();
      if (now - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = now;
      }
      return;
    }'''
new_dodge_input = '''    if (this.input.dodge) {
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
player_content = player_content.replace(old_dodge_input, new_dodge_input)

# 写回Player.ts
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts已更新")
print("✓ 添加了翻滚动作逻辑")
print("✓ 连续按两次闪避键可触发翻滚")
