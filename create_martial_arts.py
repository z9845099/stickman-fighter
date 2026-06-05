# 创建真正的武术格斗系统

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 增强腿部动画，让走路更自然
old_leg_running = '''    if (this.state.state === 'running') {
      // 跑步时的踢腿 - 确保脚始终在身体下方
      const runPhase = now / 100;
      leftLegAngle = Math.max(-0.5, Math.min(0.8, Math.sin(runPhase) * 0.7));
      rightLegAngle = Math.max(-0.8, Math.min(0.5, Math.sin(runPhase + Math.PI) * 0.7));
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.15);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.15);'''

new_leg_running = '''    if (this.state.state === 'running') {
      // 跑步时的踢腿 - 武术风格的步法
      const runPhase = now / 80;
      const stepHeight = Math.sin(runPhase * 2);
      leftLegAngle = Math.max(-0.6, Math.min(0.9, Math.sin(runPhase) * 0.8 + stepHeight * 0.1));
      rightLegAngle = Math.max(-0.9, Math.min(0.6, Math.sin(runPhase + Math.PI) * 0.8 - stepHeight * 0.1));
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.2);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.2);'''

content = content.replace(old_leg_running, new_leg_running)

# 增强防御动作
old_leg_blocking = '''    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 稳固但带轻微晃动
      const blockPhase = now / 200;
      leftLegAngle = Math.max(0.3, Math.min(0.7, 0.5 + Math.sin(blockPhase) * 0.08));
      rightLegAngle = Math.max(-0.7, Math.min(-0.3, -0.5 - Math.sin(blockPhase) * 0.08));'''

new_leg_blocking = '''    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 武术马步
      const blockPhase = now / 250;
      leftLegAngle = Math.max(0.4, Math.min(0.8, 0.6 + Math.sin(blockPhase) * 0.12));
      rightLegAngle = Math.max(-0.8, Math.min(-0.4, -0.6 - Math.sin(blockPhase) * 0.12));'''

content = content.replace(old_leg_blocking, new_leg_blocking)

# 增强闪避动作
old_leg_dodging = '''    } else if (this.state.state === 'dodging') {
      // 闪避时的踢腿 - 冲刺感
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      leftLegAngle = Math.max(-0.6, Math.min(0.3, -0.2 - dodgePhase * 0.4));
      rightLegAngle = Math.max(-0.3, Math.min(0.8, 0.3 + dodgePhase * 0.4));
      rightLegLength = limbLength * (1 + dodgePhase * 0.3);'''

new_leg_dodging = '''    } else if (this.state.state === 'dodging') {
      // 闪避时的踢腿 - 滑步闪避
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      const dodgeSpeed = Math.sin(dodgePhase * Math.PI);
      leftLegAngle = Math.max(-0.7, Math.min(0.4, -0.1 - dodgeSpeed * 0.5));
      rightLegAngle = Math.max(-0.4, Math.min(0.9, 0.2 + dodgeSpeed * 0.6));
      rightLegLength = limbLength * (1 + dodgeSpeed * 0.4);
      leftLegLength = limbLength * (1 - dodgeSpeed * 0.2);'''

content = content.replace(old_leg_dodging, new_leg_dodging)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 腿部动画已增强")
print("✓ 跑步更流畅")
print("✓ 防御采用马步姿势")
print("✓ 闪避采用滑步效果")
