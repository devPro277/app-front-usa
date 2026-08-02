import { NavLink } from 'react-router-dom';
import { hapticImpact } from '../../services/telegram';

const TABS = [
  { to: '/', label: 'Bosh sahifa', icon: HomeIcon, end: true },
  { to: '/profile', label: 'Profil', icon: UserIcon },
  { to: '/store', label: "Do'kon", icon: StoreIcon },
];

export default function BottomNav() {
  const handleTabClick = () => {
    // Brauzerda xatolik bermasligi uchun xavfsiz chaqiruv:
    if (typeof hapticImpact === 'function') {
      try {
        hapticImpact('light');
      } catch (e) {
        // Telegram muhiti bo'lmasa e'tiborsiz qoldiramiz
      }
    }
  };

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              onClick={handleTabClick}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition-all"
            >
              {({ isActive }) => {
                const activeClass = isActive
                  ? 'text-orange-500 dark:text-orange-400 font-semibold'
                  : 'text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200';

                return (
                  <>
                    <Icon className={`transition-colors ${activeClass}`} />
                    <span className={`text-[11px] transition-colors ${activeClass}`}>
                      {tab.label}
                    </span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ className }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon({ className }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 9h17l-.7 3.5a2 2 0 0 1-2 1.6H6.2a2 2 0 0 1-2-1.6L3.5 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 14v5.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}