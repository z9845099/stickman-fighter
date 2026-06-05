interface EnergyBarProps {
  current: number;
  max: number;
  isLeft?: boolean;
}

export function EnergyBar({ current, max, isLeft }: EnergyBarProps) {
  const percentage = Math.max(0, (current / max) * 100);

  return (
    <div className="flex items-center gap-2" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
      <span className="text-xs text-gray-500" style={{ width: '24px' }}>EP</span>
      <div className="w-40 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
            boxShadow: '0 0 8px rgba(108, 92, 231, 0.5)',
          }}
        />
      </div>
      <span className="text-xs text-gray-500" style={{ width: '36px', textAlign: isLeft ? 'left' : 'right' }}>
        {Math.floor(current)}/{max}
      </span>
    </div>
  );
}
