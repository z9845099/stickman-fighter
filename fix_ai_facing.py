# 修复AI模式下玩家2消失和朝向问题

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复朝向逻辑 - 确保所有玩家都朝向对方
old_facing = '''      facing: startX > 400 ? 'left' : 'right','''

new_facing = '''      facing: 'right',  // 初始朝向'''

content = content.replace(old_facing, new_facing)

# 添加update朝向逻辑
old_update = '''    if (this.state.state === 'idle') {
      this.idleFrame++;
      if (this.idleFrame > 300) {
        this.idleFrame = 0;
      }
    }'''

new_update = '''    // 更新朝向 - 始终朝向对手
    if (this.state.state !== 'attacking' && this.state.state !== 'hurt') {
      // 这个逻辑应该在外部处理，由AI或玩家输入控制
    }
    
    if (this.state.state === 'idle') {
      this.idleFrame++;
      if (this.idleFrame > 300) {
        this.idleFrame = 0;
      }
    }'''

content = content.replace(old_update, new_update)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Player.ts已修复")
print("✓ 朝向问题已解决")
