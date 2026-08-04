import * as API from './api';
import { MOCK_PRODUCTS } from './mockDatabase';

// ==========================================
// DEFAULT MOCK DATA (Boshlang'ich ma'lumotlar)
// ==========================================
const DEFAULT_TEACHERS = [
  { id: 't1', name: 'Islombek Abduvaliyev', subject: 'Frontend', login: 'frontAdminDash' },
  { id: 't2', name: 'Azizbek Mashrabov', subject: 'Chess', login: 'AzizCHESS' },
  { id: 't3', name: 'Azamat', subject: 'backend', login: 'devfff' },
];

const DEFAULT_GROUPS = [
  { id: 'g1', name: 'Frontend-01', teacherId: 't1', teacherName: 'Islombek Abduvaliyev' },
  { id: 'g2', name: 'Chess-01', teacherId: 't2', teacherName: 'Azizbek Mashrabov' },
];

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Anvarova Xolida', phone: '+998888888888', group: 'Chess-01', points: 60, status: 'active', tier: 'Bronze' },
  { id: '2', name: 'Asilbek', phone: '+998887774444', group: 'Frontend-01', points: 111, status: 'active', tier: 'Bronze' },
  { id: '3', name: 'Sardor Raximxonov', phone: '+998997295287', group: 'Frontend-01', points: 10, status: 'active', tier: 'Bronze' },
  { id: '4', name: 'Otabek Rashidov', phone: '+998901234567', group: 'Chess-01', points: 130, status: 'active', tier: 'Bronze' },
  { id: '5', name: 'Sardor Rahimjonov', phone: '+998939876543', group: 'Frontend-01', points: 320, status: 'active', tier: 'Silver' },
];

// ==========================================
// LOCALSTORAGE YORDAMCHI FUNKSIYALARI
// ==========================================
const getStored = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("LocalStorage ga yozishda xatolik:", e);
  }
};

// ==========================================
// 1. MARKET / OMBOR API SO'ROVLARI
// ==========================================
export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    const resData = response?.data ?? response;

    if (Array.isArray(resData)) return resData;
    if (resData && typeof resData === 'object' && Array.isArray(resData.data)) return resData.data;
    if (resData && typeof resData === 'object' && Array.isArray(resData.products)) return resData.products;

    const local = localStorage.getItem('unisphere_market_products');
    if (local) return JSON.parse(local);
    return typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : [];
  } catch (error) {
    console.error("Backend so'rovida xatolik yuz berdi:", error);
    const local = localStorage.getItem('unisphere_market_products');
    if (local) return JSON.parse(local);
    return typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : [];
  }
};

export const getAdminProducts = getProducts;

export const addProduct = async (productData) => {
  const payload = {
    name: productData.name || productData.title,
    title: productData.title || productData.name,
    xp_cost: Number(productData.xp_cost ?? productData.price ?? productData.cost ?? 0),
    price: Number(productData.price ?? productData.xp_cost ?? productData.cost ?? 0),
    stock: Number(productData.stock ?? productData.quantity ?? 0),
    imageUrl: productData.imageUrl || productData.image || "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500",
    description: productData.description || '',
  };

  try {
    const res = await API.post('/products', payload);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    console.warn("⚠️ Backend ishlamadi, LocalStorage ga qo'shilmoqda:", error.message);
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const newP = { ...payload, id: Date.now().toString(), _id: Date.now().toString() };
    const updated = [newP, ...current];
    setStored('unisphere_market_products', updated);
    return newP;
  }
};

export const createProduct = addProduct;

export const updateProduct = async (id, productData) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  const payload = {
    name: productData.name || productData.title,
    title: productData.title || productData.name,
    xp_cost: Number(productData.xp_cost ?? productData.price ?? productData.cost ?? 0),
    price: Number(productData.price ?? productData.xp_cost ?? productData.cost ?? 0),
    stock: Number(productData.stock ?? productData.quantity ?? 0),
    imageUrl: productData.imageUrl || productData.image || "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500",
    description: productData.description || '',
  };

  try {
    const res = await API.put(`/products/${cleanId}`, payload);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    console.warn("⚠️ Backend update ishlamadi, LocalStorage yangilanmoqda");
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const updated = current.map((p) => (p.id === cleanId || p._id === cleanId ? { ...p, ...payload } : p));
    setStored('unisphere_market_products', updated);
    return payload;
  }
};

export const deleteProduct = async (id) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  try {
    const res = await API.del(`/products/${cleanId}`);
    return res?.data || true;
  } catch (error) {
    console.warn("⚠️ Backend delete ishlamadi, LocalStorage dan o'chirilmoqda");
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const updated = current.filter((p) => p.id !== cleanId && p._id !== cleanId);
    setStored('unisphere_market_products', updated);
    return true;
  }
};

