interface TimerProps {
  timeRemaining: number;
}

export function Timer({ timeRemaining }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 30;

  return (
    <div className="text-center">
      <div
        className="text-3xl font-bold font-mono"
        style={{
          color: isLowTime ? '#e74c3c' : '#ffffff',
          textShadow: isLowTime ? '0 0 20px #e74c3c' : 'none',
          animation: isLowTime ? 'pulse 1s ease-in-out infinite' : 'none',
        }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {isLowTime ? '⚠️ 时间紧迫!' : '剩余时间'}
      </div>
    </div>
  );
}
