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
    const data = await API.get('/products');
    if (Array.isArray(data)) {
      return data.map((p) => ({
        ...p,
        id: p._id || p.id,
        title: p.name || p.title,
        price: p.xp_cost !== undefined ? p.xp_cost : p.price,
        cost: p.xp_cost !== undefined ? p.xp_cost : p.cost,
        stock: p.stock,
        image: p.imageUrl || p.image,
      }));
    }
    return data;
  } catch (error) {
    console.warn("⚠️ Backend Market endpointi topilmadi, mock/localStorage ishlatilmoqda");
    return getStored('unisphere_market_products', MOCK_PRODUCTS);
  }
};

export const getAdminProducts = getProducts;

export const addProduct = async (productData) => {
  const payload = {
    name: productData.name || productData.title,
    xp_cost: Number(productData.xp_cost ?? productData.price ?? productData.cost ?? 0),
    stock: Number(productData.stock ?? 0),
    imageUrl: productData.imageUrl || productData.image || "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500",
  };

  try {
    return await API.post('/products', payload);
  } catch (error) {
    console.warn("⚠️ Backend ishlamadi, LocalStorage ga qo'shilmoqda");
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const newP = { 
      ...payload, 
      id: Date.now().toString(),
      title: payload.name,
      price: payload.xp_cost,
      image: payload.imageUrl
    };
    const updated = [newP, ...current];
    setStored('unisphere_market_products', updated);
    return newP;
  }
};

export const createProduct = addProduct;

export const updateProduct = async (id, productData) => {
  const payload = {
    name: productData.name || productData.title,
    xp_cost: Number(productData.xp_cost ?? productData.price ?? productData.cost ?? 0),
    stock: Number(productData.stock ?? 0),
    imageUrl: productData.imageUrl || productData.image || "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500",
  };

  try {
    return await API.put(`/products/${id}`, payload);
  } catch (error) {
    console.warn("⚠️ Backend yo'q, LocalStorage update qilinmoqda");
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const updated = current.map((p) => (p.id === id || p._id === id ? { ...p, ...payload, title: payload.name, price: payload.xp_cost, image: payload.imageUrl } : p));
    setStored('unisphere_market_products', updated);
    return payload;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await API.del(`/products/${id}`);
  } catch (error) {
    console.warn("⚠️ Backend yo'q, LocalStorage dan o'chirilmoqda");
    const current = getStored('unisphere_market_products', MOCK_PRODUCTS);
    const updated = current.filter((p) => p.id !== id && p._id !== id);
    setStored('unisphere_market_products', updated);
    return true;
  }
};

// ==========================================
// 2. GURUHLAR (GROUPS) - FULL CRUD
// ==========================================
export const getGroups = async () => {
  const groups = getStored('unisphere_groups', DEFAULT_GROUPS);
  const students = await getStudents();

  return groups.map((group) => {
    const count = students.filter((s) => {
      const studentGroup = (s.group || s.groupName || '').trim().toLowerCase();
      const groupName = (group.name || '').trim().toLowerCase();
      return studentGroup === groupName && s.status !== 'inactive';
    }).length;

    return {
      ...group,
      studentsCount: count,
    };
  });
};

export const addGroup = async (groupData) => {
  const current = getStored('unisphere_groups', DEFAULT_GROUPS);
  const newGroup = {
    ...groupData,
    id: groupData.id || groupData._id || Date.now().toString(),
    name: groupData.name || groupData.title || '',
  };
  const updated = [newGroup, ...current];
  setStored('unisphere_groups', updated);
  return newGroup;
};

export const createGroup = addGroup;

export const updateGroup = async (id, groupData) => {
  const current = getStored('unisphere_groups', DEFAULT_GROUPS);
  const updated = current.map((g) =>
    g.id === id || g._id === id ? { ...g, ...groupData } : g
  );
  setStored('unisphere_groups', updated);
  return groupData;
};

