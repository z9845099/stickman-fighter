# 大幅增强武术动画效果

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 增强攻击动画 - 添加更精彩的武术动作
old_attack_arm = '''    } else if (this.state.state === 'attacking') {
      // 攻击时的手臂动作 - 挥拳
      const attackProgress = this.state.attackFrame / 20;
      rightArmAngle = -Math.PI / 2 + attackProgress * Math.PI * 0.8;
      rightForearmAngle = -0.5 + attackProgress * 1.5;
      leftArmAngle = 0.3 + Math.sin(attackProgress * Math.PI) * 0.4;'''

new_attack_arm = '''    } else if (this.state.state === 'attacking') {
      // 攻击时的手臂动作 - 武术风格挥拳
      const attackProgress = this.state.attackFrame / 20;
      const comboStyle = this.state.comboCount % 3;
      
      if (comboStyle === 0) {
        // 第一击：直拳
        rightArmAngle = -Math.PI / 2 + attackProgress * Math.PI * 0.9;
        rightForearmAngle = -0.3 + attackProgress * 1.2;
        leftArmAngle = 0.4 + Math.sin(attackProgress * Math.PI * 1.5) * 0.3;
      } else if (comboStyle === 1) {
        // 第二击：摆拳
        rightArmAngle = Math.PI / 6 + Math.sin(attackProgress * Math.PI) * Math.PI / 2;
        rightForearmAngle = -0.8 + attackProgress * 2;
        leftArmAngle = -0.5 + Math.cos(attackProgress * Math.PI) * 0.4;
      } else {
        // 第三击：上钩拳
        rightArmAngle = Math.PI / 3 + Math.sin(attackProgress * Math.PI * 1.5) * Math.PI / 3;
        rightForearmAngle = 0.5 + attackProgress * 1.5;
        leftArmAngle = 0.2 + Math.sin(attackProgress * Math.PI) * 0.5;
      }'''

content = content.replace(old_attack_arm, new_attack_arm)

# 增强攻击腿部动画
old_attack_leg = '''    } else if (this.state.state === 'attacking') {
      // 攻击时的踢腿 - 更有攻击性
      const attackProgress = this.state.attackFrame / 20;
      const kickPower = Math.sin(attackProgress * Math.PI);
      rightLegAngle = Math.max(-1.5, Math.min(-0.3, -Math.PI / 3 - kickPower * Math.PI / 4)); // 后踢，限制角度
      leftLegAngle = Math.max(-0.3, Math.min(0.8, Math.sin(attackProgress * Math.PI * 0.5) * 0.5)); // 前踢支撑
      leftLegLength = limbLength * (1 + kickPower * 0.25);'''

new_attack_leg = '''    } else if (this.state.state === 'attacking') {
      // 攻击时的踢腿 - 武术风格
      const attackProgress = this.state.attackFrame / 20;
      const kickPower = Math.sin(attackProgress * Math.PI);
      const comboStyle = this.state.comboCount % 3;
      
      if (comboStyle === 0) {
        // 第一击：后腿蹬地
        rightLegAngle = Math.max(-1.4, Math.min(-0.2, -Math.PI / 3 - kickPower * Math.PI / 5));
        leftLegAngle = Math.max(-0.2, Math.min(0.9, 0.3 + kickPower * 0.6));
        leftLegLength = limbLength * (1 + kickPower * 0.3);
      } else if (comboStyle === 1) {
        // 第二击：侧踢
        rightLegAngle = Math.max(-1.2, Math.min(0.8, kickPower * Math.PI / 3));
        leftLegAngle = Math.max(-0.1, Math.min(0.7, 0.2 - kickPower * 0.3));
        rightLegLength = limbLength * (1 + kickPower * 0.4);
      } else {
        // 第三击：转身踢
        rightLegAngle = Math.max(-1.5, Math.min(-0.1, -Math.PI / 4 + kickPower * Math.PI / 6));
        leftLegAngle = Math.max(-0.3, Math.min(1.0, kickPower * 0.8));
        rightLegLength = limbLength * (1 + kickPower * 0.35);
      }'''

content = content.replace(old_attack_leg, new_attack_leg)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 攻击动画已增强")
print("✓ 现在有三种不同的连招风格")
print("✓ 第一击：直拳+后腿蹬地")
print("✓ 第二击：摆拳+侧踢")
print("✓ 第三击：上钩拳+转身踢")