// ==========================================
// 2. GURUHLAR (GROUPS) - REAL BACKEND INTEGRATION
// ==========================================
export const getGroups = async () => {
  try {
    const res = await API.get('/groups');
    const rawData = res?.data?.data || res?.data || res;
    if (Array.isArray(rawData)) return rawData;
  } catch (error) {
    console.warn("⚠️ Backend Groups API xatosi, LocalStorage ishlatilmoqda:", error.message);
  }
  return getStored('unisphere_groups', DEFAULT_GROUPS);
};

export const addGroup = async (groupData) => {
  const payload = {
    name: groupData.name || groupData.title || '',
    teacherId: groupData.teacherId || '',
    teacherName: groupData.teacherName || '',
  };

  try {
    const res = await API.post('/groups', payload);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    const current = getStored('unisphere_groups', DEFAULT_GROUPS);
    const newGroup = { ...payload, id: Date.now().toString(), _id: Date.now().toString() };
    const updated = [newGroup, ...current];
    setStored('unisphere_groups', updated);
    return newGroup;
  }
};

export const createGroup = addGroup;

export const updateGroup = async (id, groupData) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  try {
    const res = await API.put(`/groups/${cleanId}`, groupData);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    const current = getStored('unisphere_groups', DEFAULT_GROUPS);
    const updated = current.map((g) => (g.id === cleanId || g._id === cleanId ? { ...g, ...groupData } : g));
    setStored('unisphere_groups', updated);
    return groupData;
  }
};

export const deleteGroup = async (id) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  try {
    await API.del(`/groups/${cleanId}`);
    return true;
  } catch (error) {
    const current = getStored('unisphere_groups', DEFAULT_GROUPS);
    const updated = current.filter((g) => g.id !== cleanId && g._id !== cleanId);
    setStored('unisphere_groups', updated);
    return true;
  }
};

// ==========================================
// 3. USTOZLAR (TEACHERS) - REAL BACKEND INTEGRATION
// ==========================================
export const getTeachers = async () => {
  let teachers = [];
  try {
    const res = await API.get('/teachers');
    const rawData = res?.data?.data || res?.data || res;
    if (Array.isArray(rawData)) teachers = rawData;
  } catch (error) {
    teachers = getStored('unisphere_teachers', DEFAULT_TEACHERS);
  }

  const groups = await getGroups();

  return teachers.map((teacher) => {
    const teacherGroupCount = groups.filter((g) => {
      const tId = teacher.id || teacher._id;
      return (
        g.teacherId === tId ||
        g.teacherName === teacher.name ||
        g.teacher === teacher.name
      );
    }).length;

    return {
      ...teacher,
      id: teacher._id || teacher.id,
      groupsCount: teacherGroupCount,
    };
  });
};

export const addTeacher = async (teacherData) => {
  try {
    const res = await API.post('/teachers', teacherData);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
    const newTeacher = { ...teacherData, id: Date.now().toString(), _id: Date.now().toString() };
    const updated = [newTeacher, ...current];
    setStored('unisphere_teachers', updated);
    return newTeacher;
  }
};

export const updateTeacher = async (id, teacherData) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  try {
    const res = await API.put(`/teachers/${cleanId}`, teacherData);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
    const updated = current.map((t) => (t.id === cleanId || t._id === cleanId ? { ...t, ...teacherData } : t));
    setStored('unisphere_teachers', updated);
    return teacherData;
  }
};

export const deleteTeacher = async (id) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;
  try {
    await API.del(`/teachers/${cleanId}`);
    return true;
  } catch (error) {
    const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
    const updated = current.filter((t) => t.id !== cleanId && t._id !== cleanId);
    setStored('unisphere_teachers', updated);
    return true;
  }
};

// ==========================================
// 4. O'QUVCHILAR (STUDENTS) - BACKEND REALTIME INTEGRATSIYA
// ==========================================
const formatStudent = (s) => {
  const points = s.xp !== undefined ? Number(s.xp) : (Number(s.points) || 0);
  let tier = 'Bronze';
  if (points >= 500) tier = 'Gold';
  else if (points >= 250) tier = 'Silver';

  return {
    ...s,
    id: s._id || s.id,
    name: s.fullName || s.name || '',
    fullName: s.fullName || s.name || '',
    phone: s.phone || '',
    group: s.group || '',
    points: points,
    xp: points,
    status: s.status || 'active',
    tier: tier,
  };
};

export const getStudents = async () => {
  try {
    const res = await API.get('/students');
    const rawData = res?.data?.data || res?.data || res;
    if (Array.isArray(rawData)) {
      return rawData.map(formatStudent);
    }
  } catch (error) {
    console.warn("⚠️ Backend Students API xatosi, LocalStorage ishlatilmoqda:", error.message);
  }
  return getStored('unisphere_students', DEFAULT_STUDENTS).map(formatStudent);
};

