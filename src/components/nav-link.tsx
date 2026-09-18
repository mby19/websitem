"use client";
// NAV LİNK — aktif sayfada gri alt çizgi gösteren nav öğesi.
// (Mavi nav'da kullanılmaz: Fiyat Etiketi Kuralı — mavi yalnız satın alma yolunda.)
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  // "/urun/3" gibi alt yollar da "/urun"ün aktif hali sayılır
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        // Aktif: amber nokta + ivory metin; pasif: gri. Kutu yok — alt çizgi bile yok.
        "transition-colors " +
        (active
          ? "text-foreground"
          : "text-neutral-500 hover:text-neutral-300")
      }
    >
      <span className="mr-0.5 inline-block h-1.5 w-1.5 align-middle">
        {active ? <span className="block h-1.5 w-1.5 rounded-full bg-amber" /> : null}
      </span>
      {children}
    </Link>
  );
}
