"use client";
// Sepet sayısını gösteren küçük rozet. "use client" çünkü CartProvider state'ini okur.
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{totalItems}</span>;
}
