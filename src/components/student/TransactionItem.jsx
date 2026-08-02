export default function TransactionItem({ transaction }) {
  const isEarn = transaction.amount > 0;
  const dateLabel = new Date(transaction.date).toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-none dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
            isEarn ? 'bg-brand-soft text-brand dark:bg-slate-700 dark:text-white' : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500'
          }`}
        >
          {isEarn ? '↑' : '↓'}
        </div>
        <div>
          <p className="text-sm font-medium text-brand dark:text-white">{transaction.label}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{dateLabel}</p>
        </div>
      </div>
      <span className={`font-mono text-sm font-semibold tabular-nums ${isEarn ? 'text-brand dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>
        {isEarn ? '+' : ''}
        {transaction.amount}
      </span>
    </div>
  );
}
