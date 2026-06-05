# 修复now变量重复声明的问题

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除手臂部分的重复声明 - 使用精确的匹配
lines = content.split('\n')
new_lines = []

for i, line in enumerate(lines):
    # 找到重复的声明并跳过
    if i > 665 and i < 740 and 'const now = Date.now();' in line:
        # 检查是否是第二个声明（在手臂动画部分）
        if '绘制手臂' in '\n'.join(lines[max(0, i-5):i]):
            continue  # 跳过这个重复的声明
    new_lines.append(line)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("✓ 已修复now变量重复声明的问题！")
