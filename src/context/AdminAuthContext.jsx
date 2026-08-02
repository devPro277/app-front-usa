import { createContext, useContext, useState, useMemo } from 'react';

const AdminAuthContext = createContext(null);

const PRIMARY_STORAGE_KEY = 'unisphera_admin_token';
const FALLBACK_STORAGE_KEY = 'token';

// TEST UCHUN MOCK MA'LUMOTLAR
const MOCK_ADMIN_CREDENTIALS = { 
  username: 'admin', 
  password: 'Admin#2026' 
};

/**
 * localStorage dan tokenni o'qish.
 */
function readStoredToken() {
  try {
    const storedPrimary = localStorage.getItem(PRIMARY_STORAGE_KEY);
    if (storedPrimary && typeof storedPrimary === 'string' && storedPrimary.length > 0) {
      return storedPrimary;
    }
    
    const storedFallback = localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (storedFallback && typeof storedFallback === 'string' && storedFallback.length > 0) {
      return storedFallback;
    }

    return null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [isLoading, setIsLoading] = useState(false);

  // isAuthenticated faqat haqiqiy token mavjud bo'lganda true
  const isAuthenticated = useMemo(() => Boolean(token) && token.length > 0, [token]);

  async function login(username, password) {
    setIsLoading(true);
    try {
      // Real tarmoq so'rovi simulyatsiyasi
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        username.trim() === MOCK_ADMIN_CREDENTIALS.username &&
        password === MOCK_ADMIN_CREDENTIALS.password
      ) {
        const fakeToken = `mock-token-${Date.now()}`;
        localStorage.setItem(PRIMARY_STORAGE_KEY, fakeToken);
        localStorage.setItem(FALLBACK_STORAGE_KEY, fakeToken);
        
        setToken(fakeToken);
        return { success: true };
      }

      // ✅ TO'G'RILANDI: Parol matndan olib tashlandi
      return { 
        success: false, 
        error: "Login yoki parol noto'g'ri!" 
      };
    } catch (err) {
      return { 
        success: false, 
        error: "Tizimga kirishda xatolik yuz berdi" 
      };
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    try {
      localStorage.removeItem(PRIMARY_STORAGE_KEY);
      localStorage.removeItem(FALLBACK_STORAGE_KEY);
    } catch (e) {
      console.error("Tokenni o'chirishda xatolik:", e);
    }
    setToken(null);
  }

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      loading: isLoading,
      login, 
      logout, 
      token 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth faqat AdminAuthProvider ichida ishlatilishi kerak');
  }
  return ctx;
}