# 彻底重写火柴人格斗系统 - 街机风格

# 1. 首先修复翻转问题
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 确保翻转逻辑正确应用
old_flip = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    const flipDirection = this.state.facing === 'left' ? -1 : 1;
    ctx.scale(flipDirection, 1);
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

new_flip = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    if (this.state.facing === 'left') {
      ctx.scale(-1, 1);
    }
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

content = content.replace(old_flip, new_flip)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 翻转逻辑已修复")
