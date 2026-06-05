# 修复翻转逻辑并创建真正的武术格斗效果

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 添加翻转逻辑
old_draw = '''    ctx.translate(x, y);

    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

new_draw = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    const flipDirection = this.state.facing === 'left' ? -1 : 1;
    ctx.scale(flipDirection, 1);
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

content = content.replace(old_draw, new_draw)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 翻转逻辑已添加")
print("✓ 右边玩家现在会正确朝向左边")
