import re

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 注释掉残影调用
content = re.sub(
    r'(\s+)this\.drawTrail\(ctx\);',
    r'\1// this.drawTrail(ctx); // 残影已禁用',
    content
)

# 2. 替换drawStickFigure方法
old_drawStickFigure = r'''  private drawStickFigure\(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean\) \{
    ctx\.strokeStyle = isHurt \? '#ff0000' : color;
    ctx\.lineWidth = 4;
    ctx\.lineCap = 'round';

    const bodyLength = 40;
    const limbLength = 35;
    const headRadius = 15;

    ctx\.beginPath\(\);
    ctx\.arc\(0, -bodyLength - headRadius, headRadius, 0, Math\.PI \* 2\);
    ctx\.stroke\(\);

    ctx\.beginPath\(\);
    ctx\.moveTo\(0, -bodyLength\);
    ctx\.lineTo\(0, 0\);
    ctx\.stroke\(\);

    const legPhase = Math\.sin\(Date\.now\(\) / 80\) \* 0\.5;
    let legAngle = 0\.4;
    
    if \(this\.state\.state === 'running'\) \{
      legAngle = legPhase;
    \}

    ctx\.beginPath\(\);
    ctx\.moveTo\(0, 0\);
    ctx\.lineTo\(-limbLength \* Math\.cos\(legAngle\), limbLength \* Math\.sin\(legAngle\)\);
    ctx\.moveTo\(0, 0\);
    ctx\.lineTo\(limbLength \* Math\.cos\(-legAngle\), limbLength \* Math\.sin\(-legAngle\)\);
    ctx\.stroke\(\);

    let armAngle = 0\.5;
    if \(this\.state\.state === 'attacking'\) \{
      const attackProgress = this\.state\.attackFrame / 20;
      armAngle = -Math\.PI / 2 + attackProgress \* Math\.PI;
    \}

    const armLen = limbLength \* 0\.9;
    ctx\.beginPath\(\);
    ctx\.moveTo\(0, -bodyLength \* 0\.6\);
    ctx\.lineTo\(armLen \* Math\.sin\(armAngle\), -bodyLength \* 0\.6 + armLen \* Math\.cos\(armAngle\)\);
    ctx\.stroke\(\);

    ctx\.beginPath\(\);
    ctx\.moveTo\(0, -bodyLength \* 0\.6\);
    ctx\.lineTo\(-armLen \* 0\.6, -bodyLength \* 0\.6 + armLen \* 0\.5\);
    ctx\.stroke\(\);
  \}'''

new_drawStickFigure = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 40;
    const limbLength = 35;
    const headRadius = 15;

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
    const now = Date.now();
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
      // 防御时的踢腿 - 稳固站姿
      leftLegAngle = 0.5;
      rightLegAngle = -0.5;
    } else {
      // 待机时的轻微晃动
      const idlePhase = now / 500;
      leftLegAngle = 0.3 + Math.sin(idlePhase) * 0.1;
      rightLegAngle = -0.3 - Math.sin(idlePhase) * 0.1;
    }

    // 绘制左腿 - 脚部位置计算
    const leftFootX = leftLegLength * Math.sin(leftLegAngle);
    const leftFootY = leftLegLength * Math.cos(leftLegAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.stroke();
    
    // 绘制左脚 - 小踢腿
    const leftFootAngle = leftLegAngle + (this.state.state === 'attacking' ? 0.3 : 0.1);
    ctx.beginPath();
    ctx.moveTo(leftFootX, leftFootY);
    ctx.lineTo(leftFootX + 12 * Math.sin(leftFootAngle + 0.3), leftFootY + 12 * Math.cos(leftFootAngle + 0.3));
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

    // 绘制手臂
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

content = re.sub(old_drawStickFigure, new_drawStickFigure, content)

# 写入修改后的文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("修改完成！")
print("1. 残影效果已禁用")
print("2. 火柴人腿部动画已优化，更有功夫感")
