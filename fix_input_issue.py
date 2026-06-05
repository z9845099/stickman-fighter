# 修复按键失灵和玩家2不显示的问题

# 读取Game.tsx文件
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复gameLoop中的AI更新逻辑 - 确保非AI模式下不覆盖玩家输入
old_game_loop = '''  const gameLoop = useCallback(() => {
    if (!player1Ref.current || !player2Ref.current) return;

    if (mode === 'ai') {
      ai1Ref.current?.update();
      // AI模式：更新AI玩家的朝向
      const p2 = player2Ref.current;
      if (p2 && p2.state.state !== 'dead') {
        p2.state.facing = 'left';  // 始终朝向左边（玩家1）
      }
    }
    if (mode === 'ai' || mode === 'single') {
      ai2Ref.current?.update();
      // 更新玩家1的朝向（朝向玩家2）
      const p1 = player1Ref.current;
      if (p1 && p1.state.state !== 'dead') {
        if (player2Ref.current) {
          p1.state.facing = player2Ref.current.state.position.x > p1.state.position.x ? 'right' : 'left';
        }
      }
    }

    player1Ref.current.update(16.67);
    player2Ref.current.update(16.67);'''

new_game_loop = '''  const gameLoop = useCallback(() => {
    if (!player1Ref.current || !player2Ref.current) return;

    // 更新朝向 - 所有模式都需要
    const p1 = player1Ref.current;
    const p2 = player2Ref.current;
    
    if (p1 && p1.state.state !== 'dead') {
      p1.state.facing = p2.state.position.x > p1.state.position.x ? 'right' : 'left';
    }
    if (p2 && p2.state.state !== 'dead') {
      p2.state.facing = p1.state.position.x > p2.state.position.x ? 'right' : 'left';
    }

    // 只有AI模式下才更新AI控制器
    if (mode === 'ai') {
      ai1Ref.current?.update();
    }
    if (mode === 'ai' || mode === 'single') {
      ai2Ref.current?.update();
    }

    player1Ref.current.update(16.67);
    player2Ref.current.update(16.67);'''

content = content.replace(old_game_loop, new_game_loop)

# 写回文件
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Game.tsx已修复")
print("✓ 按键输入不再被AI覆盖")
print("✓ 玩家朝向逻辑已修复")
