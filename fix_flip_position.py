# 修复翻转逻辑的位置问题

# 读取Player.ts文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复翻转逻辑位置 - 应该在drawShadow之前
old_draw_section = '''    ctx.translate(x, y);
    
    // 根据朝向翻转火柴人
    if (this.state.facing === 'left') {
      ctx.scale(-1, 1);
    }
    
    this.drawShadow(ctx);
    this.drawStickFigure(ctx, color, isHurt);
    this.drawWeapon(ctx);

    if (this.isAttackActive()) {
      const attackBox = this.getAttackHitbox();
      if (attackBox) {
        const hitboxX = attackBox.x - x;
        const hitboxY = attackBox.y - y;

        ctx.fillStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.fillRect(hitboxX, hitboxY, attackBox.width, attackBox.height);

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(hitboxX, hitboxY, attackBox.width, attackBox.height);
      }
    }'''

new_draw_section = '''    ctx.translate(x, y);

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

content = content.replace(old_draw_section, new_draw_section)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 翻转逻辑位置已修复")
print("✓ 翻转现在应用在所有绘制操作之前")
