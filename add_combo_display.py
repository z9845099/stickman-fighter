# 添加连击数显示组件

# 读取Game.tsx文件
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'r', encoding='utf-8') as f:
    game_content = f.read()

# 添加连击数显示
old_combo_display = '''    {gameState.started && gameState.mode !== 'ai' && (
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Controls />
      </div>
    )}'''

new_combo_display = '''    {gameState.started && gameState.mode !== 'ai' && (
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Controls />
      </div>
    )}
    
    {/* 连击数显示 */}
    {gameState.started && (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex gap-8">
        <div className="text-center">
          <div className="text-sm text-gray-400">玩家1 连击</div>
          <div className="text-3xl font-bold text-yellow-400" style={{textShadow: '0 0 10px rgba(255, 200, 0, 0.8)'}}>
            {player1?.state.comboCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">玩家2 连击</div>
          <div className="text-3xl font-bold text-yellow-400" style={{textShadow: '0 0 10px rgba(255, 200, 0, 0.8)'}}>
            {player2?.state.comboCount || 0}
          </div>
        </div>
      </div>
    )}'''

game_content = game_content.replace(old_combo_display, new_combo_display)

# 写回Game.tsx
with open('d:/CODE/python/huochairen/src/components/pages/Game.tsx', 'w', encoding='utf-8') as f:
    f.write(game_content)

print("✓ Game.tsx已更新")
print("✓ 连击数显示已添加")
