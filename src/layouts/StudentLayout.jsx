import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '../context/CartContext'; 
import BottomNav from "../components/student/BottomNav";

export default function StudentLayout() {
  useEffect(() => {
    // Telegram Mini App tayyor bo'lganda kengaytirish (expand)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <CartProvider>
      {/* Dark mode uchun fon va matn ranglari qo'shildi */}
      <div className="safe-top mx-auto min-h-screen max-w-md bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        
        <main className="no-scrollbar overflow-y-auto pb-24">
          <Outlet />
        </main>

        {/* Pastki navigatsiya */}
        <BottomNav />

        {/* 🔔 O'quvchilar paneli uchun dinamik Toast notification */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            className: 'dark:!bg-slate-800 dark:!text-white dark:!border-slate-700 font-semibold text-sm rounded-xl shadow-lg border border-gray-100 bg-white text-slate-800',
            style: {
              padding: '12px 16px',
            },
          }} 
        />
      </div>
    </CartProvider>
  );
}