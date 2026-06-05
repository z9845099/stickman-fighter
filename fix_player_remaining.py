# 修复Player.ts中剩余的错误

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 删除对updateTrail的调用
content = content.replace('this.updateTrail();', '')

# 2. 删除drawSimpleStickFigure方法
old_draw_simple = '''  private drawSimpleStickFigure(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const bodyLength = 35;
    const headRadius = 12;

    ctx.beginPath();
    ctx.arc(0, -bodyLength - headRadius, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -bodyLength);
    ctx.lineTo(0, 0);
    ctx.stroke();
  }'''

content = content.replace(old_draw_simple, '')

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已修复Player.ts剩余错误")
print("✓ 删除了updateTrail调用")
print("✓ 删除了drawSimpleStickFigure方法")
