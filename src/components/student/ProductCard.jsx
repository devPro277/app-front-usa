import ProductImage from '../ProductImage';

/**
 * Do'kon kartochkasi — to'g'ridan-to'g'ri xarid modeli.
 * - Omborda yo'q bo'lsa: soft-badge + tugma disabled
 * - Balans yetarli bo'lmasa: tugma FAOL qoladi, bosilganda
 *   ota komponent (Store.jsx) soft-red toast ko'rsatadi
 */
export default function ProductCard({ product, onPurchase, isPurchasing }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="relative h-28 w-full bg-gray-50 dark:bg-slate-900">
        <ProductImage src={product.imageUrl} alt={product.name} className="h-full w-full" />
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-gray-500 shadow-card dark:bg-slate-900/95 dark:text-slate-300">
            Omborda yo'q
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-brand dark:text-white">{product.name}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-base font-bold text-orange-500">{product.xp_cost} XP</span>
          <span className="text-[11px] text-gray-400 dark:text-slate-400">{product.stock} dona</span>
        </div>

        <button
          onClick={() => onPurchase(product)}
          disabled={outOfStock || isPurchasing}
          className={`mt-3 w-full rounded-xl py-2 text-xs font-semibold transition-colors ${
            outOfStock
              ? 'cursor-not-allowed bg-gray-50 text-gray-300 dark:bg-slate-900 dark:text-slate-600'
              : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60'
          }`}
        >
          {outOfStock ? "Omborda yo'q" : isPurchasing ? 'Yuborilmoqda...' : 'Sotib olish'}
        </button>
      </div>
    </div>
  );
}
