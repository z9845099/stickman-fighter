# 修复剩余的TypeScript错误

# 1. 更新types/index.ts添加缺失的状态类型和字段
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 更新state类型添加jumping和dodging
old_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'rolling';'''
new_state_type = '''  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'jumping' | 'rolling';'''
types_content = types_content.replace(old_state_type, new_state_type)

# 添加jumpFrame字段
types_content = types_content.replace(
    'dodgeFrame: number;',
    'dodgeFrame: number;\n  jumpFrame: number;'
)

# 写回文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")
print("✓ 添加了jumping状态和jumpFrame字段")

# 2. 更新Player.ts构造函数添加jumpFrame
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 添加jumpFrame初始化
player_content = player_content.replace(
    'dodgeFrame: 0,',
    'dodgeFrame: 0,\n      jumpFrame: 0,'
)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts已更新")
print("✓ 添加了jumpFrame初始化")
