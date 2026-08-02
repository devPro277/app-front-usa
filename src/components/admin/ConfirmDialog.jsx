export default function ConfirmDialog({ open, title, message, confirmLabel = 'Tasdiqlash', onConfirm, onCancel, isSubmitting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onCancel} className="absolute inset-0 bg-brand/40" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-sheet dark:bg-slate-800">
        <h2 className="font-display text-base font-semibold text-brand dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 dark:border-slate-600 dark:text-slate-300"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
