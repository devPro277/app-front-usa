import { useState } from 'react';

const QUICK_AMOUNTS = [10, 20, 50, 100, -50];
const QUICK_REASONS = ["Faollik ko'rsatdi", "Do'stini olib keldi", 'Uy vazifasi', 'Tartib buzilishi'];

export default function ManagePointsModal({ student, onSubmit, onCancel, isSubmitting }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const currentBalance = student?.points ?? student?.balance ?? 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const value = Number(amount);

    if (!value) {
      setError("Ball miqdorini kiriting (musbat yoki manfiy son)");
      return;
    }

    try {
      await onSubmit(
        value,
        reason || (value >= 0 ? "Admin tomonidan qo'shildi" : "Admin tomonidan ayirildi")
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800 dark:text-slate-100">
      {/* Balans ko'rsatkich card */}
      <div className="flex items-center justify-between rounded-xl bg-orange-50/70 p-3.5 dark:bg-slate-700/60 dark:border dark:border-slate-600">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">O'quvchi</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{student?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-slate-400">Joriy balans</p>
          <p className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400">
            {currentBalance} XP
          </p>
        </div>
      </div>

      {/* Ball miqdori */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Ball miqdori (ayirish uchun manfiy son kiriting, masalan -50)
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="+10"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
          required
        />
        {/* Tezkor ball tanlash tugmalari */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_AMOUNTS.map((val) => (
            <button
              type="button"
              key={val}
              onClick={() => setAmount(val.toString())}
              className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-medium text-gray-700 hover:border-orange-500 hover:text-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
            >
              {val > 0 ? `+${val}` : val} XP
            </button>
          ))}
        </div>
      </label>

      {/* Sababi */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Sababi
        </span>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Masalan: Faollik ko'rsatdi"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_REASONS.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setReason(r)}
              className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:border-orange-500 hover:text-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-orange-400 dark:hover:text-orange-400"
            >
              {r}
            </button>
          ))}
        </div>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-800">
          {error}
        </p>
      )}

      {/* Amallar tugmalari */}
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-orange-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Saqlanmoqda...' : 'Tasdiqlash'}
        </button>
      </div>
    </form>
  );
}