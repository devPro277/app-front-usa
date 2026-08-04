import { useEffect, useState } from 'react';
import * as API from '../../services/api';
import LeaderboardRow from '../../components/student/LeaderboardRow';
import ThemeToggle from '../../components/ThemeToggle';
import { FiPhone, FiUsers } from 'react-icons/fi';

const TIER_COLORS = {
  Bronze: 'text-amber-700 bg-amber-500/10 border-amber-500/20',
  Silver: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  Gold: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Diamond: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Profil ma'lumotlarini olish
      const getProfileFn = API.getStudentProfile || API.getMe;
      let rawProfile = null;
      if (typeof getProfileFn === 'function') {
        try {
          const res = await getProfileFn();
          rawProfile = res?.data?.data || res?.data || res;
        } catch (e) {
          console.warn("Profil API xatosi:", e);
        }
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

      // 2. Leaderboard ma'lumotlarini olish (Guruh bo'yicha parametr uzatamiz)
      const getBoardFn = API.getLeaderboard || API.getStudents;
      let boardRes = [];
      if (typeof getBoardFn === 'function') {
        try {
          const res = await getBoardFn(profileData.group);
          boardRes = res?.data?.data || res?.data || res;
        } catch (e) {
          console.warn("Leaderboard API xatosi:", e);
        }
      }

      let boardData = Array.isArray(boardRes) ? boardRes : [];

      // XP bo'yicha tartiblash va ID larni stringga o'girish
      boardData = boardData
        .map((item) => ({
          ...item,
          id: String(item.id || item._id),
          xp: Number(item.xp ?? item.points ?? item.balance ?? 0),
        }))
        .sort((a, b) => b.xp - a.xp);

      setStudent(profileData);
      setLeaderboard(boardData);
    } catch (err) {
      console.error("Profil ma'lumotlarini yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const currentStudent = student || {
    fullName: 'Talaba',
    phone: '+998 (90) 000-00-00',
    group: "Noma'lum",
    tier: 'Bronze',
    xp: 0,
  };

  const studentId = String(currentStudent.id || currentStudent._id);

  // Guruhdagi o'rinni aniqlash (String tipida xavfsiz taqqoslash)
  const foundIndex = leaderboard.findIndex((s) => String(s.id || s._id) === studentId);
  const myRank = currentStudent.groupRank || (foundIndex !== -1 ? foundIndex + 1 : 0);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-4">
      {/* Profil kartasi */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-slate-800 dark:text-white">
              {currentStudent.fullName}
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
              <FiUsers className="w-3.5 h-3.5 text-orange-500" />
              <span>{currentStudent.group}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                TIER_COLORS[currentStudent.tier] || TIER_COLORS.Bronze
              }`}
            >
              {currentStudent.tier || 'Bronze'}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Telefon raqam */}
        {currentStudent.phone && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
            <FiPhone className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{currentStudent.phone}</span>
          </div>
        )}

        {/* Dynamic Analytics: Balans va Guruhdagi o'rin */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/80">
            <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Balans</p>
            <p className="font-mono text-lg font-black text-orange-500 dark:text-orange-400">
              {Number(currentStudent.xp || 0).toLocaleString()} XP
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/80">
            <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
              Guruhdagi o'rin
            </p>
            <p className="font-mono text-lg font-bold text-amber-500 dark:text-amber-400">
              {myRank > 0 ? `#${myRank}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Guruh Reytingi - TOP 10 */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
          Guruh reytingi — TOP 10
        </h2>

        {leaderboard.length > 0 ? (
          <>
            {/* Pedestal layout: 2-o'rin (chap), 1-o'rin (o'rta), 3-o'rin (o'ng) */}
            <div className="flex items-end justify-center gap-3 pb-4">
              <PodiumCard student={top3[1]} rank={2} height="h-20" />
              <PodiumCard student={top3[0]} rank={1} height="h-28" />
              <PodiumCard student={top3[2]} rank={3} height="h-16" />
            </div>

            {rest.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white px-3 py-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {rest.map((s, i) => (
                  <LeaderboardRow
                    key={s.id || s._id || `rest-row-${i}`}
                    rank={i + 4}
                    student={s}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Reyting ma'lumotlari hali mavjud emas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PodiumCard({ student, rank, height }) {
  if (!student) return <div className="w-24 opacity-0 pointer-events-none" />;
  
  const badge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const accentColor =
    rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : 'text-amber-700';

  const points = student.xp ?? student.points ?? student.balance ?? 0;

  return (
    <div className="flex w-24 flex-col items-center gap-1.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
        {badge}
      </div>
      <p className="w-full truncate text-center text-xs font-bold text-slate-800 dark:text-white">
        {student.fullName || student.name || "O'quvchi"}
      </p>
      <p className={`font-mono text-[11px] font-bold ${accentColor}`}>
        {Number(points).toLocaleString()} XP
      </p>
      <div
        className={`w-full rounded-t-xl border border-b-0 border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-800 ${height}`}
      />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 pb-6 pt-6 animate-pulse">
      <div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800" />
      <div className="h-64 rounded-2xl bg-gray-100 dark:bg-slate-800" />
    </div>
  );
}