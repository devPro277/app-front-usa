import { useEffect, useState } from 'react';

/**
 * Pastdan chiquvchi savat oynasi.
 * `open` false bo'lganda ham DOM'da qoladi (animatsiya uchun),
 * lekin `mounted` orqali butunlay olib tashlanadi.
 */
export default function CartSheet({
  open,
  onClose,
  items,
  balance,
  onIncrement,
  onDecrement,
  onCheckout,
  isCheckingOut,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Bir freym keyin translate-y ni 0 ga o'tkazish — CSS transition ishlashi uchun
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!mounted) return null;

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const insufficientFunds = total > balance;
  const isEmpty = items.length === 0;

  let checkoutLabel = 'Xaridni tasdiqlash';
  if (isCheckingOut) checkoutLabel = 'Yuborilmoqda...';
  else if (insufficientFunds) checkoutLabel = 'Ball yetarli emas';

  return (
    <div className="fixed inset-0 z-30">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-brand/40 transition-opacity duration-250 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl bg-white shadow-sheet transition-transform duration-300 ease-out dark:bg-slate-800 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-700">
          <h2 className="font-display text-base font-semibold text-brand dark:text-white">Savat</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100 dark:text-slate-400 dark:active:bg-slate-700"
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>

        <div className="safe-bottom max-h-[60vh] overflow-y-auto no-scrollbar px-5">
          {isEmpty ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="text-3xl">🛒</span>
              <p className="text-sm text-gray-400 dark:text-slate-400">Savatingiz bo'sh</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xl dark:bg-slate-700">
                    {item.image}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand dark:text-white">{item.name}</p>
                    <p className="font-mono text-xs text-gray-400 dark:text-slate-400">{item.price} XP / dona</p>
                  </div>

                  {/* Miqdorni boshqarish: - / soni / + */}
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1 py-1 dark:border-slate-600">
                    <button
                      onClick={() => onDecrement(item.productId)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brand active:bg-gray-100 dark:text-white dark:active:bg-slate-700"
                      aria-label="Kamaytirish"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-mono text-xs font-semibold text-brand dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onIncrement(item.productId)}
                      disabled={item.qty >= item.stock}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brand active:bg-gray-100 disabled:opacity-30 dark:text-white dark:active:bg-slate-700"
                      aria-label="Ko'paytirish"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isEmpty && (
          <div className="safe-bottom border-t border-gray-100 px-5 py-4 dark:border-slate-700">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-slate-400">Jami</span>
              <span className="font-mono text-lg font-semibold text-brand dark:text-white">{total} XP</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={insufficientFunds || isCheckingOut}
              className={`w-full rounded-2xl py-3 text-sm font-semibold transition-colors ${
                insufficientFunds || isCheckingOut
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
                  : 'bg-accent text-white active:scale-[0.98] dark:bg-accent-dark'
              }`}
            >
              {checkoutLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
