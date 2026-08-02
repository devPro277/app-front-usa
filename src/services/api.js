import axios from "axios";

// Vite proksi (`vite.config.js`) `/api` so'rovlarini backend serverga yo'naltiradi
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
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
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Backend javoblarining turli xil ko'rinishlarini bir xil qilish
 */
function extractData(raw) {
  if (raw === null || raw === undefined) return {};
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "object") {
    if (raw.data !== undefined) return raw.data;

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
  }

  return raw;
}

const unwrap = async (requestPromise) => {
  try {
    const response = await requestPromise;
    const extracted = extractData(response.data);
    return extracted;
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

// 🟢 Do'kondan sotib olish (ikkala nom bo'yicha eksport qilinadi)
export const purchaseProduct = (productId) => post(`/products/${productId}/purchase`);
export const buyStoreItem = (productId) => purchaseProduct(productId);

// ------------------ Talabalar va Reyting (Students & Leaderboard) ------------------

export const getStudents = (params) => get("/students", { params });
export const getLeaderboard = (params) => getStudents(params); // 🟢 Profile.jsx uchun alias
export const createStudent = (payload) => post("/students", payload);
export const updateStudent = (id, payload) => put(`/students/${id}`, payload);
export const deleteStudent = (id) => del(`/students/${id}`);

// 🟢 Backend `amount` kalitini kutgani uchun `amount` yuboriladi
export const adjustStudentPoints = (id, amount) => patch(`/students/${id}/xp`, { amount });

// ------------------ Profil va Tranzaksiyalar ------------------

export const getStudentProfile = async () => {
  try {
    return await get("/student/profile");
  } catch (error) {
    console.warn(
      "Backendda profil endpointi topilmadi, vaqtinchalik profil ma'lumoti ishlatilmoqda."
    );
    
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    return {
      id: 1,
      fullName: tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : "Talaba",
      name: tgUser ? tgUser.first_name : "Talaba",
      phone: "+998 90 123 45 67",
      group: "Frontend Bootcamp N1",
      xp: 150,
      points: 150,
      balance: 150,
    };
  }
};

// 🟢 YANGI QO'SHILDI: XP Tranzaksiyalari tarixi (+10 XP QR davomat, -200 XP Do'kondan xaridlari)
export const getTransactions = () => get("/students/transactions");

// 🟢 YANGI QO'SHILDI: Davomat uchun QR-kodni tekshirish/aktivlashtirish
export const redeemQrCode = (code) => post("/attendance/qr-checkin", { code });
export const checkInQr = (code) => redeemQrCode(code);

// ------------------ Admin Panel ------------------

export const getAdminStats = () => get("/students/admin/stats");

export default apiClient;