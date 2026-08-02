import { useState, useEffect } from 'react';

export default function StudentForm({ initialValues, groups, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    group: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        phone: initialValues.phone || initialValues.phoneNumber || '',
        group: initialValues.group || initialValues.groupId || '',
      });
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Ism va familiyani kiriting");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800 dark:text-slate-100">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          O'quvchi ismi va familiyasi
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masalan: Ali Valiyev"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Telefon raqami (Telegram)
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+998901234567"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Guruh
        </label>
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-500"
        >
          <option value="">Guruhsiz</option>
          {groups.map((g) => (
            <option key={g.id || g._id} value={g.name || g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/80 dark:text-red-300 border dark:border-red-800">
          {error}
        </p>
      )}

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
          {isSubmitting ? 'Saqlanmoqda...' : initialValues ? 'Tahrirlash' : 'Qo\'shish'}
        </button>
      </div>
    </form>
  );
}