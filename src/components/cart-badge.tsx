"use client";
// Sepet sayısını gösteren küçük rozet. "use client" çünkü CartProvider state'ini okur.
// Pulse: her adet değişiminde kısa bir nabız — "ekledim" peak anını taçlandırır.
// min-w: 0→1 geçişinde header kaymasın (CLS yok).
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    // key: totalItems her değiştiğinde element yeniden mount olur → animasyon yeniden oynar
    <span
      key={totalItems}
      className="inline-block min-w-5 rounded-full bg-amber px-2 py-0.5 text-center text-xs font-mono text-neutral-950 animate-[badge-pulse_0.3s_ease-out]"
    >
      {totalItems}
    </span>
  );
}
