/**
 * ==========================================================
 *  UMUMIY MOCK MA'LUMOTLAR BAZASI
 * ==========================================================
 * Bu fayl butun loyiha (Admin panel + Telegram WebApp) uchun
 * YAGONA sun'iy "ma'lumotlar bazasi" hisoblanadi.
 *
 * Nega bitta joyda? Chunki masalan o'quvchi do'kondan biror
 * narsa sotib olganda, bu Admin'ning "Buyurtmalar" ro'yxatida
 * ham darhol ko'rinishi kerak — ikkala tomon ham bir xil
 * massivlarga murojaat qilishi shart.
 *
 * BACKEND ULANGANDA: bu butun fayl olib tashlanadi, o'rniga
 * `services/api.js` va `services/adminApi.js` haqiqiy
 * `fetch(...)` so'rovlarini yuboradi.
 * ==========================================================
 */

// ---------------------------------------------------------
// USTOZLAR (faqat nazoratchi — ballari yo'q)
// ---------------------------------------------------------
export const MOCK_TEACHERS = [
  { id: 't1', name: 'Aziza Karimova', subject: 'Frontend', login: 'aziza.k', password: 'pass123' },
  { id: 't2', name: 'Jasur Toshkentov', subject: 'English', login: 'jasur.t', password: 'pass123' },
  { id: 't3', name: 'Malika Yusupova', subject: 'Chess', login: 'malika.y', password: 'pass123' },
];

// ---------------------------------------------------------
// GURUHLAR (har bir guruh bitta ustozga bog'langan — 1:N)
// ---------------------------------------------------------
export const MOCK_GROUPS = [
  { id: 'g1', name: 'Frontend-24', teacherId: 't1' },
  { id: 'g2', name: 'Frontend-25', teacherId: 't1' },
  { id: 'g3', name: 'English-Beginner', teacherId: 't2' },
  { id: 'g4', name: 'Chess-Junior', teacherId: 't3' },
];

// ---------------------------------------------------------
// O'QUVCHILAR (to'liq ro'yxat — admin panel shu bilan ishlaydi)
// ---------------------------------------------------------
export const MOCK_STUDENTS = [
  { id: 'std_001', name: 'Islombek Tursunov', groupId: 'g1', balance: 450, tier: 'Silver', status: 'active' },
  { id: 'std_002', name: 'Sardor Aliyev', groupId: 'g1', balance: 2340, tier: 'Gold', status: 'active' },
  { id: 'std_003', name: 'Malika Rustamova', groupId: 'g1', balance: 2190, tier: 'Gold', status: 'active' },
  { id: 'std_004', name: 'Javlon Nazarov', groupId: 'g2', balance: 1750, tier: 'Silver', status: 'active' },
  { id: 'std_005', name: 'Dilnoza Karimova', groupId: 'g2', balance: 1620, tier: 'Silver', status: 'active' },
  { id: 'std_006', name: 'Aziz Mahmudov', groupId: 'g3', balance: 1480, tier: 'Bronze', status: 'active' },
  { id: 'std_007', name: 'Kamola Sodiqova', groupId: 'g3', balance: 1320, tier: 'Bronze', status: 'active' },
  { id: 'std_008', name: 'Bekzod Yusupov', groupId: 'g4', balance: 1210, tier: 'Bronze', status: 'inactive' },
  { id: 'std_009', name: 'Nodira Farmonova', groupId: 'g1', balance: 1050, tier: 'Bronze', status: 'active' },
  { id: 'std_010', name: 'Otabek Qodirov', groupId: 'g2', balance: 980, tier: 'Bronze', status: 'active' },
];

// Hozircha auth yo'q — Telegram WebApp'ni shu o'quvchi nomidan ochamiz
export const CURRENT_STUDENT_ID = 'std_001';

// ---------------------------------------------------------
// TRANZAKSIYALAR TARIXI (joriy o'quvchi uchun)
// ---------------------------------------------------------
export const MOCK_TRANSACTIONS = [
  { id: 't1', studentId: 'std_001', type: 'earn', label: 'Darsga qatnashish', amount: 10, date: '2026-07-17T09:00:00Z' },
  { id: 't2', studentId: 'std_001', type: 'earn', label: 'Uy vazifasini vaqtida topshirish', amount: 15, date: '2026-07-16T14:20:00Z' },
  { id: 't3', studentId: 'std_001', type: 'spend', label: "Hudi (sticker) sotib olish", amount: -500, date: '2026-07-15T11:05:00Z' },
  { id: 't4', studentId: 'std_001', type: 'earn', label: 'Oylik test — A+ natija', amount: 50, date: '2026-07-14T08:30:00Z' },
  { id: 't5', studentId: 'std_001', type: 'earn', label: "Do'stingizni taklif qilish", amount: 30, date: '2026-07-10T17:45:00Z' },
];

// ---------------------------------------------------------
// MAHSULOTLAR (Ombor / Do'kon)
// API strukturasi: rasm — qat'iy `imageUrl`, narx — qat'iy `xp_cost`
// ---------------------------------------------------------
export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'UniSphera Hudi',
    xp_cost: 500,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80',
  },
  {
    id: 'p2',
    name: 'Bluetooth Quloqchin',
    xp_cost: 1200,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  },
  {
    id: 'p3',
    name: "Daftar to'plami",
    xp_cost: 150,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  },
  {
    id: 'p4',
    name: 'Termokружка',
    xp_cost: 300,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&q=80',
  },
  {
    id: 'p5',
    name: "Sertifikat + Sovg'a",
    xp_cost: 900,
    stock: 2,
    // Ataylab noto'g'ri havola — "No Image" placeholder ishlashini namoyish qilish uchun
    imageUrl: 'https://broken-link.example.com/not-found.jpg',
  },
  {
    id: 'p6',
    name: 'Powerbank 10000mAh',
    xp_cost: 800,
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  },
];

// ---------------------------------------------------------
// BUYURTMALAR (o'quvchi checkout qilganda shu yerga tushadi,
// admin "Topshirildi" tugmasi bilan statusni yopadi)
// ---------------------------------------------------------
export const MOCK_ORDERS = [
  {
    id: 'ord_1',
    studentId: 'std_002',
    studentName: 'Sardor Aliyev',
    items: [{ productId: 'p3', name: "Daftar to'plami", qty: 2, xp_cost: 150 }],
    totalPoints: 300,
    status: 'pending',
    createdAt: '2026-07-16T10:00:00Z',
  },
  {
    id: 'ord_2',
    studentId: 'std_004',
    studentName: 'Javlon Nazarov',
    items: [{ productId: 'p4', name: 'Termokружка', qty: 1, xp_cost: 300 }],
    totalPoints: 300,
    status: 'delivered',
    createdAt: '2026-07-12T10:00:00Z',
  },
];

// Yagona o'sib boruvchi ID generatori (mock uchun kifoya)
let idCounter = 1000;
export function nextId(prefix) {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}
