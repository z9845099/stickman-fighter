interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  color: string;
  isLeft?: boolean;
}

export function HealthBar({ current, max, label, color, isLeft }: HealthBarProps) {
  const percentage = Math.max(0, (current / max) * 100);
  
  const getBarColor = () => {
    if (percentage > 60) return color;
    if (percentage > 30) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="flex items-center gap-2" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
      <span className="text-xs text-gray-400" style={{ width: '24px' }}>{label}</span>
      <div className="w-40 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${percentage}%`,
            backgroundColor: getBarColor(),
            boxShadow: `0 0 10px ${getBarColor()}`,
          }}
        />
      </div>
      <span className="text-xs text-gray-400" style={{ width: '36px', textAlign: isLeft ? 'left' : 'right' }}>
        {Math.floor(current)}/{max}
      </span>
    </div>
  );
}
