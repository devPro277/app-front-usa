import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUser } from 'react-icons/fi';
import API from '../api';

export default function StudentLayout() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // O'quvchi ma'lumotlarini yuklash
  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const getProfileFn = API.getStudentProfile || API.getMe;
      
      let rawProfile = null;
      if (typeof getProfileFn === 'function') {
        const res = await getProfileFn();
        rawProfile = res?.data?.data || res?.data || res;
      }

      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      const profileData = {
        id: String(rawProfile?.id || rawProfile?._id || tgUser?.id || 'me'),
        fullName:
          rawProfile?.fullName ||
          rawProfile?.name ||
          (tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Talaba'),
        phone: rawProfile?.phone || '+998 (90) 000-00-00',
        group: rawProfile?.group || rawProfile?.groupName || 'Frontend Bootcamp',
        tier: rawProfile?.tier || 'Bronze',
        xp: Number(rawProfile?.xp ?? rawProfile?.points ?? rawProfile?.balance ?? 0),
        groupRank: rawProfile?.groupRank || 0,
      };

      setCurrentStudent(profileData);
    } catch (err) {
      console.error("Student ma'lumotlarini yuklashda xatolik:", err);
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

  // Xarid amaliyotidan so'ng XP balansini operativ yangilash
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
      {/* Ichki sahifalar (Dashboard, Profile, Store) ga prop yetkazish */}
      <main className="pb-20">
        <Outlet context={{ currentStudent, updateStudentXp, fetchStudentProfile }} />
      </main>

      {/* PASTKI MENYU (Bottom Navigation) */}
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