# 修复右边玩家方向问题并增强武术动画

# 1. 修改types/index.ts添加方向属性
with open('d:/CODE/python/huochairen/src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

# 添加facing字段
old_position = '''  position: { x: number; y: number };
  velocity: { x: number; y: number };'''
new_position = '''  position: { x: number; y: number };
  velocity: { x: number; y: number };
  facing: 'left' | 'right';'''
types_content = types_content.replace(old_position, new_position)

# 写回types文件
with open('d:/CODE/python/huochairen/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

print("✓ types/index.ts已更新")

# 2. 修改Player.ts构造函数添加方向初始化
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    player_content = f.read()

# 在构造函数中添加facing属性
old_state_init = '''      position: { x: startX, y: startY },
      velocity: { x: 0, y: 0 },
      state: 'idle','''
new_state_init = '''      position: { x: startX, y: startY },
      velocity: { x: 0, y: 0 },
      facing: startX > 400 ? 'left' : 'right',
      state: 'idle','''
player_content = player_content.replace(old_state_init, new_state_init)

# 写回Player.ts
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(player_content)

print("✓ Player.ts构造函数已更新")
print("✓ 右边玩家现在会自动朝向左边")
