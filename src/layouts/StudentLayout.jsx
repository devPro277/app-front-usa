import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUser } from 'react-icons/fi';
import API from '../api';

export default function StudentLayout() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);

      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;
      const initData = tg?.initData;

      const telegramId = tgUser?.id;
      setDebugInfo(`TG ID: ${telegramId || 'Topilmadi'}`);

      let rawProfile = null;

      // 1. Backend'ga so'rov yuborish
      try {
        const res = await API.get('/students/profile', {
          params: { telegram_id: telegramId },
          headers: {
            'X-Telegram-Init-Data': initData || '',
          },
        });
        rawProfile = res?.data?.data || res?.data;
      } catch (apiErr) {
        console.warn("Mavjud endpoint ishlagani yo'q, muqobil API tekshirilmoqda...", apiErr);
        
        // 2. Agar /students/profile ishlamasa, umumiy API orqali sinaymiz
        const fallbackFn = API.getStudentProfile || API.getMe;
        if (typeof fallbackFn === 'function') {
          const res = await fallbackFn();
          rawProfile = res?.data?.data || res?.data || res;
        }
      }

      // Backend'dan haqiqiy profil kelsa:
      if (rawProfile && (rawProfile.fullName || rawProfile.phone || rawProfile.xp !== undefined)) {
        const profileData = {
          id: String(rawProfile._id || rawProfile.id || telegramId),
          fullName: rawProfile.fullName || rawProfile.name || `${rawProfile.firstName || ''} ${rawProfile.lastName || ''}`.trim(),
          phone: rawProfile.phone || 'Telefon yo\'q',
          group: rawProfile.groupName || rawProfile.group?.name || rawProfile.group || 'Guruhsiz',
          tier: rawProfile.tier || 'Bronze',
          xp: Number(rawProfile.xp ?? rawProfile.points ?? rawProfile.balance ?? 0),
          groupRank: rawProfile.groupRank || 0,
        };
        setCurrentStudent(profileData);
      } else {
        // Agar Backend'dan ma'lumot kelmasa (demak DB ga Telegram ID bog'lanmagan)
        setDebugInfo((prev) => `${prev} | Backendda o'quvchi topilmadi!`);
        
        setCurrentStudent({
          id: String(telegramId || 'me'),
          fullName: tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Talaba',
          phone: 'Biriktirilmagan',
          group: 'Bazaga ulanmagan',
          tier: 'Bronze',
          xp: 0,
          groupRank: 0,
        });
      }
    } catch (err) {
      console.error("Profil yuklashda xatolik:", err);
      setDebugInfo('API xatoligi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    fetchStudentProfile();
  }, []);

  const updateStudentXp = (newXp) => {
    setCurrentStudent((prev) => (prev ? { ...prev, xp: newXp } : prev));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0B132B] text-white">
        <div className="w-9 h-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-semibold animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans antialiased relative">
      
      {/* TEST UCHUN DEBUG QISMI (Xatolikni topib bo'lgach o'chirib tashlaymiz) */}
      {debugInfo.includes('topilmadi') && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] p-2 text-center">
          ⚠️ {debugInfo} — Admin bazasida ushbu Telegram account ID ga mos o'quvchi biriktirilmagan.
        </div>
      )}

      <main className="pb-20">
        <Outlet context={{ currentStudent, updateStudentXp, fetchStudentProfile }} />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1C2541]/95 backdrop-blur-md border-t border-slate-800/80 px-6 py-2.5 z-50 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <FiHome className="w-5 h-5" />
            <span className="text-[10px]">Asosiy</span>
          </NavLink>

          <NavLink
            to="/store"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <FiShoppingBag className="w-5 h-5" />
            <span className="text-[10px]">Do'kon</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <FiUser className="w-5 h-5" />
            <span className="text-[10px]">Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}