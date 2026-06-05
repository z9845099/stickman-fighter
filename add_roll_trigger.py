# 添加翻滚触发逻辑

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 在handleActions中的dodge处理后添加翻滚触发逻辑
old_dodge_handler = '''    if (this.input.dodge) {
      const actionNow = Date.now();
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = actionNow;
      }
      return;
    }'''

new_dodge_handler = '''    if (this.input.dodge) {
      const actionNow = Date.now();
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        // 检查是否正在闪避中，如果是则触发翻滚
        if (this.state.state === 'dodging' && actionNow - this.lastAttackTime < 300) {
          this.performRoll();
        } else {
          this.performDodge();
        }
        this.lastAttackTime = actionNow;
      }
      return;
    }'''

content = content.replace(old_dodge_handler, new_dodge_handler)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已添加翻滚触发逻辑")
print("✓ 在闪避状态下按闪避键会触发翻滚")
