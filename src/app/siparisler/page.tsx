"use client";
// SİPARİŞ GEÇMİŞİ — misafir versiyonu.
// Sipariş id'leri localStorage'da tutulur ("websitem:orders").
// Kullanıcı girişi geldikçe bunlar userId'ye bağlanacak.
import { useEffect, useState } from "react";
import Link from "next/link";

const ORDERS_KEY = "websitem:orders";

export default function OrdersPage() {
  const [orderIds, setOrderIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) setOrderIds(JSON.parse(raw) as number[]);
    } catch {
      // bozuk kayıt: sessizce boş liste
    }
  }, []);

  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">orders</h1>
      <p className="mb-6 font-mono text-sm text-neutral-400">
        misafir siparişleri yalnızca bu cihazda saklanır; hesapla kalıcı olur.
      </p>
      {orderIds.length === 0 ? (
        <div className="rounded-md bg-neutral-900/60 p-6 text-center">
          <p className="text-neutral-400 mb-3 font-mono text-sm">transcript boş — henüz sipariş yok</p>
          <Link
            href="/"
            className="inline-block rounded bg-amber px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-soft"
          >
            alışverişe başla
          </Link>
        </div>
      ) : (
        <div className="rounded-md bg-neutral-950 p-4 font-mono text-sm leading-relaxed">
          {orderIds.map((id) => (
            <p key={id}>
              <span className="text-amber">▸</span>{" "}
              <Link href={`/siparis/${id}`} className="text-amber-soft hover:underline">
                order #{id}
              </Link>
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
