# 修复翻滚触发逻辑的条件矛盾问题

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复翻滚触发逻辑 - 原来的条件有矛盾（>=500ms 和 <300ms不能同时满足）
old_bad_logic = '''    if (this.input.dodge) {
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

new_good_logic = '''    if (this.input.dodge) {
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

content = content.replace(old_bad_logic, new_good_logic)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已修复翻滚触发逻辑")
print("✓ 现在可以正常触发翻滚了")
