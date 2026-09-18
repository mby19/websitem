// ÜRÜN LİSTELEME SAYFASI — Server Component.
// Veritabanı sorgusu SUNUCUDA çalışır; tarayıcıya sadece HTML gider. (SSR avantajı)
import Link from "next/link";
import { db } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

// revalidate = 0: her istekte taze veri (dev sırasında doğru davranış için)
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <section>
      <h1 className="text-2xl font-bold">Ürünler</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500">
        Çalışan bir demo mağaza — sepet, stok ve checkout akışlarını gerçek zamanlı deneyebilirsiniz.
        Ödeme test modundadır, ücret alınmaz.
      </p>
      {products.length === 0 ? (
        <p className="text-neutral-500">Mağaza henüz hazırlanıyor — birazdan geri gelin.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            // Her ürün bir kart; detay sayfasına /urun/[id] linki
            <div
              key={product.id}
              className="flex flex-col rounded-lg border border-neutral-200 p-4 transition-shadow hover:shadow-md dark:border-neutral-800"
            >
              <Link href={`/urun/${product.id}`} className="mb-2 block">
                {/* Placeholder alan: ürün-başına emoji, kartları ayırt eder */}
                <div className="flex h-36 items-center justify-center rounded bg-neutral-100 text-4xl dark:bg-neutral-800">
                  {product.emoji}
                </div>
                <h2 className="mt-3 font-semibold">{product.name}</h2>
              </Link>
              <p className="mb-3 line-clamp-2 flex-1 text-sm text-neutral-500 dark:text-neutral-400">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{formatPrice(product.priceCents)}</span>
                {/* Stok yoksa buton devre dışı */}
                {product.stock > 0 ? (
                  <AddToCartButton productId={product.id} />
                ) : (
                  <span className="text-sm text-red-500">Tükendi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
