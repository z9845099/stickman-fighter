# 修复状态检查逻辑错误

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复闪避逻辑 - 使用lastAction而不是当前状态
old_dodge_logic = '''    if (this.input.dodge) {
      const actionNow = Date.now();
      // 如果正在闪避中，且上次闪避时间在300ms内，触发翻滚
      if (this.state.state === 'dodging' && actionNow - this.lastAttackTime < 300) {
        this.performRoll();
        this.lastAttackTime = actionNow;
        return;
      }
      // 否则触发普通闪避（需要冷却时间）
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = actionNow;
      }
      return;
    }'''

new_dodge_logic = '''    if (this.input.dodge) {
      const actionNow = Date.now();
      // 检查是否刚闪避过（300ms内），触发翻滚
      if (actionNow - this.lastAttackTime < 300) {
        this.performRoll();
        this.lastAttackTime = actionNow;
        return;
      }
      // 否则触发普通闪避（需要冷却时间）
      if (actionNow - this.lastAttackTime >= 0.5 * 1000) {
        this.performDodge();
        this.lastAttackTime = actionNow;
      }
      return;
    }'''

content = content.replace(old_dodge_logic, new_dodge_logic)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 闪避逻辑已修复")
print("✓ 使用时间检查代替状态检查")
