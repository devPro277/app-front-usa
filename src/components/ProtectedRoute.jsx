import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // LocalStorage'dan tokenni tekshiramiz
  const token = localStorage.getItem('token'); 

  // Agar token bo'lmasa, foydalanuvchini admin login sahifasiga yuboramiz
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token bo'lsa, ichki sahifani (Admin panel) ko'rsatamiz
  return <Outlet />;
}