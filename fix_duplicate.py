# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到并删除重复的代码块（从第721行到第731行）
lines = content.split('\n')

# 找到重复的armLen和后面的代码
new_lines = []
skip_until_close_brace = False
brace_count = 0
in_duplicate = False
duplicate_start = -1

for i, line in enumerate(lines):
    # 找到第一个}之后的空行，这通常是重复代码的开始
    if i > 718 and 'const armLen = limbLength * 0.9;' in line:
        in_duplicate = True
        duplicate_start = i
        continue
    
    if in_duplicate:
        # 跳过重复的代码直到找到匹配的}
        if '{' in line:
            brace_count += line.count('{')
        if '}' in line:
            brace_count -= line.count('}')
            if brace_count <= 0:
                in_duplicate = False
                continue
        continue
    
    new_lines.append(line)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("✓ 重复代码已清理！")
print(f"✓ 从第{duplicate_start+1}行开始清理了重复代码")
