import * as API from './api';

// Telegram WebApp yoki LocalStorage'dan o'quvchi telefon raqami / ID'sini olish
export const getCurrentStudentId = () => {
  // Telegram WebApp orqali kirgan bo'lsa
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  }
  // Test/Demo rejimida saqlangan student ID
  return localStorage.getItem('unisphere_student_id') || '1'; 
};

// 1. Joriy o'quvchining profili va balansini olish
export const getStudentProfile = async () => {
  const studentId = getCurrentStudentId();
  try {
    const res = await API.get(`/students/${studentId}`);
    const data = res?.data?.data || res?.data || res;
    
    const xp = Number(data.xp ?? data.points ?? 0);
    let tier = 'Bronze';
    if (xp >= 500) tier = 'Gold';
    else if (xp >= 250) tier = 'Silver';

    return {
      id: data._id || data.id,
      name: data.fullName || data.name || "Test O'quvchi",
      phone: data.phone || '+998 90 123 45 67',
      group: data.group || 'Frontend React-01',
      xp: xp,
      tier: tier,
      rank: data.rank || 1,
      totalGroupStudents: data.totalGroupStudents || 10,
    };
  } catch (error) {
    console.warn("⚠️ O'quvchi ma'lumotlarini yuklashda xatolik, fallback ishlatilmoqda:", error);
    return {
      id: '1',
      name: "Test O'quvchi",
      phone: '+998 90 123 45 67',
      group: 'Frontend React-01',
      xp: 250,
      tier: 'Silver',
      rank: 1,
      totalGroupStudents: 10,
    };
  }
};

// 2. Guruh reytingi (Leaderboard) - TOP 10
export const getGroupLeaderboard = async (groupName) => {
  try {
    const res = await API.get(`/students?group=${encodeURIComponent(groupName || '')}`);
    const rawData = res?.data?.data || res?.data || res;
    
    if (Array.isArray(rawData)) {
      return rawData
        .map((s) => ({
          id: s._id || s.id,
          name: s.fullName || s.name,
          xp: Number(s.xp ?? s.points ?? 0),
        }))
        .sort((a, b) => b.xp - a.xp);
    }
  } catch (error) {
    console.warn("⚠️ Leaderboard yuklashda xatolik:", error);
  }
  
  // Fallback mock ma'lumotlar
  return [
    { id: '1', name: 'Abduvaliyeva ...', xp: 17600 },
    { id: '2', name: 'Islombek', xp: 1288 },
    { id: '3', name: 'Izzatilla', xp: 1080 },
    { id: '4', name: "Azizbek Mashrabov Mashxur o'g'li", xp: 430 },
    { id: '5', name: 'Aziza', xp: 280 },
    { id: '6', name: 'Asilbek Mashrabov', xp: 110 },
  ];
};

// 3. Do'kondan mahsulot xarid qilish
export const buyProduct = async (productId, xpCost) => {
  const studentId = getCurrentStudentId();
  try {
    const res = await API.post('/orders', {
      studentId,
      productId,
      xpCost,
    });
    return res?.data || { success: true };
  } catch (error) {
    console.error("Xarid qilishda xatolik:", error);
    throw error;
  }
};