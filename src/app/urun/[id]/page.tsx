// ÜRÜN DETAY SAYFASI — dinamik rota: /urun/[id]
// [id] klasör adı URL'deki değeri params.id olarak verir.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next 15+: params bir Promise — await etmek zorunlu
  const { id } = await params;
  const productId = Number(id);

  // Geçersiz id (örn. /urun/abc) → Number("abc") = NaN
  if (Number.isNaN(productId)) notFound();

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) notFound(); // 404 sayfası göster

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/" className="mb-4 inline-block text-sm text-neutral-500 hover:underline">
        ← Ürünlere dön
      </Link>
      <div className="flex h-64 items-center justify-center rounded-lg bg-neutral-100 text-7xl dark:bg-neutral-800">
        {product.emoji}
      </div>
      <h1 className="mt-6 text-3xl font-bold">{product.name}</h1>
      <p className="mt-2 text-2xl font-bold text-blue-600">{formatPrice(product.priceCents)}</p>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">{product.description}</p>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Stok: {product.stock} adet</p>
      <div className="mt-6">
        {product.stock > 0 ? (
          <AddToCartButton productId={product.id} />
        ) : (
          <span className="font-medium text-red-500">Bu ürün tükendi</span>
        )}
      </div>
    </article>
  );
}
