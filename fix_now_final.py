# 彻底修复now变量重复声明的问题

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

# 创建一个标记数组，标记需要保留的行
keep_line = [True] * len(lines)

# 只保留第一个声明，标记其他的为删除
if len(now_lines) > 1:
    for i in now_lines[1:]:
        keep_line[i] = False
        print(f"标记第 {i+1} 行删除")

# 创建新的行列表
new_lines = [line for i, line in enumerate(lines) if keep_line[i]]

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"\n✓ 已删除 {len(now_lines) - 1} 个重复的 now 声明")
print("✓ 文件已修复")
