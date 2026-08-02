import { useState } from 'react';

/**
 * `imageUrl` bo'sh bo'lsa yoki yuklanmasa (404, tarmoq xatosi va h.k.),
 * soft-minimalistik "No Image" SVG placeholder avtomatik ko'rsatiladi.
 * Har qanday joyda (Store, ProductForm preview, AdminMarket, Cart) qayta ishlatiladi.
 */
const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="16" fill="#F1F5F9"/>
  <g transform="translate(58,58)">
    <rect x="0" y="0" width="84" height="66" rx="8" fill="none" stroke="#CBD5E1" stroke-width="4"/>
    <circle cx="20" cy="20" r="7" fill="#CBD5E1"/>
    <path d="M4 56 L28 34 L44 48 L62 26 L80 56 Z" fill="#E2E8F0"/>
  </g>
  <text x="100" y="150" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#94A3B8">No Image</text>
</svg>
`)}`;

export default function ProductImage({ src, alt, className = '' }) {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !src || hasError;

  return (
    <img
      src={showPlaceholder ? PLACEHOLDER_SVG : src}
      alt={alt || 'Mahsulot rasmi'}
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
