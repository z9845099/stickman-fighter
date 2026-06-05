# 创建街机风格的格斗系统

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换整个drawStickFigure方法，创建真正的武术动画
old_draw_stick = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 40;
    const limbLength = 35;
    const headRadius = 15;
    
    const now = Date.now();

    // 绘制头部
    ctx.beginPath();
    ctx.arc(0, -bodyLength - headRadius, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制身体
    ctx.beginPath();
    ctx.moveTo(0, -bodyLength);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 计算踢腿动作 - 更有功夫感的腿部动画
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
      }
    } else if (this.state.state === 'dodging') {
      // 闪避时的踢腿 - 滑步闪避
      const dodgePhase = Math.min(this.state.dodgeFrame / 15, 1);
      const dodgeSpeed = Math.sin(dodgePhase * Math.PI);
      leftLegAngle = Math.max(-0.7, Math.min(0.4, -0.1 - dodgeSpeed * 0.5));
      rightLegAngle = Math.max(-0.4, Math.min(0.9, 0.2 + dodgeSpeed * 0.6));
      rightLegLength = limbLength * (1 + dodgeSpeed * 0.4);
      leftLegLength = limbLength * (1 - dodgeSpeed * 0.2);
    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 武术马步
      const blockPhase = now / 250;
      leftLegAngle = Math.max(0.4, Math.min(0.8, 0.6 + Math.sin(blockPhase) * 0.12));
      rightLegAngle = Math.max(-0.8, Math.min(-0.4, -0.6 - Math.sin(blockPhase) * 0.12));
    } else {
      // 待机时的轻微晃动
      const idlePhase = now / 500;
      leftLegAngle = Math.max(0.15, Math.min(0.45, 0.3 + Math.sin(idlePhase) * 0.1));
      rightLegAngle = Math.max(-0.45, Math.min(-0.15, -0.3 - Math.sin(idlePhase) * 0.1));
    }

    // 绘制左腿
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftLegLength * Math.sin(leftLegAngle), leftLegLength * Math.cos(leftLegAngle));
    ctx.stroke();
    
    // 绘制左脚 - 小踢腿
    const leftFootAngle = leftLegAngle + (this.state.state === 'attacking' ? 0.3 : 0.1);
    ctx.beginPath();
    ctx.moveTo(leftLegLength * Math.sin(leftLegAngle), leftLegLength * Math.cos(leftLegAngle));
    ctx.lineTo(leftLegLength * Math.sin(leftLegAngle) + 12 * Math.sin(leftFootAngle + 0.3), leftLegLength * Math.cos(leftLegAngle) + 12 * Math.cos(leftFootAngle + 0.3));
    ctx.stroke();

    // 绘制右腿 - 脚部位置计算
    const rightFootX = rightLegLength * Math.sin(rightLegAngle);
    const rightFootY = rightLegLength * Math.cos(rightLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.stroke();
    
    // 绘制右脚 - 小踢腿
    const rightFootAngle = rightLegAngle - (this.state.state === 'attacking' ? 0.3 : 0.1);
    ctx.beginPath();
    ctx.moveTo(rightFootX, rightFootY);
    ctx.lineTo(rightFootX + 12 * Math.sin(rightFootAngle - 0.3), rightFootY + 12 * Math.cos(rightFootAngle - 0.3));
    ctx.stroke();

    // 绘制手臂 - 武术风格动画
    let rightArmAngle = 0.5;
    let leftArmAngle = -0.5;
    let rightForearmAngle = 0.3;
    let leftForearmAngle = -0.3;
    
    if (this.state.state === 'attacking') {
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
      }
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

new_draw_stick = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 45;
    const limbLength = 40;
    const headRadius = 16;
    
    const now = Date.now();

    // 绘制头部
    ctx.beginPath();
    ctx.arc(0, -bodyLength - headRadius, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制身体
    ctx.beginPath();
    ctx.moveTo(0, -bodyLength);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 街机风格的腿部动画
    let leftLegAngle = 0.35;
    let rightLegAngle = -0.35;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;
    let bodyRotation = 0;
    
    if (this.state.state === 'running') {
      const runPhase = now / 60;
      leftLegAngle = Math.sin(runPhase) * 0.85;
      rightLegAngle = Math.sin(runPhase + Math.PI) * 0.85;
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.25);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.25);
    } else if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 15;
      const kickPower = Math.sin(attackProgress * Math.PI);
      const comboStyle = this.state.comboCount % 5;
      
      if (comboStyle === 0) {
        // 直拳 - 后腿蹬地
        rightLegAngle = -1.2 - kickPower * 0.8;
        leftLegAngle = 0.4 + kickPower * 0.7;
        leftLegLength = limbLength * (1 + kickPower * 0.3);
      } else if (comboStyle === 1) {
        // 摆拳 - 转身
        bodyRotation = Math.sin(attackProgress * Math.PI) * 0.3;
        rightLegAngle = -0.8 + kickPower * 0.6;
        leftLegAngle = 0.2 - kickPower * 0.4;
      } else if (comboStyle === 2) {
        // 旋风踢
        bodyRotation = attackProgress * Math.PI * 2;
        rightLegAngle = Math.sin(attackProgress * Math.PI * 4) * 1.2;
        rightLegLength = limbLength * (1.2 + kickPower * 0.4);
        leftLegAngle = -0.3;
      } else if (comboStyle === 3) {
        // 托马斯全旋
        bodyRotation = attackProgress * Math.PI * 3;
        rightLegAngle = Math.sin(attackProgress * Math.PI * 3) * 1.5;
        leftLegAngle = Math.sin(attackProgress * Math.PI * 3 + Math.PI / 2) * 1.5;
        rightLegLength = limbLength * 1.3;
        leftLegLength = limbLength * 1.3;
      } else {
        // 上钩拳
        rightLegAngle = -0.5;
        leftLegAngle = 0.8 + kickPower * 0.5;
        leftLegLength = limbLength * (1 + kickPower * 0.2);
      }
    } else if (this.state.state === 'dodging') {
      const dodgePhase = Math.min(this.state.dodgeFrame / 10, 1);
      const dodgeSpeed = Math.sin(dodgePhase * Math.PI);
      leftLegAngle = -0.3 - dodgeSpeed * 0.8;
      rightLegAngle = 0.5 + dodgeSpeed * 0.9;
      rightLegLength = limbLength * (1 + dodgeSpeed * 0.5);
    } else if (this.state.state === 'blocking') {
      const blockPhase = now / 150;
      leftLegAngle = 0.6 + Math.sin(blockPhase) * 0.15;
      rightLegAngle = -0.6 - Math.sin(blockPhase) * 0.15;
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 20;
      bodyRotation = rollProgress * Math.PI * 6;
      leftLegAngle = Math.sin(rollProgress * Math.PI * 4) * 1.2;
      rightLegAngle = Math.sin(rollProgress * Math.PI * 4 + Math.PI) * 1.2;
    } else {
      const idlePhase = now / 300;
      leftLegAngle = 0.35 + Math.sin(idlePhase) * 0.15;
      rightLegAngle = -0.35 - Math.sin(idlePhase) * 0.15;
    }

    // 应用身体旋转
    ctx.save();
    ctx.rotate(bodyRotation);

    // 绘制左腿
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftLegLength * Math.sin(leftLegAngle), leftLegLength * Math.cos(leftLegAngle));
    ctx.stroke();
    
    // 绘制左脚
    const leftFootAngle = leftLegAngle + (this.state.state === 'attacking' ? 0.4 : 0.15);
    const leftFootX = leftLegLength * Math.sin(leftLegAngle);
    const leftFootY = leftLegLength * Math.cos(leftLegAngle);
    ctx.beginPath();
    ctx.moveTo(leftFootX, leftFootY);
    ctx.lineTo(leftFootX + 14 * Math.sin(leftFootAngle + 0.4), leftFootY + 14 * Math.cos(leftFootAngle + 0.4));
    ctx.stroke();

    // 绘制右腿
    const rightFootX = rightLegLength * Math.sin(rightLegAngle);
    const rightFootY = rightLegLength * Math.cos(rightLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.stroke();
    
    // 绘制右脚
    const rightFootAngle = rightLegAngle - (this.state.state === 'attacking' ? 0.4 : 0.15);
    ctx.beginPath();
    ctx.moveTo(rightFootX, rightFootY);
    ctx.lineTo(rightFootX + 14 * Math.sin(rightFootAngle - 0.4), rightFootY + 14 * Math.cos(rightFootAngle - 0.4));
    ctx.stroke();

    // 街机风格的手臂动画
    let rightArmAngle = 0.6;
    let leftArmAngle = -0.6;
    let rightForearmAngle = 0.4;
    let leftForearmAngle = -0.4;
    
    if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 15;
      const comboStyle = this.state.comboCount % 5;
      
      if (comboStyle === 0) {
        rightArmAngle = -Math.PI / 2 + attackProgress * Math.PI * 1.1;
        rightForearmAngle = -0.2 + attackProgress * 1.5;
        leftArmAngle = 0.5 + Math.sin(attackProgress * Math.PI * 2) * 0.3;
      } else if (comboStyle === 1) {
        rightArmAngle = Math.PI / 4 + Math.sin(attackProgress * Math.PI) * Math.PI / 2.5;
        rightForearmAngle = -1 + attackProgress * 2.2;
        leftArmAngle = -0.6 + Math.cos(attackProgress * Math.PI) * 0.5;
      } else if (comboStyle === 2) {
        rightArmAngle = Math.sin(attackProgress * Math.PI * 4) * 0.8;
        rightForearmAngle = Math.cos(attackProgress * Math.PI * 4) * 0.6;
        leftArmAngle = Math.sin(attackProgress * Math.PI * 4 + Math.PI) * 0.8;
      } else if (comboStyle === 3) {
        rightArmAngle = Math.sin(attackProgress * Math.PI * 3) * 1.2;
        leftArmAngle = Math.sin(attackProgress * Math.PI * 3 + Math.PI / 2) * 1.2;
        rightForearmAngle = 0;
        leftForearmAngle = 0;
      } else {
        rightArmAngle = Math.PI / 4 + Math.sin(attackProgress * Math.PI * 2) * Math.PI / 3;
        rightForearmAngle = 0.8 + attackProgress * 1.8;
        leftArmAngle = 0.3 + Math.sin(attackProgress * Math.PI) * 0.4;
      }
    } else if (this.state.state === 'running') {
      const runPhase = now / 50;
      rightArmAngle = Math.sin(runPhase) * 0.8 + 0.3;
      leftArmAngle = Math.sin(runPhase + Math.PI) * 0.8 - 0.3;
      rightForearmAngle = Math.sin(runPhase + 0.5) * 0.5;
      leftForearmAngle = Math.sin(runPhase + Math.PI + 0.5) * 0.5;
    } else if (this.state.state === 'dodging') {
      const dodgePhase = Math.min(this.state.dodgeFrame / 10, 1);
      rightArmAngle = -0.5 - dodgePhase * 0.8;
      leftArmAngle = 1 + dodgePhase * 0.4;
      rightForearmAngle = 0.6;
      leftForearmAngle = -0.6;
    } else if (this.state.state === 'blocking') {
      const blockPhase = now / 150;
      rightArmAngle = -0.3 + Math.sin(blockPhase) * 0.15;
      leftArmAngle = 0.3 - Math.sin(blockPhase) * 0.15;
      rightForearmAngle = 1.5;
      leftForearmAngle = -1.5;
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 20;
      rightArmAngle = Math.sin(rollProgress * Math.PI * 4) * 1;
      leftArmAngle = Math.sin(rollProgress * Math.PI * 4 + Math.PI) * 1;
      rightForearmAngle = 0;
      leftForearmAngle = 0;
    } else {
      const idlePhase = now / 250;
      rightArmAngle = 0.6 + Math.sin(idlePhase) * 0.2;
      leftArmAngle = -0.6 - Math.sin(idlePhase) * 0.2;
      rightForearmAngle = 0.4 + Math.cos(idlePhase) * 0.15;
      leftForearmAngle = -0.4 - Math.cos(idlePhase) * 0.15;
    }

    const upperArmLen = limbLength * 0.65;
    const forearmLen = limbLength * 0.55;

    // 绘制右臂
    const rightShoulderX = 0;
    const rightShoulderY = -bodyLength * 0.65;
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

    // 绘制左臂
    const leftShoulderX = 0;
    const leftShoulderY = -bodyLength * 0.65;
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

    ctx.restore();
  }'''

content = content.replace(old_draw_stick, new_draw_stick)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 街机风格格斗系统已创建")
print("✓ 包含5种连招：直拳、摆拳、旋风踢、托马斯全旋、上钩拳")
print("✓ 更加流畅的动画效果")
