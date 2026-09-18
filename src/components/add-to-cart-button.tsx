"use client";
// "Sepete Ekle" butonu — client component çünkü cart context'i çağırıyor.
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ productId }: { productId: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      className="rounded bg-amber px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-amber-soft disabled:bg-neutral-800 disabled:text-neutral-500"
      onClick={() => {
        add(productId);
        // Kısa "eklendi" geri bildirimi — UX detayı
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "✓ eklendi" : "sepete ekle"}
    </button>
  );
}
