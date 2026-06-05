# 添加翻滚状态的拉伸效果

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修改拉伸效果部分
old_stretch = '''    if (this.stretchFactor !== 1 && (this.state.state === 'running' || this.state.state === 'hurt' || this.state.state === 'attacking' || this.state.state === 'blocking' || this.state.state === 'dodging')) {
      ctx.translate(x, y);
      if (this.state.state === 'attacking') {
        ctx.scale(this.stretchFactor, 0.5);
      } else if (this.state.state === 'blocking') {
        ctx.scale(0.6, 1.2);
      } else if (this.state.state === 'dodging') {
        ctx.scale(this.stretchFactor, 0.6);
      } else if (this.stretchDirection.x !== 0 || this.stretchDirection.y !== 0) {
        const angle = Math.atan2(this.stretchDirection.y, this.stretchDirection.x);
        ctx.rotate(angle);
        ctx.scale(this.stretchFactor, 0.7);
      }
      ctx.translate(-x, -y);
    }'''

new_stretch = '''    if (this.stretchFactor !== 1 && (this.state.state === 'running' || this.state.state === 'hurt' || this.state.state === 'attacking' || this.state.state === 'blocking' || this.state.state === 'dodging' || this.state.state === 'rolling')) {
      ctx.translate(x, y);
      if (this.state.state === 'attacking') {
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
      } else if (this.stretchDirection.x !== 0 || this.stretchDirection.y !== 0) {
        const angle = Math.atan2(this.stretchDirection.y, this.stretchDirection.x);
        ctx.rotate(angle);
        ctx.scale(this.stretchFactor, 0.7);
      }
      ctx.translate(-x, -y);
    }'''

content = content.replace(old_stretch, new_stretch)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 翻滚状态的拉伸效果已添加！")
print("✓ 翻滚时会有旋转和压缩效果")
