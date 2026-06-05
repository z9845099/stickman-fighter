# 创建流畅的武术动画系统

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换drawStickFigure方法，创建更流畅的动画
old_draw_stick = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
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

new_draw_stick = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 45;
    const limbLength = 40;
    const headRadius = 16;
    
    const now = Date.now();

    // 缓动函数 - 使动画更流畅
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };
    
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };
    
    const easeInCubic = (t: number): number => {
      return t * t * t;
    };

    // 绘制头部
    ctx.beginPath();
    ctx.arc(0, -bodyLength - headRadius, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制身体
    ctx.beginPath();
    ctx.moveTo(0, -bodyLength);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 流畅的腿部动画
    let leftLegAngle = 0.35;
    let rightLegAngle = -0.35;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;
    let bodyRotation = 0;
    let bodySway = 0;
    
    if (this.state.state === 'running') {
      const runPhase = now / 55;
      const easedPhase = easeInOutQuad((runPhase % 1));
      leftLegAngle = Math.sin(runPhase) * 0.9;
      rightLegAngle = Math.sin(runPhase + Math.PI) * 0.9;
      leftLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase)) * 0.3);
      rightLegLength = limbLength * (1 + Math.abs(Math.sin(runPhase + Math.PI)) * 0.3);
      bodySway = Math.sin(runPhase * 2) * 0.05;
    } else if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 18;
      const easedProgress = easeInOutQuad(attackProgress);
      const kickPower = easeOutCubic(Math.sin(attackProgress * Math.PI));
      const comboStyle = this.state.comboCount % 5;
      
      if (comboStyle === 0) {
        // 直拳 - 后腿蹬地
        rightLegAngle = -1.1 - kickPower * 0.9;
        leftLegAngle = 0.3 + kickPower * 0.8;
        leftLegLength = limbLength * (1 + kickPower * 0.35);
        bodyRotation = kickPower * 0.15;
      } else if (comboStyle === 1) {
        // 摆拳 - 转身
        bodyRotation = easeOutCubic(Math.sin(attackProgress * Math.PI)) * 0.4;
        rightLegAngle = -0.7 + kickPower * 0.7;
        leftLegAngle = 0.1 - kickPower * 0.5;
        bodySway = Math.sin(attackProgress * Math.PI * 3) * 0.08;
      } else if (comboStyle === 2) {
        // 旋风踢
        bodyRotation = attackProgress * Math.PI * 2.5;
        const legSwing = easeOutCubic(Math.sin(attackProgress * Math.PI * 4));
        rightLegAngle = legSwing * 1.3;
        rightLegLength = limbLength * (1.3 + kickPower * 0.5);
        leftLegAngle = -0.2 + legSwing * 0.3;
      } else if (comboStyle === 3) {
        // 托马斯全旋 - 更流畅的旋转
        bodyRotation = attackProgress * Math.PI * 3.5;
        const spinProgress = easeInOutQuad(attackProgress);
        rightLegAngle = Math.sin(spinProgress * Math.PI * 4) * 1.6;
        leftLegAngle = Math.sin(spinProgress * Math.PI * 4 + Math.PI / 2) * 1.6;
        rightLegLength = limbLength * 1.4;
        leftLegLength = limbLength * 1.4;
      } else {
        // 上钩拳
        rightLegAngle = -0.4;
        leftLegAngle = 0.7 + kickPower * 0.6;
        leftLegLength = limbLength * (1 + kickPower * 0.25);
        bodyRotation = kickPower * 0.1;
      }
    } else if (this.state.state === 'dodging') {
      const dodgePhase = Math.min(this.state.dodgeFrame / 12, 1);
      const easedDodge = easeOutCubic(dodgePhase);
      const dodgeSpeed = easedDodge;
      leftLegAngle = -0.25 - dodgeSpeed * 0.9;
      rightLegAngle = 0.45 + dodgeSpeed * 1;
      rightLegLength = limbLength * (1 + dodgeSpeed * 0.55);
      bodyRotation = dodgeSpeed * 0.2;
    } else if (this.state.state === 'blocking') {
      const blockPhase = now / 180;
      leftLegAngle = 0.55 + Math.sin(blockPhase) * 0.18;
      rightLegAngle = -0.55 - Math.sin(blockPhase) * 0.18;
      bodySway = Math.sin(blockPhase * 2) * 0.03;
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 22;
      const easedRoll = easeInOutQuad(rollProgress);
      bodyRotation = easedRoll * Math.PI * 6;
      const legSpread = easeOutCubic(Math.sin(rollProgress * Math.PI * 4));
      leftLegAngle = legSpread * 1.3;
      rightLegAngle = legSpread * -1.3;
    } else {
      const idlePhase = now / 350;
      leftLegAngle = 0.35 + Math.sin(idlePhase) * 0.18;
      rightLegAngle = -0.35 - Math.sin(idlePhase) * 0.18;
      bodySway = Math.sin(idlePhase * 1.5) * 0.02;
    }

    // 应用身体旋转和晃动
    ctx.save();
    ctx.rotate(bodyRotation + bodySway);

    // 绘制左腿
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftLegLength * Math.sin(leftLegAngle), leftLegLength * Math.cos(leftLegAngle));
    ctx.stroke();
    
    // 绘制左脚 - 更自然的脚部动作
    const leftFootAngle = leftLegAngle + (this.state.state === 'attacking' ? 0.45 : 0.18);
    const footSwing = this.state.state === 'running' ? Math.sin(now / 40) * 0.1 : 0;
    const leftFootX = leftLegLength * Math.sin(leftLegAngle);
    const leftFootY = leftLegLength * Math.cos(leftLegAngle);
    ctx.beginPath();
    ctx.moveTo(leftFootX, leftFootY);
    ctx.lineTo(leftFootX + 14 * Math.sin(leftFootAngle + 0.4 + footSwing), leftFootY + 14 * Math.cos(leftFootAngle + 0.4 + footSwing));
    ctx.stroke();

    // 绘制右腿
    const rightFootX = rightLegLength * Math.sin(rightLegAngle);
    const rightFootY = rightLegLength * Math.cos(rightLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.stroke();
    
    // 绘制右脚
    const rightFootAngle = rightLegAngle - (this.state.state === 'attacking' ? 0.45 : 0.18);
    ctx.beginPath();
    ctx.moveTo(rightFootX, rightFootY);
    ctx.lineTo(rightFootX + 14 * Math.sin(rightFootAngle - 0.4 - footSwing), rightFootY + 14 * Math.cos(rightFootAngle - 0.4 - footSwing));
    ctx.stroke();

    // 流畅的手臂动画
    let rightArmAngle = 0.6;
    let leftArmAngle = -0.6;
    let rightForearmAngle = 0.4;
    let leftForearmAngle = -0.4;
    
    if (this.state.state === 'attacking') {
      const attackProgress = this.state.attackFrame / 18;
      const easedProgress = easeInOutQuad(attackProgress);
      const comboStyle = this.state.comboCount % 5;
      
      if (comboStyle === 0) {
        // 直拳
        rightArmAngle = -Math.PI / 2 + easedProgress * Math.PI * 1.2;
        rightForearmAngle = -0.15 + easedProgress * 1.6;
        leftArmAngle = 0.45 + Math.sin(easedProgress * Math.PI * 2.5) * 0.35;
        leftForearmAngle = -0.3 + Math.cos(easedProgress * Math.PI) * 0.2;
      } else if (comboStyle === 1) {
        // 摆拳
        rightArmAngle = Math.PI / 4 + Math.sin(easedProgress * Math.PI) * Math.PI / 2.2;
        rightForearmAngle = -1.1 + easedProgress * 2.4;
        leftArmAngle = -0.55 + Math.cos(easedProgress * Math.PI) * 0.55;
        leftForearmAngle = 0.2 + Math.sin(easedProgress * Math.PI * 2) * 0.3;
      } else if (comboStyle === 2) {
        // 旋风踢时的手臂动作
        rightArmAngle = Math.sin(easedProgress * Math.PI * 4.5) * 0.9;
        rightForearmAngle = Math.cos(easedProgress * Math.PI * 4.5) * 0.7;
        leftArmAngle = Math.sin(easedProgress * Math.PI * 4.5 + Math.PI) * 0.9;
        leftForearmAngle = Math.cos(easedProgress * Math.PI * 4.5 + Math.PI) * 0.7;
      } else if (comboStyle === 3) {
        // 托马斯全旋
        rightArmAngle = Math.sin(easedProgress * Math.PI * 4) * 1.3;
        leftArmAngle = Math.sin(easedProgress * Math.PI * 4 + Math.PI / 2) * 1.3;
        rightForearmAngle = Math.cos(easedProgress * Math.PI * 4) * 0.5;
        leftForearmAngle = Math.cos(easedProgress * Math.PI * 4 + Math.PI / 2) * 0.5;
      } else {
        // 上钩拳
        rightArmAngle = Math.PI / 4 + Math.sin(easedProgress * Math.PI * 2.5) * Math.PI / 2.8;
        rightForearmAngle = 0.7 + easedProgress * 2;
        leftArmAngle = 0.25 + Math.sin(easedProgress * Math.PI) * 0.45;
        leftForearmAngle = -0.4 + Math.cos(easedProgress * Math.PI) * 0.25;
      }
    } else if (this.state.state === 'running') {
      const runPhase = now / 45;
      rightArmAngle = Math.sin(runPhase) * 0.85 + 0.35;
      leftArmAngle = Math.sin(runPhase + Math.PI) * 0.85 - 0.35;
      rightForearmAngle = Math.sin(runPhase + 0.6) * 0.55;
      leftForearmAngle = Math.sin(runPhase + Math.PI + 0.6) * 0.55;
    } else if (this.state.state === 'dodging') {
      const dodgePhase = Math.min(this.state.dodgeFrame / 12, 1);
      const easedDodge = easeOutCubic(dodgePhase);
      rightArmAngle = -0.45 - easedDodge * 0.9;
      leftArmAngle = 1.05 + easedDodge * 0.35;
      rightForearmAngle = 0.65;
      leftForearmAngle = -0.65;
    } else if (this.state.state === 'blocking') {
      const blockPhase = now / 180;
      rightArmAngle = -0.25 + Math.sin(blockPhase) * 0.18;
      leftArmAngle = 0.25 - Math.sin(blockPhase) * 0.18;
      rightForearmAngle = 1.6;
      leftForearmAngle = -1.6;
    } else if (this.state.state === 'rolling') {
      const rollProgress = this.state.rollFrame / 22;
      const easedRoll = easeInOutQuad(rollProgress);
      rightArmAngle = Math.sin(easedRoll * Math.PI * 4.5) * 1.1;
      leftArmAngle = Math.sin(easedRoll * Math.PI * 4.5 + Math.PI) * 1.1;
      rightForearmAngle = Math.cos(easedRoll * Math.PI * 4.5) * 0.4;
      leftForearmAngle = Math.cos(easedRoll * Math.PI * 4.5 + Math.PI) * 0.4;
    } else {
      const idlePhase = now / 300;
      rightArmAngle = 0.6 + Math.sin(idlePhase) * 0.22;
      leftArmAngle = -0.6 - Math.sin(idlePhase) * 0.22;
      rightForearmAngle = 0.4 + Math.cos(idlePhase) * 0.18;
      leftForearmAngle = -0.4 - Math.cos(idlePhase) * 0.18;
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

print("✓ 流畅的武术动画系统已创建")
print("✓ 使用缓动函数实现自然过渡")
print("✓ 动画更加流畅自然")
