# 修复Player.ts中未使用的代码

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到并删除drawTrail方法和相关代码
new_lines = []
i = 0
while i < len(lines):
    # 删除drawTrail方法及其内容
    if 'private drawTrail' in lines[i]:
        # 找到方法结束的花括号
        brace_count = 1
        i += 1
        while i < len(lines) and brace_count > 0:
            brace_count += lines[i].count('{')
            brace_count -= lines[i].count('}')
            i += 1
        continue
    
    # 删除updateTrail方法及其内容
    if 'private updateTrail' in lines[i]:
        # 找到方法结束的花括号
        brace_count = 1
        i += 1
        while i < len(lines) and brace_count > 0:
            brace_count += lines[i].count('{')
            brace_count -= lines[i].count('}')
            i += 1
        continue
    
    new_lines.append(lines[i])
    i += 1

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✓ 已删除未使用的drawTrail和updateTrail方法")
