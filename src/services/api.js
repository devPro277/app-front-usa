import axios from "axios";

// 🚀 REAL RENDER BACKEND URL (Vite proxy'ga bog'liq bo'lib qolmaslik uchun)
const apiClient = axios.create({
  baseURL: "https://usa-backend-7teh.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  },
});

// 🎯 Authorization Token va Telegram InitData biriktirish
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");
    
    // Telegram Mini App ma'lumotlari
    const tgInitData = window.Telegram?.WebApp?.initData;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (tgInitData) {
      config.headers.Authorization = `Bearer ${tgInitData}`;
    }

    // 🚫 Caching'ni so'rov darajasida ham chetlab o'tamiz
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Backend javoblarining turli xil ko'rinishlarini bir xil va xavfsiz qilish
 */
function extractData(raw) {
  if (raw === null || raw === undefined) return [];
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "object") {
    // 1. Backend { success: true, data: [...] } ko'rinishida yuborsa
    if (raw.data !== undefined) return raw.data;

    // 2. Obyekt ichida massiv kalitlari bo'lsa
    for (const key of [
      "products",
      "students",
      "items",
      "groups",
      "teachers",
      "orders",
      "transactions",
      "results",
    ]) {
      if (Array.isArray(raw[key])) return raw[key];
    }

    // 3. 304 yoki bo'sh obyekt kelib qolsa safety check
    if (!raw.success && Object.keys(raw).length === 0) return [];
  }

  return raw;
}

const unwrap = async (requestPromise) => {
  try {
    const response = await requestPromise;
    // 304 Not Modified yoki 204 No Content holatlarini tekshirish
    if (response.status === 304 || !response.data) {
      return extractData(response.data);
    }
    return extractData(response.data);
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const responseData = error.response?.data;
    const backendMessage = error.response?.data?.message;

    console.warn("🔴 API SO'ROVIDA XATOLIK BO'LDI:", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      statusText,
      backendMessage,
      responseData,
    });

    throw error;
  }
};

// Axios get / post / put / patch / delete metodlarini wrapping qilish:
export const get = (url, config) => unwrap(apiClient.get(url, config));
export const post = (url, payload, config) => unwrap(apiClient.post(url, payload, config));
export const put = (url, payload, config) => unwrap(apiClient.put(url, payload, config));
export const patch = (url, payload, config) => unwrap(apiClient.patch(url, payload, config));
export const del = (url, config) => unwrap(apiClient.delete(url, config));

// ------------------ Mahsulotlar (Products / Store) ------------------

export const getProducts = () => get("/products");
export const createProduct = (payload) => post("/products", payload);
export const updateProduct = (id, payload) => put(`/products/${id}`, payload);
export const deleteProduct = (id) => del(`/products/${id}`);

// 🟢 Do'kondan sotib olish
export const purchaseProduct = (productId) => post(`/products/${productId}/purchase`);
export const buyStoreItem = (productId) => purchaseProduct(productId);

// ------------------ Talabalar va Reyting (Students & Leaderboard) ------------------

export const getStudents = (params) => get("/students", { params });
export const getLeaderboard = (params) => getStudents(params);
export const createStudent = (payload) => post("/students", payload);
export const updateStudent = (id, payload) => put(`/students/${id}`, payload);
export const deleteStudent = (id) => del(`/students/${id}`);

// 🟢 Backend `amount` kalitini kutgani uchun atomic $inc shaklida patch
export const adjustStudentPoints = (id, amount) => patch(`/students/${id}/xp`, { amount });

// ------------------ Profil va Tranzaksiyalar ------------------

export const getStudentByTelegramId = (telegramId) => get(`/students/telegram/${telegramId}`);

export const getStudentProfile = async () => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
  if (!tgUser?.id) {
    throw new Error("Telegram foydalanuvchisi aniqlanmadi. Iltimos, ilovani Telegram ichidan oching.");
  }

  // Faqatgina yagona standart endpoint orqali so'rov yuboriladi
  return await getStudentByTelegramId(tgUser.id);
};

export const getTransactions = () => get("/students/transactions");

// 🟢 QR-kod davomat
export const redeemQrCode = (code) => post("/attendance/qr-checkin", { code });
export const checkInQr = (code) => redeemQrCode(code);

// ------------------ Admin Panel & Guruhlar ------------------

export const getAdminStats = () => get("/students/admin/stats");
export const getGroups = () => get("/groups");
export const getTeachers = () => get("/teachers");

export default apiClient;