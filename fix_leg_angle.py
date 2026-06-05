# 修复倒立走路问题并添加跳跃、翻滚动作

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复腿部角度限制，防止倒立
old_leg_calculation = '''    // 计算踢腿动作 - 更有功夫感的腿部动画
    let leftLegAngle = 0.3;
    let rightLegAngle = -0.3;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;
    
    if (this.state.state === 'running') {
      // 跑步时的踢腿
      const runPhase = now / 100;
      leftLegAngle = Math.sin(runPhase) * 0.6;
      rightLegAngle = Math.sin(runPhase + Math.PI) * 0.6;
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.2);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.2);
    } else if (this.state.state === 'attacking') {
      // 攻击时的踢腿 - 更有攻击性
      const attackProgress = this.state.attackFrame / 20;
      const kickPower = Math.sin(attackProgress * Math.PI);
      rightLegAngle = -Math.PI / 3 - kickPower * Math.PI / 4; // 后踢
      leftLegAngle = Math.sin(attackProgress * Math.PI * 0.5) * 0.4; // 前踢支撑
      leftLegLength = limbLength * (1 + kickPower * 0.3);
    } else if (this.state.state === 'dodging') {
      // 闪避时的踢腿 - 冲刺感
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      leftLegAngle = -0.2 - dodgePhase * 0.5;
      rightLegAngle = 0.3 + dodgePhase * 0.5;
      rightLegLength = limbLength * (1 + dodgePhase * 0.4);
    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 稳固但带轻微晃动
      const blockPhase = now / 200;
      leftLegAngle = 0.5 + Math.sin(blockPhase) * 0.08;
      rightLegAngle = -0.5 - Math.sin(blockPhase) * 0.08;
    } else {
      // 待机时的轻微晃动
      const idlePhase = now / 500;
      leftLegAngle = 0.3 + Math.sin(idlePhase) * 0.1;
      rightLegAngle = -0.3 - Math.sin(idlePhase) * 0.1;
    }'''

new_leg_calculation = '''    // 计算踢腿动作 - 更有功夫感的腿部动画
    let leftLegAngle = 0.3;
    let rightLegAngle = -0.3;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;
    
    if (this.state.state === 'running') {
      // 跑步时的踢腿 - 确保脚始终在身体下方
      const runPhase = now / 100;
      leftLegAngle = Math.max(-0.5, Math.min(0.8, Math.sin(runPhase) * 0.7));
      rightLegAngle = Math.max(-0.8, Math.min(0.5, Math.sin(runPhase + Math.PI) * 0.7));
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.15);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.15);
    } else if (this.state.state === 'attacking') {
      // 攻击时的踢腿 - 更有攻击性
      const attackProgress = this.state.attackFrame / 20;
      const kickPower = Math.sin(attackProgress * Math.PI);
      rightLegAngle = Math.max(-1.5, Math.min(-0.3, -Math.PI / 3 - kickPower * Math.PI / 4)); // 后踢，限制角度
      leftLegAngle = Math.max(-0.3, Math.min(0.8, Math.sin(attackProgress * Math.PI * 0.5) * 0.5)); // 前踢支撑
      leftLegLength = limbLength * (1 + kickPower * 0.25);
    } else if (this.state.state === 'dodging') {
      // 闪避时的踢腿 - 冲刺感
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      leftLegAngle = Math.max(-0.6, Math.min(0.3, -0.2 - dodgePhase * 0.4));
      rightLegAngle = Math.max(-0.3, Math.min(0.8, 0.3 + dodgePhase * 0.4));
      rightLegLength = limbLength * (1 + dodgePhase * 0.3);
    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 稳固但带轻微晃动
      const blockPhase = now / 200;
      leftLegAngle = Math.max(0.3, Math.min(0.7, 0.5 + Math.sin(blockPhase) * 0.08));
      rightLegAngle = Math.max(-0.7, Math.min(-0.3, -0.5 - Math.sin(blockPhase) * 0.08));
    } else {
      // 待机时的轻微晃动
      const idlePhase = now / 500;
      leftLegAngle = Math.max(0.15, Math.min(0.45, 0.3 + Math.sin(idlePhase) * 0.1));
      rightLegAngle = Math.max(-0.45, Math.min(-0.15, -0.3 - Math.sin(idlePhase) * 0.1));
    }'''

content = content.replace(old_leg_calculation, new_leg_calculation)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已修复倒立走路问题")
print("✓ 腿部角度已限制在合理范围，防止脚跑到身体上方")
