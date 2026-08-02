/**
 * Telegram WebApp SDK atrofidagi yupqa wrapper.
 * Bu qatlam tufayli qolgan kod hech qachon to'g'ridan-to'g'ri
 * `window.Telegram` bilan ishlamaydi — brauzerda (SDK yo'q joyda)
 * ham ilova xatosiz ishlayveradi (mock rejim).
 */

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

export const isTelegramEnv = Boolean(tg);

/** Ilovani to'liq ekranga kengaytirish va tayyor ekanini bildirish */
export function initTelegramApp() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('#0F1216');
  tg.setBackgroundColor?.('#0F1216');
  tg.disableVerticalSwipes?.();
}

/** Telegram foydalanuvchisi haqida ma'lumot (ism, familiya, username) */
export function getTelegramUser() {
  const user = tg?.initDataUnsafe?.user;
  if (!user) {
    // Brauzerda test qilish uchun mock foydalanuvchi
    return { first_name: 'Islombek', last_name: '', username: 'demo_user' };
  }
  return user;
}

/** Telegram mavzu ranglarini CSS custom property sifatida qo'llash */
export function applyTelegramTheme() {
  if (!tg?.themeParams) return;
  const root = document.documentElement;
  const params = tg.themeParams;
  Object.entries(params).forEach(([key, value]) => {
    root.style.setProperty(`--tg-${key.replace(/_/g, '-')}`, value);
  });
}

/**
 * Universal QR-kod skanerini ochish.
 * onSuccess(text) — o'qilgan QR matni bilan chaqiriladi.
 */
export function scanQrCode({ text = 'Xona QR-kodini skanerlang', onSuccess, onError }) {
  if (!tg?.showScanQrPopup) {
    onError?.(new Error('Telegram muhitida emassiz — QR skanerlash faqat Telegram ilovasida ishlaydi.'));
    return;
  }
  tg.showScanQrPopup({ text }, (qrText) => {
    if (qrText) {
      onSuccess?.(qrText);
      tg.closeScanQrPopup();
      return true; // popup yopilishini bildiradi
    }
    return false;
  });
  tg.onEvent?.('scanQrPopupClosed', () => {});
}

/** Tugma bosilganda yengil vibratsiya (haptic feedback) */
export function hapticImpact(style = 'light') {
  tg?.HapticFeedback?.impactOccurred?.(style);
}

export function hapticNotification(type = 'success') {
  tg?.HapticFeedback?.notificationOccurred?.(type);
}

export function showAlert(message) {
  if (tg?.showAlert) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}
