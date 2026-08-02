import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * AdminProtectedRoute – Admin sahifalarini himoya qiluvchi router guard.
 *
 * Qat'iy tekshirish tartibi:
 *   1. loading (isLoading) = true  -> "Yuklanmoqda..." spineri ko'rsatiladi
 *   2. !token yoki !isAuthenticated -> darhol /admin/login ga redirect
 *   3. Aks holda -> <Outlet /> orqali ichki sahifa ko'rsatiladi
 */
export default function AdminProtectedRoute() {
  const { token, isAuthenticated, isLoading } = useAdminAuth();

  // 1. Yuklanayotgan bo'lsa – loading indikator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // 2. Token yoki auth holati yo'q – loginga yo'naltirish
  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Avtorizatsiyadan o'tgan – ichki sahifani ko'rsatish
  return <Outlet />;
}
