# 简单直接地修复now变量重复声明的问题

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到所有包含 'const now = Date.now();' 的行
now_lines = []
for i, line in enumerate(lines):
    if 'const now = Date.now();' in line:
        now_lines.append(i)

print(f"找到 {len(now_lines)} 个 now 声明")
print(f"行号: {now_lines}")

# 只保留第一个声明，删除其他的
if len(now_lines) > 1:
    # 创建新的行列表，跳过重复的声明
    new_lines = []
    for i, line in enumerate(lines):
        # 如果这是一个重复的now声明（不是第一个），跳过它
        if i in now_lines[1:]:
            continue
        new_lines.append(line)
    
    # 写回文件
    with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"✓ 已删除 {len(now_lines) - 1} 个重复的 now 声明")
else:
    print("✓ 没有重复的 now 声明")
