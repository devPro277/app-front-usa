import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

/**
 * Savat state'i shu yerda saqlanadi, chunki savat ikonchasi
 * (badge bilan) sahifa headerida, savat mazmuni esa Bottom Sheet'da —
 * ikkalasi ham bir xil state'ga muhtoj.
 *
 * Har bir item: { productId, name, price, image, qty, stock }
 * `stock` — shu mahsulotning ombordagi umumiy qoldig'i, buyicha
 * "+" tugmasi qancha bosilishi mumkinligini cheklaymiz.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        // Ombordagi qoldiqdan oshib ketmasligi kerak
        if (existing.qty >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          qty: 1,
        },
      ];
    });
  }

  function increment(productId) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.qty < i.stock ? { ...i, qty: i.qty + 1 } : i
      )
    );
  }

  function decrement(productId) {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function quantityOf(productId) {
    return items.find((i) => i.productId === productId)?.qty || 0;
  }

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalPoints = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  const value = {
    items,
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
    quantityOf,
    totalCount,
    totalPoints,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart faqat CartProvider ichida ishlatilishi kerak');
  return ctx;
}
