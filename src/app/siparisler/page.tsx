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
      <h1 className="mb-6 text-2xl font-bold">Siparişlerim</h1>
      {orderIds.length === 0 ? (
        <p className="text-neutral-500">
          Henüz siparişin yok. <Link href="/" className="text-blue-600 hover:underline">Ürünlere git</Link>
        </p>
      ) : (
        <ul className="space-y-2">
          {orderIds.map((id) => (
            <li key={id}>
              <Link href={`/siparis/${id}`} className="text-blue-600 hover:underline">
                Sipariş #{id}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
