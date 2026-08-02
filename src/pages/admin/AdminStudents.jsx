import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state'lari (Qo'shish va Tahrirlash uchun umumiy)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  
  // Tahrirlash rejimi uchun state'lar
  const [editingId, setEditingId] = useState(null);

  // Search va Filter state'lari
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // 1. O'quvchilarni yuklash
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/students");
      
      let rawList = [];
      const data = res?.data !== undefined ? res.data : res;

      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && typeof data === "object") {
        rawList = 
          data.students || 
          data.data || 
          data.result || 
          data.items || 
          Object.values(data).find(val => Array.isArray(val)) || 
          [];
      }

      setStudents(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      console.error("O'quvchilarni yuklashda xatolik:", error);
      toast.error("O'quvchilar ro'yxatini olib bo'lmadi!");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. O'quvchi qo'shish yoki Tahrirlashni saqlash
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !group) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring!");
    }

    try {
      if (editingId) {
        // Tahrirlash (Update)
        const res = await API.put(`/students/${editingId}`, {
          fullName,
          phone,
          group,
        });
        const updated = res?.data || res;

        setStudents((prev) =>
          (Array.isArray(prev) ? prev : []).map((s) =>
            (s._id || s.id) === editingId ? { ...s, ...updated, fullName, phone, group } : s
          )
        );

        toast.success("O'quvchi ma'lumotlari yangilandi!");
        setEditingId(null);
      } else {
        // Yangi qo'shish (Create)
        const res = await API.post("/students", {
          fullName,
          phone,
          group,
          xp: 0,
        });

        const newStudent = res?.data || res;
        if (newStudent && typeof newStudent === "object") {
          setStudents((prev) => [newStudent, ...(Array.isArray(prev) ? prev : [])]);
        }

        toast.success("O'quvchi muvaffaqiyatli qo'shildi!");
      }

      // Formani tozalash
      setFullName("");
      setPhone("");
      setGroup("");
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      toast.error(
        error.response?.data?.message || "Amaliyot bajarishda xatolik yuz berdi!"
      );
    }
  };

  // 3. Tahrirlash rejimiga o'tkazish (Formaga ma'lumotlarni chiqarish)
  const handleEditClick = (student) => {
    setEditingId(student._id || student.id);
    setFullName(student.fullName || student.name || "");
    setPhone(student.phone || "");
    setGroup(student.group || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Tahrirlashni bekor qilish
  const handleCancelEdit = () => {
    setEditingId(null);
    setFullName("");
    setPhone("");
    setGroup("");
  };

  // 5. XP ni o'zgartirish (+10, +50, -10)
  const handleXPChange = async (id, delta) => {
    try {
      const currentList = Array.isArray(students) ? students : [];
      const student = currentList.find((s) => (s._id || s.id) === id);
      if (!student) return;

      const res = await API.patch(`/students/${id}/xp`, { amount: delta });
      const updatedStudent = res?.data || res;

      const nextXp =
        updatedStudent?.xp ??
        updatedStudent?.points ??
        Math.max(0, (student.xp || 0) + delta);

      setStudents((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) =>
          (s._id || s.id) === id ? { ...s, xp: nextXp, points: nextXp } : s
        )
      );

      if (delta > 0) {
        toast.success(`${student.fullName || student.name}ga +${delta} XP qo'shildi!`);
      } else {
        toast.error(`${student.fullName || student.name}dan ${Math.abs(delta)} XP ayirildi!`);
      }
    } catch (error) {
      console.error("XP yangilashda xatolik:", error);
      toast.error("XP qiymatini o'zgartirishda xatolik yuz berdi!");
    }
  };

  // 6. O'quvchini o'chirish
  const handleDelete = async (id) => {
    if (!window.confirm("O'quvchini o'chirishga ishonchingiz komilmi?")) return;

    try {
      await API.delete(`/students/${id}`);
      setStudents((prev) =>
        (Array.isArray(prev) ? prev : []).filter((s) => (s._id || s.id) !== id)
      );
      toast.success("O'quvchi muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error("O'quvchini o'chirishda xatolik yuz berdi!");
    }
  };

  // Safe Guarded Filter & Sort logic
  const safeStudents = Array.isArray(students) ? students : [];

  const filteredStudents = safeStudents
    .filter((student) => {
      if (!student) return false;
      const query = searchTerm.toLowerCase().trim();
      const nameMatch = (student.fullName || student.name || "")
        .toLowerCase()
        .includes(query);
      const phoneMatch = (student.phone || "").includes(query);
      const groupMatch = (student.group || "")
        .toLowerCase()
        .includes(query);

      const isGroupSelected =
        selectedGroup === "all" ||
        (student.group || "").toLowerCase() === selectedGroup.toLowerCase();

      return (nameMatch || phoneMatch || groupMatch) && isGroupSelected;
    })
    .sort((a, b) => {
      if (sortBy === "xp-desc") return (b.xp || 0) - (a.xp || 0);
      if (sortBy === "xp-asc") return (a.xp || 0) - (b.xp || 0);
      if (sortBy === "name-asc")
        return (a.fullName || a.name || "").localeCompare(
          b.fullName || b.name || ""
        );
      return 0;
    });

  const availableGroups = Array.from(
    new Set(safeStudents.map((s) => s?.group).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 max-w-7xl mx-auto space-y-8">
      <Toaster position="top-right" />

      {/* Sarlavha */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Talabalarni Boshqarish
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          O'quvchilar ro'yxati, ularning guruhlari va XP ballarini kuzatib boring
        </p>
      </div>

      {/* Form (Qo'shish / Tahrirlash) */}
      <form
        onSubmit={handleSubmit}
        className={`bg-slate-900 border ${
          editingId ? "border-amber-500/50 bg-amber-950/10" : "border-slate-800"
        } p-5 rounded-2xl flex flex-col md:flex-row gap-3 shadow-sm items-center transition-all`}
      >
        {editingId && (
          <div className="w-full text-xs font-bold text-amber-400 pb-1 md:hidden">
            ⚠️ Tahrirlash rejimi faol
          </div>
        )}

        <input
          type="text"
          placeholder="F.I.SH (masalan: Islombek)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full md:w-1/3 border border-slate-700 bg-slate-800 p-3 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 text-sm"
        />
        <input
          type="text"
          placeholder="Tel (masalan: +998901234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full md:w-1/3 border border-slate-700 bg-slate-800 p-3 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 text-sm"
        />
        <input
          type="text"
          placeholder="Guruh (masalan: Frontend N1)"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full md:w-1/4 border border-slate-700 bg-slate-800 p-3 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 text-sm"
        />

        <div className="flex w-full md:w-auto gap-2">
          <button
            type="submit"
            className={`flex-1 md:flex-initial font-bold px-7 py-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-sm ${
              editingId
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {editingId ? "Saqlash" : "+ Qo'shish"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-4 py-3 rounded-xl text-sm transition-all"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      {/* Filter va Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-3.5 top-3 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="O'quvchi ismi, tel yoki guruh bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-700 bg-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto gap-2">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border border-slate-700 bg-slate-800 px-3 py-2.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all" className="bg-slate-800 text-white">
              Barcha guruhlar
            </option>
            {availableGroups.map((g) => (
              <option key={g} value={g} className="bg-slate-800 text-white">
                {g}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-700 bg-slate-800 px-3 py-2.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="default" className="bg-slate-800 text-white">
              Saralash: Standart
            </option>
            <option value="xp-desc" className="bg-slate-800 text-white">
              🏆 Top XP (Kamayish)
            </option>
            <option value="xp-asc" className="bg-slate-800 text-white">
              📈 Kam XP (O'sish)
            </option>
            <option value="name-asc" className="bg-slate-800 text-white">
              🔤 Ism bo'yicha (A-Z)
            </option>
          </select>
        </div>
      </div>

      {/* Jadval */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400 animate-pulse">
            O'quvchilar ro'yxati yuklanmoqda...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-800/80 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Ism-Familiya</th>
                  <th className="py-3.5 px-5">Telefon</th>
                  <th className="py-3.5 px-5">Guruh</th>
                  <th className="py-3.5 px-5">XP Balans</th>
                  <th className="py-3.5 px-5 text-center">XP Boshqarish</th>
                  <th className="py-3.5 px-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((student) => {
                  const sId = student._id || student.id;
                  return (
                    <tr
                      key={sId}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-white">
                        {student.fullName || student.name}
                      </td>
                      <td className="py-4 px-5 text-slate-400 font-mono text-xs">
                        {student.phone}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-md border border-slate-700">
                          {student.group}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-orange-500 font-extrabold text-base">
                          {student.xp ?? student.points ?? 0} XP
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleXPChange(sId, 10)}
                            className="bg-emerald-950/50 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-800 transition-all active:scale-90"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleXPChange(sId, 50)}
                            className="bg-emerald-950/50 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-800 transition-all active:scale-90"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleXPChange(sId, -10)}
                            className="bg-rose-950/50 text-rose-400 hover:bg-rose-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-800 transition-all active:scale-90"
                          >
                            -10
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(sId)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm font-medium text-slate-500">
            O'quvchilar topilmadi yoki hali qo'shilmagan.
          </div>
        )}
      </div>
    </div>
  );
}