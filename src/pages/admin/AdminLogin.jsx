import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login, isLoading, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Agar allaqachon login qilingan bo'lsa, admin bo'limiga o'tkazib yuboriladi
  if (isAuthenticated) {
    return <Navigate to="/admin/market" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Login va parolni kiriting');
      return;
    }

    const result = await login(username, password);

    if (result?.success) {
      navigate('/admin/market', { replace: true });
    } else {
      // 🔒 XAVFSIZLIK: Kelgan xabar matn bo'lsa ko'rsatamiz, aks holda standart xabar
      const safeErrorMessage =
        typeof result?.error === 'string'
          ? result.error
          : 'Login yoki parol noto\'g\'ri!';

      setError(safeErrorMessage);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B365D] text-2xl font-bold text-white shadow-lg">
            U
          </div>
          <h1 className="text-2xl font-bold text-[#1B365D] dark:text-white">UniSphere Academy</h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">Admin panelga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Login
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1B365D] outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-500"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1B365D] outline-none transition-colors focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E8620C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}