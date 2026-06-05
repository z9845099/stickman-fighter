# 修复重复定义的问题

# 读取types/index.ts文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 移除重复的comboCount和lastComboTime
content = content.replace(
    '  comboCount: number;\n  lastComboTime: number;\n  comboCount: number;\n  lastComboTime: number;',
    '  comboCount: number;\n  lastComboTime: number;'
)

# 写回文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已修复重复定义的问题")