export const deleteGroup = async (id) => {
  const current = getStored('unisphere_groups', DEFAULT_GROUPS);
  const updated = current.filter((g) => g.id !== id && g._id !== id);
  setStored('unisphere_groups', updated);
  return true;
};

// ==========================================
// 3. USTOZLAR (TEACHERS) - FULL CRUD
// ==========================================
export const getTeachers = async () => {
  const teachers = getStored('unisphere_teachers', DEFAULT_TEACHERS);
  const groups = getStored('unisphere_groups', DEFAULT_GROUPS);

  return teachers.map((teacher) => {
    const teacherGroupCount = groups.filter((g) => {
      return (
        g.teacherId === teacher.id ||
        g.teacherName === teacher.name ||
        g.teacher === teacher.name ||
        g.mainTeacher === teacher.name
      );
    }).length;

    return {
      ...teacher,
      groupsCount: teacherGroupCount,
    };
  });
};

export const addTeacher = async (teacherData) => {
  const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
  const newTeacher = {
    ...teacherData,
    id: teacherData.id || teacherData._id || Date.now().toString(),
  };
  const updated = [newTeacher, ...current];
  setStored('unisphere_teachers', updated);
  return newTeacher;
};

export const updateTeacher = async (id, teacherData) => {
  const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
  const updated = current.map((t) =>
    t.id === id || t._id === id ? { ...t, ...teacherData } : t
  );
  setStored('unisphere_teachers', updated);
  return teacherData;
};

export const deleteTeacher = async (id) => {
  const current = getStored('unisphere_teachers', DEFAULT_TEACHERS);
  const updated = current.filter((t) => t.id !== id && t._id !== id);
  setStored('unisphere_teachers', updated);
  return true;
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
    const rawData = res?.data || res;
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
    const created = res?.data || res;
    return formatStudent(created);
  } catch (error) {
    console.warn("⚠️ Backend ga qo'shib bo'lmadi, LocalStorage ga yozilmoqda");
    const current = getStored('unisphere_students', DEFAULT_STUDENTS);
    const newStudent = formatStudent({
      ...payload,
      id: Date.now().toString(),
    });
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
    const updated = res?.data || res;
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
// MUKAMMAL XP OSHIRISH (PUT ORQALI KAFOLATLI)
// ==========================================
export const adjustStudentPoints = async (studentId, pointsDelta) => {
  const cleanId = typeof studentId === 'object' ? (studentId._id || studentId.id) : studentId;
  const delta = Number(pointsDelta) || 0;

  const allStudents = await getStudents();
  const currentStudent = allStudents.find(s => (s.id === cleanId || s._id === cleanId));

  if (!currentStudent) return null;

  const newXp = Math.max(0, (currentStudent.xp || currentStudent.points || 0) + delta);

  return await updateStudent(cleanId, {
    ...currentStudent,
    xp: newXp,
    points: newXp
  });
};

export const deactivateStudent = async (studentId) => {
  return updateStudent(studentId, { status: 'inactive' });
};

export const reactivateStudent = async (studentId) => {
  return updateStudent(studentId, { status: 'active' });
};

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
// 5. ADMIN STATISTIKASI (BACKEND REALTIME INTEGRATSIYA)
// ==========================================
export const getAdminStats = async () => {
  // LocalStorage / Backend dan joriy o'quvchilarni olamiz
  const students = await getStudents(); 
  const orders = getStored('unisphere_orders', []);

  // Faol o'quvchilarni ajratamiz (yoki hammasini ko'rsatish uchun students.length)
  const activeStudents = students.filter(s => s.status !== 'inactive');

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || !o.status
  ).length;

  return {
    totalStudents: activeStudents.length, // Agar barcha 10 tasini ko'rsatmoqchi bo'lsang: students.length
    totalTeachers: 4,
    totalGroups: 4,
    pendingOrders: pendingOrdersCount,
    totalXpInCirculation: students.reduce(
      (sum, s) => sum + (Number(s.xp) || Number(s.points) || 0),
      0
    ),
  };
};