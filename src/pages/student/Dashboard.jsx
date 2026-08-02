import React, { useState, useEffect } from "react";
import { FiUsers, FiAward } from "react-icons/fi";
import API from "../../api"; // api.js nisbiy yo'li

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();

        const tgUser = tg?.initDataUnsafe?.user;
        let res;

        // 1-Variant: Agar Telegram WebApp orqali kirilgan bo'lsa, Telegram ID orqali olish
        if (tgUser?.id) {
          try {
            res = await API.get(`/students/telegram/${tgUser.id}`);
          } catch (e) {
            // Agar telegram endpoint bo'lmasa, /students/me ga fallback qilamiz
            res = await API.get("/students/me");
          }
        } else {
          // 2-Variant: Standart /students/me yo'li
          res = await API.get("/students/me");
        }

        // Backend qaytargan javob strukturasi (res.data.data yoki res.data)
        const studentData = res.data?.data || res.data;
        setStudent(studentData);
      } catch (err) {
        console.error("Profilni yuklashda xatolik:", err);
        setError("Profil ma'lumotlarini yuklab bo'lmadi");

        // Browser Dev (Localhost) va test rejimi uchun Fallback
        if (!window.Telegram?.WebApp?.initData) {
          setStudent({
            fullName: "Test O'quvchi",
            phone: "+998 (90) 000-00-00",
            group: "Frontend React-01",
            groupRank: 1,
            totalStudentsInGroup: 10,
            xp: 250,
            transactions: [
              { id: 1, title: "Darsdagi faollik", amount: 50, date: "Bugun", type: "plus" }
            ]
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const currentXP = student?.xp || 0;

  // XP boyicha liga darajasini aniqlash
  const getLeague = (xp) => {
    if (xp >= 1000) return { name: "Diamond", nextXP: 2000, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" };
    if (xp >= 500) return { name: "Gold", nextXP: 1000, color: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
    if (xp >= 200) return { name: "Silver", nextXP: 500, color: "bg-slate-300/20 text-slate-300 border-slate-400/40" };
    return { name: "Bronze", nextXP: 200, color: "bg-orange-500/20 text-orange-400 border-orange-500/40" };
  };

  const league = getLeague(currentXP);
  const xpNeeded = Math.max(0, league.nextXP - currentXP);
  const progressPercent = Math.min(100, Math.round((currentXP / league.nextXP) * 100));

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <div className="animate-pulse text-xs font-semibold text-slate-400">Profil yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <p className="text-xs text-slate-400 font-medium">Xush kelibsiz,</p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {student?.fullName || "O'quvchi"} 👋
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${league.color}`}>
            {league.name}
          </span>
        </div>
      </div>

      {/* Guruh va Reyting qisqa ma'lumot bloki */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl">
            <FiUsers className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 font-medium uppercase">Guruh</p>
            {/* Student modelidagi "group" yoki "groupName" ga moslash */}
            <p className="text-xs font-bold text-white truncate">
              {student?.group || student?.groupName || "Biriktirilmagan"}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <FiAward className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Guruh Reytingi</p>
            <p className="text-xs font-bold text-amber-400">
              #{student?.groupRank || "-"} <span className="text-[10px] text-slate-500">/ {student?.totalStudentsInGroup || 0} ta</span>
            </p>
          </div>
        </div>
      </div>

      {/* XP Progress Ring */}
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" className="text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" strokeDasharray="4, 3" />
            <circle
              cx="50" cy="50" r="42"
              className="text-orange-500 transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={`${progressPercent * 2.64} 264`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-orange-500 tracking-tight">{currentXP}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">XP BALANS</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 font-medium">
          Keyingi <span className="text-orange-400 font-bold">{league.name}</span> mukofotigacha yana{" "}
          <span className="text-white font-extrabold">{xpNeeded} XP</span> kerak
        </p>
      </div>

      {/* Oxirgi tranzaksiyalar tarixi */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300">Oxirgi tranzaksiyalar</h3>

        {student?.transactions && student.transactions.length > 0 ? (
          <div className="space-y-2">
            {student.transactions.map((tx, index) => (
              <div key={tx.id || index} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-white">{tx.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                </div>
                <span className="text-sm font-extrabold text-emerald-400">+{tx.amount} XP</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <p className="text-xs text-slate-500 font-medium">Tranzaksiyalar tarixi bo'sh</p>
          </div>
        )}
      </div>
    </div>
  );
}