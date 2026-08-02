import { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Statistikani yuklovchi alohida funksiya
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        if (mounted) setStats(data);
      } catch (err) {
        console.error("Dashboard statistikani olishda xatolik:", err);
      }
    };

    // 1. Birinchi martda darhol yuklaymiz
    fetchStats();

    // 2. Har 5 soniyada fonda avto-yangilab turamiz (Real-time effekt)
    const intervalId = setInterval(fetchStats, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalId); // Xotira to'lib ketmasligi uchun intervalni tozalaymiz
    };
  }, []);

  const cards = stats
    ? [
        { label: "Faol o'quvchilar", value: stats.totalStudents, icon: '🎓' },
        { label: 'Ustozlar', value: stats.totalTeachers, icon: '👩‍🏫' },
        { label: 'Guruhlar', value: stats.totalGroups, icon: '📚' },
        { label: 'Kutilayotgan buyurtmalar', value: stats.pendingOrders, icon: '📦', highlight: true },
        { label: 'Muomaladagi XP', value: stats.totalXpInCirculation, icon: '⚡' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        {/* To'g'ridan-to'g'ri Hex kod berildi */}
        <h1 className="font-display text-2xl font-semibold text-[#1B365D] dark:text-white">
          Umumiy ko'rinish
        </h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">
          UniSphere Academy — joriy holat
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats ? (
          cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-all hover:border-[#1B365D]/40 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{card.icon}</span>
                {card.highlight && card.value > 0 && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    YANGI
                  </span>
                )}
              </div>
              
              {/* Qiymat matniga #1B365D rangi berildi */}
              <p className="mt-4 font-mono text-2xl font-semibold text-[#1B365D] dark:text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-400">{card.label}</p>
            </div>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
          ))
        )}
      </div>
    </div>
  );
}