# 添加跳跃和翻滚的渲染效果

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 更新拉伸效果部分，添加跳跃和翻滚的渲染
old_stretch = '''      if (this.state.state === 'attacking') {
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

new_stretch = '''      if (this.state.state === 'attacking') {
        // 攻击：极致的横向拉伸
        const attackProgress = this.state.attackFrame / 20;
        const dynamicStretch = 1.8 + Math.sin(attackProgress * Math.PI) * 0.5 + (this.state.comboCount - 1) * 0.2;
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
      } else if (this.state.state === 'jumping') {
        // 跳跃：向上拉伸
        const jumpProgress = this.state.jumpFrame / 30;
        const jumpHeight = Math.sin(jumpProgress * Math.PI);
        const jumpStretch = 1.1 + jumpHeight * 0.3;
        ctx.scale(jumpStretch, 1.3 - jumpHeight * 0.4);
      } else if (this.state.state === 'rolling') {
        // 翻滚：极速旋转拉伸
        const rollProgress = this.state.rollFrame / 25;
        const rotation = rollProgress * Math.PI * 5;
        const rollStretch = 2.2 - rollProgress * 0.6;
        ctx.rotate(rotation);
        ctx.scale(rollStretch, 0.3);
      }'''

content = content.replace(old_stretch, new_stretch)

# 更新状态检查条件
old_condition = '''    if (this.stretchFactor !== 1 && (this.state.state === 'running' || this.state.state === 'hurt' || this.state.state === 'attacking' || this.state.state === 'blocking' || this.state.state === 'dodging' || this.state.state === 'rolling')) {'''
new_condition = '''    if (this.stretchFactor !== 1 && (this.state.state === 'running' || this.state.state === 'hurt' || this.state.state === 'attacking' || this.state.state === 'blocking' || this.state.state === 'dodging' || this.state.state === 'jumping' || this.state.state === 'rolling')) {'''
content = content.replace(old_condition, new_condition)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已添加跳跃和翻滚的渲染效果")
print("✓ 连招会增加攻击拉伸效果")
