# UniSphera Academy — Frontend (Telegram WebApp + Admin panel)

Bitta Vite + React + Tailwind repository ichida ikkita interfeys:
- **O'quvchilar** uchun Telegram Mini App (`/`, `/profile`, `/store`)
- **Admin** uchun boshqaruv paneli (`/admin`, `/admin/dashboard`, `/admin/groups`, `/admin/students`, `/admin/market`)

Hozircha real backend yo'q — barcha ma'lumotlar `src/services/mockDatabase.js`
ichida saqlanadi va ikkala interfeys ham shu yagona manbadan foydalanadi
(masalan, o'quvchi do'kondan xarid qilsa, bu darhol admin'ning
"Buyurtmalar" ro'yxatida ko'rinadi).

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build     # production build -> dist/
```

Admin panelga kirish uchun mock hisob: **login: `admin`, parol: `12345`**
(`src/context/AdminAuthContext.jsx` ichida).

## Marshrutlash xaritasi

| Yo'l | Kim uchun | Tavsif |
|---|---|---|
| `/` | O'quvchi | Bosh sahifa — XP progress ring, tranzaksiyalar tarixi |
| `/profile` | O'quvchi | Profil, QR orqali davomat, guruh reytingi (TOP-10) |
| `/store` | O'quvchi | Do'kon, savat (cart), checkout |
| `/admin` | Hammaga ochiq | Faqat login/parol formasi |
| `/admin/dashboard` | Faqat login qilgan admin | Umumiy statistika |
| `/admin/groups` | Faqat login qilgan admin | Ustozlar (Edit/Delete) + Guruhlar (accordion) |
| `/admin/students` | Faqat login qilgan admin | Qidiruv, filtr, Ball boshqarish, Chetlashtirish |
| `/admin/market` | Faqat login qilgan admin | Tovarlar + Buyurtmalar (Kutilmoqda/Topshirildi) |

`/admin/*` ichki sahifalari `ProtectedRoute` orqali himoyalangan — token
`localStorage`da yo'q bo'lsa, avtomatik `/admin`ga qaytaradi.

## Papka strukturasi

```
src/
├── App.jsx                    # Butun routing daraxti shu yerda
├── main.jsx                   # BrowserRouter shu yerda ulanadi
├── context/
│   ├── CartContext.jsx        # O'quvchi savati (faqat Store sahifasida)
│   ├── AdminAuthContext.jsx   # Admin login holati (localStorage)
│   └── ThemeContext.jsx       # Kun/Tun rejimi (localStorage)
├── layouts/
│   ├── StudentLayout.jsx      # CartProvider + BottomNav + Telegram init
│   └── AdminLayout.jsx        # Sidebar + ThemeToggle
├── services/
│   ├── mockDatabase.js        # ⭐ YAGONA mock "baza" — teachers/groups/students/products/orders
│   ├── api.js                 # O'quvchi tomoni funksiyalari
│   ├── adminApi.js            # Admin tomoni funksiyalari
│   └── telegram.js            # Telegram WebApp SDK wrapper
├── components/
│   ├── student/                # BottomNav, ProductCard, CartSheet, ProgressRing...
│   ├── admin/                  # Sidebar, Modal, ConfirmDialog, TeacherForm, GroupForm...
│   └── ThemeToggle.jsx
└── pages/
    ├── student/                # Dashboard, Profile, Store
    └── admin/                  # AdminLogin, AdminDashboard, AdminGroups, AdminStudents, AdminMarket
```

## Dizayn tizimi (60-30-10)

- **60%** — oq/och kulrang fon (kun), `slate-900/800` (tun)
- **30%** — `brand` (`#1B365D`) — sarlavha, matn, sidebar, konturlar
- **10%** — `accent` (`#F97316`) — faqat CTA tugmalar, badge, muhim statuslar

Kun/Tun almashtirish `ThemeContext` orqali `<html class="dark">` ni
boshqaradi, `tailwind.config.js`da `darkMode: 'class'` sozlangan.

## Backend ulanganda nima o'zgaradi

Faqat ikkita fayl:
- **`src/services/api.js`** — o'quvchi tomoni (profil, do'kon, checkout, QR)
- **`src/services/adminApi.js`** — admin tomoni (teachers, groups, students, market, orders)

Ikkalasida ham har bir funksiya ichidagi mock qismini real `fetch(...)`
so'roviga almashtirish kifoya — komponentlarga tegilmaydi.
`src/services/mockDatabase.js` esa butunlay olib tashlanadi.

`AdminAuthContext.jsx`dagi login tekshiruvi ham backend ulanganda
`POST /api/admin/login` so'roviga almashadi (struktura shunga tayyor).

## Muhim UX qoidalari (joriy implementatsiya)

- Do'konda "Savatga qo'shish" tugmasi ombor tugagan yoki balans
  yetarli bo'lmaganda avtomatik `disabled` bo'ladi va sabab matnda ko'rinadi.
- Savat (Bottom Sheet) tashqarisiga bosilganda yoki "✕" tugmasi bilan yopiladi.
- O'quvchi "Tizimdan chetlashtirish"da bazadan o'chmaydi — faqat
  `status: 'inactive'` bo'lib, jadvalda xiralashgan holatda ko'rinadi.
- Ustozni o'chirishda unga bog'liq guruhlar haqida ogohlantirish chiqadi
  va guruhlar "Ustozsiz qoldi" holatiga o'tadi (o'chmaydi).

UNISPHERE_LESSON_102_SECRET"# app-front-usa" 
