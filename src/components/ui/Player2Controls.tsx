export function Player2Controls() {
  return (
    <div className="glass-card p-3 text-xs">
      <h3 className="text-white font-bold mb-2 text-center">玩家2</h3>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="key">↑</span>
          <span className="text-gray-400">向上</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">←</span>
          <span className="text-gray-400">向左</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">→</span>
          <span className="text-gray-400">向右</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">.</span>
          <span className="text-gray-400">攻击</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">/</span>
          <span className="text-gray-400">防御</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">Enter</span>
          <span className="text-gray-400">闪避</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">,</span>
          <span className="text-gray-400">技能</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">↑↑</span>
          <span className="text-gray-400">跳跃</span>
        </div>
      </div>
    </div>
  );
}