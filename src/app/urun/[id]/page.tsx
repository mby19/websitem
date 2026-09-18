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
      <Link href="/" className="inline-block font-mono text-sm text-neutral-400 hover:text-neutral-300">
        ← vitrin
      </Link>

      <div className="mt-4 rounded-md bg-neutral-950">
        <div className="flex h-64 items-center justify-center text-8xl">{product.emoji}</div>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="font-mono text-2xl font-bold text-amber">{formatPrice(product.priceCents)}</p>
      </div>
      <p className="mt-3 text-neutral-400">{product.description}</p>
      <p className="mt-2 font-mono text-sm text-neutral-400">
        stok: {product.stock} adet
      </p>
      <div className="mt-6">
        {product.stock > 0 ? (
          <AddToCartButton productId={product.id} />
        ) : (
          <span className="font-medium text-diff-del">Bu ürün tükendi</span>
        )}
      </div>
    </article>
  );
}
