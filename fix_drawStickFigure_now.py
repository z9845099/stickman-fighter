# 修复drawStickFigure方法中now变量未定义的问题

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 在drawStickFigure方法中添加now变量声明
old_start = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 40;
    const limbLength = 35;
    const headRadius = 15;

    // 绘制头部'''

new_start = '''  private drawStickFigure(ctx: CanvasRenderingContext2D, color: string, isHurt: boolean) {
    ctx.strokeStyle = isHurt ? '#ff0000' : color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const bodyLength = 40;
    const limbLength = 35;
    const headRadius = 15;
    
    const now = Date.now();

    // 绘制头部'''

content = content.replace(old_start, new_start)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已在drawStickFigure方法中添加now变量声明")
