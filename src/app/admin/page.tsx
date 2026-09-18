// ADMIN SAYFASI — Operate yüzeyi: ürün CRUD + sipariş listesi.
// Guard: isAdmin() değilse sessizce notFound (sayfa varlığı gizlenir).
// Form akışı: Server Actions (actions.ts) — sayfa yenilenmeden revalidatePath.
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { createProductAction, updateProductAction, deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

// TL girişinin input'a yazılabilir hali (kuruş → "1299.90")
const toTL = (cents: number) => (cents / 100).toFixed(2);

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  if (!(await isAdmin())) redirect("/giris");
  const { ok, err } = await searchParams;

  const [products, orders] = await Promise.all([
    db.product.findMany({ orderBy: { id: "asc" } }),
    db.order.findMany({
      orderBy: { id: "desc" },
      take: 10,
      include: { items: { include: { product: { select: { name: true, emoji: true } } } } },
    }),
  ]);

  return (
    <section className="space-y-12">
      <header>
        <p className="font-mono text-sm text-neutral-400">
          websitem<span className="text-neutral-700">/</span>admin
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Yönetim paneli<span className="text-amber">.</span>
        </h1>
        <p className="mt-2 text-neutral-400">
          Ürün CRUD ve sipariş kayıtları. Her değişiklik anında vitrine yansır.
        </p>
        {ok && <p className="mt-3 font-mono text-sm text-diff-add">✓ {ok}</p>}
        {err && <p className="mt-3 font-mono text-sm text-diff-del">✕ {err}</p>}
      </header>

      {/* ─── YENİ ÜRÜN ─── */}
      <div className="rounded-md bg-neutral-900/60 p-4">
        <h2 className="font-mono text-sm text-amber">+ yeni ürün</h2>
        <form action={createProductAction} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_auto_auto_auto]">
          <input name="name" placeholder="Ürün adı" required className="rounded bg-neutral-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber" />
          <input name="description" placeholder="Açıklama" className="rounded bg-neutral-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber sm:col-span-1" />
          <input name="emoji" placeholder="📦" defaultValue="📦" maxLength={4} className="w-20 rounded bg-neutral-950 px-3 py-2 text-center text-sm outline-none focus:ring-2 focus:ring-amber" />
          <input name="price" inputMode="decimal" placeholder="Fiyat TL" required className="w-28 rounded bg-neutral-950 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-amber" />
          <input name="stock" inputMode="numeric" placeholder="Stok" required className="w-20 rounded bg-neutral-950 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-amber" />
          <button type="submit" className="rounded bg-amber px-4 py-2 font-mono text-sm font-medium text-neutral-950 hover:bg-amber-soft sm:col-span-1 sm:w-auto">
            oluştur
          </button>
        </form>
      </div>

      {/* ─── ÜRÜNLER ─── */}
      <div>
        <h2 className="mb-3 text-xl font-bold">
          Ürünler <span className="font-mono text-base text-neutral-500">({products.length})</span>
        </h2>
        <div className="space-y-3">
          {products.map((product) => (
            <form
              key={product.id}
              action={updateProductAction}
              className="grid grid-cols-1 items-center gap-2 rounded-md bg-neutral-900/60 p-3 sm:grid-cols-[auto_1fr_1fr_auto_auto_auto]"
            >
              <input type="hidden" name="id" value={product.id} />
              <span className="font-mono text-xs text-neutral-500">#{product.id}</span>
              <input name="name" defaultValue={product.name} className="rounded bg-neutral-950 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-amber" />
              <input name="description" defaultValue={product.description} className="rounded bg-neutral-950 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-amber" />
              <div className="flex gap-2">
                <input name="emoji" defaultValue={product.emoji} maxLength={4} className="w-14 rounded bg-neutral-950 px-2 py-1.5 text-center text-sm outline-none focus:ring-2 focus:ring-amber" />
                <input name="price" inputMode="decimal" defaultValue={toTL(product.priceCents)} className="w-24 rounded bg-neutral-950 px-2 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-amber" />
                <input name="stock" type="number" min={0} defaultValue={product.stock} className="w-20 rounded bg-neutral-950 px-2 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-amber" />
              </div>
              <button type="submit" className="rounded bg-neutral-800 px-3 py-1.5 font-mono text-xs hover:bg-neutral-700">
                kaydet
              </button>
              <button
                type="submit"
                name="intent"
                value="delete"
                formAction={deleteProductAction}
                className="rounded px-3 py-1.5 font-mono text-xs text-neutral-500 hover:text-diff-del"
              >
                sil
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* ─── SİPARİŞLER ─── */}
      <div>
        <h2 className="mb-3 text-xl font-bold">
          Son siparişler <span className="font-mono text-base text-neutral-500">(10)</span>
        </h2>
        {orders.length === 0 ? (
          <p className="font-mono text-sm text-neutral-400">transcript boş — henüz sipariş yok</p>
        ) : (
          <div className="rounded-md bg-neutral-950 p-4 font-mono text-sm leading-relaxed">
            {orders.map((order) => (
              <p key={order.id}>
                <span className="text-amber">▸</span>{" "}
                <span className="text-amber-soft">order #{order.id}</span>{" "}
                <span className="text-neutral-400">·</span>{" "}
                <span className="text-neutral-400">
                  {order.items.map((item) => `${item.product.emoji}×${item.quantity}`).join(" ")}
                </span>{" "}
                <span className="text-neutral-400">·</span>{" "}
                <span className="text-foreground">{formatPrice(order.totalCents)}</span>{" "}
                {order.status === "PAID" ? (
                  <span className="text-diff-add">{order.status}</span>
                ) : (
                  <span className="text-amber">{order.status}</span>
                )}
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="font-mono text-xs text-neutral-400">
        <Link href="/" className="hover:text-neutral-300">← vitrin</Link>
      </p>
    </section>
  );
}
