import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import API, { adjustStudentPoints, deleteStudent } from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Qo'shish formasi state'lari
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");

  // 🎯 Search, Filter va Sort State'lari
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // 1. O'quvchilarni yuklash
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/students");
      // unwrap funksiyasi tufayli res to'g'ridan-to'g'ri massiv bo'lishi ham mumkin
      const list = Array.isArray(res) ? res : res?.data || [];
      setStudents(list);
    } catch (error) {
      console.error("O'quvchilarni yuklashda xatolik:", error);
      toast.error("O'quvchilar ro'yxatini olib bo'lmadi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Yangi o'quvchi qo'shish
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !group) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring!");
    }

    try {
      const res = await API.post("/students", {
        fullName,
        phone,
        group,
        xp: 0,
      });
      const newStudent = res?.data || res;
      setStudents((prev) => [newStudent, ...prev]);

      setFullName("");
      setPhone("");
      setGroup("");
      toast.success("O'quvchi muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Qo'shishda xatolik:", error);
      toast.error(error.response?.data?.message || "O'quvchini qo'shishda xatolik yuz berdi!");
    }
  };

  // 3. XP ni o'zgartirish (+10, +50, -10)
  const handleXPChange = async (id, delta) => {
    try {
      const student = students.find((s) => (s._id || s.id) === id);
      if (!student) return;

      const updatedStudent = await adjustStudentPoints(id, delta);

      if (updatedStudent) {
        setStudents((prev) =>
          prev.map((s) =>
            (s._id || s.id) === id ? { ...s, xp: updatedStudent.xp ?? ((s.xp || 0) + delta) } : s
          )
        );
      } else {
        const newXp = Math.max(0, (student.xp || 0) + delta);
        setStudents((prev) =>
          prev.map((s) => ((s._id || s.id) === id ? { ...s, xp: newXp } : s))
        );
      }

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

  // 4. O'quvchini o'chirish
  const handleDelete = async (id) => {
    if (!window.confirm("O'quvchini o'chirishga ishonchingiz komilmi?")) return;

    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== id));
      toast.success("O'quvchi muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error("O'quvchini o'chirishda xatolik yuz berdi!");
    }
  };

  // 🔍 Dynamic Filtr va Tartiblash Mantiqi
  const filteredStudents = students
    .filter((student) => {
      const nameMatch = (student.fullName || student.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const phoneMatch = (student.phone || "").includes(searchTerm);
      const groupMatch = (student.group || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isGroupSelected =
        selectedGroup === "all" ||
        (student.group || "").toLowerCase() === selectedGroup.toLowerCase();

      return (nameMatch || phoneMatch || groupMatch) && isGroupSelected;
    })
    .sort((a, b) => {
      if (sortBy === "xp-desc") return (b.xp || 0) - (a.xp || 0);
      if (sortBy === "xp-asc") return (a.xp || 0) - (b.xp || 0);
      if (sortBy === "name-asc") return (a.fullName || a.name || "").localeCompare(b.fullName || b.name || "");
      return 0;
    });

  // Guruhlarning takrorlanmas ro'yxati
  const availableGroups = Array.from(
    new Set(students.map((s) => s.group).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1B365D] p-6 max-w-7xl mx-auto space-y-8 relative">
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

      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1B365D] tracking-tight">
          Talabalarni Boshqarish
        </h1>
        <p className="text-sm text-[#1B365D]/70 mt-1 font-medium">
          O'quvchilar ro'yxati, ularning guruhlari va XP ballarini kuzatib boring
        </p>
      </div>

      <form
        onSubmit={handleAddStudent}
        className="bg-[#FFFFFF] border border-gray-200/80 p-5 rounded-2xl flex flex-col md:flex-row gap-3 shadow-sm items-center"
      >
        <input
          type="text"
          placeholder="F.I.SH (masalan: Islombek)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full md:w-1/3 border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
        />
        <input
          type="text"
          placeholder="Tel (masalan: +998901234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full md:w-1/3 border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
        />
        <input
          type="text"
          placeholder="Guruh (masalan: Frontend N1)"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full md:w-1/4 border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
        />

        <button
          type="submit"
          className="w-full md:w-auto bg-[#F97316] hover:bg-[#ea580c] text-white font-bold px-7 py-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-sm"
        >
          + Qo'shish
        </button>
      </form>

      <div className="bg-[#FFFFFF] border border-gray-200/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="O'quvchi ismi, tel yoki guruh bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto gap-2">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1B365D] focus:outline-none focus:border-[#1B365D] transition-all"
          >
            <option value="all">Barcha guruhlar</option>
            {availableGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1B365D] focus:outline-none focus:border-[#1B365D] transition-all"
          >
            <option value="default">Saralash: Standart</option>
            <option value="xp-desc">🏆 Top XP (Kamayish)</option>
            <option value="xp-asc">📈 Kam XP (O'sish)</option>
            <option value="name-asc">🔤 Ism bo'yicha (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-[#1B365D]/60 animate-pulse">
            O'quvchilar ro'yxati yuklanmoqda...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1B365D]">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-[#1B365D]/70">
                <tr>
                  <th className="py-3.5 px-5">Ism-Familiya</th>
                  <th className="py-3.5 px-5">Telefon</th>
                  <th className="py-3.5 px-5">Guruh</th>
                  <th className="py-3.5 px-5">XP Balans</th>
                  <th className="py-3.5 px-5 text-center">XP Boshqarish</th>
                  <th className="py-3.5 px-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const sId = student._id || student.id;
                  return (
                    <tr
                      key={sId}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="py-4 px-5 font-bold text-[#1B365D]">
                        {student.fullName || student.name}
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-mono text-xs">
                        {student.phone}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 bg-[#1B365D]/5 text-[#1B365D] text-xs font-semibold rounded-md border border-[#1B365D]/10">
                          {student.group}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-[#F97316] font-extrabold text-base">
                          {student.xp || 0} XP
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleXPChange(sId, 10)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-200 transition-all active:scale-90"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleXPChange(sId, 50)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-200 transition-all active:scale-90"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleXPChange(sId, -10)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-200 transition-all active:scale-90"
                          >
                            -10
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDelete(sId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
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
          <div className="py-12 text-center text-sm font-medium text-gray-400">
            Kiritilgan mezonlarga mos o'quvchilar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}