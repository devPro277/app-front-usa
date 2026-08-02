import { useState } from 'react';
import { getStudents } from '../../services/adminApi';

export default function GroupAccordion({ group, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const next = !isOpen;
    setIsOpen(next);

    if (next && students === null) {
      setLoading(true);
      try {
        const data = await getStudents();
        const allStudents = Array.isArray(data) ? data : [];

        // 1-TUZZATISH: Faqat ushbu guruhga tegishli va aktiv o'quvchilarni ajratib olamiz
        const filtered = allStudents.filter(
          (s) =>
            (s.group || s.groupName || '').trim().toLowerCase() ===
              (group.name || '').trim().toLowerCase() && s.status !== 'inactive'
        );

        setStudents(filtered);
      } catch (err) {
        console.error("O'quvchilarni olishda xatolik:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
  }

  // Ustoz ismini aniqlash
  const teacherDisplayName = group.teacherName || group.teacher?.name || group.teacher;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-sm transition-all hover:border-slate-600">
      <div className="flex w-full items-center justify-between px-5 py-4">
        <button
          type="button"
          onClick={handleToggle}
          className="flex flex-1 items-center justify-between text-left focus:outline-none"
        >
          <div>
            <h3 className="text-base font-semibold text-white">
              {group.name}
            </h3>

            {teacherDisplayName ? (
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                Mas'ul: <span className="text-slate-200">{teacherDisplayName}</span>
              </p>
            ) : (
              <p className="mt-0.5 text-xs font-semibold text-amber-400">
                ⚠️ Ustoz biriktirilmagan
              </p>
            )}
          </div>

          <div className="mr-3 flex items-center gap-3">
            <span className="rounded-xl bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
              {/* Agarda o'quvchilar yuklangan bo'lsa filterlangan uzunligi, bo'lmasa guruh xossalari */}
              {students !== null ? students.length : (group.studentsCount || 0)} o'quvchi
            </span>
            <ChevronIcon open={isOpen} />
          </div>
        </button>

        {/* Guruh Edit va Delete tugmalari */}
        <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
          <button
            type="button"
            onClick={() => onEdit && onEdit(group)}
            title="Guruhni tahrirlash"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(group)}
            title="Guruhni o'chirish"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-700 bg-slate-800/50 px-5 py-3">
          {loading ? (
            <p className="py-2 text-xs font-medium text-slate-400">Yuklanmoqda...</p>
          ) : !students || students.length === 0 ? (
            <p className="py-2 text-xs text-slate-400">Bu guruhda hozircha o'quvchi yo'q</p>
          ) : (
            <div className="divide-y divide-slate-700/60">
              {students.map((s, idx) => (
                <div key={s.id || s._id || idx} className="flex items-center justify-between py-2.5">
                  <span className={`text-sm font-medium ${s.status === 'inactive' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {s.name}
                  </span>
                  {/* 2-TUZATISH: points kaliti ham qo'shildi */}
                  <span className="font-mono text-xs font-bold text-orange-400">
                    {s.points ?? s.balance ?? s.xp ?? 0} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-orange-400' : ''}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}