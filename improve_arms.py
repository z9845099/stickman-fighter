# 改进手臂动画和添加翻滚动作

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换手臂绘制部分
old_arms = '''    // 绘制手臂
    let armAngle = 0.5;
    if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 20;
      armAngle = -Math.PI / 2 + attackProgress * Math.PI;
    }

    const armLen = limbLength * 0.9;
    ctx.beginPath();
    ctx.moveTo(0, -bodyLength * 0.6);
    ctx.lineTo(armLen * Math.sin(armAngle), -bodyLength * 0.6 + armLen * Math.cos(armAngle));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -bodyLength * 0.6);
    ctx.lineTo(-armLen * 0.6, -bodyLength * 0.6 + armLen * 0.5);
    ctx.stroke();
  }'''

new_arms = '''    // 绘制手臂 - 武术风格动画
    const now = Date.now();
    let rightArmAngle = 0.5;
    let leftArmAngle = -0.5;
    let rightForearmAngle = 0.3;
    let leftForearmAngle = -0.3;
    
    if (this.state.state === 'attacking') {
      // 攻击时的手臂动作 - 挥拳
      const attackProgress = this.state.attackFrame / 20;
      rightArmAngle = -Math.PI / 2 + attackProgress * Math.PI * 0.8;
      rightForearmAngle = -0.5 + attackProgress * 1.5;
      leftArmAngle = 0.3 + Math.sin(attackProgress * Math.PI) * 0.4;
    } else if (this.state.state === 'running') {
      // 跑步时的手臂摆动
      const runPhase = now / 120;
      rightArmAngle = Math.sin(runPhase) * 0.6 + 0.2;
      leftArmAngle = Math.sin(runPhase + Math.PI) * 0.6 - 0.2;
      rightForearmAngle = Math.sin(runPhase + 0.5) * 0.4;
      leftForearmAngle = Math.sin(runPhase + Math.PI + 0.5) * 0.4;
    } else if (this.state.state === 'dodging') {
      // 闪避时的手臂动作
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      rightArmAngle = -0.3 - dodgePhase * 0.5;
      leftArmAngle = 0.8 + dodgePhase * 0.3;
      rightForearmAngle = 0.5;
      leftForearmAngle = -0.5;
    } else if (this.state.state === 'blocking') {
      // 防御时的手臂动作 - 格挡姿势
      const blockPhase = now / 250;
      rightArmAngle = -0.2 + Math.sin(blockPhase) * 0.1;
      leftArmAngle = 0.2 - Math.sin(blockPhase) * 0.1;
      rightForearmAngle = 1.2;
      leftForearmAngle = -1.2;
    } else {
      // 待机时的手臂轻微晃动
      const idlePhase = now / 400;
      rightArmAngle = 0.5 + Math.sin(idlePhase) * 0.15;
      leftArmAngle = -0.5 - Math.sin(idlePhase) * 0.15;
      rightForearmAngle = 0.3 + Math.cos(idlePhase) * 0.1;
      leftForearmAngle = -0.3 - Math.cos(idlePhase) * 0.1;
    }

    const upperArmLen = limbLength * 0.6;
    const forearmLen = limbLength * 0.5;

    // 绘制右臂 - 上臂 + 前臂
    const rightShoulderX = 0;
    const rightShoulderY = -bodyLength * 0.6;
    const rightElbowX = rightShoulderX + upperArmLen * Math.sin(rightArmAngle);
    const rightElbowY = rightShoulderY + upperArmLen * Math.cos(rightArmAngle);
    const rightHandX = rightElbowX + forearmLen * Math.sin(rightArmAngle + rightForearmAngle);
    const rightHandY = rightElbowY + forearmLen * Math.cos(rightArmAngle + rightForearmAngle);

    ctx.beginPath();
    ctx.moveTo(rightShoulderX, rightShoulderY);
    ctx.lineTo(rightElbowX, rightElbowY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightElbowX, rightElbowY);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.stroke();

    // 绘制左臂 - 上臂 + 前臂
    const leftShoulderX = 0;
    const leftShoulderY = -bodyLength * 0.6;
    const leftElbowX = leftShoulderX + upperArmLen * Math.sin(leftArmAngle);
    const leftElbowY = leftShoulderY + upperArmLen * Math.cos(leftArmAngle);
    const leftHandX = leftElbowX + forearmLen * Math.sin(leftArmAngle + leftForearmAngle);
    const leftHandY = leftElbowY + forearmLen * Math.cos(leftArmAngle + leftForearmAngle);

    ctx.beginPath();
    ctx.moveTo(leftShoulderX, leftShoulderY);
    ctx.lineTo(leftElbowX, leftElbowY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftElbowX, leftElbowY);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.stroke();
  }'''

content = content.replace(old_arms, new_arms)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 手臂动画已改进！")
print("✓ 现在有更流畅的武术风格手臂动作")
print("✓ 跑步、攻击、防御、闪避都有独立的手臂动画")
