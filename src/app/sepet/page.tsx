"use client";
// SEPET SAYFASI — client component çünkü cart context'i okuyup değiştiriyor.
// Ürün bilgilerini (fiyat, ad) context'te tutmuyoruz: sadece productId + adet.
// Ürün detayları veritabanından gelir; burada sunucuya bilgileri sorarız.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

// DB'den gelen ürün bilgisi (API yanıtı ile aynı alanlar)
type ProductInfo = {
  id: number;
  name: string;
  priceCents: number;
  stock: number;
  emoji: string;
};

export default function CartPage() {
  const { lines, setQuantity, remove, clear } = useCart();
  const [products, setProducts] = useState<Map<number, ProductInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  // Checkout durumu: bekliyor / hata mesajı (buton çift tık koruması dahil)
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Checkout: sepeti siparişe çeviren API çağrısı
  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Ödeme sırasında hata oluştu");
        return;
      }
      const { orderId } = (await res.json()) as { orderId: number };
      // Sipariş geçmişi listesine ekle (yeni en başta)
      const raw = localStorage.getItem("websitem:orders");
      const ids = raw ? (JSON.parse(raw) as number[]) : [];
      localStorage.setItem("websitem:orders", JSON.stringify([orderId, ...ids]));
      // Sepeti boşalt, teşekkür sayfasına git
      clear();
      window.location.href = `/siparis/${orderId}`;
    } finally {
      setCheckingOut(false);
    }
  }

  // Sepet değişince eksik ürün bilgilerini tek istekte getir
  useEffect(() => {
    if (lines.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${lines.map((l) => l.productId).join(",")}`)
      .then((r) => r.json())
      .then((data: ProductInfo[]) => {
        setProducts(new Map(data.map((p) => [p.id, p])));
      })
      .finally(() => setLoading(false));
  }, [lines.map((l) => l.productId).join(",")]); // string anahtar: sadece id listesi değişince yeniden çek

  if (loading && lines.length > 0) {
    return <p className="text-neutral-500">Sepet yükleniyor…</p>;
  }

  if (lines.length === 0) {
    return (
      <section className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Sepetin boş</h1>
        <p className="text-neutral-500 mb-4">Ürünlere göz atarak başla.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          → Ürünlere git
        </Link>
      </section>
    );
  }

  const total = lines.reduce((sum, l) => sum + (products.get(l.productId)?.priceCents ?? 0) * l.quantity, 0);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Sepetin ({lines.length} kalem)</h1>
      <div className="space-y-3">
        {lines.map((line) => {
          const product = products.get(line.productId);
          if (!product) return null; // DB'de artık yoksa çizme
          return (
            <div
              key={line.productId}
              className="flex items-center gap-4 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-neutral-100 text-2xl dark:bg-neutral-800">
                {product.emoji}
              </div>
              <div className="flex-1">
                <Link href={`/urun/${line.productId}`} className="font-semibold hover:underline">
                  {product.name}
                </Link>
                <p className="text-sm text-neutral-500">{formatPrice(product.priceCents)} / adet</p>
              </div>
              {/* Adet seçici: - [adet] + */}
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  aria-label="Azalt"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{line.quantity}</span>
                <button
                  className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  aria-label="Artır"
                >
                  +
                </button>
              </div>
              <span className="w-24 text-right font-bold">{formatPrice(product.priceCents * line.quantity)}</span>
              <button className="text-neutral-400 hover:text-red-500" onClick={() => remove(line.productId)} aria-label="Kaldır">
                ✕
              </button>
            </div>
          );
        })}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={clear}>
            Sepeti Boşalt
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-1.5 font-medium text-white hover:bg-blue-700 disabled:bg-neutral-400"
            onClick={checkout}
            disabled={checkingOut}
          >
            {checkingOut ? "İşleniyor…" : "Ödemeye Geç"}
          </button>
        </div>
      </div>
    </section>
  );
}
