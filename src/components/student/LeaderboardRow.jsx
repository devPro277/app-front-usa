const RANK_STYLES = {
  1: { bg: 'bg-tier-gold/10', text: 'text-tier-gold', badge: '🥇' },
  2: { bg: 'bg-tier-silver/10', text: 'text-tier-silver', badge: '🥈' },
  3: { bg: 'bg-tier-bronze/10', text: 'text-tier-bronze', badge: '🥉' },
};

export default function LeaderboardRow({ rank, student }) {
  const style = RANK_STYLES[rank];
  const isTopThree = Boolean(style);

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-3 ${
        isTopThree ? style.bg : 'border-b border-gray-100/80 dark:border-slate-700/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-semibold ${
            isTopThree ? style.text : 'text-gray-400 dark:text-slate-500'
          }`}
        >
          {isTopThree ? style.badge : rank}
        </span>
        <span className={`text-sm font-medium ${isTopThree ? 'text-brand dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>
          {student.name}
        </span>
      </div>
      <span className="font-mono text-sm font-semibold tabular-nums text-brand dark:text-white">
        {student.points.toLocaleString('uz-UZ')}
      </span>
    </div>
  );
}
