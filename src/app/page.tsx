// ANA SAYFA — Persuade yüzeyi: mağazanın kanıt katmanı + vitrin.
// İlk viewport: teori (mağaza tanıtımı) + canlı transcript (gerçek DB verisi).
// Altında ürün vitrini. "Kutu yok": derinlik zemin tonu adımlarıyla.
import Link from "next/link";
import { db } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Transcript } from "@/components/transcript";
import type { TranscriptLine } from "@/components/transcript";

// revalidate = 0: her istekte taze veri — transcript canlı kalmalı
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await db.product.findMany({ orderBy: { createdAt: "asc" } });

  // İlk viewport'un kanıtı: gerçek son siparişler (server'dan al, hydration'a hazır)
  const recentOrders = await db.order.findMany({
    where: { status: "PAID" },
    orderBy: { id: "desc" },
    take: 6,
    include: {
      items: { include: { product: { select: { name: true, emoji: true } } } },
    },
  });
  const initialTranscript: TranscriptLine[] = recentOrders.map((order) => ({
    id: order.id,
    totalCents: order.totalCents,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    firstName: order.items[0]?.product.name ?? "ürün",
    at: order.createdAt.toISOString().slice(11, 16),
  }));

  return (
    <div className="space-y-16">
      {/* ─── İLK VIEWPORT: mağaza tanıtımı ─── */}
      <section className="pt-4">
        <p className="font-mono text-sm text-neutral-400">
          websitem<span className="text-neutral-700">/</span>main{" "}
          <span className="text-amber">· canlı</span>
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Her sipariş, kayda geçen
          <br />
          bir işlem<span className="text-amber">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-neutral-400">
          Bu mağaza gerçekten çalışıyor: sepet, stok kontrolü ve checkout bir
          transaction ile işleniyor; fiyat asla istemciden gelmez. Aşağıdaki
          transcript, veritabanından gelen gerçek siparişler.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <a
            href="#vitrin"
            className="rounded bg-amber px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-soft"
          >
            Mağazayı dene
          </a>
          <span className="font-mono text-xs text-neutral-400">
            postgres<span className="text-neutral-700"> · </span>transactional
          </span>
        </div>

        {/* Kanıt: canlı checkout transcript'i */}
        <div className="mt-8">
          <Transcript initial={initialTranscript} />
        </div>
      </section>

      {/* ─── VİTRİN ─── */}
      <section id="vitrin" className="scroll-mt-20">
        <h2 className="text-xl font-bold">Vitrin</h2>
        {products.length === 0 ? (
          <p className="mt-2 text-neutral-400">Mağaza henüz hazırlanıyor — birazdan geri gelin.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-md bg-neutral-900/60 p-4 transition-colors hover:bg-neutral-900"
              >
                <Link href={`/urun/${product.id}`} className="mb-2 block">
                  <div className="flex h-36 items-center justify-center rounded bg-neutral-950 text-6xl">
                    {product.emoji}
                  </div>
                  <h3 className="mt-3 font-semibold">{product.name}</h3>
                </Link>
                <p className="mb-3 line-clamp-2 flex-1 text-sm text-neutral-400">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium">
                    {formatPrice(product.priceCents)}
                  </span>
                  {product.stock > 0 ? (
                    <AddToCartButton productId={product.id} />
                  ) : (
                    <span className="text-sm text-diff-del">Tükendi</span>
                  )}
                </div>
                {product.stock > 0 && product.stock <= 2 && (
                  <p className="mt-1 text-right text-xs font-mono text-neutral-400">
                    Son {product.stock}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
