import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUser, FiRefreshCw } from 'react-icons/fi';
import { getStudentProfile } from '../services/api';

export default function StudentLayout() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setErrorState(null);

      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }

      const rawProfile = await getStudentProfile();

      if (rawProfile && (rawProfile._id || rawProfile.id)) {
        const profileData = {
          id: String(rawProfile._id || rawProfile.id),
          fullName: rawProfile.fullName || rawProfile.name || `${rawProfile.firstName || ''} ${rawProfile.lastName || ''}`.trim(),
          phone: rawProfile.phone || 'Telefon yo\'q',
          group: rawProfile.groupName || rawProfile.group?.name || rawProfile.group || 'Guruhsiz',
          tier: rawProfile.tier || 'Bronze',
          xp: Number(rawProfile.xp ?? rawProfile.points ?? rawProfile.balance ?? 0),
          groupRank: rawProfile.groupRank || 0,
        };
        setCurrentStudent(profileData);
      } else {
        throw new Error("Talaba ma'lumotlari topilmadi");
      }
    } catch (err) {
      console.error("Profil yuklashda xatolik:", err);
      setErrorState(err.response?.data?.message || err.message || "Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (errorState) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0B132B] text-white p-6 text-center">
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-4 rounded-xl max-w-sm mb-4">
          <p className="font-bold text-sm mb-1">⚠️ Kirish xatoligi</p>
          <p className="text-xs">{errorState}</p>
        </div>
        <button
          onClick={fetchStudentProfile}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" /> Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans antialiased relative">
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