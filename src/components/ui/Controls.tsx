export function Controls() {
  return (
    <div className="mt-4 text-center text-sm text-gray-400">
      <div className="grid grid-cols-2 gap-8">
        <div className="glass-card p-4">
          <h3 className="text-white font-bold mb-2">玩家1</h3>
          <div className="space-y-1">
            <div><span className="key">W</span> 向上移动</div>
            <div><span className="key">A</span> 向左移动</div>
            <div><span className="key">D</span> 向右移动</div>
            <div><span className="key">F</span> 攻击（支持连招）</div>
            <div><span className="key">S</span> 防御</div>
            <div><span className="key">空格</span> 闪避</div>
            <div><span className="key">空格×2</span> 翻滚</div>
            <div><span className="key">Q</span> 技能1</div>
            <div><span className="key">E</span> 跳跃</div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-white font-bold mb-2">玩家2</h3>
          <div className="space-y-1">
            <div><span className="key">↑</span> 向上移动</div>
            <div><span className="key">←</span> 向左移动</div>
            <div><span className="key">→</span> 向右移动</div>
            <div><span className="key">.</span> 攻击（支持连招）</div>
            <div><span className="key">/</span> 防御</div>
            <div><span className="key">Enter</span> 闪避</div>
            <div><span className="key">Enter×2</span> 翻滚</div>
            <div><span className="key">, </span> 技能1</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>🎯 攻击/防御/闪避都有夸张的身体变形效果 | 连续攻击触发连招 | 连续闪避触发翻滚</p>
        <p>🛡️ 防御时无敌 | ⚡ 闪避/翻滚时无敌并向前冲刺 | 🦵 跳跃时可移动</p>
      </div>
    </div>
  );
}