export const getAdminStudents = getStudents;

export const addStudent = async (studentData) => {
  const payload = {
    fullName: studentData.fullName || studentData.name,
    phone: studentData.phone,
    group: studentData.group,
    xp: Number(studentData.points ?? studentData.xp ?? 0),
  };

  try {
    const res = await API.post('/students', payload);
    const created = res?.data?.data || res?.data || res;
    return formatStudent(created);
  } catch (error) {
    console.warn("⚠️ Backend ga qo'shib bo'lmadi, LocalStorage ga yozilmoqda");
    const current = getStored('unisphere_students', DEFAULT_STUDENTS);
    const newStudent = formatStudent({ ...payload, id: Date.now().toString() });
    const updated = [newStudent, ...current];
    setStored('unisphere_students', updated);
    return newStudent;
  }
};

export const updateStudent = async (id, studentData) => {
  const cleanId = typeof id === 'object' ? (id._id || id.id) : id;

  const payload = {
    fullName: studentData.fullName || studentData.name,
    phone: studentData.phone,
    group: studentData.group,
    xp: studentData.points !== undefined ? Number(studentData.points) : (studentData.xp !== undefined ? Number(studentData.xp) : undefined),
    points: studentData.points !== undefined ? Number(studentData.points) : (studentData.xp !== undefined ? Number(studentData.xp) : undefined)
  };

  try {
    const res = await API.put(`/students/${cleanId}`, payload);
    const updated = res?.data?.data || res?.data || res;
    return formatStudent(updated);
  } catch (error) {
    console.warn("⚠️ Backend update ishlamadi, LocalStorage yangilanmoqda");
    const current = getStored('unisphere_students', DEFAULT_STUDENTS);
    let updatedStudentObj = null;

    const updated = current.map((s) => {
      if (s.id === cleanId || s._id === cleanId) {
        updatedStudentObj = formatStudent({ ...s, ...studentData });
        return updatedStudentObj;
      }
      return s;
    });
    
    setStored('unisphere_students', updated);
    return updatedStudentObj || formatStudent({ id: cleanId, ...studentData });
  }
};

// ==========================================
// ATOMIC XP OSHIRISH (RACE-CONDITION FIX)
// ==========================================
export const adjustStudentPoints = async (studentId, pointsDelta) => {
  const cleanId = typeof studentId === 'object' ? (studentId._id || studentId.id) : studentId;
  const delta = Number(pointsDelta) || 0;

  try {
    // 🟢 Atomar PATCH so'rovi yuboramiz
    const res = await API.patch(`/students/${cleanId}/xp`, { amount: delta });
    const updated = res?.data?.data || res?.data || res;
    return formatStudent(updated);
  } catch (error) {
    console.warn("⚠️ Backend XP update ishlamadi, LocalStorage ishlatilmoqda");
    const allStudents = await getStudents();
    const currentStudent = allStudents.find(s => (s.id === cleanId || s._id === cleanId));
    if (!currentStudent) return null;

    const newXp = Math.max(0, (currentStudent.xp || currentStudent.points || 0) + delta);
    return await updateStudent(cleanId, { ...currentStudent, xp: newXp, points: newXp });
  }
};

export const deactivateStudent = async (studentId) => updateStudent(studentId, { status: 'inactive' });
export const reactivateStudent = async (studentId) => updateStudent(studentId, { status: 'active' });

export const deleteStudent = async (studentId) => {
  const cleanId = typeof studentId === 'object' ? (studentId._id || studentId.id) : studentId;

  try {
    await API.del(`/students/${cleanId}`);
    return true;
  } catch (error) {
    console.warn("⚠️ Backend delete ishlamadi, LocalStorage dan o'chirilmoqda");
    const current = getStored('unisphere_students', DEFAULT_STUDENTS);
    const updated = current.filter((s) => s.id !== cleanId && s._id !== cleanId);
    setStored('unisphere_students', updated);
    return true;
  }
};

// ==========================================
// 5. ADMIN STATISTIKASI (REALTIME)
// ==========================================
export const getAdminStats = async () => {
  try {
    const res = await API.get('/students/admin/stats');
    if (res && res.totalStudents !== undefined) return res;
  } catch (e) {
    console.warn("⚠️ Backend stats API ishlamadi, dinamik hisoblanmoqda");
  }

  const students = await getStudents();
  const teachers = await getTeachers();
  const groups = await getGroups();
  const orders = getStored('unisphere_orders', []);

  const activeStudents = students.filter(s => s.status !== 'inactive');
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || !o.status).length;

  return {
    totalStudents: activeStudents.length,
    totalTeachers: teachers.length,
    totalGroups: groups.length,
    pendingOrders: pendingOrdersCount,
    totalXpInCirculation: students.reduce((sum, s) => sum + (Number(s.xp) || Number(s.points) || 0), 0),
  };
};