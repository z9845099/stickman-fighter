# 修复边界限制问题

# 读取文件
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 增加边界限制的padding值（火柴人高度大约是100px左右）
old_boundary = '''    const padding = 20;
    player1Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player1Ref.current.state.position.x));
    player1Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player1Ref.current.state.position.y));
    player2Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player2Ref.current.state.position.x));
    player2Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player2Ref.current.state.position.y));'''

new_boundary = '''    const padding = 80;
    player1Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player1Ref.current.state.position.x));
    player1Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player1Ref.current.state.position.y));
    player2Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player2Ref.current.state.position.x));
    player2Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player2Ref.current.state.position.y));'''

content = content.replace(old_boundary, new_boundary)

# 写回文件
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 边界限制已修复，增加padding到80px")
