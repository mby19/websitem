"use client";
// SEPET CONTEXT — tüm uygulamanın paylaşacağı sepet durumu.
// React'te birden çok component'in aynı state'e erişmesi için Context kullanılır.
// localStorage ile kalıcılık sağlıyoruz: sayfa yenilense de sepet kaybolmaz.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Sepetteki tek bir satır: hangi ürün, kaç adet
export type CartLine = { productId: number; quantity: number };

// Context'in dışarıya açtığı değer ve fonksiyonlar
type CartContextValue = {
  lines: CartLine[];
  add: (productId: number, quantity?: number) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

// localStorage anahtarı — çakışma olmasın diye app adıyla önekliyoruz
const STORAGE_KEY = "websitem:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  // İlk render'da localStorage'a yazmamak için (SSR uyumu) "hydrated" bayrağı
  const [hydrated, setHydrated] = useState(false);

  // Sayfa yüklendiğinde kayıtlı sepeti oku (sadece tarayıcıda çalışır)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // Bozuk JSON → sepeti sıfırla, uygulamayı çökertme
    }
    setHydrated(true);
  }, []);

  // Sepet değişince localStorage'a yaz
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const add = (productId: number, quantity = 1) =>
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          // Ürün zaten sepette: adedini artır
          return prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l));
        }
        return [...prev, { productId, quantity }];
      });

    const remove = (productId: number) => setLines((prev) => prev.filter((l) => l.productId !== productId));

    const setQuantity = (productId: number, quantity: number) => {
      if (quantity <= 0) return remove(productId);
      setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)));
    };

    const clear = () => setLines([]);

    const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);

    return { lines, add, remove, setQuantity, clear, totalItems };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook: component'ler sepete böyle erişir.
// Provider dışında kullanılırsa anlaşılır hata verir (sessiz bug yerine).
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
