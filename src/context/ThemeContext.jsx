import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'unisphera_theme';

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;

    // Telegram Mini App mavzusini tekshirish (agar saqlangan sozlama bo'lmasa)
    if (window.Telegram?.WebApp?.colorScheme) {
      return window.Telegram.WebApp.colorScheme === 'dark' ? 'dark' : 'light';
    }
  } catch {
    /* localStorage mavjud emas — sukut bo'yicha kun rejimi */
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';

    // 1. HTML tagiga klassni qo'shish yoki olib tashlash
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Telegram Mini App sarlavhasi (Header) va fonini moslashtirish
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        const headerColor = isDark ? '#0f172a' : '#ffffff'; // dark: bg-slate-900, light: bg-white
        const bgColor = isDark ? '#020617' : '#f8fafc';     // dark: bg-slate-950, light: bg-slate-50

        if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor(headerColor);
        if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor(bgColor);
      } catch (e) {
        // Brauzerda xatolik bermasligi uchun
      }
    }

    // 3. LocalStorage-ga saqlash
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* saqlab bo'lmasa ham ilova ishlashda davom etadi */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme faqat ThemeProvider ichida ishlatilishi kerak');
  return ctx;
}