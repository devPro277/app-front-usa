import { useEffect, useState } from 'react';
import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getStudents, // <-- Qo'shildi
} from '../../services/adminApi';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import TeacherForm from '../../components/admin/TeacherForm';
import GroupForm from '../../components/admin/GroupForm';
import TeacherCard from '../../components/admin/TeacherCard';
import GroupAccordion from '../../components/admin/GroupAccordion';

export default function AdminGroups() {
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]); // <-- Qo'shildi
  const [loading, setLoading] = useState(true);

  // Ustozlar modallari
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  // Guruhlar modallari va state'lari
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    try {
      const [t, g, s] = await Promise.all([
        getTeachers(),
        getGroups(),
        getStudents(),
      ]);
      setTeachers(Array.isArray(t) ? t : []);
      setGroups(Array.isArray(g) ? g : []);
      setStudents(Array.isArray(s) ? s : []);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // --- USTOZLAR MANTIQLARI ---
  async function handleTeacherSubmit(values) {
    setIsSubmitting(true);
    try {
      const teacherId = editingTeacher?.id || editingTeacher?._id;

      if (editingTeacher && teacherId) {
        await updateTeacher(teacherId, values);
      } else {
        await addTeacher(values);
      }

      setIsTeacherModalOpen(false);
      setEditingTeacher(null);
      await loadData();
    } catch (err) {
      console.error("Ustozni saqlashda xatolik:", err);
      throw new Error(err?.response?.data?.message || err?.message || "Ustozni saqlab bo'lmadi");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteTeacherConfirm() {
    setIsSubmitting(true);
    try {
      const teacherId = deletingTeacher?.id || deletingTeacher?._id;
      if (teacherId) {
        await deleteTeacher(teacherId);
      }
      setDeletingTeacher(null);
      await loadData();
    } catch (err) {
      console.error("Ustozni o'chirishda xatolik:", err);
      alert(err?.message || "O'chirishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- GURUHLAR MANTIQLARI ---
  async function handleGroupSubmit(values) {
    setIsSubmitting(true);
    try {
      const selectedTeacher = teachers.find(
        (t) => (t.id || t._id) === values.teacherId
      );
      
      const payload = {
        ...values,
        teacherName: selectedTeacher ? selectedTeacher.name : (values.teacherName || ''),
      };

      const groupId = editingGroup?.id || editingGroup?._id;

      if (editingGroup && groupId) {
        await updateGroup(groupId, payload);
      } else {
        await addGroup(payload);
      }

      setIsGroupModalOpen(false);
      setEditingGroup(null);
      await loadData();
    } catch (err) {
      console.error("Guruhni saqlashda xatolik:", err);
      throw new Error(err?.response?.data?.message || err?.message || "Guruhni saqlab bo'lmadi");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteGroupConfirm() {
    setIsSubmitting(true);
    try {
      const groupId = deletingGroup?.id || deletingGroup?._id;
      if (groupId) {
        await deleteGroup(groupId);
      }
      setDeletingGroup(null);
      await loadData();
    } catch (err) {
      console.error("Guruhni o'chirishda xatolik:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const deletingTeacherId = deletingTeacher?.id || deletingTeacher?._id;
  const affectedGroupsCount = deletingTeacher
    ? groups.filter((g) => (g.teacherId || g.teacher?._id || g.teacher) === deletingTeacherId).length
    : 0;

  return (
    <div className="flex flex-col gap-10">
      {/* --- USTOZLAR SECTION --- */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1B365D] dark:text-white">
              Ustozlar
            </h1>
            <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">
              Ustozlar faqat nazoratchi — ularga ball yozilmaydi
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsTeacherModalOpen(true);
            }}
            className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            + Yangi ustoz
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
              ))
            : teachers.map((teacher, index) => (
                <TeacherCard
                  key={teacher.id || teacher._id || index}
                  teacher={teacher}
                  onEdit={(t) => {
                    setEditingTeacher(t);
                    setIsTeacherModalOpen(true);
                  }}
                  onDelete={(t) => setDeletingTeacher(t)}
                />
              ))}
        </div>
      </section>

      {/* --- GURUHLAR SECTION --- */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1B365D] dark:text-white">
              Guruhlar
            </h1>
            <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">
              Har bir guruh bitta ustozga bog'langan
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGroup(null);
              setIsGroupModalOpen(true);
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            + Yangi guruh
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
              ))
            : groups.map((group, index) => (
                <GroupAccordion
                  key={group.id || group._id || index}
                  group={group}
                  students={students} // <-- Shu yerda studentlar uzatildi!
                  onEdit={(g) => {
                    setEditingGroup(g);
                    setIsGroupModalOpen(true);
                  }}
                  onDelete={(g) => setDeletingGroup(g)}
                />
              ))}
        </div>
      </section>

      {/* --- MODALLAR --- */}
      <Modal
        open={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setEditingTeacher(null);
        }}
        title={editingTeacher ? 'Ustozni tahrirlash' : "Yangi ustoz qo'shish"}
      >
        <TeacherForm
          initialValues={editingTeacher}
          onSubmit={handleTeacherSubmit}
          onCancel={() => {
            setIsTeacherModalOpen(false);
            setEditingTeacher(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        open={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        title={editingGroup ? 'Guruhni tahrirlash' : 'Yangi guruh ochish'}
      >
        <GroupForm
          initialData={editingGroup}
          teachers={teachers}
          onSubmit={handleGroupSubmit}
          onCancel={() => {
            setIsGroupModalOpen(false);
            setEditingGroup(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingTeacher)}
        title="Ustozni o'chirish"
        message={
          affectedGroupsCount > 0
            ? `Diqqat: "${deletingTeacher?.name}" o'chirilsa, unga bog'langan ${affectedGroupsCount} ta guruh vaqtincha ustozsiz qoladi. Davom etasizmi?`
            : `"${deletingTeacher?.name}" haqiqatan ham o'chirilsinmi?`
        }
        confirmLabel="Ha, o'chirish"
        onConfirm={handleDeleteTeacherConfirm}
        onCancel={() => setDeletingTeacher(null)}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        open={Boolean(deletingGroup)}
        title="Guruhni o'chirish"
        message={`"${deletingGroup?.name}" guruhi haqiqatan ham o'chirilsinmi?`}
        confirmLabel="Ha, o'chirish"
        onConfirm={handleDeleteGroupConfirm}
        onCancel={() => setDeletingGroup(null)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}