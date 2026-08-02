import { useState } from 'react';

export default function TeacherForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const isEditMode = Boolean(initialValues);
  const [name, setName] = useState(initialValues?.name || '');
  const [subject, setSubject] = useState(initialValues?.subject || '');
  const [login, setLogin] = useState(initialValues?.login || initialValues?.username || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !subject.trim() || !login.trim()) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }

    try {
      // Backend hem 'login' hem 'username' kutishi mumkinligi uchun ikkalasini ham beramiz
      await onSubmit({ 
        name: name.trim(), 
        subject: subject.trim(), 
        login: login.trim(), 
        username: login.trim(), 
        password 
      });
    } catch (err) {
      setError(err?.message || "Saqlashda xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Ism familiya">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Aziza Karimova"
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          required
        />
      </Field>

      <Field label="Yo'nalish (Soha)">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Masalan: Frontend, Arab tili, IT..."
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Login">
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="aziza.k"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            required
          />
        </Field>
        <Field label={isEditMode ? 'Yangi parol (ixtiyoriy)' : 'Parol'}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            required={!isEditMode}
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/60 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 active:scale-[0.98] dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-orange-600"
        >
          {isSubmitting ? 'Saqlanmoqda...' : isEditMode ? 'Saqlash' : "Qo'shish"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}