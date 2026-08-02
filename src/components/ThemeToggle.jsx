import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  let context;

  // ThemeProvider ichida bo'lmasa ilova synib qolmasligi uchun try-catch
  try {
    context = useTheme();
  } catch (e) {
    console.warn("ThemeToggle: ThemeProvider topilmadi.");
    return null; // Context bo'lmasa component ko'rinmaydi
  }

  const { theme, toggleTheme } = context;
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Kun rejimiga o'tish" : "Tun rejimiga o'tish"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-brand transition-colors dark:border-slate-700 dark:text-white ${className}`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}