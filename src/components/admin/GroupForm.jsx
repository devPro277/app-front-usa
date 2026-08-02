import { useState, useEffect } from 'react';

export default function GroupForm({ initialData, teachers = [], onSubmit, onClose }) {
  const [name, setName] = useState(initialData?.name || '');
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || initialData?.teacher?._id || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setTeacherId(initialData.teacherId || initialData.teacher?._id || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Tanlangan ustozni ro'yxatdan topish
    const selectedTeacher = teachers.find((t) => (t.id || t._id) === teacherId);

    onSubmit({
      ...initialData,
      name: name.trim(),
      teacherId: teacherId || null,
      teacherName: selectedTeacher ? selectedTeacher.name : '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Guruhni tahrirlash' : 'Yangi guruh ochish'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Guruh nomi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Frontend-03"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mas'ul ustoz
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="">Ustozni tanlang (Ixtiyoriy)</option>
              {teachers.map((t) => (
                <option key={t.id || t._id} value={t.id || t._id}>
                  {t.name} {t.subject ? `— ${t.subject}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              {initialData ? 'Saqlash' : 'Guruhni yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}