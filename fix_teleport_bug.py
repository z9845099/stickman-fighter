# 修复瞬移Bug - 限制攻击时的移动速度

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修改performAttack方法，添加速度限制
old_perform_attack = '''  private performAttack() {
    if (this.state.state !== 'attacking') {
      this.state.state = 'attacking';
      this.state.attackFrame = 0;
      this.stretchFactor = 2.0;
      
      const now = Date.now();
      if (now - this.state.lastComboTime < 1500) {
        this.state.comboCount++;
      } else {
        this.state.comboCount = 1;
      }
      this.state.lastComboTime = now;
    }
  }'''

new_perform_attack = '''  private performAttack() {
    if (this.state.state !== 'attacking') {
      this.state.state = 'attacking';
      this.state.attackFrame = 0;
      this.stretchFactor = 2.0;
      
      // 限制攻击时的移动速度，防止瞬移
      this.state.velocity.x *= 0.3;
      this.state.velocity.y *= 0.3;
      
      const now = Date.now();
      if (now - this.state.lastComboTime < 1500) {
        this.state.comboCount++;
      } else {
        this.state.comboCount = 1;
      }
      this.state.lastComboTime = now;
    }
  }'''

content = content.replace(old_perform_attack, new_perform_attack)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 瞬移Bug已修复")
print("✓ 攻击时移动速度被限制")
