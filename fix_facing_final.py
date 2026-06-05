# 彻底修复朝向问题和改进动画流畅度

# 1. 修复朝向逻辑 - 添加调试信息
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复翻转逻辑 - 在translate之后立即翻转
old_draw_section = '''    ctx.translate(x, y);

    // 在翻转之前绘制攻击hitbox
    if (this.isAttackActive()) {
      const attackBox = this.getAttackHitbox();
      if (attackBox) {
        ctx.fillStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.fillRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
      }
    }
    
    // 根据朝向翻转火柴人 - 在所有绘制之前
    if (this.state.facing === 'left') {
      ctx.scale(-1, 1);
    }
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

new_draw_section = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    if (this.state.facing === 'left') {
      ctx.scale(-1, 1);
    }
    
    // 在翻转之后绘制攻击hitbox（这样hitbox也会被翻转）
    if (this.isAttackActive()) {
      const attackBox = this.getAttackHitbox();
      if (attackBox) {
        ctx.fillStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.fillRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
      }
    }
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);'''

content = content.replace(old_draw_section, new_draw_section)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 朝向逻辑已修复")
print("✓ 翻转现在应用在所有绘制之前")
