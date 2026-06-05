# 添加跳跃和翻滚动作

# 1. 修改types/index.ts添加跳跃状态
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 添加jumping到状态类型
old_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging';'''
new_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'jumping' | 'rolling';'''
types_content = types_content.replace(old_state_type, new_state_type)

# 添加jumpFrame和rollFrame字段
old_frame_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  blockFrame: number;
  dodgeFrame: number;'''
new_frame_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  blockFrame: number;
  dodgeFrame: number;
  jumpFrame: number;
  rollFrame: number;
  comboCount: number;
  lastComboTime: number;'''
types_content = types_content.replace(old_frame_fields, new_frame_fields)

# 写回types文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")
print("✓ 添加了jumping和rolling状态")
print("✓ 添加了jumpFrame, rollFrame, comboCount, lastComboTime字段")

# 2. 修改Player.ts添加跳跃和翻滚逻辑
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 在state初始化中添加新字段
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
      jumpFrame: 0,
      rollFrame: 0,
      comboCount: 0,
      lastComboTime: 0,'''
player_content = player_content.replace(old_state_init, new_state_init)

# 添加performJump方法
old_perform_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.2;  // 更夸张的拉伸
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2.5;  // 更快
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }'''
new_perform_dodge = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.2;  // 更夸张的拉伸
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2.5;  // 更快
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }

  private performJump() {
    this.state.state = 'jumping';
    this.state.jumpFrame = 0;
    this.stretchFactor = 1.3;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.y = -speed * 1.8;
    
    this.state.isInvincible = false;
  }

  private performRoll() {
    this.state.state = 'rolling';
    this.state.rollFrame = 0;
    this.stretchFactor = 2.0;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 3;
    this.state.velocity.y = speed * 0.5;
    
    this.state.isInvincible = true;
  }'''
player_content = player_content.replace(old_perform_dodge, new_perform_dodge)

# 写回Player.ts
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts已更新")
print("✓ 添加了跳跃和翻滚方法")
