import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/admin/Sidebar';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        
        {/* Sahifalar ko'rinadigan joy */}
        <Outlet />

        {/* 🔔 Toast xabarlari butun Admin panel bo'ylab ishlashi uchun */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFFF',
              color: '#1B365D',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(27, 54, 93, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#F97316',
                secondary: '#FFFFFF',
              },
            },
          }} 
        />
      </main>
    </div>
  );
}