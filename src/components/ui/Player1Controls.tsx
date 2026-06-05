export function Player1Controls() {
  return (
    <div className="glass-card p-3 text-xs">
      <h3 className="text-white font-bold mb-2 text-center">玩家1</h3>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="key">W</span>
          <span className="text-gray-400">向上</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">A</span>
          <span className="text-gray-400">向左</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">D</span>
          <span className="text-gray-400">向右</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">F</span>
          <span className="text-gray-400">攻击</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">S</span>
          <span className="text-gray-400">防御</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">空格</span>
          <span className="text-gray-400">闪避</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">Q</span>
          <span className="text-gray-400">技能</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="key">E</span>
          <span className="text-gray-400">跳跃</span>
        </div>
      </div>
    </div>
  );
}