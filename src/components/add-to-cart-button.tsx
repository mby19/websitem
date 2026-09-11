"use client";
// "Sepete Ekle" butonu — client component çünkü cart context'i çağırıyor.
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ productId }: { productId: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-neutral-400"
      onClick={() => {
        add(productId);
        // Kısa "eklendi" geri bildirimi — UX detayı
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "✓ Eklendi" : "Sepete Ekle"}
    </button>
  );
}
