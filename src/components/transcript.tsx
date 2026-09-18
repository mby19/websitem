"use client";
// CANLI TRANSCRIPT — mağazanın gerçek checkout logu.
// Ana sayfanın kanıt katmanı: Neon DB'den gerçek son siparişler,
// mono satırlarla, amber caret ile. Veri gerçek; sahte satır yok.
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

type TranscriptLine = {
  id: number;
  totalCents: number;
  itemCount: number;
  firstName: string;
  at: string;
};

export type { TranscriptLine };

export function Transcript({ initial }: { initial: TranscriptLine[] }) {
  const [lines, setLines] = useState<TranscriptLine[]>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    // Sayfa açıkken 30 sn'de bir tazele — canlı his, ucuza
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/orders/recent");
        if (res.ok) setLines((await res.json()) as TranscriptLine[]);
      } catch {
        // sessiz: transcript çevrimdışılığı göstermez, sadece eski satırlar kalır
      }
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  if (!ready && lines.length === 0) {
    return (
      <div className="rounded-md bg-neutral-900 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-5 w-64 animate-pulse rounded bg-neutral-800 mb-2" />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-md bg-neutral-900 p-4 font-mono text-sm">
        <p className="text-neutral-400">
          <span className="text-amber">▸</span> transcript boş —{" "}
          <span className="text-neutral-400">ilk siparişi sen oluşturabilirsin</span>
        </p>
        <p className="text-neutral-400 mt-1">
          <span className="caret" aria-hidden="true" />
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-neutral-900 p-4 font-mono text-sm leading-relaxed overflow-x-auto">
      {lines.map((line, i) => (
        // key: id — transcript akışı; en yeni satır üstte (detayda line-in)
        <p key={line.id} className={"pl-5 -indent-5 " + (i === 0 ? "animate-[line-in_0.3s_ease-out]" : "")}>
          <span className="text-neutral-400 select-none">{"  "}</span>
          <span className="text-amber">▸</span>{" "}
          <span className="text-neutral-400">order</span>{" "}
          <span className="text-amber-soft">#{line.id}</span>{" "}
          <span className="text-neutral-500">·</span>{" "}
          <span className="text-neutral-300">
            {line.itemCount > 1 ? `${line.firstName} +${line.itemCount - 1}` : line.firstName}
          </span>{" "}
          <span className="text-neutral-500">·</span>{" "}
          <span className="text-foreground">
            {formatPrice(line.totalCents)}
          </span>{" "}
          <span className="text-diff-add">PAID</span>{" "}
          <span className="text-neutral-400">{line.at}</span>
        </p>
      ))}
      <p className="text-amber mt-1" aria-hidden="true">
        <span className="caret" />
      </p>
    </div>
  );
}
