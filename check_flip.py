# 检查并修复翻转逻辑

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 检查是否已有翻转逻辑
if 'this.state.facing ===' in content:
    print("✓ 翻转逻辑已存在")
else:
    print("✗ 翻转逻辑缺失，需要添加")
    
    # 添加翻转逻辑
    old_code = '''    ctx.translate(x, y);
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''
    
    new_code = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    const flipDirection = this.state.facing === 'left' ? -1 : 1;
    ctx.scale(flipDirection, 1);
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''
    
    content = content.replace(old_code, new_code)
    
    # 写回文件
    with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ 已添加翻转逻辑")
