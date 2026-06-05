# 修复剩余的TypeScript错误

# 1. 修复types/index.ts
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 添加缺失的字段
types_content = types_content.replace(
    'rollFrame: number;',
    'rollFrame: number;\n  comboCount: number;\n  lastComboTime: number;'
)

# 写回文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")

# 2. 修复Player.ts构造函数
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 在构造函数中添加comboCount和lastComboTime
player_content = player_content.replace(
    'rollFrame: 0,',
    'rollFrame: 0,\n      comboCount: 0,\n      lastComboTime: 0,'
)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts构造函数已更新")
print("✓ 添加了comboCount和lastComboTime")
