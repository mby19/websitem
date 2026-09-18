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
    return <p className="font-mono text-sm text-neutral-400">sepet yükleniyor…</p>;
  }

  if (lines.length === 0) {
    return (
      <section className="py-12 text-center">
        <h1 className="mb-2 text-2xl font-bold">Sepetin boş</h1>
        <p className="mb-4 text-neutral-400">Ürünlere göz atarak başla.</p>
        <Link
          href="/"
          className="inline-block rounded bg-amber px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-soft"
        >
          → Vitrine git
        </Link>
        <p className="mt-8 font-mono text-xs text-neutral-400">
          not: misafir siparişleri yalnızca bu cihazda saklanır; hesapla kalıcı olur.
        </p>
      </section>
    );
  }

  const total = lines.reduce((sum, l) => sum + (products.get(l.productId)?.priceCents ?? 0) * l.quantity, 0);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">
        Sepet <span className="font-mono text-lg text-neutral-400">({lines.length} kalem)</span>
      </h1>
      <div className="space-y-2">
        {lines.map((line) => {
          const product = products.get(line.productId);
          if (!product) return null; // DB'de artık yoksa çizme
          return (
            <div
              key={line.productId}
              className="flex items-center gap-4 rounded-md bg-neutral-900/60 p-3 transition-colors hover:bg-neutral-900"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-neutral-950 text-2xl">
                {product.emoji}
              </div>
              <div className="flex-1">
                <Link href={`/urun/${line.productId}`} className="font-semibold hover:underline">
                  {product.name}
                </Link>
                <p className="font-mono text-sm text-neutral-400">{formatPrice(product.priceCents)} / adet</p>
              </div>
              {/* Adet seçici: − [adet] + */}
              <div className="flex items-center gap-2 font-mono">
                <button
                  className="h-8 w-8 rounded bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  aria-label="Azalt"
                >
                  −
                </button>
                <span className="w-8 text-center">{line.quantity}</span>
                <button
                  className="h-8 w-8 rounded bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  aria-label="Artır"
                >
                  +
                </button>
              </div>
              <span className="w-24 text-right font-mono font-medium">
                {formatPrice(product.priceCents * line.quantity)}
              </span>
              <button className="text-neutral-400 hover:text-diff-del" onClick={() => remove(line.productId)} aria-label="Kaldır">
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-lg">
          toplam: <strong>{formatPrice(total)}</strong>
        </span>
        <div className="flex gap-3">
          <button
            className="rounded bg-neutral-800 px-3 py-1.5 font-mono text-sm hover:bg-neutral-700"
            onClick={clear}
          >
            boşalt
          </button>
          <button
            className="rounded bg-amber px-4 py-1.5 font-mono text-sm font-medium text-neutral-950 hover:bg-amber-soft disabled:bg-neutral-800 disabled:text-neutral-500"
            onClick={checkout}
            disabled={checkingOut}
          >
            {checkingOut ? "işleniyor…" : "checkout"}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 font-mono text-sm text-diff-del">{error}</p>}
    </section>
  );
}
