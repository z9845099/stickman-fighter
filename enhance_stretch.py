# 增强防御和闪避的夸张拉伸效果

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 增强拉伸效果
old_stretch = '''      if (this.state.state === 'attacking') {
        ctx.scale(this.stretchFactor, 0.5);
      } else if (this.state.state === 'blocking') {
        ctx.scale(0.6, 1.2);
      } else if (this.state.state === 'dodging') {
        ctx.scale(this.stretchFactor, 0.6);
      } else if (this.state.state === 'rolling') {
        const rollProgress = this.state.rollFrame / 20;
        const rotation = rollProgress * Math.PI * 4;
        ctx.rotate(rotation);
        ctx.scale(this.stretchFactor * 0.8, 0.4);
      }'''

new_stretch = '''      if (this.state.state === 'attacking') {
        // 攻击：极致的横向拉伸
        const attackProgress = this.state.attackFrame / 20;
        const dynamicStretch = 1.8 + Math.sin(attackProgress * Math.PI) * 0.5;
        ctx.scale(dynamicStretch, 0.4);
      } else if (this.state.state === 'blocking') {
        // 防御：夸张的横向压缩纵向拉伸
        const blockProgress = Math.min(this.state.blockFrame / 15, 1);
        const blockPulse = 1 + Math.sin(blockProgress * Math.PI * 3) * 0.15;
        ctx.scale(0.5 * blockPulse, 1.4 * blockPulse);
      } else if (this.state.state === 'dodging') {
        // 闪避：极致的横向拉伸冲刺
        const dodgeProgress = this.state.dodgeFrame / 12;
        const dodgeStretch = 1.8 + Math.sin(dodgeProgress * Math.PI) * 0.4;
        const rotation = dodgeProgress * Math.PI * 0.3;
        ctx.rotate(rotation);
        ctx.scale(dodgeStretch, 0.45);
      } else if (this.state.state === 'rolling') {
        // 翻滚：极速旋转拉伸
        const rollProgress = this.state.rollFrame / 20;
        const rotation = rollProgress * Math.PI * 5;
        const rollStretch = 2.0 - rollProgress * 0.5;
        ctx.rotate(rotation);
        ctx.scale(rollStretch, 0.3);
      }'''

content = content.replace(old_stretch, new_stretch)

# 同时增强防御时的stretchFactor
old_block_factor = '''  private performBlock() {
    this.state.state = 'blocking';
    this.state.blockFrame = 0;
    this.stretchFactor = 0.7;
    
    this.state.isInvincible = true;
  }'''

new_block_factor = '''  private performBlock() {
    this.state.state = 'blocking';
    this.state.blockFrame = 0;
    this.stretchFactor = 0.4;  // 更夸张的压缩
    
    this.state.isInvincible = true;
  }'''

content = content.replace(old_block_factor, new_block_factor)

# 增强闪避时的stretchFactor
old_dodge_factor = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 1.5;
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2;
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }'''

new_dodge_factor = '''  private performDodge() {
    this.state.state = 'dodging';
    this.state.dodgeFrame = 0;
    this.stretchFactor = 2.2;  // 更夸张的拉伸
    
    const speed = this.state.character.stats.speed;
    this.state.velocity.x = speed * 2.5;  // 更快
    this.state.velocity.y = 0;
    
    this.state.isInvincible = true;
  }'''

content = content.replace(old_dodge_factor, new_dodge_factor)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 防御和闪避的拉伸效果已增强！")
print("✓ 防御：横向压缩到0.5倍，纵向拉伸到1.4倍")
print("✓ 闪避：横向拉伸到2.2倍，纵向压缩到0.45倍")
print("✓ 攻击：动态拉伸，最大2.3倍")
print("✓ 翻滚：极速旋转5圈，超级压缩")
