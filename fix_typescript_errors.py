# 修复TypeScript错误

# 1. 更新types/index.ts添加缺失的字段
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 更新状态类型
old_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'jumping' | 'rolling';'''
new_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'jumping' | 'rolling';'''
types_content = types_content.replace(old_state_type, new_state_type)

# 确保所有字段都存在
old_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  blockFrame: number;
  dodgeFrame: number;
  jumpFrame: number;
  rollFrame: number;
  comboCount: number;
  lastComboTime: number;'''
new_fields = '''  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  blockFrame: number;
  dodgeFrame: number;
  jumpFrame: number;
  rollFrame: number;
  comboCount: number;
  lastComboTime: number;'''
types_content = types_content.replace(old_fields, new_fields)

# 如果字段不存在则添加
if 'comboCount' not in types_content:
    types_content = types_content.replace(
        'rollFrame: number;',
        'rollFrame: number;\n  comboCount: number;\n  lastComboTime: number;'
    )

# 写回types文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")

# 2. 修复Player.ts中的问题
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 确保performRoll方法存在
if 'private performRoll()' not in player_content:
    # 在performDodge后添加performRoll
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
    this.stretchFactor = 2.2;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 3;
    this.state.velocity.y = (Math.random() - 0.5) * speed * 0.5;
    
    this.state.isInvincible = true;
  }'''
    
    player_content = player_content.replace(old_dodge, new_dodge)

# 写回Player.ts
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts已更新")
print("✓ 添加了performRoll方法")
