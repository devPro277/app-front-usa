export default function CartButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-brand active:bg-gray-50 dark:border-slate-700 dark:text-white dark:active:bg-slate-800"
      aria-label="Savat"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M3.5 4h1.7l.5 2.2M6.7 6.2 8.2 14a1.8 1.8 0 0 0 1.8 1.4h7.3a1.8 1.8 0 0 0 1.75-1.4l1.2-5.6a1 1 0 0 0-1-1.2H6.7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19.5" r="1.4" fill="currentColor" />
        <circle cx="16.5" cy="19.5" r="1.4" fill="currentColor" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
