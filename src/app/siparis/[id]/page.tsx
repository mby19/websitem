// SİPARİŞ DETAY SAYFASI — /siparis/[id]
// Transcript dilinde: sipariş bir commit kaydı gibi okunur.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (Number.isNaN(orderId)) notFound();

  // Sipariş + kalemler + her kalemin ürünü (nested include)
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { name: true, emoji: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <article className="mx-auto max-w-lg">
      <div className="mb-6 font-mono">
        <p className="text-sm text-neutral-500">
          <span className="text-amber">▸</span> order <span className="text-amber-soft">#{order.id}</span>
        </p>
        <h1 className="mt-1 font-sans text-2xl font-bold">Siparişin alındı</h1>
      </div>

      <div className="rounded-md bg-neutral-950 p-4 font-mono text-sm leading-relaxed">
        {order.items.map((item) => (
          <p key={item.id}>
            <span className="text-diff-add">+</span>{" "}
            <span className="text-neutral-300">
              {item.product.emoji} {item.product.name}
            </span>{" "}
            <span className="text-neutral-400">× {item.quantity}</span>{" "}
            <span className="text-neutral-400">{formatPrice(item.priceCents * item.quantity)}</span>
          </p>
        ))}
        <p className="mt-3 border-t border-neutral-900 pt-3 font-sans text-base font-bold">
          <span className="font-mono text-xs font-normal text-neutral-400">TOPLAM </span>
          {formatPrice(order.totalCents)}
        </p>
        <p className="mt-2 text-xs text-diff-add">
          <span className="text-neutral-400">status: </span>{order.status}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="font-mono text-sm text-neutral-400 hover:text-neutral-300">
          ← vitrin
        </Link>
      </div>
    </article>
  );
}
