# 修复now变量重复声明的问题

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除手臂部分的重复声明
content = content.replace(
    '''      // 绘制手臂 - 武术风格动画
      const now = Date.now();
      let rightArmAngle = 0.5;''',
    '''      // 绘制手臂 - 武术风格动画
      let rightArmAngle = 0.5;'''
)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已修复now变量重复声明的问题！")
