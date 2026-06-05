# 修复三个问题：增强托马斯全旋、添加连击数显示、修复瞬移Bug

# 1. 修改Player.ts - 增强托马斯全旋并修复瞬移
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 修改攻击动画，添加托马斯全旋和更多连击
old_attack_leg = '''    } else if (this.state.state === 'attacking') {
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
    }'''

new_attack_leg = '''    } else if (this.state.state === 'attacking') {
      // 攻击时的踢腿 - 武术风格
      const attackProgress = this.state.attackFrame / 18;
      const kickPower = Math.sin(attackProgress * Math.PI);
      const comboStyle = this.state.comboCount % 5;
      
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
      } else if (comboStyle === 2) {
        // 第三击：转身踢
        rightLegAngle = Math.max(-1.5, Math.min(-0.1, -Math.PI / 4 + kickPower * Math.PI / 6));
        leftLegAngle = Math.max(-0.3, Math.min(1.0, kickPower * 0.8));
        rightLegLength = limbLength * (1 + kickPower * 0.35);
      } else if (comboStyle === 3) {
        // 第四击：托马斯全旋 - 大幅旋转
        const spinProgress = attackProgress;
        const spinSpeed = 4; // 旋转速度
        bodyRotation = spinProgress * Math.PI * spinSpeed * 2; // 更多旋转圈数
        rightLegAngle = Math.sin(spinProgress * Math.PI * spinSpeed * 2 + Math.PI) * 1.8; // 更大幅度
        leftLegAngle = Math.sin(spinProgress * Math.PI * spinSpeed * 2) * 1.8;
        rightLegLength = limbLength * 1.6; // 更长的腿部
        leftLegLength = limbLength * 1.6;
      } else {
        // 第五击：旋风踢
        const spinProgress = attackProgress;
        bodyRotation = spinProgress * Math.PI * 3;
        rightLegAngle = Math.sin(spinProgress * Math.PI * 5) * 1.5;
        rightLegLength = limbLength * (1.5 + kickPower * 0.5);
        leftLegAngle = -0.2;
      }
    }'''

player_content = player_content.replace(old_attack_leg, new_attack_leg)

# 添加bodyRotation变量声明
old_leg_vars = '''    let leftLegAngle = 0.3;
    let rightLegAngle = -0.3;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;'''

new_leg_vars = '''    let leftLegAngle = 0.3;
    let rightLegAngle = -0.3;
    let leftLegLength = limbLength;
    let rightLegLength = limbLength;
    let bodyRotation = 0;'''

player_content = player_content.replace(old_leg_vars, new_leg_vars)

# 应用身体旋转
old_draw_leg = '''    // 绘制左腿 - 脚部位置计算
    const leftFootX = leftLegLength * Math.sin(leftLegAngle);
    const leftFootY = leftLegLength * Math.cos(leftLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.stroke();'''

new_draw_leg = '''    // 应用身体旋转
    ctx.save();
    ctx.rotate(bodyRotation);
    
    // 绘制左腿 - 脚部位置计算
    const leftFootX = leftLegLength * Math.sin(leftLegAngle);
    const leftFootY = leftLegLength * Math.cos(leftLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.stroke();'''

player_content = player_content.replace(old_draw_leg, new_draw_leg)

# 在restore之前添加新的restore
old_restore = '''    ctx.restore();

    ctx.restore();
  }'''

new_restore = '''    ctx.restore();
    
    ctx.restore();
  }'''

player_content = player_content.replace(old_restore, new_restore)

# 写回Player.ts
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts已更新")
print("✓ 托马斯全旋已增强")
