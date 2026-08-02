/**
 * "Gauge" uslubidagi aylanma progress — o'yin HUD estetikasi:
 * atrofida shkala chiziqlari (tick marks), markazda XP soni.
 */
export default function ProgressRing({ balance, target, size = 200 }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(balance / target, 1);
  const dashOffset = circumference * (1 - progress);

  // Atrofdagi kichik tick chiziqlarni generatsiya qilish
  const ticks = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute -rotate-90">
        {/* Fon aylana */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E9EDF3"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress aylana */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1B365D"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Tashqi tick shkala */}
      <svg width={size + 24} height={size + 24} className="absolute">
        {ticks.map((i) => {
          const angle = (i / ticks.length) * 360;
          const isMajor = i % 5 === 0;
          const r1 = (size + 24) / 2 - 2;
          const r2 = r1 - (isMajor ? 8 : 4);
          const rad = (angle * Math.PI) / 180;
          const cx = (size + 24) / 2;
          const cy = (size + 24) / 2;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(rad)}
              y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)}
              y2={cy + r2 * Math.sin(rad)}
              stroke={isMajor ? '#C7D2DE' : '#E9EDF3'}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}
      </svg>

      <div className="flex flex-col items-center">
        <span className="font-mono text-4xl font-semibold text-brand tabular-nums">{balance}</span>
        <span className="mt-1 text-xs uppercase tracking-widest text-gray-400">XP balans</span>
      </div>
    </div>
  );
}
