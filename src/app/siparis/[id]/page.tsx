// SİPARİŞ DETAY SAYFASI — /siparis/[id]
// Siparişin kalemleri ve toplamı. Snapshot fiyatlardan gösterim.
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
      items: { include: { product: { select: { name: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <article className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <div className="text-5xl mb-2">✅</div>
        <h1 className="text-2xl font-bold">Siparişin alındı!</h1>
        <p className="text-neutral-500">Sipariş No: #{order.id}</p>
      </div>

      <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <span>
              {item.product.name} <span className="text-neutral-500">× {item.quantity}</span>
            </span>
            <span className="font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 font-bold dark:border-neutral-800">
          <span>Toplam</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
        <p className="mt-2 text-xs text-neutral-400">Durum: {order.status}</p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Alışverişe devam et
        </Link>
      </div>
    </article>
  );
}
